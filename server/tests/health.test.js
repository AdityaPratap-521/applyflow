import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../src/app.js';

let mongoServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

after(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

test('GET /api/health returns HTTP 200 OK when MongoDB is connected', async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(mongoServer.getUri());
  }

  const response = await request(app).get('/api/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.status, 'ok');
  assert.equal(response.body.database.isConnected, true);
  assert.equal(response.body.database.status, 'connected');
});

test('GET /api/health returns HTTP 503 Service Unavailable when MongoDB is disconnected', async () => {
  // Disconnect MongoDB connection to test degraded readiness state
  await mongoose.disconnect();

  const response = await request(app).get('/api/health');

  assert.equal(response.status, 503);
  assert.equal(response.body.success, false);
  assert.equal(response.body.status, 'degraded');
  assert.equal(response.body.database.isConnected, false);
  assert.equal(response.body.database.status, 'disconnected');

  // Re-connect MongoDB for subsequent tests
  await mongoose.connect(mongoServer.getUri());
});
