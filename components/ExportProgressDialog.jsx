import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { Error, Confirm } from '../components/Dashboard';

class ExportProgressDialog extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.export !== this.props.export;
  }

  render() {
    const data = this.props.export.toJS();
    let percentage = 0;
    if (data.query.size) {
      percentage = Math.round((data.process.current / data.query.size) * 100);
    }

    let title = `Exporting ${data.query.size} Users`;
    if (percentage === 100) {
      title = `Exported ${data.query.size} Users`;
    }

    return (
      <Confirm confirmMessage={'Close'} size="large" title={title} show={data.process.started} loading={process.started} onCancel={() => {}} onConfirm={() => {}}>
         <ProgressBar active={percentage !== 100} now={percentage} label={`${data.process.current} of ${data.query.size}`} />
      </Confirm>
    );
  }
}

ExportProgressDialog.propTypes = {
  export: React.PropTypes.object.isRequired,
  onConfirm: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onReset: React.PropTypes.func.isRequired,
  onSearch: React.PropTypes.func.isRequired,
  onSelectUser: React.PropTypes.func.isRequired,
  onUnselectUser: React.PropTypes.func.isRequired
};

export default ExportProgressDialog;
