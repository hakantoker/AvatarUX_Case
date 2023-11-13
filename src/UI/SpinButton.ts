import * as PIXI from "pixi.js";
import gsap from "gsap";

export default class SpinButton extends PIXI.Container {
    private _spinButtonBackground: PIXI.Graphics = new PIXI.Graphics();
    private _spinButtonText: PIXI.Text = new PIXI.Text();
    private _clickEventName: string = "pointerdown";
    private _isActivated: boolean = true;
    private _origBounds: PIXI.Rectangle = new PIXI.Rectangle(0, 0, 0, 0);

    constructor() {
        super();

        this._spinButtonBackground.beginFill(0x62665e);
        this._spinButtonBackground.lineStyle(3, 0x000000);
        const width = 100;
        const height = 50;
        this._spinButtonBackground.drawRect(-width / 2, -height / 2, width, height);
        this._spinButtonBackground.endFill();

        this._spinButtonText.text = `SPIN`;
        this._spinButtonText.style = new PIXI.TextStyle({
            align: "center",
            dropShadow: true,
            dropShadowAngle: 1.57,
            dropShadowDistance: 4,
            fill: ["#05ff8a", "#0bd060"],
            fontFamily: "Arial Black",
            fontSize: 64,
            strokeThickness: 5,
        });

        this._spinButtonText.anchor.set(0.5);
        this._spinButtonText.scale.set(0.5);
        this._spinButtonBackground.addChild(this._spinButtonText);

        this.addChild(this._spinButtonBackground);

        this.calculateBounds();
        this._origBounds = this.getBounds();

        this.interactive = true;
        this.buttonMode = true;

        this.on(this._clickEventName, () => {
            this.pulse();
        });
    }

    get clickEventName(): string {
        return this._clickEventName;
    }

    get isActivated(): boolean {
        return this._isActivated;
    }

    pulse(): void {
        gsap.fromTo(
            this._spinButtonBackground,
            {
                pixi: {
                    scale: 1,
                },
            },
            {
                duration: 0.1,
                pixi: {
                    scale: 0.9,
                },
                ease: "sine.inOut",
                yoyo: true,
                repeat: 1,
            },
        );
    }

    disable(): void {
        this._spinButtonText.tint = 0xaaaaaa;
        this._isActivated = false;
        this.interactive = false;
        this.buttonMode = false;
    }

    enable(): void {
        this._spinButtonText.tint = 0xffffff;
        this._isActivated = true;
        this.interactive = true;
        this.buttonMode = true;
    }

    resize(width: number, height: number): void {
        const scale = Math.min((width * 0.1) / this._origBounds.width, (height * 0.1) / this._origBounds.height);
        this.scale.set(scale);

        this.position.set(width * 0.85, height * 0.9);
    }
}
