import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatNumberString, getOrderStyling } from "../helpers";
import { OrderRowProps } from "../types";
import { Amount, Depth, PriceLevel, RowWrapper } from "../components";
import { colors } from "../../../colors";

export const OrderRow = ({
  order,
  maxTotal,
  type,
  isPriceLevelGlowing = false,
  decimalCount,
  initiallyHighlighted = false,
}: OrderRowProps) => {
  const [tempHighlighted, setTempHighlighted] =
    useState<boolean>(initiallyHighlighted);
  const lastTimeout = useRef<NodeJS.Timeout>();
  const color = useMemo(() => getOrderStyling(type), [type]);
  /* Formatted data with the required decimal points */
  const { priceLevel, size, totalSize } = {
    priceLevel: formatNumberString(order[0], decimalCount.priceLevel),
    size: formatNumberString(order[1], decimalCount.size),
    totalSize: formatNumberString(order[2], decimalCount.size),
  };

  /* Highlighting order if initially highlighted */
  useEffect(() => {
    if (initiallyHighlighted) {
      lastTimeout.current && clearTimeout(lastTimeout.current);
      setTempHighlighted(true);
      lastTimeout.current = setTimeout(() => setTempHighlighted(false), 500);
    }
  }, [initiallyHighlighted]);

  return (
    <RowWrapper key={order[0]}>
      <PriceLevel $glowing={isPriceLevelGlowing} $type={type}>
        {priceLevel}
      </PriceLevel>
      <Amount
        style={{
          color: tempHighlighted ? color.solid : colors.gullGray,
        }}
      >
        {size}
      </Amount>
      <Amount
        style={{
          color: tempHighlighted ? color.solid : colors.gullGray,
        }}
      >
        {totalSize}
        <Depth
          style={{
            width: `${(parseFloat(order[2]) / maxTotal) * 100}%`,
            backgroundColor: color.overlay,
          }}
        />
      </Amount>
    </RowWrapper>
  );
};
