import { Ship } from '../../objects/Ship';
import { Ground } from '../../objects/Ground';
import { ObstacleSpawner } from '../../objects/Obstacle';
import { StateManager } from './StateManager';
import { GameState } from '../../types/game';

export class CollisionManager {
    private scene: Phaser.Scene;
    private ship: Ship;
    private ground: Ground;
    private obstacleSpawner: ObstacleSpawner;
    private stateManager: StateManager;

    constructor(scene: Phaser.Scene, ship: Ship, ground: Ground, 
                obstacleSpawner: ObstacleSpawner, stateManager: StateManager) {
        this.scene = scene;
        this.ship = ship;
        this.ground = ground;
        this.obstacleSpawner = obstacleSpawner;
        this.stateManager = stateManager;
        this.setupCollisions();
    }

    private setupCollisions(): void {
        // Ground collision
        this.scene.physics.add.collider(this.ship, this.ground);

        // Obstacle collision
        this.scene.physics.add.overlap(
            this.ship,
            this.obstacleSpawner.getGroup(),
            this.handleShipCollision,
            undefined,
            this
        );
    }

    private handleShipCollision(): void {
        if (this.stateManager.isPlaying()) {
            this.stateManager.setState(GameState.GAME_OVER);
        }
    }
}