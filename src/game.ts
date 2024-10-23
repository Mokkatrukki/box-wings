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
                    gravity: { y: 300, x: 0 },  // Added x: 0 explicitly
                    debug: true  // Set to true to see physics bodies
                }
            },
            scene: [LoadingScene, MainScene],
            backgroundColor: '#1a1a1a',
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            render: {
                pixelArt: false
            }
        };
        super(config);
    }
}