import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import GradCamViewer from "../components/GradCamViewer";
import ProbabilityBar from "../components/ProbabilityBar";
import RiskBadge from "../components/RiskBadge";
import { COLORS, DISCLAIMER_TEXT } from "../../constants/theme";

export default function ResultScreen({ route, navigation }) {
  const { result, originalUri, fromHistory } = route.params;
  const {
    predicted_class: predictedClass,
    risk_tier: riskTier,
    confidence,
    class_probabilities: classProbabilities,
    heatmap_base64: heatmapBase64,
  } = result;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <RiskBadge riskTier={riskTier} />

      <Text style={styles.predictedClass}>{predictedClass.toUpperCase()}</Text>
      <Text style={styles.confidence}>{Math.round(confidence * 100)}% model confidence</Text>

      {!fromHistory && (
        <View style={styles.savedBadge}>
          <Text style={styles.savedBadgeText}>{"\u2713"} Saved to your scan history</Text>
        </View>
      )}

      <GradCamViewer originalUri={originalUri} heatmapBase64={heatmapBase64} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Full Differential</Text>
        <ProbabilityBar classProbabilities={classProbabilities} predictedClass={predictedClass} />
      </View>

      <View style={styles.disclaimerBox}>
        <Text style={styles.disclaimerText}>{DISCLAIMER_TEXT}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("History")}
        >
          <Text style={styles.secondaryButtonText}>View History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Scanner")}
        >
          <Text style={styles.primaryButtonText}>Scan Another</Text>
        </TouchableOpacity>
      </View>
      {/* "Export for Doctor" button removed until POST /api/v1/export-report
          exists on the backend. Re-add once that endpoint is built. */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  predictedClass: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  confidence: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  savedBadge: {
    backgroundColor: COLORS.riskLowBg,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 16,
  },
  savedBadgeText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: COLORS.riskLow,
  },
  section: {
    width: "100%",
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  disclaimerBox: {
    width: "100%",
    marginTop: 24,
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  disclaimerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 28,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    fontSize: 14,
  },
});
