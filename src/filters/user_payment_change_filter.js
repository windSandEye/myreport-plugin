//数据变更关系图
import numeral from 'numeral';
import moment from 'moment';
const color = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']

export const graphChartFilter = (response) => {
    //初始化节点
    let data = [{
        name: '注册',
        symbol: 'circle',
        symbolSize: 100,
        itemStyle: {
            color: "#3296FA"
        }
    },
    {
        name: '0和1',
        symbol: 'circle',
        symbolSize: 100,
        itemStyle: {
            color: "#3296FA"
        }
    },
    {
        name: '2',
        symbol: 'circle',
        symbolSize: 100,
        itemStyle: {
            color: "#3296FA"
        }
    },
    {
        name: '3',
        symbol: 'circle',
        symbolSize: 100,
        itemStyle: {
            color: "#3296FA"
        }
    },
    {
        name: '4',
        symbol: 'circle',
        symbolSize: 100,
        itemStyle: {
            color: "#3296FA"
        }
    }
    ]

    let linkData = response.result;
    let links = [];
    for (var prop in linkData) {
        let target = prop.substring(2);
        if (target == '1And0') {
            target = "0和1"
        }
        let link = getLinkData(linkData[prop], target);
        if (link) {
            links = links.concat(link);
        }
    }


    const rtn = {
        result: {
            type: 'graph',
            layout: 'circular',
            focusNodeAdjacency: true,
            legendHoverLink: true,
            hoverAnimation: true,
            roam: 'move',
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [5, 20],
            label: {
                show: true,
                fontSize: 28
            },
            nodes: data,
            links: links
        },
        status: 'success',
    };
    return rtn;
}

/*
 *封装连接线
 *data:连接线数据
 *target:目标点名称
 */
const getLinkData = (data, target) => {
    if (data && data.length > 0) {
        let linkList = [];
        for (let i = 0; i < data.length; i++) {
            let linkObj = {
                source: '',
                target: target,
                symbolSize: getSymbolSize(data[i].user_cnt),
                label: {
                    normal: {
                        show: true,
                        formatter: numeral(data[i].user_cnt * 1).format('0.00zh'),
                        fontSize: 18,
                        color: 'black'
                    }
                },
                lineStyle: {
                    width: getLinkWidth(data[i].user_cnt),
                    curveness: 0.2, 
                    color: '#52a8fd',
                    opacity: 0.6
                }
            }

            switch (data[i].pay_ability_yesterday) {
                case '-':
                    linkObj.source = '注册';
                    break;
                case '0':
                case '1':
                    linkObj.source = '0和1';
                    break;
                case '2':
                    linkObj.source = '2';
                    linkObj.symbolSize = getSymbolSize(data[i].user_cnt);
                    break;
                case '3':
                    linkObj.source = '3';
                    break;
                case '4':
                    linkObj.source = '4';
                    break;
            }

            if (linkObj.source > linkObj.target) {
                linkObj.lineStyle.curveness = 0.2;
                   
            } else {
                linkObj.lineStyle.curveness = -0.2;

            }
            // linkObj.lineStyle.color = getColor(linkObj.source);
            linkList.push(linkObj);
        }
        return linkList;
    }
    return null
}

/*
 *连线宽度
 *默认宽度起始位1，每上升一级，增加5px
 */
const getLinkWidth = (linkData) => {
    let linkUnit = linkData.length;
    let linkWidth = linkData / (Math.pow(10, linkUnit - 1) * 2) + 5 * (linkUnit - 1);
    return linkWidth;
}

//箭头大小
const getSymbolSize = (linkData) => {
    let symbolSize = [1, 15];
    let linkUnit = linkData.length;
    let linkWidth = linkData / (Math.pow(10, linkUnit - 1) * 2) + 5 * (linkUnit - 1);
    if (linkUnit < 4) {
        symbolSize = [1, 10 + linkWidth]
    } else {
        symbolSize = [1, linkWidth - 5]
    }
    return symbolSize;
}

//连线颜色
const getColor = (source) => {
    switch (source) {
        case '注册':
            return color[0];
        case '0和1':
            return color[1];
        case '2':
            return color[2];
        case '3':
            return color[3];
        case '4':
            return color[4];
        default:
            return color[0];
    }
}


//显示具体某个支付能力节点的详情
export const showPaymentFilter = (chartObj) => {
    if (chartObj.dataType == 'node') {
        return JSON.stringify({
            paymentName: chartObj.name
        })
    }
}

