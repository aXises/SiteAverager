import * as pythonShell from "python-shell";
import ImageData from "src/ImageData";
import RGB from "src/enums/RGB";
import ColourData from "./ColourData";

const WIDTH = 0;
const HEIGHT = 1;

/** A class to process and average images */
export default class Analyser {
    private images: string[];
    private imageData: ImageData[];
    private shell: pythonShell;
    private averageRGB: [number, number, number];
    private totalPixels: [number, number];

    /** @constructor
     * @param {array} images - A array of image urls to process.
     */
    public constructor(images: string[]) {
        this.images = images;
        this.imageData = [];
        this.shell = new pythonShell("./src/average.py");
        this.averageRGB = [0, 0, 0];
        this.totalPixels = [0, 0];
    }

    public async analyse(): Promise<void> {
        await this.generateImageData();
        await this.generateResult();
    }

    public getTotalColourModes(): object {
        return new ColourData(this.averageRGB).getColourModes();
    }

    public getTotalLuminance(): number {
        return new ColourData(this.averageRGB).getLuminance();
    }

    public getTotalRGB(): [number, number, number] {
        return this.averageRGB;
    }

    public getTotalPixels(): [number, number] {
        return this.totalPixels;
    }

    public getImageData(): ImageData[] {
        return this.imageData;
    }

    /**
     * Method to average a image. Data is sent to python via python shell for processing.
     */
    private generateImageData(): Promise<void> {
        return new Promise((resolve, reject) => {
            for (const image of this.images) {
                this.shell.send(image);
            }
            this.shell.on("message", (res: string) => {
                const data = JSON.parse(res);
                if (!data.err) {
                    const image = new ImageData(data.url, data.format, data.rgb, data.size);
                    this.imageData.push(image);
                } else {
                    //
                }
            });
            this.shell.end((err) => {
                err ? reject(err) : resolve();
            });
        });
    }

    private generateResult(): void {
        for (const image of this.imageData) {
            // console.log(image.getRGB()[RGB.RED]);
            this.averageRGB[RGB.RED] += image.getRGB()[RGB.RED];
            this.averageRGB[RGB.GREEN] += image.getRGB()[RGB.GREEN];
            this.averageRGB[RGB.BLUE] += image.getRGB()[RGB.BLUE];
            this.totalPixels[WIDTH] += image.getSize()[WIDTH];
            this.totalPixels[HEIGHT] += image.getSize()[HEIGHT];
        }
        this.averageRGB[RGB.RED] = this.averageRGB[RGB.RED] / this.imageData.length;
        this.averageRGB[RGB.GREEN] = this.averageRGB[RGB.GREEN] / this.imageData.length;
        this.averageRGB[RGB.BLUE] = this.averageRGB[RGB.BLUE] / this.imageData.length;
    }
}
