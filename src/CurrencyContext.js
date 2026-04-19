import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

const RATES = { INR: 1, USD: 1 / 83.5, EUR: 1 / 89.5 };
const SYMBOLS = { INR: "₹", USD: "$", EUR: "€" };

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem("spendsphere_currency") || "INR";
  });

  useEffect(() => {
    localStorage.setItem("spendsphere_currency", currency);
  }, [currency]);

  const fmt = (n) => {
    const converted = n * RATES[currency];
    return SYMBOLS[currency] + Math.abs(converted).toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: setCurrencyState, fmt }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
