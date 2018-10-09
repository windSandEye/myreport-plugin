//漏斗图
export const funnelChartFilter = (data, type) => {
        data = [
                { name: '我的页面曝光', value: 153 },
                { name: '花呗签约页', value: 31 },
                { name: '点击开通', value: 10 },
                { name: '签约成功', value: 9 }
        ]

        // const legendData = getLegendData(data)

        const rtn = {
                result: {
                        title: {
                                text: type == 'independent' ? '独立花呗签约' : '支付花呗签约',
                        },
                        tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c}M"
                        },
                        // legend: {
                        //         data: legendData
                        // },
                        grid: {
                                top: '20%',
                                left: '10%',
                                right: '10%',
                                bottom: '5%'
                        },
                        calculable: true,
                        series: [
                                {
                                        name: '独立花呗签约',
                                        type: 'funnel',
                                        width: 500,
                                        top: '20%',
                                        left: 'center',
                                        bottom: '5%',
                                        data: data
                                }

                        ]
                },
                status: 'success',
        };
        return rtn;
}

//获取图例
const getLegendData = (data) => {
        let legendData = [];
        if (data && data.length > 0) {
                for (let item of data) {
                        legendData.push(item.name);
                }
        }
        return legendData;
}

//是否选中
export const selectOtherFilter = (isSelected, filed) => {
        let filedObj = {};
        filedObj[filed] = isSelected;
        if (isSelected) {
                filedObj[filed] = false;
        } else {
                filedObj[filed] = true;
        }
        return JSON.stringify(filedObj);
}

//其他条件确认
export const otherOkFilter = (event, register, redPacket) => {
        let other = {
                register1: register ? register : false,
                redPacket1: redPacket ? redPacket : false
        }
        return JSON.stringify(other);
}

//环图
export const ringChartFilter = (data, title) => {
        data.result = data.result || [];
        const legendData = getLegendData(data.result);
        const allCount = data.result.reduce((prev, cur) => {
                return prev + parseInt(cur.value);
        }, 0);

        const rtn = {
                result: {
                        title: {
                                text: title,
                        },
                        tooltip: {
                                trigger: 'item',
                                formatter: "{b} : {c}({d}%)"
                        },
                        legend: {
                                orient: 'vertical',
                                right: 0,
                                bottom: 0,
                                data: legendData
                        },
                        graphic: {
                                type: 'text',
                                left: 'center',
                                top: 'middle',
                                style: {
                                        text: title.substring(0, 2) + '总量\n' + allCount,
                                        fontSize: 20,
                                        textAlign: 'center'
                                }
                        },
                        series: [
                                {
                                        name: 'title',
                                        type: 'pie',
                                        radius: ['50%', '75%'],
                                        center: ['50%', '50%'],
                                        label: {
                                                formatter: "{d}%"
                                        },
                                        labelLine: {
                                                length2: 0,
                                                length: 5,
                                                show: false
                                        },
                                        data: data.result
                                }

                        ]
                },
                status: 'success',
        };
        return rtn;
}

//数据处理器
export const dataDetialFilter = (response) => {
        const rtn = {
                result: {
                        data: response.result
                },
                status: 'success'
        };
        return rtn;
}

//单条数据处理
export const singDataFilter = (response) => {
        const rtn = {
                result: {
                        selectBar: response.result
                },
                status: 'success'
        };
        return rtn;
}

//饼图数据处理
export const pieDataFilter = (response) => {
        const rtn = {
                result: {
                        fromData: response[0].result,
                        toData: response[1].result
                },
                status: 'success'
        };
        return rtn;
}

//饼图联动数据处理
export const pieLinkageFilter = (event, type) => {
        if (type == "from") {
                let fromObj = {
                        'T.fromName': event.name
                }
                return JSON.stringify(fromObj);
        } else {
                let toObj = {
                        'T.toName': event.name
                }
                return JSON.stringify(toObj);
        }
        return;
}

//新增分析处理
export const increaseAnalyzeFilter = (data, payAbility) => {
        let increaseData = '0';
        if (data && data.length > 0) {
                let payObj = data.find(item => item.pre_pay_ability == payAbility);
                if (payObj) {
                        increaseData = payObj.users;
                }
        }
        return increaseData;
}

//新增贡献度
export const increaseContributeFilter = (data, payAbility) => {
        let contribute = 0;
        if (data && data.length > 0) {
                let count = data.reduce((prev, cur) => {
                        return prev + parseInt(cur.users);
                }, 0);
                let payObj = data.find(item => item.pre_pay_ability == payAbility);
                if (payObj) {
                        contribute = payObj.users * 1 / count;
                }
        }
        return contribute;
}
