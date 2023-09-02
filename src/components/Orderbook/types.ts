import { EMPTY_ORDER_BOOK } from "./utils";

export type OrderType = "BID" | "ASK";

export type Order = Array<string>;

export type OrderBookData = typeof EMPTY_ORDER_BOOK;
export type DecimalCount = { size: number; priceLevel: number };

export type Changes = { asks: Order[]; bids: Order[] };

export interface OrderRowProps {
  order: Order;
  maxTotal: number;
  type: OrderType;
  isTop?: boolean;
  isPriceLevelGlowing?: boolean;
  decimalCount: DecimalCount;
  initiallyHighlighted?: boolean;
}

export interface OrderTableProps {
  data: {
    orders: Order[];
    recentlyUpdated: string[];
    maxTotal: number;
  };
  decimalCount: DecimalCount;
  type: OrderType;
  reversed?: boolean;
}
