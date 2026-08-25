import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RISK_TIER_STYLES } from "../../constants/theme";

/**
 * High / Moderate / Low triage status badge.
 * @param {{ riskTier: 'Low'|'Moderate'|'High' }} props
 */
export default function RiskBadge({ riskTier }) {
  const style = RISK_TIER_STYLES[riskTier] || RISK_TIER_STYLES.Low;

  return (
    <View style={[styles.badge, { backgroundColor: style.background }]}>
      <View style={[styles.dot, { backgroundColor: style.color }]} />
      <Text style={[styles.label, { color: style.color }]}>{style.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
