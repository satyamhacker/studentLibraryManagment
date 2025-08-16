import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/tailwind.css";
import ContextData from "./Context/contextData.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ContextData>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ContextData>
);
