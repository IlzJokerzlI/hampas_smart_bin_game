import * as BABYLON from "babylonjs"
import { Vector3 } from "babylonjs/Maths/math.vector"
import { GameBoard } from "./app/game-board"
import { Gameplay } from "./app/gameplay"
import { Rad, WorldAxes } from './app/utils'

const groundSide = 11
const wallHeight = groundSide * 2

class App {
    blocks: BABYLON.Mesh[] = [];
    getCurrentBlock = (): BABYLON.Mesh => {
        return this.blocks[this.blocks.length - 1]
    }

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
        let gameplay = new Gameplay(scene)

        // Camera
        let camera: BABYLON.ArcRotateCamera = new BABYLON.ArcRotateCamera("camera", Rad(270), 0.5, 45, BABYLON.Vector3.Zero(), scene)
        camera.attachControl(canvas, true)
        camera.checkCollisions = true

        // Light
        let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene)

        // Board
        const board = new GameBoard(scene, { side: groundSide, height: wallHeight })

        this.blocks.push(gameplay.generateBlock());



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
            const currentBlock = this.getCurrentBlock()
            if (ev.key === 'w' && currentBlock.position.z < groundSide / 2 - 1) { // Front
                currentBlock.moveWithCollisions(new BABYLON.Vector3(0, 0, 1))
            } else if (ev.key === 's' && currentBlock.position.z > -groundSide / 2 + 1) { // Back
                currentBlock.moveWithCollisions(new BABYLON.Vector3(0, 0, -1))
            } else if (ev.key === 'a' && currentBlock.position.x > -groundSide / 2 + 1) { // Left
                currentBlock.moveWithCollisions(new BABYLON.Vector3(-1, 0, 0))
            } else if (ev.key === 'd' && currentBlock.position.x < groundSide / 2 - 1) { // Right
                currentBlock.moveWithCollisions(new BABYLON.Vector3(1, 0, 0))
            } else if (!ev.shiftKey && ev.key === ' ' && currentBlock.position.y > 0.5) { // Down
                currentBlock.moveWithCollisions(new BABYLON.Vector3(0, -1, 0))
            } else if (ev.shiftKey && ev.key === ' ' && currentBlock.position.y < wallHeight - 1.5) { // Up
                currentBlock.moveWithCollisions(new BABYLON.Vector3(0, 1, 0))
            }
            currentBlock.position = new BABYLON.Vector3(Math.round(currentBlock.position.x), Math.round(currentBlock.position.y), Math.round(currentBlock.position.z))
        })

        setInterval(() => {
            const currentBlock = this.getCurrentBlock()
            let a = currentBlock.moveWithCollisions(new BABYLON.Vector3(0, -1, 0))
            currentBlock.position = new BABYLON.Vector3(Math.round(currentBlock.position.x), Math.round(currentBlock.position.y), Math.round(currentBlock.position.z))
        }, 1000)

        // Run the main render loop
        engine.runRenderLoop(() => {
            // Prevent camera going under ground level
            if (camera.position.y < 0) {
                camera.beta = Rad(90)
            }

            const currentBlock = this.getCurrentBlock()
            const collidedMeshPos = currentBlock.collider?.collidedMesh?.position
            if (currentBlock.collider?.collisionFound && collidedMeshPos != undefined && currentBlock.position.y - collidedMeshPos.y >= 0.5) {
                this.blocks.push(gameplay.generateBlock())
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
