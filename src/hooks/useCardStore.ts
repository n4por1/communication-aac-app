import { useMemo } from "react";
import cardsData from "../data/cards.json";
import { CommCard } from "../types";
import { useSettingsStore } from "./useSettingsStore";

const BASE_CARDS = cardsData as CommCard[];

export const useCardStore = () => {
  const { cardSettings, homeOrder, isLoaded } = useSettingsStore();

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

  const homeCards = useMemo(() => {
    const all = cards.filter((c) => (c.kind === "direct" || c.kind === "group") && !c.parentId);
    if (homeOrder.length === 0) return all;
    const ordered: CommCard[] = [];
    for (const id of homeOrder) {
      const card = all.find((c) => c.id === id);
      if (card) ordered.push(card);
    }
    for (const card of all) {
      if (!homeOrder.includes(card.id)) ordered.push(card);
    }
    return ordered;
  }, [cards, homeOrder]);

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
