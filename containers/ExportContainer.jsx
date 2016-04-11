import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';

import { connectionActions } from '../actions';

export default class ExportContainer extends Component {
  render() {
    return (
      <div></div>
    );
  }
}

function mapStateToProps(state) {
  return {
    connections: state.connections
  };
}

export default connect(mapStateToProps, { ...connectionActions })(ExportContainer);
