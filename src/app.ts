import * as BABYLON from "babylonjs"
import { Gameplay } from "./app/gameplay"
import { Menu } from "./app/menu"
import { Rad} from './app/utils'


class App {
    canvas: HTMLCanvasElement
    menu: Menu
    scene: BABYLON.Scene
    gameplay: Gameplay | undefined

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

        // new Gameplay(this.scene)
        this.menu = new Menu(this.scene)

        this.createScene(this.scene)
    }

    private createScene(scene: BABYLON.Scene) {
        const engine = scene.getEngine()

        let pointerDown = scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    scene.onPointerObservable.remove(pointerDown);
                    this.menu.hide();
                    this.gameplay = new Gameplay( scene);
                    break;
            }
        });

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
        var music = new BABYLON.Sound("Music", "/assets/sounds/DieWachtAmRhein8bit.mp3", scene, null, { loop: true, autoplay: true }); //music
    }
}

// Entry point
async function main() {
    // Start App
    new App()
}

main()
