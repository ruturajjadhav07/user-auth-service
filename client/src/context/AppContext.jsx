import { createContext, useEffect, useState } from "react";
import { AppConsonants } from "../util/constant";
import axios from "axios";
import { toast } from "react-toastify";

const AppContext = createContext(); // Declare AppContext

export default AppContext; // Export AppContext

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
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

  // to check user is logged in or not, if logged in then its state should be shown as login when refreshed
  const getAuthState = async () => {
    try {
      const response = await axios.get(backendURL + "/is-authenticated");
      if (response.status == 200 && response.data == true) {
        setIsLoggedIn(true);
        await getUserData();
      } else {
        isLoggedIn(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

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