//来源和流失数据源处理
export const paymentFromAndToFilter = (response, paymentName) => {
    //初始化数据
    response[0].result = response[0].result ? response[0].result : [];
    response[1].result = response[1].result ? response[1].result : [];
    response[2].result = response[2].result ? response[2].result : [];
    response[3].result = response[3].result ? response[3].result : [];

    //将相同能力的数据合并为一条数据
    let fromSource = sourceCount(response[0].result, 'from', paymentName);
    let toSource = sourceCount(response[1].result, 'to', paymentName);
    //合并流失数据到来源数据中，组成有对比的柱状图数据
    for (let i = 0; i < fromSource.length; i++) {
        fromSource[i].user_cnt_to = toSource[i].user_cnt_to;
    }
    //总来源数据
    let fromCount = fromSource.reduce((prev, cur) => {
        return prev + cur.user_cnt_from;
    }, 0);
    //总流失数据
    let toCount = toSource.reduce((prev, cur) => {
        return prev + cur.user_cnt_to;
    }, 0);

    //昨日总来源数据
    let yesterdayFromSource = response[2].result.reduce((prev, cur) => {
        return prev + cur.user_cnt * 1;
    }, 0);

    //昨日总流失数据
    let yesterdayToSource = response[3].result.reduce((prev, cur) => {
        return prev + cur.user_cnt * 1;
    }, 0);

    //来源日环比
    let fromRingratio = yesterdayFromSource != 0 ? (fromCount - yesterdayFromSource) / yesterdayFromSource : 0;

    //流失日环比
    let toRingratio = yesterdayToSource != 0 ? (toCount - yesterdayToSource) / yesterdayToSource : 0;

    //净增长
    let netGrowth = fromCount - toCount;

    let yesterdatNetGrowth = yesterdayFromSource - yesterdayToSource;

    //净增比例
    let netGrowthRatio = yesterdatNetGrowth != 0 ? (netGrowth - yesterdatNetGrowth) / yesterdatNetGrowth : 0;

    const rtn = {
        result: {
            barSource: fromSource,
            fromCount: fromCount,
            toCount: toCount,
            fromRingratio: fromRingratio,
            toRingratio: toRingratio,
            netGrowth: netGrowth,
            netGrowthRatio: netGrowthRatio,
            pieSource: [{
                name: '新增',
                count: fromCount
            }, {
                name: '流失',
                count: toCount
            }],
            fromTable: response[0].result,
            toTable: response[1].result,
        },
        status: 'success',
    };
    return rtn;
}

//合并统计相同能力的数据
const sourceCount = (source, sourceName, paymentName) => {
    let nameList = ['注册', '等级0', '等级1', '等级2', '等级3', '等级4'];
    switch (paymentName) {
        case '注册':
            nameList = ['等级0', '等级1', '等级2', '等级3', '等级4'];
            break;
        case '0和1':
            nameList = ['注册', '等级2', '等级3', '等级4'];
            break;
        case '2':
            nameList = ['注册', '等级0', '等级1', '等级3', '等级4'];
            break;
        case '3':
            nameList = ['注册', '等级0', '等级1', '等级2', '等级4'];
            break;
        case '4':
            nameList = ['注册', '等级0', '等级1', '等级2', '等级3'];
            break;
    }

    let barSource = [];
    for (let barName of nameList) {
        let barObj = {};
        let count = 0;
        if (barName == '注册') {
            barObj.pay_ability = '-';
            count = source.reduce((prev, cur) => {
                if (cur.pay_ability == "-") {
                    return prev + cur.user_cnt * 1;
                } else {
                    return prev;
                }
            }, 0);
        } else {
            let level = barName.substring(2);
            barObj.pay_ability = level;
            count = source.reduce((prev, cur) => {
                if (cur.pay_ability == level) {
                    return prev + cur.user_cnt * 1;
                } else {
                    return prev;
                }
            }, 0);

        }
        barObj.name = barName;
        barObj['user_cnt_' + sourceName] = count;
        barSource.push(barObj);
    }

    return barSource;
}

//详情过滤
export const fromDetailFilter = (event) => {
    //获取选择柱状的能力等级
    let transformName = event.name;
    if (event.name != '注册') {
        transformName = event.name.substring(2);
    }

    //获取选中柱状的类型：来源/流失
    let transformSource = 'from';
    if (event.seriesIndex == 1) {
        transformSource = 'to';
    }
    let transformObj = {
        'transformName': transformName,
        'transformSource': transformSource,
        'showModal': true
    };
    return JSON.stringify(transformObj);
}

//frame请求数据处理
export const frameSourceFilter = (response) => {
    return {
        result: {
            data: response.result
        },
        status: 'success'
    }
}

//初始化所有数据来源的表格数据
export const tableDataFilter = (response) => {
    let tableData = [];
    if (response && response.result) {
        for (let prop in response.result) {
            let tableRow = {
                name: prop,
                count: response.result[prop].reduce((prev, cur) => {
                    return prev + cur.user_cnt * 1;
                }, 0),
                child: response.result[prop]
            }
            tableData.push(tableRow);
        }
    }

    return {
        result: tableData,
        status: 'success'
    }
}


export const changeTrendDate = (event) => {
    let beginDate = moment(event).subtract(7, 'days').format('YYYY-MM-DD');
    let endDate = moment(event).format('YYYY-MM-DD');
    return JSON.stringify({
        trendDate: [beginDate, endDate]
    })
}