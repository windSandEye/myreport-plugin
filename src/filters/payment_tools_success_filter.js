/*
 * @Author: yuanshubing 
 * @Date: 2018-08-10 15:41:15 
 * @Last Modified by: yuanshubing
 * @Last Modified time: 2018-08-28 15:18:18
 */
import moment from 'moment';
import numeral from 'numeral';

export const changePaymentToolsFilter = (event) => {
    return JSON.stringify({
        'T.payment_tool': event.name
    });
}


//各工具成功率和占比过滤
export const toolsSuccessFilter = (response) => {
    const rtn = {
        result: {
            data: response.result
        },
        status: 'success'
    };
    return rtn;
}

//去掉全部选项
export const eachToolFilter = (data) => {
    data = data.filter(item => item.pay_tool != '全部');
    return data;
}

//指定工具类型数据过滤
export const toolDataFilter = (response, toolName) => {
    let data = response.result || [];
    if (!toolName) {
        response.result = data.filter(item => item.pay_tool == '全部');
    }
    return response;
}

//判断是否是时间范围
export const isRangeDateFilter = (reportDate) => {
    if (reportDate) {
        let beginDate = reportDate[0].substring(0, 10);
        let endDate = reportDate[1].substring(0, 10);
        if (beginDate != endDate) {
            return true;
        } else {
            return false;
        }
    }
    return true;
}

export const pieToolTipFilter = (params) => {
    return params.name + ":" + params.value + "(" + params.percent + "%)";
}

//雷达图
export const chartRadarFilter = (data, dataType) => {
    //获取图例
    let lengendList = [];
    let groupData = getDataByGroup(data.result);
    for (let group of groupData) {
        lengendList.push(group.id);
    }

    const rtn = {
        result: {
            title: {
                text: dataType == "success" ? '支付成功率' : '支付工具占比(%)',
                left: '0'
            },
            legend: {
                bottom: 10,
                right: 10,
                orient: 'vertical',
                data: lengendList
            },
            tooltip: {
                trigger: 'item'
            },
            radar: {
                indicator: getRadarAxis(data.result, dataType)
            },
            series: setRadarSeries(data.result, dataType),
        },
        status: 'success',
    };
    return rtn;
}

//获取雷达图坐标轴
const getRadarAxis = (data, dataType) => {
    let axisList = [];
    if (data && data.length > 0) {
        let firstDate = data[0].dt;
        let oneDayData = data.filter(one => one.dt == firstDate); //过滤出某一天的数据
        for (let item of oneDayData) {
            let axisObj = {
                text: item.pay_tool,
                max: dataType == 'success' ? 1 : 100
            }
            axisList.push(axisObj);
        }
    }
    return axisList;
}

//获取分组数据
const getDataByGroup = (data) => {
    let map = {};
    let groupArr = [];
    for (let item of data) {
        if (!map[item.dt]) { //如果map对象不存在该分组
            groupArr.push({
                id: item.dt,
                data: [item]
            })
            map[item.dt] = item;
        } else {
            let currentGroup = groupArr.find(group => group.id == item.dt);
            currentGroup.data.push(item);
        }
    }

    //排序
    let axisList = getRadarAxis(data);
    for (let group of groupArr) {
        let orderGroupData = [];
        for (let axis of axisList) {
            let axisData = group.data.find(item => item.pay_tool == axis.text);
            orderGroupData.push(axisData);
        }
        group.data = orderGroupData;
    }

    return groupArr;
}

//设置雷达图series
const setRadarSeries = (data, dataType) => {
    let series = [];
    let radarGroup = getDataByGroup(data);

    for (let radar of radarGroup) {
        series.push({
            name: dataType == 'success' ? '支付工具成功率' : '支付工具占比(%)',
            type: 'radar',
            symbol: 'none',
            lineStyle: {
                width: 1
            },
            emphasis: {
                areaStyle: {
                    color: 'rgba(0,250,0,0.3)'
                }
            },
            data: [getRadarSeriesData(radar, dataType)]
        });
    }
    return series;
}

const getRadarSeriesData = (groupData, dataType) => {
    let valueArr = [];
    let allOrdCnt = 0;
    if (dataType != 'success') {
        allOrdCnt = groupData.data.reduce((prev, cur) => {
            return prev + cur.ord_cnt * 1;
        }, 0);
    }

    for (let valueObj of groupData.data) {
        if (dataType == 'success') {
            valueArr.push(valueObj.ord_succ_rate);
        } else {
            let percent = valueObj.ord_cnt * 1 / allOrdCnt * 1;
            valueArr.push(percent * 100);
        }

    }
    return {
        value: valueArr,
        name: groupData.id
    }
}

//支付工具占比趋势图
export const toolRateTrendFilter = (data, dataType) => {
    //获取图例
    let lengendList = [];
    let groupData = getDataByGroup(data.result);
    for (let group of groupData) {
        lengendList.push(group.id);
    }
    //获取x轴
    let axisList = [];
    if (groupData && groupData.length > 0) {
        for (let axis of groupData[0].data) {
            axisList.push(axis.pay_tool);
        }
    }

    const rtn = {
        result: {
            title: {
                text: dataType == 'success' ? '支付成功率' : '支付工具占比',
                left: 0
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    if (Object.prototype.toString.call(params) == '[object Array]') {
                        let tipStr = params[0].name + "<br/>";
                        for (let param of params) {
                            tipStr = tipStr + param.seriesName + ":" + numeral(param.value).format('0.00%') + "<br/>";
                        }
                        return tipStr;
                    }
                    return params.name + "<br/>" + params.seriesName + ":" + numeral(params.value).format('0.00%');
                }
            },
            grid: {
                top: 40,
                left: '5%',
                right: '5%',
                bottom: '20%'
            },
            legend: [{
                data: lengendList,
                bottom:10
            }],
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: axisList
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: function (val) {
                        return val * 100 + '%';
                    }
                },
            },
            series: setLineSeries(data.result, dataType),
        },
        status: 'success',
    };
    return rtn;
}

//设置折线图series
const setLineSeries = (data, dataType) => {
    let series = [];
    let lineGroup = getDataByGroup(data);
    if (lineGroup && lineGroup.length > 0) {
        let axisData = lineGroup[0].data;
        for (let line of lineGroup) {
            series.push({
                name: line.id,
                type: 'line',
                data: getLineData(line, axisData, dataType)
            })
        }
    }
    return series;
}

//获取单一折线图数据
const getLineData = (lineGroup, axisData, dataType) => {
    let lineData = [];
    let lineList = []
    if (dataType == 'success') {
        for (let line of lineGroup.data) {
            lineList.push({ name: line.pay_tool, value: line.ord_succ_rate });
        }
    } else {
        //获取总数
        let allOrdCnt = lineGroup.data.reduce((prev, cur) => {
            return prev + cur.ord_cnt * 1;
        }, 0);

        //计算占比
        for (let line of lineGroup.data) {
            let percent = line.ord_cnt * 1 / allOrdCnt;
            lineList.push({ name: line.pay_tool, value: percent });
        }
    }

    //排序
    for (let item of axisData) {
        let lineObj = lineList.find(l => l.name == item.pay_tool);
        lineData.push(lineObj.value);
    }
    return lineData;
}