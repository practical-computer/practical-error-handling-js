import { html, fixture, assert } from '@open-wc/testing';

import {ErrorHandlingElement} from '@practical-computer/error-handling/error-handling-element'

class CustomErrorHandleElement extends ErrorHandlingElement {
  get customProperty() {
    return "hello"
  }
}

if (!window.customElements.get('custom-error-handling')) {
  window.customElements.define('custom-error-handling', CustomErrorHandleElement);
}

suite('ErrorHandlingElement', async () => {
  test(`can subclassed`, async() => {
    const container = await fixture(html`
      <div>
        <custom-error-handling>
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
        </custom-error-handling>

        <template id="pf-error-list-item-template">
          <li><span>‼️</span> <span data-error-message></span></li>
        </template>
      </div>
    `)

    const element = container.querySelector(`custom-error-handling`)

    assert.equal(`test-form`, element.form.id)
    assert.equal(true, element.form.hasAttribute(`novalidate`))
    assert.equal(`hello`, element.customProperty)
  })
})