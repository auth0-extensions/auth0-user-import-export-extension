import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

import * as constants from '../constants';
import { exportActions } from '../actions';
import { ExportColumns, ExportSettings, ExportProgressDialog } from '../components';

export class ExportContainer extends Component {
  componentWillMount = () => {
    this.props.getUserCount();
  }

  onExport = () => {
    const { settings, fields } = this.props.export.toJS();
    this.props.exportUsers(settings, fields);
  }

  onDownload = () => {
    const data = this.props.export.toJS();
    this.props.downloadUsersToFile(data.process.link);
  }

  onQueryChanged = (e) => {
    this.props.getUserCount(e.target.value);
    this.props.updateSearchFilter(e.target.value);
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
      return `Export ${size} Users`;
    }
    return 'Export';
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
        <ExportSettings export={this.props.export} onChange={this.props.updateSettings} />

        <div className="row">
          <div className="col-xs-12">
            { query.size > constants.MAX_RECORDS ? (
              <div className="alert alert-info" style={{ marginBottom: 0, marginTop: '21px' }}>
                <strong>Heads up!</strong> Your account has more than 10,000 users, if you need to export all your users please contact support.
              </div>
            ) : null }

            <ButtonToolbar style={{ marginTop: '13px' }}>
              <Button bsStyle="primary" bsSize="small" disabled={false} onClick={this.onExport}>
                {this.getExportTitle(query)}
              </Button>


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
  downloadUsersToFile: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    export: state.export
  };
}

export default connect(mapStateToProps, { ...exportActions })(ExportContainer);