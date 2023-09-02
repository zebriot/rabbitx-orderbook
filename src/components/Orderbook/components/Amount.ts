import styled from "styled-components";
import { BaseRow } from "./BaseRow";
import { colors } from "../../../colors";

export const Amount = styled.td`
  ${BaseRow}
  justify-content: flex-end;
  position: relative;
  position: relative;
`;

export const Depth = styled.div`
  height: 30px;
  position: absolute;
  left: 0;
`;

export default Amount;
