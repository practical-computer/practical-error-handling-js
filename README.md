# Practical Error Handling

Error message handling that covers 99% of cases, through a mixture of restraint, extendability, and focus. It's also designed to make your error handling **accessible by default.**

## Example

Here's a basic example, adapted from the [demo page](https://github.com/practical-computer/practical-error-handling-js/blob/main/demo/index.html):

```js
import {ErrorHandlingElement} from "@practical-computer/error-handling/error-handling-element"
import {clearErrorListsInForm} from "@practical-computer/error-handling/rendering"
import {applyErrorMappingToForm} from "@practical-computer/error-handling/error-mapping"

// Defining my own custom element to wrap the form, to prevent submits and
// clear out the error lists in the form to indicate it was successful.
class CustomErrorHandleElement extends ErrorHandlingElement {
  connectedCallback() {
    super.connectedCallback()

    this.form.addEventListener(`submit`, this.handleFormSubmit)
  }

  handleFormSubmit(event){
    if(!event.defaultPrevented){
      event.preventDefault()
      clearErrorListsInForm(this.form)
      console.debug(event)
      document.getElementById(`easy-console`).value += "Submit successful\n"
    }
  }
}

if (!window.customElements.get('custom-error-handling')) {
  window.customElements.define('custom-error-handling', CustomErrorHandleElement);
}

// An example error map, which you could receive as the JSON response from a fetch
// request
const errors = [
  {
    container_id: "email-field-errors",
    element_to_invalidate_id: "email-field",
    message: "This email has been taken",
    type: "taken"
  },
  {
    container_id: "email-field-errors",
    element_to_invalidate_id: "email-field",
    message: "Email is too short (pulled from server messages)",
    type: "tooShort"
  },
  {
    container_id: "test-form-error-container",
    element_to_invalidate_id: "test-form",
    message: "General errors from the server-side",
    type: "general"
  },
  {
    container_id: "random-missing-field-errors",
    element_to_invalidate_id: "random-missing-field",
    message: "Error that will end up in the fallback section",
    type: "api_error"
  },
]

const applyErrorMappingButton = document.getElementById(`apply-error-mapping`)
const form = document.getElementById(`test-form`)

applyErrorMappingButton.addEventListener(`click`, (event) => {
  applyErrorMappingToForm(form, errors)
  document.getElementById(`easy-console`).value += "Applied error map\n"
})
```

```html
<body>
  <h1>Practical Error Handling Demo</h1>

  <custom-error-handling>
    <form id="test-form" aria-describedby='test-form-error-container'>
      <input type="email" id="email-field" aria-describedby="email-field-errors" minlength="4">
      <section id="email-field-errors" data-error-container>
        <ul>
          <li data-visible data-error-type="error_1">ad-hoc error message 1 <small>(rendered on initial load)</small></li>
          <li data-preserve data-error-type="tooShort">Custom Preserved Error: Must be at least 4 characters<small>(rendered on initial load)</small></li>
        </ul>
      </section>

      <section id="test-form-error-container" data-error-container>
        <h2>Form Errors</h2>
        <ul>
          <li data-visible data-error-type="error_2">ad-hoc error message 2 <small>(rendered on initial load)</small></li>
          <li data-visible data-preserve data-error-type="error_3">Preserved Error <small>(rendered on initial load)</small></li>
        </ul>
      </section>

      <button type="submit">Submit</button>
    </form>
  </custom-error-handling>

  <p>
    <button id="apply-error-mapping">Apply error mapping</button>
  </p>

  <textarea id="easy-console" readonly rows=20></textarea>

  <template id="pf-error-list-item-template">
    <li><span>‼️</span> <span data-error-message></span></li>
  </template>
</body>
```

## Installation

```
npm install @practical-computer/error-handling
```

