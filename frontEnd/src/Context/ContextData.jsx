import React, { useState } from "react";
import Context from "./Context";

const ContextData = (props) => {
  const [loggedInUserMail, setLoggedInUserMail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [MailDetail, setMailDetail] = useState([]);

  const Mail = (email) => {
    setLoggedInUserMail(email);
    return loggedInUserMail;
  };
  const logIn = () => {
    setIsLoggedIn(true);
    return isLoggedIn;
  };

  const makeLoggedOut = () => {
    setIsLoggedIn(false);
    return isLoggedIn;
  };

  const saveMailDetail = (mailDetail) => {
    setMailDetail([mailDetail]);
  };

  return (
    <>
      <Context.Provider
        value={{
          loggedInUserMail,
          Mail,
          logIn,
          makeLoggedOut,
          saveMailDetail,
          MailDetail,
        }}
      >
        {props.children}
      </Context.Provider>
    </>
  );
};

export default ContextData;
