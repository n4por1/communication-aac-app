import { getChildren } from "../selection";
import { CommCard } from "../../types";

const mockGroup: CommCard = {
  id: "pain",
  label: "痛い",
  kana: "いたい",
  kind: "group",
  imageKind: "pictogram",
  defaultImages: ["😣"],
  visible: true,
  childrenIds: ["pain_head", "pain_chest", "pain_stomach"],
};

const mockCards: CommCard[] = [
  { id: "pain_head",    label: "頭",   kana: "あたま", kind: "direct", imageKind: "pictogram", defaultImages: ["🧠"], visible: true,  parentId: "pain" },
  { id: "pain_chest",   label: "胸",   kana: "むね",   kind: "direct", imageKind: "pictogram", defaultImages: ["❤️"], visible: false, parentId: "pain" },
  { id: "pain_stomach", label: "お腹", kana: "おなか", kind: "direct", imageKind: "pictogram", defaultImages: ["🤢"], visible: true,  parentId: "pain" },
  { id: "water",        label: "水",   kana: "みず",   kind: "direct", imageKind: "pictogram", defaultImages: ["💧"], visible: true },
];

describe("getChildren", () => {
  it("グループの childrenIds に対応する visible なカードを返す", () => {
    const result = getChildren(mockGroup, mockCards);
    expect(result.map((c) => c.id)).toContain("pain_head");
    expect(result.map((c) => c.id)).toContain("pain_stomach");
  });

  it("visible=false の子カードは除外される", () => {
    const result = getChildren(mockGroup, mockCards);
    expect(result.map((c) => c.id)).not.toContain("pain_chest");
  });

  it("childrenIds に含まれていないカードは返さない", () => {
    const result = getChildren(mockGroup, mockCards);
    expect(result.map((c) => c.id)).not.toContain("water");
  });

  it("childrenIds が空のグループは空配列を返す", () => {
    const emptyGroup: CommCard = { ...mockGroup, childrenIds: [] };
    expect(getChildren(emptyGroup, mockCards)).toHaveLength(0);
  });

  it("childrenIds がないグループは空配列を返す", () => {
    const noChildren: CommCard = { ...mockGroup, childrenIds: undefined };
    expect(getChildren(noChildren, mockCards)).toHaveLength(0);
  });
});
