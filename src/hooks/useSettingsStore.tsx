import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@noun_settings_v1";

type NounSetting = {
  visible: boolean;
  customImageUri: string | null;
};

type NounSettingsMap = Record<string, NounSetting>;

type SettingsContextType = {
  nounSettings: NounSettingsMap;
  setNounVisible: (nounId: string, visible: boolean) => void;
  setCustomImageUri: (nounId: string, uri: string) => void;
  clearCustomImageUri: (nounId: string) => void;
  isLoaded: boolean;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

const DEFAULT_SETTING: NounSetting = { visible: true, customImageUri: null };

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [nounSettings, setNounSettings] = useState<NounSettingsMap>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((json) => {
      if (json) setNounSettings(JSON.parse(json));
      setIsLoaded(true);
    });
  }, []);

  const persist = useCallback((updated: NounSettingsMap) => {
    setNounSettings(updated);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const setNounVisible = useCallback(
    (nounId: string, visible: boolean) => {
      const existing = nounSettings[nounId] ?? DEFAULT_SETTING;
      persist({ ...nounSettings, [nounId]: { ...existing, visible } });
    },
    [nounSettings, persist]
  );

  const setCustomImageUri = useCallback(
    (nounId: string, uri: string) => {
      const existing = nounSettings[nounId] ?? DEFAULT_SETTING;
      persist({ ...nounSettings, [nounId]: { ...existing, customImageUri: uri } });
    },
    [nounSettings, persist]
  );

  const clearCustomImageUri = useCallback(
    (nounId: string) => {
      const existing = nounSettings[nounId] ?? DEFAULT_SETTING;
      persist({ ...nounSettings, [nounId]: { ...existing, customImageUri: null } });
    },
    [nounSettings, persist]
  );

  return (
    <SettingsContext.Provider
      value={{
        nounSettings,
        setNounVisible,
        setCustomImageUri,
        clearCustomImageUri,
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
