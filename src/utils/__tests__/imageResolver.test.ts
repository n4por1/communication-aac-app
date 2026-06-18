import {
  resolveImage,
  resolveNounImage,
  resolveActionImages,
} from "../imageResolver";

describe("resolveImage", () => {
  it("絵文字は emoji タイプとして解決される", () => {
    expect(resolveImage("💧")).toEqual({ type: "emoji", value: "💧" });
    expect(resolveImage("☕")).toEqual({ type: "emoji", value: "☕" });
    expect(resolveImage("😣")).toEqual({ type: "emoji", value: "😣" });
  });

  it("file:// URI は uri タイプとして解決される", () => {
    expect(resolveImage("file:///var/mobile/image.jpg")).toEqual({
      type: "uri",
      value: "file:///var/mobile/image.jpg",
    });
  });

  it("https:// URI は uri タイプとして解決される", () => {
    expect(resolveImage("https://example.com/image.png")).toEqual({
      type: "uri",
      value: "https://example.com/image.png",
    });
  });

  it("/ から始まる絶対パスは uri タイプとして解決される", () => {
    expect(resolveImage("/path/to/image.png")).toEqual({
      type: "uri",
      value: "/path/to/image.png",
    });
  });

  it("./ から始まる相対パスは uri タイプとして解決される", () => {
    expect(resolveImage("./assets/images/nouns/water.png")).toEqual({
      type: "uri",
      value: "./assets/images/nouns/water.png",
    });
  });
});

describe("resolveNounImage", () => {
  it("customImageUri がある場合はそちらを優先する", () => {
    const result = resolveNounImage("💧", "file:///custom/image.jpg");
    expect(result).toEqual({ type: "uri", value: "file:///custom/image.jpg" });
  });

  it("customImageUri が null の場合は defaultImage を使う", () => {
    const result = resolveNounImage("💧", null);
    expect(result).toEqual({ type: "emoji", value: "💧" });
  });

  it("customImageUri が undefined の場合は defaultImage を使う", () => {
    const result = resolveNounImage("💧", undefined);
    expect(result).toEqual({ type: "emoji", value: "💧" });
  });

  it("defaultImage がファイルパスの場合も正しく解決される", () => {
    const result = resolveNounImage("./assets/nouns/water.png", null);
    expect(result).toEqual({ type: "uri", value: "./assets/nouns/water.png" });
  });
});

describe("resolveActionImages", () => {
  it("単一画像を正しく解決する", () => {
    const results = resolveActionImages(["😣"]);
    expect(results).toEqual([{ type: "emoji", value: "😣" }]);
  });

  it("sequence の2枚画像を正しく解決する", () => {
    const results = resolveActionImages(["☕", "💧"]);
    expect(results).toEqual([
      { type: "emoji", value: "☕" },
      { type: "emoji", value: "💧" },
    ]);
  });

  it("空配列を渡しても空配列が返る", () => {
    expect(resolveActionImages([])).toEqual([]);
  });
});
