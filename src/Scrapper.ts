import * as request from "request-promise";
import * as jsdom from "jsdom";
import * as jquery from "jquery";
import * as url from "url";
import UnsupportedImageTypeError from "src/exception/UnsupportedImageTypeError";
import { RequestError, StatusCodeError } from "request-promise/errors";

const JPEGMagicNumber = "ffd8ff";
const PNGMagicNumber = "89504e";

/** A class to scrape web pages */
export default class Scrapper {

    private readonly url: string;
    private readonly scrappedImagesURL: string[];

    /** @constructor
     * @param {string} query - The url of the page to scrape.
     */
    public constructor(queryURL: string) {
        this.url = queryURL;
        this.scrappedImagesURL = [];
    }

    /**
     * Method to scrape the entire page and generate a window.
     */
    public async scrape(): Promise<string[]> {
        try {
            const result = await request.get({
                url: this.url,
                headers: {
                    gzip: true,
                },
                /* tslint:disable */
                encoding: null,
            });
            if (result) {
                if (this.isValidImage(result)) {
                    this.scrappedImagesURL.push(this.url);
                } else {
                    await this.scrapeImages(new jsdom.JSDOM(result.toString("utf8")).window);
                }
            } else {
                throw new Error("No data retrieved");
            }
            return this.scrappedImagesURL;
        } catch (err) {
            throw err;
        }
    }

    public async verifyAndPushImage(image: string): Promise<void> {
        try {
            const result = await request.get({
                url: image,
                /* tslint:disable */
                encoding: null,
            });
            if (result) {
                if (this.isValidImage(result)) {
                    this.scrappedImagesURL.push(image);
                }
            }
        } catch (err) {
            if (!(err instanceof StatusCodeError)) {
                throw err;
            }
            
        }
    }

    /**
     * Method find all images in a window.
     * @param {jsdom.DOMWindow} window - A DOM accessed by jquery.
     */
    private async scrapeImages(window: jsdom.DOMWindow): Promise<void> {
        const images = window.document.getElementsByTagName("img");
        if (images.length === 0) { return; }
        const asyncImagesVerification = [];
        for (const image of images) {
            let src: string;
            if (src = image.getAttribute("src")) {
                asyncImagesVerification.push(this.verifyAndPushImage(url.resolve(this.url, src)));
            } else {
                for (let i = 0; i < image.attributes.length; i++) {
                    const attr = image.attributes[i];
                    if (attr.nodeName.startsWith("data-")) {
                        asyncImagesVerification.push(this.verifyAndPushImage(url.resolve(this.url, attr.nodeValue)));
                    }
                }
            }
        }
        try {
            await Promise.all(asyncImagesVerification);
        } catch (err) {
            if (err instanceof RequestError) {
                // Bad image link
            } else {
                throw err;
            }
        }
    }

    private isValidImage(data: any): boolean {
        return data.toString("hex", 0, 3) === JPEGMagicNumber || data.toString("hex", 0, 3) === PNGMagicNumber;
    }

    public getImagesURL(): string[] {
        return this.scrappedImagesURL;
    }
}
