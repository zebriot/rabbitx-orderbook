import styled from "styled-components";
import { OrderType } from "../types";

export const BodyWrapper = styled.tbody<{ type: OrderType }>`
  display: flex;
  flex-direction: column;
  height: 330px;
  justify-content: ${({ type }) =>
    type === "ASK" ? "flex-end" : "flex-start"};
`;

