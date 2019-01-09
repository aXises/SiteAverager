import ColourData from "src/ColourData";

/** A class holding properties of a processed image. */
export default class ImageData {
    private readonly url: string;
    private readonly format: string;
    private readonly rgb: [number, number, number];
    private readonly size: [number, number];
    private colourData: ColourData;
    /** @constructor
     * @param {object} data - Properties of the processed image.
     */
    constructor(url: string, format: string, rgb: [number, number, number], size: [number, number]) {
        this.url = url;
        this.format = format;
        this.rgb = rgb;
        this.size = size;
    }
}
