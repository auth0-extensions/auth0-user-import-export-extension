import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

export function RequireAuthentication(InnerComponent) {
  class RequireAuthenticationContainer extends React.Component {
    componentWillMount() {
      this.requireAuthentication();
    }

    componentWillReceiveProps() {
      this.requireAuthentication();
    }

    requireAuthentication() {
      return;
      if (!this.props.auth.isAuthenticated && !this.props.auth.isAuthenticating) {
        if (window.config.IS_ADMIN) {
          this.props.push('/login');
        } else {
          this.props.push(`/login?returnUrl=${this.props.location.pathname}`);
        }
      }
    }

    render() {
      return <InnerComponent {...this.props} />;
    }
  }

  return connect(state => ({ }), { push })(RequireAuthenticationContainer);
}
