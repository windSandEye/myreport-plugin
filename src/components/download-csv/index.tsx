import React, { Component } from 'react';
import { factory, component, utils } from '@alipay/report-engine';
import FileSaver from 'file-saver';
import { TextEncoder } from './text-encode';

interface Props extends SourceProps {
  placeholder: string;
  format: any;
}

class Element extends Component<Props> {

  data: any[];

  constructor(props) {
    super(props);
    this.data = [];
  }
  componentWillReceiveProps(props) {
    const { promise: _promise } = this.props;
    const { promise } = props;
    if (promise !== _promise) {
      const { fulfilled, value } = promise;
      if (fulfilled) {
        if (Array.isArray(value)) { // 数据源为单页
          this.data = value;
          this.downloadCSV();
        } else {
          this.data = this.data.concat(value.detail);
          if (value.pagination.hasNextPage) { // 数据未请求完整
            this.props.fetch({ pageNum: parseInt(value.pagination.pageNum, 10) + 1 });
          } else {  // 数据请求完整
            this.downloadCSV();
          }
        }
      }
    }
  }
  getCsvContent(dataSource) {
    const { format } = this.props;
    let csvContent = '';

    if (dataSource && dataSource.length > 0) {
      if (format) {
        // 打印表头
        format.forEach((item, index, arr) => {
          csvContent += `${item.value};`;
          if (index === arr.length - 1) {
            csvContent += '\n';
          }
        });

        // 打印内容
        dataSource.forEach((info) => {
          format.forEach((item, index, arr) => {
            csvContent += `${info[item.key]};`;
            if (index === arr.length - 1) {
              csvContent += '\n';
            }
          });
        });
      } else {
        // 打印表头
        Object.keys(dataSource[0]).forEach((item, index, arr) => {
          csvContent += `${item};`;
          if (index === arr.length - 1) {
            csvContent += '\n';
          }
        });

        // 打印内容
        dataSource.forEach((info) => {
          Object.keys(info).map(key => info[key]).forEach((item, i, arr) => {
            csvContent += `${item};`;
            if (i === arr.length - 1) {
              csvContent += '\n';
            }
          });
        });
      }
    }
    return csvContent;
  }
  downloadCSV() {
    const encodedUri = this.getCsvContent(this.data);
    const fileName = `data-${new Date().getTime()}.csv`;
    const textEncoder = new TextEncoder('GBK', { NONSTANDARD_allowLegacyEncoding: true });
    const csvContentEncoded = textEncoder.encode(encodedUri);
    const blob = new Blob([csvContentEncoded], { type: 'text/csv;charset=GBK;' });
    FileSaver.saveAs(blob, fileName);
  }
  clickToStart = () => {
    // debugger;
    const { fetch } = this.props;
    fetch({});
  }
  render() {
    const { children } = this.props;
    return (
      <span onClick={this.clickToStart}>{children}</span>
    );
  }
}
const DownloadCSV = factory(false)(Element);
DownloadCSV.type = [component.COMPONENT_TYPE.SOURCE];
DownloadCSV.processAttributes = (attributes) => {
  if (attributes.format !== undefined) {
    utils.dealObject(attributes, 'format');
  }
};
export default DownloadCSV;
