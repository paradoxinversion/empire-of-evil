import React from "react";

class Collapsable extends React.Component {
  state = {
    collapsed: false
  };

  toggleCollapsedState() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    return (
      <div
        className={`collapsable flex flex-col${
          this.props.width ? ` w-${this.props.width}` : ""
        }`}>
        <p
          className="bg-black text-white"
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
