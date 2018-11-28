import React, { Component } from 'react';
import { utils } from '@alipay/report-engine';
import { Table } from 'antd';
import numeral from 'numeral';

interface TableSpanProps {
    data: any[],
    onClick: any
}

export default class TableSpan extends Component<TableSpanProps> {
    static processAttributes = (attributes) => {
        utils.dealTpl(attributes, 'data');
        utils.dealObject(attributes, 'data');
    }
    static defaultProps = {
        data: []
    }

    rowSpanContent = (data, field, value, row, index) => {
        const obj = {
            children: value,
            props: {
                rowSpan: 0
            },
        };
        if (field == 'pay_ability_yesterday') {
            obj.children = value == '注册' ? '注册' : 'T' + value;
        }else if(field == 'userCntInt'){
            obj.children = numeral(value).format('0.00 zh');
        }
        let prevRow = data[index - 1];
        if (prevRow && row.pay_ability_yesterday == prevRow.pay_ability_yesterday) {
            obj.props.rowSpan = 0;
        } else {
            let commonRow = data.filter(item => item.pay_ability_yesterday == row.pay_ability_yesterday);
            obj.props.rowSpan = commonRow.length;
        }
        return obj;
    }

    openModal(row) {
        var showText = "T" + row.pay_ability_yesterday;
        if (row.pay_ability_yesterday == '注册') {
            showText = "注册"
        }
        let params = {
            'showChangeTrend': true,
            'changeTrendTitle': showText + "跃迁到T" + row.pay_ability_today + "趋势变化",
            'levelInit': row.pay_ability_yesterday,
            'levelChange': row.pay_ability_today
        }
        this.props.onClick(params);
    }

    render() {
        let data = this.props.data;
        if (data.constructor != Array) {
            data = []
        }
        const columns = [{
            title: '初始等级',
            dataIndex: 'pay_ability_yesterday',
            render: this.rowSpanContent.bind(this, data, 'pay_ability_yesterday')
        }, {
            title: '初始用户数',
            dataIndex: 'userCntInt',
            render: this.rowSpanContent.bind(this, data, 'userCntInt')
        }, {
            title: '变化等级',
            dataIndex: 'pay_ability_today'
        }, {
            title: '变化用户数',
            dataIndex: 'user_cnt',
            render: (value,row) => {
                return <a onClick={this.openModal.bind(this, row)}>{numeral(value).format('0.00 zh')}</a>
            }
        }];

        return (
            <Table columns={columns} dataSource={data} bordered pagination={false} />
        )
    }
}