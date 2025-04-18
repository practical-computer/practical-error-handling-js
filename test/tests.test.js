import { html, fixture, assert } from '@open-wc/testing';

import { generateValidationMessage, skipInputValidation } from '../index.js';

suite('Element Utilities', async () => {
  test('generateValidationMessage', async () => {
    const el = await fixture(html`
      <input type="text" required value="a value">
    `);

    assert.equal(true, el.required)

    assert.equal('', generateValidationMessage(el))

    el.value = ""

    assert.equal('Please fill out this field.', generateValidationMessage(el))

    el.setCustomValidity("A custom error")

    assert.equal('A custom error', generateValidationMessage(el))
  });

  test(`skipInputValidation`, async() => {
    const el = await fixture(html`
      <input type="text" data-live-validation>
    `);

    assert.equal(false, skipInputValidation(el))

    el.removeAttribute(`data-live-validation`)

    assert.equal(true, skipInputValidation(el))
  })
})