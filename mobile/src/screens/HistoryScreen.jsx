import React from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import RiskBadge from "../components/RiskBadge";
import { useScanHistory } from "../hooks/useScanHistory";
import { COLORS } from "../../constants/theme";

function formatDate(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " \u00b7 " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function HistoryScreen({ navigation }) {
  const { history, isLoading, clearHistory, removeEntry } = useScanHistory();

  const handleClearAll = () => {
    if (history.length === 0) return;
    Alert.alert(
      "Clear all history?",
      "This removes all saved scans from this device. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", style: "destructive", onPress: clearHistory },
      ]
    );
  };

  const handleOpenEntry = (entry) => {
    navigation.navigate("Result", {
      result: entry.result,
      originalUri: entry.originalUri,
      fromHistory: true,
    });
  };

  const handleLongPress = (entry) => {
    Alert.alert("Delete this scan?", "This entry will be removed from your history.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeEntry(entry.id) },
    ]);
  };

  if (!isLoading && history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Text style={styles.emptyIconText}>{"\u{1F4CB}"}</Text>
        </View>
        <Text style={styles.emptyTitle}>No scans yet</Text>
        <Text style={styles.emptySubtitle}>
          Your screening history will appear here after your first scan.
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Scanner")}>
          <Text style={styles.primaryButtonText}>Start a Scan</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{history.length} saved scan{history.length === 1 ? "" : "s"}</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleOpenEntry(item)}
            onLongPress={() => handleLongPress(item)}
          >
            <Image source={{ uri: item.originalUri }} style={styles.thumbnail} />
            <View style={styles.cardBody}>
              <Text style={styles.className}>{item.result.predicted_class.toUpperCase()}</Text>
              <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
              <RiskBadge riskTier={item.result.risk_tier} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  clearText: {
    fontSize: 13,
    color: COLORS.danger,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: COLORS.border,
  },
  cardBody: {
    flex: 1,
    marginLeft: 14,
    gap: 4,
  },
  className: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyIconText: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 19,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 28,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
