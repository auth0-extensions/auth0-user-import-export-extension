import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class Error extends Component {
  onDismiss() {
    if (this.props.onDismiss) {
      this.props.onDismiss();
    }
  }

  render() {
    if (!this.props.message) {
      return this.props.children || <div />;
    }

    let errors = '';
    if (this.props.errors && this.props.errors.size > 0) {
      errors = (<ul>
        {this.props.errors.map((err, index) =>
          <li key={err}>{err}</li>
      )}
      </ul>);
    }

    return (<Alert bsStyle="danger" onDismiss={this.onDismiss.bind(this)} dismissAfter={this.props.dismissAfter || 10000}>
      <h4>Oh snap! You got an error!</h4>
      <p>{this.props.message}</p>
      {errors}
    </Alert>);
  }
}

Error.propTypes = {
  message: React.PropTypes.string,
  dismissAfter: React.PropTypes.number,
  onDismiss: React.PropTypes.func
};

export default Error;
