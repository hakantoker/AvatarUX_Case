import ReelModel from "../Models/ReelModel";
import ReelView from "../Views/ReelView";
import { SymbolTexture } from "../constants";
import * as PIXI from "pixi.js";
import SymbolController from "./SymbolController";

export default class ReelController {
    private _model: ReelModel;
    private _view: ReelView;

    constructor(slotMachineContainer: PIXI.Container, _rowIndex: number, _symbolCount: number) {
        this._model = new ReelModel();
        this._view = new ReelView(slotMachineContainer);
        this._model.rowIndex = _rowIndex;
        this._model.symbolCount = _symbolCount;
        this.createSymbols(this._model.symbolCount);
    }

    adjustPosition(x: number, y: number): void {
        this._view.adjustPosition(x, y);
    }

    getViewContainer() {
        return this._view.container;
    }

    setMask(mask: PIXI.Graphics): void {
        this.getViewContainer().mask = mask;
    }

    createSymbols(symbolCount: number) {
        for (let i: number = 0; i < symbolCount; i++) {
            const symbol: SymbolController = new SymbolController(i);
            symbol.adjustPosition(0, this._view.getYPosition(i));
            this.getViewContainer().addChild(symbol.getViewContainer());
            this._model.addSymbol(symbol);
        }
    }

    setSymbolData(symbolData: string[]): void {
        this._model.symbolData = symbolData;
        this._model.symbols.forEach((symbol: SymbolController, index: number) => {
            symbol.changeToSymbol(SymbolTexture[symbolData[index] as keyof typeof SymbolTexture]);
        });
    }

    getSymbolItem(index: number): SymbolController {
        return this._model.symbols[index];
    }

    getAllSymbolItems(): SymbolController[] {
        return this._model.symbols;
    }

    async startSpinning(): Promise<void> {
        const symbolPromises = this._model.symbols.map((symbol: SymbolController) => {
            return symbol.drop();
        });
        await Promise.all(symbolPromises).then(() => {
            return Promise.resolve();
        });
    }

    async stopSpinning(): Promise<void> {
        const symbolPromises = this._model.symbols.map((symbol: SymbolController) => {
            return symbol.fall();
        });

        await Promise.all(symbolPromises).then(() => {
            return Promise.resolve();
        });
    }
}
