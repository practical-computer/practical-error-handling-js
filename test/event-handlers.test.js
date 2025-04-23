import { html, fixture, assert } from '@open-wc/testing';

import * as EventHandlers from '@practical-computer/error-handling/event-handlers';

suite('Event Handlers', async () => {
  test(`inputValidationEventHandler: does nothing if no data-pf-validation`, async() => {
    const input = await fixture(html`
      <input type="email" required>
    `)

    input.addEventListener(`test-event`, EventHandlers.inputValidationEventHandler)

    input.dispatchEvent(new CustomEvent(`test-event`))

    assert.equal(false, input.hasAttribute(`aria-invalid`))
  })

  test(`inputValidationEventHandler: fires if data-pf-validation="input"`, async() => {
    const input = await fixture(html`
      <input type="email" required data-pf-validation="input">
    `)

    input.addEventListener(`test-event`, EventHandlers.inputValidationEventHandler)

    input.dispatchEvent(new CustomEvent(`test-event`))

    assert.equal("true", input.getAttribute(`aria-invalid`))
  })

  test(`inputValidationEventHandler: does nothing if data-pf-validation="skip"`, async() => {
    const input = await fixture(html`
      <input type="email" required data-pf-validation="skip">
    `)

    input.addEventListener(`test-event`, EventHandlers.inputValidationEventHandler)

    input.dispatchEvent(new CustomEvent(`test-event`))

    assert.equal(false, input.hasAttribute(`aria-invalid`))
  })

  test(`focusoutValidationEventHandler: does nothing if no data-pf-validation="input"`, async() => {
    const input = await fixture(html`
      <input type="email" required>
    `)

    input.addEventListener(`test-event`, EventHandlers.focusoutValidationEventHandler)

    input.dispatchEvent(new CustomEvent(`test-event`))

    assert.equal(false, input.hasAttribute(`aria-invalid`))
  })

  test(`focusoutValidationEventHandler: fires if data-pf-validation="focusout"`, async() => {
    const input = await fixture(html`
      <input type="email" required data-pf-validation="focusout">
    `)

    input.addEventListener(`test-event`, EventHandlers.focusoutValidationEventHandler)

    input.dispatchEvent(new CustomEvent(`test-event`))

    assert.equal("true", input.getAttribute(`aria-invalid`))
  })

  test(`focusoutValidationEventHandler: does nothing if data-pf-validation="skip"`, async() => {
    const input = await fixture(html`
      <input type="email" required data-pf-validation="skip">
    `)

    input.addEventListener(`test-event`, EventHandlers.focusoutValidationEventHandler)

    input.dispatchEvent(new CustomEvent(`test-event`))

    assert.equal(false, input.hasAttribute(`aria-invalid`))
  })

  test(`validateFormSubmitEventHandler: marks the event as defaultPrevented if a form element is invalid`, async() => {
    const form = await fixture(html`
      <form>
        <input type="email" required>
        <button id="submit" type="submit">Submit</button>
      </form>
    `)

    form.addEventListener(`test-event`, EventHandlers.validateFormSubmitEventHandler)

    const formSubmissionAssertion = new Promise((resolve) => {
      form.addEventListener(`test-event`, (event) => {
        assert.equal(true, event.defaultPrevented)
        resolve()
      })
    })

    form.dispatchEvent(new CustomEvent(`test-event`, { bubbles: true, cancelable: true }))

    await formSubmissionAssertion
  })
})