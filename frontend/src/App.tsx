import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Routes>
            {/* The HomePage is already included within the Header component */}
            {/* Additional routes can be added here */}
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
