import { Ship } from '../objects/Ship';
import { Ground } from '../objects/Ground';
import { Obstacle, ObstacleSpawner } from '../objects/Obstacle';
import { GameState } from '../types/game';

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
    private stateText!: Phaser.GameObjects.Text;

    // Input
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

     // Game state
     private gameState!: GameState;

    constructor() {
        super({ key: 'MainScene' });
    }

    create(): void {
        this.initializeScene();
        this.createGameObjects();
        this.setupCollisions();
        this.createUI();
        this.setupInput();

        // Set initial game state
        this.setGameState(GameState.START);
    }

    private setGameState(state: GameState): void {
        this.gameState = state;
        
        switch (state) {
            case GameState.START:
                this.handleStartState();
                break;
            case GameState.PLAYING:
                this.handlePlayingState();
                break;
            case GameState.GAME_OVER:
                this.handleGameOverState();
                break;
            case GameState.WIN:
                this.handleWinState();
                break;
        }
    }

    private handleStartState(): void {
        // Disable obstacles
        if (this.obstacleSpawner) {
            this.obstacleSpawner.getGroup().setActive(false).setVisible(false);
        }

        // Show start message
        this.updateStateText('Press SPACE to start!', 0xffff00);
    }

    private handlePlayingState(): void {
        // Enable obstacles
        if (this.obstacleSpawner) {
            this.obstacleSpawner.getGroup().setActive(true).setVisible(true);
        }

        // Clear state text
        this.updateStateText('');
    }

    private handleGameOverState(): void {
        // Show game over message
        this.updateStateText('Game Over!\nPress SPACE to restart', 0xff0000);
    }

    private handleWinState(): void {
        // Show win message
        this.updateStateText('You Won!\nPress SPACE to restart', 0x00ff00);
    }
    private updateStateText(message: string, color: number = 0xffffff): void {
        // Destroy existing text if it exists
        if (this.stateText) {
            this.stateText.destroy();
        }
    
        // Create new text
        this.stateText = this.add.text(
            this.gameWidth / 2,
            this.gameHeight / 2,
            message,
            {
                font: '32px Arial',
                align: 'center',
                color: '#ffffff'
            }
        )
        .setOrigin(0.5)
        .setTint(color);
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
        this.debugText = this.add.text(10, 10, '', {
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
        ).setOrigin(0.5);
    
        // Create initial state text (empty)
        this.stateText = this.add.text(
            this.gameWidth / 2,
            this.gameHeight / 2,
            '',
            {
                font: '32px Arial',
                color: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5);
    }

    private setupInput(): void {
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
            
            // Add space key handler for state changes
            this.input.keyboard.on('keydown-SPACE', () => {
                if (this.gameState === GameState.START) {
                    this.setGameState(GameState.PLAYING);
                } else if (this.gameState === GameState.GAME_OVER || this.gameState === GameState.WIN) {
                    this.scene.restart();
                }
            });
        }
    }

    private handleShipCollision(): void {
        if (this.gameState === GameState.PLAYING) {
            this.setGameState(GameState.GAME_OVER);
        }
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
        if (this.gameState === GameState.PLAYING) {
            this.ship.update();
            this.updateDebugInfo();
        }
    }
}