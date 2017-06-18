import React, { Component } from "react"; // eslint-disable-line no-unused-vars
import moment from "moment";
import "moment/locale/de"; // import the locale even though webpack ignores moment/locale
import "./App.scss";


moment.locale("de");
console.log( moment().format("dddd, DD.MM.YYYY HH:mm:ss"));


class App extends Component {
    render() {
        return (
            <div>
                <h1>Hello From React</h1>
                <p className="App-intro">
                    this is a test component.
                </p>
            </div>
        );
    }
}


export default App;

