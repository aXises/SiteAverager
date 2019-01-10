import "mocha";
import { expect } from "chai";
import Analyser from "src/Analyser";
import ERGB from "src/enums/RGB";
import ECMYK from "src/enums/CMYK";
import EHSL from "src/enums/HSL";

const imagesURL = "http://localhost:3000/images/test";
describe("Analyser", async () => {
    it("Initializes correctly.", async () => {
        const analyser = new Analyser([
            imagesURL + "/black25.jpg",
            imagesURL + "/blue50.jpg",
            imagesURL + "/green100.png",
        ]);
        expect(analyser.getImages()).to.be.a("array").of.length(3);
        expect(analyser.getImages()).to.be.deep.equal([
            imagesURL + "/black25.jpg",
            imagesURL + "/blue50.jpg",
            imagesURL + "/green100.png",
        ]);
        expect(analyser.getImageData()).to.be.a("array").of.length(0);
        expect(analyser.getTotalRGB()).to.be.a("array").of.length(3);
        expect(analyser.getTotalPixels()).to.be.equal(0);
    });
    describe("Parses images correctly.", async () => {
        describe("Parses one image correctly.", async () => {
            let analyser: Analyser;
            before(async () => {
                analyser = new Analyser([
                    imagesURL + "/white25.png",
                ]);
                await analyser.analyse();
            });
            it("Parses all images.", async () => {
                expect(analyser.getImages()).to.be.a("array").of.length(1);
                expect(analyser.getImageData()).to.be.a("array").of.length(1);
            });
            it("Averages RGB correctly.", async () => {
                const totalRGB = analyser.getTotalRGB();
                expect(totalRGB).to.be.a("array").of.length(3);
                expect(totalRGB[ERGB.RED]).to.be.approximately(255, 0.5);
                expect(totalRGB[ERGB.GREEN]).to.be.approximately(255, 0.5);
                expect(totalRGB[ERGB.BLUE]).to.be.approximately(255, 0.5);
            });
            it("Counts pixels correctly.", async () => {
                expect(analyser.getTotalPixels()).to.be.equal(25 * 25);
            });
            it("Calculates luminance correctly.", async () => {
                expect(analyser.getTotalLuminance()).to.be.approximately(1, 0.05);
            });
            it("Calculates other colour modes correctly.", async () => {
                const colourModes = analyser.getTotalColourModes();
                const HEX = colourModes.HEX;
                expect(HEX).to.be.a("string");
                expect(HEX).to.be.equal("FFFFFF");
                const CMYK = colourModes.CMYK;
                expect(CMYK).to.be.a("array");
                expect(CMYK[ECMYK.CYAN]).to.be.approximately(0, 0.05);
                expect(CMYK[ECMYK.MAGENTA]).to.be.approximately(0, 0.05);
                expect(CMYK[ECMYK.YELLOW]).to.be.approximately(0, 0.05);
                expect(CMYK[ECMYK.KEY]).to.be.approximately(0, 0.05);
                const HSL = colourModes.HSL;
                expect(HSL).to.be.a("array");
                expect(HSL[EHSL.HUE]).to.be.approximately(0, 0.05);
                expect(HSL[EHSL.SATURATION]).to.be.approximately(0, 0.05);
                expect(HSL[EHSL.LIGHTNESS]).to.be.approximately(1, 0.05);
            });
        });
        describe("Parses two images correctly.", async () => {
            let analyser: Analyser;
            before(async () => {
                analyser = new Analyser([
                    imagesURL + "/green50.jpg",
                    imagesURL + "/blue50.jpg",
                ]);
                await analyser.analyse();
            });
            it("Parses all images.", async () => {
                expect(analyser.getImages()).to.be.a("array").of.length(2);
                expect(analyser.getImageData()).to.be.a("array").of.length(2);
            });
            it("Averages RGB correctly.", async () => {
                const totalRGB = analyser.getTotalRGB();
                expect(totalRGB).to.be.a("array").of.length(3);
                expect(totalRGB[ERGB.RED]).to.be.approximately(0, 0.5);
                expect(totalRGB[ERGB.GREEN]).to.be.approximately(127.5, 0.5);
                expect(totalRGB[ERGB.BLUE]).to.be.approximately(127.5, 0.5);
            });
            it("Counts pixels correctly.", async () => {
                expect(analyser.getTotalPixels()).to.be.equal((50 * 50) + (50 * 50));
            });
            it("Calculates luminance correctly.", async () => {
                expect(analyser.getTotalLuminance()).to.be.approximately(0.35, 0.05);
            });
            it("Calculates other colour modes correctly.", async () => {
                const colourModes = analyser.getTotalColourModes();
                const HEX = colourModes.HEX;
                expect(HEX).to.be.a("string");
                expect(HEX).to.be.equal("008080");
                const CMYK = colourModes.CMYK;
                expect(CMYK).to.be.a("array");
                expect(CMYK[ECMYK.CYAN]).to.be.approximately(1, 0.05);
                expect(CMYK[ECMYK.MAGENTA]).to.be.approximately(0, 0.05);
                expect(CMYK[ECMYK.YELLOW]).to.be.approximately(0, 0.05);
                expect(CMYK[ECMYK.KEY]).to.be.approximately(0.5, 0.05);
                const HSL = colourModes.HSL;
                expect(HSL).to.be.a("array");
                expect(HSL[EHSL.HUE]).to.be.approximately(0.5, 0.05);
                expect(HSL[EHSL.SATURATION]).to.be.approximately(1, 0.05);
                expect(HSL[EHSL.LIGHTNESS]).to.be.approximately(0.25, 0.05);
            });
        });
        describe("Parses five images correctly.", async () => {
            let analyser: Analyser;
            before(async () => {
                analyser = new Analyser([
                    imagesURL + "/black25.png",
                    imagesURL + "/blue50.jpg",
                    imagesURL + "/white25.png",
                    imagesURL + "/red25.png",
                    imagesURL + "/green100.png",
                ]);
                await analyser.analyse();
            });
            it("Parses all images.", async () => {
                expect(analyser.getImages()).to.be.a("array").of.length(5);
                expect(analyser.getImageData()).to.be.a("array").of.length(5);
            });
            it("Averages RGB correctly.", async () => {
                const totalRGB = analyser.getTotalRGB();
                expect(totalRGB).to.be.a("array").of.length(3);
                expect(totalRGB[ERGB.RED]).to.be.approximately(102, 0.5);
                expect(totalRGB[ERGB.GREEN]).to.be.approximately(102, 0.5);
                expect(totalRGB[ERGB.BLUE]).to.be.approximately(102, 0.5);
            });
            it("Counts pixels correctly.", async () => {
                expect(analyser.getTotalPixels()).to.be.equal(
                    (25 * 25) + (50 * 50) + (25 * 25) + (25 * 25) + (100 * 100),
                );
            });
            it("Calculates luminance correctly.", async () => {
                expect(analyser.getTotalLuminance()).to.be.approximately(0.4, 0.05);
            });
            it("Calculates other colour modes correctly.", async () => {
                const colourModes = analyser.getTotalColourModes();
                const HEX = colourModes.HEX;
                expect(HEX).to.be.a("string");
                expect(HEX).to.be.equal("666666");
                const CMYK = colourModes.CMYK;
                expect(CMYK).to.be.a("array");
                expect(CMYK[ECMYK.CYAN]).to.be.approximately(0, 0.05);
                expect(CMYK[ECMYK.MAGENTA]).to.be.approximately(0, 0.05);
                expect(CMYK[ECMYK.YELLOW]).to.be.approximately(0, 0.05);
                expect(CMYK[ECMYK.KEY]).to.be.approximately(0.6, 0.05);
                const HSL = colourModes.HSL;
                expect(HSL).to.be.a("array");
                expect(HSL[EHSL.HUE]).to.be.approximately(0.11, 0.05);
                expect(HSL[EHSL.SATURATION]).to.be.approximately(0, 0.05);
                expect(HSL[EHSL.LIGHTNESS]).to.be.approximately(0.4, 0.05);
            });
        });
        describe("Handles bad image paths.", async () => {
            let analyser: Analyser;
            before(async () => {
                analyser = new Analyser([
                    "",
                    "unknown.jpg",
                ]);
                await analyser.analyse();
            });
            it("Parses zero images.", async () => {
                expect(analyser.getImages()).to.be.a("array").of.length(2);
                expect(analyser.getImageData()).to.be.a("array").of.length(0);
            });
        });
    });
});
