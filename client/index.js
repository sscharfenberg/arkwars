/***********************************************************************************************************************
 *
 * MAIN CLIENT APPLICATION FILE
 *
 * @type {React}
 *
 **********************************************************************************************************************/
import React            from "react"; // eslint-disable-line no-unused-vars
import ReactDom         from "react-dom";
import App from "./app/App"; // eslint-disable-line no-unused-vars


ReactDom.render(
    <App />
    , document.getElementById( "app" )
);
