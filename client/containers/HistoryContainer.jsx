import React, { PropTypes, Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import connectContainer from 'redux-static';
import { Error, LoadingPanel } from 'auth0-extension-ui';

import { historyActions, importActions, exportActions } from '../actions';

import { HistoryTable, JobReportDialog } from '../components';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    history: state.history,
    reportJobId: state.report.get('reportJobId')
  });

  static actionsToProps = {
    ...historyActions,
    ...importActions,
    ...exportActions
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    fetchJobs: PropTypes.func.isRequired,
    checkJobStatus: PropTypes.func.isRequired,
    getJobReport: PropTypes.func.isRequired,
    openJobReport: PropTypes.func.isRequired,
    closeJobReport: PropTypes.func.isRequired,
    getImportErrors: PropTypes.func,
    reportJobId: PropTypes.string
  }

  checkStatus = (type, id) => {
    this.props.checkJobStatus(id);
  };

  downloadUsers = (id) => {
    this.props.checkJobStatus(id, true);
  };

  componentWillMount() {
    this.props.fetchJobs();
  }

  render() {
    const { error, records, loading } = this.props.history.toJS();

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
              <HistoryTable
                error={error}
                records={records}
                showDialog={this.props.openJobReport}
                checkStatus={this.checkStatus}
                downloadUsers={this.downloadUsers}
              />
              {this.props.reportJobId === null ? ''
                : <JobReportDialog
                  reportJobId={this.props.reportJobId}
                  getJobReport={this.props.getJobReport}
                  closeJobReport={this.props.closeJobReport}
                />}
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
});
