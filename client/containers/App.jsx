import React, { Component } from 'react';
import { connect } from 'react-redux';

import { authActions } from '../actions';
import Header from '../components/Header';
import { Sidebar, SidebarItem } from '../components/Dashboard';
import RequireAuthentication from './RequireAuthentication';

class App extends Component {
  render() {
    return (
      <div>
        <Header user={this.props.user} onLogout={this.props.logout} />
        <div className="container">
          <div className="row">
            <Sidebar>
              <SidebarItem title="Import" route="/import" icon="icon icon-budicon-375" />
              <SidebarItem title="Export" route="/export" icon="icon icon-budicon-322" />
              <SidebarItem title="History" route="/history" icon="icon icon-budicon-494" />
            </Sidebar>
            <div id="content" className="wrapper col-xs-10">
              { this.props.children }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    user: state.user
  };
}

export default RequireAuthentication(connect(select, { ...authActions })(App));
