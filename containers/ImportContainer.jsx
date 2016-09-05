import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';

import { ImportFiles, ImportDropFiles } from '../components';
import { connectionActions, importActions } from '../actions';
import { Error, LoadingPanel } from '../components/Dashboard';

export class ImportContainer extends Component {
  componentWillMount() {
    this.props.fetchConnections();
    this.probeInterval = setInterval(this.props.probeImportStatus, 5000);
  }

  componentWillUnmount = () => {
    if (this.probeInterval) {
      clearInterval(this.probeInterval);
    }
  }

  onDrop = (newFiles) => {
    this.props.handleFileDrop(this.props.files.toJS(), newFiles);
  }

  uploadFile = () => {
    this.props.importUsers(this.props.files, this.refs.connectionId.value);
  }

  renderConnectionChooser() {
    const connections = this.props.connections;
    return (
      <label>
        <select defaultValue="" name="connection_id" ref="connectionId" className="form-control"
          style={{ width: '300px', marginLeft: '5px', display: 'inline-block', maxWidth: '300px' }}
        >
          <option value="" disabled>Please select a database connection</option>
          {connections.map((conn, index) =>
            <option key={index} value={conn.get('id')}>{conn.get('name')}</option>
          )}
        </select>
      </label>
    );
  }

  render() {
    const { error, validationErrors, loading, files, currentJob } = this.props;
    return (
      <div>
        <ImportDropFiles onDrop={this.onDrop} />
        <div className="row">
          <div className="col-xs-12">
            {this.renderConnectionChooser()}
            <ButtonToolbar className="pull-right">
              <Button bsStyle="primary" disabled={currentJob !== null} bsSize="xsmall" onClick={this.uploadFile}>
                <i className="icon icon-budicon-337"></i> Start Importing Users
              </Button>
              <Button bsStyle="default" disabled={currentJob !== null} bsSize="xsmall" onClick={this.props.clearForm}>
                <i className="icon icon-budicon-263"></i> Clear
              </Button>
            </ButtonToolbar>
          </div>
        </div>

        <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <Error message={error} errors={validationErrors} onDismiss={this.props.dismissError} />
          <ImportFiles files={files} onRemoveFile={this.props.removeFile} />
        </LoadingPanel>
      </div>
    );
  }
}

ImportContainer.propTypes = {
  files: PropTypes.object.isRequired,
  connections: PropTypes.object.isRequired,
  probeImportStatus: PropTypes.func.isRequired,
  handleFileDrop: PropTypes.func.isRequired,
  importUsers: PropTypes.func.isRequired,
  clearForm: PropTypes.func.isRequired,
  fetchConnections: PropTypes.func.isRequired,
  dismissError: PropTypes.func.isRequired,
  removeFile: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    connections: state.connection.get('records'),
    files: state.import.get('files'),
    currentJob: state.import.get('currentJob'),
    error: state.import.get('error'),
    validationErrors: state.import.get('validationErrors')
  };
}

export default connect(mapStateToProps, { ...connectionActions, ...importActions })(ImportContainer);
