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

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { homeCards, utilityCards, isLoaded } = useCardStore();
  const { width } = useWindowDimensions();
  const numColumns = width >= 768 ? 3 : 2;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Settings")}
          style={styles.settingsBtn}
          accessibilityLabel="設定"
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (!isLoaded) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  const handlePress = (card: CommCard) => {
    if (card.kind === "group") {
      navigation.navigate("Detail", { groupId: card.id });
    } else {
      navigation.navigate("Confirm", { cardId: card.id });
    }
  };

  return (
    <View style={styles.screen}>
      <FlatList
        key={`home-${numColumns}`}
        data={homeCards.filter((c) => c.visible)}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CommCardView card={item} onPress={handlePress} />
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

export default HomeScreen;

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { padding: 8, paddingBottom: 8 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { fontSize: 18, color: "#94A3B8" },
  settingsBtn: { padding: 8 },
  settingsIcon: { fontSize: 26 },
});
