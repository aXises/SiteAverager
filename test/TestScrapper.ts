import "mocha";
import app from "app";
import Scrapper from "src/Scrapper";
import * as request from "request";
import * as assert from "assert";
import * as mocha from "mocha";
import { expect } from "chai";
import * as http from "http";
import { StatusCodeError } from "request-promise/errors";

const server = http.createServer(app);
const testURL = "http://localhost:3000/sample";

describe("Scrapper", () => {
    before(() => {
        server.listen(3000);
    });

    

    it("Verifies images correctly", async () => {
        try {
            const scrapper: Scrapper = new Scrapper(testURL);
            await scrapper.verifyAndPushImage(testURL + "blue25.png");
            const imagesURL: string[] = scrapper.getImagesURL();
            expect(imagesURL.length).to.equal(1);
            await scrapper.verifyAndPushImage(testURL + "undefinedimage");
            expect(imagesURL.length).to.equal(1);

        } catch (err) {
            if (err instanceof StatusCodeError) {
                expect(err.statusCode).to.equal(404);
            }
        }
    });

    it("Scrapes images correctly", async () => {
        try {
            const scrapper: Scrapper = new Scrapper(testURL);
            const imagesURL: string[] = await scrapper.scrape();
            expect(imagesURL.length).to.equal(20);
        } catch (err) {
            expect(err).to.be.instanceOf(StatusCodeError);
            expect(err.statusCode).to.equal(404);
        }
    });

    after(() => {
        server.close();
    });
});
