import React, { Component } from "react";
import "../styles/Header.scss";
import logo from "../skylar_capital_management.png";

class Header extends Component {
  render() {
    return (
      <header className="Header">
        <div>
          <img alt="company logo" className="logo" src={logo} />
        </div>
      </header>
    );
  }
}

export default Header;
