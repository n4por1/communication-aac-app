import { useMemo } from "react";
import cardsData from "../data/cards.json";
import { CommCard } from "../types";
import { useSettingsStore } from "./useSettingsStore";

const BASE_CARDS = cardsData as CommCard[];

export const useCardStore = () => {
  const { cardSettings, isLoaded } = useSettingsStore();

  const cards = useMemo(
    () =>
      BASE_CARDS.map((card) => {
        const override = cardSettings[card.id];
        if (!override) return card;
        return {
          ...card,
          visible: override.visible !== undefined ? override.visible : card.visible,
          customImageUri: override.customImageUri ?? card.customImageUri,
        };
      }),
    [cardSettings]
  );

  const getCard = (id: string): CommCard | undefined =>
    cards.find((c) => c.id === id);

  const homeCards = useMemo(
    () => cards.filter((c) => (c.kind === "direct" || c.kind === "group") && !c.parentId),
    [cards]
  );

  const utilityCards = useMemo(
    () => cards.filter((c) => c.kind === "utility"),
    [cards]
  );

  const getChildren = (groupId: string): CommCard[] => {
    const group = getCard(groupId);
    if (!group?.childrenIds) return [];
    return group.childrenIds
      .map((id) => cards.find((c) => c.id === id))
      .filter((c): c is CommCard => !!c && c.visible);
  };

  return { cards, homeCards, utilityCards, getCard, getChildren, isLoaded };
};
