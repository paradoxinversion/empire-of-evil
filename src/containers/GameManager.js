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
    return this.state.nations.find(nation => nation.isEvilEmpire);
  }

  getCPUNation() {
    return this.state.nations.filter(nation => !nation.isEvilEmpire);
  }
  async setUpGame() {
    await this.createMap();
    await this.createNations();
    const cpuNation = this.getCPUNation();
    const evilEmpire = this.getEvilEmpire();
    const gameMap = this.state.gameMap.slice(0);
    for (let y = 0; y < this.state.gameMap.length; y++) {
      for (let x = 0; x < this.state.gameMap[y].length; x++) {
        gameMap[y][x].setNationId(cpuNation.id);
      }
    }
    const landTiles = getLandTiles(this.state.gameMap)
    const empireStartTile = getRandomLandTile(landTiles);
    empireStartTile.setNationId(evilEmpire.id);
    console.log(empireStartTile)
    gameMap[empireStartTile.y][empireStartTile.x] = empireStartTile;
    this.setState({gameMap})
    
  }
}

export default new GameManager();
