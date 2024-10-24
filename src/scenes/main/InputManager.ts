import { StateManager } from './StateManager';
import { GameState } from '../../types/game';

export class InputManager {
    private scene: Phaser.Scene;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private stateManager: StateManager;

    constructor(scene: Phaser.Scene, stateManager: StateManager) {
        this.scene = scene;
        this.stateManager = stateManager;
        this.setupInput();
    }

    private setupInput(): void {
        if (this.scene.input.keyboard) {
            this.cursors = this.scene.input.keyboard.createCursorKeys();
            
            // Add space key handler for state changes
            this.scene.input.keyboard.on('keydown-SPACE', () => {
                const currentState = this.stateManager.getCurrentState();
                if (currentState === GameState.START) {
                    this.stateManager.setState(GameState.PLAYING);
                } else if (currentState === GameState.GAME_OVER || 
                         currentState === GameState.WIN) {
                    this.scene.scene.restart();
                }
            });
        }
    }

    public getCursors(): Phaser.Types.Input.Keyboard.CursorKeys {
        return this.cursors;
    }
}