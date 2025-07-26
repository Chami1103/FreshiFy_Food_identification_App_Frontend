import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const recipes = [
  { id: 1, name: 'Banana Power Smoothie', ingredients: ['Bananas', 'Milk'], difficulty: 'Easy', time: '5 min', servings: 2, rating: 4.8 },
  { id: 2, name: 'Fresh Garden Salad', ingredients: ['Lettuce'], difficulty: 'Easy', time: '10 min', servings: 4, rating: 4.5 },
  { id: 3, name: 'Spicy Curry Bowl', ingredients: ['Dhal Curry'], difficulty: 'Easy', time: '2 min', servings: 1, rating: 4.7 },
];

const foodItems = [
  { name: 'Bananas', daysLeft: 3 },
  { name: 'Dhal Curry', daysLeft: 2 },
  { name: 'Milk', daysLeft: 5 },
  { name: 'Lettuce', daysLeft: 1 },
];

export default function RecipesScreen() {
  // Show recipes where any ingredient is expiring soon (daysLeft <= 2)
  const useSoonRecipes = recipes.filter(recipe =>
    recipe.ingredients.some(ing =>
      foodItems.find(item => item.name === ing && item.daysLeft <= 2)
    )
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Smart Recipes</Text>

      {/* Use Soon Recipes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="alert-triangle" size={20} color="#f59e42" style={{ marginRight: 7 }} />
          <Text style={styles.sectionTitle}>Use Soon Recipes</Text>
        </View>
        {useSoonRecipes.length === 0 ? (
          <Text style={{ color: '#94a3b8', fontSize: 15, marginTop: 10 }}>No urgent recipes right now!</Text>
        ) : useSoonRecipes.map(recipe => (
          <View key={recipe.id} style={[styles.recipeCard, { borderColor: '#f59e42' }]}>
            <View style={styles.recipeRow}>
              <Text style={styles.recipeName}>{recipe.name}</Text>
              <View style={styles.ratingTag}>
                <MaterialCommunityIcons name="star" size={16} color="#f59e42" />
                <Text style={styles.ratingText}>{recipe.rating}</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Feather name="clock" size={15} color="#64748b" />
                <Text style={styles.statText}>{recipe.time}</Text>
              </View>
              <View style={styles.statItem}>
                <Feather name="users" size={15} color="#64748b" />
                <Text style={styles.statText}>{recipe.servings} servings</Text>
              </View>
              <View style={styles.statItem}>
                <Feather name="award" size={15} color="#64748b" />
                <Text style={styles.statText}>{recipe.difficulty}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 7 }}>
              {recipe.ingredients.map((ingredient, i) => {
                const isExpiring = !!foodItems.find(item => item.name === ingredient && item.daysLeft <= 2);
                return (
                  <View
                    key={i}
                    style={[
                      styles.ingredientTag,
                      isExpiring
                        ? { backgroundColor: '#fee2e2', borderColor: '#dc2626' }
                        : { backgroundColor: '#e0e7ff', borderColor: '#6366f1' }
                    ]}
                  >
                    <Text style={{
                      color: isExpiring ? '#dc2626' : '#312e81',
                      fontWeight: isExpiring ? 'bold' : '500'
                    }}>
                      {ingredient}{isExpiring ? ' ⚠️' : ''}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>

      {/* All Recipes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Available Recipes</Text>
        {recipes.map(recipe => (
          <View key={recipe.id} style={[styles.recipeCard, { borderColor: '#2563eb' }]}>
            <View style={styles.recipeRow}>
              <Text style={styles.recipeName}>{recipe.name}</Text>
              <View style={[styles.ratingTag, { backgroundColor: '#dbeafe' }]}>
                <MaterialCommunityIcons name="star" size={16} color="#2563eb" />
                <Text style={[styles.ratingText, { color: '#2563eb' }]}>{recipe.rating}</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Feather name="clock" size={15} color="#64748b" />
                <Text style={styles.statText}>{recipe.time}</Text>
              </View>
              <View style={styles.statItem}>
                <Feather name="users" size={15} color="#64748b" />
                <Text style={styles.statText}>{recipe.servings} servings</Text>
              </View>
              <View style={styles.statItem}>
                <Feather name="award" size={15} color="#64748b" />
                <Text style={styles.statText}>{recipe.difficulty}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 7 }}>
              {recipe.ingredients.map((ingredient, i) => (
                <View key={i} style={[styles.ingredientTag, { backgroundColor: '#dbeafe', borderColor: '#2563eb' }]}>
                  <Text style={{ color: '#2563eb' }}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 18, marginTop: 14 },
  section: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 22, elevation: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2563eb', marginBottom: 10 },
  recipeCard: { borderRadius: 15, borderWidth: 2, padding: 14, marginBottom: 12, backgroundColor: '#f1f5f9' },
  recipeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  recipeName: { fontSize: 17, fontWeight: 'bold', color: '#222' },
  ratingTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fee2e2', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10, marginLeft: 8 },
  ratingText: { marginLeft: 3, fontSize: 15, color: '#dc2626', fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  statItem: { flexDirection: 'row', alignItems: 'center', marginRight: 13 },
  statText: { marginLeft: 3, color: '#64748b', fontSize: 14 },
  ingredientTag: { borderRadius: 9, paddingHorizontal: 10, paddingVertical: 3, marginRight: 7, marginBottom: 5, borderWidth: 1 }
});

export default RecipesScreen;
