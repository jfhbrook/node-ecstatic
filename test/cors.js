'use strict';

const test = require('tap').test;
const ecstatic = require('../lib/ecstatic');
const http = require('http');
const path = require('path');
const request = require('request');

const root = path.join(__dirname, 'public');

test('cors defaults to false', (t) => {
  t.plan(4);

  const server = http.createServer(
    ecstatic({
      root,
      autoIndex: true,
      defaultExt: 'html',
    })
  );

  server.listen(() => {
    const port = server.address().port;
    const uri = `http://localhost:${port}/subdir/index.html`;

    request.get({ uri }, (err, res) => {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.type(res.headers['access-control-allow-origin'], 'undefined');
      t.type(res.headers['access-control-allow-headers'], 'undefined');
    });
  });
  t.once('end', () => {
    server.close();
  });
});

test('cors set to false', (t) => {
  t.plan(4);

  const server = http.createServer(
    ecstatic({
      root,
      cors: false,
      autoIndex: true,
      defaultExt: 'html',
    })
  );

  server.listen(() => {
    const port = server.address().port;
    const uri = `http://localhost:${port}/subdir/index.html`;

    request.get({ uri }, (err, res) => {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.type(res.headers['access-control-allow-origin'], 'undefined');
      t.type(res.headers['access-control-allow-headers'], 'undefined');
    });
  });
  t.once('end', () => {
    server.close();
  });
});

test('cors set to true', (t) => {
  t.plan(4);

  const server = http.createServer(
    ecstatic({
      root,
      cors: true,
      autoIndex: true,
      defaultExt: 'html',
    })
  );

  server.listen(() => {
    const port = server.address().port;
    const uri = `http://localhost:${port}/subdir/index.html`;
    request.get({ uri }, (err, res) => {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.equal(res.headers['access-control-allow-origin'], '*');
      t.equal(res.headers['access-control-allow-headers'], 'Authorization, Content-Type, If-Match, If-Modified-Since, If-None-Match, If-Unmodified-Since');
    });
  });
  t.once('end', () => {
    server.close();
  });
});

test('CORS set to true', (t) => {
  t.plan(4);

  const server = http.createServer(
    ecstatic({
      root,
      CORS: true,
      autoIndex: true,
      defaultExt: 'html',
    })
  );

  server.listen(() => {
    const port = server.address().port;
    const uri = `http://localhost:${port}/subdir/index.html`;
    request.get({ uri }, (err, res) => {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.equal(res.headers['access-control-allow-origin'], '*');
      t.equal(res.headers['access-control-allow-headers'], 'Authorization, Content-Type, If-Match, If-Modified-Since, If-None-Match, If-Unmodified-Since');
    });
  });
  t.once('end', () => {
    server.close();
  });
});
