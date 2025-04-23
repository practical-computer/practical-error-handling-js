import { html, fixture, assert } from '@open-wc/testing';

import * as EventHandlers from '@practical-computer/error-handling/event-handlers';

suite('Event Handlers', async () => {
  test(`liveInputValidationEventHandler: does nothing if no data-live-validation`, async() => {
    const input = await fixture(html`
      <input type="email" required>
    `)

    input.addEventListener(`test-event`, EventHandlers.liveInputValidationEventHandler)

    input.dispatchEvent(new CustomEvent(`test-event`))

    assert.equal(false, input.hasAttribute(`aria-invalid`))
  })

  test(`liveInputValidationEventHandler: fires if data-live-validation`, async() => {
    const input = await fixture(html`
      <input type="email" required data-live-validation>
    `)

    input.addEventListener(`test-event`, EventHandlers.liveInputValidationEventHandler)

    input.dispatchEvent(new CustomEvent(`test-event`))

    assert.equal("true", input.getAttribute(`aria-invalid`))
  })

  test(`liveInputValidationEventHandler: does nothing if data-live-validation but data-skip-validation`, async() => {
    const input = await fixture(html`
      <input type="email" required data-live-validation data-skip-validation>
    `)

    input.addEventListener(`test-event`, EventHandlers.liveInputValidationEventHandler)

    input.dispatchEvent(new CustomEvent(`test-event`))

    assert.equal(false, input.hasAttribute(`aria-invalid`))
  })

  test(`focusoutValidationEventHandler: does nothing if no data-focusout-validation`, async() => {
    const input = await fixture(html`
      <input type="email" required>
    `)

    input.addEventListener(`test-event`, EventHandlers.focusoutValidationEventHandler)

    input.dispatchEvent(new CustomEvent(`test-event`))

    assert.equal(false, input.hasAttribute(`aria-invalid`))
  })

  test(`focusoutValidationEventHandler: fires if data-focusout-validation-validation`, async() => {
    const input = await fixture(html`
      <input type="email" required data-focusout-validation>
    `)

    input.addEventListener(`test-event`, EventHandlers.focusoutValidationEventHandler)

    input.dispatchEvent(new CustomEvent(`test-event`))

    assert.equal("true", input.getAttribute(`aria-invalid`))
  })

  test(`focusoutValidationEventHandler: does nothing if data-focusout-validation but data-skip-validation`, async() => {
    const input = await fixture(html`
      <input type="email" required data-focusout-validation data-skip-validation>
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