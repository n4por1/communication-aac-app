import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  images: string[];
  size?: number;
};

const SequenceImage: React.FC<Props> = ({ images, size = 56 }) => (
  <View style={styles.container}>
    <Text style={[styles.emoji, { fontSize: size }]}>{images[0]}</Text>
    <Text style={[styles.arrow, { fontSize: size * 0.4 }]}>→</Text>
    <Text style={[styles.emoji, { fontSize: size }]}>{images[1]}</Text>
  </View>
);

export default SequenceImage;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
    textAlign: "center",
  },
  arrow: {
    color: "#94A3B8",
    marginHorizontal: 6,
  },
});
