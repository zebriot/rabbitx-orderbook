import { colors } from "../../colors";
import {  Order, OrderType } from "./types";
import { DEFAULT_DECIMAL_COUNT, MAX_ORDER_COUNT } from "../../constants";


export const updateOrders = (
  orders: Array<Array<string>>,
  changes: Array<Array<string>>,
  type: OrderType
) => {
  /* If there are no changes, return the original order */
  if (changes.length === 0)
    return {
      orders,
      updatedPriceLevels: [],
    };

  const updatedOrders = [...orders];
  const updatedPriceLevels: Array<string> = [];

  changes.forEach((change) => {
    const priceLevel = parseFloat(change[0]);
    const size = change[1];

    const indexToUpdate = updatedOrders.findIndex(
      (item) => parseFloat(item[0]) === priceLevel
    ); /* Does the price level exists */

    if (size === "0") {
      /* If the price level exists and the size is zero, remove that particular price level */
      if (indexToUpdate !== -1) {
        updatedOrders.splice(indexToUpdate, 1);
      }
    } else {
      /* If the price level exists and the size is not zero, update that particular price level */
      if (indexToUpdate !== -1) {
        updatedOrders[indexToUpdate] = change;
      } else {
        /* If the price level doesnt exits, and the size is not zero, 
        Find where to insert the price level as per the order is maintained and then insert it there */
        let insertIndex =
          type === "ASK"
            ? findInsertIndexAscending(updatedOrders, priceLevel)
            : findInsertIndexDescending(updatedOrders, priceLevel);
        updatedOrders.splice(insertIndex, 0, change);
      }
    }
    updatedPriceLevels.push(change[0]);
  });

  return { orders: updatedOrders, updatedPriceLevels };
};

const findInsertIndexDescending = (
  arr: Array<Array<string>>,
  priceLevel: number
) => {
  return arr.findIndex((item) => parseFloat(item[0]) < priceLevel);
};

const findInsertIndexAscending = (
  arr: Array<Array<string>>,
  priceLevel: number
) => {
  return arr.findIndex((item) => parseFloat(item[0]) > priceLevel);
};

export const addTotalSum = (orders: Array<Order>) => {
  /* Adds total size till order's price level at its 2nd index */
  const totalSums: number[] = [];
  return {
    orders: orders.map((order: Array<string>, index) => {
      if (index > MAX_ORDER_COUNT - 1)
        return order; /* Stop calculating totalSums if the index is anywhere past MAX_ORDER_COUNT that we are displaying  */
      const size = parseFloat(order[1]);
      const updatedLevel = [...order];
      const totalSum: number = index === 0 ? size : size + totalSums[index - 1];
      updatedLevel[2] = totalSum.toFixed(4);
      totalSums.push(totalSum);
      return updatedLevel;
    }),
    maxTotal: totalSums[MAX_ORDER_COUNT - 1] || 0,
  };
};

export const formatNumberString = (
  numberString: string,
  decimalCount: number = DEFAULT_DECIMAL_COUNT
) => {
  return Number(numberString)
    .toFixed(decimalCount)
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

export const getOrderStyling = (type: OrderType) => {
  return type === "ASK"
    ? {
        solid: colors.radicalRed,
        overlay: colors.radicalRedOverlay25,
      }
    : {
        solid: colors.javaGreen,
        overlay: colors.javaGreenOverlay25,
      };
};
