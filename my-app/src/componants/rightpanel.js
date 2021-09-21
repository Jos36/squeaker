import SearchBar from "./searchbar.js";
import { Component } from "react";

class Rightpanel extends Component {
  state = {};
  render() {
    return (
      <div id="right-panel" className="right-panel">
        <SearchBar></SearchBar>
      </div>
    );
  }
}

export default Rightpanel;
