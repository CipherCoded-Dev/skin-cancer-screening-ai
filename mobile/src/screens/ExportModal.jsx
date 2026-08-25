import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import { COLORS } from "../../constants/theme";
import { exportReport } from "../services/api";

/**
 * Doctor-ready PDF metadata input & export.
 *
 * NOTE: This calls POST /api/v1/export-report, which does not exist in
 * the backend yet. Either:
 *   1. Add that endpoint (wraps app/services/pdf_generator.py), or
 *   2. Skip this screen for your demo and rely on the heatmap +
 *      result screen alone, since the /screen response already
 *      contains everything needed for a screenshot-based "report".
 */
export default function ExportModal({ route, navigation }) {
  const { predictedClass, riskTier, confidence, heatmapBase64 } = route.params;
  const [patientNotes, setPatientNotes] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const pdfBlob = await exportReport({
        predictedClass,
        riskTier,
        confidence,
        heatmapBase64,
        patientNotes,
      });

      const fileUri = `${FileSystem.cacheDirectory}dermascan-report.pdf`;
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result.split(",")[1];
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        }
      };
      reader.readAsDataURL(pdfBlob);
    } catch (err) {
      Alert.alert(
        "Export failed",
        err.message ||
          "Could not generate the PDF. Make sure the backend has a /api/v1/export-report endpoint implemented."
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Export Doctor Report</Text>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryLine}>Prediction: {predictedClass.toUpperCase()}</Text>
        <Text style={styles.summaryLine}>Risk tier: {riskTier}</Text>
        <Text style={styles.summaryLine}>Confidence: {Math.round(confidence * 100)}%</Text>
      </View>

      <Text style={styles.label}>Notes for the doctor (optional)</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        placeholder="e.g. lesion has been present for 3 weeks, mild itching..."
        value={patientNotes}
        onChangeText={setPatientNotes}
      />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleExport}
        disabled={isExporting}
      >
        {isExporting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Generate & Share PDF</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>Back</Text>
      </TouchableOpacity>
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
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  summaryBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 20,
  },
  summaryLine: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    textAlignVertical: "top",
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
