import { Application, Loader, Texture, AnimatedSprite } from "pixi.js";
import "./style.css";
import SlotMachineController from "./Controllers/SlotMachineController";
import * as PIXI from "pixi.js";
import PixiPlugin from "gsap/PixiPlugin";
import gsap from "gsap";
import UiController from "./Controllers/UiController";
import { REEL_COUNT, SYMBOL_COUNT } from "./constants";

const gameWidth = 800;
const gameHeight = 800;

const app = new Application({
    backgroundColor: 0x19f3a5,
    backgroundAlpha: 0,
    width: gameWidth,
    height: gameHeight,
});

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);

window.onload = async (): Promise<void> => {
    await loadGameAssets();
    document.body.appendChild(app.view);
    app.stage.sortableChildren = true;

    const uiController = new UiController(app);
    app.stage.addChild(uiController.getViewContainer());

    const slotMachineController = new SlotMachineController(app, REEL_COUNT, SYMBOL_COUNT);
    app.stage.addChild(slotMachineController.getViewContainer());

    uiController.assignSlotMachineController(slotMachineController);
    slotMachineController.assignUiController(uiController);

    const resize = () => {
        const iw = document.body.clientWidth;
        const ih = document.body.clientHeight;

        app.renderer.resize(iw, ih);
        slotMachineController.resize(iw, ih);
        uiController.resize(iw, ih);
    };

    resize();
    setTimeout(resize, 10);
    window.addEventListener("resize", resize);
    app.stage.interactive = true;
};

async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = Loader.shared;
        loader.add("background", "./assets/background.jpg");
        loader.add("atlas", "./assets/atlas.json");

        loader.onComplete.once(() => {
            res();
        });

        loader.onError.once(() => {
            rej();
        });

        loader.load();
    });
}
