
import * as async from "async";
import * as pythonShell from "python-shell";
import ImageData from "src/ImageData";

/** A class to process and average images */
export default class Analyser {
    private images: string[];
    private imageData: ImageData[];
    private shell: pythonShell;
    private averageRGB: [number, number, number];
    private pixelsAnalysed: [number, number];

    /** @constructor
     * @param {array} images - A array of image urls to process.
     */
    public constructor(images: string[]) {
        this.images = images;
        this.imageData = [];
        this.shell = new pythonShell("./src/average.py");
        this.averageRGB = [0, 0, 0];
        this.pixelsAnalysed = [0, 0];
    }

    /**
     * Method to average a image. Data is sent to python via python shell for processing.
     */
    public async average(): Promise<any> {
        for (const image of this.images) {
            await this.shell.send(image);
        }
        this.shell.on("message", (res: string) => {
            const data = JSON.parse(res);
            if (!data.err) {
                const image = new ImageData(data);
                this.averageOverall(image);
                this.totalPixel(dwadawd);
                this.imageData.push(img);
            } else {
                //
            }
        });
        this.shell.end((err, code, signal) => {
            if (err) { throw err; }
            resolve({imageData: this.imageData, imageProp: this.imageProp});
        });
    }
    /**
     * Sends a string of text to python.
     * @param {string} data - The data to send.
     */
    private pythonSend(data: string): void {
        this.shell.send(data);
    }

    /**
     * Gets the overall average RGB of the query.
     * @param {ColourMode} image - Processed image data to add to the overall.
     */
    private averageOverall(image: ImageData): void {
        for (let i = 0; i < this.imageProp.overallAvg.length; i++) {
            this.imageProp.overallAvg[i] += image.averageRGB[i] / this.images.length;
        }
    }

    /**
     * Gets the total pixels analysed in the query.
     * @param {ColourMode} image - Processed image data to add to the overall.
     */
    private totalPixel(image: ImageData): void {
        for (const i of this.imageProp.totalPixels) {
            this.imageProp.totalPixels[i] += image.size[i];
        }
    }
}
