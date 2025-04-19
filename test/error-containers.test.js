import { html, fixture, assert } from '@open-wc/testing';

import * as ElementUtils from '@practical-computer/error-handling/element-utilities';
import * as ErrorContainerUtils from '@practical-computer/error-handling/error-containers';

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

  test(`hasPreservedErrorForType/getPreservedErrorForType`, async() => {
    const errorList = await fixture(html`
      <ul>
        <li data-visible data-error-type="error_1">An ad-hoc error 1</li>
        <li data-visible data-error-type="error_2">An ad-hoc error 2</li>
        <li data-visible data-error-type="custom_1" data-preserve>Preserved error 1</li>
        <li data-error-type="custom_2" data-preserve>Preserved error 2</li>
        <li data-preserve>Error without type</li>
      </ul>
    `)

    assert.equal(false, ErrorContainerUtils.hasPreservedErrorForType(errorList, `error_1`))
    assert.isUndefined(ErrorContainerUtils.getPreservedErrorForType(errorList, `error_1`))

    assert.equal(true, ErrorContainerUtils.hasPreservedErrorForType(errorList, `custom_1`))
    assert.equal("Preserved error 1", ErrorContainerUtils.getPreservedErrorForType(errorList, `custom_1`).textContent)

    assert.equal(true, ErrorContainerUtils.hasPreservedErrorForType(errorList, `custom_2`))
    assert.equal("Preserved error 2", ErrorContainerUtils.getPreservedErrorForType(errorList, `custom_2`).textContent)
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

  test(`markAsPreservedError`, async () => {
    const errorList = await fixture(html`
      <ul>
        <li data-visible data-error-type="error_1">An ad-hoc error 1</li>
        <li data-visible data-error-type="error_2">Error to mark as preserved</li>
      </ul>
    `)

    assert.equal(false, ErrorContainerUtils.hasPreservedErrorForType(errorList, `error_2`))

    ErrorContainerUtils.markAsPreservedError(errorList.querySelector(`[data-error-type="error_2"]`))

    assert.equal(true, ErrorContainerUtils.hasPreservedErrorForType(errorList, `error_2`))
  })
});