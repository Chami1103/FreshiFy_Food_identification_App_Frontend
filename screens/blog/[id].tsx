// app/blog/[id].tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import API, { API_CONFIG } from "../../config/config";

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

export default function BlogDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [post, setPost] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);

  useEffect(() => {
    if (!id) return;
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`${API.BLOGS}/${id}`, { signal: ctrl.signal });
        if (res.status === 404) throw new Error("Post not found");
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();
        setPost(data || null);
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          console.error("getBlog error:", e);
          setErr(e?.message || "Failed to load post");
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [id]);

  useEffect(() => {
    if (!post?.category) return;
    (async () => {
      try {
        const categoryParam = encodeURIComponent(post.category ?? "");
        const res = await fetch(`${API.BLOGS}?category=${categoryParam}`);
        if (!res.ok) return setRelated([]);
        const data = await res.json();
        const filtered = (data || []).filter((b: Blog) => b._id !== post._id).slice(0, 3);
        setRelated(filtered);
      } catch (e) {
        setRelated([]);
      }
    })();
  }, [post?.category]);

  const imageUri = useMemo(() => {
    try {
      if (!post?.image) return null;
      const url = new URL(post.image);
      return url.toString();
    } catch {
      return `${API_CONFIG.MAIN_BASE_URL.replace(/\/+$/, "")}/${(post?.image || "").replace(/^\/+/, "")}`;
    }
  }, [post?.image]);

  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: 80 }]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 8 }}>Loading…</Text>
      </View>
    );
  }

  if (err || !post) {
    return (
      <View style={[styles.center, { paddingTop: 80, padding: 16 }]}>
        <Text style={{ color: "#ef4444", fontWeight: "600", textAlign: "center" }}>{err || "Not found"}</Text>
        <Text onPress={() => router.back()} style={{ marginTop: 12, color: "#2563eb", fontWeight: "700" }}>
          ‹ Back
        </Text>
      </View>
    );
  }

  const created = post.createdAt ? new Date(post.createdAt) : null;
  const windowWidth = Dimensions.get("window").width;

  return (
    <Animated.ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      entering={FadeIn}
      contentContainerStyle={{ paddingBottom: 48 }}
    >
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={[styles.hero, { width: windowWidth, height: 240 }]}
          resizeMode="cover"
        />
      )}

      <View style={styles.body}>
        {!!post.category && <Text style={[styles.category]}>{post.category.toUpperCase()}</Text>}
        <Text style={[styles.title]}>{post.title}</Text>

        <Text style={[styles.meta]}>
          {(post.author || "Unknown")} • {(post.readTime || "—")}
          {created
            ? ` • ${created.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}`
            : ""}
        </Text>

        {!!(post.tags && post.tags.length) && (
          <View style={styles.tagsRow}>
            {post.tags.map((t) => (
              <View key={t} style={styles.tagChip}>
                <Text style={styles.tagText}>#{t}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={[styles.content]}>{post.content}</Text>
      </View>

      {related.length > 0 && (
        <View style={styles.recommendSection}>
          <Text style={styles.recommendTitle}>📚 Recommended Reads</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {related.map((item) => {
              const uri = item.image
                ? (() => {
                    try {
                      return new URL(item.image).toString();
                    } catch {
                      return `${API_CONFIG.MAIN_BASE_URL.replace(/\/+$/, "")}/${item.image.replace(/^\/+/, "")}`;
                    }
                  })()
                : null;
              return (
                <TouchableOpacity key={item._id} style={[styles.card]} activeOpacity={0.9} onPress={() => router.push(`/blog/${item._id}`)}>
                  {uri ? <Image source={{ uri }} style={styles.cardImage} /> : <View style={[styles.cardImage, { backgroundColor: "#e5e7eb" }]} />}
                  <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.cardMeta} numberOfLines={1}>{item.readTime || "—"}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  hero: {
    width: "100%",
    height: 240,
  },
  body: { padding: 20, backgroundColor: "#fff" },
  category: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: 0.5,
    color: "#16A34A",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
    lineHeight: 30,
  },
  meta: { fontSize: 13, marginBottom: 14, color: "#6b7280" },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#E0E7FF",
    marginRight: 6,
  },
  tagText: { fontSize: 12, fontWeight: "700", color: "#3730A3" },
  content: { fontSize: 16, lineHeight: 26, textAlign: "justify", color: "#111827" },
  recommendSection: { paddingHorizontal: 16, marginTop: 24 },
  recommendTitle: { fontSize: 18, fontWeight: "800", marginBottom: 12, color: "#111827" },
  card: {
    width: 200,
    borderRadius: 14,
    marginRight: 14,
    padding: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImage: { width: "100%", height: 110, borderRadius: 10, marginBottom: 8 },
  cardTitle: { fontWeight: "700", fontSize: 14, marginBottom: 4 },
  cardMeta: { fontSize: 12, color: "#6b7280" },
});
