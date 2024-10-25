export class Obstacle extends Phaser.Physics.Arcade.Sprite {
    private readonly SPEED = 100;
    private static textureCreated = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'obstacle');

        // Create obstacle texture only once
        if (!Obstacle.textureCreated) {
            const obstacleTexture = scene.textures.createCanvas('obstacle', 20, 20);
            if (!obstacleTexture) throw new Error('Could not create obstacle texture');
            const obstacleContext = obstacleTexture.getContext();
            if (!obstacleContext) throw new Error('Could not get obstacle context');

            // Draw obstacle (red circle)
            obstacleContext.fillStyle = '#ff0000';
            obstacleContext.beginPath();
            obstacleContext.arc(10, 10, 8, 0, Math.PI * 2);
            obstacleContext.fill();

            obstacleTexture.refresh();
            Obstacle.textureCreated = true;
        }

        // Set the texture
        this.setTexture('obstacle');

        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set velocity based on spawn position
        const gameWidth = scene.game.config.width as number;
        const targetX = (x > gameWidth / 2) ? -100 : gameWidth + 100;
        const duration = 6000; // Time to cross screen in milliseconds
        
        // Move towards the other side of the screen
        scene.tweens.add({
            targets: this,
            x: targetX,
            duration: duration,
            ease: 'Linear',
            onComplete: () => this.destroy()
        });
    }
}

export class ObstacleSpawner {
    private scene: Phaser.Scene;
    private spawnTimer: Phaser.Time.TimerEvent;
    private obstacles: Phaser.GameObjects.Group;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.obstacles = this.scene.add.group();
        
        // Start spawning obstacles
        this.spawnTimer = this.scene.time.addEvent({
            delay: 2000,  // Spawn every 2 seconds
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });
    }

    public getGroup(): Phaser.GameObjects.Group {
        return this.obstacles;
    }

    private spawnObstacle(): void {
        const width = this.scene.game.config.width as number;
        const height = this.scene.game.config.height as number;

        // Randomly choose left or right side
        const spawnRight = Math.random() > 0.5;
        const x = spawnRight ? width + 20 : -20;
        
        // Random y position between top and bottom (avoiding ground)
        const y = Phaser.Math.Between(50, height - 100);

        const obstacle = new Obstacle(this.scene, x, y);
        this.obstacles.add(obstacle);
    }
}