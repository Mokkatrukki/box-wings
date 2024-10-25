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
        this.scene.physics.add.collider(
            this.ship,
            this.ground,
            undefined,
            undefined,
            this
        );

        // Obstacle collision
        this.scene.physics.add.overlap(
            this.ship,
            this.obstacleSpawner.getGroup(),
            this.handleObstacleCollision,
            undefined,
            this
        );

        // Rescue area landing detection
        try {
            const rescueArea = this.ground.getRescueArea();
            console.log('Setting up rescue area collision', rescueArea);
            if(rescueArea){
                this.scene.physics.add.overlap(
                    this.ship,
                    rescueArea,
                    () => {
                        console.log('Rescue area collision detected!');
                        this.handleRescueAreaLanding();
                    },
                    undefined,
                    this
                );

            }
            
        } catch (error) {
            console.error('Error setting up rescue area collision:', error);
        }
    }

    private handleObstacleCollision(): void {
        if (this.stateManager.isPlaying()) {
            console.log('Obstacle collision!');
            this.stateManager.setState(GameState.GAME_OVER);
        }
    }

    private handleRescueAreaLanding(): void {
        if (this.stateManager.isPlaying()) {
            console.log('Setting win state!');
            this.stateManager.setState(GameState.WIN);
        }
    }
}