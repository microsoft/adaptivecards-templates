import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from '../../store/rootReducer';

import SideBar from './SideBar';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  const store = createStore(rootReducer, {});
  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <SideBar authButtonMethod={() => { }} />
      </Router>
    </Provider>, div);

  ReactDOM.unmountComponentAtNode(div);
});
