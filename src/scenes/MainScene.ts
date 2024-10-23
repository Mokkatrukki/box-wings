import { Ship } from '../objects/Ship';
import { Ground } from '../objects/Ground';

export class MainScene extends Phaser.Scene {
    private gameWidth!: number;
    private gameHeight!: number;
    private debugText!: Phaser.GameObjects.Text;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private ship!: Ship;
    private ground!: Ground;

    constructor() {
        super({ key: 'MainScene' });
    }

    create(): void {
        // Store game dimensions for easy reference
        this.gameWidth = this.game.config.width as number;
        this.gameHeight = this.game.config.height as number;

        // Add background color
        this.cameras.main.setBackgroundColor('#4488AA');

        // Create ground before ship so ship appears on top
        this.ground = new Ground(this);

        // Create ship at launch pad position
        this.ship = new Ship(this, 100, this.gameHeight - 100);

        // Add collision between ship and ground
        this.physics.add.collider(this.ship, this.ground);

        // Add debug text for input testing
        this.debugText = this.add.text(10, 10, 'Debug Info:', {
            font: '16px Arial',
            color: '#ffffff'
        });

        // Setup keyboard input
        this.setupInput();

        // Add instructions text
        const instructions = this.add.text(this.gameWidth / 2, 50, 
            'Arrow Up: Thrust\nLeft/Right: Rotate\nLand on the red platform!', {
            font: '20px Arial',
            color: '#ffffff',
            align: 'center'
        });
        instructions.setOrigin(0.5);
    }

    private setupInput(): void {
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }
    }

    update(): void {
        // Update ship
        this.ship.update();

        // Update debug info
        if (this.cursors) {
            const body = this.ship.body as Phaser.Physics.Arcade.Body;
            const velX = Math.round(body.velocity.x);
            const velY = Math.round(body.velocity.y);
            this.debugText.setText(
                `Velocity X: ${velX}\nVelocity Y: ${velY}\nRotation: ${Math.round(this.ship.angle)}`
            );
        }
    }
}