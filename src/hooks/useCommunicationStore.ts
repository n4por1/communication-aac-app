import { useMemo } from "react";
import actionsData from "../data/actions.json";
import nounsData from "../data/nouns.json";
import { ActionItem, NounItem } from "../types";
import { getNounsForAction } from "../utils/selection";
import { useSettingsStore } from "./useSettingsStore";

const BASE_ACTIONS = actionsData as ActionItem[];
const BASE_NOUNS = nounsData as NounItem[];

export const useCommunicationStore = () => {
  const { nounSettings, isLoaded } = useSettingsStore();

  const actions = useMemo(
    () => BASE_ACTIONS.filter((a) => a.visible),
    []
  );

  const nouns = useMemo(
    () =>
      BASE_NOUNS.map((noun) => {
        const override = nounSettings[noun.id];
        if (!override) return noun;
        return {
          ...noun,
          visible:
            override.visible !== undefined ? override.visible : noun.visible,
          customImageUri: override.customImageUri ?? noun.customImageUri,
        };
      }),
    [nounSettings]
  );

  const getAction = (id: string): ActionItem | undefined =>
    BASE_ACTIONS.find((a) => a.id === id);

  const getNoun = (id: string): NounItem | undefined =>
    nouns.find((n) => n.id === id);

  const getVisibleNounsForAction = (action: ActionItem): NounItem[] =>
    getNounsForAction(action, nouns);

  return { actions, nouns, getAction, getNoun, getVisibleNounsForAction, isLoaded };
};
