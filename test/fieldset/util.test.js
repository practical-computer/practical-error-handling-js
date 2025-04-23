import { html, fixture, assert } from '@open-wc/testing';

import * as EventUtils from '@practical-computer/error-handling/fieldset/util';

suite('Event Utils: isChangeEventForTarget', async () => {
  test(`event for target`, async() => {
    const container = await fixture(html`
      <div>
        <fieldset>
          <input type="checkbox">
        </fieldset>
      </div>
    `)

    const fieldset = container.querySelector(`fieldset`)
    const input = container.querySelector(`input`)

    await new Promise((resolve) => {
      fieldset.addEventListener(`change`, (event) => {
        if(EventUtils.isChangeEventForTarget(event)){
          resolve()
        }
      })

      fieldset.dispatchEvent(new Event(`change`, {bubbles: true}))
    })
  })

  test(`event not for target`, async() => {
    const container = await fixture(html`
      <div>
        <fieldset>
          <input type="checkbox">
        </fieldset>
      </div>
    `)

    const fieldset = container.querySelector(`fieldset`)
    const input = container.querySelector(`input`)

    await new Promise((resolve) => {
      fieldset.addEventListener(`change`, (event) => {
        if(!EventUtils.isChangeEventForTarget(event)){
          resolve()
        }
      })

      input.dispatchEvent(new Event(`change`, {bubbles: true}))
    })
  })
})

suite('Event Utils: isFocusEventInsideTarget', async () => {
  test(`relatedTarget inside currentTarget`, async() => {
    const container = await fixture(html`
      <div>
        <fieldset>
          <input type="checkbox">
          <button>Other focusable element</button>
        </fieldset>
      </div>
    `)

    const fieldset = container.querySelector(`fieldset`)
    const input = container.querySelector(`input`)
    const button = container.querySelector(`button`)

    await new Promise((resolve) => {
      fieldset.addEventListener(`focusout`, (event) => {
        if(EventUtils.isFocusEventInsideTarget(event)){
          resolve()
        }
      })

      fieldset.dispatchEvent(new FocusEvent(`focusout`, {bubbles: true, relatedTarget: button}))
    })
  })

  test(`relatedTarget outside currentTarget`, async() => {
    const container = await fixture(html`
      <div>
        <fieldset>
          <input type="checkbox">
        </fieldset>
        <button>Other focusable element</button>
      </div>
    `)

    const fieldset = container.querySelector(`fieldset`)
    const input = container.querySelector(`input`)
    const button = container.querySelector(`button`)

    await new Promise((resolve) => {
      fieldset.addEventListener(`focusout`, (event) => {
        if(!EventUtils.isFocusEventInsideTarget(event)){
          resolve()
        }
      })

      fieldset.dispatchEvent(new FocusEvent(`focusout`, {bubbles: true, relatedTarget: button}))
    })
  })
})

suite('Event Utils: skipFieldsetChangeEvent', async () => {
  test(`event for target`, async() => {
    const container = await fixture(html`
      <div>
        <fieldset>
          <input type="checkbox">
        </fieldset>
      </div>
    `)

    const fieldset = container.querySelector(`fieldset`)
    const input = container.querySelector(`input`)

    await new Promise((resolve) => {
      fieldset.addEventListener(`change`, (event) => {
        if(EventUtils.skipFieldsetChangeEvent(event)){
          resolve()
        }
      })

      fieldset.dispatchEvent(new Event(`change`, {bubbles: true}))
    })
  })

  test(`skips change validation`, async() => {
    const container = await fixture(html`
      <div>
        <fieldset>
          <input type="checkbox">
        </fieldset>
      </div>
    `)

    const fieldset = container.querySelector(`fieldset`)
    const input = container.querySelector(`input`)

    await new Promise((resolve) => {
      fieldset.addEventListener(`change`, (event) => {
        if(EventUtils.skipFieldsetChangeEvent(event)){
          resolve()
        }
      })

      input.dispatchEvent(new Event(`change`, {bubbles: true}))
    })
  })

  test(`skips validation`, async() => {
    const container = await fixture(html`
      <div>
        <fieldset data-pf-validation="skip">
          <input type="checkbox">
        </fieldset>
      </div>
    `)

    const fieldset = container.querySelector(`fieldset`)
    const input = container.querySelector(`input`)

    await new Promise((resolve) => {
      fieldset.addEventListener(`change`, (event) => {
        if(EventUtils.skipFieldsetChangeEvent(event)){
          resolve()
        }
      })

      input.dispatchEvent(new Event(`change`, {bubbles: true}))
    })
  })

  test(`follows through on change validation`, async() => {
    const container = await fixture(html`
      <div>
        <fieldset data-pf-validation="change">
          <input type="checkbox">
        </fieldset>
      </div>
    `)

    const fieldset = container.querySelector(`fieldset`)
    const input = container.querySelector(`input`)

    await new Promise((resolve) => {
      fieldset.addEventListener(`change`, (event) => {
        if(!EventUtils.skipFieldsetChangeEvent(event)){
          resolve()
        }
      })

      input.dispatchEvent(new Event(`change`, {bubbles: true}))
    })
  })
})

