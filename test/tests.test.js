import { html, fixture, assert } from '@open-wc/testing';

import * as ElementUtils from '../element-utilities.js';
import * as Rendering from '../rendering.js';
import * as ErrorContainerUtils from '../error-containers.js';

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

suite('Error Container Utilities', async () => {
  test(`error container retrieval`, async () => {
    const container = await fixture(html`<div></div>`)
    const input = await fixture(html`<input type="text" id="name-field" aria-describedby="name-field-errors">`)

    container.append(input)

    assert.equal(false, ErrorContainerUtils.hasErrorContainer(input))
    assert.isNull(ErrorContainerUtils.getErrorContainer(input))

    await assert.throws(() => {
      ElementUtils.getErrorList(input)
    }, TypeError)

    await assert.throws(() => {
      ElementUtils.getPreservedErrors(input)
    }, TypeError)

    const errorContainer = await fixture(html`
       <section id="name-field-errors" data-error-container>
       </section>
    `)

    container.append(...[errorContainer])


    assert.equal(true, ErrorContainerUtils.hasErrorContainer(input))
    assert.equal(errorContainer, ErrorContainerUtils.getErrorContainer(input))

    assert.isNull(ErrorContainerUtils.getErrorList(input))

    const errorList = await fixture(html`<ul></ul>`)

    errorContainer.append(...[errorList])

    assert.equal(errorList, ErrorContainerUtils.getErrorList(input))

    const error_1 = document.createElement(`li`)
    error_1.textContent = "error 1"
    errorList.append(error_1)


    assert.equal(0, ErrorContainerUtils.getPreservedErrors(errorList).length)

    const error_2 = document.createElement(`li`)
    error_2.textContent = "error 1"
    error_2.setAttribute(`data-preserve`, true)
    errorList.append(error_2)

    assert.equal(1, ErrorContainerUtils.getPreservedErrors(errorList).length)
    assert.equal(error_2, ErrorContainerUtils.getPreservedErrors(errorList)[0])
  })

  test(`errorListItemTemplate`, async() => {
    const noTemplateElement = await fixture(html`
      <div>
        <p>Some content</p>
      </div>
    `)

    assert.isNull(ErrorContainerUtils.errorListItemTemplate())

    const hasTemplateElement = await fixture(html`
      <div>
        <p>Some content</p>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span><span data-error-message></span></li>
        </template>
      </div>
    `)

    const templateElement = ErrorContainerUtils.errorListItemTemplate()
    assert.isNotNull(templateElement)

    const clone = templateElement.content.cloneNode(true).querySelector(`*:first-child`)
    assert.equal(1, clone.querySelectorAll(`[data-error-message]`).length)
  })

  test(`hasPreservedErrorForType`, async() => {
    const errorList = await fixture(html`
      <ul>
        <li data-visible data-error-type="error_1">An ad-hoc error 1</li>
        <li data-visible data-error-type="error_2">An ad-hoc error 2</li>
        <li data-visible data-error-type="custom_1" data-preserve>Preserved error 1</li>
        <li data-error-type="custom_2" data-preserve>Preserved error 3</li>
        <li data-preserve>Error without type</li>
      </ul>
    `)

    assert.equal(false, ErrorContainerUtils.hasPreservedErrorForType(errorList, `error_1`))
    assert.equal(true, ErrorContainerUtils.hasPreservedErrorForType(errorList, `custom_1`))
    assert.equal(true, ErrorContainerUtils.hasPreservedErrorForType(errorList, `custom_2`))
  })

  test(`getErrorForType`, async() => {
    const errorList = await fixture(html`
      <ul>
        <li data-visible data-error-type="error_1">An ad-hoc error 1</li>
        <li data-visible data-error-type="error_2">An ad-hoc error 2</li>
        <li data-visible data-error-type="custom_1" data-preserve>Preserved error 1</li>
        <li data-error-type="custom_2" data-preserve>Preserved error 3</li>
        <li data-preserve>Error without type</li>
      </ul>
    `)

    assert.equal("An ad-hoc error 1", ErrorContainerUtils.getErrorForType(errorList, `error_1`).textContent)
    assert.equal("Preserved error 1", ErrorContainerUtils.getErrorForType(errorList, `custom_1`).textContent)
    assert.equal("Preserved error 3", ErrorContainerUtils.getErrorForType(errorList, `custom_2`).textContent)
  })
});

