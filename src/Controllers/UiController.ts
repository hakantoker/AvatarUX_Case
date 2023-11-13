import * as PIXI from "pixi.js";
import SlotMachineController from "./SlotMachineController";
import SpinButton from "../UI/SpinButton";
import WinMessage from "../UI/WinMessage";

export default class UiController {
    private app: PIXI.Application;
    private _viewContainer: PIXI.Container = new PIXI.Container();

    private _background: PIXI.Sprite = new PIXI.Sprite();
    private _spinButton: SpinButton = new SpinButton();
    private _winMessage: WinMessage = new WinMessage();

    private _slotMachineController: SlotMachineController | undefined;

    constructor(app: PIXI.Application) {
        this.app = app;
        this._viewContainer.zIndex = 100;

        this._background.texture = PIXI.Texture.from("background");

        this.app.stage.addChild(this._background);

        this._viewContainer.addChild(this._spinButton);
        this._viewContainer.addChild(this._winMessage);

        this.createSpinButtonEvent();
    }

    getViewContainer(): PIXI.Container {
        return this._viewContainer;
    }

    assignSlotMachineController(slotMachineController: SlotMachineController): void {
        this._slotMachineController = slotMachineController;
    }

    createSpinButtonEvent(): void {
        this._spinButton.on(this._spinButton.clickEventName, () => {
            this._spinButton.disable();
            this._slotMachineController?.spin().then(() => {
                this._spinButton.enable();
            });
        });
    }

    showWinMessage(winAmount: number): void {
        this._winMessage.show(winAmount);
    }

    hideWinMessage(): void {
        this._winMessage.hide();
    }

    resize(width: number, height: number): void {
        const backgroundScale = Math.max(
            width / this._background.texture.orig.width,
            height / this._background.texture.orig.height,
        );
        this._background.scale.set(backgroundScale);

        this._winMessage.resize(width, height);
        this._spinButton.resize(width, height);
    }
}
