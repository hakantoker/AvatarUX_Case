import { REEL_COUNT, SYMBOL_COUNT, SYMBOL_HEIGHT, SYMBOL_WIDTH } from "../constants";
import * as PIXI from "pixi.js";
export default class SlotMachineView {
    private _container: PIXI.Container = new PIXI.Container();
    private _slotImage: PIXI.Graphics = new PIXI.Graphics();
    private _bounds: PIXI.Rectangle = new PIXI.Rectangle(0, 0, 0, 0);
    private _maskImage: PIXI.Graphics = new PIXI.Graphics();

    get container(): PIXI.Container {
        return this._container;
    }

    createMaskImage(): void {
        this._maskImage.beginFill(0x000000);
        this._maskImage.drawRect(0, 0, REEL_COUNT * SYMBOL_WIDTH, SYMBOL_COUNT * SYMBOL_HEIGHT);
        this._maskImage.endFill();
        this._maskImage.alpha = 1;
        this._container.addChild(this._maskImage);
    }

    createSlotImage(): void {
        this._slotImage.beginFill(0x516078);
        this._slotImage.lineStyle(16, 0xffffff, 1, 1);
        this._slotImage.drawRect(0, 0, REEL_COUNT * SYMBOL_WIDTH, SYMBOL_COUNT * SYMBOL_HEIGHT);
        this._slotImage.endFill();
        this._slotImage.alpha = 1;
        this._container.addChild(this._slotImage);
    }

    calculateBounds(): void {
        this._container.calculateBounds();
        this._bounds = this._container.getBounds();
    }

    getMaskImage(): PIXI.Graphics {
        return this._maskImage;
    }

    resize(width: number, height: number): void {
        const scale = Math.min((width * 0.85) / this._bounds.width, (height * 0.7) / this._bounds.height);
        this._container.scale.set(scale);

        this._container.pivot.x = this._bounds.width / 2;
        this._container.pivot.y = this._bounds.height / 2;

        this._container.x = width / 2;
        this._container.y = height / 2;
    }
}
