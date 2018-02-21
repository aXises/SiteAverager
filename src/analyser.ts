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

class imageAvg implements imageData
{
    url: string;
    format: string;
    averageRGB: Array<number>;
    size: Array<number>;
    public constructor(data: any)
    {
        this.url = data.image;
        this.format = data.prop.format;
        this.averageRGB = data.averageRGB;
        this.size = data.prop.size;
    }
}

class scrapper
{
    private url: string;
    private images: Array<string>;
    public constructor(query: string)
    {
        this.url = query;
        this.images = [];
    }
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
                                if (image.charAt(0) == '/') image = image.slice(1, image.length)
                            }
                            if (self.images.indexOf(self.url + image) == -1) self.images.push(self.url + image)
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
                                    if (image.charAt(0) == '/') image = image.slice(1, image.length)
                                }
                                if (self.images.indexOf(self.url + image) == -1) self.images.push(self.url + image)
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

class averager
{
    private images: Array<string>;
    private imageData: Array<any>;
    private shell: pythonShell;
    private imageDataProp: any;
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
                    function (callback) {
                        self.averageOverall(img, function () 
                        {
                            callback();
                        });
                    },
                    function (callback) {
                        self.totalPixel(img, function () 
                        {
                            callback();
                        });
                    }
                ], function () {
                    self.imageData.push(img);
                });
            }
        });
        self.shell.end(function (err, code, signal)
        {
            if (err) throw err;
            self.roundArr(self.imageDataProp.overallAvg, false, function () {
                callback(self.imageData, self.imageDataProp);
            });
        });
    }
    private pythonSend(data: string): void
    {
        this.shell.send(data);
    }
    private averageOverall(image: imageAvg, callback: any): any
    {
        for (var i = 0; i < this.imageDataProp.overallAvg.length; i++)
        {
            this.imageDataProp.overallAvg[i] += image.averageRGB[i] / this.images.length;
            if (i == this.imageDataProp.overallAvg.length - 1)
                callback();
        }
    }
    private totalPixel(image: imageAvg, callback: any): any
    {
        for (var i = 0; i < this.imageDataProp.totalPixels.length; i++)
        {
            this.imageDataProp.totalPixels[i] += image.size[i];
            if (i == this.imageDataProp.totalPixels.length - 1)
                callback();
        }
    }
    public roundArr(arr: Array<any>, callbackVal: boolean, callback: any): void
    {
        if (!callbackVal) callbackVal = false;
        for (var i = 0; i < arr.length; i++)
        {
            arr[i] = Math.round(arr[i]);
            if (i == arr.length - 1 && !callbackVal) callback();
            else if (i == arr.length - 1) callback(arr);
        }
    }
}

class colorMode
{

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
    }
}