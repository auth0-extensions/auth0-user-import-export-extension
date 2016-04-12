import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';

import { connectionActions } from '../actions';
import UserSearchTextBox from '../components/UserSearchTextBox';
import { Button, ButtonToolbar } from 'react-bootstrap';

export default class ExportContainer extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <UserSearchTextBox defaultValue="" onBlur={e => console.log('blur', e)}
              onChange={e => console.log('change', e)}/>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <h4>Columns</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <h4>Settings</h4>
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

function mapStateToProps(state) {
  return {
    connections: state.connections
  };
}

export default connect(mapStateToProps, { ...connectionActions })(ExportContainer);
