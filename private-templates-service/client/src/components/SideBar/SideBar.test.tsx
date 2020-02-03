import React from 'react';
import ReactDOM from 'react-dom';

import { reduxify } from '../../testUtils';
import SideBar from './SideBar';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SideBar authButtonMethod={() => { }} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
