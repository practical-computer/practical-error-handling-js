import { html, fixture, assert } from '@open-wc/testing';

import {FieldsetValidationElement} from '@practical-computer/error-handling/fieldset/fieldset-validation-element'

class CustomFieldsetValidationElement extends FieldsetValidationElement {
  get customProperty() {
    return "hello"
  }
}

if (!window.customElements.get('custom-fieldset-validation')) {
  window.customElements.define('custom-fieldset-validation', CustomFieldsetValidationElement);
}

suite('ErrorHandlingElement', async () => {
  test(`can subclassed`, async() => {
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

            <custom-fieldset-validation fieldset="terms-fieldset" field-name="terms" error-container-aria="terms-fieldset-errors-aria">
              <input type="checkbox" name="privacy" required>
              <input type="checkbox" name="service" required>
            </custom-fieldset-validation>

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

    const element = container.querySelector(`custom-fieldset-validation`)

    assert.equal(`terms`, element.fieldName)
    assert.equal(`test-form`, element.form.id)
    assert.equal(`terms-fieldset`, element.fieldset.id)
    assert.equal(`terms-fieldset-errors`, element.errorContainer.id)
    assert.equal(`terms-fieldset-errors-aria`, element.errorContainerARIA.id)
    assert.equal(`hello`, element.customProperty)
  })
})