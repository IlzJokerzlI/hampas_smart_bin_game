import * as BABYLON from 'babylonjs'

// Get radiant value from degree
export function Rad(val: number): number { return (val == 0) ? 0 : val * Math.PI / 180 }

// Vector for rotation with degree as unit
export function RadRotVect({ x = 0, y = 0, z = 0 }): BABYLON.Vector3 {
    return new BABYLON.Vector3(Rad(x), Rad(y), Rad(z))
}

// Round
export function Round(value, step) {
    step || (step = 1.0);
    var inv = 1.0 / step;
    return Math.round(value * inv) / inv;
}

// World axes
export class WorldAxes {
    private _scene: BABYLON.Scene
    private _AxesLines: Array<BABYLON.LinesMesh> = []

    dispose() {
        this._AxesLines.forEach((v) => {
            v.dispose()
        })
    }

    constructor(scene: BABYLON.Scene, { size = 10 }) {
        this._scene = scene
        let makeTextPlane = function(text: string, color: string, size: number) {
            let dynamicTexture = new BABYLON.DynamicTexture('DynamicTexture', 50, scene, true)
            dynamicTexture.hasAlpha = true
            dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true)
            let plane = BABYLON.MeshBuilder.CreatePlane('TextPlane', { size }, scene)
            let planeMaterial = new BABYLON.StandardMaterial('TextPlaneMaterial', scene)
            plane.material = planeMaterial
            planeMaterial.backFaceCulling = false
            planeMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
            planeMaterial.diffuseTexture = dynamicTexture
            return plane
        }

        let axisX = BABYLON.MeshBuilder.CreateLines(
            'axisX',
            {
                points: [BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)],
            },
            scene,
        )
        axisX.color = new BABYLON.Color3(1, 0, 0)
        let xChar = makeTextPlane('X', 'red', size / 10)
        xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0)
        xChar.parent = axisX

        let axisY = BABYLON.MeshBuilder.CreateLines(
            'axisY',
            {
                points: [BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)],
            },
            scene,
        )
        axisY.color = new BABYLON.Color3(0, 1, 0)
        let yChar = makeTextPlane('Y', 'green', size / 10)
        yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size)
        yChar.parent = axisY

        let axisZ = BABYLON.MeshBuilder.CreateLines(
            'axisZ',
            {
                points: [BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)],
            },
            scene,
        )
        axisZ.color = new BABYLON.Color3(0, 0, 1)
        let zChar = makeTextPlane('Z', 'blue', size / 10)
        zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size)
        zChar.parent = axisZ

        this._AxesLines.push(axisX)
        this._AxesLines.push(axisY)
        this._AxesLines.push(axisZ)
    }
}