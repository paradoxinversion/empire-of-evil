import React, { useState } from "react";

class Collapsable extends React.Component {
  state = {
    collapsed: false
  };

  toggleCollapsedState() {
    this.setState({ collapsed: !this.state.collapsed });
  }
  render() {
    return (
      <div style={{ display: "inline-block" }} className="collapsable">
        <p
          style={{ backgroundColor: "grey" }}
          onClick={() => {
            this.toggleCollapsedState();
          }}>
          {this.props.title}
        </p>
        {!this.state.collapsed && this.props.children}
      </div>
    );
  }
}

export default Collapsable;
