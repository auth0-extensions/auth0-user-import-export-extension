import React, { PropTypes, Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import connectContainer from 'redux-static';
import { Error, LoadingPanel } from 'auth0-extension-ui';

import { historyActions, importActions, exportActions } from '../actions';

import HistoryTable from '../components/HistoryTable';
import HistoryDialog from '../components/HistoryDialog';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    history: state.history
  });

  static actionsToProps = {
    ...historyActions,
    ...importActions,
    ...exportActions
  }

  static propTypes = {
    history: PropTypes.array.isRequired,
    fetchJobs: PropTypes.func.isRequired,
    checkJob: PropTypes.func.isRequired,
    downloadUsersToFile: PropTypes.func.isRequired,
    getImportErrors: PropTypes.func.isRequired,
    openDialog: PropTypes.func.isRequired,
    closeDialog: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchJobs();
  }

  render() {
    const { error, records, loading, activeRecord } = this.props.history.toJS();

    return (
      <div>
        <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <div className="row">
            <div className="col-xs-12">
              <ButtonToolbar className="pull-right">
                <Button bsSize="small" className="btn-default" onClick={this.props.fetchJobs}>
                  <i className="icon icon-budicon-257" /> Reload
                </Button>
              </ButtonToolbar>
            </div>
            <div className="col-xs-12">
              <Error message={error} />
              <HistoryTable error={error} records={records} showDialog={this.props.openDialog} checkStatus={this.props.checkJob} downloadUsers={this.props.downloadUsersToFile} />
              <HistoryDialog deployment={activeRecord} onClose={this.props.closeDialog} />
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
});
