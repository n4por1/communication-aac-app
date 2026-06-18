import React from "react";
import { Image, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { CommCard } from "../types";

type Props = {
  card: CommCard;
  onToggleVisible: (cardId: string, visible: boolean) => void;
  onSelectImage: (card: CommCard) => void;
  onDeleteImage: (card: CommCard) => void;
  drag?: () => void;
  isActive?: boolean;
};

const SettingsListItem: React.FC<Props> = ({
  card,
  onToggleVisible,
  onSelectImage,
  onDeleteImage,
  drag,
  isActive,
}) => (
  <View style={[styles.container, isActive && styles.activeContainer]}>
    {drag && (
      <TouchableOpacity onPressIn={drag} style={styles.dragHandle} accessibilityLabel="並び替え">
        <Text style={styles.dragIcon}>☰</Text>
      </TouchableOpacity>
    )}
    <View style={styles.thumb}>
      {card.customImageUri ? (
        <Image source={{ uri: card.customImageUri }} style={styles.thumbImage} resizeMode="cover" />
      ) : (
        <Text style={styles.thumbEmoji}>{card.defaultImages[0]}</Text>
      )}
    </View>

    <View style={styles.info}>
      <Text style={styles.label}>{card.label}</Text>
      {card.kana ? <Text style={styles.kana}>{card.kana}</Text> : null}
    </View>

    <View style={styles.actions}>
      {card.allowCustomImage && (
        <TouchableOpacity style={styles.imgBtn} onPress={() => onSelectImage(card)}>
          <Text style={styles.imgBtnText}>{card.customImageUri ? "変更" : "画像登録"}</Text>
        </TouchableOpacity>
      )}
      {card.customImageUri && (
        <TouchableOpacity style={styles.delBtn} onPress={() => onDeleteImage(card)}>
          <Text style={styles.delBtnText}>削除</Text>
        </TouchableOpacity>
      )}
      <Switch
        value={card.visible}
        onValueChange={(val) => onToggleVisible(card.id, val)}
        trackColor={{ false: "#CBD5E1", true: "#93C5FD" }}
        thumbColor={card.visible ? "#2563EB" : "#94A3B8"}
      />
    </View>
  </View>
);

export default SettingsListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activeContainer: {
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: "#F0F7FF",
  },
  dragHandle: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
  },
  dragIcon: { fontSize: 20, color: "#CBD5E1" },
  thumb: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  thumbImage: { width: 52, height: 52, borderRadius: 8 },
  thumbEmoji: { fontSize: 36 },
  info: { flex: 1 },
  label: { fontSize: 18, fontWeight: "600", color: "#1E293B" },
  kana: { fontSize: 13, color: "#94A3B8", marginTop: 2 },
  actions: { flexDirection: "row", alignItems: "center", gap: 8 },
  imgBtn: { backgroundColor: "#EFF6FF", borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10 },
  imgBtnText: { fontSize: 13, color: "#2563EB", fontWeight: "500" },
  delBtn: { backgroundColor: "#FEE2E2", borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10 },
  delBtnText: { fontSize: 13, color: "#DC2626", fontWeight: "500" },
});
