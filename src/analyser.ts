import * as request from 'request';
import * as async from 'async';
import * as jsdom from 'jsdom';
import * as jquery from 'jquery';
import * as pythonShell from 'python-shell';

interface imageData
{
    readonly url: string;
    readonly format: string;
    readonly averageRGB: Array<number>;
    readonly size: Array<number>;
}

interface colourModeData
{
    readonly RGB: Array<number>;
    CMY: Array<number>;
    CMYK: Array<number>;
    HSL: Array<number>;
    hex: string;
    toAll(callback: any): void;
    toHex(callback: any): void;
    toCMY(callback: any);
    toCMYK(callback: any): void;
    toHSL(callback: any): void;
}

/**
 * A class holding other colour properties of a imgAvg.
 */
class colourMode implements colourModeData
{
    public RGB: Array<number>;
    public CMY: Array<number>;
    public CMYK: Array<number>;
    public HSL: Array<number>;
    public hex: string;

    /** @constructor
     * @param {Array} RGB - Initial RGB values to convert.
     */
    public constructor(RGB: Array<number>)
    {
        this.RGB = RGB;
        this.hex = '';
        this.CMY = [0, 0, 0];
        this.CMYK = [0, 0, 0, 0];
        this.HSL = [0, 0, 0];
    }

    /** Generates all color modes for an instance. */
    public toAll(callback: any): void
    {
        var self = this;
        async.parallel([
            function (cb)
            {
                self.toHex(function ()
                {
                    cb();
                });
            },
            function (cb) 
            {
                self.toCMYK(function ()
                {
                    cb();
                });

            },
            function (cb) 
            {
                self.toHSL(function ()
                {
                    cb();
                })

            }
        ], function () 
        {
            callback({
                'RGB': self.RGB,
                'HEX': self.hex,
                'CMYK': self.CMYK,
                'HSL': self.HSL
            });
        });
    }
    
    /** Converts RGB to its hexdecimal counter part. */
    public toHex(callback: any): void
    {
        for (var i = 0; i < this.RGB.length; i++)
        {
            var hex = this.RGB[i].toString(16);
            if (typeof(hex) != 'number')
                hex = hex.toUpperCase();
            this.hex += hex.length == 1 ? "0" + hex: hex;
            if (i == this.RGB.length - 1)
                callback(this.hex);
        }
    }

    /** Converts RGB to CMY. */
    public toCMY(callback: any): void
    {
        for (var i = 0; i < this.RGB.length; i++)
        {
            this.CMY[i] = 1 - (this.RGB[i] / 255);
            if (i == this.RGB.length - 1)
                callback(this.CMY);
        }
    }

    /** Coverts RGB to CMYK. */
    public toCMYK(callback: any): void
    {
        var self = this;
        self.toCMY(function (CMY) 
        {
            if (CMY[0] == 1 && CMY[1] == 1 && CMY[2] == 1)
            {
                self.CMYK = [0, 0, 0, 1];
                callback(self.CMYK);
                return;
            }
            var k = Math.min(CMY[0], Math.min(CMY[1], CMY[2]));
            for (var i = 0; i < CMY.length; i++)
            {
                self.CMYK[i] = (CMY[i] - k) / (1 - k)
                if (i == CMY.length - 1)
                {
                    self.CMYK[CMY.length] = k;
                    callback(self.CMYK);
                }
            }
        });
    }

