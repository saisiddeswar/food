import { createContext } from "react";

const Info = createContext();

const Infoprovide = ({ children }) => {
  const siddu = {
    name: "Siddharth",
    age: 20,
    country: "India",
  };

  return (
    <Info.Provider value={{ siddu }}>  {/* Corrected 'values' to 'value' */}
      {children}
    </Info.Provider>
  );
};

export { Info, Infoprovide };
