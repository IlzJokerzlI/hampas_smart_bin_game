import * as BABYLON from 'babylonjs'
import * as GUI from 'babylonjs-gui'

export class EndGameMenu {
    private _advancedTexture
    private _titleFront: GUI.TextBlock;
    public _score: GUI.TextBlock;
    private _line: GUI.Line;
    private _font: string;
    private _start: GUI.TextBlock;

    constructor(scene: BABYLON.Scene, finalWeight: number) { //menu, ui
        this._advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('gameOverMenu', false, scene)

        this._font = 'Arial';

        this._start = new GUI.TextBlock('start');
        this._start.text = 'C L I C K    A N Y W H E R E    T O    P L A Y    A G A I N';
        this._start.color = 'white';
        this._start.fontFamily = this._font;
        this._start.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._start.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this._start.fontSize = 30;
        this._start.top = 200;
        this._advancedTexture.addControl(this._start);

        this._titleFront = new GUI.TextBlock('title');
        this._titleFront.text = (finalWeight < 100) ? 'GAME OVER' : 'GAME WIN';
        this._titleFront.color = 'white';
        this._titleFront.fontSize = 196;
        this._titleFront.fontFamily = this._font;
        this._titleFront.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this._titleFront.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._titleFront.top = -250;
        this._advancedTexture.addControl(this._titleFront);

        this._score = new GUI.TextBlock('score');
        this._score.text = 'Final weight : ' + finalWeight + ' / 100';
        this._score.color = 'white';
        this._score.fontFamily = this._font;
        this._score.fontSize = 42;
        this._score.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this._score.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._score.top = -75;
        this._advancedTexture.addControl(this._score);

        this._line = new GUI.Line();
        this._line.color = 'white';
        this._line.lineWidth = 20;
        this._line.x1 = 0;
        this._line.y1 = 300;
        this._line.x2 = 2000;
        this._line.y2 = 300;
        this._line.alpha = 0.2;
        this._advancedTexture.addControl(this._line);
    }

    public hide() {
        this._titleFront.dispose();
        this._start.dispose();
        this._line.dispose();
        this._score.dispose();
    }
}
