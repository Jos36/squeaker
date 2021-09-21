import { Component } from "react";
import Post from "./post";
import React from "react";
import setPosts from "../actions/setposts";
import { connect } from "react-redux";
import { withAuth0 } from "@auth0/auth0-react";
import { api } from "../App.js";

class Home extends Component {
  getPosts = async () => {
    const token = await this.props.auth0.getAccessTokenSilently();
    fetch(`${api}/home/${this.props.auth0.user.nickname}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((jsonData) => {
        console.log(jsonData);
        return jsonData;
      })
      .then((res) => this.props.setPosts(res))
      .catch((err) => {
        console.log(err);
      });
  };
  constructor(props) {
    super(props);
    this.getPosts();
  }
  render() {
    return (
      <div id="home" className="home">
        {this.props.posts.list ? (
          this.props.posts.list.map((d) => {
            let userData = d[0][1];
            let postData = d[0][0];
            let replyData = d[0][0];
            let originalUserData = d[0][3];
            if (postData.type === "reply") {
              postData = d[0][1];
              userData = d[0][2];
              return (
                <Post
                  key={"r" + replyData.id}
                  id={replyData.id}
                  name={userData.name}
                  username={d.username}
                  payload={replyData.disc}
                  ppic={userData.pic}
                  type={replyData.type}
                  originalUserData={originalUserData}
                  postData={postData}
                  token={this.props.auth0.getAccessTokenSilently()}
                />
              );
            } else {
              return (
                <Post
                  key={"p" + postData.id}
                  id={postData.id}
                  name={userData.name}
                  username={d.username}
                  payload={postData.disc}
                  ppic={userData.pic}
                  likes={postData.like.length}
                  reply={postData.reply.length}
                  resqueak={postData.repost.length}
                  token={this.props.auth0.getAccessTokenSilently()}
                  getnew={this.getPosts.bind()}
                  type="post"
                />
              );
            }
          })
        ) : (
          <div className="loading">loading</div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};
const mapDispatchToProps = () => {
  return {
    setPosts: setPosts,
  };
};
export default connect(mapStateToProps, mapDispatchToProps())(withAuth0(Home));
