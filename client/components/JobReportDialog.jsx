import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';

export class JobReportDialog extends Component {
  static propTypes = {
    reportJobId: PropTypes.string,
    getJobReport: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    closeJobReport: PropTypes.func.isRequired,
    importErrors: PropTypes.array
  }

  componentWillMount() {
    this.props.getJobReport(this.props.reportJobId);
  }

  onClose = () => {
    this.props.closeJobReport();
  }

  renderError(reportItem) {
    const record = reportItem.toJS();
    return (
      <div>
        <div>{`User ${record.user.email || record.user.name || record.user.user_id}:`}</div>
        <ul>
          {record.errors.map(error => <li>{error.message}</li>)}
        </ul>
      </div>
    )
  }

  render() {
    const { loading, error, reportJobId, importErrors } = this.props;

    if (loading) {
      return <div />;
    }

    if (error) {
      return (
        <div>
          <div className="report">
            <div className="spanTitle"><span className="username-text">{reportJobId}</span></div>
            <div>
              {error}
            </div>
            <Button bsStyle="default" bsSize="xsmall" onClick={this.onClose}>
              <i className="icon icon-budicon-260" /> Close
            </Button>
          </div>
        </div>
      );
    }

    if (!importErrors || !importErrors.size) {
      return (
        <div>
          <div className="report">
            <div className="spanTitle"><span className="username-text">{reportJobId}</span></div>
            <div>
              No errors.
            </div>
            <Button bsStyle="default" bsSize="xsmall" onClick={this.onClose}>
              <i className="icon icon-budicon-260" /> Close
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="report">
          <div className="spanTitle"><span className="username-text">{reportJobId}</span></div>
          <div>
            {importErrors.map(this.renderError)}
          </div>
          <Button bsStyle="default" bsSize="xsmall" onClick={this.onClose}>
            <i className="icon icon-budicon-260" /> Close
          </Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    importErrors: state.report.get('importErrors'),
    loading: state.report.get('loading'),
    error: state.report.get('error')
  };
}

export default connect(mapStateToProps)(JobReportDialog);

