import { Ship } from '../../objects/Ship';
import { Ground } from '../../objects/Ground';
import { Obstacle, ObstacleSpawner } from '../../objects/Obstacle';
import { UIManager } from './UIManager';
import { StateManager } from './StateManager';
import { CollisionManager } from './CollisionManager';
import { InputManager } from './InputManager';

export class MainScene extends Phaser.Scene {
    private gameWidth!: number;
    private gameHeight!: number;

    // Game objects
    private ship!: Ship;
    private ground!: Ground;
    private obstacleSpawner!: ObstacleSpawner;

    // Managers
    private uiManager!: UIManager;
    private stateManager!: StateManager;
    private collisionManager!: CollisionManager;
    private inputManager!: InputManager;

    constructor() {
        super({ key: 'MainScene' });
    }

    create(): void {
        this.initializeScene();
        this.createGameObjects();
        this.initializeManagers();
    }

    private initializeScene(): void {
        this.gameWidth = this.game.config.width as number;
        this.gameHeight = this.game.config.height as number;
        this.cameras.main.setBackgroundColor('#4488AA');
    }

    private createGameObjects(): void {
        this.ground = new Ground(this);
        this.ship = new Ship(this, 100, this.gameHeight - 100);
        this.obstacleSpawner = new ObstacleSpawner(this);
    }

    private initializeManagers(): void {
        this.uiManager = new UIManager(this, this.gameWidth, this.gameHeight);
        this.stateManager = new StateManager(this, this.uiManager, this.obstacleSpawner);
        this.collisionManager = new CollisionManager(
            this, this.ship, this.ground, this.obstacleSpawner, this.stateManager
        );
        this.inputManager = new InputManager(this, this.stateManager);
    }

    update(): void {
        if (this.stateManager.isPlaying()) {
            this.ship.update();
            const body = this.ship.body as Phaser.Physics.Arcade.Body;
            this.uiManager.updateDebugInfo(
                Math.round(body.velocity.x),
                Math.round(body.velocity.y),
                Math.round(this.ship.angle)
            );
        }
    }
}