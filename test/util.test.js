import { html, fixture, assert } from '@open-wc/testing';

import * as Utils from '@practical-computer/error-handling/utils'

suite('Utility functions', async () => {
  test(`cloneNodesObserver`, async () => {
    const container = await fixture(html`
      <div>
        <section id="source-container">
          <ul></ul>
        </section>

        <section id="target-container">
          <ul></ul>
        </section>
      </div>
    `)

    const sourceContainer = document.getElementById(`source-container`)
    const targetContainer = document.getElementById(`target-container`)

    const sourceElement = sourceContainer.querySelector(`:scope > ul`)
    const targetElement = targetContainer.querySelector(`:scope > ul`)

    const observer = await Utils.cloneNodesObserver(sourceElement, targetElement)

    await new Promise((resolve) => {
      const testChangeObserver = new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) {
          if (mutation.type === "childList" && targetContainer.querySelectorAll(`li`).length == 2) {
            resolve()
          }
        }
      })

      const testObserver = testChangeObserver.observe(sourceElement, {
        childList: true, subtree: true
      })

      const item_1 = document.createElement(`li`)
      item_1.textContent = "A new element"

      sourceElement.appendChild(item_1)

      const item_2 = document.createElement(`li`)
      item_2.textContent = "Another new element"

      sourceElement.appendChild(item_2)
    })
  })
})