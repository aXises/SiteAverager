var origin = 'http://localhost:3000';
var app = require('../app');
var analyser = require('../src/analyser');
import * as request from 'request';
import * as assert from 'assert';
import * as mocha from 'mocha';
import * as http from 'http';
import * as tests from './tests';

var server = http.createServer(app);
function equateArr(arrayA: Array<number>, arrayB: Array<number>): void
{
	for (var i = 0; i < arrayA.length; i++)
	{
		assert.equal(arrayA[i].toFixed(5), arrayB[i].toFixed(5));
	}
}

describe('App', function () 
{
	describe('Server', function ()
	{
		before(function (done) 
		{
			server.listen('3000');
			done();
		});
		it('Initializes', function (done)
		{
			request.get(origin, function (err, res)
			{
				if (err) throw err;
				else assert.equal(200, res.statusCode);
				done();
			});
		});
	});
	describe('Analyser', function ()
	{
		describe('Colour modes', function ()
		{
			var cases = tests.expected.colourModes.cases;
			Object.keys(cases).forEach(function (key) 
			{
				var colourMode = new analyser.colourMode(cases[key].RGB);
				it('Case ' + key + ' Converts to HEX', function (done)
				{
					colourMode.toHex(function (HEX) 
					{
						assert.equal(HEX, cases[key].HEX);
						done();
					});
				});
				it('Case ' + key + ' Converts to CMY', function (done)
				{
					colourMode.toCMY(function (CMY) 
					{
						equateArr(CMY, cases[key].CMY);
						done();
					});
				});
				it('Case ' + key + ' Converts to CMYK', function (done)
				{
					colourMode.toCMYK(function (CMYK) 
					{
						equateArr(CMYK, cases[key].CMYK);
						done();
					});
				});
				it('Case ' + key + ' Converts to HSL', function (done)
				{
					colourMode.toHSL(function (HSL) 
					{
						equateArr(HSL, cases[key].HSL);
						done();
					});
				});
			});
		});
		describe('Scrapper', function ()
		{
			var expected = tests.expected.Scrapper;
			var scrapperA = new analyser.scrapper(origin + '/test');
			var scrapperB = new analyser.scrapper(origin + '/test/');
			it('Request to ' + origin + '/test Scrapes 15 images', function (done)
			{
				scrapperA.scrape(function (res)
				{
					assert.equal(res.length, expected.imagesLength);
					done();
				});
			});

			it('Request to ' + origin + '/test Scrapes correct images', function (done)
			{
				scrapperA.scrape(function (res)
				{
					assert.deepEqual(res, expected.images);
					done();
				});
			});
			it('Request to ' + origin + '/test/ Scrapes 15 images', function (done)
			{
				scrapperB.scrape(function (res)
				{
					assert.equal(res.length, expected.imagesLength);
					done();
				});
			});

			it('Request to ' + origin + '/test/ Scrapes correct images', function (done)
			{
				scrapperB.scrape(function (res)
				{
					assert.deepEqual(res, expected.images);
					done();
				});
			});
		});
	});
	describe('Averager', function ()
	{
		var expected = tests.expected.Averager;
		var testLinks = ['http://localhost:3000/images/black25.png',
		'http://localhost:3000/images/red50.jpg',
		'http://localhost:3000/images/green100.png',
		'http://localhost:3000/images/blue25.png',
		'http://localhost:3000/images/white50.jpg'];
		// red50.jpg is 254 instead of 255
		var averagerA = new analyser.averager(testLinks);
		var averagerB = new analyser.averager(testLinks);
		it('Averages test images to ' + expected.overallAvg, function (done)
		{
			averagerA.average(function (data, prop)
			{
				assert.deepEqual(prop.overallAvg, expected.overallAvg);
				done();
			});
		});
		it('Analyses ' + expected.totalPixels[0] + 'x' + expected.totalPixels[1] + ' pixels', function (done)
		{
			averagerB.average(function (data, prop)
			{
				assert.deepEqual(prop.totalPixels, expected.totalPixels);
				done();
			});
		});
	});
	after(function (done)
	{
		server.close();
		done();
	});
});
