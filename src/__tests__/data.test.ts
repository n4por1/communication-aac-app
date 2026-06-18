import cardsData from "../data/cards.json";
import { CommCard } from "../types";

const cards = cardsData as CommCard[];
const homeCards = cards.filter((c) => (c.kind === "direct" || c.kind === "group") && !c.parentId);
const utilityCards = cards.filter((c) => c.kind === "utility");
const groupCards = cards.filter((c) => c.kind === "group");
const childCards = cards.filter((c) => !!c.parentId);

describe("cards.json 基本構造", () => {
  it("すべてのカードに必須フィールドがある", () => {
    for (const card of cards) {
      expect(card.id).toBeTruthy();
      expect(card.label).toBeTruthy();
      expect(["direct", "group", "utility"]).toContain(card.kind);
      expect(["pictogram", "photo", "sequence"]).toContain(card.imageKind);
      expect(Array.isArray(card.defaultImages)).toBe(true);
      expect(card.defaultImages.length).toBeGreaterThanOrEqual(1);
      expect(typeof card.visible).toBe("boolean");
    }
  });

  it("IDが重複していない", () => {
    const ids = cards.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("ホームカード", () => {
  it("デフォルト表示のホームカードが8件存在する", () => {
    const visibleHome = homeCards.filter((c) => c.visible);
    expect(visibleHome).toHaveLength(8);
  });

  it("中優先度（visible: false）のホームカードが存在する", () => {
    const hiddenHome = homeCards.filter((c) => !c.visible);
    expect(hiddenHome.length).toBeGreaterThan(0);
  });

  it("direct と group のみ", () => {
    for (const card of homeCards) {
      expect(["direct", "group"]).toContain(card.kind);
    }
  });
});

describe("ユーティリティカード", () => {
  it("4件のユーティリティカードが存在する", () => {
    expect(utilityCards).toHaveLength(4);
  });
});

describe("グループカード", () => {
  it("グループカードは childrenIds を持つ", () => {
    for (const g of groupCards) {
      expect(Array.isArray(g.childrenIds)).toBe(true);
      expect(g.childrenIds!.length).toBeGreaterThan(0);
    }
  });

  it("childrenIds が実在するカードを参照している", () => {
    const ids = new Set(cards.map((c) => c.id));
    for (const g of groupCards) {
      for (const childId of g.childrenIds ?? []) {
        expect(ids.has(childId)).toBe(true);
      }
    }
  });
});

describe("子カード", () => {
  it("子カードは parentId を持つ", () => {
    for (const c of childCards) {
      expect(c.parentId).toBeTruthy();
    }
  });

  it("parentId が実在するグループカードを参照している", () => {
    const groupIds = new Set(groupCards.map((g) => g.id));
    for (const c of childCards) {
      expect(groupIds.has(c.parentId!)).toBe(true);
    }
  });
});
