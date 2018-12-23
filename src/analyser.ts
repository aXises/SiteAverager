
import * as async from "async";
import * as pythonShell from "python-shell";
import { ColourMode } from "./ColourMode";
import { ImageData } from "./ImageData";

/** A class to process and average images */
export class Analyser {
    private images: string[];
    private imageData: ImageData[];
    private shell: pythonShell;
    private imageProp: any;

    /** @constructor
     * @param {array} images - A array of image urls to process.
     */
    public constructor(images: string[]) {
        this.images = images;
        this.imageData = [];
        this.shell = new pythonShell("./src/average.py");
        this.imageProp = {
            overallAverage: [0, 0, 0],
            totalPixels: [0, 0]
        };
    }

    /**
     * Method to average a image. Data is sent to python via python shell for processing.
     */
    public average(): Promise<any> {
        const self = this;
        for (const image of this.images) {
            self.pythonSend(image);
        }
        return new Promise((resolve, reject) => {
            self.shell.on("message", (res) => {
                res = JSON.parse(res);
                if (res.err === "None") {
                    const img = new ImageData(res);
                    self.averageOverall(img);
                    self.totalPixel(img);
                    self.imageData.push(img);
                }
            });
            self.shell.end((err, code, signal) => {
                if (err) { throw err; }
                resolve({imageData: self.imageData, imageProp: self.imageProp});
            });
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
