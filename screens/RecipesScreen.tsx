import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { API } from "../config/config";
import Card from "../components/Card";
import Loader from "../components/Loader";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { Recipe } from "../types";

const RecipesScreen: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchRecipes = async (search?: string) => {
    try {
      setLoading(true);
      const res = await fetch(API.PREDICT_RECIPES || `${API.MAIN_BASE_URL}/predict-recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: search || "carrot, milk, chicken" }),
      });
      const data = await res.json();
      setRecipes(data?.recipes ?? []);
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to load recipes" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <Card style={styles.card}>
      <Text style={styles.recipeTitle}>{item.title}</Text>
      <Text style={styles.section}>🧂 Ingredients:</Text>
      {item.ingredients.map((ing, idx) => (
        <Text key={idx} style={styles.textItem}>• {ing}</Text>
      ))}
      <Text style={styles.section}>👨‍🍳 Instructions:</Text>
      {item.instructions.map((step, idx) => (
        <Text key={idx} style={styles.textItem}>{idx + 1}. {step}</Text>
      ))}
      <Text style={styles.time}>⏱ {item.prepTime}</Text>
    </Card>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TextInput
          placeholder="Search by ingredient..."
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={() => fetchRecipes(query)}>
          <Ionicons name="search" color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <Loader text="Fetching delicious recipes..." />
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipe}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Image
                source={require("../assets/animations/recipe.gif")}
                style={{ width: 120, height: 120 }}
              />
              <Text style={styles.emptyText}>No recipes found</Text>
            </View>
          }
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default RecipesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 12 },
  header: { flexDirection: "row", marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  searchBtn: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  card: { marginBottom: 12 },
  recipeTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  section: { marginTop: 8, fontWeight: "700", color: "#10b981" },
  textItem: { color: "#475569", fontSize: 13, marginTop: 2 },
  time: { marginTop: 8, color: "#2563eb", fontWeight: "600" },
  empty: { alignItems: "center", marginTop: 40 },
  emptyText: { color: "#64748b", marginTop: 8 },
});
