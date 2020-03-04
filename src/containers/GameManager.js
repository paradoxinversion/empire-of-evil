import { Container } from "unstated";
import { createNation } from "../data/entities/nation";
import {
  makeMap,
  getLandTiles,
  getRandomLandTile
} from "../commonUtilities/map/gameMap";
class GameManager extends Container {
  state = {
    nations: [],
    gameMap: []
  };

  async createMap() {
    const gameMap = makeMap();
    await this.setGameMap(gameMap);
  }

  async setGameMap(gameMap) {
    await this.setState({
      gameMap
    });
  }

  async createNations() {
    const evilEmpire = createNation("EVIL Empire", true);
    const cpuNation = createNation("CPU Nation", false);
    await this.setState({
      nations: [evilEmpire, cpuNation]
    });
    return this.state.nations;
  }

  getEvilEmpire() {
    const evilEmpireIndex = this.state.nations.findIndex(
      nation => nation.isEvilEmpire
    );
    return this.state.nations[evilEmpireIndex];
  }

  getCPUNation() {
    const cpuNationIndex = this.state.nations.findIndex(
      nation => !nation.isEvilEmpire
    );
    return this.state.nations[cpuNationIndex];
  }
  async setUpGame() {
    await this.createMap();
    await this.createNations();
    const cpuNation = this.getCPUNation();
    const evilEmpire = this.getEvilEmpire();
    for (let y = 0; y < this.state.gameMap.length; y++) {
      for (let x = 0; x < this.state.gameMap[y].length; x++) {
        this.state.gameMap[y][x].setNationId(cpuNation.id);
      }
    }

    const empireStartTile = getRandomLandTile(getLandTiles(this.state.gameMap));
    debugger;
    empireStartTile.setNationId(evilEmpire.id);
  }
}

export default new GameManager();
