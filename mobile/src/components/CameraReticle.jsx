import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/theme";

/**
 * Lesion alignment overlay shown on top of the camera preview, with an
 * inline quality warning banner (blur/lighting) when present.
 * @param {{ warning: string | null }} props
 */
export default function CameraReticle({ warning }) {
  return (
    <View style={styles.overlay} pointerEvents="none">
      <View style={[styles.reticle, warning ? styles.reticleWarning : styles.reticleOk]} />

      {warning ? (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>{warning}</Text>
        </View>
      ) : (
        <View style={styles.hintBanner}>
          <Text style={styles.hintText}>Center the lesion in the frame and hold steady</Text>
        </View>
      )}
    </View>
  );
}

const RETICLE_SIZE = 240;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  reticle: {
    width: RETICLE_SIZE,
    height: RETICLE_SIZE,
    borderRadius: RETICLE_SIZE / 2,
    borderWidth: 3,
  },
  reticleOk: {
    borderColor: COLORS.accent,
  },
  reticleWarning: {
    borderColor: COLORS.warning,
  },
  warningBanner: {
    position: "absolute",
    bottom: 100,
    backgroundColor: "rgba(214, 137, 16, 0.92)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  warningText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  hintBanner: {
    position: "absolute",
    bottom: 100,
    backgroundColor: "rgba(11, 61, 46, 0.75)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  hintText: {
    color: "#fff",
    fontSize: 13,
  },
});
