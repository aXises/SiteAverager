import * as request from 'request';
import * as async from 'async';
import * as jsdom from 'jsdom';

class scrapper {
    private url: string;
    private images: Array<string>;
    public constructor(query: string)
    {
        this.url = query;
        this.images = [];
    }
    public scrape(callback: any)
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

        async.parallel([
            function(callback) 
            {
                var imgs = document.querySelectorAll('img');
                Array.prototype.forEach.call(imgs, function(elem, i)
                {
                    self.images.push(elem.getAttribute('src'));
                    if (i == imgs.length - 1) callback();
                });
            },
            function(callback)
            {
                var elements = document.querySelectorAll('*');
                Array.prototype.forEach.call(elements, function(elem, i)
                {
                    var image = window.getComputedStyle(elem).backgroundImage;
                    if (image && image != 'none')
                    {
                        if (image.slice(4, 8) == 'http')
                        {
                            self.images.push(image.split('(')[1].split(')')[0]);

                        }
                    }
                    if (i == elements.length - 1) callback();
                });
            }
        ], function(err, res) 
        {
            callback(self.images);
        });
    }
}
