export type CardKind = "direct" | "group" | "utility";
export type ImageKind = "pictogram" | "photo" | "sequence";

export type CommCard = {
  id: string;
  label: string;
  kana?: string;
  kind: CardKind;
  imageKind: ImageKind;
  defaultImages: string[];
  customImageUri?: string | null;
  allowCustomImage?: boolean;
  visible: boolean;
  parentId?: string | null;
  childrenIds?: string[];
};

export type RootStackParamList = {
  Home: undefined;
  Detail: { groupId: string };
  Confirm: { cardId: string; groupId?: string };
  Settings: undefined;
  CardSettings: undefined;
};
