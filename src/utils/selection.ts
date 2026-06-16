import { ActionItem, NounItem, SelectionResult } from "../types";

export const createSelectionResult = (
  action: ActionItem,
  noun: NounItem
): SelectionResult => ({
  action,
  noun,
  displayText: `${action.label} + ${noun.label}`,
});

export const getNounsForAction = (
  action: ActionItem,
  allNouns: NounItem[]
): NounItem[] =>
  allNouns.filter(
    (noun) =>
      action.nounCategoryIds.includes(noun.category) && noun.visible
  );
