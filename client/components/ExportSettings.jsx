import _ from 'lodash';
import React, { Component, PropTypes } from 'react';

class ExportSettings extends Component {
  onChangeFormat = (e) => {
    this.props.onChange({
      format: e.target.value,
      connection_id: this.refs.connection.value || undefined
    });
  }

  onChangeConnection = (e) => {
    const connId = e.target.value || undefined;
    const connection = _.find(this.props.connections.toJS(), { id: connId });
    this.props.getUserCount(connection && connection.name);
    this.props.onChange({
      connection_id: connId,
      format: this.refs.format.value
    });
  }

  render() {
    const { formats, settings } = this.props.export.toJS();
    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <h5>Settings</h5>
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label className="col-xs-2 control-label">Export Format</label>
            <div className="col-xs-5">
              <select ref="format" className="form-control" defaultValue={settings.format} onChange={this.onChangeFormat}>
                {Object.keys(formats).map((opt, index) =>
                  <option key={index} value={opt}>{formats[opt]}</option>
                )}
              </select>
              <div className="help-block">This setting allows you to specify the format in which you would like the export.</div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label className="col-xs-2 control-label">Connection</label>
            <div className="col-xs-5">
              <select ref="connection" className="form-control" defaultValue="" onChange={this.onChangeConnection}>
                <option value="">All connections</option>
                {this.props.connections.map((conn, index) =>
                  <option key={index} value={conn.get('id')} name={conn.get('name')}>{conn.get('name')}</option>
                )}
              </select>
              <div className="help-block">This setting allows you to choose connection for exporting.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ExportSettings.propTypes = {
  export: PropTypes.object.isRequired,
  connections: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default ExportSettings;
