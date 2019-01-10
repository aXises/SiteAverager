import ERGB from "src/enums/RGB";
import ECMYK from "src/enums/CMYK";
import EHSL from "src/enums/HSL";

/**
 * A class holding colour properties of a colour.
 */
export default class ColourMode {
    private RGB: [number, number, number];
    private CMY: [number, number, number];
    private CMYK: [number, number, number, number];
    private HSL: [number, number, number];
    private HEX: string;

    /** @constructor
     * @param {Array} RGB - Initial RGB values to convert.
     */
    public constructor(RGB: [number, number, number]) {
        this.RGB = RGB;
        this.HEX = "";
        this.CMY = [0, 0, 0];
        this.CMYK = [0, 0, 0, 0];
        this.HSL = [0, 0, 0];
    }

    /** Generates all color modes for an instance. */
    public getColourModes(): any {
        this.generateColourModes();
        return {
            RGB: this.RGB,
            HEX: this.HEX,
            CMY: this.CMY,
            CMYK: this.CMYK,
            HSL: this.HSL,
        };
    }

    /** Converts RGB to its hex counter part. */
    public toHEX(): string {
        for (let i = 0; i < this.RGB.length; i++) {
            let HEX = this.RGB[i].toString(16);
            if (typeof(HEX) !== "number") {
                HEX = HEX.toUpperCase();
            }
            this.HEX += HEX.length === 1 ? "0" + HEX : HEX;
            if (i === this.RGB.length - 1) {
                return this.HEX;
            }
        }
    }

    /** Converts RGB to CMY. */
    public toCMY(): number[] {
        for (let i = 0; i < this.RGB.length; i++) {
            this.CMY[i] = 1 - (this.RGB[i] / 255);
            if (i === this.RGB.length - 1) {
                return this.CMY;
            }
        }
    }

    /** Coverts RGB to CMYK. */
    public toCMYK(): number[] {
        const CMY = this.toCMY();
        if (CMY[ECMYK.CYAN] === 1 && CMY[ECMYK.MAGENTA] === 1 && CMY[ECMYK.YELLOW] === 1) {
            this.CMYK = [0, 0, 0, 1];
            return this.CMYK;
        }
        const k = Math.min(CMY[ECMYK.CYAN], Math.min(CMY[ECMYK.MAGENTA], CMY[ECMYK.YELLOW]));
        for (let i = 0; i < CMY.length; i++) {
            this.CMYK[i] = (CMY[i] - k) / (1 - k);
            if (i === CMY.length - 1) {
                this.CMYK[CMY.length] = k;
                return this.CMYK;
            }
        }
    }

    /** Converts RGB to HSL. */
    public toHSL(): number[] {
        const RGB = [this.RGB[ERGB.RED] / 255, this.RGB[ERGB.GREEN] / 255, this.RGB[ERGB.BLUE] / 255];
        const dRGB = [this.RGB[ERGB.RED] / 255, this.RGB[ERGB.GREEN] / 255, this.RGB[ERGB.BLUE] / 255];
        const maxRGB = Math.max(RGB[ERGB.RED], RGB[ERGB.GREEN], RGB[ERGB.BLUE]);
        const minRGB = Math.min(RGB[ERGB.RED], RGB[ERGB.GREEN], RGB[ERGB.BLUE]);
        this.HSL[EHSL.LIGHTNESS] = (maxRGB + minRGB) / 2;
        const del = maxRGB - minRGB;
        if (del === 0) {
            this.HSL[EHSL.HUE] = this.HSL[EHSL.SATURATION] = 0;
            return this.HSL;
        }
        this.HSL[EHSL.SATURATION] = this.HSL[EHSL.LIGHTNESS] >= 0.5 ? del / (2 - (maxRGB + minRGB)) : del / (maxRGB + minRGB);
        for (let i = 0; i < dRGB.length; i++) {
            dRGB[i] = (((maxRGB - RGB[i]) / 6) + (del / 2)) / del;
        }
        switch (maxRGB) {
            case RGB[ERGB.RED]: this.HSL[EHSL.HUE] = dRGB[ERGB.BLUE] - dRGB[ERGB.GREEN];
                break;
            case RGB[ERGB.GREEN]: this.HSL[EHSL.HUE] = (1 / 3) + dRGB[ERGB.RED] - dRGB[ERGB.BLUE];
                break;
            case RGB[ERGB.BLUE]: this.HSL[EHSL.HUE] = (2 / 3) + dRGB[ERGB.GREEN] - dRGB[ERGB.RED];
                break;
        }
        if (this.HSL[EHSL.HUE] < 0) { this.HSL[EHSL.HUE] += 1; }
        if (this.HSL[EHSL.HUE] > 1) { this.HSL[EHSL.HUE] -= 1; }
        return this.HSL;
    }

    public getLuminance(): number {
        return Math.sqrt(299 * this.RGB[ERGB.RED] + 587 * this.RGB[ERGB.GREEN] + 144 * this.RGB[ERGB.BLUE]) / 1000;

    private generateColourModes(): void {
        this.toHEX();
        this.toCMY();
        this.toCMYK();
        this.toHSL();
    }
}
