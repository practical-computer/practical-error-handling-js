import { html, fixture, assert } from '@open-wc/testing';

import * as ErrorMapping from '@practical-computer/error-handling/error-mapping'


suite('Error Mapping', async () => {
  test(`applyErrorMappingToForm`, async () => {
    const container = await fixture(html`
      <div>
        <form id="test-form" aria-describedby='test-form-error-container'>
          <input type="email" id="email-field" aria-describedby="email-field-errors">
          <section id="email-field-errors" data-error-container>
            <ul>
              <li data-visible data-error-type="error_1">ad-hoc error message 1</li>
            </ul>
          </section>

          <input type="email" id="confirm-email-field" aria-describedby="confirm-email-field-errors">
          <section id="confirm-email-field-errors" data-error-container>
            <ul>
              <li data-visible data-error-type="error_1">ad-hoc error message 1</li>
              <li data-visible data-preserve data-error-type="unconfirmed_error">Unconfirmed error</li>
            </ul>
          </section>


          <input type="text" id="name-field" aria-describedby="bad-element-id">
          <input type="text" id="username-field">

          <textarea id="comments-field" aria-describedby="comments-field-errors" required></textarea>
          <section id="comments-field-errors" data-error-container>
            <ul>
              <li data-visible data-error-type="error_1">ad-hoc error message 1</li>
            </ul>
          </section>

          <rich-text-editor aria-describedby='rich-text-editor-error-container'>
            A custom rich text editor
          </rich-text-editor>

          <section id="rich-text-editor-error-container" data-error-container>
            <ul></ul>
          </section>

          <section id="test-form-error-container" data-error-container>
            <ul>
              <li data-visible data-error-type="error_2">ad-hoc error message 2</li>
              <li data-visible data-error-type="preserve_error_1" data-preserve>Preserved message</li>
              <li data-error-type="preserve_error_2" data-preserve>Preserved message</li>
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
      {
        container_id: 'test-form-error-container',
        element_to_invalidate_id: 'test-form',
        type: `preserve_error_2`,
        message: "New Content for preserved message"
      },
      {
        container_id: 'bad-element-id',
        element_to_invalidate_id: 'name-field',
        type: `ad_hoc_server_error_2`,
        message: "Ad-hoc server error 2"
      },
      {
        container_id: 'username-field-error-container',
        element_to_invalidate_id: 'user-name-field',
        type: `ad_hoc_server_error_3`,
        message: "Ad-hoc server error 3"
      },
      {
        container_id: 'rich-text-editor-error-container',
        element_to_invalidate_id: 'rich-text-editor',
        type: `ad_hoc_server_error_4`,
        message: "Ad-hoc server error 4"
      },
      {
        container_id: `email-field-errors`,
        element_to_invalidate_id: `email-field`,
        type: `ad_hoc_server_error_5`,
        message: "Ad-hoc server error 5"
      },
      {
        container_id: `confirm-email-field-errors`,
        element_to_invalidate_id: `confirm-email-field`,
        type: `ad_hoc_server_error_6`,
        message: "Ad-hoc server error 6"
      },
      {
        container_id: `confirm-email-field-errors`,
        element_to_invalidate_id: `confirm-email-field`,
        type: `unconfirmed_error`,
        message: "Please confirm"
      },
    ]

    const form = container.querySelector(`form`)

    ErrorMapping.applyErrorMappingToForm(form, errors)

    assert.equal(4, document.getElementById(`test-form-error-container`).querySelectorAll(`[data-error-type][data-visible]`).length)
    assert.equal(
      "‼️ Ad-hoc server error 1",
      document.getElementById(`test-form-error-container`).querySelector(`[data-visible][data-error-type="ad_hoc_server_error_1"]`).textContent
    )

    assert.equal(
      "‼️ New Content for preserved message",
      document.getElementById(`test-form-error-container`).querySelector(`[data-visible][data-error-type="preserve_error_2"]`).textContent
    )

    assert.equal(
      "‼️ Ad-hoc server error 2",
      document.getElementById(`test-form-error-container`).querySelector(`[data-visible][data-error-type="ad_hoc_server_error_2"]`).textContent
    )

    assert.equal(
      "‼️ Ad-hoc server error 3",
      document.getElementById(`test-form-error-container`).querySelector(`[data-visible][data-error-type="ad_hoc_server_error_3"]`).textContent
    )

    assert.equal(1, document.getElementById(`rich-text-editor-error-container`).querySelectorAll(`[data-error-type][data-visible]`).length)
    assert.equal(
      "‼️ Ad-hoc server error 4",
      document.getElementById(`rich-text-editor-error-container`).querySelector(`[data-visible][data-error-type="ad_hoc_server_error_4"]`).textContent
    )

    assert.equal(1, document.getElementById(`email-field-errors`).querySelectorAll(`[data-error-type][data-visible]`).length)
    assert.equal(
      "‼️ Ad-hoc server error 5",
      document.getElementById(`email-field-errors`).querySelector(`[data-visible][data-error-type="ad_hoc_server_error_5"]`).textContent
    )

    assert.equal(2, document.getElementById(`confirm-email-field-errors`).querySelectorAll(`[data-error-type][data-visible]`).length)
    assert.equal(
      "‼️ Ad-hoc server error 6",
      document.getElementById(`confirm-email-field-errors`).querySelector(`[data-visible][data-error-type="ad_hoc_server_error_6"]`).textContent
    )

    assert.equal(
      "‼️ Please confirm",
      document.getElementById(`confirm-email-field-errors`).querySelector(`[data-visible][data-error-type="unconfirmed_error"]`).textContent
    )
  })
})