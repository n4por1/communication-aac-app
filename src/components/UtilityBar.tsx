import React from "react";
import { StyleSheet, View } from "react-native";
import { CommCard } from "../types";
import CommCardView from "./CommCardView";

type Props = {
  cards: CommCard[];
  onPress: (card: CommCard) => void;
};

const UtilityBar: React.FC<Props> = ({ cards, onPress }) => (
  <View style={styles.bar}>
    {cards.map((card) => (
      <CommCardView key={card.id} card={card} onPress={onPress} size="small" />
    ))}
  </View>
);

export default UtilityBar;

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
});