suite('Event Utils: skipFieldsetFocusoutEvent', async () => {
  test(`relatedTarget inside currentTarget`, async() => {
    const container = await fixture(html`
      <div>
        <fieldset>
          <input type="checkbox">
          <button>Other focusable element</button>
        </fieldset>
      </div>
    `)

    const fieldset = container.querySelector(`fieldset`)
    const input = container.querySelector(`input`)
    const button = container.querySelector(`button`)

    await new Promise((resolve) => {
      fieldset.addEventListener(`focusout`, (event) => {
        if(EventUtils.skipFieldsetFocusoutEvent(event)){
          resolve()
        }
      })

      fieldset.dispatchEvent(new FocusEvent(`focusout`, {bubbles: true, relatedTarget: button}))
    })
  })

  test(`skips focusout validation`, async() => {
    const container = await fixture(html`
      <div>
        <fieldset>
          <input type="checkbox">
        </fieldset>

        <button>Other focusable element</button>
      </div>
    `)

    const fieldset = container.querySelector(`fieldset`)
    const input = container.querySelector(`input`)
    const button = container.querySelector(`button`)

    await new Promise((resolve) => {
      fieldset.addEventListener(`focusout`, (event) => {
        if(EventUtils.skipFieldsetFocusoutEvent(event)){
          resolve()
        }
      })

      fieldset.dispatchEvent(new FocusEvent(`focusout`, {bubbles: true, relatedTarget: button}))
    })
  })

  test(`skips validation`, async() => {
    const container = await fixture(html`
      <div>
        <fieldset data-pf-validation="skip">
          <input type="checkbox">
        </fieldset>

        <button>Other focusable element</button>
      </div>
    `)

    const fieldset = container.querySelector(`fieldset`)
    const input = container.querySelector(`input`)
    const button = container.querySelector(`button`)

    await new Promise((resolve) => {
      fieldset.addEventListener(`focusout`, (event) => {
        if(EventUtils.skipFieldsetFocusoutEvent(event)){
          resolve()
        }
      })

      fieldset.dispatchEvent(new FocusEvent(`focusout`, {bubbles: true, relatedTarget: button}))
    })
  })

  test(`follows through on validation`, async() => {
    const container = await fixture(html`
      <div>
        <fieldset data-pf-validation="focusout">
          <input type="checkbox">
        </fieldset>

        <button>Other focusable element</button>
      </div>
    `)

    const fieldset = container.querySelector(`fieldset`)
    const input = container.querySelector(`input`)
    const button = container.querySelector(`button`)

    await new Promise((resolve) => {
      fieldset.addEventListener(`focusout`, (event) => {
        if(!EventUtils.skipFieldsetFocusoutEvent(event)){
          resolve()
        }
      })

      fieldset.dispatchEvent(new FocusEvent(`focusout`, {bubbles: true, relatedTarget: button}))
    })
  })
})