suite('Rendering', async () => {
  test(`error list cleaning`, async () => {
    const errorList = await fixture(html`
      <ul>
        <li data-visible data-error-type="error_1">An ad-hoc error 1</li>
        <li data-visible data-error-type="error_2">An ad-hoc error 2</li>
        <li data-visible data-error-type="custom_1" data-preserve>Preserved error 1</li>
        <li data-error-type="custom_3" data-preserve>Preserved error 3</li>
      </ul>
    `)

    assert.equal(4, errorList.querySelectorAll(`li`).length)
    assert.equal(3, errorList.querySelectorAll(`[data-visible]`).length)

    Rendering.clearErrorList(errorList)

    assert.equal(2, errorList.querySelectorAll(`li`).length)
    assert.equal(0, errorList.querySelectorAll(`[data-visible]`).length)
  })

  test(`clearErrorListsInForm`, async() => {
    const form = await fixture(html`
      <form aria-describedby="fallback-error-section">
        <section>
          <input type="text" id="name-field" aria-describedby="name-field-errors" required>
            <section id="name-field-errors" data-error-container>
              <ul>
                <li data-preserve data-error-type="valueMissing">The preserved message</li>
                <li data-visible data-error-type="error_2">Another ad-hoc error from the initial load</li>
              </ul>
            </section>
        </section>

        <section>
          <input type="email" id="email-field" aria-describedby="email-field-errors" required>
            <section id="email-field-errors" data-error-container>
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
      </form>
    `)

    assert.equal(2, document.querySelectorAll(`#name-field-errors [data-error-type]`).length)
    assert.equal(2, document.querySelectorAll(`#email-field-errors [data-error-type]`).length)
    assert.equal(2, document.querySelectorAll(`#fallback-error-section [data-error-type]`).length)

    Rendering.clearErrorListsInForm(form)

    assert.equal(1, document.querySelectorAll(`#name-field-errors [data-error-type]`).length)
    assert.equal(0, document.querySelectorAll(`#email-field-errors [data-error-type]`).length)
    assert.equal(1, document.querySelectorAll(`#fallback-error-section [data-error-type]`).length)
  })

  test(`errorMessageListItem`, async() => {
    const container = await fixture(html`
      <div>
        <p>Some content</p>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-error-message></span></li>
        </template>
      </div>
    `)

    const itemElement = Rendering.errorMessageListItem("An error message", "a-custom-type")

    assert.equal("a-custom-type", itemElement.getAttribute(`data-error-type`))
    assert.equal("An error message", itemElement.querySelector(`[data-error-message]`).textContent)
    assert.equal("‼️ An error message", itemElement.textContent)
    assert.equal(false, itemElement.hasAttribute(`data-preserve`))

    itemElement.setAttribute(`data-preserve`, true)
    assert.equal(true, itemElement.hasAttribute(`data-preserve`))
  })

  test(`renderConstraintValidationMessageForElement: the input is valid`, async () => {
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

    assert.equal(2, document.querySelectorAll(`#name-field-errors li`).length)

    const input = container.querySelector(`input`)

    assert.equal(false, input.validity.valid)

    Rendering.renderConstraintValidationMessageForElement(input)

    assert.equal(1, document.querySelectorAll(`#name-field-errors li`).length)

    const errorElement = document.querySelector(`#name-field-errors li[data-visible][data-error-type="valueMissing"]`)

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

    assert.equal(2, document.querySelectorAll(`#name-field-errors li`).length)

    const input = container.querySelector(`input`)

    assert.equal(false, input.validity.valid)

    Rendering.renderConstraintValidationMessageForElement(input)

    assert.equal(1, document.querySelectorAll(`#name-field-errors li`).length)

    const errorElement = document.querySelector(`#name-field-errors li[data-visible][data-error-type="valueMissing"]`)

    assert.isNotNull(errorElement)
    assert.equal("‼️ Please fill out this field.", errorElement.textContent)
  })

  test(`renderConstraintValidationMessageForElement: empty error list`, async () => {
    const container = await fixture(html`
      <div>
        <input type="text" id="name-field" aria-describedby="name-field-errors" required>
        <section id="name-field-errors" data-error-container>
          <ul></ul>
        </section>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-error-message></span></li>
        </template>
      </div>
    `);

    assert.equal(0, document.querySelectorAll(`#name-field-errors li`).length)

    const input = container.querySelector(`input`)

    assert.equal(false, input.validity.valid)

    Rendering.renderConstraintValidationMessageForElement(input)

    assert.equal(1, document.querySelectorAll(`#name-field-errors li`).length)

    const errorElement = document.querySelector(`#name-field-errors li[data-visible][data-error-type="valueMissing"]`)

    assert.isNotNull(errorElement)
    assert.equal("‼️ Please fill out this field.", errorElement.textContent)
  })

  test(`renderConstraintValidationMessageForElement: uses the given preserved message`, async () => {
    const container = await fixture(html`
      <div>
        <input type="text" id="name-field" aria-describedby="name-field-errors" required>
        <section id="name-field-errors" data-error-container>
          <ul>
            <li data-preserve data-error-type="valueMissing">The preserved message</li>
            <li data-visible data-error-type="error_2">Another ad-hoc error from the initial load</li>
          </ul>
        </section>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-error-message></span></li>
        </template>
      </div>
    `);

    assert.equal(2, document.querySelectorAll(`#name-field-errors li`).length)

    const input = container.querySelector(`input`)

    assert.equal(false, input.validity.valid)

    Rendering.renderConstraintValidationMessageForElement(input)

    assert.equal(1, document.querySelectorAll(`#name-field-errors li`).length)

    const errorElement = document.querySelector(`#name-field-errors li[data-visible][data-error-type="valueMissing"]`)

    assert.isNotNull(errorElement)
    assert.equal("The preserved message", errorElement.textContent)
  })

  test(`renderConstraintValidationMessageForElement: keeps the given preserved message, removing the data-visible attribute`, async () => {
    const container = await fixture(html`
      <div>
        <input type="text" id="name-field" aria-describedby="name-field-errors" required>
        <section id="name-field-errors" data-error-container>
          <ul>
            <li data-preserve data-error-type="valueMissing">The preserved message</li>
            <li data-visible data-error-type="error_2">Another ad-hoc error from the initial load</li>
          </ul>
        </section>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-error-message></span></li>
        </template>
      </div>
    `);

    assert.equal(2, document.querySelectorAll(`#name-field-errors li`).length)

    const input = container.querySelector(`input`)

    assert.equal(false, input.validity.valid)

    Rendering.renderConstraintValidationMessageForElement(input)

    assert.equal(1, document.querySelectorAll(`#name-field-errors li`).length)

    const errorElement = document.querySelector(`#name-field-errors li[data-visible][data-error-type="valueMissing"]`)

    assert.isNotNull(errorElement)
    assert.equal("The preserved message", errorElement.textContent)

    input.value = "Fixing the errors"

    Rendering.renderConstraintValidationMessageForElement(input)

    assert.equal(1, document.querySelectorAll(`#name-field-errors li`).length)

    assert.equal(false, errorElement.hasAttribute(`data-visible`))
    assert.equal(true, errorElement.hasAttribute(`data-preserve`))
    assert.equal("The preserved message", errorElement.textContent)
  })
})