Check [`package.json`](https://github.com/practical-computer/practical-error-handling-js/blob/main/package.json) for the list of exports.

Include the utility CSS for hiding/showing messages, or [copy/paste into your codebase](https://github.com/practical-computer/practical-error-handling-js/blob/main/css/util.css):

```scss
@import '@practical-computer/error-handling/css/util.css'
```

## Quick Guide

### Terms

The following terms are used for this package:

- **Input**: The field (native or custom!) that you want to render errors for and reflect its validation state.
- **Form**: The `form` itself!
- **Error list**: An `ul` of the errors that apply for a particular **input** or **Form**.
  - Likewise, you have **error list items**, which are the items in these lists.
- **Error container**: The element that contains the **error list**, either for a particular **input** or the overall **form**.
- **error mapping**: An array of `JSON` objects that describe the entire validation state of the current **form**. You'd often return them as the response from a `fetch` request (but you don't have to!)


### Data Attributes

The following data attributes are used by this package:

- Inputs
  - Validation Event Handling flags.  This package does not provide the validations, but does provide helper functions for checks if an event handler should proceed by checking the value of `data-validation`:
    - `data-validation="input"`: This input should use `input` validation
    - `data-validation="change"`: This input should use `change` validation
    - `data-validation="focusout"`: This input should use `focusout` validation
    - `data-validation="skip"`: This input should skip any validations
  - `data-initial-load-errors`: If present, this input has initial load errors, which should not be cleared out when reflecting the constraint validation for the initial load.
- `data-error-container`: Marks an element as an error container
- Error list items
  - `data-visible`: Marks that the error list item should be visible
  - `data-error-type`: The error type for this list item (eg: `tooShort`, or `some_custom_error_type`)
  - `data-preserve`: This error list item should not be removed when clearing the error list; useful for rendering custom error messages for default error types. *Just because an error is preserved does not mean it is visible*
- `data-error-message` Used in the error list item `template` element to indicate where an error message should be rendered in the markup as the `textContent`

### Marking an input as invalid

We use `aria-invalid="true"` to indicate that an input is invalid. This makes your markup accessible by default while not requiring you to tack on a bunch of extra attributes.

### Linking an `input` or `form` to an error container

To link an `input` or `form` to an error container, you:

- Add the error container's markup to the page, with a unique `id` and the `data-error-container` attribute
- Include that `id` in the `input`/`form`'s `aria-describedby`

We use the `aria-describedby` so that your markup is **accessible by default**. Since there can be [multiple elements that describe an element](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby#id_reference_list), You specify which one is the error container using `data-error-container`.

#### Example
```html
<form id="test-form" aria-describedby='test-form-error-container'>
  <input type="email" id="email-field" aria-describedby="email-field-errors" minlength="4">
  <section id="email-field-errors" data-error-container>
    <ul></ul>
  </section>

  <section id="test-form-error-container" data-error-container>
    <h2>Form Errors</h2>
    <ul></ul>
  </section>

  <button type="submit">Submit</button>
</form>
```

### Extending the custom elements

Since each application has different needs, the best way to utilize the custom elements that wrap around a form to provide event handlers is to subclass them to make your own versions:

```js
import { applyErrorMappingToFormFromUnprocessableEntityResponseResponse } from '@practical-computer/error-handling/request-processing'

class AppErrorHandlingElement extends ErrorHandlingElement {
  connectedCallback() {
    super.connectedCallback()

    this.addEventListener(`custom-fetch-library:request-error`, applyErrorMappingToFormFromUnprocessableEntityResponseResponse)

    this.form.addEventListener(`submit`, (event) => {
      if(!event.defaultPrevented){
        event.preventDefault()
        this.makeCustomFetchRequest(...)
      }
    })
  }
}

if (!window.customElements.get('app-error-handling')) {
  window.customElements.define('app-error-handling', ApplicationErrorHandlingElement);
}
````

### Handling the initial page load

- Render any error list items that should be visible on the initial page load with the `data-visible` attribute
- Mark the invalid inputs with:
  - `aria-invalid=true` 
  - `data-initial-load-errors`

To reflect any other errors that might be present from the Constraint Validation API, you can use the `reflectConstraintValidationForInitialLoad` method in `@practical-computer/error-handling/element-utilities`.

This method will skip any `form.elements` with blank values, or the `data-initial-load-errors` attribute.


### Server-side errors

Since the server is the source of truth for your application, you should **heavily** rely on it for validations. Make reuqests against the server to validate input, and have the form return a response with the status code of `422 Unprocessable Entity` and an error mapping JSON object (specified below).

The provided request processing functions expect a `422` response to indicate that the request has validation errors. It's an error, and the response's status code should reflect that.

### Using the basic request processing function

```js
import { applyErrorMappingToFormFromUnprocessableEntityResponseResponse } from '@practical-computer/error-handling/request-processing'

const response = fetch(...)
const form = // ...

applyErrorMappingToFormFromUnprocessableEntityResponseResponse(form, response)
````

#### Loading the Mrujs plugin

The [Mrujs](http://mrujs.netlify.app) plugin is a function that can be used as an event handler for the [`ajax:response:error` event](https://mrujs.netlify.app/references/ajax-lifecycle):

```js
import { unprocessableEntityResponseHandler } from '@practical-computer/error-handling/plugins/mrujs'
this.form.addEventListener('ajax:response:error', unprocessableEntityResponseHandler)
```

#### Error mapping specification

When returning error mappings, they need to have the following format:

```js
// An array, since this is the collection of errors for this pass of data entry
[
  {
    "container_id": "dom-id-without-#", // the ID of the error container you want to append this error message to
    "element_to_invalidate_id": "dom-id-without-#", // the ID of the input that should be marked as invalid
    "message": "The error message to render",
    "type": "error-type-key", //The identifier for what type of error this is
  },
  // ...
]
```

#### Why do the error containers need a list?

Error containers need a list because there can be multiple error messages that are relevant for this pass of data entry.

A single message is a list of one item! And we have so much power to style elements using CSS, that leaning into the semantics of `ul` is the way to go here. Plus, it helps make the error messages more accessible.

## Design Overview

The Practical Framework's approach to error handling has the following core tenets:

* Late validation is almost always better, since you don't want to bother someone until they're actually ready to submit data
* Minimal client-side error handling makes the most sense, because client-side validations should never be trusted on their own. Therefore, it's easier & less bug-prone to simply submit a request to the server, and have the server return any errors (since it's the source of truth in the end)
* If there are multiple errors, render them all under the field they're related to. If there's no specific field, render them at the end of the form.

### Reviewing the source

One of the best ways to understand this package is to glance at the source. It's a remarkably small library, with the ESM modules broken up by purpose.

### What `@practical-computer/error-handling` does

- Provides functions for retrieving:
  - The error container
  - Error list
  - Any preserved errors for a list (or for a specific `type` of error)
- Rendering helper functions, including:
  - Reflecting the current [`ValidityState`](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) of an element
  - Applyig the `data-` and ARIA attributes to mark an element as invalid, without going through the Constraint Validation API
  - Marking an error `type` as visible for an element
  - Creating a new error list item element
  - Clearing the error list for an element, or for an entire form.
- Premade event handlers to validate:
  - `submit` events
  - live input validation
  - focusout validation
- Prebuilt request processing functions, including a "plugin" event handler for [Mrujs](https://mrujs.netlify.app)
- A basic `ErrorHandlingElement` that you can subclass to make custom elements specific to your application
  - It can also be included as is by importing the `pf-error-handling` element
- The foundations to support `fieldset` validations, useful for cases like "at least one value must be checked."

#### Fully extendable

The package exports all of its functions so that you can directly use them in your application logic. And because it does not provide any custom validation logic you need to fight against, and relies on the [Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation), you have the entire toolbox of Javascript available to you.

The custom elements that are exported are also designed to be subclassed, because each application has a different networking stack and needs.

### What `@practical-computer/error-handling` does not do

Importantly, this package **does not** include the following by design:

#### Validation Logic

Validation is almost always application/framework dependent; and best served by you writing the validation logic.

#### Markup for rendering errors

You provide the markup, using ARIA attributes, a small set of `data-` attributes, and a `template` element. Fitting error messages into a design is *tough* and extremely context specific. We trust your judgement, and render the text and set the `data-visible` attributes in the places you put us to.

#### Automatic integrations/hooks/event handlers

Again, we don't know the full story about your frontend, so we're not going to make any assumptions. You `import` the things you need, extend the custom elements we provide, and have full control over where and how error handling occurs.

---

Only you know the needs of your application, so `@practical-computer/error-handling` defers to your expertise and stays in its lane.


### Progressively enhances

The Practical Error Handling approach allows you to render error messages through all variations of "ready":

- You can render error messages server-side as part of the page load or standard form submission, and they'll show up without any JS (thanks to the power of CSS!)
- When the app's JS fails, the basic attributes from the [Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation) can take over.
- Since it only uses the standard event handlers, and only triggers when you've explictly event handlers on the form/input, you can:
  - Add any custom logic that's needed
  - Seamlessly support `fetch`, AJAX, or whatever request mechanism you want to use


### Fieldset validation

This is a more advanced topic (that IMO can be handled better by server-side validations), but the package does ship with the foundations for validating an entire `fieldset`.

I would recommend reading [Part 3 of the Cloud Four guide](https://cloudfour.com/thinks/progressively-enhanced-form-validation-part-3-validating-a-checkbox-group/) for the context and explanation of this pattern, then check out:

- [`src/fieldset/fieldset-validation-element.js`](https://github.com/practical-computer/practical-error-handling-js/blob/main/src/fieldset/fieldset-validation-element.js)
- [`src/fieldset/minimum-field-values-fieldset-validation-element.js`](https://github.com/practical-computer/practical-error-handling-js/blob/main/src/fieldset/minimum-field-values-fieldset-validation-element.js)

## Acknowledgements

This package is heavily inspired by the work done by [Gerardo Rodriguez](https://github.com/gerardo-rodriguez) for Cloud Four. You can read the original 4-part guide here: https://cloudfour.com/thinks/progressively-enhanced-form-validation-part-1-html-and-css/