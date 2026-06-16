import * as FileSystem from "expo-file-system";
import { useCallback } from "react";
import { useSettingsStore } from "./useSettingsStore";

const CUSTOM_IMAGES_DIR = FileSystem.documentDirectory + "custom-images/";

const ensureDir = async (): Promise<void> => {
  const info = await FileSystem.getInfoAsync(CUSTOM_IMAGES_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(CUSTOM_IMAGES_DIR, {
      intermediates: true,
    });
  }
};

export const useImageStorage = () => {
  const { setCustomImageUri, clearCustomImageUri } = useSettingsStore();

  const saveCustomImage = useCallback(
    async (nounId: string, sourceUri: string): Promise<void> => {
      await ensureDir();
      const ext = sourceUri.split(".").pop() ?? "jpg";
      const dest = CUSTOM_IMAGES_DIR + nounId + "." + ext;
      await FileSystem.copyAsync({ from: sourceUri, to: dest });
      setCustomImageUri(nounId, dest);
    },
    [setCustomImageUri]
  );

  const deleteCustomImage = useCallback(
    async (nounId: string, customImageUri: string): Promise<void> => {
      try {
        await FileSystem.deleteAsync(customImageUri, { idempotent: true });
      } catch {
        // ファイルが存在しない場合は無視
      }
      clearCustomImageUri(nounId);
    },
    [clearCustomImageUri]
  );

  return { saveCustomImage, deleteCustomImage };
};
