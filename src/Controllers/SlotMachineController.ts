import SlotMachineView from "../Views/SlotMachineView";
import SlotMachineModel from "../Models/SlotMachineModel";
import * as PIXI from "pixi.js";
import UiController from "./UiController";
import { PAY_TABLE, REEL_FALL_GAP, SYMBOL_ARRAY, SYMBOL_WIDTH } from "../constants";
import ReelController from "./ReelController";
import gsap from "gsap";
import SymbolController from "./SymbolController";
import { SpinResult, Way } from "../types";

export default class SlotMachineController {
    private app: PIXI.Application;
    private _view: SlotMachineView;
    private _model: SlotMachineModel;
    private _spinData: string[][] = [];

    private _uiController: UiController | undefined;

    constructor(app: PIXI.Application, reelCount: number, symbolCount: number) {
        this.app = app;

        this._model = new SlotMachineModel();
        this._view = new SlotMachineView();

        this._model.reelCount = reelCount;
        this._model.symbolCount = symbolCount;

        this._spinData = new Array(reelCount).fill(0).map(() => new Array(symbolCount).fill(""));

        this._view.createMaskImage();
        this._view.createSlotImage();
        this.createReels(this._model.reelCount, this._model.symbolCount);
        this._view.calculateBounds();
    }

    assignUiController(uiController: UiController): void {
        this._uiController = uiController;
    }

    getViewContainer(): PIXI.Container {
        return this._view.container;
    }

    createReels(reelCount: number, symbolCount: number): void {
        const slotMachineViewContainer = this.getViewContainer();
        for (let i = 0; i < reelCount; i++) {
            const reelController = new ReelController(slotMachineViewContainer, i, symbolCount);
            reelController.adjustPosition(i * SYMBOL_WIDTH, 0);
            slotMachineViewContainer.addChild(reelController.getViewContainer());
            reelController.setMask(this._view.getMaskImage());
            this._model.addReel(reelController);
        }
    }

    preSpinCallback(): void {
        this._model.isSpinning = true;
        this._uiController?.hideWinMessage();
        this.stopWinAnimation();
    }

    postSpinCallback(): void {
        this._model.isSpinning = false;
    }

    async spin(): Promise<void> {
        if (this._model.isSpinning) return Promise.reject("Already spinning");

        this.preSpinCallback();

        // Drop all symbols
        const dropPromises = this._model.reels.map((reel: ReelController, ind: number) => {
            return new Promise<void>((resolve) => {
                const delayConst = REEL_FALL_GAP;
                gsap.delayedCall(delayConst * ind, () => {
                    reel.startSpinning().then(() => resolve());
                });
            });
        });

        await Promise.all(dropPromises);

        const data = await this.getReelsData();

        this.fillReelsData(data);

        // Fall all symbols
        const fallPromises = this._model.reels.map((reel: ReelController, ind: number) => {
            return new Promise<void>((resolve) => {
                const delayConst = 0.1;
                gsap.delayedCall(delayConst * ind, () => {
                    reel.stopSpinning().then(() => resolve());
                });
            });
        });

        await Promise.all(fallPromises);

        const spinResult = this.checkWin(data);

        if (spinResult.totalPay > 0) {
            this.showPayment(spinResult.totalPay);
            this.startWinAnimation(spinResult.ways);
        }

        this.postSpinCallback();
    }

    getRandomSymbol(): string {
        return SYMBOL_ARRAY[Math.floor(Math.random() * SYMBOL_ARRAY.length)];
    }

    getReelsData(): Promise<string[][]> {
        return new Promise((resolve) => {
            for (let i = 0; i < this._model.reelCount; i++) {
                for (let j = 0; j < this._model.symbolCount; j++) {
                    this._spinData[i][j] = this.getRandomSymbol();
                }
            }
            resolve(this._spinData);
        });
    }

    fillReelsData(data: string[][]): void {
        for (let i = 0; i < this._model.reelCount; i++) {
            for (let j = 0; j < this._model.symbolCount; j++) {
                this._model.reels[i].setSymbolData(data[i]);
            }
        }
    }

    checkWin(data: string[][]): SpinResult {
        const ways: Way[] = [];

        const symbolCount = this._model.symbolCount;
        const reelCount = this._model.reelCount;

        const checkNextReel = function (currentWay: Way, reelIndex: number) {
            const nextReel = data[reelIndex];
            let finished = true;
            for (let index = 0; index < symbolCount; index++) {
                const symbol = nextReel[index];
                if (symbol === currentWay.symbol) {
                    finished = false;
                    const newWay: Way = {
                        symbol: currentWay.symbol,
                        length: currentWay.length + 1,
                        reelIndexes: [...currentWay.reelIndexes, index],
                    };
                    if (reelIndex < reelCount - 1) {
                        checkNextReel(newWay, reelIndex + 1);
                    } else {
                        ways.push(newWay);
                    }
                }
            }
            if (finished && currentWay.length > 2) {
                ways.push(currentWay);
            }
        };

        //Starts checking from the first reel
        for (let index = 0; index < symbolCount; index++) {
            const symbol = data[0][index];
            const way: Way = {
                symbol: symbol,
                length: 1,
                reelIndexes: [index],
            };
            checkNextReel(way, 1);
        }
        console.table(ways);

        const totalPay = this.calculatePay(ways);

        return {
            ways: ways,
            totalPay: totalPay,
        };
    }

    calculatePay(ways: Way[]): number {
        let totalPay = 0;
        ways.forEach((way) => {
            totalPay += PAY_TABLE[way.symbol][way.length - 1];
        });
        return totalPay;
    }

    startWinAnimation(ways: Way[]): void {
        const connectSet = new Set<SymbolController>();
        ways.forEach((way, index) => {
            way.reelIndexes.forEach((symbolIndex: number, reelIndex: number) => {
                const symbol = this.getSymbolItem(reelIndex, symbolIndex);
                connectSet.add(symbol);
            });
        });

        connectSet.forEach((symbol: SymbolController) => {
            symbol.animateSymbolView();
        });
    }

    stopWinAnimation(): void {
        this.getAllSymbolItems().forEach((symbol: SymbolController) => {
            symbol.removeAnimation();
        });
    }

    showPayment(totalPay: number): void {
        this._uiController?.showWinMessage(totalPay);
    }

    getSymbolItem(reelIndex: number, symbolIndex: number): SymbolController {
        return this._model.reels[reelIndex].getSymbolItem(symbolIndex);
    }

    getAllSymbolItems(): SymbolController[] {
        const symbols: SymbolController[] = [];
        this._model.reels.forEach((reel: ReelController) => {
            symbols.push(...reel.getAllSymbolItems());
        });
        return symbols;
    }

    resize(width: number, height: number): void {
        this._view.resize(width, height);
    }
}
