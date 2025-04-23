import { html, fixture, assert } from '@open-wc/testing';

import '@practical-computer/error-handling/pf-error-handling-element'

suite('pf-error-handling', async () => {
  test(`can be used on its own`, async() => {
    const container = await fixture(html`
      <div>
        <pf-error-handling>
          <form id="test-form" aria-describedby='test-form-error-container'>
            <input type="email" id="email-field" aria-describedby="email-field-errors">
            <section id="email-field-errors" data-pf-error-container>
              <ul>
                <li data-pf-error-visible data-pf-error-type="error_1">ad-hoc error message 1</li>
              </ul>
            </section>

            <section id="test-form-error-container" data-pf-error-container>
              <ul>
                <li data-pf-error-visible data-pf-error-type="error_2">ad-hoc error message 2</li>
              </ul>
            </section>
          </form>
        </pf-error-handling>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-pf-error-message></span></li>
        </template>
      </div>
    `)

    const element = container.querySelector(`pf-error-handling`)

    assert.equal(`test-form`, element.form.id)
    assert.equal(true, element.form.hasAttribute(`novalidate`))
  })
})