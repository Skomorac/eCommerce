import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Header />} />
            {/* Additional routes can be added here */}
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
