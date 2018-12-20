import * as request from "request-promise";
import * as jsdom from "jsdom";
import * as jquery from "jquery";
import * as url from "url";

declare const JPEGMagicNumber = "ffd8ff";
declare const PNGMagicNumber = "89504e";

/** A class to scrape web pages */
export class Scrapper {

    private readonly url: string;
    private scrappedImages: string[];

    /** @constructor
     * @param {string} query - The url of the page to scrape.
     */
    public constructor(query: string) {
        this.url = query;
        this.scrappedImages = [];
    }

    /**
     * Method to scrape the entire page and generate a window.
     */
    public async scrape(): Promise<void> {
        try {
            const result = await request.get({
                url: this.url,
                headers: {
                    gzip: true,
                },
            });
            if (result.statusCode !== 200) {
                throw new Error();
            }
            this.scrapeImages(new jsdom.JSDOM(result).window);
        } catch (err) {
            throw new Error(err);
        }
    }

    private async verifyImage(image: string): Promise<boolean> {
        try {
            const result = await request.get({
                url: image,
                encoding: undefined,
            });
            if (result) {
                if (result.toString("hex", 0, 3) === JPEGMagicNumber || result.toString("hex", 0, 3) === PNGMagicNumber) {
                    return true;
                }
            }
            return false;
        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Method find all images in a window.
     * @param {jsdom.DOMWindow} window - A DOM accessed by jquery.
     */
    private async scrapeImages(window: jsdom.DOMWindow): Promise<void> {
        try {
            const document = window.document;
            const $: any = jquery(window);
            await $(document).ready();
            if ($("img").length === 0) { return; }
            $("img").each(async () => {
                const image = url.resolve(this.url, $(this).attr("src"));
                if (await this.verifyImage(image)) {
                    this.scrappedImages.push(image);
                }
            });
        } catch (err) {
            throw new Error(err);
        }
    }
}
