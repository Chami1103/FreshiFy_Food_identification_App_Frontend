import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface AppModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const AppModal: React.FC<AppModalProps> = ({ visible, title, onClose, children }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.body}>{children}</View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AppModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "85%",
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#111827" },
  body: { marginTop: 10 },
  closeBtn: {
    marginTop: 16,
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeText: { color: "#fff", fontWeight: "700" },
});
