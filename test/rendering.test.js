import { html, fixture, assert } from '@open-wc/testing';

import * as Rendering from '@practical-computer/error-handling/rendering';

suite('Rendering', async () => {
  test(`error list cleaning`, async () => {
    const errorList = await fixture(html`
      <ul>
        <li data-pf-error-visible data-pf-error-type="error_1">An ad-hoc error 1</li>
        <li data-pf-error-visible data-pf-error-type="error_2">An ad-hoc error 2</li>
        <li data-pf-error-visible data-pf-error-type="custom_1" data-pf-error-preserve>Preserved error 1</li>
        <li data-pf-error-type="custom_3" data-pf-error-preserve>Preserved error 3</li>
      </ul>
    `)

    assert.equal(4, errorList.querySelectorAll(`li`).length)
    assert.equal(3, errorList.querySelectorAll(`[data-pf-error-visible]`).length)

    Rendering.clearErrorList(errorList)

    assert.equal(2, errorList.querySelectorAll(`li`).length)
    assert.equal(0, errorList.querySelectorAll(`[data-pf-error-visible]`).length)
  })

  test(`clearErrorListsInForm`, async() => {
    const form = await fixture(html`
      <form aria-describedby="fallback-error-section">
        <section>
          <input type="text" id="name-field" aria-describedby="name-field-errors" required>
            <section id="name-field-errors" data-pf-error-container>
              <ul>
                <li data-pf-error-preserve data-pf-error-type="valueMissing">The preserved message</li>
                <li data-pf-error-visible data-pf-error-type="error_2">Another ad-hoc error from the initial load</li>
              </ul>
            </section>
        </section>

        <section>
          <input type="email" id="email-field" aria-describedby="email-field-errors" required>
            <section id="email-field-errors" data-pf-error-container>
              <ul>
                <li data-pf-error-visible data-pf-error-type="error_1">An ad-hoc error from the initial load</li>
                <li data-pf-error-visible data-pf-error-type="error_2">Another ad-hoc error from the initial load</li>
              </ul>
            </section>
        </section>

        <section id="fallback-error-section" data-pf-error-container>
          <ul>
            <li data-pf-error-visible data-pf-error-type="error_1">An ad-hoc fallback error 1</li>
            <li data-pf-error-visible data-pf-error-type="custom_1" data-pf-error-preserve>Preserved fallback error</li>
          </ul>
        </section>
      </form>
    `)

    assert.equal(2, document.querySelectorAll(`#name-field-errors [data-pf-error-type]`).length)
    assert.equal(2, document.querySelectorAll(`#email-field-errors [data-pf-error-type]`).length)
    assert.equal(2, document.querySelectorAll(`#fallback-error-section [data-pf-error-type]`).length)

    Rendering.clearErrorListsInForm(form)

    assert.equal(1, document.querySelectorAll(`#name-field-errors [data-pf-error-type]`).length)
    assert.equal(0, document.querySelectorAll(`#email-field-errors [data-pf-error-type]`).length)
    assert.equal(1, document.querySelectorAll(`#fallback-error-section [data-pf-error-type]`).length)
  })

  test(`errorMessageListItem`, async() => {
    const container = await fixture(html`
      <div>
        <p>Some content</p>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-pf-error-message></span></li>
        </template>
      </div>
    `)

    const itemElement = Rendering.errorMessageListItem("An error message", "a-custom-type")

    assert.equal("a-custom-type", itemElement.getAttribute(`data-pf-error-type`))
    assert.equal("An error message", itemElement.querySelector(`[data-pf-error-message]`).textContent)
    assert.equal("‼️ An error message", itemElement.textContent)
    assert.equal(false, itemElement.hasAttribute(`data-pf-error-preserve`))

    itemElement.setAttribute(`data-pf-error-preserve`, true)
    assert.equal(true, itemElement.hasAttribute(`data-pf-error-preserve`))
  })

  test(`errorMessageListItemWithHTML`, async() => {
    const container = await fixture(html`
      <div>
        <p>Some content</p>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-pf-error-message></span></li>
        </template>
      </div>
    `)

    const htmlString = `<strong>Richly <a href="https://example.com">rendered</a> errors!</strong>`

    const itemElement = Rendering.errorMessageListItemWithHTML(htmlString, "a-custom-type")

    assert.equal("a-custom-type", itemElement.getAttribute(`data-pf-error-type`))
    assert.equal(htmlString, itemElement.querySelector(`[data-pf-error-message]`).innerHTML)
    assert.equal("‼️ Richly rendered errors!", itemElement.textContent)
    assert.equal(false, itemElement.hasAttribute(`data-pf-error-preserve`))

    itemElement.setAttribute(`data-pf-error-preserve`, true)
    assert.equal(true, itemElement.hasAttribute(`data-pf-error-preserve`))
  })

  test(`renderConstraintValidationMessageForElement: the input is valid`, async () => {
    const container = await fixture(html`
      <div>
        <input type="text" id="name-field" aria-describedby="name-field-errors" required>
        <section id="name-field-errors" data-pf-error-container>
          <ul>
            <li data-pf-error-visible data-pf-error-type="error_1">An ad-hoc error from the initial load</li>
            <li data-pf-error-visible data-pf-error-type="error_2">Another ad-hoc error from the initial load</li>
          </ul>
        </section>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-pf-error-message></span></li>
        </template>
      </div>
    `);

    assert.equal(2, document.querySelectorAll(`#name-field-errors li`).length)

    const input = container.querySelector(`input`)

    assert.equal(false, input.validity.valid)

    Rendering.renderConstraintValidationMessageForElement(input)

    assert.equal(1, document.querySelectorAll(`#name-field-errors li`).length)

    const errorElement = document.querySelector(`#name-field-errors li[data-pf-error-visible][data-pf-error-type="valueMissing"]`)

    assert.isNotNull(errorElement)
    assert.equal("‼️ Please fill out this field.", errorElement.textContent)

    input.value = "Something to write"

    Rendering.renderConstraintValidationMessageForElement(input)
    assert.equal(0, document.querySelectorAll(`#name-field-errors li`).length)
  })

  test(`renderConstraintValidationMessageForElement: ad-hoc messages initially loaded are cleared out`, async () => {
    const container = await fixture(html`
      <div>
        <input type="text" id="name-field" aria-describedby="name-field-errors" required>
        <section id="name-field-errors" data-pf-error-container>
          <ul>
            <li data-pf-error-visible data-pf-error-type="error_1">An ad-hoc error from the initial load</li>
            <li data-pf-error-visible data-pf-error-type="error_2">Another ad-hoc error from the initial load</li>
          </ul>
        </section>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-pf-error-message></span></li>
        </template>
      </div>
    `);

    assert.equal(2, document.querySelectorAll(`#name-field-errors li`).length)

    const input = container.querySelector(`input`)

    assert.equal(false, input.validity.valid)

    Rendering.renderConstraintValidationMessageForElement(input)

    assert.equal(1, document.querySelectorAll(`#name-field-errors li`).length)

    const errorElement = document.querySelector(`#name-field-errors li[data-pf-error-visible][data-pf-error-type="valueMissing"]`)

    assert.isNotNull(errorElement)
    assert.equal("‼️ Please fill out this field.", errorElement.textContent)
  })

  test(`renderConstraintValidationMessageForElement: empty error list`, async () => {
    const container = await fixture(html`
      <div>
        <input type="text" id="name-field" aria-describedby="name-field-errors" required>
        <section id="name-field-errors" data-pf-error-container>
          <ul></ul>
        </section>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-pf-error-message></span></li>
        </template>
      </div>
    `);

    assert.equal(0, document.querySelectorAll(`#name-field-errors li`).length)

    const input = container.querySelector(`input`)

    assert.equal(false, input.validity.valid)

    Rendering.renderConstraintValidationMessageForElement(input)

    assert.equal(1, document.querySelectorAll(`#name-field-errors li`).length)

    const errorElement = document.querySelector(`#name-field-errors li[data-pf-error-visible][data-pf-error-type="valueMissing"]`)

    assert.isNotNull(errorElement)
    assert.equal("‼️ Please fill out this field.", errorElement.textContent)
  })

  test(`renderConstraintValidationMessageForElement: uses the given preserved message`, async () => {
    const container = await fixture(html`
      <div>
        <input type="text" id="name-field" aria-describedby="name-field-errors" required>
        <section id="name-field-errors" data-pf-error-container>
          <ul>
            <li data-pf-error-preserve data-pf-error-type="valueMissing">The preserved message</li>
            <li data-pf-error-visible data-pf-error-type="error_2">Another ad-hoc error from the initial load</li>
          </ul>
        </section>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-pf-error-message></span></li>
        </template>
      </div>
    `);

    assert.equal(2, document.querySelectorAll(`#name-field-errors li`).length)

    const input = container.querySelector(`input`)

    assert.equal(false, input.validity.valid)

    Rendering.renderConstraintValidationMessageForElement(input)

    assert.equal(1, document.querySelectorAll(`#name-field-errors li`).length)

    const errorElement = document.querySelector(`#name-field-errors li[data-pf-error-visible][data-pf-error-type="valueMissing"]`)

    assert.isNotNull(errorElement)
    assert.equal("The preserved message", errorElement.textContent)
  })

  test(`renderConstraintValidationMessageForElement: keeps the given preserved message, removing the data-pf-error-visible attribute`, async () => {
    const container = await fixture(html`
      <div>
        <input type="text" id="name-field" aria-describedby="name-field-errors" required>
        <section id="name-field-errors" data-pf-error-container>
          <ul>
            <li data-pf-error-preserve data-pf-error-type="valueMissing">The preserved message</li>
            <li data-pf-error-visible data-pf-error-type="error_2">Another ad-hoc error from the initial load</li>
          </ul>
        </section>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-pf-error-message></span></li>
        </template>
      </div>
    `);

    assert.equal(2, document.querySelectorAll(`#name-field-errors li`).length)

    const input = container.querySelector(`input`)

    assert.equal(false, input.validity.valid)

    Rendering.renderConstraintValidationMessageForElement(input)

    assert.equal(1, document.querySelectorAll(`#name-field-errors li`).length)

    const errorElement = document.querySelector(`#name-field-errors li[data-pf-error-visible][data-pf-error-type="valueMissing"]`)

    assert.isNotNull(errorElement)
    assert.equal("The preserved message", errorElement.textContent)

    input.value = "Fixing the errors"

    Rendering.renderConstraintValidationMessageForElement(input)

    assert.equal(1, document.querySelectorAll(`#name-field-errors li`).length)

    assert.equal(false, errorElement.hasAttribute(`data-pf-error-visible`))
    assert.equal(true, errorElement.hasAttribute(`data-pf-error-preserve`))
    assert.equal("The preserved message", errorElement.textContent)
  })
})

