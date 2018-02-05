import { Router, Route, IndexRoute } from 'react-router';

import * as containers from './containers';

export default history =>
  <Router history={history}>
    <Route path="/" component={containers.App}>
      <IndexRoute component={containers.ImportContainer} />
      <Route path="history" component={containers.HistoryContainer} />
      <Route path="export" component={containers.ExportContainer} />
      <Route path="import" component={containers.ImportContainer} />
    </Route>
  </Router>;
