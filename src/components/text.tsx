import React, { Component } from 'react';
import { utils } from '@alipay/report-engine';

interface TextProps {
  value: string;
  size: number;
}

class Text extends Component<TextProps> {

  static processAttributes = (attributes) => {
    utils.dealTpl(attributes, 'value');
    utils.dealNumber(attributes, 'size');
  }

  render() {
    const { value, size } = this.props;
    return (
      <span style={{ fontSize: size }}>{value}</span>
    );
  }
}

export default Text;
