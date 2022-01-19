import * as GUI from 'babylonjs-gui';
import * as BABYLON from 'babylonjs';

export class Menu {
    public _advancedTexture: GUI.AdvancedDynamicTexture
    private _titleFront : GUI.TextBlock;
    private _authors :GUI.TextBlock;
    private _line :GUI.Line;
    private _font: string;
    private _start: GUI.TextBlock;

    constructor(scene: BABYLON.Scene) {
        this._advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

        this._font = "Agency FB";

        this._start = new GUI.TextBlock("start");
        this._start.text = "C L I C K    A N Y W H E R E    T O    S T A R T";
        this._start.color = "yellow";
        this._start.fontFamily = this._font;
        this._start.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._start.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this._start.fontSize = 30;
        this._start.top = 200;
        this._advancedTexture.addControl(this._start);


        this._titleFront = new GUI.TextBlock("titleFront");
            this._titleFront.text = "Hampas";
            this._titleFront.color = "white";
            this._titleFront.fontSize = 196;
            this._titleFront.fontFamily = this._font;
            this._titleFront.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            this._titleFront.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            this._titleFront.top = -250;
            this._advancedTexture.addControl(this._titleFront);

        this._authors = new GUI.TextBlock("authors");
            this._authors.text = "by Arvin and Gadtardi";
            this._authors.color = "white";
            this._authors.fontFamily = this._font;
            this._authors.fontSize = 42;
            this._authors.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            this._authors.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            this._authors.top = -75;
            this._advancedTexture.addControl(this._authors);

        this._line = new GUI.Line();
            this._line.color = "white";
            this._line.lineWidth = 20;
            this._line.x1 = 0;
            this._line.y1 = 300;
            this._line.x2 = 2000;
            this._line.y2 = 300;
            this._line.alpha = 0.2;
            this._advancedTexture.addControl(this._line);
    }


    public hide() {   
        this._start.dispose();
        this._titleFront.dispose();
        this._authors.dispose();
        this._line.dispose();
    }
}