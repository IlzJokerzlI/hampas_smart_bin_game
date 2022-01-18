import * as BABYLON from "babylonjs"
import { Vector3 } from "babylonjs/Maths/math.vector"
import { GameBoard } from "./app/game-board"
import { Rad, WorldAxes } from './app/utils'

const groundSide = 11
const wallHeight = groundSide * 2

class App {
    blocks: BABYLON.Mesh[] = [];

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
        let worldAxes: WorldAxes | null = null
        scene.collisionsEnabled = true

        // Camera
        let camera: BABYLON.ArcRotateCamera = new BABYLON.ArcRotateCamera("camera", Rad(270), 0.5, 45, BABYLON.Vector3.Zero(), scene)
        camera.attachControl(canvas, true)
        camera.checkCollisions = true

        // Light
        let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene)

        // Board
        const board = new GameBoard(scene, { side: groundSide, height: wallHeight })

        const generateBlock = () => {
            // Block
            let block = BABYLON.MeshBuilder.CreateBox('block', { height: 1, width: 1, depth: 1, }, scene)
            block.enableEdgesRendering()
            block.edgesColor = new BABYLON.Color4(1, 1, 1, 1)
            block.position = new BABYLON.Vector3(0, 15, 0)
            block.ellipsoid = new BABYLON.Vector3(0.4999, 0.4999, 0.4999)
            block.checkCollisions = true;

            // Material
            let mat = new BABYLON.StandardMaterial('', scene)
            mat.diffuseColor = new BABYLON.Color3(1, 1, 0)
            block.material = mat

            return block
        }
        this.blocks.push(generateBlock());



        window.addEventListener("keydown", (ev) => {
            if (ev.ctrlKey && ev.shiftKey && ev.altKey) {
                if (ev.key === 'I') { // Hide/show the Inspector (Ctrl+Shift+Alt+I)
                    if (scene.debugLayer.isVisible()) {
                        scene.debugLayer.hide()
                    } else {
                        scene.debugLayer.show()
                    }
                } else if (ev.key === 'X') { // Hide/show the world axes (Ctrl+Shift+Alt+X)
                    if (worldAxes === null) {
                        worldAxes = new WorldAxes(scene, {})
                    } else {
                        worldAxes.dispose()
                        worldAxes = null
                    }
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
                        // x clock wise rotation
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
            const block = this.blocks[this.blocks.length - 1]
            if (ev.key === 'w' && block.position.z < groundSide / 2 - 1) { // Front
                block.moveWithCollisions(new BABYLON.Vector3(0, 0, 1))
            } else if (ev.key === 's' && block.position.z > -groundSide / 2 + 1) { // Back
                block.moveWithCollisions(new BABYLON.Vector3(0, 0, -1))
            } else if (ev.key === 'a' && block.position.x > -groundSide / 2 + 1) { // Left
                block.moveWithCollisions(new BABYLON.Vector3(-1, 0, 0))
            } else if (ev.key === 'd' && block.position.x < groundSide / 2 - 1) { // Right
                block.moveWithCollisions(new BABYLON.Vector3(1, 0, 0))
            } else if (!ev.shiftKey && ev.key === ' ' && block.position.y > 0.5) { // Down
                block.moveWithCollisions(new BABYLON.Vector3(0, -1, 0))
            } else if (ev.shiftKey && ev.key === ' ' && block.position.y < wallHeight - 1.5) { // Up
                block.moveWithCollisions(new BABYLON.Vector3(0, 1, 0))
            }
            block.position = new BABYLON.Vector3(Math.round(block.position.x), Math.round(block.position.y), Math.round(block.position.z))
        })

        setInterval(() => {
            const block = this.blocks[this.blocks.length - 1]
            let a = block.moveWithCollisions(new BABYLON.Vector3(0, -1, 0))
            block.position = new BABYLON.Vector3(Math.round(block.position.x), Math.round(block.position.y), Math.round(block.position.z))
        }, 1000)

        // Run the main render loop
        engine.runRenderLoop(() => {
            // Prevent camera going under ground level
            if (camera.position.y < 0) {
                camera.beta = Rad(90)
            }

            const block = this.blocks[this.blocks.length - 1]
            const collidedMeshPos = block.collider?.collidedMesh?.position
            if (block.collider?.collisionFound && collidedMeshPos != undefined && block.position.y - collidedMeshPos.y >= 0.5) {
                this.blocks.push(generateBlock())
            }
            scene.render()
        })
    }
}

// Entry point
async function main() {
    // Start App
    new App()
}

main()
