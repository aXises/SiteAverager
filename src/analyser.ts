import * as request from 'request';
import * as async from 'async';
import * as jsdom from 'jsdom';
import * as jquery from 'jquery';
import * as pythonShell from 'python-shell';

interface imageData
{
    readonly url: string
    readonly format: string
    readonly averageRGB: Array<number>
    readonly size: Array<Int32Array>
}

class imageAvg implements imageData
{
    url: string
    format: string
    averageRGB: Array<number>
    size: Array<Int32Array>
    public constructor(data)
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
        request({
            url: self.url,
            headers: {
                gzip: true
            }
        }, function(err, res, site)
        {
            if (err) return err;
            self.scrapeImg(new jsdom.JSDOM(site).window, function (res) {
                callback(res);
            });
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
    public constructor(images)
    {
        this.images = images
        this.imageData = [];
        this.shell = new pythonShell('./src/average.py');
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
            if (res.err == "None") self.imageData.push(new imageAvg(res));
        });
        self.shell.end(function (err, code, signal)
        {
            if (err) throw err;
            console.log(self.imageData)
            callback(self.imageData);
        });
    }
    private pythonSend(data: string): void
    {
        this.shell.send(data);
    }
}

module.exports = 
{
    scrapePage: function (url: string, callback: any) 
    {
        return new scrapper(url).scrape(function (res) 
        {
            callback(res);
        });
    }
}