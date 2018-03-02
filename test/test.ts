var origin = 'http://localhost:3000';
var app = require('../app');
var analyser = require('../src/analyser');
import * as request from 'request';
import * as assert from 'assert';
import * as mocha from 'mocha';
import * as http from 'http';
import * as tests from './tests';

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
		var server = http.createServer(app);
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
		after(function (done)
		{
			server.close();
			done();
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
	});
});
