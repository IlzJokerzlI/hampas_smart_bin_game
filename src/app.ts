import * as BABYLON from "babylonjs"
import { GameBoard } from "./app/game-board"
import { Rad } from './app/utils'

const groundSide = 11
const wallHeight = groundSide * 2

// World axes
function showWorldAxes(size, scene) {
    let makeTextPlane = function(text, color, size) {
        let dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true)
        dynamicTexture.hasAlpha = true
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true)
        let plane = BABYLON.MeshBuilder.CreatePlane("TextPlane", { size }, scene)
        let planeMaterial = new BABYLON.StandardMaterial("TextPlaneMaterial", scene)
        plane.material = planeMaterial
        planeMaterial.backFaceCulling = false
        planeMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
        planeMaterial.diffuseTexture = dynamicTexture
        return plane
    }

    let axisX = BABYLON.MeshBuilder.CreateLines(
        "axisX",
        {
            points: [BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)],
        },
        scene,
    )
    axisX.color = new BABYLON.Color3(1, 0, 0)
    let xChar = makeTextPlane("X", "red", size / 10)
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0)

    let axisY = BABYLON.MeshBuilder.CreateLines(
        "axisY",
        {
            points: [BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)],
        },
        scene,
    )
    axisY.color = new BABYLON.Color3(0, 1, 0)
    let yChar = makeTextPlane("Y", "green", size / 10)
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size)

    let axisZ = BABYLON.MeshBuilder.CreateLines(
        "axisZ",
        {
            points: [BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)],
        },
        scene,
    )
    axisZ.color = new BABYLON.Color3(0, 0, 1)
    let zChar = makeTextPlane("Z", "blue", size / 10)
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size)
}

class App {
    constructor() {
        // Create the canvas html element and attach it to the webpage
        let canvas = document.createElement("canvas")
        canvas.style.width = "100%"
        canvas.style.height = "100%"
        canvas.id = "gameCanvas"
        document.body.appendChild(canvas)

        // Initialize babylon scene and engine
        let engine = new BABYLON.Engine(canvas, true)
        let scene = new BABYLON.Scene(engine)
        scene.collisionsEnabled = true

        showWorldAxes(10, scene)

        // Camera
        let camera: BABYLON.ArcRotateCamera = new BABYLON.ArcRotateCamera("camera", Rad(270), 0.5, 45, BABYLON.Vector3.Zero(), scene)
        camera.attachControl(canvas, true)
        camera.checkCollisions = true

        // Light
        let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene)

        // Board
        new GameBoard(scene, {})

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
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'I') {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide()
                } else {
                    scene.debugLayer.show()
                }
            }

            // Block rotation
            if (ev.shiftKey) {
                switch (ev.key) {
                    case 'w': {
                        // x counter-clock wise rotation
                        break
                    }
                    case 's': {
                        // X clock wise rotation
                        break
                    }
                    case 'a': {
                        // y counter-clock wise rotation
                        break
                    }
                    case 'd': {
                        // y clock wise rotation
                        break
                    }
                    case 'q': {
                        // z counter-clock wise rotation
                        break
                    }
                    case 'e': {
                        // z clock wise rotation
                        break
                    }
                }
            }

            // Block movement
            if (ev.key === 'w' && block.position.z < groundSide / 2 - 1) { // Front
                block.position.z += 1
            } else if (ev.key === 's' && block.position.z > -groundSide / 2 + 1) { // Back
                block.position.z -= 1
            } else if (ev.key === 'a' && block.position.x > -groundSide / 2 + 1) { // Left
                block.position.x -= 1
            } else if (ev.key === 'd' && block.position.x < groundSide / 2 - 1) { // Right
                block.position.x += 1
            } else if (!ev.shiftKey && ev.key === ' ' && block.position.y > 0) { // Down
                block.position.y -= 1
            } else if (ev.shiftKey && ev.key === ' ' && block.position.y < wallHeight - 1.5) { // Up
                block.position.y += 1
            }
        })

        // Run the main render loop
        engine.runRenderLoop(() => {

            // Prevent camera going under ground level
            if (camera.position.y < 0) {
                camera.beta = Rad(90)
            }
            scene.render()
        })
    }
}
new App()