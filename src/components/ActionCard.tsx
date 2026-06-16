import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ActionItem } from "../types";
import SequenceImage from "./SequenceImage";

type Props = {
  action: ActionItem;
  onPress: (action: ActionItem) => void;
};

const ActionCard: React.FC<Props> = ({ action, onPress }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => onPress(action)}
    activeOpacity={0.75}
    accessibilityLabel={`${action.label}（${action.kana}）`}
  >
    <View style={styles.imageArea}>
      {action.imageMode === "sequence" ? (
        <SequenceImage images={action.images} size={52} />
      ) : (
        <Text style={styles.emoji}>{action.images[0]}</Text>
      )}
    </View>
    <Text style={styles.label}>{action.label}</Text>
    <Text style={styles.kana}>{action.kana}</Text>
  </TouchableOpacity>
);

export default ActionCard;

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
    minHeight: 72,
  },
  emoji: {
    fontSize: 64,
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
