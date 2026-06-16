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
import ActionCard from "../components/ActionCard";
import { useCommunicationStore } from "../hooks/useCommunicationStore";
import { ActionItem, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { actions, isLoaded } = useCommunicationStore();
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

  return (
    <FlatList
      key={`home-${numColumns}`}
      data={actions}
      numColumns={numColumns}
      keyExtractor={(item) => item.id}
      renderItem={({ item }: { item: ActionItem }) => (
        <ActionCard
          action={item}
          onPress={(action) =>
            navigation.navigate("NounSelection", { actionId: action.id })
          }
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  list: {
    padding: 8,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#94A3B8",
  },
  settingsBtn: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 26,
  },
});
