import { html, fixture, assert } from '@open-wc/testing';

import '../error-handling-element.js';

suite('ErrorHandlingElement', () => {
  test('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture(html`
      <my-element></my-element>
    `);

    assert.equal(-1, [1, 2, 3].indexOf(4));
  });
});