import { Component } from "react";
import autosize from "autosize";

const uploadIcon = (
  <div className=" hover icon-holder  ">
    <svg viewBox="0 0 24 24" aria-hidden="true" className="post-icon">
      <g>
        <path d="M19.75 2H4.25C3.01 2 2 3.01 2 4.25v15.5C2 20.99 3.01 22 4.25 22h15.5c1.24 0 2.25-1.01 2.25-2.25V4.25C22 3.01 20.99 2 19.75 2zM4.25 3.5h15.5c.413 0 .75.337.75.75v9.676l-3.858-3.858c-.14-.14-.33-.22-.53-.22h-.003c-.2 0-.393.08-.532.224l-4.317 4.384-1.813-1.806c-.14-.14-.33-.22-.53-.22-.193-.03-.395.08-.535.227L3.5 17.642V4.25c0-.413.337-.75.75-.75zm-.744 16.28l5.418-5.534 6.282 6.254H4.25c-.402 0-.727-.322-.744-.72zm16.244.72h-2.42l-5.007-4.987 3.792-3.85 4.385 4.384v3.703c0 .413-.337.75-.75.75z"></path>
        <circle cx="8.868" cy="8.309" r="1.542"></circle>
      </g>
    </svg>
  </div>
);
class Squeak extends Component {
  componentDidMount() {
    this.textarea.focus();
    autosize(this.textarea);
    console.log(this.props.user);
  }

  postSqueak = async (data) => {
    console.log(await this.props.token);
    fetch("http://127.0.0.1:5000/squeak", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await this.props.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((jsonData) => {
        console.log(jsonData);
        return jsonData;
      })
      .then((res) => console.log("suCCeSS NEGA"))
      .then(() => {
        this.props.actionCreator("SETISSQUEAK", { status: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  postReply = async (data) => {
    console.log(await this.props.token);
    fetch(`http://127.0.0.1:5000/reply/${this.props.squeak.post.props.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await this.props.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((jsonData) => {
        console.log(jsonData);
        return jsonData;
      })
      .then((res) => console.log("suCCeSS NEGA"))
      .then(() => {
        this.props.actionCreator("SETISSQUEAK", { status: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <div className="squeak shade-in">
        <div
          className="squeak-background"
          onClick={() => {
            this.props.actionCreator("SETISSQUEAK", { status: false });
          }}
        ></div>
        <div className="squeak-window">
          <div className="squeak-header">
            <div>
              {" "}
              <svg
                onClick={() => {
                  this.props.actionCreator("SETISSQUEAK", { status: false });
                }}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="icon hover"
              >
                <g>
                  <path d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z"></path>
                </g>
              </svg>
            </div>
          </div>
          {this.props.squeak.type === "reply" ? (
            <div id="original-post">{this.props.squeak.post}</div>
          ) : null}
          <div id="squeak-body" className="squeak-body">
            <div className="ppic-bar">
              <img className="ppic" src={this.props.user.pic} alt="ppic" />
            </div>
            <div id="squeak-input-wrapper" className="squeak-input-wrapper">
              <div id="input-section" className="input-section">
                <textarea
                  className="input"
                  ref={(c) => (this.textarea = c)}
                  name=""
                  id=""
                  cols="30"
                  rows="10"
                  placeholder={
                    this.props.squeak.type === "reply"
                      ? "What's your reply? "
                      : "What's happening?"
                  }
                ></textarea>
              </div>
              <div id="submit-section" className="submit-section">
                <div id="upload-icons" className="upload-icons">
                  {uploadIcon}
                </div>
                <div id="submit-btn">
                  <input
                    type="submit"
                    value="squeak"
                    className=" d-hover btn submit-btn"
                    onClick={() => {
                      if (this.textarea.value.length === 0) {
                        console.log("empty sir");
                      } else {
                        {
                          this.props.squeak.type === "reply"
                            ? this.postReply(this.textarea.value)
                            : this.postSqueak(this.textarea.value);
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Squeak;
