import React from 'react';
import { Router, Route, IndexRedirect } from 'react-router';

import * as containers from './containers';
import { RequireAuthentication } from './containers/RequireAuthentication';

export default (history) =>
  <Router history={history}>
    <Route path="/" component={RequireAuthentication(containers.App)}>
      <IndexRedirect to="/import" />
      <Route path="export" component={containers.ExportContainer} />
      <Route path="import" component={containers.ImportContainer} />
    </Route>
  </Router>;
