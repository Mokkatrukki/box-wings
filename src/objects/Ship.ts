export class Ship extends Phaser.Physics.Arcade.Sprite {
    private readonly THRUST_SPEED = 20;  // Reduced from 200 to 20
    private readonly ROTATION_SPEED = 90; // Reduced from 180 to 90 for slower rotation

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'ship');

        // Create a temporary rectangle as placeholder
        const graphics = scene.add.graphics();
        graphics.lineStyle(2, 0x00ff00);
        graphics.fillStyle(0x00ff00, 1);
        graphics.fillRect(-15, -15, 30, 30);
        graphics.generateTexture('ship', 30, 30);
        graphics.destroy();

        // Add ship to the scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set physics properties
        this.setCollideWorldBounds(true);
        this.setDrag(10);         // Reduced from 50 to 10
        this.setAngularDrag(50);  // Reduced from 100 to 50
    }

    update(): void {
        // Get cursor keys
        const cursors = this.scene.input.keyboard?.createCursorKeys();
        
        if (cursors) {
            // Handle thrust
            if (cursors.up.isDown) {
                this.thrust();
            }

            // Handle rotation
            if (cursors.left.isDown) {
                this.rotateLeft();
            } else if (cursors.right.isDown) {
                this.rotateRight();
            }
        }
    }

    private thrust(): void {
        // Ensure body exists and is Arcade Physics body
        const body = this.body as Phaser.Physics.Arcade.Body;
        
        // Calculate velocity based on ship's rotation
        const angle = Phaser.Math.DegToRad(this.angle - 90); // -90 because our ship points upward
        this.setVelocityY(body.velocity.y - Math.cos(angle) * this.THRUST_SPEED);
        this.setVelocityX(body.velocity.x + Math.sin(angle) * this.THRUST_SPEED);
    }

    private rotateLeft(): void {
        this.setAngularVelocity(-this.ROTATION_SPEED);
    }

    private rotateRight(): void {
        this.setAngularVelocity(this.ROTATION_SPEED);
    }
}