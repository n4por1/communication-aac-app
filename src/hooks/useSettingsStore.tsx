import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "@card_settings_v1";
const ORDER_KEY = "@home_order_v1";

type CardSetting = {
  visible: boolean;
  customImageUri: string | null;
};

type CardSettingsMap = Record<string, CardSetting>;

type SettingsContextType = {
  cardSettings: CardSettingsMap;
  homeOrder: string[];
  setCardVisible: (cardId: string, visible: boolean) => void;
  setCustomImageUri: (cardId: string, uri: string) => void;
  clearCustomImageUri: (cardId: string) => void;
  setHomeOrder: (order: string[]) => void;
  isLoaded: boolean;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

const DEFAULT_SETTING: CardSetting = { visible: true, customImageUri: null };

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cardSettings, setCardSettings] = useState<CardSettingsMap>({});
  const [homeOrder, setHomeOrderState] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(SETTINGS_KEY),
      AsyncStorage.getItem(ORDER_KEY),
    ]).then(([settingsJson, orderJson]) => {
      if (settingsJson) setCardSettings(JSON.parse(settingsJson));
      if (orderJson) setHomeOrderState(JSON.parse(orderJson));
      setIsLoaded(true);
    });
  }, []);

  const persist = useCallback((updated: CardSettingsMap) => {
    setCardSettings(updated);
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  }, []);

  const setCardVisible = useCallback(
    (cardId: string, visible: boolean) => {
      const existing = cardSettings[cardId] ?? DEFAULT_SETTING;
      persist({ ...cardSettings, [cardId]: { ...existing, visible } });
    },
    [cardSettings, persist]
  );

  const setCustomImageUri = useCallback(
    (cardId: string, uri: string) => {
      const existing = cardSettings[cardId] ?? DEFAULT_SETTING;
      persist({ ...cardSettings, [cardId]: { ...existing, customImageUri: uri } });
    },
    [cardSettings, persist]
  );

  const clearCustomImageUri = useCallback(
    (cardId: string) => {
      const existing = cardSettings[cardId] ?? DEFAULT_SETTING;
      persist({ ...cardSettings, [cardId]: { ...existing, customImageUri: null } });
    },
    [cardSettings, persist]
  );

  const setHomeOrder = useCallback((order: string[]) => {
    setHomeOrderState(order);
    AsyncStorage.setItem(ORDER_KEY, JSON.stringify(order));
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        cardSettings,
        homeOrder,
        setCardVisible,
        setCustomImageUri,
        clearCustomImageUri,
        setHomeOrder,
        isLoaded,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsStore = (): SettingsContextType => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettingsStore must be used within SettingsProvider");
  return ctx;
};
