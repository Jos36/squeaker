import React, { Component } from "react";
import { connect } from "react-redux";
import setProfilePosts from "../actions/setprofileposts";
import { withAuth0 } from "@auth0/auth0-react";
import Post from "./post";
import { api } from "../App.js";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.getProfileInfo();
    this.file = React.createRef();
  }
  onImgClick = () => {
    this.file.current.click();
  };
  toggleFollow = async (data) => {
    const token = await this.props.auth0.getAccessTokenSilently();
    fetch(`${api}/follow`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((jsonData) => {
        console.log(jsonData);
        return jsonData;
      })
      .then(this.getProfileInfo)
      .catch((err) => {
        console.log(err);
      });
  };

  getProfileInfo = async () => {
    if (this.props.profilePosts.list) {
      console.log("no res needed");
    } else {
      const token = await this.props.auth0.getAccessTokenSilently();
      fetch(`${api}/${this.props.activeProfile}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((jsonData) => {
          console.log(jsonData);
          console.log("req success");
          return jsonData;
        })
        .then((res) => this.props.setProfilePosts(res))
        .catch((err) => {
          console.log(err);
        });
    }
  };

  uploadImg = async (data) => {
    const fd = new FormData();
    fd.append("image", data);
    const token = await this.props.auth0.getAccessTokenSilently();
    fetch(`${api}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        processData: false,
      },
      body: fd,
    })
      .then((jsonData) => {
        console.log(jsonData);
        return jsonData;
      })
      .then(this.getProfileInfo)
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    if (this.props.profilePosts !== "loading") {
      const {
        name,
        disc,
        following,
        followers,
        date_joined,
        location,
        pic,
        cover,
      } = this.props.profilePosts.user;
      return (
        <div>
          {this.props.auth0.user.nickname === this.props.activeProfile ? (
            <input
              type="file"
              id="file"
              ref={this.file}
              style={{ display: "none" }}
              onChange={(e) => this.uploadImg(e.target.files[0])}
            />
          ) : null}
          <div className="profile-img-block">
            <img className="profile-cover" src={cover} alt="" />
            <div className=" flex-row">
              <img
                id="img"
                className={
                  this.props.auth0.user.nickname === this.props.activeProfile
                    ? " profile-img  hover"
                    : "profile-img"
                }
                src={pic}
                alt=""
                accept="image/*"
                onClick={
                  this.props.auth0.user.nickname === this.props.activeProfile
                    ? this.onImgClick.bind()
                    : null
                }
              />

              {this.props.auth0.user.nickname === this.props.activeProfile ? (
                <button className="hover profile-btn">Edit profile</button>
              ) : (
                <button
                  onClick={() => {
                    this.toggleFollow({
                      follow: this.props.activeProfile,
                    });
                  }}
                  className="hover profile-btn"
                >
                  {this.props.profilePosts.followed ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>
          <div id="profile-name" className="profile-name">
            <h3>{name}</h3>
            <p>{disc}</p>
            <p>{location}</p>
            <p>Joined {date_joined}</p>
            <div>
              <p>
                Following{" "}
                {
                  following.split(" ").filter(function (value) {
                    return value !== "";
                  }).length
                }
              </p>
              <p>
                Followers{" "}
                {
                  followers.split(" ").filter(function (value) {
                    return value !== "";
                  }).length
                }
              </p>
            </div>
          </div>
          <div id="profilePosts">
            {this.props.profilePosts.postList
              ? this.props.profilePosts.postList.map((d) => {
                  let userData = d[0][1];
                  let postData = d[0][0];
                  let replyData = d[0][0];
                  let originalUserData = d[0][3];
                  if (postData.type === "reply") {
                    postData = d[0][1];
                    userData = d[0][2];
                    return (
                      <Post
                        id={replyData.id}
                        name={userData.name}
                        username={d.username}
                        payload={replyData.disc}
                        ppic={userData.pic}
                        type={replyData.type}
                        originalUserData={originalUserData}
                        postData={postData}
                        token={this.props.auth0.getAccessTokenSilently()}
                        getnew={this.getProfileInfo.bind()}
                      />
                    );
                  } else {
                    return (
                      <Post
                        id={postData.id}
                        name={userData.name}
                        username={d.username}
                        payload={postData.disc}
                        ppic={userData.pic}
                        likes={postData.like.length}
                        reply={postData.reply.length}
                        resqueak={postData.repost.length}
                        token={this.props.auth0.getAccessTokenSilently()}
                        getnew={this.getProfileInfo.bind()}
                        type="post"
                      />
                    );
                  }
                })
              : "loading"}
          </div>
        </div>
      );
    } else {
      return <div className="loading">loading</div>;
    }
  }
}

const mapStateToProps = (state) => {
  return state;
};
const mapDispatchToProps = () => {
  return {
    setProfilePosts: setProfilePosts,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps()
)(withAuth0(Profile));
