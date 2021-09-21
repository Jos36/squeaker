import "./styles/App.css";
import "./styles/profile.css";
import "./styles/squeak.css";
import "./styles/post.css";
import NavBar from "./componants/nav.js";
import Header from "./componants/header.js";
import RightPanel from "./componants/rightpanel";
import { Fragment, Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import Home from "./componants/home";
import Explore from "./componants/explore";
import { connect } from "react-redux";
import returnActive from "./actions/active";
import { withAuth0 } from "@auth0/auth0-react";
import LoginButton from "./componants/loginbtn";
import profile from "./componants/profile";
import setActiveProfile from "./actions/setactiveprofile";
import setActiveUser from "./actions/setactiveuser";
import Squeak from "./componants/squeak";
import actionCreator from "./actions/actioncreator";

export const api = "http://localhost:5000";

class App extends Component {
  updateLocation() {
    const pages = {
      home: "",
      explore: "",
      notifaction: "",
      messages: "",
      bookmarks: "",
      lists: "",
    };
    const { location } = this.props;
    const Location = location.pathname.slice(1);
    if (Location.toLowerCase() in pages) {
      const upperLocation =
        Location.charAt(0).toUpperCase() + Location.slice(1);
      this.props.activePart(upperLocation);
      return upperLocation;
    } else {
      if (Location.split("/").length === 1) {
        this.props.activePart("Profile");
        this.props.setActiveProfile(Location.toLowerCase());
        return "Profile";
      }
      if (
        Location.split("/")[1] === "status" &&
        Location.split("/").length === 3
      ) {
        this.props.activePart("Tweet");
        return "Tweet";
      }
      this.props.activePart("Page not found 404");
    }
  }

  getUserInfo = async () => {
    const token = await this.props.auth0.getAccessTokenSilently();
    fetch(`${api}/info/${this.props.activeProfile}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((jsonData) => {
        this.props.actionCreator("SETUSERINFO", jsonData.user);
        return jsonData;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount(props) {
    this.updateLocation();
    this.getUserInfo();
  }
  componentDidUpdate(props) {
    this.updateLocation();
  }

  render() {
    const { user, isAuthenticated, isLoading } = this.props.auth0;
    if (isLoading) {
      return <div className="loading">loading</div>;
    }
    if (isAuthenticated) {
      this.props.setActiveUser(user.nickname);
      return (
        <Fragment>
          {this.props.isSqueakActive.status ? (
            <Squeak
              squeak={this.props.isSqueakActive}
              actionCreator={this.props.actionCreator}
              token={this.props.auth0.getAccessTokenSilently()}
              user={this.props.activeUserInfo}
            />
          ) : null}
          <NavBar></NavBar>
          <div id="mid-panel" className="mid-panel">
            <Header></Header>
            <Switch>
              <Route
                exact
                path="/"
                component={() => {
                  window.location.href = "/home";
                  return null;
                }}
              />
              <Route path="/home" component={Home} />
              <Route path="/explore" component={Explore} />
              <Route
                path={`/${this.props.activeProfile}`}
                component={profile}
              />
              <Route />
              <Route />
              <Route />
              <Route />
              <Route />
              <Route />
              <Route />
            </Switch>
          </div>
          <RightPanel></RightPanel>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <LoginButton></LoginButton>
        </Fragment>
      );
    }
  }
}
const mapStateToProps = (state) => {
  return state;
};
const mapDispatchToProps = () => {
  return {
    activePart: returnActive,
    setActiveProfile,
    setActiveUser,
    actionCreator,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps()
)(withAuth0(withRouter(App)));
