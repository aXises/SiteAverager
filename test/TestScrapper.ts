import "mocha";
import app from "app";
import Scrapper from "src/Scrapper";
import { expect } from "chai";
import * as http from "http";
import { StatusCodeError, RequestError } from "request-promise/errors";
import { testURL } from "test/Test";
import { fail } from "assert";
import UnsupportedImageTypeError from "src/exception/UnsupportedImageTypeError";

const imagesURL = "http://localhost:3000/images/test";

describe("Scrapper", () => {
    it("Scrapes images correctly.", async () => {
        try {
            const scrapper: Scrapper = new Scrapper(testURL);
            const images: string[] = await scrapper.scrape();
            expect(images).to.be.a("array").of.length(20);
        } catch (err) {
            expect(err).to.be.instanceOf(StatusCodeError);
            expect(err.statusCode).to.equal(404);
        }
    });
    describe("Verifies images correctly.", async () => {
        it("Verifies a correct JPG file.", async () => {
            try {
                const scrapper: Scrapper = new Scrapper(testURL);
                await scrapper.verifyAndPushImage(imagesURL + "/blue50.jpg");
                const images: string[] = scrapper.getImagesURL();
                expect(images).to.be.a("array").of.length(1);
            } catch (err) {
                fail();
            }
        });
        it("Verifies a correct PNG file.", async () => {
            try {
                const scrapper: Scrapper = new Scrapper(testURL);
                await scrapper.verifyAndPushImage(imagesURL + "/green25.png");
                const images: string[] = scrapper.getImagesURL();
                expect(images).to.be.a("array").of.length(1);
            } catch (err) {
                fail();
            }
        });
        it("Verifies a unknown file path.", async () => {
            try {
                const scrapper: Scrapper = new Scrapper(testURL);
                await scrapper.verifyAndPushImage(" ");
                fail();
            } catch (err) {
                if (!(err instanceof RequestError)) {
                    fail();
                }
            }
        });
        it("Verifies a corrupt file.", async () => {
            const scrapper: Scrapper = new Scrapper(testURL);
            await scrapper.verifyAndPushImage(imagesURL + "/red100corrupt.png");
            expect(scrapper.getImagesURL()).to.be.a("array").of.length(0);
        });
    });
});
