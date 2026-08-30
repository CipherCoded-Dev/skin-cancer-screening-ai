import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ScannerScreen from "./src/screens/ScannerScreen";
import ResultScreen from "./src/screens/ResultScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
// ExportModal is not wired up yet -- it depends on a backend
// /api/v1/export-report endpoint that doesn't exist. Re-add this import
// and the <Stack.Screen name="Export" .../> below once that's built.
// import ExportModal from "./src/screens/ExportModal";
import { COLORS } from "./constants/theme";

const Stack = createNativeStackNavigator();
const ONBOARDING_KEY = "dermascan_has_onboarded_v1";

export default function App() {
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((value) => {
        setShowOnboarding(value !== "true");
      })
      .catch(() => {
        // If storage read fails for any reason, fail open (skip onboarding)
        // rather than blocking the user from using the app.
        setShowOnboarding(false);
      })
      .finally(() => setCheckingOnboarding(false));
  }, []);

  const handleOnboardingDone = () => {
    AsyncStorage.setItem(ONBOARDING_KEY, "true").catch(() => {});
    setShowOnboarding(false);
  };

  if (checkingOnboarding) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.primary }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (showOnboarding) {
    return <OnboardingScreen onDone={handleOnboardingDone} />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Scanner"
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "700" },
        }}
      >
        <Stack.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{ title: "DermaScan AI", headerShown: false }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{ title: "Screening Result" }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: "Scan History" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}