import React from "react";
import Collapsable from "./Collapsable";
import crosshair from "./crosshair.png";
import Agent from "./Agent";

const Agents = () => {
  return (
    <Collapsable title="EVIL Agents">
      <h2>Soldiers</h2>
      {/* <Agent agent/> */}
      <h2>Scientists</h2>
      <h2>Adminstrators</h2>
    </Collapsable>
  );
};

export default Agents;
