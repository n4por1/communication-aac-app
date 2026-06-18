import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CardSettingsScreen from "../screens/CardSettingsScreen";
import ConfirmScreen from "../screens/ConfirmScreen";
import DetailScreen from "../screens/DetailScreen";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: "#FFFFFF" },
      headerTitleStyle: { fontSize: 20, fontWeight: "700", color: "#1E293B" },
      headerTintColor: "#2563EB",
      headerShadowVisible: false,
      contentStyle: { backgroundColor: "#F5F7FA" },
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} options={{ title: "コミュニケーション" }} />
    <Stack.Screen name="Detail" component={DetailScreen} options={{ title: "選択" }} />
    <Stack.Screen name="Confirm" component={ConfirmScreen} options={{ title: "確認", headerBackVisible: false }} />
    <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "設定" }} />
    <Stack.Screen name="CardSettings" component={CardSettingsScreen} options={{ title: "カードの設定" }} />
  </Stack.Navigator>
);

export default AppNavigator;
