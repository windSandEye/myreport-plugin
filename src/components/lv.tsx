import React, { Component } from 'react';

interface Props {
  status: string;
}

class LocalVariables extends Component<Props> {

  static processAttributes = (attributes) => {
    const { status } = attributes.engine;
    attributes.status = JSON.stringify(status, null, 4);
  }

  render() {
    const { status } = this.props;
    return (
      <span title={status}>M</span>
    );
  }
}

export default LocalVariables;
