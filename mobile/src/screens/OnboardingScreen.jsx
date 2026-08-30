import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, DISCLAIMER_TEXT } from "../../constants/theme";

const STEPS = [
  {
    emoji: "\u{1F4F7}",
    title: "Capture a photo",
    body: "Take a clear, well-lit photo of the skin area you'd like to screen, or choose one from your gallery.",
  },
  {
    emoji: "\u{1F52C}",
    title: "AI-powered screening",
    body: "DermaScan AI analyzes the image across 7 dermoscopic categories and returns a risk tier: Low, Moderate, or High.",
  },
  {
    emoji: "\u{1F525}",
    title: "See exactly why",
    body: "A Grad-CAM heatmap highlights the exact region that drove the prediction \u2014 no black box.",
  },
];

export default function OnboardingScreen({ onDone }) {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/icon.png")} style={styles.logo} />
      <Text style={styles.appName}>DermaScan AI</Text>
      <Text style={styles.tagline}>Smartphone skin lesion screening, explained.</Text>

      <View style={styles.stepsContainer}>
        {STEPS.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={styles.emojiCircle}>
              <Text style={styles.emoji}>{step.emoji}</Text>
            </View>
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepBody}>{step.body}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.disclaimer}>{DISCLAIMER_TEXT}</Text>

      <TouchableOpacity style={styles.button} onPress={onDone}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    paddingTop: 70,
    paddingHorizontal: 28,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
  },
  appName: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginTop: 14,
  },
  tagline: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 36,
  },
  stepsContainer: {
    width: "100%",
    gap: 24,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  emojiCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 22,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  stepBody: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  disclaimer: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 32,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 28,
    marginTop: "auto",
    marginBottom: 40,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
