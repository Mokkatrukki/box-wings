export class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create(): void {
        // Add temporary text to verify scene is working
        const text = this.add.text(400, 300, 'Box Wings Game', {
            font: '32px Arial',
            color: '#ffffff'
        });
        text.setOrigin(0.5, 0.5);
    }

    update(): void {
        // Will add game loop logic here later
    }
}