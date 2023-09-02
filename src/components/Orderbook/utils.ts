import { Order } from "./types";

export const EMPTY_ORDER_BOOK = {
  asks: {
    orders: [] as Array<Order>, // orders
    maxTotal: 0, // maximum total up till MAX_ORDER_COUNT to calculate depth when rendering
    recentlyUpdated: [] as Array<string>, // recently updated price levels that are meant to be highlighted
  },
  bids: {
    orders: [] as Array<Order>,
    maxTotal: 0,
    recentlyUpdated: [] as Array<string>,
  },
  lastSequence: 0,
  lostPackages: 0, // number of lostPackages
};
