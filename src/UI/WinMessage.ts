import * as PIXI from "pixi.js";
import gsap from "gsap";

export default class WinMessage extends PIXI.Container {
    private _winText: PIXI.Text = new PIXI.Text();
    private _origBounds: PIXI.Rectangle = new PIXI.Rectangle(0, 0, 0, 0);

    constructor() {
        super();

        this._winText.text = `YOU WON\n100$`;
        this._winText.style = new PIXI.TextStyle({
            align: "center",
            dropShadow: true,
            dropShadowAngle: 1.57,
            dropShadowDistance: 8,
            fill: ["#e65452", "#e77f7b"],
            fontFamily: "Arial Black",
            fontSize: 128,
            strokeThickness: 12,
        });

        this._winText.anchor.set(0.5);
        this.addChild(this._winText);

        this.calculateBounds();
        this._origBounds = this.getBounds();

        this.visible = false;
    }

    show(pay: number): void {
        this._winText.text = `YOU WON\n${pay}$`;

        gsap.fromTo(
            this._winText,
            {
                pixi: {
                    scale: 0,
                    y: 100,
                },
            },
            {
                duration: 0.3,
                pixi: {
                    scale: 1,
                    y: 0,
                },
                ease: "back.out",
                onStart: () => {
                    this._winText.alpha = 1;
                    this.visible = true;
                },
            },
        );
    }

    hide() {
        if (!this.visible) return;
        gsap.to(this._winText, {
            duration: 0.3,
            pixi: {
                alpha: 0,
            },
            onComplete: () => {
                this.visible = false;
                this._winText.alpha = 1;
            },
        });
    }

    resize(width: number, height: number): void {
        const scale = Math.min((width * 0.5) / this._origBounds.width, (height * 0.33) / this._origBounds.height);
        this.scale.set(scale);

        this.position.set(width / 2, height / 2);
    }
}
