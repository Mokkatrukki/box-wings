export class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
    }

    preload(): void {
        // Add loading visual feedback
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        this.createParticleTextures();

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            font: '20px monospace',
            color: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);

        // Add percentage text
        const percentText = this.add.text(width / 2, height / 2 - 5, '0%', {
            font: '18px monospace',
            color: '#ffffff'
        });
        percentText.setOrigin(0.5, 0.5);

        // Loading progress
        this.load.on('progress', (value: number) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
            percentText.setText(parseInt((value * 100).toString()) + '%');
        });

        // Simulate loading with dummy files
        for(let i = 0; i < 50; i++) {
            // Loading dummy images with random delays
            this.load.image(`dummy${i}`, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');
            
            // Add artificial delay
            this.load.on(`filecomplete-image-dummy${i}`, () => {
                return new Promise(resolve => setTimeout(resolve, 50));
            });
        }

        // Clean up when loading complete
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            
            // Add slight delay before starting main scene
            this.time.delayedCall(500, () => {
                this.scene.start('MainScene');
            });
        });
    }

    private createParticleTextures(): void {
        // Thrust particle
        const thrustTexture = this.textures.createCanvas('thrust', 8, 8);
        if (thrustTexture && thrustTexture.getContext()) {
            const context = thrustTexture.getContext();
            context.fillStyle = '#ffffff';
            context.beginPath();
            context.arc(4, 4, 3, 0, Math.PI * 2);
            context.fill();
            thrustTexture.refresh();
        }

        // Trail particle
        const trailTexture = this.textures.createCanvas('trail', 4, 4);
        if (trailTexture && trailTexture.getContext()) {
            const context = trailTexture.getContext();
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, 4, 4);
            trailTexture.refresh();
        }

        // Explosion particle
        const explosionTexture = this.textures.createCanvas('explosion', 8, 8);
        if (explosionTexture && explosionTexture.getContext()) {
            const context = explosionTexture.getContext();
            context.fillStyle = '#ffffff';
            context.beginPath();
            context.arc(4, 4, 4, 0, Math.PI * 2);
            context.fill();
            explosionTexture.refresh();
        }
    }
}