import React from 'react';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from "history";
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './store/rootReducer';

import './index.css';
import App from './App';

const browserHistory = createBrowserHistory({ basename: process.env.REACT_APP_ACMS_APP_NAME });
var reactPlugin = new ReactPlugin();
var appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: process.env.REACT_APP_ACMS_APP_INSIGHTS_INSTRUMENTATION_KEY,
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: { history: browserHistory }
    }
  }
});
appInsights.loadAppInsights();

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