    /** Converts RGB to HSL. */
    public toHSL(callback: any): void
    {
        var RGB = [this.RGB[0] / 255, this.RGB[1] / 255, this.RGB[2] / 255];
        var dRGB = [this.RGB[0] / 255, this.RGB[1] / 255, this.RGB[2] / 255];
        // No idea why but copying a variable and editing it modifies the original variable. 
        // var dRGB = RGB or var RGB = this.RGB changes the cloned variable. Declaring it as an array and subbing in appropriate values seems to fix it. 
        var maxRGB = Math.max(RGB[0], RGB[1], RGB[2]);
        var minRGB = Math.min(RGB[0], RGB[1], RGB[2]);
        this.HSL[2] = (maxRGB + minRGB) / 2
        var del = maxRGB - minRGB
        if (del == 0)
        {
            this.HSL[0] = this.HSL[1] = 0;
            callback(this.HSL);
            return;
        }
        this.HSL[1] = this.HSL[2] >= 0.5 ? del / (2 - (maxRGB + minRGB)) : del / (maxRGB + minRGB);

        for (var i = 0; i < dRGB.length; i++)
        {
            dRGB[i] = (((maxRGB - RGB[i]) / 6) + (del / 2)) / del;
        }
        switch (maxRGB)
        {
            case RGB[0]: this.HSL[0] = dRGB[2] - dRGB[1];
                break;
            case RGB[1]: this.HSL[0] = (1 / 3) + dRGB[0] - dRGB[2];
                break;
            case RGB[2]: this.HSL[0] = (2 / 3) + dRGB[1] - dRGB[0];
                break;
        }
        if (this.HSL[0] < 0 ) this.HSL[0] += 1;
        if (this.HSL[0] > 1 ) this.HSL[0] -= 1;
        callback(this.HSL);
    }
}

/** A class holding properties of a processed image. */
class imageAvg implements imageData
{
    url: string;
    format: string;
    averageRGB: Array<number>;
    size: Array<number>;

    /** @constructor
     * @param {object} data - Properties of the processed image.
     */
    public constructor(data: any)
    {
        this.url = data.image;
        this.format = data.prop.format;
        this.averageRGB = data.averageRGB;
        this.size = data.prop.size;
    }
}

/** A class to scrape web pages */
class scrapper
{
    private url: string;
    private images: Array<string>;

    /** @constructor
     * @param {string} query - The url of the page to scrape.
     */
    public constructor(query: string)
    {
        this.url = query;
        this.images = [];
    }

    /**
     * Method to scrape the entire page to generate a window.
     */
    public scrape(callback: any): void
    {
        var self = this;
        if (self.url.slice(0, 4) != 'http') self.url = 'http://' + self.url
        request({
            url: self.url,
            headers: {
                gzip: true
            }
        }, function(err, res, site)
        {
            if (err) callback({'err': err});
            else
            {
                self.scrapeImg(new jsdom.JSDOM(site).window, function (res) 
                {
                    callback(res);
                });
            }
        });
    }

    /**
     * Method find all images in a window.
     * @param {jsdom.DOMWindow} window - A DOM accessed by jquery.
     */
    private scrapeImg(window: jsdom.DOMWindow, callback: any): void
    {
        var self = this;
        var document = window.document;
        var $ = jquery(window)
        $(document).ready(function () 
        {
            async.parallel([
                function(callback) 
                {
                    if ($('img').length == 0) callback();
                    $('img').each(function (i) {
                        var image = $(this).attr('src');
                        if (image.slice(0, 4) == 'http')
                        {
                            if (self.images.indexOf(image) == -1) self.images.push(image);
                        } else
                        {
                            if (self.url.charAt(self.url.length - 1) == '/')
                            {
                                if (image.charAt(0) == '/') image = image.slice(1, image.length);

                            } else
                            {
                                if (image.charAt(0) != '/') image = '/' + image;
                            }
                            if (self.images.indexOf(self.url + image) == -1) self.images.push(self.url + image);
                        }
                        if (i == $('img').length - 1) callback();
                    });
                },
                function(callback)
                {
                    if ($('*').length == 0) callback();
                    $('*').each(function(i) {
                        var image = $(this).css("background-image");
                        if (image && image != 'none')
                        {
                            if (image.slice(4, 8) == 'http')
                            {
                                image = image.split('(')[1].split(')')[0]
                                if (self.images.indexOf(image) == -1) self.images.push(image);
                            }
                            else
                            {
                                image = image.slice(4, image.length - 1)
                                if (self.url.charAt(self.url.length - 1) == '/')
                                {
                                    if (image.charAt(0) == '/') image = image.slice(1, image.length);
                                } else
                                {
                                    if (image.charAt(0) != '/') image = '/' + image;
                                }
                                if (self.images.indexOf(self.url + image) == -1) self.images.push(self.url + image);
                            }
                        }
                        if (i == $('*').length - 1) callback();
                    });
                }
            ], function(err, res) 
            {
                callback(self.images);
            });
        });
    }
}

