import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import * as containers from './containers';
import { RequireAuthentication } from './containers/RequireAuthentication';

export default history =>
  <Router history={history}>
    <Route path="/" component={RequireAuthentication(containers.App)}>
      <IndexRoute component={containers.ImportContainer} />
      <Route path="export" component={containers.ExportContainer} />
      <Route path="import" component={containers.ImportContainer} />
    </Route>
  </Router>;
