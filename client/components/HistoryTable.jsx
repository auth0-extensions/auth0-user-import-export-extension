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

  render() {
    const { error, records } = this.props;

    if (!error && records.size === 0) {
      return <div>There are no jobs available.</div>;
    }

    return (
      <div>
        <Table>
          <TableHeader>
            <TableColumn width="5%" />
            <TableColumn width="25%">Type</TableColumn>
            <TableColumn width="25%">Date</TableColumn>
            <TableColumn width="25%">Status</TableColumn>
            <TableColumn width="20%" />
          </TableHeader>
          <TableBody>
            {records.map((record, index) => {
              let action, icon, color, title;

              if (record.status === 'Pending') {
                action = () => this.props.checkStatus(record.id);
                color = 'yellow';
                title = 'Check Status';
                icon = '446';
              } else if (record.status === 'Failed' || record.type === 'import') {
                action = () => this.props.showDialog(record.id);
                color = record.status === 'Failed' ? 'red' : 'green';
                title = 'Show Summary';
                icon = '445';
              } else {
                action = () => this.props.downloadUsers(record.id);
                color = 'green';
                title = 'Download Users';
                icon = '444';
              }

              return (
                <TableRow key={index}>
                  <TableIconCell color={color} icon="447" />
                  <TableTextCell>{record.type}</TableTextCell>
                  <TableTextCell>{record.date}</TableTextCell>
                  <TableTextCell>{record.status}</TableTextCell>
                  <TableCell>
                    <ButtonToolbar style={{ marginBottom: '0px' }}>
                      <TableAction
                        id={`view-${index}`} type="default" title={title} icon={icon}
                        onClick={action}
                      />
                    </ButtonToolbar>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}
