import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useMemo } from "react";
import {
  Alert,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SettingsListItem from "../components/SettingsListItem";
import { useCommunicationStore } from "../hooks/useCommunicationStore";
import { useImageStorage } from "../hooks/useImageStorage";
import { useSettingsStore } from "../hooks/useSettingsStore";
import { NounItem, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "NounSettings">;

type Section = {
  title: string;
  emoji: string;
  data: NounItem[];
};

const CATEGORY_META: Record<string, { label: string; emoji: string }> = {
  drink:  { label: "飲む",   emoji: "☕" },
  food:   { label: "食べる", emoji: "🍽️" },
  place:  { label: "移動",   emoji: "🚶" },
  body:   { label: "痛い",   emoji: "😣" },
  person: { label: "呼ぶ",   emoji: "🔔" },
  help:   { label: "手伝う", emoji: "🤝" },
  sleep:  { label: "寝る",   emoji: "🛏️" },
  media:  { label: "見る",   emoji: "👀" },
};

const CATEGORY_ORDER = [
  "drink", "food", "place", "body", "person", "help", "sleep", "media",
];

const NounSettingsScreen: React.FC<Props> = () => {
  const { nouns } = useCommunicationStore();
  const { setNounVisible } = useSettingsStore();
  const { saveCustomImage, deleteCustomImage } = useImageStorage();

  const sections: Section[] = useMemo(() => {
    return CATEGORY_ORDER.map((cat) => {
      const meta = CATEGORY_META[cat];
      return {
        title: meta.label,
        emoji: meta.emoji,
        data: nouns.filter((n) => n.category === cat),
      };
    }).filter((s) => s.data.length > 0);
  }, [nouns]);

  const handleToggleVisible = useCallback(
    (nounId: string, visible: boolean) => {
      setNounVisible(nounId, visible);
    },
    [setNounVisible]
  );

  const handleSelectImage = useCallback(async (noun: NounItem) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "権限が必要です",
        "写真ライブラリへのアクセスを許可してください。\n設定アプリから許可を変更できます。"
      );
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
        await saveCustomImage(noun.id, result.assets[0].uri);
      } catch {
        Alert.alert("エラー", "画像の保存に失敗しました。");
      }
    }
  }, [saveCustomImage]);

  const handleDeleteImage = useCallback((noun: NounItem) => {
    Alert.alert(
      "カスタム画像を削除",
      `「${noun.label}」のカスタム画像を削除しますか？`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除する",
          style: "destructive",
          onPress: async () => {
            if (noun.customImageUri) {
              await deleteCustomImage(noun.id, noun.customImageUri);
            }
          },
        },
      ]
    );
  }, [deleteCustomImage]);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SettingsListItem
          noun={item}
          onToggleVisible={handleToggleVisible}
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

export default NounSettingsScreen;

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 48,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginTop: 12,
    marginBottom: 6,
  },
  sectionEmoji: {
    fontSize: 22,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
  },
});
