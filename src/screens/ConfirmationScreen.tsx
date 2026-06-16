import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LargeButton from "../components/LargeButton";
import SequenceImage from "../components/SequenceImage";
import { useCommunicationStore } from "../hooks/useCommunicationStore";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Confirmation">;

const ConfirmationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { actionId, nounId } = route.params;
  const { getAction, getNoun } = useCommunicationStore();

  const action = getAction(actionId);
  const noun = getNoun(nounId);

  if (!action || !noun) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>データが見つかりません</Text>
        <LargeButton
          title="ホームに戻る"
          onPress={() => navigation.popToTop()}
        />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* 動作セクション */}
      <View style={styles.itemCard}>
        <View style={styles.imageBlock}>
          {action.imageMode === "sequence" ? (
            <SequenceImage images={action.images} size={80} />
          ) : (
            <Text style={styles.bigEmoji}>{action.images[0]}</Text>
          )}
        </View>
        <Text style={styles.itemLabel}>{action.label}</Text>
        <Text style={styles.itemKana}>{action.kana}</Text>
      </View>

      {/* ＋ セパレーター */}
      <Text style={styles.plus}>＋</Text>

      {/* 名詞セクション */}
      <View style={styles.itemCard}>
        <View style={styles.imageBlock}>
          {noun.customImageUri ? (
            <Image
              source={{ uri: noun.customImageUri }}
              style={styles.customImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.bigEmoji}>{noun.defaultImage}</Text>
          )}
        </View>
        <Text style={styles.itemLabel}>{noun.label}</Text>
        <Text style={styles.itemKana}>{noun.kana}</Text>
      </View>

      {/* 組み合わせ表示 */}
      <View style={styles.displayBox}>
        <Text style={styles.displayText}>
          {action.label}　＋　{noun.label}
        </Text>
      </View>

      {/* 操作ボタン */}
      <View style={styles.buttons}>
        <LargeButton
          title="選びなおす"
          variant="secondary"
          onPress={() => navigation.goBack()}
          style={styles.btn}
        />
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

export default ConfirmationScreen;

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
  errorText: {
    fontSize: 20,
    color: "#64748B",
  },
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
  imageBlock: {
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  bigEmoji: {
    fontSize: 96,
  },
  customImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  itemLabel: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 6,
    textAlign: "center",
  },
  itemKana: {
    fontSize: 22,
    color: "#94A3B8",
    textAlign: "center",
  },
  plus: {
    fontSize: 52,
    color: "#2563EB",
    fontWeight: "bold",
    marginVertical: 20,
  },
  displayBox: {
    backgroundColor: "#1E293B",
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 36,
    marginTop: 8,
    width: "100%",
    maxWidth: 520,
    alignItems: "center",
  },
  displayText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 2,
  },
  buttons: {
    flexDirection: "row",
    gap: 16,
    marginTop: 36,
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    maxWidth: 520,
  },
  btn: {
    flex: 1,
    minWidth: 180,
  },
});
