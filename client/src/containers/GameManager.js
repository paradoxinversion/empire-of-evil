import { Container } from "unstated";
import { createNation } from "../../../src/entities/nation";
import { makeMap } from "../../../commonUtilities/map/gameMap";
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

  createNations() {
    const evilEmpire = createNation("EVIL Empire", true);
    const cpuNation = createNation("CPU Nation", false);
    this.setState({
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
  setUpGame() {
    awaitthis.createMap();
    this.createNations();
    console.log(this.state.gameMap);
    const cpuNation = this.getCPUNation();
    for (let y = 0; y < this.state.gameMap.length; y++) {
      for (let x = 0; x < this.state.gameMap[y].length; x++) {
        this.state.gameMap[y][x].setNationId(cpuNation.id);
      }
    }
  }
}

export default new GameManager();
