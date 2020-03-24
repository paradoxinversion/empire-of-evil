import React from "react";

const Squad = ({ squad }) => {
  console.log(squad);
  return (
    <div className="border p-1">
      <div>
        <span className="mr-4">{squad.name}</span>{" "}
        <span className="mr-4">Members: {squad.members.length}</span>
        <span className="mr-4">{squad.leader}</span>
      </div>
    </div>
  );
};

export default Squad;
