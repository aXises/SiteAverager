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
}

