export class Ship extends Phaser.Physics.Arcade.Sprite {
    // Movement constants
    private readonly THRUST_SPEED = 10;     // Increased from 20 to 200
    private readonly MAX_VELOCITY = 200;      // Increased from 300 to 400
    private readonly ROTATION_SPEED = 70;
    private readonly DRAG_COEFFICIENT = 5;    // Reduced from 10 to 5
    private readonly ANGULAR_DRAG = 50;

    // Control states
    private thrusting: boolean = false;
    private rotating: number = 0; // -1 for left, 0 for none, 1 for right

    private static textureCreated = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'ship');

        // Create ship texture only once
        if (!Ship.textureCreated) {
            const shipTexture = scene.textures.createCanvas('ship', 30, 30);
            if (!shipTexture) throw new Error('Could not create ship texture');
            const shipContext = shipTexture.getContext();
            if (!shipContext) throw new Error('Could not get ship context');

            // Draw ship shape (triangle pointing left)
            shipContext.fillStyle = '#00FF00';
            shipContext.strokeStyle = '#00CC00';
            shipContext.lineWidth = 2;
            
            // Draw triangle (pointing left)
            shipContext.beginPath();
            shipContext.moveTo(0, 15);     // nose (left)
            shipContext.lineTo(30, 0);     // top right
            shipContext.lineTo(30, 30);    // bottom right
            shipContext.closePath();
            
            // Fill and stroke
            shipContext.fill();
            shipContext.stroke();

            shipTexture.refresh();
            Ship.textureCreated = true;
        }

        // Set the texture on the sprite
        this.setTexture('ship');

        // Add ship to the scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set physics properties
        this.setCollideWorldBounds(true);
        this.setDrag(this.DRAG_COEFFICIENT);
        this.setAngularDrag(this.ANGULAR_DRAG);
        this.setMaxVelocity(this.MAX_VELOCITY);
        this.setBounce(0.3);  // Add some bounce for better feel

        // Set initial rotation (90 degrees = pointing up)
        this.setAngle(90);
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

            // Optional: Handle emergency brake with space
            if (cursors.space?.isDown) {
                this.brake();
            }
        }
    }

    private thrust(): void {
        const body = this.body as Phaser.Physics.Arcade.Body;
        const angle = Phaser.Math.DegToRad(this.angle - 90);
        const thrustX = Math.sin(angle) * this.THRUST_SPEED;
        const thrustY = -Math.cos(angle) * this.THRUST_SPEED;
        
        // Add to current velocity instead of setting it
        this.setVelocityX(body.velocity.x + thrustX);
        this.setVelocityY(body.velocity.y + thrustY);
    }

    private rotateLeft(): void {
        this.setAngularVelocity(-this.ROTATION_SPEED);
    }

    private rotateRight(): void {
        this.setAngularVelocity(this.ROTATION_SPEED);
    }

    private brake(): void {
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(body.velocity.x * 0.95, body.velocity.y * 0.95);
    }
}