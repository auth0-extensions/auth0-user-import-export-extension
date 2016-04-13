import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Button, ButtonToolbar, Tabs, Tab } from 'react-bootstrap';
import Dropzone from 'react-dropzone';

import { connectionActions, importActions } from '../actions';
import { Error, LoadingPanel, Table, TableCell, TableAction, TableBody, TableIconCell, TableTextCell, TableHeader, TableColumn, TableRow } from '../components/Dashboard';

export default class ImportContainer extends Component {
  constructor() {
    super();

    this.onDrop = this.onDrop.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.dismissError = this.dismissError.bind(this);
  }

  componentWillMount() {
    this.props.fetchConnections();
    setInterval(() => {
      this.props.probeImportStatus()
    }, 5000);
  }

  onDrop(newFiles) {
    this.props.handleFileDrop(this.props.files, newFiles);
  }

  uploadFile() {
    let formData = new FormData();
    let nextJobIndex = -1;
    formData.users = null;
    for (let i = 0; i < this.props.files.length; i++) {
      if (this.props.files.get(i).status === 'pending') {
        formData.users = this.props.files.get(i);
        nextJobIndex = i;
      }
    }
    formData.connection_id = $('#connection-id').val();

    if (formData.users) {
      var fileReader = new FileReader();
      fileReader.addEventListener('load', (event) => {
        formData.users = event.currentTarget.result;
        this.props.importUsers(formData, nextJobIndex);
      });
      fileReader.readAsText(formData.users);
    } else {
      this.props.importUsers(formData, nextJobIndex);
    }
  }

  clearForm() {
    this.props.clearForm();
  }

  removeFile(files, index) {
    this.props.removeFile(files, index);
  }

  dismissError() {
    this.props.dismissError();
  }

  renderFiles(error, loading, files) {
    let status = {'pending': 'Pending', 'failed': 'Failed (see email)', 'completed': 'Completed'};
    let colors = {'pending': 'orange', 'failed': 'red', 'completed': 'green'};

    return (
      <Table>
        <TableHeader>
          <TableColumn width="70%">File name</TableColumn>
          <TableColumn width="25%">Import Status</TableColumn>
          <TableColumn width="5%" />
        </TableHeader>
        <TableBody>
        {files.map((file, index) =>
          <TableRow key={index}>
            <TableTextCell>{file.name}</TableTextCell>
            <TableTextCell>
              <span style={{ color: colors[file.status] }}>
                {status[file.status]}
              </span>
            </TableTextCell>
            <TableCell>
              <TableAction id={`remove-column-${index}`}
                type="success" title="Remove" icon="263"
                onClick={ () => this.removeFile(files, index) }
              />
            </TableCell>
          </TableRow>
        )}
        </TableBody>
      </Table>
    );
  }

  renderConnectionChooser() {
    const connections = this.props.connections;
    return <label>
      <select defaultValue="" name='connection_id' id='connection-id' className='form-control' style={{ width: '300px', marginLeft: '5px', display: 'inline-block', maxWidth: '300px' }}>
        <option value="" disabled>Please select a database connection</option>
      {connections.map((conn, index) =>
        <option value={conn.get('id')}>{conn.get('name')}</option>
      )}
      </select>
    </label>
  }

  render() {
    const { error, validationErrors, loading, files } = this.props;

    // dropzone will overwrite this if we don't use a style attribute
    const dropzoneStyle = {
      width: '100%',
      height: '200px',
      padding: '65px 20px 20px 20px',
      marginBottom: '20px',
      border: '2px dashed rgb(211, 211, 211)',
      borderRadius: '5px',
      fontSize: '28px',
      color: 'grey',
      textAlign: 'center'
    };

    return (
      <div>
        <Dropzone onDrop={this.onDrop} multiple={false} disablePreview={true} style={dropzoneStyle}>
          <div>Drop your file here, or click to select.</div>
        </Dropzone>

        <div className="row">
          <div className="col-xs-12">
            {this.renderConnectionChooser()}
            <ButtonToolbar className="pull-right">
              <Button bsStyle="primary" bsSize="xsmall" onClick={this.uploadFile} disabled={loading}>
                <i className="icon icon-budicon-337"></i> Start Importing Users
              </Button>
              <Button bsStyle="default" bsSize="xsmall" onClick={this.clearForm} disabled={loading}>
                <i className="icon icon-budicon-263"></i> Clear
              </Button>
            </ButtonToolbar>
          </div>
        </div>

        <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <Error message={error} errors={validationErrors} onDismiss={this.dismissError} />
          {this.renderFiles(error, loading, files)}
        </LoadingPanel>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    connections: state.connection.get('records'),
    files: state.import.get('files'),
    error: state.import.get('error'),
    validationErrors: state.import.get('validationErrors')
  };
}

export default connect(mapStateToProps, { ...connectionActions, ...importActions })(ImportContainer);
