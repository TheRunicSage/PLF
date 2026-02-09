import assert from 'node:assert/strict';
import test from 'node:test';

import {
  validateContactInput,
  validatePostInput,
  validateProjectInput,
} from '../src/utils/validate.js';

test('validateContactInput rejects empty payload', () => {
  const result = validateContactInput({});
  assert.equal(result.isValid, false);
  assert.equal(result.details.name, 'Name is required.');
  assert.equal(result.details.email, 'Email is required.');
  assert.equal(result.details.message, 'Message is required.');
});

test('validatePostInput requires title/content/type', () => {
  const result = validatePostInput({ title: '', content: '', type: '' });
  assert.equal(result.isValid, false);
  assert.equal(result.details.title, 'Title is required.');
  assert.equal(result.details.content, 'Content is required.');
  assert.equal(result.details.type, 'Type is required.');
});

test('validateProjectInput enforces valid status', () => {
  const result = validateProjectInput({
    title: 'Test Project',
    shortDescription: 'Short',
    status: 'archived',
  });

  assert.equal(result.isValid, false);
  assert.equal(
    result.details.status,
    'Status must be one of: ongoing, completed, upcoming.'
  );
});

