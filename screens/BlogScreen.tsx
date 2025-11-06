import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { API } from "../services/api"; // ✅ Fixed import

type Blog = {
  _id: string;
  title: string;
  content?: string;
  category?: string;
  author?: string;
  readTime?: string;
  tags?: string[];
  image?: string;
  createdAt?: string;
};

export default function BlogListScreen() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(API.BLOGS);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();
        const list: Blog[] = Array.isArray(data) ? data : data?.items || [];
        setBlogs(list);
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          console.error("getBlogs error:", e);
          setErr(e?.message || "Failed to load blogs");
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  const resolveImage = (img?: string | null) => {
    if (!img) return null;
    try {
      const url = new URL(img);
      return url.toString();
    } catch {
      return `${API.MAIN_BASE_URL.replace(/\/+$/, "")}/${img.replace(/^\/+/, "")}`;
    }
  };

  const renderItem = ({ item }: { item: Blog }) => {
    const imageUri = resolveImage(item.image ?? null);
    const snippet = (item.content || "").slice(0, 140);

    return (
      <Pressable
        onPress={() => router.push(`/blog/${item._id}`)}
        style={[styles.card, { borderColor: "#e6e6e6" }]}
      >
        {imageUri ? <Image source={{ uri: imageUri }} style={styles.thumb} /> : null}
        <View style={styles.cardBody}>
          {!!item.category && <Text style={styles.category}>{item.category}</Text>}
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.snippet} numberOfLines={3}>
            {snippet}
          </Text>
          <Text style={styles.meta}>
            {(item.author || "Unknown")} • {(item.readTime || "—")}
          </Text>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: 80 }]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 10 }}>Loading blogs…</Text>
      </View>
    );
  }

  if (err) {
    return (
      <View style={[styles.center, { paddingTop: 80, padding: 16 }]}>
        <Text style={{ color: "#ef4444", fontWeight: "600", textAlign: "center" }}>
          {err}
        </Text>
      </View>
    );
  }

  return (
    <Animated.FlatList
      data={blogs}
      keyExtractor={(it) => it._id ?? it.title ?? Math.random().toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16, paddingTop: 0, paddingBottom: 24 }}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      ListHeaderComponent={
        <LinearGradient
          colors={["#60A5FA", "#2563EB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={styles.headerText}>📰 Freshify Blog</Text>
        </LinearGradient>
      }
      ListEmptyComponent={
        <View style={[styles.center, { padding: 24 }]}>
          <Text>No posts yet.</Text>
        </View>
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 12,
  },
  headerText: { fontSize: 24, fontWeight: "900", color: "#fff" },
  card: { borderRadius: 14, overflow: "hidden", borderWidth: 1, backgroundColor: "#fff" },
  thumb: { width: "100%", height: 160, resizeMode: "cover" },
  cardBody: { padding: 12 },
  category: { color: "#16A34A", fontWeight: "700", marginBottom: 4 },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 6 },
  snippet: { fontSize: 14, marginBottom: 8 },
  meta: { fontSize: 12, color: "#6b7280" },
});
