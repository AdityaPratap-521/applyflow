import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';

test('GET /api/health reflects MongoDB readiness status', async () => {
  const response = await request(app).get('/api/health');
  
  const isConnected = mongoose.connection.readyState === 1;
  const expectedStatus = isConnected ? 200 : 503;
  
  assert.equal(response.status, expectedStatus);
  assert.equal(response.body.success, isConnected);
  assert.equal(response.body.status, isConnected ? 'ok' : 'degraded');
  assert.ok(response.body.timestamp);
  assert.ok(response.body.database);
});
