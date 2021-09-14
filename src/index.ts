import warning from "./warning";

//
const bindStateToSelector = (prevKey, selector) => (state, ...args) => {
  const targetState = prevKey !== null ? state[prevKey] : state;
  return selector(targetState, ...args);
};

// eslint-disable-next-line no-underscore-dangle
const __combineSelectors = (selectors, prevKey = null) => {
  return Object.keys(selectors).reduce((finalSelectors, selectorKey) => {
    const selector = selectors[selectorKey];

    if (process.env.NODE_ENV !== "production") {
      if (typeof selector === "undefined") {
        warning(`No selector provided for key "${selectorKey}"`);
      }
    }

    if (typeof selector === "function") {
      return {
        ...finalSelectors,
        [selectorKey]: bindStateToSelector(prevKey, selector),
      };
    }

    return {
      ...finalSelectors,
      [selectorKey]: __combineSelectors(selector, prevKey || selectorKey),
    };
  }, {});
};

// eslint-disable-next-line import/prefer-default-export
export const combineSelectors = (modules) => {
  return __combineSelectors(modules);
};
