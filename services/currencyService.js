export const getUserCurrency = async () => {
  try {

    const savedCurrency = localStorage.getItem("user_currency");
    if (savedCurrency) {
      return savedCurrency;
    }

    const res = await fetch("https://ipapi.co/json/");

    if (!res.ok) {
      throw new Error("Location API failed");
    }

    const data = await res.json();
    const currency = data.currency || "USD"; 

    localStorage.setItem("user_currency", currency);

    return currency;
  } catch (error) {
    console.log("Location error:", error);
    const fallback = localStorage.getItem("user_currency") || "KWD";
    return fallback;
  }
};


export const getRates = async (base = "KWD") => {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_API_KEY;
    console.log(API_KEY);

    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${base}`,
    );

    const data = await res.json();
    console.log(data.conversion_rates);
    return data.conversion_rates;
  } catch {
    return {};
  }
};
