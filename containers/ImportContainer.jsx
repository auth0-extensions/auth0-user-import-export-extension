import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';

import { connectionActions } from '../../actions';

export default class ImportContainer extends Component {
  componentWillMount() {
    this.props.fetchConnections();
  }

  render() {
    const { connections } = this.props;

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

export default connect(mapStateToProps, { ...connectionActions })(ImportContainer);
