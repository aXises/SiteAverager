import ColourData from "src/ColourData";

/** A class holding properties of a processed image. */
export default class ImageData {
    private readonly url: string;
    private readonly format: string;
    private readonly RGB: [number, number, number];
    private readonly size: [number, number];
    private readonly pixels: number;
    private colourData: ColourData;
    /** @constructor
     * @param {object} data - Properties of the processed image.
     */
    constructor(url: string, format: string, rgb: [number, number, number], size: [number, number], pixels: number) {
        this.url = url;
        this.format = format;
        this.RGB = rgb;
        this.size = size;
        this.pixels = pixels;
        this.colourData = new ColourData(rgb);
    }

    public getRGB(): [number, number, number] {
        return this.RGB;
    }

    public getSize(): [number, number] {
        return this.size;
    }

    public getPixels(): number {
        return this.pixels;
    }

    public getColourData(): ColourData {
        return this.colourData;
    }
}
