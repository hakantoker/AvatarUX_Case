import SymbolModel from "../Models/SymbolModel";
import { SymbolTexture } from "../constants";
import SymbolView from "./../Views/SymbolView";
import * as PIXI from "pixi.js";

export default class SymbolController {
    private _view: SymbolView;
    private _model: SymbolModel;

    constructor(columnIndex: number) {
        this._view = new SymbolView();
        this._model = new SymbolModel();
        this._model.columnIndex = columnIndex;
    }

    changeToSymbol(symbolTexture: SymbolTexture): void {
        this._view.changeToSymbol(symbolTexture);
    }

    adjustPosition(x: number, y: number): void {
        this._view.adjustPosition(x, y);
    }

    updateColumnIndex(columnIndex: number): void {
        this._model.columnIndex = columnIndex;
    }

    drop(): Promise<void> {
        return this._view.symbolDrop(this._model.columnIndex);
    }

    fall(): Promise<void> {
        return this._view.symbolFall(this._model.columnIndex);
    }

    animateSymbolView(): void {
        this._view.animateSymbol();
    }

    removeAnimation(): void {
        this._view.removeAnimation();
    }

    getViewContainer(): PIXI.Container {
        return this._view.container;
    }
}
