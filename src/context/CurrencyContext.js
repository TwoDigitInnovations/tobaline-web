import { createContext, useEffect, useState } from "react";
import { getUserCurrency, getRates } from "../../services/currencyService";

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("USD");
  const [rates, setRates] = useState({});

  useEffect(() => {
    const init = async () => {
      const userCurrency = await getUserCurrency();
      const exchangeRates = await getRates("KWD");
      
      console.log(exchangeRates);

      setCurrency(userCurrency);
      setRates(exchangeRates);
    };

    init();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, rates }}>
      {children}
    </CurrencyContext.Provider>
  );
};
