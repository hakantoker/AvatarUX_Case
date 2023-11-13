import ReelController from "../Controllers/ReelController";

export default class SlotMachineModel {
    private _reelCount: number = 0;
    private _symbolCount: number = 0;
    private _reels: ReelController[] = [];
    private _isSpinning: boolean = false;

    //#region Getters and Setters

    get reelCount(): number {
        return this._reelCount;
    }

    set reelCount(value: number) {
        this._reelCount = value;
    }

    get symbolCount(): number {
        return this._symbolCount;
    }

    set symbolCount(value: number) {
        this._symbolCount = value;
    }

    get reels(): ReelController[] {
        return this._reels;
    }

    get isSpinning(): boolean {
        return this._isSpinning;
    }

    set isSpinning(value: boolean) {
        this._isSpinning = value;
    }

    //#endregion

    addReel(reel: ReelController): void {
        this._reels.push(reel);
    }
}
