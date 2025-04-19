import { html, fixture, assert } from '@open-wc/testing';

import * as RequestProcessing from '@practical-computer/error-handling/request-processing'


suite('Request Processing', async () => {
  test(`does nothing if the response status != 422`, async () => {
    const container = await fixture(html`
      <div>
        <form id="test-form" aria-describedby='test-form-error-container'>
          <input type="email" id="email-field" aria-describedby="email-field-errors">
          <section id="email-field-errors" data-error-container>
            <ul>
              <li data-visible data-error-type="error_1">ad-hoc error message 1</li>
            </ul>
          </section>

          <section id="test-form-error-container" data-error-container>
            <ul>
              <li data-visible data-error-type="error_2">ad-hoc error message 2</li>
            </ul>
          </section>
        </form>
        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-error-message></span></li>
        </template>

      </div>
    `)

    const errors = [
      {
        container_id: 'test-form-error-container',
        element_to_invalidate_id: 'test-form',
        type: `ad_hoc_server_error_1`,
        message: "Ad-hoc server error 1"
      },
    ]

    const form = container.querySelector(`form`)

    assert.equal(2, form.querySelectorAll(`[data-error-type]`).length)

    const response = new Response(JSON.stringify(errors), {status: 400})

    await RequestProcessing.applyErrorMappingToFormFromUnprocessableEntityResponseResponse(form, response)

    assert.equal(2, form.querySelectorAll(`[data-error-type]`).length)
  })

  test(`applies the errors from the resonse (JSON) if response status == 422`, async () => {
    const container = await fixture(html`
      <div>
        <form id="test-form" aria-describedby='test-form-error-container'>
          <input type="email" id="email-field" aria-describedby="email-field-errors">
          <section id="email-field-errors" data-error-container>
            <ul>
              <li data-visible data-error-type="error_1">ad-hoc error message 1</li>
            </ul>
          </section>

          <section id="test-form-error-container" data-error-container>
            <ul>
              <li data-visible data-error-type="error_2">ad-hoc error message 2</li>
            </ul>
          </section>
        </form>
        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-error-message></span></li>
        </template>

      </div>
    `)

    const errors = [
      {
        container_id: 'test-form-error-container',
        element_to_invalidate_id: 'test-form',
        type: `ad_hoc_server_error_1`,
        message: "Ad-hoc server error 1"
      },
    ]

    const form = container.querySelector(`form`)

    assert.equal(2, form.querySelectorAll(`[data-error-type]`).length)

    const response = new Response(JSON.stringify(errors), {status: 422})

    await RequestProcessing.applyErrorMappingToFormFromUnprocessableEntityResponseResponse(form, response)

    assert.equal(1, form.querySelectorAll(`[data-error-type]`).length)
    assert.equal(1, form.querySelectorAll(`[data-error-type][data-error-type="ad_hoc_server_error_1"]`).length)
  })
})