import { CommCard } from "../types";

export const getChildren = (group: CommCard, allCards: CommCard[]): CommCard[] =>
  (group.childrenIds ?? [])
    .map((id) => allCards.find((c) => c.id === id))
    .filter((c): c is CommCard => !!c && c.visible);
