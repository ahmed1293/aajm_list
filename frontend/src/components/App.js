import React from "react";
import ReactDOM from "react-dom";
import Tiles from "./Tiles";
import {api, APIContext} from "../api";


const App = () => (
	<APIContext.Provider value={api}>
		<Tiles/>
	</APIContext.Provider>
);

const wrapper = document.getElementById("app");

wrapper ? ReactDOM.render(<App/>, wrapper) : null;

