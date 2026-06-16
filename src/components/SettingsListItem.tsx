import React from "react";
import {
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NounItem } from "../types";

type Props = {
  noun: NounItem;
  onToggleVisible: (nounId: string, visible: boolean) => void;
  onSelectImage: (noun: NounItem) => void;
  onDeleteImage: (noun: NounItem) => void;
};

const SettingsListItem: React.FC<Props> = ({
  noun,
  onToggleVisible,
  onSelectImage,
  onDeleteImage,
}) => (
  <View style={styles.container}>
    <View style={styles.thumb}>
      {noun.customImageUri ? (
        <Image
          source={{ uri: noun.customImageUri }}
          style={styles.thumbImage}
          resizeMode="cover"
        />
      ) : (
        <Text style={styles.thumbEmoji}>{noun.defaultImage}</Text>
      )}
    </View>

    <View style={styles.info}>
      <Text style={styles.label}>{noun.label}</Text>
      <Text style={styles.kana}>{noun.kana}</Text>
    </View>

    <View style={styles.actions}>
      {noun.allowCustomImage && (
        <TouchableOpacity
          style={styles.imgBtn}
          onPress={() => onSelectImage(noun)}
        >
          <Text style={styles.imgBtnText}>
            {noun.customImageUri ? "変更" : "画像登録"}
          </Text>
        </TouchableOpacity>
      )}
      {noun.customImageUri && (
        <TouchableOpacity
          style={styles.delBtn}
          onPress={() => onDeleteImage(noun)}
        >
          <Text style={styles.delBtnText}>削除</Text>
        </TouchableOpacity>
      )}
      <Switch
        value={noun.visible}
        onValueChange={(val) => onToggleVisible(noun.id, val)}
        trackColor={{ false: "#CBD5E1", true: "#93C5FD" }}
        thumbColor={noun.visible ? "#2563EB" : "#94A3B8"}
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
  thumb: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  thumbImage: {
    width: 52,
    height: 52,
    borderRadius: 8,
  },
  thumbEmoji: {
    fontSize: 36,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
  },
  kana: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  imgBtn: {
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  imgBtnText: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "500",
  },
  delBtn: {
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  delBtnText: {
    fontSize: 13,
    color: "#DC2626",
    fontWeight: "500",
  },
});
