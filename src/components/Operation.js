import React from "react";

const Operation = ({ operation, setModalOpen }) => {
  return (
    <div className="fixed top-0 left-0 bg-gray-600 h-screen w-screen flex justify-center items-center">
      <div id="operation-scout" className="absolute border bg-white p-4">
        <p>Operation: {operation.name}</p>
        <p>{operation.description}</p>
        <p>Max Squads: {operation.maxSquads}</p>
        <p>Squad Member Limit: {operation.squadMemberLimit}</p>
        <div className="operation-prep">
          <select>
            <option value="">Select Squads</option>
          </select>
        </div>
        <button className="border rounded p-1">Prepare Mission</button>
        <button
          className="border rounded p-1"
          onClick={() => setModalOpen(false)}
        >
          Close Modal
        </button>
      </div>
    </div>
  );
};

export default Operation;
