/** A class holding properties of a processed image. */
export class Image {
    public readonly url: string;
    public readonly format: string;
    public readonly averageRGB: number[];
    public readonly size: number[];

    /** @constructor
     * @param {object} data - Properties of the processed image.
     */
    constructor(url: string, format, average, size) {
        this.url = url;
        this.format = format;
        this.averageRGB = average;
        this.size = size;
    }
}
