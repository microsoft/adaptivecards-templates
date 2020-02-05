import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { createStore } from "redux";
import { rootReducer } from "../../store/rootReducer";
import AdaptiveCardPanel from "./AdaptiveCardPanel";

it("Renders without crashing", () => {
  const div = document.createElement("div");
  const store = createStore(rootReducer, {});
  ReactDOM.render(
    <Provider store={store}>
      <AdaptiveCardPanel toggleModal={() => { }} />
    </Provider>,
    div
  );

  ReactDOM.unmountComponentAtNode(div);
});
