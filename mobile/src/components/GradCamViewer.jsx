import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/theme";

/**
 * Side-by-side original photo vs. Grad-CAM saliency map, with a toggle
 * to flip between the two on smaller screens.
 * @param {{ originalUri: string, heatmapBase64: string }} props
 */
export default function GradCamViewer({ originalUri, heatmapBase64 }) {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const heatmapUri = heatmapBase64 ? `data:image/png;base64,${heatmapBase64}` : null;

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: showHeatmap && heatmapUri ? heatmapUri : originalUri }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <TouchableOpacity
        style={styles.toggle}
        onPress={() => setShowHeatmap((prev) => !prev)}
        disabled={!heatmapUri}
      >
        <Text style={styles.toggleText}>
          {showHeatmap ? "Show original photo" : "Show AI heatmap (Grad-CAM)"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.caption}>
        The heatmap highlights the region that most influenced the AI's prediction.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: COLORS.border,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  toggle: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
  },
  toggleText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  caption: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingHorizontal: 16,
  },
});
