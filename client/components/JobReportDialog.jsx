import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';

export class JobReportDialog extends Component {
  static propTypes = {
    reportJobId: PropTypes.string,
    getJobReport: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    closeJobReport: PropTypes.func.isRequired,
    importErrors: PropTypes.object
  }

  componentWillMount() {
    this.props.getJobReport(this.props.reportJobId);
  }

  onClose = () => {
    this.props.closeJobReport();
  }

  renderErrors(reportItems) {
    if (reportItems && reportItems.size) {
      const items = reportItems.toJS();
      return (
        <pre>
          {items.map(record =>
            ` Unable to import user "${record.user.email || record.user.name || record.user.user_id}":
            ${record.errors.map(error => '\t' + error.message + '\n')}\n`
          )}
        </pre>
      );
    }

    if (this.props.loading) {
      return (
        <pre>
        </pre>
      );
    }

    if (this.props.error) {
      return (
        <pre>
          {this.props.error}
        </pre>
      );
    }

    return <div className="report-success">Job was completed successfully.</div>;
  }

  render() {
    const { reportJobId, importErrors } = this.props;

    return (
      <Modal dialogClassName="job-report-dialog" show={reportJobId !== null} onHide={this.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Job {reportJobId} Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderErrors(importErrors)}
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <Button bsSize="small" onClick={this.onClose}>
              <i className="icon icon-budicon-501"></i> Close
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
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

