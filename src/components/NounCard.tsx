import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NounItem } from "../types";

type Props = {
  noun: NounItem;
  onPress: (noun: NounItem) => void;
};

const NounCard: React.FC<Props> = ({ noun, onPress }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => onPress(noun)}
    activeOpacity={0.75}
    accessibilityLabel={`${noun.label}（${noun.kana}）`}
  >
    <View style={styles.imageArea}>
      {noun.customImageUri ? (
        <Image
          source={{ uri: noun.customImageUri }}
          style={styles.customImage}
          resizeMode="cover"
        />
      ) : (
        <Text style={styles.emoji}>{noun.defaultImage}</Text>
      )}
    </View>
    <Text style={styles.label}>{noun.label}</Text>
    <Text style={styles.kana}>{noun.kana}</Text>
  </TouchableOpacity>
);

export default NounCard;

const styles = StyleSheet.create({
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
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  imageArea: {
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
  },
  emoji: {
    fontSize: 64,
  },
  customImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 4,
  },
  kana: {
    fontSize: 15,
    color: "#94A3B8",
    textAlign: "center",
  },
});
