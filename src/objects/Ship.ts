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

    private thrustParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
    private trailParticles!: Phaser.GameObjects.Particles.ParticleEmitter;

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

        // Create particle effects
        this.createParticleEffects();


    }

    update(): void {
        // Get cursor keys
        const cursors = this.scene.input.keyboard?.createCursorKeys();
        this.updateParticleEffects();
        
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
    

    private createParticleEffects(): void {
        // Thrust particles (engine fire)
        this.thrustParticles = this.scene.add.particles(0, 0, 'thrust', {
            speed: { min: 50, max: 100 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 500,
            frequency: 50,
            alpha: { start: 1, end: 0 },
            tint: [0xffff00, 0xff8800, 0xff0000],
            radial: false,
            // Remove the static angle configuration here
        });
        this.thrustParticles.stop();
    
        // Trail effect remains the same
        this.trailParticles = this.scene.add.particles(0, 0, 'trail', {
            speed: 20,
            scale: { start: 0.2, end: 0 },
            alpha: { start: 0.5, end: 0 },
            lifespan: 1000,
            frequency: 100,
            blendMode: 'ADD',
            tint: 0x88ff88
        });
        this.trailParticles.start();
    }

    private updateParticleEffects(): void {
        const angle = Phaser.Math.DegToRad(this.angle - 180);
        // Adjust offset to be at bottom of ship
        const x = this.x - Math.cos(angle) * 15;
        const y = this.y - Math.sin(angle) * 15;
    
        // Update thrust particles
        if (this.scene.input.keyboard?.createCursorKeys().up.isDown) {
            this.thrustParticles.setPosition(x, y);
            
            // Set particle angle based on ship's current rotation
            // Add 90 degrees to make particles go opposite to ship's direction
            const particleAngle = this.angle - 45 ;
            
            // Set a fixed angle and use speed to create a spread effect
            this.thrustParticles.setAngle(particleAngle);
            
            this.thrustParticles.start();
        } else {
            this.thrustParticles.stop();
        }
    
        // Update trail
        this.trailParticles.setPosition(this.x, this.y);
    }  
    // Add method to handle collision effects
    public createExplosion(): void {
        this.scene.add.particles(this.x, this.y, 'explosion', {
            speed: { min: -100, max: 100 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            gravityY: 0,
            quantity: 20,
            tint: [0xff0000, 0xff8800, 0xffff00],
            emitting: false,
            follow: this
        });
    }
}