import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useLayoutEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import NounCard from "../components/NounCard";
import { useCommunicationStore } from "../hooks/useCommunicationStore";
import { NounItem, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "NounSelection">;

const NounSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { actionId } = route.params;
  const { getAction, getVisibleNounsForAction } = useCommunicationStore();
  const { width } = useWindowDimensions();
  const numColumns = width >= 768 ? 3 : 2;

  const action = getAction(actionId);
  const nouns = action ? getVisibleNounsForAction(action) : [];

  useLayoutEffect(() => {
    if (action) {
      navigation.setOptions({
        title: `${action.label}（${action.kana}）`,
      });
    }
  }, [action, navigation]);

  if (!action) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>動作が見つかりません</Text>
      </View>
    );
  }

  if (nouns.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>表示できる名詞がありません</Text>
        <Text style={styles.subText}>設定画面から名詞を表示に変更してください</Text>
      </View>
    );
  }

  return (
    <FlatList
      key={`nouns-${numColumns}`}
      data={nouns}
      numColumns={numColumns}
      keyExtractor={(item) => item.id}
      renderItem={({ item }: { item: NounItem }) => (
        <NounCard
          noun={item}
          onPress={(noun) =>
            navigation.navigate("Confirmation", {
              actionId,
              nounId: noun.id,
            })
          }
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
};

export default NounSelectionScreen;

const styles = StyleSheet.create({
  list: {
    padding: 8,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  errorText: {
    fontSize: 20,
    color: "#64748B",
    textAlign: "center",
  },
  subText: {
    fontSize: 15,
    color: "#94A3B8",
    textAlign: "center",
  },
});
