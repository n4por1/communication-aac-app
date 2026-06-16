import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import HomeScreen from "../screens/HomeScreen";
import NounSelectionScreen from "../screens/NounSelectionScreen";
import NounSettingsScreen from "../screens/NounSettingsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: "#FFFFFF" },
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1E293B",
      },
      headerTintColor: "#2563EB",
      headerShadowVisible: false,
      contentStyle: { backgroundColor: "#F5F7FA" },
    }}
  >
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: "コミュニケーション" }}
    />
    <Stack.Screen
      name="NounSelection"
      component={NounSelectionScreen}
      options={{ title: "何を？" }}
    />
    <Stack.Screen
      name="Confirmation"
      component={ConfirmationScreen}
      options={{ title: "確認", headerBackVisible: false }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: "設定" }}
    />
    <Stack.Screen
      name="NounSettings"
      component={NounSettingsScreen}
      options={{ title: "名詞の設定" }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
