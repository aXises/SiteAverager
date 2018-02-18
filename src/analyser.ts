import * as request from 'request';
import * as async from 'async';
import * as jsdom from 'jsdom';
import * as jquery from 'jquery';
import * as pythonShell from 'python-shell';

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
                            self.images.push(image);
                        } else
                        {
                            if (self.url.charAt(self.url.length - 1) == '/')
                            {
                                if (image.charAt(0) == '/') image = image.slice(1, image.length)
                            }
                            
                            self.images.push(self.url + image)
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
                                self.images.push(image.split('(')[1].split(')')[0]);
                            }
                            else
                            {
                                image = image.slice(4, image.length - 1)

                                if (self.url.charAt(self.url.length) == '/')
                                {
                                    if (image.charAt(0) == '/') image = image.slice(1, image.length)[1]
                                    
                                }
                                self.images.push(self.url + image)
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