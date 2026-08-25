import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/theme";

/**
 * Horizontal differential-distribution bars for all 7 classes.
 * @param {{ classProbabilities: Record<string, number>, predictedClass: string }} props
 */
export default function ProbabilityBar({ classProbabilities, predictedClass }) {
  const entries = Object.entries(classProbabilities || {}).sort((a, b) => b[1] - a[1]);

  return (
    <View style={styles.container}>
      {entries.map(([className, probability]) => {
        const isTop = className === predictedClass;
        const percent = Math.round(probability * 100);
        return (
          <View key={className} style={styles.row}>
            <Text style={[styles.className, isTop && styles.classNameActive]}>
              {className.toUpperCase()}
            </Text>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${percent}%`,
                    backgroundColor: isTop ? COLORS.primary : COLORS.accent,
                  },
                ]}
              />
            </View>
            <Text style={styles.percent}>{percent}%</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  className: {
    width: 56,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  classNameActive: {
    color: COLORS.textPrimary,
  },
  track: {
    flex: 1,
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: 6,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 6,
  },
  percent: {
    width: 40,
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "right",
  },
});
