import React, { useState, useContext } from "react";

import {
  MoveOperation,
  AttackOperation,
  TakeOverOperation,
  NoOperations,
  Incident,
} from "./index";

import gameEvent from "../../../data/gameEvents/gameEvent";
import { GameDataContext } from "../../../context/GameDataContext";

const resolutionTypes = {
  move: MoveOperation,
  attack: AttackOperation,
  takeover: TakeOverOperation,
  combat: Incident,
  damage: Incident,
  "gain-agent": Incident,
  "damage-agent": Incident,
};

const TurnResolution = () => {
  const gameDataContext = useContext(GameDataContext);
  const activityConsequences = gameDataContext.gameState.activityConsequences;
  const operations = gameDataContext.gameState.operations;
  const incidents = gameDataContext.gameState.incidents;
  const gameEvents = [];
  activityConsequences.forEach((activityConsequence) => {
    if (activityConsequence.gameEventData.eventType !== "no-effect") {
      const gameEventData = {
        gameEventData: activityConsequence.gameEventData,
        targetTileId: activityConsequence.targetTileId,
        squads: activityConsequence.squads,
        target: activityConsequence.agent,
      };
      const newGameEvent = new gameEvent(gameEventData);
      gameEvents.push(newGameEvent);
    }
  });

  operations.forEach((operation) => {
    if (operation.gameEventData.eventType !== "no-effect") {
      const gameEventData = {
        gameEventData: operation.gameEventData,
        targetTileId: operation.targetTileId,
        squads: operation.squads,
      };
      const newGameEvent = new gameEvent(gameEventData);
      gameEvents.push(newGameEvent);
    }
  });

  incidents.forEach((incident) => {
    if (incident.eventType !== "none") {
      const gameEventData = {
        gameEventData: incident,
      };
      const newGameEvent = new gameEvent(gameEventData);
      gameEvents.push(newGameEvent);
    }
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
        gameDataContext.setScreen("main");
        gameDataContext.clearOperations();
        gameDataContext.clearIncidents();
        // ! DO THIS NEXT
      }
    };
    return (
      <ResolutionComponent
        operationData={currentGameEvent}
        currentGameEvent={currentGameEvent}
        next={next}
      />
    );
  } else {
    //TODO: Return a resolution component that says you executed no missions
    return (
      <NoOperations
        next={() => {
          gameDataContext.setScreen("main");
        }}
      />
    );
  }
};

export default TurnResolution;
