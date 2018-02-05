import React, { Component } from 'react';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';

import './HistoryDialog.css';

export default class HistoryDialog extends Component {
  static propTypes = {
    job: React.PropTypes.object,
    onClose: React.PropTypes.func.isRequired
  };

  render() {
    if (!this.props.job) {
      return <div />;
    }

    const { id, date, status, summary } = this.props.job;

    return (
      <Modal dialogClassName="history-dialog" show={this.props.job !== null} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{id} - <span>{date}</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre>{summary}</pre>
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <Button bsSize="small" onClick={this.props.onClose}>
              <i className="icon icon-budicon-501"></i> Close
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
  }
}
