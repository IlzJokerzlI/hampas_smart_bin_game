import * as BABYLON from "babylonjs";
import { GridMaterial } from "babylonjs-materials"

const groundSide = 11
const wallHeight = groundSide * 2

// World axes
function showWorldAxes(size, scene) {
    let makeTextPlane = function(text, color, size) {
        let dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
        let plane = BABYLON.MeshBuilder.CreatePlane("TextPlane", { size }, scene);
        let planeMaterial = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
        plane.material = planeMaterial;
        planeMaterial.backFaceCulling = false;
        planeMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        planeMaterial.diffuseTexture = dynamicTexture;
        return plane;
    };

    let axisX = BABYLON.MeshBuilder.CreateLines(
        "axisX",
        {
            points: [BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)],
        },
        scene,
    );
    axisX.color = new BABYLON.Color3(1, 0, 0);
    let xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);

    let axisY = BABYLON.MeshBuilder.CreateLines(
        "axisY",
        {
            points: [BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)],
        },
        scene,
    );
    axisY.color = new BABYLON.Color3(0, 1, 0);
    let yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);

    let axisZ = BABYLON.MeshBuilder.CreateLines(
        "axisZ",
        {
            points: [BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)],
        },
        scene,
    );
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    let zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};

// Vector for rotation with degree as unit
function getRotateVector({ x = 0, y = 0, z = 0 }): BABYLON.Vector3 {
    const degreeToRadiant = (val: number) => (val == 0) ? 0 : val * Math.PI / 180
    return new BABYLON.Vector3(degreeToRadiant(x), degreeToRadiant(y), degreeToRadiant(z))
}

// Create board
function createBoard(scene: BABYLON.Scene) {
    /// [walls] contain a map of information about the walls in the board.
    /// The keys act as the name of the wall, the values contain the data
    /// of each walls. They are formatted as following:
    ///
    /// [x-position, y-position, z-position, y-rotation]
    let walls = new Map([
        ['fWall', [0, wallHeight / 2 - 0.5, groundSide / 2, 0]],
        ['bWall', [0, wallHeight / 2 - 0.5, -groundSide / 2, 180]],
        ['lWall', [groundSide / 2, wallHeight / 2 - 0.5, 0, 90]],
        ['rWall', [-groundSide / 2, wallHeight / 2 - 0.5, 0, 270]]
    ])

    // Board material
    const mat = new GridMaterial('mat', scene)
    mat.gridOffset = new BABYLON.Vector3(0.5, 0, 0.5)
    mat.majorUnitFrequency = 0
    mat.lineColor = new BABYLON.Color3(1.0, 1.0, 1.0)
    mat.mainColor = new BABYLON.Color3(1.0, 1.0, 1.0)
    mat.opacity = 0.98

    // Ground
    let ground = BABYLON.MeshBuilder.CreateGround('ground', { width: groundSide, height: groundSide, subdivisions: groundSide }, scene)
    ground.material = mat
    ground.position = new BABYLON.Vector3(0, -0.5)

    // Walls
    for (let [name, data] of walls) {
        let wall = BABYLON.MeshBuilder.CreatePlane(name, { width: groundSide, height: wallHeight }, scene)
        wall.position = new BABYLON.Vector3(data[0], data[1], data[2])
        wall.rotation = getRotateVector({ y: data[3] })
        wall.material = mat
    }
}

class App {
    constructor() {
        // Create the canvas html element and attach it to the webpage
        let canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // Initialize babylon scene and engine
        let engine = new BABYLON.Engine(canvas, true);
        let scene = new BABYLON.Scene(engine);

        showWorldAxes(10, scene)

        // Camera
        let camera: BABYLON.ArcRotateCamera = new BABYLON.ArcRotateCamera("camera", 1, 1, 45, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);

        // Light
        let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);

        // Board
        createBoard(scene)

        // Block
        let block = BABYLON.MeshBuilder.CreateBox('block', { height: 1, width: 1, depth: 1, }, scene)
        block.enableEdgesRendering()
        block.edgesColor = new BABYLON.Color4(1, 1, 1, 1)

        // Material
        let mat = new BABYLON.StandardMaterial('', scene)
        mat.diffuseColor = new BABYLON.Color3(1, 1, 0)
        block.material = mat

        // Hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }
}
new App();