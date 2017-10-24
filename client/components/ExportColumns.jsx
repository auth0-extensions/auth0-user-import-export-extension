import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Button } from 'react-bootstrap';

import { Table, TableCell, TableAction, TableBody, TableIconCell, TableTextCell, TableHeader, TableColumn, TableRow } from '../components/Dashboard';


class ColumnExport extends Component {
  state = {
    addEnabled: false
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.fields !== this.props.fields ||
      nextState.addEnabled !== this.state.addEnabled;
  }

  onAddColumn = () => {
    this.props.onAddColumn(this.getValues());

    // Reset the textboxes.
    findDOMNode(this.refs.name).value = '';
    findDOMNode(this.refs.export_as).value = '';
  }

  onRemoveColumn = (col) => {
    this.props.onRemoveColumn(col._id);
  }

  onChange = () => {
    const values = this.getValues();
    this.setState({
      addEnabled: values.export_as && values.export_as.length && values.name && values.name.length
    });
  }

  getValues = () => ({
    name: findDOMNode(this.refs.name).value,
    export_as: findDOMNode(this.refs.export_as).value
  })

  inputStyle = { marginRight: '5px', width: '300px' }

  renderColumns = (fields) => {
    if (!fields || !fields.length) {
      return <div />;
    }

    return (
      <Table>
        <TableHeader>
          <TableColumn width="40%">User Attribute</TableColumn>
          <TableColumn width="40%">Field Name</TableColumn>
          <TableColumn width="5%" />
        </TableHeader>
        <TableBody>
        {fields.map((col, index) =>
          <TableRow key={index}>
            <TableTextCell><code>{col.name}</code></TableTextCell>
            <TableTextCell>{col.export_as}</TableTextCell>
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
          <h5>Fields</h5>
          <div className="row">
            <div className="col-xs-9">
              <p style={{ marginTop: '0px' }}>
                You can decided which attributes should be included in the export.
                The <strong>user field</strong> should be a static value like <code>app_metadata.name</code> or <code>app_metadata.address.city</code>. The <strong>column name</strong> is how the value will be represented in the export.

              </p>
            </div>
            <div className="col-xs-3">
              <Button bsStyle="primary" bsSize="xs" onClick={this.props.onAddDefaultColumns}>Add Default Fields</Button>
            </div>
          </div>
          <form className="form-inline">
            <div className="form-group" style={{ verticalAlign: 'top' }}>
              <input ref="name" type="text" className="form-control" placeholder="User Fields" style={this.inputStyle} onChange={this.onChange} />
              <div className="help-block" style={{ width: '270px' }}>Fields to extract from the user object. Eg: <code>email</code> or <code>identities[0].connection</code></div>
            </div>
            <div className="form-group" style={{ verticalAlign: 'top' }}>
              <input ref="export_as" type="text" className="form-control" placeholder="Column Name" style={this.inputStyle} onChange={this.onChange} />
              <div className="help-block" style={{ width: '270px' }}>Specify the attribute/column name in the output. Eg: <code>Email</code></div>
            </div>
            <div className="form-group" style={{ verticalAlign: 'top' }}>
              <Button bsStyle="primary" bsSize="small" disabled={!this.state.addEnabled} onClick={this.onAddColumn}>
               Add
             </Button>
            </div>
          </form>
          {this.renderColumns(this.props.fields)}
        </div>
      </div>
    );
  }
}

ColumnExport.propTypes = {
  loading: PropTypes.bool,
  fields: PropTypes.array,
  onAddDefaultColumns: PropTypes.func.isRequired,
  onAddColumn: PropTypes.func.isRequired,
  onRemoveColumn: PropTypes.func.isRequired
};

export default ColumnExport;
