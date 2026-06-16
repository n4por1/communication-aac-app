/**
 * 画像文字列の種別を判定し、適切なレンダリング方法を返すユーティリティ。
 *
 * MVP: defaultImage は絵文字文字列。将来的に PNG アセットへ差し替える際は
 * images フィールドにパス文字列を入れることで自動切替される。
 */

export type ImageSource =
  | { type: "emoji"; value: string }
  | { type: "uri"; value: string };

const isUri = (s: string): boolean =>
  s.startsWith("file://") ||
  s.startsWith("http://") ||
  s.startsWith("https://") ||
  s.startsWith("/") ||
  s.startsWith("./");

export const resolveImage = (image: string): ImageSource =>
  isUri(image)
    ? { type: "uri", value: image }
    : { type: "emoji", value: image };

/** 名詞画像: customImageUri が存在する場合はそちらを優先 */
export const resolveNounImage = (
  defaultImage: string,
  customImageUri?: string | null
): ImageSource =>
  customImageUri
    ? { type: "uri", value: customImageUri }
    : resolveImage(defaultImage);

/** 動作画像リスト: 全要素を解決して返す */
export const resolveActionImages = (images: string[]): ImageSource[] =>
  images.map(resolveImage);
