import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ScannerScreen from "./src/screens/ScannerScreen";
import ResultScreen from "./src/screens/ResultScreen";
import ExportModal from "./src/screens/ExportModal";
import { COLORS } from "./constants/theme";

const Stack = createNativeStackNavigator();

export default function App() {
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
          name="Export"
          component={ExportModal}
          options={{ title: "Export Report", presentation: "modal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
