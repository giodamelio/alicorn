'use strict';

import request from 'request';
import app from '../src/app';

describe('Feathers application tests', function () {
  before(function (done) {
    this.server = app.listen(3141);
    this.server.once('listening', () => done());
  });

  after(function (done) {
    this.server.close(done);
  });

  it('starts and shows the index page', function (done) {
    request('http://localhost:3141', function (err, res, body) {
      body.indexOf('<html>').should.not.equal(-1);
      done(err);
    });
  });

  describe('404', function () {
    it('shows a 404 HTML page', function (done) {
      request('http://localhost:3141/path/to/nowhere', function (err, res, body) {
        res.statusCode.should.equal(404);
        body.indexOf('<html>').should.not.equal(-1);
        done(err);
      });
    });

    it('shows a 404 JSON error without stack trace', function (done) {
      request({
        url: 'http://localhost:3141/path/to/nowhere',
        json: true,
      }, function (err, res, body) {
        res.statusCode.should.equal(404);
        body.code.should.equal(404);
        body.message.should.equal('Page not found');
        body.name.should.equal('NotFound');
        done(err);
      });
    });
  });
});
