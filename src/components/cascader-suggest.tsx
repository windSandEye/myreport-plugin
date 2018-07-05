import React, { Component } from 'react';
import { factory, component } from '@alipay/report-engine';
import { Cascader, Input } from 'antd';

interface Props extends SourceProps {
  placeholder: string;
  queryKey: string;
  formatter: (value: any[]) => string;
  value: any[];
  onChange: (value: any[]) => string;
  inputValue: string;
}

interface State extends SourceState {
  inputValue: string;
  popupVisible: boolean;
}

const { COMPONENT_TYPE } = component;

const getSelected = (value, source = []) => {
  const arr = [];
  let list = source;
  if (value) {
    value.forEach(item => {
      const target = list.filter(it => it.value === item)[0];
      list = target ? target.children : [];
      if (target) {
        list = target.children;
      }
      arr.push(target);
    });
  }
  return arr;
};

class ComponentName extends Component <Props> {

  static defaultProps = {
    queryKey: 'query',
    formatter: (value) => {
      if (value && value.length) {
        let txt = `${value[0].label}`;
        if (value.length > 1) {
          txt = `${txt}(${value[1].value})`;
        }
        return txt;
      }
      return undefined;
    },
  };

  public state: State = {
    source: [],
    loading: true,
    error: null,
    inputValue: undefined,
    popupVisible: false,
  };

  componentWillReceiveProps(props) {
    this.resetState(props);
  }

  resetState(props = this.props) {
    const { promise } = props;
    if (promise) {
      const nextState = this.state;
      const { rejected, fulfilled, value, settled, reason } = promise;
      nextState.loading = !settled;
      if (props.value !== this.props.value) {
        nextState.inputValue = props.formatter(getSelected(props.value, this.state.source));
        nextState.popupVisible = false;
      }
      if (rejected) {
        nextState.error = reason || true;
        nextState.source = [];
      } else {
        nextState.error = null;
      }
      if (fulfilled) {
        nextState.source = value;
      }
      this.setState(nextState);
    }
  }

  handleInputChange(e) {
    const { fetch, queryKey } = this.props;
    const value = e.target.value;
    this.setState({
      inputValue: value,
      popupVisible: !!value,
    }, () => {
      if (!value) {
        this.handleCascaderChange(undefined);
      } else {
        fetch({ [queryKey]: value });
      }
    });
  }
  handleCascaderChange(e) {
    const { onChange } = this.props;
    if (onChange) {
      onChange(e);
    }
  }

  render() {
    const { placeholder, value } = this.props;
    const { source, inputValue, popupVisible } = this.state;
    return(
      <Cascader
        options={source}
        value={value}
        popupVisible={source.length && popupVisible ? true : false}
        onChange={this.handleCascaderChange.bind(this)}
      >
        <Input
          onChange={this.handleInputChange.bind(this)}
          value={inputValue}
          placeholder={placeholder}
        />
      </Cascader>
    );
  }
}

const CascaderSuggest = factory(false)(ComponentName);

CascaderSuggest.type = [COMPONENT_TYPE.SOURCE, COMPONENT_TYPE.FIELD];

CascaderSuggest.processAttributes = (attributes) => {
  const { engine: { compile }, formatter } = attributes;
  if (formatter) {
    attributes.formatter = (value) => compile(formatter, { value });
  }
};

export default CascaderSuggest;
