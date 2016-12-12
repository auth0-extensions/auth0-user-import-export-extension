import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';

class ImportDropFiles extends Component {
  dropzoneStyle = {
    width: '100%',
    height: '200px',
    padding: '65px 20px 20px 20px',
    marginBottom: '20px',
    border: '2px dashed rgb(211, 211, 211)',
    borderRadius: '5px',
    fontSize: '28px',
    color: 'grey',
    textAlign: 'center'
  }

  render() {
    return (
      <Dropzone onDrop={this.props.onDrop} multiple disablePreview style={this.dropzoneStyle}>
        <div>Drop your file here, or click to select.</div>
      </Dropzone>
    );
  }
}

ImportDropFiles.propTypes = {
  onDrop: PropTypes.func.isRequired
};

export default ImportDropFiles;
