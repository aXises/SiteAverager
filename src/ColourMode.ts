/**
 * A class holding colour properties of a colour.
 */

export class ColourMode {
    public RGB: number[];
    public CMY: number[];
    public CMYK: number[];
    public HSL: number[];
    public HEX: string;

    /** @constructor
     * @param {Array} RGB - Initial RGB values to convert.
     */
    public constructor(RGB: number[]) {
        this.RGB = RGB;
        this.HEX = "";
        this.CMY = [0, 0, 0];
        this.CMYK = [0, 0, 0, 0];
        this.HSL = [0, 0, 0];
    }

    /** Generates all color modes for an instance. */
    public toAll(): any {
        return {
            RGB: this.RGB,
            HEX: this.toHEX(),
            CMYK: this.toCMYK(),
            HSL: this.toHSL()
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
        const self = this;
        const CMY = this.toCMY();
        if (CMY[0] === 1 && CMY[1] === 1 && CMY[2] === 1) {
            this.CMYK = [0, 0, 0, 1];
            return this.CMYK;
        }
        const k = Math.min(CMY[0], Math.min(CMY[1], CMY[2]));
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
        const RGB = [this.RGB[0] / 255, this.RGB[1] / 255, this.RGB[2] / 255];
        const dRGB = [this.RGB[0] / 255, this.RGB[1] / 255, this.RGB[2] / 255];
        const maxRGB = Math.max(RGB[0], RGB[1], RGB[2]);
        const minRGB = Math.min(RGB[0], RGB[1], RGB[2]);
        this.HSL[2] = (maxRGB + minRGB) / 2;
        const del = maxRGB - minRGB;
        if (del === 0) {
            this.HSL[0] = this.HSL[1] = 0;
            return this.HSL;
        }
        this.HSL[1] = this.HSL[2] >= 0.5 ? del / (2 - (maxRGB + minRGB)) : del / (maxRGB + minRGB);
        for (let i = 0; i < dRGB.length; i++) {
            dRGB[i] = (((maxRGB - RGB[i]) / 6) + (del / 2)) / del;
        }
        switch (maxRGB) {
            case RGB[0]: this.HSL[0] = dRGB[2] - dRGB[1];
                         break;
            case RGB[1]: this.HSL[0] = (1 / 3) + dRGB[0] - dRGB[2];
                         break;
            case RGB[2]: this.HSL[0] = (2 / 3) + dRGB[1] - dRGB[0];
                         break;
        }
        if (this.HSL[0] < 0 ) { this.HSL[0] += 1; }
        if (this.HSL[0] > 1 ) { this.HSL[0] -= 1; }
        return this.HSL;
    }
}
