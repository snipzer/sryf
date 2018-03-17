
export default class EtapeDto {
    constructor(label, backGroundImagePath, players, isStarted, isCompleted, positions, assets) {
        this.label = label;
        this.backGroundImagePath = backGroundImagePath;
        this.players = players;
        this.isStarted = isStarted;
        this.isCompleted = isCompleted;
        this.positions = positions;
        this.assets = assets;
    }
}