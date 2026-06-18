import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useMemo } from "react";
import { Alert, SectionList, StyleSheet, Text, View } from "react-native";
import SettingsListItem from "../components/SettingsListItem";
import { useCardStore } from "../hooks/useCardStore";
import { useImageStorage } from "../hooks/useImageStorage";
import { useSettingsStore } from "../hooks/useSettingsStore";
import { CommCard, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "CardSettings">;

type Section = { title: string; emoji: string; data: CommCard[] };

const CardSettingsScreen: React.FC<Props> = () => {
  const { cards, homeCards, getChildren } = useCardStore();
  const { setCardVisible } = useSettingsStore();
  const { saveCustomImage, deleteCustomImage } = useImageStorage();

  const sections: Section[] = useMemo(() => {
    const groups = homeCards.filter((c) => c.kind === "group");

    return [
      { title: "ホーム", emoji: "🏠", data: homeCards },
      ...groups.map((g) => ({
        title: `${g.label} の項目`,
        emoji: g.defaultImages[0] ?? "",
        data: cards.filter((c) => c.parentId === g.id),
      })),
    ].filter((s) => s.data.length > 0);
  }, [cards, homeCards]);

  const handleToggle = useCallback(
    (cardId: string, visible: boolean) => setCardVisible(cardId, visible),
    [setCardVisible]
  );

  const handleSelectImage = useCallback(async (card: CommCard) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("権限が必要です", "写真ライブラリへのアクセスを許可してください。");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      try {
        await saveCustomImage(card.id, result.assets[0].uri);
      } catch {
        Alert.alert("エラー", "画像の保存に失敗しました。");
      }
    }
  }, [saveCustomImage]);

  const handleDeleteImage = useCallback((card: CommCard) => {
    Alert.alert("カスタム画像を削除", `「${card.label}」のカスタム画像を削除しますか？`, [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除する",
        style: "destructive",
        onPress: async () => {
          if (card.customImageUri) {
            await deleteCustomImage(card.id, card.customImageUri);
          }
        },
      },
    ]);
  }, [deleteCustomImage]);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SettingsListItem
          card={item}
          onToggleVisible={handleToggle}
          onSelectImage={handleSelectImage}
          onDeleteImage={handleDeleteImage}
        />
      )}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEmoji}>{section.emoji}</Text>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
      )}
      contentContainerStyle={styles.list}
      stickySectionHeadersEnabled={false}
    />
  );
};

export default CardSettingsScreen;

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 48 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginTop: 12,
    marginBottom: 6,
  },
  sectionEmoji: { fontSize: 22, marginRight: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#475569" },
});
