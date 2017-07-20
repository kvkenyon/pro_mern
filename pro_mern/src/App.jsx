import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter,
  Route,
  Switch,
  Redirect }
from 'react-router-dom';

import IssueList from './IssueList';
import IssueEdit from './IssueEdit';

const contentNode = document.getElementById('contents');
const NoMatch = () => <p>Page Not Found.</p>;

const RoutedApp = () => (
  <HashRouter>
    <div>
      <Redirect from="/" to="/issues" />
      <Switch>
        <Route exact path="/issues" component={IssueList} />
        <Route path="/issues/:id" component={IssueEdit} />
        <Route component={NoMatch} />
      </Switch>
    </div>
  </HashRouter>
);
ReactDOM.render(<RoutedApp />, contentNode);

if (module.hot) {
  module.hot.accept();
}
