import { LoadingScene } from './scenes/LoadingScene';
import { MainScene } from './scenes/MainScene';

export class Game extends Phaser.Game {
    constructor() {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: {x: 0, y: 300 },
                    debug: false
                }
            },
            scene: [LoadingScene, MainScene],
            backgroundColor: '#1a1a1a'
        };
        super(config);
    }
}