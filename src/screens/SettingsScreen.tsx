import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

const SettingsScreen: React.FC<Props> = ({ navigation }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.sectionTitle}>表示設定</Text>

    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => navigation.navigate("CardSettings")}
      activeOpacity={0.75}
    >
      <Text style={styles.menuEmoji}>🖼️</Text>
      <View style={styles.menuText}>
        <Text style={styles.menuTitle}>カードの設定</Text>
        <Text style={styles.menuSubtitle}>表示するカードの切り替え・カスタム画像の登録・削除</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>

    <View style={styles.notice}>
      <Text style={styles.noticeTitle}>🔒 設定画面について</Text>
      <Text style={styles.noticeBody}>
        この画面は家族・介助者・支援者が操作する画面です。{"\n"}
        患者の方が誤って設定を変更しないようにご注意ください。
      </Text>
    </View>

    <Text style={styles.version}>communication-aac-app v1.0.0</Text>
  </ScrollView>
);

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 48 },
  sectionTitle: { fontSize: 13, fontWeight: "600", color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginLeft: 4 },
  menuItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 16, padding: 18, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  menuEmoji: { fontSize: 32, marginRight: 16 },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 18, fontWeight: "700", color: "#1E293B", marginBottom: 3 },
  menuSubtitle: { fontSize: 13, color: "#64748B", lineHeight: 18 },
  chevron: { fontSize: 26, color: "#CBD5E1", marginLeft: 8 },
  notice: { backgroundColor: "#FFF7ED", borderRadius: 16, padding: 18, marginTop: 24, borderLeftWidth: 4, borderLeftColor: "#F59E0B" },
  noticeTitle: { fontSize: 15, fontWeight: "700", color: "#92400E", marginBottom: 8 },
  noticeBody: { fontSize: 13, color: "#78350F", lineHeight: 20 },
  version: { textAlign: "center", fontSize: 12, color: "#CBD5E1", marginTop: 36 },
});
