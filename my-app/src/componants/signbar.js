import { Component } from "react";
import LogoutButton from "./logoutbtn";

class SignBar extends Component {
  state = {};
  render() {
    return (
      <div className="signbar">
        <div className="align" id="signbar">
          <img
            id="profile-pic"
            className="ppic"
            src={this.props.user.pic}
            alt="pic"
          />
          <p id="name">{this.props.user.name}</p>
        </div>

        <LogoutButton></LogoutButton>
      </div>
    );
  }
}

export default SignBar;
