export type TradeTemplateBlock = {
  pair: string;
  entry: string;
  current: string;
  invalidation: string;
  conviction: string;
  thesis: string;
};

export type DraftEditorBlock =
  | {
      id: string;
      type: "code";
      code: string;
    }
  | {
      id: string;
      type: "trade";
      trade: TradeTemplateBlock;
    };

