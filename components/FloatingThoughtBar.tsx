import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import axios from "axios";
import { API } from "../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FloatingThoughtBar: React.FC = () => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [thought, setThought] = useState("");
  const [savedThought, setSavedThought] = useState<string | null>(null);

  // 🕕 Check if we already showed this morning
  useEffect(() => {
    (async () => {
      const lastShown = await AsyncStorage.getItem("lastMorningReminder");
      const today = new Date().toDateString();

      if (lastShown !== today) {
        const stored = await AsyncStorage.getItem("latestThought");
        if (stored) {
          setSavedThought(stored);
          await AsyncStorage.setItem("lastMorningReminder", today);
          Alert.alert("🧠 Morning Reminder", `Your last note:\n"${stored}"`);
        }
      }
    })();
  }, []);

  const handleSend = async () => {
    if (!thought.trim()) return Alert.alert("Note empty", "Write something!");
    const words = thought.trim().split(/\s+/);
    if (words.length > 30) return Alert.alert("Limit exceeded", "Max 30 words allowed.");

    try {
      await axios.post(`${API.MAIN_BASE_URL}/thoughts/add`, {
        text: thought.trim(),
        timestamp: new Date().toISOString(),
      });
      await AsyncStorage.setItem("latestThought", thought.trim());
      setSavedThought(thought.trim());
      setThought("");
      setVisible(false);
      Alert.alert("✅ Saved", "We'll remind you tomorrow morning!");
    } catch (err) {
      console.error("Thought upload failed", err);
      Alert.alert("Error", "Could not save your note. Try again later.");
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.floatingBox,
          {
            backgroundColor:
              theme === "light" ? "rgba(255,255,255,0.9)" : "rgba(30,41,59,0.7)",
          },
        ]}
        activeOpacity={0.9}
        onPress={() => setVisible(true)}
      >
        <BlurView
          intensity={90}
          tint={theme === "light" ? "light" : "dark"}
          style={styles.blur}
        >
          <Ionicons
            name="create-outline"
            size={20}
            color={theme === "light" ? "#475569" : "#e2e8f0"}
          />
          <Text
            style={[
              styles.placeholder,
              { color: theme === "light" ? "#64748b" : "#94a3b8" },
            ]}
          >
            What's on your mind?
          </Text>
        </BlurView>
      </TouchableOpacity>

      {/* Modal Input */}
      <Modal visible={visible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalWrap}
        >
          <View
            style={[
              styles.modalCard,
              { backgroundColor: theme === "light" ? "#fff" : "#1e293b" },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme === "light" ? "#0f172a" : "#f8fafc" }]}>
              Share your thought
            </Text>
            <TextInput
              value={thought}
              onChangeText={setThought}
              placeholder="Ex: Tomorrow eat fried rice 🍚"
              placeholderTextColor={theme === "light" ? "#94a3b8" : "#94a3b8"}
              multiline
              maxLength={300}
              style={[
                styles.input,
                {
                  color: theme === "light" ? "#0f172a" : "#f8fafc",
                  borderColor: theme === "light" ? "#e5e7eb" : "#475569",
                },
              ]}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={styles.closeBtn}
            >
              <Ionicons
                name="close-circle"
                size={26}
                color={theme === "light" ? "#94a3b8" : "#64748b"}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

export default FloatingThoughtBar;

const styles = StyleSheet.create({
  floatingBox: {
    position: "absolute",
    top: 85,
    alignSelf: "center",
    width: "92%",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  blur: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  placeholder: {
    fontSize: 15,
    marginLeft: 8,
    fontWeight: "500",
  },
  modalWrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "90%",
    borderRadius: 20,
    padding: 16,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    textAlignVertical: "top",
  },
  sendBtn: {
    backgroundColor: "#2563eb",
    alignSelf: "flex-end",
    marginTop: 10,
    borderRadius: 30,
    padding: 10,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
