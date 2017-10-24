import React, { Component, PropTypes } from 'react';

class ExportSettings extends Component {
  onChangeSort = (e) => {
    this.props.onChange({
      sortBy: e.target.value,
      sortDesc: this.refs.sortType.checked,
      format: this.refs.format.value
    });
  }

  onChangeSortType = (e) => {
    this.props.onChange({
      sortBy: this.refs.sortBy.value,
      sortDesc: e.target.checked,
      format: this.refs.format.value
    });
  }

  onChangeFormat = (e) => {
    this.props.onChange({
      sortBy: this.refs.sortBy.value,
      sortDesc: this.refs.sortType.checked,
      format: e.target.value
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
      </div>
    );
  }
}

ExportSettings.propTypes = {
  export: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default ExportSettings;
