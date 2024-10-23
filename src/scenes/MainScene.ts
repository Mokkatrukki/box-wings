export class MainScene extends Phaser.Scene {
    private gameWidth!: number;  // Added ! to indicate it will be initialized
    private gameHeight!: number; // Added ! to indicate it will be initialized
    private debugText!: Phaser.GameObjects.Text;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys; // Add cursors property

    constructor() {
        super({ key: 'MainScene' });
    }

    create(): void {
        // Store game dimensions for easy reference
        this.gameWidth = this.game.config.width as number;
        this.gameHeight = this.game.config.height as number;

        // Add background color
        this.cameras.main.setBackgroundColor('#4488AA');

        // Add text to show game is running
        const titleText = this.add.text(this.gameWidth / 2, 100, 'Box Wings', {
            font: '32px Arial',
            color: '#ffffff'
        });
        titleText.setOrigin(0.5);

        // Add debug text for input testing
        this.debugText = this.add.text(10, 10, 'Debug Info:', {
            font: '16px Arial',
            color: '#ffffff'
        });

        // Setup keyboard input
        this.setupInput();

        // Add instructions text
        const instructions = this.add.text(this.gameWidth / 2, 150, 'Use Arrow Keys to Test Input', {
            font: '20px Arial',
            color: '#ffffff'
        });
        instructions.setOrigin(0.5);
    }

    private setupInput(): void {
        // Check if keyboard plugin is available
        if (this.input.keyboard) {
            // Define keys we'll use
            this.cursors = this.input.keyboard.createCursorKeys();
            
            // Store key references for use in update
            this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
                this.updateDebugText('Key Pressed: ' + event.key);
            });
        } else {
            console.warn('Keyboard input not available');
        }
    }

    private updateDebugText(message: string): void {
        this.debugText.setText(message);
    }

    update(): void {
        // Check cursor input
        if (this.cursors) {
            if (this.cursors.left.isDown) {
                this.updateDebugText('Left key is being held down');
            } else if (this.cursors.right.isDown) {
                this.updateDebugText('Right key is being held down');
            } else if (this.cursors.up.isDown) {
                this.updateDebugText('Up key is being held down');
            } else if (this.cursors.down.isDown) {
                this.updateDebugText('Down key is being held down');
            }
        }
    }
}