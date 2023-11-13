import * as PIXI from "pixi.js";
import { SYMBOL_HEIGHT, SYMBOL_WIDTH, SYMBOL_COUNT } from "./../constants";
import SymbolView from "./SymbolView";

export default class ReelView {
    private _container: PIXI.Container = new PIXI.Container();
    private background: PIXI.Graphics = new PIXI.Graphics();
    private _symbols: SymbolView[] = [];

    constructor(slotMachineContainer: PIXI.Container) {
        this._container.sortableChildren = true;
        slotMachineContainer.addChild(this._container);

        this.background.beginFill(0x000000, 0);
        this.background.drawRect(0, 0, SYMBOL_WIDTH, SYMBOL_HEIGHT * SYMBOL_COUNT);
        this.background.endFill();
        this._container.addChild(this.background);
    }

    get symbols(): SymbolView[] {
        return this._symbols;
    }

    get container(): PIXI.Container {
        return this._container;
    }

    getYPosition(index: number): number {
        return index * SYMBOL_HEIGHT;
    }

    getMaxSymbolPosition(): number {
        return SYMBOL_HEIGHT * SYMBOL_COUNT;
    }

    adjustPosition(x: number, y: number): void {
        this._container.x = x;
        this._container.y = y;
    }
}
