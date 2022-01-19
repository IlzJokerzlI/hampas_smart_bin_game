import * as BABYLON from "babylonjs"
import { GameOverMenu } from "./app/game-over-menu"
import { Gameplay } from "./app/gameplay"
import { Menu } from "./app/menu"
import { Rad } from './app/utils'


class App {
    canvas: HTMLCanvasElement
    scene: BABYLON.Scene
    menu!: Menu 
    gameOverMenu!: GameOverMenu 
    gameplay!: Gameplay
    isGameOver = false
    finalScore = 0

    constructor() {
        // Create the canvas html element and attach it to the webpage
        this.canvas = document.createElement("canvas")
        this.canvas.style.width = "100%"
        this.canvas.style.height = "100%"
        this.canvas.id = "gameCanvas"
        document.body.appendChild(this.canvas)

        // Initialize babylon scene and engine
        let engine = new BABYLON.Engine(this.canvas, true)
        this.scene = new BABYLON.Scene(engine)
        this.scene.collisionsEnabled = true

        window.addEventListener('resize', ()=> {
            engine.resize()
        })

        this.createScene(this.scene)

        engine.runRenderLoop(() => {
            if (!this.isGameOver) {
                this.scene.render()
            } else {
                this.menu!._advancedTexture!.dispose()
                this.scene.dispose()
                const tempScene = new BABYLON.Scene(engine)
                this.createScene(tempScene)
                this.scene = tempScene
                this.scene.render()
            }
        })
    }

    private createScene(scene: BABYLON.Scene) {
        const engine = scene.getEngine()

        // Camera
        let camera: BABYLON.ArcRotateCamera = new BABYLON.ArcRotateCamera("camera", Rad(270), 0.5, 45, BABYLON.Vector3.Zero(), scene)
        camera.attachControl(this.canvas, true)
        camera.checkCollisions = true

        // Light
        let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene)

        engine.runRenderLoop(() => {
            // Prevent camera going under ground level
            if (camera.position.y < 0) {
                camera.beta = Rad(90)
            }
            scene.render()
        })
 
        if (this.isGameOver) {
            this.gameOverMenu = new GameOverMenu(scene, this.finalScore);
            let pointerDown = scene.onPointerObservable.add((pointerInfo) => {
                switch (pointerInfo.type) {
                    case BABYLON.PointerEventTypes.POINTERDOWN:
                        scene.onPointerObservable.remove(pointerDown);
                        this.gameOverMenu!.hide();
                        this.isGameOver= false;
                        this.gameplay = new Gameplay(scene);
                        scene.registerBeforeRender(() => {
                            if (this.gameplay!.isGameOver) {
                                this.isGameOver = true;
                                this.finalScore = this.gameplay?.totalWeight!
                            }
                        });
                        break;
                }
            });
        } else {
            this.menu = new Menu(scene);
            let pointerDown = scene.onPointerObservable.add((pointerInfo) => {
                switch (pointerInfo.type) {
                    case BABYLON.PointerEventTypes.POINTERDOWN:
                        scene.onPointerObservable.remove(pointerDown);
                        this.menu!.hide();
                        this.gameplay = new Gameplay(scene);
                        scene.registerBeforeRender(() => {
                            if (this.gameplay!.isGameOver) {
                                this.isGameOver = true
                                this.finalScore = this.gameplay?.totalWeight!
                            }
                        })
                        break;
                }
            });
        }

   }
}

// Entry point
async function main() {
    // Start App
    new App()
}

main()
