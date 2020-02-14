import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from "react-redux";
import { rootReducer } from "../../store/rootReducer";
import Gallery from "./Gallery";

it("Renders without crashing", () => {
  const div = document.createElement("div");
  const store = createStore(rootReducer, applyMiddleware(thunk));
  ReactDOM.render(
    <Provider store={store}>
      <Gallery onClick={() => { }} />
    </Provider>,
    div
  );




  ReactDOM.unmountComponentAtNode(div);
});
