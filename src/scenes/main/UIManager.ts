export class UIManager {
    private scene: Phaser.Scene;
    private gameWidth: number;
    private gameHeight: number;
    
    private debugText!: Phaser.GameObjects.Text;
    private instructions!: Phaser.GameObjects.Text;
    private stateText!: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, gameWidth: number, gameHeight: number) {
        this.scene = scene;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.createUI();
    }

    private createUI(): void {
        // Debug info
        this.debugText = this.scene.add.text(10, 10, '', {
            font: '16px Arial',
            color: '#ffffff'
        });

        // Instructions
        this.instructions = this.scene.add.text(
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
        this.stateText = this.scene.add.text(
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

    public updateStateText(message: string, color: number = 0xffffff): void {
        if (this.stateText) {
            this.stateText.destroy();
        }
        
        this.stateText = this.scene.add.text(
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

    public updateDebugInfo(velX: number, velY: number, angle: number): void {
        this.debugText.setText(
            `Velocity X: ${velX}\nVelocity Y: ${velY}\nRotation: ${angle}`
        );
    }
}