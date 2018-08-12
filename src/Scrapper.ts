import * as request from "request-promise";
import * as jsdom from "jsdom";
import * as jquery from "jquery";
import * as url from "url";
import Promise from "promise";

/** A class to scrape web pages */
export class Scrapper {
    private url: string;
    private images: string[];

    /** @constructor
     * @param {string} query - The url of the page to scrape.
     */
    public constructor(query: string) {
        this.url = query;
        this.images = [];
    }

    /**
     * Method to scrape the entire page and generate a window.
     */
    public scrape(): Promise<any> {
        return new Promise((resolve, reject) => {
            const self = this;
            if (self.url.slice(0, 4) !== "http") { self.url = "http://" + self.url; }
            request({
                url: self.url,
                headers: {
                    gzip: true
                }
            }).then((body) => {
                self.scrapeImg(new jsdom.JSDOM(body).window).then(() => {
                    resolve(body);
                }).catch(() => {
                    reject();
                });
            });
        });

    }

    // private loopArr(array: Array<any>, index: number, callback: any): void
    // {
    //     let self = this;
    //     self.vertifiyImg(array[index], function (res)
    //     {
    //         console.log("verifiying case", index, array[index])
    //         // console.log("verifiying case", index + 1)
    //         // if (res) {
    //         //     console.log("success, calling back true at", index + 1, array.length)
    //         //     callback(true, index + 1);
    //         //     return;
    //         // }
    //         // if (!res && index < array.length - 1)
    //         // {
    //         //     console.log("invalid, trying next case...")
    //         //     self.loopArr(array, index + 1, function (res)
    //         //     {
    //         //         //callback(false, index + 1);
    //         //     });
    //         // }
    //         // else
    //         // {
    //         //     console.log("failed, calling back false", index + 1, array.length)
    //         //     callback(false);
    //         //     return;
    //         // }
    //     });
    // }

    private verifyImg(image: string): Promise<any> {
        return new Promise((resolve, reject) => {
            request.get({
                url: image,
                encoding: null
            }).then((body) => {
                if (body) {
                    if (body.toString("hex", 0, 3) === "ffd8ff" || body.toString("hex", 0, 3) === "89504e") {
                        return resolve();
                    }
                }
                reject();
            });
        });

    }

    /**
     * Method find all images in a window.
     * @param {jsdom.DOMWindow} window - A DOM accessed by jquery.
     */
    private scrapeImg(window: jsdom.DOMWindow): Promise<any> {
        return new Promise((resolve, reject) => {
            const document = window.document;
            const $: any = jquery(window);
            $(document).ready(() => {
                if ($("img").length === 0) { return; }
                const counter = 0;
                $("img").each((i) => {
                    const image = url.resolve(this.url, $(this).attr("src"));
                    this.verifyImg(image).then().catch();
                });
            });
        });
    }
}
