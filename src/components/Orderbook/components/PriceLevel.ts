import styled from "styled-components";
import { BaseRow } from "./BaseRow";
import { OrderType } from "../types";
import { colors } from "../../../colors";

export const PriceLevel = styled.td<{
  $type: OrderType;
  $glowing?: boolean;
}>`
  ${BaseRow}
  border-radius: 8px;
  background: ${({ $glowing, $type }) =>
    $glowing
      ? $type === "ASK"
        ? colors.radicalRedOverlay25
        : colors.javaGreenOverlay25
      : colors.transparent};
  color: ${({ $type }) =>
    $type === "ASK" ? colors.radicalRed : colors.javaGreen};
`;

export default PriceLevel;
