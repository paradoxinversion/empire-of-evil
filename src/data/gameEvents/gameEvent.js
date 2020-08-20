/* 
  gameEven objects are the interface for specific game events (activity, incident, op)
*/
import { getUID } from "../../utilities";
export default class gameEvent {
  constructor({ gameEventData, targetTileId, squads, target }) {
    this.id = getUID();
    this.gameEventData = gameEventData;
    this.targetTileId = targetTileId;
    this.squads = squads;
    this.target = target;
  }
}
