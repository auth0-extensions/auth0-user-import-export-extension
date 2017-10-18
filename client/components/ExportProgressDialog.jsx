import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { Error, Confirm } from '../components/Dashboard';

class ExportProgressDialog extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.export !== this.props.export;
  }

  render() {
    const data = this.props.export.toJS();
    const percentage = data.process.current;

    let title = `Exporting... ${data.process.current}%`;
    if (percentage === 100) {
      title = 'Done!';
    }

    const onDownload = data.process.complete ? this.props.onDownload : null;

    return (
      <Confirm confirmMessage={'Download'} size="large" title={title} show={data.process.started} loading={false} onCancel={this.props.onClose} onConfirm={onDownload}>
        <ProgressBar active={percentage !== 100} now={percentage} label={`${percentage}%`} />
        <Error message={data.process.error} />
      </Confirm>
    );
  }
}

ExportProgressDialog.propTypes = {
  export: React.PropTypes.object.isRequired,
  onDownload: React.PropTypes.func.isRequired,
  onClose: React.PropTypes.func.isRequired
};

export default ExportProgressDialog;
