import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

import * as constants from '../constants';
import { connectionActions, exportActions } from '../actions';
import { ExportColumns, ExportSettings, ExportProgressDialog } from '../components';

export class ExportContainer extends Component {
  componentWillMount = () => {
    this.props.fetchConnections(true);
    this.props.getUserCount();
  }

  onExport = () => {
    const { settings, fields } = this.props.export.toJS();
    this.props.exportUsers(settings, fields);
  }

  onDownload = () => {
    const data = this.props.export.toJS();
    this.props.downloadUsersToFile(data.process.jobId);
  }

  onAddColumn = ({ name, export_as }) => {
    this.props.addColumn(name, export_as);
  }

  onAddDefaultColumns = () => {
    const { defaultFields } = this.props.export.toJS();
    defaultFields.forEach(col => this.props.addColumn(col.name, col.export_as));
  }

  getExportTitle(query) {
    if (query && query.size) {
      const size = query.size;

      if (size === 1000) {
        return `Export ${size}+ Users`;
      }

      return  size > 1 ? `Export ${size} Users` : `Export 1 User`;
    }
    return 'Export Users';
  }

  renderExportButton(query) {
    const enabled = (query && query.hasUsers);
    const title = enabled ? this.getExportTitle(query) : 'Nothing to Export';

    return (
      <Button bsStyle="primary" bsSize="small" disabled={!enabled} onClick={this.onExport}>
        {title}
      </Button>
    );
  }

  inputStyle = { marginRight: '5px', width: '300px' }

  render() {
    const { query, fields } = this.props.export.toJS();

    return (
      <div>
        <ExportProgressDialog export={this.props.export} onDownload={this.onDownload} onClose={this.props.closeExportDialog} />
        <ExportColumns
          fields={fields}
          onAddDefaultColumns={this.onAddDefaultColumns} onAddColumn={this.onAddColumn} onRemoveColumn={this.props.removeColumn}
        />
        <ExportSettings export={this.props.export} getUserCount={this.props.getUserCount} connections={this.props.connections} onChange={this.props.updateSettings} />

        <div className="row">
          <div className="col-xs-12">
            <ButtonToolbar style={{ marginTop: '13px' }}>
              {this.renderExportButton(query)}
            </ButtonToolbar>
          </div>
        </div>
      </div>
    );
  }
}

ExportContainer.propTypes = {
  export: PropTypes.object.isRequired,
  addColumn: PropTypes.func.isRequired,
  removeColumn: PropTypes.func.isRequired,
  getUserCount: PropTypes.func.isRequired,
  exportUsers: PropTypes.func.isRequired,
  updateSettings: PropTypes.func.isRequired,
  connections: PropTypes.object.isRequired,
  fetchConnections: PropTypes.func.isRequired,
  downloadUsersToFile: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    connections: state.connection.get('records'),
    export: state.export
  };
}

export default connect(mapStateToProps, { ...exportActions, ...connectionActions })(ExportContainer);
