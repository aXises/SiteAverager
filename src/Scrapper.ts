import * as request from "request-promise";
import * as jsdom from "jsdom";
import * as jquery from "jquery";
import * as url from "url";
import UnsupportedImageTypeError from "src/exception/UnsupportedImageTypeError";

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
                    if (result.toString("hex", 0, 3) === JPEGMagicNumber || result.toString("hex", 0, 3) === PNGMagicNumber) {
                        this.scrappedImagesURL.push(image);
                    }
                }
            } catch (err) {
                throw err;
            }
    }

    /**
     * Method find all images in a window.
     * @param {jsdom.DOMWindow} window - A DOM accessed by jquery.
     */
    private async scrapeImages(window: jsdom.DOMWindow): Promise<void> {
        try {
            const $: any = jquery(window);
            if ($("img").length === 0) { return; }
            const asyncImagesVerification = [];
            for (const img of $("img")) {
                const image = url.resolve(this.url, $(img).attr("src"));
                asyncImagesVerification.push(this.verifyAndPushImage(image));
            }
            await Promise.all(asyncImagesVerification);
        } catch (err) {
            throw err;
        }
    }

    public getImagesURL(): string[] {
        return this.scrappedImagesURL;
    }
}
