import styled from "styled-components";
import { BaseRow } from "./BaseRow";
import { colors } from "../../../colors";

export const OrderHead = styled.th<{ $justifyRight?: boolean }>`
  ${BaseRow}
  justify-content:  ${({ $justifyRight = false }) =>
    $justifyRight ? "flex-end" : "flex-start"};
  color: ${colors.comet};
`;

export const OrderSubHead = styled.span`
  padding: 2px 5px;
  background-color: ${colors.clay};
  border-radius: 6px;
  margin-left: 6px;
  font-size: 14px;
`;

export const HeadRowWrapper = styled.tr`
  display: flex;
  margin: 4px 0 10px 0;
`;

