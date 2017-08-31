import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Button } from 'react-bootstrap';

import { Table, TableCell, TableAction, TableBody, TableIconCell, TableTextCell, TableHeader, TableColumn, TableRow } from '../components/Dashboard';


class ColumnExport extends Component {
  state = {
    addEnabled: false
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.columns !== this.props.columns ||
      nextState.addEnabled !== this.state.addEnabled;
  }

  onAddColumn = () => {
    this.props.onAddColumn(this.getValues());

    // Reset the textboxes.
    findDOMNode(this.refs.userAttribute).value = '';
    findDOMNode(this.refs.columnName).value = '';
  }

  onRemoveColumn = (col) => {
    this.props.onRemoveColumn(col._id);
  }

  onChange = () => {
    const values = this.getValues();
    this.setState({
      addEnabled: values.columnName && values.columnName.length && values.userAttribute && values.userAttribute.length
    });
  }

  getValues = () => ({
    userAttribute: findDOMNode(this.refs.userAttribute).value,
    columnName: findDOMNode(this.refs.columnName).value
  })

  inputStyle = { marginRight: '5px', width: '300px' }

  renderColumns = (columns) => {
    if (!columns || !columns.length) {
      return <div />;
    }

    return (
      <Table>
        <TableHeader>
          <TableColumn width="40%">User Attribute</TableColumn>
          <TableColumn width="40%">Column Name</TableColumn>
          <TableColumn width="5%" />
        </TableHeader>
        <TableBody>
        {columns.map((col, index) =>
          <TableRow key={index}>
            <TableTextCell><code>{col.userAttribute}</code></TableTextCell>
            <TableTextCell>{col.columnName}</TableTextCell>
            <TableCell>
              <TableAction id={`remove-column-${index}`}
                type="success" title="Remove" icon="263"
                onClick={this.onRemoveColumn} args={[ col ]}
              />
            </TableCell>
          </TableRow>
        )}
        </TableBody>
      </Table>
    );
  }

  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
          <h5>Columns</h5>
          <div className="row">
            <div className="col-xs-9">
              <p style={{ marginTop: '0px' }}>
                You can decided which attributes should be included in the export.
                The <strong>user attribute</strong> can be a static value like <code>user.app_metadata.name</code> or a Javascript expression like <code>user.app_metadata.name || user.name</code> which will then be evaluated during the export. The <strong>column name</strong> is how the value will be represented in the export.
              </p>
            </div>
            <div className="col-xs-3">
              <Button bsStyle="primary" bsSize="xs" onClick={this.props.onAddDefaultColumns}>Add Default Columns</Button>
            </div>
          </div>
          <form className="form-inline">
            <div className="form-group" style={{ verticalAlign: 'top' }}>
              <input ref="userAttribute" type="text" className="form-control" placeholder="User Attribute / Expression" style={this.inputStyle} onChange={this.onChange} />
              <div className="help-block" style={{ width: '270px' }}>An attribute name or expression to extract a value from the user object. Eg: <code>user.name</code> or <code>user.name || user.app_metadata.name</code></div>
            </div>
            <div className="form-group" style={{ verticalAlign: 'top' }}>
              <input ref="columnName" type="text" className="form-control" placeholder="Column Name" style={this.inputStyle} onChange={this.onChange} />
              <div className="help-block" style={{ width: '270px' }}>Specify the attribute/column name in the output. Eg: <code>Name</code></div>
            </div>
            <div className="form-group" style={{ verticalAlign: 'top' }}>
              <Button bsStyle="primary" bsSize="small" disabled={!this.state.addEnabled} onClick={this.onAddColumn}>
               Add
             </Button>
            </div>
          </form>
          {this.renderColumns(this.props.columns)}
        </div>
      </div>
    );
  }
}

ColumnExport.propTypes = {
  loading: PropTypes.bool,
  columns: PropTypes.array,
  onAddDefaultColumns: PropTypes.func.isRequired,
  onAddColumn: PropTypes.func.isRequired,
  onRemoveColumn: PropTypes.func.isRequired
};

export default ColumnExport;
