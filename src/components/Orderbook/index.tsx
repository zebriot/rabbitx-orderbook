import { useState, useEffect, useMemo, useReducer } from "react";
import { Centrifuge } from "centrifuge";

import { WEBSOCKET_URL, TEST_TOKEN } from "../../constants";
import Loader from "../Loader";
import { addTotalSum, updateOrders } from "./helpers";
import OrderTable from "./OrderTable";
import { OrderBookData } from "./types";
import { EMPTY_ORDER_BOOK } from "./utils";
import {
  HeadRowWrapper,
  OrderHead,
  OrderSubHead,
  Seperator,
  OrderBookContainer,
} from "./components";

/*  We Will be storing the data in a variable and update the state every 250ms with the variable's data
    if we set the state too frequently then the user experience isnt as expected when viewing the Orderbook as 
    the UI changes too frequently with the state. */

export const OrderBook = ({
  pair,
  decimalCount,
}: {
  pair: string;
  decimalCount: { size: number; priceLevel: number };
}) => {
  const [orderBookData, setOrderBookData] =
    useState<OrderBookData>(EMPTY_ORDER_BOOK);
  const [networkDown, setNetworkDown] = useState(false);

  const { sizeUnit, priceUnit, headings } = useMemo(() => {
    // Destructuring Unit symbols from the given pair , eg: BTC-USD
    const [sizeUnit, priceUnit] = pair.split("-");
    return {
      sizeUnit,
      priceUnit,
      headings: [
        {
          label: "Price",
          unit: priceUnit,
          justifyRight: false,
        },
        {
          label: "Amount",
          unit: sizeUnit,
          justifyRight: true,
        },
        {
          label: "Total",
          unit: sizeUnit,
          justifyRight: true,
        },
      ],
    };
  }, [pair]);

  /* Attaching Network listeners */
  useEffect(() => {
    const handleNetworkDown = () => {
      setNetworkDown(true);
    };

    const handleNetworkUp = () => {
      setNetworkDown(false);
    };

    window.addEventListener("online", handleNetworkUp);
    window.addEventListener("offline", handleNetworkDown);

    return () => {
      window.removeEventListener("online", handleNetworkUp);
      window.removeEventListener("offline", handleNetworkDown);
    };
  }, []);

  /* Connecting to client, Subscribing to new orderbook changes and processing order book's data */
  useEffect(() => {
    if (networkDown) {
      /* reinitializing the orderbookState */
      setOrderBookData(EMPTY_ORDER_BOOK);
      return;
    }

    const client = new Centrifuge(WEBSOCKET_URL, {
      token: TEST_TOKEN,
    });
    const sub = client.newSubscription("orderbook:" + pair);

    /* initializing a temporary orderbook where the data will be on every change */
    let orderBook: OrderBookData = EMPTY_ORDER_BOOK;

    /* When subscribed, we receive an initial set of bids and asks */
    sub.on("subscribed", function (ctx) {
      orderBook = {
        asks: {
          ...addTotalSum(ctx.data?.asks),
          recentlyUpdated: [],
        },
        /* reversing the bids on initial update so that the sum is calculated as expected in both cases */
        bids: {
          ...addTotalSum(ctx.data?.bids.reverse()),
          recentlyUpdated: [],
        },
        lastSequence: ctx.data?.sequence,
        lostPackages: 0,
      };
    });

    /* Managing the published changes  */
    sub.on("publication", function (ctx) {
      if (ctx.data?.asks && ctx.data?.bids) {
        const {
          orders: updatedAskOrders,
          updatedPriceLevels: updatedAskLevels,
        } = updateOrders(orderBook.asks.orders, ctx.data?.asks, "ASK");

        const {
          orders: updatedBidOrders,
          updatedPriceLevels: updatedBidLevels,
        } = updateOrders(orderBook.bids.orders, ctx.data?.bids, "BID");

        orderBook = {
          asks: {
            ...addTotalSum(updatedAskOrders),
            recentlyUpdated: updatedAskLevels,
          },
          bids: {
            ...addTotalSum(updatedBidOrders),
            recentlyUpdated: updatedBidLevels,
          },
          lastSequence: ctx.data?.sequence,
          lostPackages:
            orderBook.lostPackages +
            ctx.data?.sequence -
            (orderBook.lastSequence + 1), // Expected Sequence
        };
      }
    });

    sub.subscribe(); // Trigger subscribe process

    client.connect(); // Trigger actual connection establishementß

    /* Setting the state orderbook every 250 with the data from temporary orderbook */
    const intervalId = setInterval(() => {
      setOrderBookData(orderBook);
    }, 250);

    return () => {
      clearInterval(intervalId);
      sub.removeAllListeners();
      sub.unsubscribe();
      client.disconnect();
    };
  }, [networkDown, pair, orderBookData.lostPackages]);
  /* Resubscribe on network change, pair change or if the number of lostpackages is changed */

  if (!sizeUnit || !priceUnit) return null;

  return (
    <OrderBookContainer>
      {orderBookData.bids.orders.length === 0 &&
      orderBookData.asks.orders.length === 0 ? (
        <Loader />
      ) : (
        <>
          <table>
            <thead>
              <HeadRowWrapper>
                {headings.map((i) => (
                  <OrderHead key={i.label} $justifyRight={i.justifyRight}>
                    {i.label}
                    <OrderSubHead>{i.unit}</OrderSubHead>
                  </OrderHead>
                ))}
              </HeadRowWrapper>
            </thead>
            <OrderTable
              decimalCount={decimalCount}
              data={orderBookData.asks}
              type={"ASK"}
              reversed
            />
          </table>
          <Seperator />
          <table>
            <OrderTable
              decimalCount={decimalCount}
              data={orderBookData.bids}
              type={"BID"}
            />
          </table>
        </>
      )}
    </OrderBookContainer>
  );
};

export default OrderBook;
