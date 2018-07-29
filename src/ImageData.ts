/** A class holding properties of a processed image. */
export class ImageData {
    public readonly url: string;
    public readonly format: string;
    public readonly averageRGB: number[];
    public readonly size: number[];

    /** @constructor
     * @param {object} data - Properties of the processed image.
     */
    constructor(data: ImageData) {
        this.url = data.url;
        this.format = data.format;
        this.averageRGB = data.averageRGB;
        this.size = data.size;
    }
}
