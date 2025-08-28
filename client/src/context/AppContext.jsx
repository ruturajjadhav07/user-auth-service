import { createContext, useState } from "react";
import { AppConsonants } from "../util/constant";
import axios from "axios";
import { toast } from "react-toastify";

const AppContext = createContext(); // Declare AppContext

export default AppContext; // Export AppContext

export const AppContextProvider = (props) => {
  const backendURL = AppConsonants.URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const getUserData = async () => {
    try {
      const response = await axios.get(`${backendURL}/profile`);
      if (response.status === 200) {
        setUserData(response.data);
      } else {
        toast.error("Unable to retrive data");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const contextValue = {
    backendURL,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };
  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};
