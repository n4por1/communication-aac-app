import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CommCard } from "../types";

type Size = "large" | "small";

type Props = {
  card: CommCard;
  onPress: (card: CommCard) => void;
  size?: Size;
};

const countEmojis = (str: string): number =>
  [...str].filter((c) => c !== "️" && c !== "⃣").length;

const CommCardView: React.FC<Props> = ({ card, onPress, size = "large" }) => {
  const isDouble = countEmojis(card.defaultImages[0] ?? "") >= 2;
  const s = size === "small" ? smallStyles : largeStyles;

  return (
    <TouchableOpacity
      style={[s.card, card.kind === "direct" && !card.parentId && s.directCard]}
      onPress={() => onPress(card)}
      activeOpacity={0.75}
      accessibilityLabel={`${card.label}${card.kana ? `（${card.kana}）` : ""}`}
    >
      <View style={s.imageArea}>
        {card.customImageUri ? (
          <Image source={{ uri: card.customImageUri }} style={s.customImage} resizeMode="cover" />
        ) : (
          <Text style={[s.emoji, isDouble && s.emojiDouble]}>
            {card.defaultImages[0]}
          </Text>
        )}
      </View>
      <Text style={s.label}>{card.label}</Text>
      {size === "large" && card.kana ? (
        <Text style={s.kana}>{card.kana}</Text>
      ) : null}
      {card.kind === "group" && size === "large" && (
        <Text style={s.groupBadge}>›</Text>
      )}
    </TouchableOpacity>
  );
};

export default CommCardView;

const largeStyles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    margin: 8,
    flex: 1,
    minHeight: 170,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#F1F5F9",
  },
  directCard: {
    borderColor: "#E2E8F0",
  },
  imageArea: {
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 72,
  },
  emoji: {
    fontSize: 64,
  },
  emojiDouble: {
    fontSize: 36,
  },
  customImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  label: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 2,
  },
  kana: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
  },
  groupBadge: {
    position: "absolute",
    bottom: 10,
    right: 14,
    fontSize: 22,
    color: "#CBD5E1",
  },
});

const smallStyles = StyleSheet.create({
  card: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  directCard: {
    borderColor: "#E2E8F0",
  },
  imageArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 30,
  },
  emojiDouble: {
    fontSize: 20,
  },
  customImage: {
    width: 30,
    height: 30,
    borderRadius: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "center",
    marginTop: 3,
  },
  kana: {
    fontSize: 0,
  },
  groupBadge: {
    display: "none",
    fontSize: 0,
    color: "transparent",
  },
});