suite(`renderConstraintValidationMessageForElement: different input types`, async () => {
  test(`radio: required`, async () => {
    const container = await fixture(html`
      <div>
        <fieldset>
          <input type="radio" name="terms" id="terms-field-privacy" value="privacy" aria-describedby="terms-field-errors" required>
          <input type="radio" name="terms" id="terms-field-service" value="service" aria-describedby="terms-field-errors">
          <section id="terms-field-errors" data-pf-error-container>
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

    assert.equal(2, document.querySelectorAll(`#terms-field-errors li`).length)

    const privacy = document.getElementById(`terms-field-privacy`)
    const service = document.getElementById(`terms-field-service`)

    assert.equal(false, privacy.validity.valid)
    assert.equal(false, service.validity.valid)

    Rendering.renderConstraintValidationMessageForElement(privacy)
    Rendering.renderConstraintValidationMessageForElement(service)

    assert.equal(1, document.querySelectorAll(`#terms-field-errors li`).length)

    const errorElement = document.querySelector(`#terms-field-errors li[data-pf-error-visible][data-pf-error-type="valueMissing"]`)

    assert.isNotNull(errorElement)
    assert.equal("‼️ Please select one of these options.", errorElement.textContent)

    privacy.checked = true
    service.checked = true

    Rendering.renderConstraintValidationMessageForElement(privacy)
    Rendering.renderConstraintValidationMessageForElement(service)
    assert.equal(0, document.querySelectorAll(`#terms-field-errors li`).length)
  })

  test(`checkbox: multiple checkboxes, all required, all pointing to same error container`, async () => {
    const container = await fixture(html`
      <div>
        <fieldset>
          <input type="checkbox" name="terms" id="terms-field-privacy" value="privacy" aria-describedby="terms-field-errors" required>
          <input type="checkbox" name="terms" id="terms-field-service" value="service" aria-describedby="terms-field-errors" required>
          <section id="terms-field-errors" data-pf-error-container>
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

    assert.equal(2, document.querySelectorAll(`#terms-field-errors li`).length)

    const privacy = document.getElementById(`terms-field-privacy`)
    const service = document.getElementById(`terms-field-service`)

    assert.equal(false, privacy.validity.valid)
    assert.equal(false, service.validity.valid)

    Rendering.renderConstraintValidationMessageForElement(privacy)
    Rendering.renderConstraintValidationMessageForElement(service)

    assert.equal(1, document.querySelectorAll(`#terms-field-errors li`).length)

    const errorElement = document.querySelector(`#terms-field-errors li[data-pf-error-visible][data-pf-error-type="valueMissing"]`)

    assert.isNotNull(errorElement)
    assert.equal("‼️ Please check this box if you want to proceed.", errorElement.textContent)

    privacy.checked = true
    service.checked = true

    Rendering.renderConstraintValidationMessageForElement(privacy)
    Rendering.renderConstraintValidationMessageForElement(service)
    assert.equal(0, document.querySelectorAll(`#terms-field-errors li`).length)
  })

  test(`checkbox: multiple checkboxes, all required, pointing to different error container`, async () => {
    const container = await fixture(html`
      <div>
        <fieldset>
          <input type="checkbox" name="terms" id="terms-field-privacy" value="privacy" aria-describedby="terms-privacy-errors" required>
          <input type="checkbox" name="terms" id="terms-field-service" value="service" aria-describedby="terms-service-errors" required>
          <section id="terms-privacy-errors" data-pf-error-container>
            <ul>
              <li data-pf-error-visible data-pf-error-type="error_1">An ad-hoc error from the initial load</li>
              <li data-pf-error-visible data-pf-error-type="error_2">Another ad-hoc error from the initial load</li>
            </ul>
          </section>

          <section id="terms-service-errors" data-pf-error-container>
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

    assert.equal(2, document.querySelectorAll(`#terms-privacy-errors li`).length)
    assert.equal(2, document.querySelectorAll(`#terms-service-errors li`).length)

    const privacy = document.getElementById(`terms-field-privacy`)
    const service = document.getElementById(`terms-field-service`)

    assert.equal(false, privacy.validity.valid)
    assert.equal(false, service.validity.valid)

    Rendering.renderConstraintValidationMessageForElement(privacy)

    assert.equal(1, document.querySelectorAll(`#terms-privacy-errors li`).length)
    assert.equal(2, document.querySelectorAll(`#terms-service-errors li`).length)

    const errorElement = document.querySelector(`#terms-privacy-errors li[data-pf-error-visible][data-pf-error-type="valueMissing"]`)

    assert.isNotNull(errorElement)
    assert.equal("‼️ Please check this box if you want to proceed.", errorElement.textContent)

    privacy.checked = true

    Rendering.renderConstraintValidationMessageForElement(privacy)
    Rendering.renderConstraintValidationMessageForElement(service)
    assert.equal(0, document.querySelectorAll(`#terms-privacy-errors li`).length)
  })
})