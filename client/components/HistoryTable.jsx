import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import { Table, TableAction, TableCell, TableBody, TableIconCell, TableTextCell, TableHeader, TableColumn, TableRow } from 'auth0-extension-ui';

export default class HistoryTable extends Component {
  static propTypes = {
    checkStatus: React.PropTypes.func.isRequired,
    showDialog: React.PropTypes.func.isRequired,
    downloadUsers: React.PropTypes.func.isRequired,
    error: React.PropTypes.string,
    records: React.PropTypes.array.isRequired
  };

  renderRow = (record, index) => {
    let action, button, color, title;
    let status = record.status;

    const icon = (record.type === 'import') ? '446' : '447';

    if (status === 'pending') {
      action = () => this.props.checkStatus(record.type, record.id);
      color = '#f1cd13';
      title = 'Check Status';
      button = '436';
    } else if (status === 'failed' || record.type === 'import') {
      action = () => this.props.showDialog(record.id);
      color = (status === 'failed') ? '#e22b28' : '#329743';
      title = 'Show Summary';
      button = '692';
      if (record.summary && record.summary.failed) {
        color = '#f1cd13';
        status += ` (${record.summary.failed} of ${record.summary.total} failed)`;
      }
    } else {
      action = () => this.props.downloadUsers(record.id);
      color = '#329743';
      title = 'Download Users';
      button = '722';
    }

    return (
      <TableRow key={index}>
        <TableIconCell color={color} icon={icon} />
        <TableTextCell>{record.type}</TableTextCell>
        <TableTextCell>{record.date}</TableTextCell>
        <TableTextCell>{status}</TableTextCell>
        <TableCell>
          <ButtonToolbar style={{ marginBottom: '0px' }}>
            <TableAction
              id={`view-${index}`} type="default" title={title} icon={button}
              onClick={action} disabled={status === 'expired'}
            />
          </ButtonToolbar>
        </TableCell>
      </TableRow>
    );
  };

  render() {
    const { error, records } = this.props;

    if (!error && (!records || records.length === 0)) {
      return <div>There are no jobs available.</div>;
    }

    return (
      <div>
        <Table>
          <TableHeader>
            <TableColumn width="3%" />
            <TableColumn width="12%">Type</TableColumn>
            <TableColumn width="37%">Date</TableColumn>
            <TableColumn width="40%">Status</TableColumn>
            <TableColumn width="7%" />
          </TableHeader>
          <TableBody>
            {records.reverse().map(this.renderRow)}
          </TableBody>
        </Table>
      </div>
    );
  }
}
