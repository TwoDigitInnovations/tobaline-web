import { useContext } from "react";
import { CurrencyContext } from "../src/context/CurrencyContext";

const symbols = {
  USD: "$",
  INR: "₹",
  KWD: "د.ك",
  EUR: "€",
};

const Price = ({ amountUSD }) => {
  const { currency, rates } = useContext(CurrencyContext);
  console.log(currency, rates);

  const convertedAmount = rates[currency]
    ? (amountUSD * rates[currency]).toFixed(2)
    : amountUSD;

  return (
    <span>
      {symbols[currency] || currency}{convertedAmount}
    </span>
  );
};

export default Price;
