var origin = 'http://localhost:3000';
var app = require('../app');
var analyser = require('../src/analyser');
import * as request from 'request';
import * as assert from 'assert';
import * as mocha from 'mocha';
import * as http from 'http';
import * as tests from './tests';



describe('App', function () 
{
	describe('Server', function ()
	{
		before(function (done) 
		{
			var server = http.createServer(app);
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
			var colourMode = new analyser.colourMode(constBlack.RGB);

			it('Converts to HEX', function (done)
			{
				colourMode.toHex(function (HEX) 
				{
					assert.equal(HEX, constBlack.HEX);
					done();
				});
			});
			it('Converts to CMY', function (done)
			{
				colourMode.toCMY(function (CMY) 
				{
					assert.deepEqual(CMY, constBlack.CMY);
					done();
				});
			});
			it('Converts to CMYK', function (done)
			{
				colourMode.toCMYK(function (CMYK) 
				{
					assert.deepEqual(CMYK, constBlack.CMYK);
					done();
				});
			});
			it('Converts to HSL', function (done)
			{
				colourMode.toHSL(function (HSL) 
				{
					assert.deepEqual(HSL, constBlack.HSL);
					done();
				});
			});
		});
	});
	after(function ()
	{
		process.exit(0);
	});
});
