import { html, fixture, assert } from '@open-wc/testing';

import * as ElementUtils from '../element-utilities.js';

suite('Element Utilities', async () => {
  test('generateValidationMessage', async () => {
    const el = await fixture(html`
      <input type="text" required value="a value">
    `);

    assert.equal(true, el.required)

    assert.equal('', ElementUtils.generateValidationMessage(el))

    el.value = ""

    assert.equal('Please fill out this field.', ElementUtils.generateValidationMessage(el))

    el.setCustomValidity("A custom error")

    assert.equal('A custom error', ElementUtils.generateValidationMessage(el))
  });

  test(`skipInputValidation`, async() => {
    const el = await fixture(html`
      <input type="text" data-live-validation>
    `);

    assert.equal(false, ElementUtils.skipInputValidation(el))

    el.removeAttribute(`data-live-validation`)

    assert.equal(true, ElementUtils.skipInputValidation(el))
  })

  test(`skipFocusoutValidation`, async() => {
    const el = await fixture(html`
      <input type="text" data-focusout-validation>
    `);

    assert.equal(false, ElementUtils.skipFocusoutValidation(el))

    el.removeAttribute(`data-focusout-validation`)

    assert.equal(true, ElementUtils.skipFocusoutValidation(el))
  })

  test(`skipValidation`, async() => {
    const el = await fixture(html`
      <input type="text" data-skip-validation>
    `);

    assert.equal(true, ElementUtils.skipValidation(el))

    el.removeAttribute(`data-skip-validation`)

    assert.equal(false, ElementUtils.skipValidation(el))
  })

  test(`reflectConstraintValidationForElement`, async() => {
    const container = await fixture(html`
      <div>
        <input type="text" id="name-field" aria-describedby="name-field-errors" required>
        <section id="name-field-errors" data-error-container>
          <ul>
            <li data-visible data-error-type="error_1">An ad-hoc error from the initial load</li>
            <li data-visible data-error-type="error_2">Another ad-hoc error from the initial load</li>
          </ul>
        </section>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-error-message></span></li>
        </template>
      </div>
    `);

    const input = container.querySelector(`input`)

    assert.equal(false, input.validity.valid)

    ElementUtils.reflectConstraintValidationForElement(input)

    assert.equal(true, input.hasAttribute(`data-is-invalid`))
    assert.equal("true", input.getAttribute(`aria-invalid`))

    assert.equal(1, document.querySelectorAll(`#name-field-errors li`).length)

    const errorElement = document.querySelector(`#name-field-errors li[data-visible][data-error-type="valueMissing"]`)

    assert.isNotNull(errorElement)
    assert.equal("‼️ Please fill out this field.", errorElement.textContent)

    input.value = "A value"

    assert.equal(true, input.validity.valid)

    ElementUtils.reflectConstraintValidationForElement(input)

    assert.equal(false, input.hasAttribute(`data-is-invalid`))
    assert.equal("false", input.getAttribute(`aria-invalid`))

    assert.equal(0, document.querySelectorAll(`#name-field-errors li`).length)
  })
})