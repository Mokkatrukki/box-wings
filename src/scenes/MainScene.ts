import { Ship } from '../objects/Ship';
import { Ground } from '../objects/Ground';
import { Obstacle, ObstacleSpawner } from '../objects/Obstacle';

export class MainScene extends Phaser.Scene {
    // Scene dimensions
    private gameWidth!: number;
    private gameHeight!: number;

    // Game objects
    private ship!: Ship;
    private ground!: Ground;
    private obstacleSpawner!: ObstacleSpawner;

    // UI elements
    private debugText!: Phaser.GameObjects.Text;
    private instructions!: Phaser.GameObjects.Text;

    // Input
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super({ key: 'MainScene' });
    }

    create(): void {
        this.initializeScene();
        this.createGameObjects();
        this.setupCollisions();
        this.createUI();
        this.setupInput();
    }

    private initializeScene(): void {
        this.gameWidth = this.game.config.width as number;
        this.gameHeight = this.game.config.height as number;
        this.cameras.main.setBackgroundColor('#4488AA');
    }

    private createGameObjects(): void {
        // Create ground and ship
        this.ground = new Ground(this);
        this.ship = new Ship(this, 100, this.gameHeight - 100);

        // Create obstacle spawner
        this.obstacleSpawner = new ObstacleSpawner(this);
    }

    private setupCollisions(): void {
        // Ground collision
        this.physics.add.collider(this.ship, this.ground);

        // Obstacle collision
        this.physics.add.overlap(
            this.ship,
            this.obstacleSpawner.getGroup(),
            this.handleShipCollision,
            undefined,
            this
        );
    }

    private createUI(): void {
        // Debug info
        this.debugText = this.add.text(10, 10, 'Debug Info:', {
            font: '16px Arial',
            color: '#ffffff'
        });

        // Instructions
        this.instructions = this.add.text(
            this.gameWidth / 2,
            50,
            'Arrow Up: Thrust\nLeft/Right: Rotate\nLand on the red platform!',
            {
                font: '20px Arial',
                color: '#ffffff',
                align: 'center'
            }
        );
        this.instructions.setOrigin(0.5);
    }

    private setupInput(): void {
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }
    }

    private handleShipCollision(): void {
        this.scene.restart();
    }

    private updateDebugInfo(): void {
        if (this.cursors) {
            const body = this.ship.body as Phaser.Physics.Arcade.Body;
            const velX = Math.round(body.velocity.x);
            const velY = Math.round(body.velocity.y);
            this.debugText.setText(
                `Velocity X: ${velX}\nVelocity Y: ${velY}\nRotation: ${Math.round(this.ship.angle)}`
            );
        }
    }

    update(): void {
        this.ship.update();
        this.updateDebugInfo();
    }
}