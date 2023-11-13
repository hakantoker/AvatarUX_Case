import SymbolController from "../Controllers/SymbolController";

export default class ReelModel {
    private _rowIndex: number = 0;
    private _symbolCount: number = 0;
    private _symbolData: string[] = [];
    private _symbols: SymbolController[] = [];

    //#region Getters and Setters

    get symbolData(): string[] {
        return this._symbolData;
    }

    set symbolData(value: string[]) {
        this._symbolData = value;
    }

    set rowIndex(value: number) {
        this._rowIndex = value;
    }

    get rowIndex(): number {
        return this._rowIndex;
    }

    set symbolCount(value: number) {
        this._symbolCount = value;
    }

    get symbolCount(): number {
        return this._symbolCount;
    }

    get symbols(): SymbolController[] {
        return this._symbols;
    }

    //#endregion

    addSymbol(symbol: SymbolController): void {
        this._symbols.push(symbol);
    }
}
