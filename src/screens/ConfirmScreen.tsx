import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LargeButton from "../components/LargeButton";
import { useCardStore } from "../hooks/useCardStore";
import { CommCard, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Confirm">;

const CardDisplay: React.FC<{ card: CommCard }> = ({ card }) => (
  <View style={styles.itemCard}>
    <View style={styles.imageBlock}>
      {card.customImageUri ? (
        <Image source={{ uri: card.customImageUri }} style={styles.customImage} resizeMode="cover" />
      ) : (
        <Text style={styles.bigEmoji}>{card.defaultImages[0]}</Text>
      )}
    </View>
    <Text style={styles.itemLabel}>{card.label}</Text>
    {card.kana ? <Text style={styles.itemKana}>{card.kana}</Text> : null}
  </View>
);

const ConfirmScreen: React.FC<Props> = ({ navigation, route }) => {
  const { cardId, groupId } = route.params;
  const { getCard } = useCardStore();

  const card = getCard(cardId);
  const group = groupId ? getCard(groupId) : undefined;

  if (!card) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>データが見つかりません</Text>
        <LargeButton title="ホームに戻る" onPress={() => navigation.popToTop()} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {group ? (
        <>
          <CardDisplay card={group} />
          <Text style={styles.plus}>＋</Text>
          <View style={styles.childWrapper}>
            <CardDisplay card={card} />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => navigation.goBack()}
              accessibilityLabel="選びなおす"
              activeOpacity={0.8}
            >
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <CardDisplay card={card} />
      )}

      <View style={styles.buttons}>
        <LargeButton
          title="ホームに戻る"
          variant="primary"
          onPress={() => navigation.popToTop()}
          style={styles.btn}
        />
      </View>
    </ScrollView>
  );
};

export default ConfirmScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
    paddingBottom: 48,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    padding: 32,
  },
  errorText: { fontSize: 20, color: "#64748B" },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    width: "100%",
    maxWidth: 520,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  childWrapper: {
    width: "100%",
    maxWidth: 520,
    position: "relative",
  },
  removeBtn: {
    position: "absolute",
    top: -18,
    right: -18,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  removeBtnText: { fontSize: 28, color: "#FFFFFF", fontWeight: "bold", lineHeight: 32 },
  imageBlock: {
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  bigEmoji: { fontSize: 96, marginBottom: 0 },
  customImage: { width: 120, height: 120, borderRadius: 16 },
  itemLabel: { fontSize: 40, fontWeight: "bold", color: "#1E293B", marginBottom: 6, textAlign: "center" },
  itemKana: { fontSize: 22, color: "#94A3B8", textAlign: "center" },
  plus: { fontSize: 52, color: "#2563EB", fontWeight: "bold", marginVertical: 20 },
  buttons: { marginTop: 36, width: "100%", maxWidth: 520 },
  btn: { width: "100%" },
});
