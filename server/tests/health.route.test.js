import assert from 'node:assert/strict';
import test from 'node:test';

import request from 'supertest';

import { createApp } from '../src/app.js';

test('GET /api/health returns standardized success shape', async () => {
  const app = createApp();
  const response = await request(app).get('/api/health');

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, {
    data: { status: 'ok' },
    error: null,
  });
});

