import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Button } from 'react-bootstrap';

import { ButtonToolbar, Table, TableCell, TableBody, TableIconCell, TableTextCell, TableHeader, TableColumn, TableRow } from '../components/Dashboard';


class ColumnExport extends Component {
  state = {
    addEnabled: false
  }

  onAddColumn = () => {
    this.props.onAddColumn(this.getValues());

    // Reset the textboxes.
    findDOMNode(this.refs.userAttribute).value = '';
    findDOMNode(this.refs.columnName).value = '';
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

  renderColumns = (columns) => {
    if (!columns || !columns.length) {
      return <div />;
    }

    return (
      <Table>
        <TableHeader>
          <TableColumn width="3%" />
          <TableColumn width="52%">User Attribute</TableColumn>
          <TableColumn width="45%">Column Name</TableColumn>
        </TableHeader>
        <TableBody>
        {columns.map((col, index) =>
          <TableRow key={index}>
            <TableIconCell color="green" icon="573" />
            <TableTextCell><code>{col.userAttribute}</code></TableTextCell>
            <TableTextCell>{col.columnName}</TableTextCell>
          </TableRow>
        )}
        </TableBody>
      </Table>
    );
  }

  inputStyle = { marginRight: '5px', width: '300px' }

  render() {
    return (
      <div>
        <h4>Columns</h4>
        <p>
          You can decided which attributes should be included in the export.
          The <strong>user attribute</strong> can be a static value like <code>user.app_metadata.name</code> or a Javascript expression like <code>user.app_metdata.name || user.name</code> which will then be evaluated during the export. The <strong>column name</strong> is how the value will be represented in the export.
        </p>
        <form className="form-inline">
          <div className="form-group">
            <input ref="userAttribute" type="text" className="form-control" placeholder="User Attribute" style={this.inputStyle} onChange={this.onChange} />
          </div>
          <div className="form-group">
            <input ref="columnName" type="text" className="form-control" placeholder="Column Name" style={this.inputStyle} onChange={this.onChange} />
          </div>
          <Button bsStyle="primary" bsSize="small" disabled={!this.state.addEnabled} onClick={this.onAddColumn}>
           Add
         </Button>
        </form>
        {this.renderColumns(this.props.columns)}
      </div>
    );
  }
}

ColumnExport.propTypes = {
  loading: PropTypes.bool,
  columns: PropTypes.array,
  onAddColumn: PropTypes.func.isRequired
};

export default ColumnExport;
