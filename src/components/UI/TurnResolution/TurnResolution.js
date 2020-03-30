import React, { useState } from "react";

import {
  MoveOperation,
  AttackOperation,
  TakeOverOperation,
  NoOperations,
  Incident
} from "./index";

import gameEvent from "../../../data/gameEvents/gameEvent";

const resolutionTypes = {
  move: MoveOperation,
  attack: AttackOperation,
  takeover: TakeOverOperation,
  combat: Incident
};

const TurnResolution = ({ gameManager }) => {
  const activityConsequences = gameManager.state.activityConsequences;
  const operations = gameManager.state.operations;
  const incidents = gameManager.state.incidents;
  debugger;
  const gameEvents = [];

  activityConsequences.forEach(activityConsequence => {
    const gameEventData = {
      gameEventData: activityConsequence.gameEventData,
      targetTileId: activityConsequence.targetTileId,
      squads: activityConsequence.squads
    };
    const newGameEvent = new gameEvent(gameEventData);
    gameEvents.push(newGameEvent);
  });

  operations.forEach(operation => {
    const gameEventData = {
      gameEventData: operation.gameEventData,
      targetTileId: operation.targetTileId,
      squads: operation.squads
    };
    const newGameEvent = new gameEvent(gameEventData);
    gameEvents.push(newGameEvent);
  });
  if (gameEvents.length > 0) {
    const [currentGameEventIndex, setCurrentGameEventIndex] = useState(0);
    const currentGameEvent = gameEvents[currentGameEventIndex];
    const ResolutionComponent =
      resolutionTypes[currentGameEvent.gameEventData.eventType];
    const next = () => {
      // if there's another operation, increment index
      if (currentGameEventIndex < gameEvents.length - 1) {
        setCurrentGameEventIndex(currentGameEventIndex + 1);
      } else {
        // if this is the last operation, go back to the main screen
        gameManager.setScreen("main");
        gameManager.clearOperations();
      }
    };
    return (
      <ResolutionComponent
        gameManager={gameManager}
        operationData={currentGameEvent}
        currentGameEvent={currentGameEvent}
        next={next}
      />
    );
  } else {
    //TODO: Return a resolution component that says you executed no missions
    return (
      <NoOperations
        gameManager={gameManager}
        next={() => {
          gameManager.setScreen("main");
        }}
      />
    );
  }
};

export default TurnResolution;
