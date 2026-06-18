import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@card_settings_v1";

type CardSetting = {
  visible: boolean;
  customImageUri: string | null;
};

type CardSettingsMap = Record<string, CardSetting>;

type SettingsContextType = {
  cardSettings: CardSettingsMap;
  setCardVisible: (cardId: string, visible: boolean) => void;
  setCustomImageUri: (cardId: string, uri: string) => void;
  clearCustomImageUri: (cardId: string) => void;
  isLoaded: boolean;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

const DEFAULT_SETTING: CardSetting = { visible: true, customImageUri: null };

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cardSettings, setCardSettings] = useState<CardSettingsMap>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((json) => {
      if (json) setCardSettings(JSON.parse(json));
      setIsLoaded(true);
    });
  }, []);

  const persist = useCallback((updated: CardSettingsMap) => {
    setCardSettings(updated);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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

  return (
    <SettingsContext.Provider
      value={{ cardSettings, setCardVisible, setCustomImageUri, clearCustomImageUri, isLoaded }}
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
