import { GameState } from '../../types/game';
import { UIManager } from './UIManager';
import { ObstacleSpawner } from '../../objects/Obstacle';

export class StateManager {
    private scene: Phaser.Scene;
    private currentState: GameState;
    private uiManager: UIManager;
    private obstacleSpawner: ObstacleSpawner;

    constructor(scene: Phaser.Scene, uiManager: UIManager, obstacleSpawner: ObstacleSpawner) {
        this.scene = scene;
        this.uiManager = uiManager;
        this.obstacleSpawner = obstacleSpawner;
        this.currentState = GameState.START;
        this.setState(GameState.START);
    }

    public setState(state: GameState): void {
        this.currentState = state;
        
        switch (state) {
            case GameState.START:
                this.handleStartState();
                break;
            case GameState.PLAYING:
                this.handlePlayingState();
                break;
            case GameState.GAME_OVER:
                this.handleGameOverState();
                break;
            case GameState.WIN:
                this.handleWinState();
                break;
        }
    }

    public getCurrentState(): GameState {
        return this.currentState;
    }

    public isPlaying(): boolean {
        return this.currentState === GameState.PLAYING;
    }

    private handleStartState(): void {
        if (this.obstacleSpawner) {
            this.obstacleSpawner.getGroup().setActive(false).setVisible(false);
        }
        this.uiManager.updateStateText('Press SPACE to start!', 0xffff00);
    }

    private handlePlayingState(): void {
        if (this.obstacleSpawner) {
            this.obstacleSpawner.getGroup().setActive(true).setVisible(true);
        }
        this.uiManager.updateStateText('');
    }

    private handleGameOverState(): void {
        this.uiManager.updateStateText('Game Over!\nPress SPACE to restart', 0xff0000);
    }

    private handleWinState(): void {
        this.uiManager.updateStateText('You Won!\nPress SPACE to restart', 0x00ff00);
    }
}