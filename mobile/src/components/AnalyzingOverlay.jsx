import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/theme";

const STAGES = [
  "Checking image quality...",
  "Running AI classification...",
  "Generating explainability heatmap...",
  "Finalizing risk report...",
];

/**
 * Cosmetic staged progress indicator shown while the /screen request is
 * in flight. The stages are illustrative (the real backend does these
 * steps in one request-response cycle) but give the user a sense of
 * what's happening rather than a single unexplained spinner, and make
 * the wait feel shorter and more informative.
 */
export default function AnalyzingOverlay() {
  const [stageIndex, setStageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    pulse.start();

    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1100);

    return () => {
      pulse.stop();
      clearInterval(interval);
    };
  }, []);

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
      <Text style={styles.stageText}>{STAGES[stageIndex]}</Text>

      <View style={styles.dotsRow}>
        {STAGES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i <= stageIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(11, 61, 46, 0.92)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  pulseCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.accent,
    marginBottom: 24,
  },
  stageText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: COLORS.accent,
  },
  dotInactive: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
});