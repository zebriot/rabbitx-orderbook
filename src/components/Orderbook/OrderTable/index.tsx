import { MAX_ORDER_COUNT } from "../../../constants";
import { OrderRow } from "../OrderRow";
import { BodyWrapper } from "../components";
import { OrderTableProps } from "../types";

const OrderTable = ({
  decimalCount,
  data: { orders, recentlyUpdated, maxTotal },
  type,
  reversed = false,
}: OrderTableProps) => {
  const formattedOrders = reversed
    ? orders.slice(0, MAX_ORDER_COUNT).reverse()
    : orders.slice(0, MAX_ORDER_COUNT);

  return (
    <BodyWrapper type={type}>
      {formattedOrders.map((order, index) => (
        <OrderRow
          decimalCount={decimalCount}
          isPriceLevelGlowing={
            reversed
              ? /* If reversed, then the last element as per MAX_ORDER_COUNT */
                index === MAX_ORDER_COUNT - 1 ||
                /* Just in case length of formatted orders is less than MAX_ORDER_COUNT */
                index === formattedOrders.length - 1
              : index === 0 /* if not reversed, then the very first element */
          }
          initiallyHighlighted={recentlyUpdated.includes(order[0])}
          order={order}
          key={order[0]}
          maxTotal={maxTotal}
          type={type}
        />
      ))}
    </BodyWrapper>
  );
};

export default OrderTable;
