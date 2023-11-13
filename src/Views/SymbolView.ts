import * as PIXI from "pixi.js";
import {
    REEL_FALL_DURATION,
    SYMBOL_COUNT,
    SYMBOL_DROP_HEIGHT,
    SYMBOL_FALL_GAP,
    SYMBOL_HEIGHT,
    SymbolTexture,
} from "../constants";
import { gsap } from "gsap";

export default class SymbolView {
    private _container: PIXI.Container = new PIXI.Container();
    private _symbolImage: PIXI.Sprite = new PIXI.Sprite();
    private _symbolImageConnect: PIXI.Sprite = new PIXI.Sprite();
    private _animationTween: gsap.core.Tween | null = null;

    constructor() {
        this.createSymbolImage();
    }

    get container(): PIXI.Container {
        return this._container;
    }

    createSymbolImage(): void {
        const textureName: SymbolTexture = this.getRandomSymbol();
        this._symbolImage.texture = PIXI.Texture.from(textureName);
        this._symbolImage.anchor.set(0.5);

        this._symbolImageConnect.texture = PIXI.Texture.from(textureName + "_connect");
        this._symbolImageConnect.anchor.set(0.5);
        this._symbolImageConnect.visible = false;
        this._container.addChild(this._symbolImage);
        this._container.addChild(this._symbolImageConnect);
    }

    changeToSymbol(symbolTexture: SymbolTexture): void {
        this._symbolImage.texture = PIXI.Texture.from(symbolTexture);
        this._symbolImageConnect.texture = PIXI.Texture.from(symbolTexture + "_connect");
    }

    getRandomSymbol(): SymbolTexture {
        const symbolTextures: SymbolTexture[] = Object.values(SymbolTexture);
        const randomIndex: number = Math.floor(Math.random() * symbolTextures.length);
        return symbolTextures[randomIndex];
    }

    symbolDrop(columnIndex: number): Promise<void> {
        return new Promise<void>((resolve) => {
            gsap.to(this.container, {
                duration: REEL_FALL_DURATION,
                delay: (SYMBOL_COUNT - 1 - columnIndex) * SYMBOL_FALL_GAP,
                pixi: {
                    y: this.container.y + SYMBOL_DROP_HEIGHT,
                },
                ease: "sine.inOut",
                onComplete: () => {
                    resolve();
                },
            });
        });
    }

    symbolFall(columnIndex: number): Promise<void> {
        return new Promise<void>((resolve) => {
            gsap.fromTo(
                this.container,
                {
                    duration: REEL_FALL_DURATION,
                    pixi: {
                        y: this.container.y - SYMBOL_DROP_HEIGHT * 2,
                    },
                    ease: "sine.inOut",
                },
                {
                    duration: 0.5,
                    delay: (SYMBOL_COUNT - 1 - columnIndex) * SYMBOL_FALL_GAP,

                    pixi: {
                        y: this.container.y - SYMBOL_DROP_HEIGHT,
                    },
                    ease: "sine.inOut",
                    onComplete: () => {
                        resolve();
                    },
                },
            );
        });
    }

    animateSymbol(): void {
        const animationTweenObj = {
            k: 0,
        };
        this._animationTween = gsap.to(animationTweenObj, {
            duration: 0.2,
            k: 1,
            repeat: -1,
            onRepeat: () => {
                this._symbolImageConnect.visible = !this._symbolImageConnect.visible;
            },
        });
    }

    removeAnimation(): void {
        if (this._animationTween) {
            this._animationTween.kill();
            this._animationTween = null;
        }
        this._symbolImageConnect.visible = false;
    }

    adjustPosition(x: number, y: number): void {
        this._symbolImage.x = x + this._symbolImage.width / 2;
        this._symbolImage.y = y + this._symbolImage.height / 2;

        this._symbolImageConnect.x = x + this._symbolImage.width / 2;
        this._symbolImageConnect.y = y + this._symbolImage.height / 2;
    }

    getPosition(): PIXI.Point {
        return new PIXI.Point(this._symbolImage.x, this._symbolImage.y);
    }
}