/** A class to process and average images */
class averager
{
    private images: Array<string>;
    private imageData: Array<any>;
    private shell: pythonShell;
    private imageDataProp: any;

    /** @constructor
     * @param {array} images - A array of image urls to process.
     */
    public constructor(images: Array<string>)
    {
        this.images = images
        this.imageData = [];
        this.shell = new pythonShell('./src/average.py');
        this.imageDataProp = {
            'overallAvg': [0, 0, 0],
            'totalPixels': [0, 0]
        };
    }

    /**
     * Method to average a image. Data is sent to python via python shell for processing.
     */
    public average(callback: any): void
    {
        var self = this;
        self.images.forEach(function(image)
        {
            self.pythonSend(image);
        });
        self.shell.on('message', function (res)
        {
            res = JSON.parse(res)
            if (res.err == "None")
            {
                var img = new imageAvg(res);
                async.parallel([
                    function (callback)
                    {
                        self.averageOverall(img, function ()
                        {
                            callback();
                        });
                    },
                    function (callback)
                    {
                        self.totalPixel(img, function ()
                        {
                            callback();
                        });
                    }
                ], function ()
                {
                    self.imageData.push(img);
                });
            }
        });
        self.shell.end(function (err, code, signal)
        {
            if (err) throw err;
            self.roundArr(self.imageDataProp.overallAvg, false, function ()
            {
                callback(self.imageData, self.imageDataProp);
            });
        });
    }

    /**
     * Sends a string of text to python.
     * @param {string} data - The data to send.
     */
    private pythonSend(data: string): void
    {
        this.shell.send(data);
    }

    /**
     * Gets the overall average RGB of the query.
     * @param {imageAvg} image - Processed image data to add to the overall.
     */
    private averageOverall(image: imageAvg, callback: any): any
    {
        for (var i = 0; i < this.imageDataProp.overallAvg.length; i++)
        {
            this.imageDataProp.overallAvg[i] += image.averageRGB[i] / this.images.length;
            if (i == this.imageDataProp.overallAvg.length - 1)
                callback();
        }
    }

    /**
     * Gets the total pixels analysed in the query.
     * @param {imageAvg} image - Processed image data to add to the overall.
     */
    private totalPixel(image: imageAvg, callback: any): any
    {
        for (var i = 0; i < this.imageDataProp.totalPixels.length; i++)
        {
            this.imageDataProp.totalPixels[i] += image.size[i];
            if (i == this.imageDataProp.totalPixels.length - 1)
                callback();
        }
    }

    /**
     * Rounds a array of values.
     * @param {array} arr - The array to iterate.
     * @param {boolean} callbackVal - Whether to callback a value.
     */
    public roundArr(arr: Array<any>, callbackVal?: boolean, callback?: any)
    {
        if (!callbackVal) callbackVal = false;
        for (var i = 0; i < arr.length; i++)
        {
            arr[i] = Math.round(arr[i]);
            if (i == arr.length - 1 && !callbackVal)
            {
                callback(); 
                return;
            }
            else if (i == arr.length - 1) return arr;
        }
    }
}

module.exports = 
{
    scrapePage: function (url: string, callback: any): void
    {
        new scrapper(url).scrape(function (res)
        {
            callback(res);
        });
    },
    averageImages: function (images: Array<string>, callback: any): void
    {
        new averager(images).average(function (imgAvg, imgProp)
        {
            callback(imgAvg, imgProp);
        });
    },
    getLuminance: function(rgb): number
    {
        return Math.sqrt(299 * rgb[0] + 587 * rgb[1] + 144 * rgb[2]) / 1000;
    },
    getColourModes: function(rgb: Array<number>, callback: any): void
    {
        new colourMode(rgb).toAll(function (res)
        {
            callback(res);
        });
    },
    colourMode: colourMode,
    scrapper: scrapper,
    averager: averager
}