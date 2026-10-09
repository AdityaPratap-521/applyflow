import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { Application } from '../src/models/Application.js';

let mongoServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

after(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await Application.deleteMany({});
});

test('POST /api/applications creates an application with valid data', async () => {
  const payload = {
    company: 'Stripe',
    jobTitle: 'Backend Engineer',
    location: 'Remote',
    workMode: 'Remote',
    employmentType: 'Full-time',
    status: 'Applied',
    jobUrl: 'https://stripe.com/jobs/123',
    recruiterEmail: 'recruiter@stripe.com',
  };

  const res = await request(app).post('/api/applications').send(payload);

  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.company, 'Stripe');
  assert.equal(res.body.data.jobTitle, 'Backend Engineer');
  assert.equal(res.body.data.status, 'Applied');
  assert.ok(res.body.data._id);
});

test('POST /api/applications fails validation when required fields are missing', async () => {
  const payload = {
    location: 'San Francisco',
  };

  const res = await request(app).post('/api/applications').send(payload);

  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
  assert.equal(res.body.message, 'Validation failed');
  assert.ok(Array.isArray(res.body.errors));
});

test('POST /api/applications fails with invalid status enum value', async () => {
  const payload = {
    company: 'Google',
    jobTitle: 'Software Engineer',
    status: 'Hired_Unknown',
  };

  const res = await request(app).post('/api/applications').send(payload);

  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
  assert.ok(res.body.errors.some((e) => e.field === 'status'));
});

test('GET /api/applications lists applications with search and filters', async () => {
  await Application.create([
    { company: 'Meta', jobTitle: 'React Developer', status: 'Applied', workMode: 'Remote' },
    { company: 'Apple', jobTitle: 'iOS Engineer', status: 'Interview', workMode: 'In-office' },
    { company: 'Amazon', jobTitle: 'Cloud Architect', status: 'Offer', workMode: 'Hybrid' },
  ]);

  const searchRes = await request(app).get('/api/applications?q=Meta');
  assert.equal(searchRes.status, 200);
  assert.equal(searchRes.body.data.length, 1);
  assert.equal(searchRes.body.data[0].company, 'Meta');

  const filterRes = await request(app).get('/api/applications?status=Interview');
  assert.equal(filterRes.status, 200);
  assert.equal(filterRes.body.data.length, 1);
  assert.equal(filterRes.body.data[0].company, 'Apple');
});

test('GET /api/applications/:id handles valid and invalid ObjectIds', async () => {
  const doc = await Application.create({
    company: 'Netflix',
    jobTitle: 'UI Engineer',
  });

  const validRes = await request(app).get(`/api/applications/${doc._id}`);
  assert.equal(validRes.status, 200);
  assert.equal(validRes.body.data.company, 'Netflix');

  const invalidIdRes = await request(app).get('/api/applications/invalid-id-123');
  assert.equal(invalidIdRes.status, 400);
  assert.equal(invalidIdRes.body.success, false);

  const nonExistentId = new mongoose.Types.ObjectId();
  const notFoundRes = await request(app).get(`/api/applications/${nonExistentId}`);
  assert.equal(notFoundRes.status, 404);
  assert.equal(notFoundRes.body.success, false);
});

test('PUT /api/applications/:id updates application record', async () => {
  const doc = await Application.create({
    company: 'Microsoft',
    jobTitle: 'Fullstack Engineer',
    status: 'Applied',
  });

  const res = await request(app)
    .put(`/api/applications/${doc._id}`)
    .send({ status: 'Interview', recruiterName: 'John Smith' });

  assert.equal(res.status, 200);
  assert.equal(res.body.data.status, 'Interview');
  assert.equal(res.body.data.recruiterName, 'John Smith');
});

test('DELETE /api/applications/:id deletes application', async () => {
  const doc = await Application.create({
    company: 'Uber',
    jobTitle: 'Systems Engineer',
  });

  const res = await request(app).delete(`/api/applications/${doc._id}`);
  assert.equal(res.status, 200);
  assert.equal(res.body.data.id, doc._id.toString());

  const checkRes = await request(app).get(`/api/applications/${doc._id}`);
  assert.equal(checkRes.status, 404);
});

test('GET /api/stats returns accurate metrics count', async () => {
  await Application.create([
    { company: 'Co1', jobTitle: 'Role1', status: 'Applied' },
    { company: 'Co2', jobTitle: 'Role2', status: 'Interview', interviewDate: new Date(Date.now() + 86400000) },
    { company: 'Co3', jobTitle: 'Role3', status: 'Offer' },
    { company: 'Co4', jobTitle: 'Role4', status: 'Rejected' },
  ]);

  const res = await request(app).get('/api/stats');
  assert.equal(res.status, 200);
  assert.equal(res.body.data.total, 4);
  assert.equal(res.body.data.byStatus.Applied, 1);
  assert.equal(res.body.data.byStatus.Interview, 1);
  assert.equal(res.body.data.byStatus.Offer, 1);
  assert.equal(res.body.data.byStatus.Rejected, 1);
});
