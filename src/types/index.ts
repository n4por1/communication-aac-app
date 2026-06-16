export type ImageMode = "single" | "sequence";

export type ActionItem = {
  id: string;
  label: string;
  kana: string;
  aliases: string[];
  imageMode: ImageMode;
  images: string[];
  category: string;
  nounCategoryIds: string[];
  visible: boolean;
};

export type NounItem = {
  id: string;
  label: string;
  kana: string;
  category: string;
  defaultImage: string;
  customImageUri?: string | null;
  allowCustomImage: boolean;
  visible: boolean;
};

export type SelectionResult = {
  action: ActionItem;
  noun: NounItem;
  displayText: string;
};

export type RootStackParamList = {
  Home: undefined;
  NounSelection: { actionId: string };
  Confirmation: { actionId: string; nounId: string };
  Settings: undefined;
  NounSettings: undefined;
};
