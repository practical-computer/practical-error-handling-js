import { html, fixture, assert } from '@open-wc/testing';

import * as ElementUtils from '@practical-computer/error-handling/element-utilities';

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

  test(`skipChangeValidation`, async() => {
    const el = await fixture(html`
      <input type="text" data-change-validation>
    `);

    assert.equal(false, ElementUtils.skipChangeValidation(el))

    el.removeAttribute(`data-change-validation`)

    assert.equal(true, ElementUtils.skipChangeValidation(el))
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

  test(`setValidityStateAttributes`, async() => {
    const input = await fixture(html`
      <input type="text" required value="a value">
    `);

    const customElement = await fixture(html`
      <a-custom-element>Such as a rich text editor</a-custom-element>
    `);

    assert.equal(false, input.hasAttribute(`data-invalid`))
    assert.equal(false, input.hasAttribute(`aria-invalid`))

    ElementUtils.setValidityStateAttributes(input, false)
    assert.equal(true, input.hasAttribute(`data-invalid`))
    assert.equal("true", input.getAttribute(`aria-invalid`))

    ElementUtils.setValidityStateAttributes(input, true)
    assert.equal(false, input.hasAttribute(`data-invalid`))
    assert.equal("false", input.getAttribute(`aria-invalid`))

    assert.equal(false, customElement.hasAttribute(`data-invalid`))
    assert.equal(false, customElement.hasAttribute(`aria-invalid`))

    ElementUtils.setValidityStateAttributes(customElement, false)
    assert.equal(true, customElement.hasAttribute(`data-invalid`))
    assert.equal("true", customElement.getAttribute(`aria-invalid`))

    ElementUtils.setValidityStateAttributes(customElement, true)
    assert.equal(false, customElement.hasAttribute(`data-invalid`))
    assert.equal("false", customElement.getAttribute(`aria-invalid`))
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

    assert.equal(true, input.hasAttribute(`data-invalid`))
    assert.equal("true", input.getAttribute(`aria-invalid`))

    assert.equal(1, document.querySelectorAll(`#name-field-errors li`).length)

    const errorElement = document.querySelector(`#name-field-errors li[data-visible][data-error-type="valueMissing"]`)

    assert.isNotNull(errorElement)
    assert.equal("‼️ Please fill out this field.", errorElement.textContent)

    input.value = "A value"

    assert.equal(true, input.validity.valid)

    ElementUtils.reflectConstraintValidationForElement(input)

    assert.equal(false, input.hasAttribute(`data-invalid`))
    assert.equal("false", input.getAttribute(`aria-invalid`))

    assert.equal(0, document.querySelectorAll(`#name-field-errors li`).length)
  })

  test(`reflectConstraintValidationForElement: element not required, value is blank`, async() => {
    const container = await fixture(html`
      <div>
        <input type="text" id="name-field" aria-describedby="name-field-errors">
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

    ElementUtils.reflectConstraintValidationForElement(input)

    assert.equal(false, input.hasAttribute(`data-invalid`))
    assert.equal("false", input.getAttribute(`aria-invalid`))

    assert.equal(0, document.querySelectorAll(`#name-field-errors li`).length)
  })

  test(`reflectConstraintValidationForInitialLoad`, async() => {
    const form = await fixture(html`
      <form aria-describedby="fallback-error-section">
        <section>
          <input type="number" id="count-field" aria-describedby="count-field-errors" value="10" max="5">
            <section id="count-field-errors" data-error-container>
              <ul>
                <li data-preserve data-error-type="valueMissing">The preserved message</li>
                <li data-visible data-error-type="error_2">Another ad-hoc error from the initial load</li>
              </ul>
            </section>
        </section>

        <section>
          <input type="text" id="title-field" aria-describedby="title-field-errors" required value="Server invalid">
            <section id="title-field-errors" data-error-container>
              <ul>
                <li data-visible data-preserve data-error-type="already_taken">The preserved message</li>
                <li data-visible data-error-type="error_2">Another ad-hoc error from the initial load</li>
              </ul>
            </section>
        </section>

        <section>
          <input type="email" id="email-field" aria-describedby="email-field-errors" data-initial-load-errors>
            <section id="email-field-errors" data-error-container>
              <ul>
                <li data-visible data-error-type="error_1">An ad-hoc error from the initial load</li>
                <li data-visible data-error-type="error_2">Another ad-hoc error from the initial load</li>
              </ul>
            </section>
        </section>

        <section>
          <input type="number" id="confirm-count-field" aria-describedby="confirm-count-field-errors" value="10" max="5" data-initial-load-errors>
            <section id="confirm-count-field-errors" data-error-container>
              <ul>
                <li data-visible data-error-type="error_1">An ad-hoc error from the initial load</li>
                <li data-visible data-error-type="error_2">Another ad-hoc error from the initial load</li>
              </ul>
            </section>
        </section>

        <section id="fallback-error-section" data-error-container>
          <ul>
            <li data-visible data-error-type="error_1">An ad-hoc fallback error 1</li>
            <li data-visible data-error-type="custom_1" data-preserve>Preserved fallback error</li>
          </ul>
        </section>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-error-message></span></li>
        </template>
      </form>
    `)

    assert.equal(2, document.querySelectorAll(`#count-field-errors [data-error-type]`).length)
    assert.equal(2, document.querySelectorAll(`#title-field-errors [data-error-type]`).length)
    assert.equal(2, document.querySelectorAll(`#email-field-errors [data-error-type]`).length)
    assert.equal(2, document.querySelectorAll(`#confirm-count-field-errors [data-error-type]`).length)
    assert.equal(2, document.querySelectorAll(`#fallback-error-section [data-error-type]`).length)

    ElementUtils.reflectConstraintValidationForInitialLoad(form)

    assert.equal(2, document.querySelectorAll(`#count-field-errors [data-error-type]`).length)
    assert.equal(1, document.querySelectorAll(`#title-field-errors [data-error-type]`).length)
    assert.equal(2, document.querySelectorAll(`#email-field-errors [data-error-type]`).length)
    assert.equal(2, document.querySelectorAll(`#confirm-count-field-errors [data-error-type]`).length)
    assert.equal(2, document.querySelectorAll(`#fallback-error-section [data-error-type]`).length)

    assert.equal(1, document.querySelectorAll(`#title-field-errors [data-error-type="already_taken"]`).length)

    assert.equal(1, document.querySelectorAll(`#count-field-errors [data-visible][data-error-type="rangeOverflow"]`).length)
  })
})