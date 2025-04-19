export function cloneNodesObserver(sourceElement, targetElement) {
  // Options for the observer (which mutations to observe)
  const config = { childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        targetElement.replaceWith(sourceElement.cloneNode(true))
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(sourceElement, config)

  return observer
}
