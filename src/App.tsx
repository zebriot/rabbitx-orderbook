import { OrderBook } from "./components";

export const App = () => {
  return <OrderBook pair="SOL-USD" decimalCount={{ size: 2, priceLevel: 4 }} />;
};

export default App;
