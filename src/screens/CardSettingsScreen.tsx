import { NativeStackScreenProps } from "@react-navigation/native-stack";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useMemo } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import SettingsListItem from "../components/SettingsListItem";
import { useCardStore } from "../hooks/useCardStore";
import { useImageStorage } from "../hooks/useImageStorage";
import { useSettingsStore } from "../hooks/useSettingsStore";
import { CommCard, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "CardSettings">;

const CardSettingsScreen: React.FC<Props> = () => {
  const { cards, homeCards } = useCardStore();
  const { setCardVisible, setHomeOrder } = useSettingsStore();
  const { saveCustomImage, deleteCustomImage } = useImageStorage();

  const groups = useMemo(
    () => homeCards.filter((c) => c.kind === "group"),
    [homeCards]
  );

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

  const renderHomeItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<CommCard>) => (
      <ScaleDecorator>
        <SettingsListItem
          card={item}
          onToggleVisible={handleToggle}
          onSelectImage={handleSelectImage}
          onDeleteImage={handleDeleteImage}
          drag={drag}
          isActive={isActive}
        />
      </ScaleDecorator>
    ),
    [handleToggle, handleSelectImage, handleDeleteImage]
  );

  const ListHeader = useMemo(
    () => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEmoji}>🏠</Text>
        <Text style={styles.sectionTitle}>ホーム</Text>
        <Text style={styles.sectionHint}>長押しでドラッグ</Text>
      </View>
    ),
    []
  );

  const ListFooter = useMemo(
    () => (
      <View>
        {groups.map((g) => {
          const children = cards.filter((c) => c.parentId === g.id);
          if (children.length === 0) return null;
          return (
            <View key={g.id}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEmoji}>{g.defaultImages[0] ?? ""}</Text>
                <Text style={styles.sectionTitle}>{g.label} の項目</Text>
              </View>
              {children.map((child) => (
                <SettingsListItem
                  key={child.id}
                  card={child}
                  onToggleVisible={handleToggle}
                  onSelectImage={handleSelectImage}
                  onDeleteImage={handleDeleteImage}
                />
              ))}
            </View>
          );
        })}
        <View style={styles.footer} />
      </View>
    ),
    [groups, cards, handleToggle, handleSelectImage, handleDeleteImage]
  );

  return (
    <DraggableFlatList
      data={homeCards}
      keyExtractor={(item) => item.id}
      renderItem={renderHomeItem}
      onDragEnd={({ data }) => setHomeOrder(data.map((c) => c.id))}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={ListFooter}
      containerStyle={styles.list}
      activationDistance={10}
    />
  );
};

export default CardSettingsScreen;

const styles = StyleSheet.create({
  list: { padding: 16 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginTop: 12,
    marginBottom: 6,
  },
  sectionEmoji: { fontSize: 22, marginRight: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#475569", flex: 1 },
  sectionHint: { fontSize: 12, color: "#94A3B8" },
  footer: { height: 48 },
});
