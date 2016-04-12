import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { Alert, Button, ButtonToolbar } from 'react-bootstrap';

import { exportActions } from '../actions';
import ColumnExport from '../components/ColumnExport';
import UserSearchTextBox from '../components/UserSearchTextBox';

export default class ExportContainer extends Component {
  componentWillMount = () => {
    this.props.getUserCount();
  }

  onQueryChanged = (e) => {
    this.props.getUserCount(e.target.value);
  }

  onAddColumn = ({ userAttribute, columnName }) => {
    this.props.addColumn(userAttribute, columnName);
  }

  inputStyle = { marginRight: '5px', width: '300px' }

  render() {
    const { formats, selectedFormat, query, columns } = this.props.export.toJS();

    return (
      <div>
        <div className="row">
          <div className="col-xs-10">
            <UserSearchTextBox defaultValue="" onBlur={this.onQueryChanged} />
          </div>
          <div className="col-xs-2">
            <span className="label label-primary" style={{ border: '0px' }}>{query.size} users</span>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <ColumnExport columns={columns} onAddColumn={this.onAddColumn} onDeleteColumn={this.props.deleteColumn} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <h4>Settings</h4>
            <div className="form-group">
              <label className="col-xs-2 control-label">Export Format</label>
              <div className="col-xs-5">
                <select className="form-control" defaultValue={selectedFormat}>
                  <option value=""></option>
                  {Object.keys(formats).map((opt, index) => {
                    return <option key={index} value={opt}>{formats[opt]}</option>;
                  })}
                </select>
                <div className="help-block">This setting allows you to specify the format in which you would like the export.</div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <ButtonToolbar>
              <Button bsStyle="primary" bsSize="small" disabled={false} onClick={this.props.onConfirm}>
                Export
              </Button>
              <Button bsStyle="default" bsSize="small" disabled={false} onClick={this.props.onConfirm}>
                Preview
              </Button>
              <Button bsStyle="success" bsSize="small" disabled={false} onClick={this.props.onConfirm}>
                Cancel
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
  getUserCount: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    export: state.export
  };
}

export default connect(mapStateToProps, { ...exportActions })(ExportContainer);
