import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import * as BABYLON from "@babylonjs/core";

const groundSide = 11
const wallHeight = groundSide * 2

// World axes
function showWorldAxes(size, scene) {
    var makeTextPlane = function(text, color, size) {
        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
        var plane = BABYLON.MeshBuilder.CreatePlane("TextPlane", { size }, scene);
        var planeMaterial = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
        plane.material = planeMaterial;
        planeMaterial.backFaceCulling = false;
        planeMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        planeMaterial.diffuseTexture = dynamicTexture;
        return plane;
    };

    var axisX = BABYLON.MeshBuilder.CreateLines(
        "axisX",
        {
            points: [BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)],
        },
        scene,
    );
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);

    var axisY = BABYLON.MeshBuilder.CreateLines(
        "axisY",
        {
            points: [BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)],
        },
        scene,
    );
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);

    var axisZ = BABYLON.MeshBuilder.CreateLines(
        "axisZ",
        {
            points: [BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)],
        },
        scene,
    );
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};

// Vector for rotation with degree as unit
function getRotateVector({ x = 0, y = 0, z = 0 }): BABYLON.Vector3 {
    const degreeToRadiant = (val: number) => (val == 0) ? 0 : val * Math.PI / 180
    return new BABYLON.Vector3(degreeToRadiant(x), degreeToRadiant(y), degreeToRadiant(z))
}

// Create board
function createBoard(scene: BABYLON.Scene) {
    // Ground
    var ground = BABYLON.MeshBuilder.CreateGround('ground', { width: groundSide, height: groundSide, subdivisions: groundSide }, scene)
    ground.material = new BABYLON.StandardMaterial('groundMat', scene)
    ground.material.wireframe = true;
    ground.position = new BABYLON.Vector3(0, -0.5)

    // Walls
    var fWall = BABYLON.MeshBuilder.CreatePlane('fWall', { width: groundSide, height: wallHeight }, scene)
    fWall.position = new BABYLON.Vector3(0, wallHeight / 2 - 0.5, groundSide / 2)

    var bWall = BABYLON.MeshBuilder.CreatePlane('bWall', { width: groundSide, height: wallHeight }, scene)
    bWall.position = new BABYLON.Vector3(0, wallHeight / 2 - 0.5, -groundSide / 2)
    bWall.rotation = getRotateVector({ y: 180 })

    var lWall = BABYLON.MeshBuilder.CreatePlane('lWall', { width: groundSide, height: wallHeight }, scene)
    lWall.position = new BABYLON.Vector3(groundSide / 2, wallHeight / 2 - 0.5)
    lWall.rotation = getRotateVector({ y: 90 })

    var rWall = BABYLON.MeshBuilder.CreatePlane('rWall', { width: groundSide, height: wallHeight }, scene)
    rWall.position = new BABYLON.Vector3(-groundSide / 2, wallHeight / 2 - 0.5)
    rWall.rotation = getRotateVector({ y: 270 })
}

class App {
    constructor() {
        // Create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // Initialize babylon scene and engine
        var engine = new BABYLON.Engine(canvas, true);
        var scene = new BABYLON.Scene(engine);

        showWorldAxes(10, scene)

        // Camera
        var camera: BABYLON.ArcRotateCamera = new BABYLON.ArcRotateCamera("camera", 1, 1, 45, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);

        // Light
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);

        // Board
        createBoard(scene)

        // Block
        var block = BABYLON.MeshBuilder.CreateBox('block', { height: 1, width: 1, depth: 1, }, scene)
        block.enableEdgesRendering()
        block.edgesColor = new BABYLON.Color4(1, 1, 1, 1)

        // Material
        var mat = new BABYLON.StandardMaterial('', scene)
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