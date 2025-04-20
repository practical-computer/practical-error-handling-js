import { html, fixture, assert } from '@open-wc/testing';

import {minimumCountOfFieldNameSelected } from '@practical-computer/error-handling/fieldset/minimum-field-values-fieldset-validation-element'

suite('utility functions', async () => {
  test(`minimumCountOfFieldNameSelected`, async() =>{
    const container = await fixture(html`
      <div>
        <form>
          <fieldset>
            <input type="checkbox" id="accepted-1" name="accepted" value="1">
            <input type="checkbox" id="accepted-2" name="accepted" value="2">
            <input type="checkbox" id="accepted-3" name="accepted" value="3">
          </fieldset>
        </form>
      </div>
    `)

    const fieldset = container.querySelector(`fieldset`)
    const fieldName = `accepted`

    assert.equal(true, minimumCountOfFieldNameSelected(fieldset, fieldName, 0))
    assert.equal(false, minimumCountOfFieldNameSelected(fieldset, fieldName, 1))

    fieldset.form.elements[`accepted-1`].checked = true

    assert.equal(true, minimumCountOfFieldNameSelected(fieldset, fieldName, 1))
    assert.equal(false, minimumCountOfFieldNameSelected(fieldset, fieldName, 2))
  })
})

suite('minimum-field-values-fieldset-validation-element', async () => {
  test(`validates on change events`, async() => {
    const container = await fixture(html`
      <div>
        <form id="test-form" aria-describedby='test-form-error-container'>
          <fieldset id="terms-fieldset" aria-describedby="terms-fieldset-errors">
            <legend>
              Terms

              <section id="terms-fieldset-errors-aria">
                <ul></ul>
              </section>

            </legend>

            <minimum-field-values-fieldset-validation
              min="2"
              validation-message="Please choose 2 terms"
              type="tooShort"
              fieldset="terms-fieldset"
              field-name="terms"
              error-container-aria="terms-fieldset-errors-aria"
              data-change-validation
            >
              <input type="checkbox" name="terms" id="privacy" value="privacy" required>
              <input type="checkbox" name="terms" id="service" value="service" required>
              <input type="checkbox" name="terms" id="data" value="data" required>
            </minimum-field-values-fieldset-validation>

            <section id="terms-fieldset-errors" data-error-container>
              <ul>
                <li data-visible data-error-type="error_1">An ad-hoc error from the initial load</li>
                <li data-visible data-error-type="error_2">Another ad-hoc error from the initial load</li>
              </ul>
            </section>
          </fieldset>
        </form>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-error-message></span></li>
        </template>
      </div>
    `)

    const element = container.querySelector(`minimum-field-values-fieldset-validation`)

    const privacy = document.getElementById(`privacy`)
    const service = document.getElementById(`service`)
    const data = document.getElementById(`data`)

    assert.equal(`terms`, element.fieldName)
    assert.equal(`test-form`, element.form.id)
    assert.equal(`terms-fieldset`, element.fieldset.id)
    assert.equal(`terms-fieldset-errors`, element.errorContainer.id)
    assert.equal(`terms-fieldset-errors-aria`, element.errorContainerARIA.id)
    assert.equal(2, element.min)

    privacy.checked = true
    privacy.dispatchEvent(new Event(`change`, {bubbles: true}))

    const errorElement = document.querySelector(`#terms-fieldset-errors li[data-visible][data-error-type="tooShort"]`)

    assert.isNotNull(errorElement)
    assert.equal("‼️ Please choose 2 terms", errorElement.textContent)

    data.checked = true
    data.dispatchEvent(new Event(`change`, {bubbles: true}))

    assert.equal(0, document.querySelectorAll(`#terms-fieldset-errors li`).length)
  })

  test(`validates on focusout events`, async() => {
    const container = await fixture(html`
      <div>
        <form id="test-form" aria-describedby='test-form-error-container'>
          <fieldset id="terms-fieldset" aria-describedby="terms-fieldset-errors">
            <legend>
              Terms

              <section id="terms-fieldset-errors-aria">
                <ul></ul>
              </section>

            </legend>

            <minimum-field-values-fieldset-validation
              min="2"
              validation-message="Please choose 2 terms"
              type="tooShort"
              fieldset="terms-fieldset"
              field-name="terms"
              error-container-aria="terms-fieldset-errors-aria"
              data-focusout-validation
            >
              <input type="checkbox" name="terms" id="privacy" value="privacy" required>
              <input type="checkbox" name="terms" id="service" value="service" required>
              <input type="checkbox" name="terms" id="data" value="data" required>
            </minimum-field-values-fieldset-validation>

            <button>Other focusable element</button>

            <section id="terms-fieldset-errors" data-error-container>
              <ul>
                <li data-visible data-error-type="error_1">An ad-hoc error from the initial load</li>
                <li data-visible data-error-type="error_2">Another ad-hoc error from the initial load</li>
              </ul>
            </section>
          </fieldset>
        </form>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-error-message></span></li>
        </template>
      </div>
    `)

    const element = container.querySelector(`minimum-field-values-fieldset-validation`)

    const privacy = document.getElementById(`privacy`)
    const service = document.getElementById(`service`)
    const data = document.getElementById(`data`)
    const button = document.querySelector(`button`)

    assert.equal(`terms`, element.fieldName)
    assert.equal(`test-form`, element.form.id)
    assert.equal(`terms-fieldset`, element.fieldset.id)
    assert.equal(`terms-fieldset-errors`, element.errorContainer.id)
    assert.equal(`terms-fieldset-errors-aria`, element.errorContainerARIA.id)
    assert.equal(2, element.min)

    privacy.checked = true
    privacy.dispatchEvent(new FocusEvent(`focusout`, {bubbles: true, relatedTarget: button}))

    const errorElement = document.querySelector(`#terms-fieldset-errors li[data-visible][data-error-type="tooShort"]`)

    assert.isNotNull(errorElement)
    assert.equal("‼️ Please choose 2 terms", errorElement.textContent)

    data.checked = true
    data.dispatchEvent(new FocusEvent(`focusout`, {bubbles: true, relatedTarget: button}))

    assert.equal(0, document.querySelectorAll(`#terms-fieldset-errors li`).length)
  })

  test(`prevents the form submission if invalid`, async() => {
    const container = await fixture(html`
      <div>
        <form id="test-form" aria-describedby='test-form-error-container'>
          <fieldset id="terms-fieldset" aria-describedby="terms-fieldset-errors">
            <legend>
              Terms

              <section id="terms-fieldset-errors-aria">
                <ul></ul>
              </section>

            </legend>

            <minimum-field-values-fieldset-validation
              min="2"
              validation-message="Please choose 2 terms"
              type="tooShort"
              fieldset="terms-fieldset"
              field-name="terms"
              error-container-aria="terms-fieldset-errors-aria"
            >
              <input type="checkbox" name="terms" id="privacy" value="privacy">
              <input type="checkbox" name="terms" id="service" value="service">
              <input type="checkbox" name="terms" id="data" value="data">
            </minimum-field-values-fieldset-validation>

            <section id="terms-fieldset-errors" data-error-container>
              <ul>
                <li data-visible data-error-type="error_1">An ad-hoc error from the initial load</li>
                <li data-visible data-error-type="error_2">Another ad-hoc error from the initial load</li>
              </ul>
            </section>
          </fieldset>
        </form>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-error-message></span></li>
        </template>
      </div>
    `)

    const element = container.querySelector(`minimum-field-values-fieldset-validation`)

    const privacy = document.getElementById(`privacy`)
    const service = document.getElementById(`service`)
    const data = document.getElementById(`data`)
    const form = document.getElementById(`test-form`)

    await new Promise((resolve) => {
      const handler = (event) => {
        event.preventDefault()
        const errorElement = document.querySelector(`#terms-fieldset-errors li[data-visible][data-error-type="tooShort"]`)

        assert.isNotNull(errorElement)
        assert.equal("‼️ Please choose 2 terms", errorElement.textContent)

        resolve()
        form.removeEventListener(`submit`, handler)
      }

      form.addEventListener(`submit`, handler)

      form.requestSubmit()
    })

    privacy.checked = true
    data.checked = true

    await new Promise((resolve) => {
      form.addEventListener(`submit`, (event) => {
        event.preventDefault()
        const errorElement = document.querySelector(`#terms-fieldset-errors li[data-visible][data-error-type="tooShort"]`)

        assert.isNull(errorElement)

        resolve()
      })

      form.requestSubmit()
    })
  })
})