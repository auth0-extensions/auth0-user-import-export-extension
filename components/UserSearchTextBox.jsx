import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Button, ButtonToolbar } from 'react-bootstrap';

class UserSearchTextBox extends Component {
  onReset = () => {
    findDOMNode(this.refs.search).value = '';
  }

  render() {
    const { value, loading } = this.props;
    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="advanced-search-control">
            <span className="search-area">
              <i className="icon-budicon-489"></i>
              <input className="user-input" type="text" ref="search" placeholder="Enter query you want to use to load the data."
                spellCheck="false" style={{ marginLeft: '10px' }} {...this.props}
              />
            </span>
          </div>
        </div>
        <div className="col-xs-12">
          <div className="help-block">
            Queries support the Lucene syntax and allow you to filter the export. <a href="http://www.lucenetutorial.com/lucene-query-syntax.html">More information.</a>
          </div>
        </div>
      </div>
    );
  }
}

UserSearchTextBox.propTypes = {
  loading: PropTypes.bool
};

export default UserSearchTextBox;
