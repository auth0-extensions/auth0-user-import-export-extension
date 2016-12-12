import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

class ExportFilterTextBox extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.querySize !== this.props.querySize || nextProps.loading !== this.props.loading;
  }

  onReset = () => {
    findDOMNode(this.refs.search).value = '';
  }

  render() {
    const { querySize, loading } = this.props;
    return (
      <div className="row">
        <div className="col-xs-10">
          <div className="row">
            <div className="col-xs-12">
              <div className="advanced-search-control">
                <span className="search-area">
                  <i className="icon-budicon-489" />
                  <input
                    className="user-input" type="text" ref="search" placeholder="Enter query you want to use to load the data."
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
        </div>
        <div className="col-xs-2">
          <span className="label label-primary" style={{ border: '0px' }}>{loading ? '...' : querySize} users</span>
        </div>
      </div>
    );
  }
}

ExportFilterTextBox.propTypes = {
  loading: PropTypes.bool.isRequired,
  querySize: PropTypes.number
};

export default ExportFilterTextBox;
