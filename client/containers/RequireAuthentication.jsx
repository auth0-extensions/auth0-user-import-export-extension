import React from 'react';
import { connect } from 'react-redux';

export default function RequireAuthentication(InnerComponent) {
  class RequireAuthenticationContainer extends React.Component {
    componentWillMount() {
      this.requireAuthentication();
    }

    componentWillReceiveProps() {
      this.requireAuthentication();
    }

    requireAuthentication() {
      if (!this.props.user.isAuthenticated && !this.props.user.isAuthenticating) {
        window.location = window.config.BASE_URL + '/login';
      }
    }

    render() {
      if (this.props.user.isAuthenticated) {
        return <InnerComponent {...this.props} />;
      }

      return <div></div>;
    }
  }

  return connect((state) => ({ user: state.user.toJS() }), { })(RequireAuthenticationContainer);
}
