import * as BABYLON from 'babylonjs'

export class Label {
    plane: BABYLON.Mesh
    text: BABYLON.DynamicTexture
    fontType: string
    planeWidth: number
    planeHeight: number
    DTWidth: number
    DTHeight: number
    size: number

    constructor(scene: BABYLON.Scene, {
        initialText = '',
        position = new BABYLON.Vector3(0, 0, 0),
        rotation = new BABYLON.Vector3(0, 0, 0),
        planeWidth = 10,
        planeHeight = 3,
        fontType = 'Arial'
    }) {
        this.fontType = fontType
        this.planeWidth = planeWidth
        this.planeHeight = planeHeight
        this.DTWidth = planeWidth * 60;
        this.DTHeight = planeHeight * 60;
        this.text = new BABYLON.DynamicTexture('DynamicTexture', { width: this.DTWidth, height: this.DTHeight }, scene, true);

        this.size = 12;
        let ctx = this.text.getContext();
        ctx.font = this.size + 'px ' + fontType;
        let textWidth = ctx.measureText(initialText).width;
        let ratio = textWidth / this.size;
        let fontSize = Math.floor(this.DTWidth / (ratio * 1));
        let font = fontSize + 'px ' + fontType;
        this.text.drawText(initialText, null, null, font, '#000000', '#ffffff', true);

        this.plane = BABYLON.MeshBuilder.CreatePlane('plane', { width: planeWidth, height: planeHeight }, scene);
        let mat = new BABYLON.StandardMaterial('mat', scene);
        mat.diffuseTexture = this.text;
        this.plane.material = mat;
        this.plane.position = position
        this.plane.rotation = rotation
    }

    updateText(scene: BABYLON.Scene, val: string) {
        let ctx = this.text.getContext();
        ctx.font = this.size + 'px ' + this.fontType;
        let textWidth = ctx.measureText(val).width;
        let ratio = textWidth / this.size;
        let fontSize = Math.floor(this.DTWidth / (ratio * 1));
        let font = fontSize + 'px ' + this.fontType;
        this.text.drawText(val, null, null, font, '#000000', '#ffffff', true);
    }
}