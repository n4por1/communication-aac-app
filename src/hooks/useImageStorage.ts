import * as FileSystem from "expo-file-system";
import { useCallback } from "react";
import { useSettingsStore } from "./useSettingsStore";

const CUSTOM_IMAGES_DIR = FileSystem.documentDirectory + "custom-images/";

const ensureDir = async (): Promise<void> => {
  const info = await FileSystem.getInfoAsync(CUSTOM_IMAGES_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(CUSTOM_IMAGES_DIR, { intermediates: true });
  }
};

export const useImageStorage = () => {
  const { setCustomImageUri, clearCustomImageUri } = useSettingsStore();

  const saveCustomImage = useCallback(
    async (cardId: string, sourceUri: string): Promise<void> => {
      await ensureDir();
      const match = sourceUri.match(/\.([a-zA-Z0-9]+)(\?|$)/);
      const ext = match ? match[1].toLowerCase() : "jpg";
      const dest = CUSTOM_IMAGES_DIR + cardId + "." + ext;
      await FileSystem.copyAsync({ from: sourceUri, to: dest });
      setCustomImageUri(cardId, dest);
    },
    [setCustomImageUri]
  );

  const deleteCustomImage = useCallback(
    async (cardId: string, customImageUri: string): Promise<void> => {
      try {
        await FileSystem.deleteAsync(customImageUri, { idempotent: true });
      } catch {
        // ファイルが存在しない場合は無視
      }
      clearCustomImageUri(cardId);
    },
    [clearCustomImageUri]
  );

  return { saveCustomImage, deleteCustomImage };
};
