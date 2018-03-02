var origin = 'http://localhost:3000';

import * as request from 'request';
import * as assert from 'assert';
import * as mocha from 'mocha';
import * as http from 'http';
import * as app from '../app'

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
		after(function ()
		{
			process.exit(0);
		});
	});
});
