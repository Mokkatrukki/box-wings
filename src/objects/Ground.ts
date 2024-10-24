export class Ground extends Phaser.Physics.Arcade.StaticGroup {
    private static texturesCreated = false;

    constructor(scene: Phaser.Scene) {
        super(scene.physics.world, scene);

        // Get game dimensions
        const width = scene.game.config.width as number;
        const height = scene.game.config.height as number;

        // Create textures only once
        if (!Ground.texturesCreated) {
            // Create base ground texture
            const groundTexture = scene.textures.createCanvas('ground', 32, 32);
            if (!groundTexture) throw new Error('Could not create ground texture');
            const groundContext = groundTexture.getContext();
            if (!groundContext) throw new Error('Could not get ground context');
            groundContext.fillStyle = '#4a4a4a';
            groundContext.fillRect(0, 0, 32, 32);
            groundTexture.refresh();

            // Create launch pad texture
            const launchpadTexture = scene.textures.createCanvas('launchpad', 64, 16);
            if (!launchpadTexture) throw new Error('Could not create launchpad texture');
            const launchpadContext = launchpadTexture.getContext();
            if (!launchpadContext) throw new Error('Could not get launchpad context');
            launchpadContext.fillStyle = '#3498db';
            launchpadContext.fillRect(0, 0, 64, 16);
            launchpadTexture.refresh();

            // Create rescue area texture
            const rescueTexture = scene.textures.createCanvas('rescue', 64, 16);
            if (!rescueTexture) throw new Error('Could not create rescue texture');
            const rescueContext = rescueTexture.getContext();
            if (!rescueContext) throw new Error('Could not get rescue context');
            rescueContext.fillStyle = '#e74c3c';
            rescueContext.fillRect(0, 0, 64, 16);
            rescueTexture.refresh();

            // Create wreck texture
            const wreckTexture = scene.textures.createCanvas('wreck', 48, 24);
            if (!wreckTexture) throw new Error('Could not create wreck texture');
            const wreckContext = wreckTexture.getContext();
            if (!wreckContext) throw new Error('Could not get wreck context');
            wreckContext.fillStyle = '#7f8c8d';
            wreckContext.fillRect(0, 0, 48, 24);
            wreckTexture.refresh();

            Ground.texturesCreated = true;
        }

        // Create ground tiles
        for (let x = 0; x < width; x += 32) {
            const ground = scene.physics.add.staticSprite(x + 16, height - 16, 'ground');
            this.add(ground);
        }

        // Add launch pad
        const launchPad = scene.physics.add.staticSprite(100, height - 40, 'launchpad');
        this.add(launchPad);

        // Add rescue area on the right side
        const rescueArea = scene.physics.add.staticSprite(width - 100, height - 40, 'rescue');
        this.add(rescueArea);

        // Add ship wreck near rescue area
        const shipWreck = scene.physics.add.staticSprite(width - 170, height - 44, 'wreck');
        this.add(shipWreck);
    }
}