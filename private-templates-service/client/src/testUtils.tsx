import React from 'react';
import { mount } from 'enzyme';
import { mergeDeepRight } from 'ramda';


import { rootReducer } from './store/rootReducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';


export const makeMountRender = (Component: any, defaultProps = {}) => {
  return (customProps = {}) => {
    const props = {
      ...defaultProps,
      ...customProps
    };
    return mount(<Component {...props} />);
  };
};

export const makeStore = (customState = {}) => {
  return createStore(rootReducer, customState);
}

export const reduxify = (Component: any, props = {}, state = {}) => {
  return function reduxWrap() {
    return (
      <Provider store={makeStore(state)}>
        <Component {...props} />
      </Provider>
    );
  }
}
