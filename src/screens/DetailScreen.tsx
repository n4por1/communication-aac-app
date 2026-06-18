import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useLayoutEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import CommCardView from "../components/CommCardView";
import UtilityBar from "../components/UtilityBar";
import { useCardStore } from "../hooks/useCardStore";
import { CommCard, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;

const DetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { groupId } = route.params;
  const { getCard, getChildren, utilityCards } = useCardStore();
  const { width } = useWindowDimensions();
  const numColumns = width >= 768 ? 3 : 2;

  const group = getCard(groupId);
  const children = getChildren(groupId);

  useLayoutEffect(() => {
    if (group) {
      navigation.setOptions({
        title: group.label,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            accessibilityLabel="もどる"
          >
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backLabel}>もどる</Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [group, navigation]);

  if (!group) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>カードが見つかりません</Text>
      </View>
    );
  }

  if (children.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>表示できる項目がありません</Text>
        <Text style={styles.subText}>設定画面から項目を表示に変更してください</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        key={`detail-${numColumns}`}
        data={children}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: CommCard }) => (
          <CommCardView
            card={item}
            onPress={(card) =>
              navigation.navigate("Confirm", { cardId: card.id, groupId })
            }
          />
        )}
        contentContainerStyle={styles.list}
      />
      <UtilityBar
        cards={utilityCards}
        onPress={(card) => navigation.navigate("Confirm", { cardId: card.id })}
      />
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { padding: 8, paddingBottom: 8 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 12 },
  errorText: { fontSize: 20, color: "#64748B", textAlign: "center" },
  subText: { fontSize: 15, color: "#94A3B8", textAlign: "center" },
  backBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 6, paddingHorizontal: 4, gap: 4 },
  backIcon: { fontSize: 22, color: "#2563EB", fontWeight: "bold" },
  backLabel: { fontSize: 15, color: "#2563EB", fontWeight: "600" },
});
