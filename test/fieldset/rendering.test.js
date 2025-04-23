import { html, fixture, assert } from '@open-wc/testing';

import * as FieldsetRendering from '@practical-computer/error-handling/fieldset/rendering';

suite('Fieldset Rendering', async () => {
  test(`clearErrorListForFieldset: Removes all errors from the fieldset's error container`, async () => {
    const container = await fixture(html`
      <div>
        <fieldset aria-describedby="terms-fieldset-errors">
          <input type="checkbox" name="privacy" required>
          <input type="checkbox" name="service" required>

          <section id="terms-fieldset-errors" data-pf-error-container>
            <ul>
              <li data-pf-error-visible data-pf-error-type="error_1">An ad-hoc error from the initial load</li>
              <li data-pf-error-visible data-pf-error-type="error_2">Another ad-hoc error from the initial load</li>
            </ul>
          </section>
        </fieldset>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-pf-error-message></span></li>
        </template>
      </div>
    `);

    assert.equal(2, document.querySelectorAll(`#terms-fieldset-errors li`).length)

    const fieldset = container.querySelector(`fieldset`)

    FieldsetRendering.clearErrorListForFieldset(fieldset)

    assert.equal(0, document.querySelectorAll(`#terms-fieldset-errors li`).length)
  })

  test(`clearErrorListForFieldset: keeps the given preserved message, removing the data-pf-error-visible attribute`, async () => {
    const container = await fixture(html`
      <div>
        <fieldset aria-describedby="terms-fieldset-errors">
          <input type="checkbox" name="privacy" required>
          <input type="checkbox" name="service" required>

          <section id="terms-fieldset-errors" data-pf-error-container>
            <ul>
              <li data-pf-error-preserve data-pf-error-type="required">The preserved message</li>
              <li data-pf-error-visible data-pf-error-type="error_1">An ad-hoc error from the initial load</li>
              <li data-pf-error-visible data-pf-error-type="error_2">Another ad-hoc error from the initial load</li>
            </ul>
          </section>
        </fieldset>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-pf-error-message></span></li>
        </template>
      </div>
    `);

    assert.equal(3, document.querySelectorAll(`#terms-fieldset-errors li`).length)

    const fieldset = container.querySelector(`fieldset`)

    FieldsetRendering.clearErrorListForFieldset(fieldset)

    assert.equal(1, document.querySelectorAll(`#terms-fieldset-errors li`).length)

    const errorElement = document.querySelector(`#terms-fieldset-errors li[data-pf-error-type="required"]`)

    assert.equal(false, errorElement.hasAttribute(`data-pf-error-visible`))
    assert.equal(true, errorElement.hasAttribute(`data-pf-error-preserve`))
    assert.equal("The preserved message", errorElement.textContent)
  })

  test(`renderCustomErrorMessageForFieldset: ad-hoc messages initially loaded are cleared out`, async () => {
    const container = await fixture(html`
      <div>
        <fieldset aria-describedby="terms-fieldset-errors">
          <input type="checkbox" name="privacy" required>
          <input type="checkbox" name="service" required>

          <section id="terms-fieldset-errors" data-pf-error-container>
            <ul>
              <li data-pf-error-visible data-pf-error-type="error_1">An ad-hoc error from the initial load</li>
              <li data-pf-error-visible data-pf-error-type="error_2">Another ad-hoc error from the initial load</li>
            </ul>
          </section>
        </fieldset>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-pf-error-message></span></li>
        </template>
      </div>
    `);

    assert.equal(2, document.querySelectorAll(`#terms-fieldset-errors li`).length)

    const fieldset = container.querySelector(`fieldset`)

    const message = "Please accept all terms"
    const type = "required"

    FieldsetRendering.renderCustomErrorMessageForFieldset(fieldset, message, type)

    assert.equal(1, document.querySelectorAll(`#terms-fieldset-errors li`).length)

    const errorElement = document.querySelector(`#terms-fieldset-errors li[data-pf-error-visible][data-pf-error-type="required"]`)

    assert.isNotNull(errorElement)
    assert.equal("‼️ Please accept all terms", errorElement.textContent)
  })

  test(`renderCustomErrorMessageForFieldset: empty error list`, async () => {
    const container = await fixture(html`
      <div>
        <fieldset aria-describedby="terms-fieldset-errors">
          <input type="checkbox" name="privacy" required>
          <input type="checkbox" name="service" required>

          <section id="terms-fieldset-errors" data-pf-error-container>
            <ul></ul>
          </section>
        </fieldset>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-pf-error-message></span></li>
        </template>
      </div>
    `);

    assert.equal(0, document.querySelectorAll(`#terms-fieldset-errors li`).length)

    const fieldset = container.querySelector(`fieldset`)

    const message = "Please accept all terms"
    const type = "required"

    FieldsetRendering.renderCustomErrorMessageForFieldset(fieldset, message, type)

    assert.equal(1, document.querySelectorAll(`#terms-fieldset-errors li`).length)

    const errorElement = document.querySelector(`#terms-fieldset-errors li[data-pf-error-visible][data-pf-error-type="required"]`)

    assert.isNotNull(errorElement)
    assert.equal("‼️ Please accept all terms", errorElement.textContent)
  })

  test(`renderCustomErrorMessageForFieldset: uses the given preserved message`, async () => {
    const container = await fixture(html`
      <div>
        <fieldset aria-describedby="terms-fieldset-errors">
          <input type="checkbox" name="privacy" required>
          <input type="checkbox" name="service" required>

          <section id="terms-fieldset-errors" data-pf-error-container>
            <ul>
              <li data-pf-error-preserve data-pf-error-type="required">The preserved message</li>
              <li data-pf-error-visible data-pf-error-type="error_2">Another ad-hoc error from the initial load</li>
            </ul>
          </section>
        </fieldset>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-pf-error-message></span></li>
        </template>
      </div>
    `);

    assert.equal(2, document.querySelectorAll(`#terms-fieldset-errors li`).length)

    const fieldset = container.querySelector(`fieldset`)

    const message = "Please accept all terms"
    const type = "required"

    FieldsetRendering.renderCustomErrorMessageForFieldset(fieldset, message, type)

    assert.equal(1, document.querySelectorAll(`#terms-fieldset-errors li`).length)

    const errorElement = document.querySelector(`#terms-fieldset-errors li[data-pf-error-visible][data-pf-error-type="required"]`)

    assert.isNotNull(errorElement)
    assert.equal("The preserved message", errorElement.textContent)
  })
})