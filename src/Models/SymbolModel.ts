export default class SymbolModel {
    private _columnIndex: number = 0;

    //#region Getters and Setters

    get columnIndex(): number {
        return this._columnIndex;
    }

    set columnIndex(value: number) {
        this._columnIndex = value;
    }

    //#endregion
}
