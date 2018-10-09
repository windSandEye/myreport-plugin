import moment from 'moment';
import numeral from 'numeral';
import lodash from 'lodash';

const color = ['#FA5A48', '#10ABE8', '#F79A28', '#B1D65D', '#B6A1E0', '#FED625', '#1DC7CA', '#FF9185',
    '#6e7074', '#546570', '#c4ccd3', '#3df7a9', '#2db70a', '#63390e', '#cfe8ff', '#c4dc65', '#7bf9e7'];

//本日、本周、本月日期计算
export const changeReportRange = (e, type) => {
    let date = moment().date();
    let week = moment().day();
    let today = moment().format("YYYY-MM-DD");
    switch (type) {
        case 'date':
            return JSON.stringify({
                report_date_range: [today, today]
            });
        case 'month':
            let monthFirst = moment().subtract(date - 1, 'days');
            return JSON.stringify({
                report_date_range: [monthFirst, today]
            });
        default:
            let weekFirst = moment().subtract(week, 'days');
            return JSON.stringify({
                report_date_range: [weekFirst, today]
            });
    }
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


//签约解约数据处理
export const signDataFilter = (response) => {
    let signData = {
        num: 0,
        wow: 0
    }
    if (response.result && response.result.length > 0) {
        signData = response.result[0];
        signData.wow = signData.wow ? signData.wow : 0;
    }
    return {
        result: signData,
        status: 'success'
    }
}

//选择最近一月
export const selectLastMonthFilter = (event) => {
    let today = moment().format("YYYY-MM-DD");
    let lastMonth = moment().subtract(30, 'days');
    return JSON.stringify({
        sign_terminate_date: [lastMonth, today]
    }
    );
}

//签约折线图时间变更
export const changeSignRangeFilter = (event) => {
    let beginDate = moment(event).subtract(30, 'days');
    return JSON.stringify(
        {
            sign_terminate_date: [beginDate, event],
            report_date_range: [beginDate, event]
        }
    );
}

//关系占比数据处理
export const relationDataFilter = (response) => {
    let relationData = response.result ? response.result : [];

    let unknownIndex = relationData.findIndex(item => item.relation_type == '未知');
    let unknown = relationData[unknownIndex];
    relationData.splice(unknownIndex, 1);
    for (let i = 0; i < relationData.length; i++) {
        relationData[i].color = color[i];
        if (!relationData[i].relation_type) {
            relationData[i].relation_type = "未知"
            if (unknown) {
                relationData[i].num = relationData[i].num * 1 + unknown.num * 1
                relationData[i].ratio = relationData[i].ratio * 1 + unknown.ratio * 1
            }
        }
    }
    return {
        result: relationData,
        status: 'success'
    }
}

//金额排序
export const quotaSortFilter = (data) => {
    data = data ? data : [];
    //排序
    data = data.sort((a, b) => {

        let aFirst = a.quota_area.split(',')[0].substring(1);
        let bFirst = b.quota_area.split(',')[0].substring(1);
        if (a.quota_area == '[0-100]') {
            aFirst = 0
        }
        if (b.quota_area == '[0-100]') {
            bFirst = 0
        }
        if (a.quota_area == '10000+') {
            aFirst = 10000
        }
        if (b.quota_area == '10000+') {
            bFirst = 10000
        }
        if (aFirst * 1 > bFirst * 1) {
            return 1;
        } else if (aFirst * 1 < bFirst * 1) {
            return -1;
        } else {
            return 0;
        }
    })

    return data;
}


export const moneySettringFilter = (data, type) => {
    if (!data) {
        data = [];
    }

    let settingObj = data.find(item => item.quota_area == type);
    let settingCount = data.reduce((prev, cur) => {
        return prev + parseInt(cur.num);
    }, 0);
    let settingData = [];
    if (settingObj) {
        let otherValue = settingCount - settingObj.num * 1;
        let percent = settingCount != 0 ? settingObj.num * 1 / settingCount : 0;
        settingData = [
            { name: settingObj.quota_area, value: settingObj.num, percent: percent },
            { name: '其他', value: otherValue, percent: 1 - percent }
        ]
    }
    return settingData;
}

export const percentFilter = (value, data) => {
    if (!data) {
        data = [];
    }
    let settingCount = data.reduce((prev, cur) => {
        return prev + parseInt(cur.num);
    }, 0);
    let percent = settingCount != 0 ? value * 1 / settingCount : 0;
    return percent;
}

//年龄表格处理
export const ageTableFilter = (response) => {
    let ageTable = response.result ? response.result : [];
    let rowDate = null;
    let tableData = [];
    let newRow = {};
    for (let row of ageTable) {
        if (row.dt != rowDate) {
            rowDate = row.dt;
            newRow = {};
            newRow['dt'] = row.dt;
            tableData.push(newRow);
        }

        switch (row.business_principal_age_phase) {
            case '20以下':
                newRow.age0 = row.num * 1;
                newRow.age0Ratio = row.ratio * 1;
                break;
            case '20~29':
                newRow.age1 = row.num * 1;
                newRow.age1Ratio = row.ratio * 1;
                break;
            case '30~39':
                newRow.age2 = row.num * 1;
                newRow.age2Ratio = row.ratio * 1;
                break;
            case '40~49':
                newRow.age3 = row.num * 1;
                newRow.age3Ratio = row.ratio * 1;
                break;
            case '50~59':
                newRow.age4 = row.num * 1;
                newRow.age4Ratio = row.ratio * 1;
                break;
            case '60~69':
                newRow.age5 = row.num * 1;
                newRow.age5Ratio = row.ratio * 1;
                break;
            case '70(包含)以上':
                newRow.age6 = row.num * 1;
                newRow.age6Ratio = row.ratio * 1;
                break;
            case '未知':
                newRow.age7 = row.num * 1;
                newRow.age7Ratio = row.ratio * 1;
                break;
        }
    }
    return {
        result: tableData,
        status: 'success'
    }
}

//金额表格处理
export const quotaTableFilter = (response) => {
    let quotaTable = response.result ? response.result : [];
    let rowDate = null;
    let tableData = [];
    let newRow = {};
    for (let row of quotaTable) {
        if (row.dt != rowDate) {
            rowDate = row.dt;
            newRow = {};
            newRow['dt'] = row.dt;
            tableData.push(newRow);
        }

        switch (row.quota_area) {
            case '[0-100]':
                newRow.quota0 = row.num;
                newRow.quota0Ratio = row.ratio;
                break;
            case '(100,300]':
                newRow.quota1 = row.num;
                newRow.quota1Ratio = row.ratio;
                break;
            case '(300,500]':
                newRow.quota2 = row.num;
                newRow.quota2Ratio = row.ratio;
                break;
            case '(500,1000]':
                newRow.quota3 = row.num;
                newRow.quota3Ratio = row.ratio;
                break;
            case '(1000,2000]':
                newRow.quota4 = row.num;
                newRow.quota4Ratio = row.ratio;
                break;
            case '(2000,5000]':
                newRow.quota5 = row.num;
                newRow.quota5Ratio = row.ratio;
                break;
            case '(5000,10000]':
                newRow.quota6 = row.num;
                newRow.quota6Ratio = row.ratio;
                break;
            case '10000+':
                newRow.quota7 = row.num;
                newRow.quota7Ratio = row.ratio;
                break;
        }
    }
    return {
        result: tableData,
        status: 'success'
    }
}


//签约解约表格和折线图数据
export const signTableFilter = (response) => {
    let signTable = [];
    if (response.result) {
        let resultObj = response.result
        let signCurrList = resultObj.sign_curr ? resultObj.sign_curr : [];
        let unsignCurrList = resultObj.unsign_curr ? resultObj.unsign_curr : [];
        let signAndunsignCurrList = resultObj.un_sign_curr ? resultObj.un_sign_curr : [];
        let signAcountList = resultObj.sign_acount ? resultObj.sign_acount : [];
        let unsignAcountList = resultObj.unsign_acount ? resultObj.unsign_acount : [];
        let signAndunsignAcountList = resultObj.un_sign_acount ? resultObj.un_sign_acount : [];

        if (signCurrList.length > 0) {
            for (let i = 0; i < signCurrList.length; i++) {
                let row = {
                    dt: signCurrList[i].dt,
                    signCurrNum: signCurrList[i].num,
                    signCurrWow: signCurrList[i].wow,
                    unsignCurrNum: unsignCurrList[i].num,
                    unsignCurrWow: unsignCurrList[i].wow,
                    signAndunsignCurrNum: signAndunsignCurrList[i].num,
                    signAndunsignCurrWow: signAndunsignCurrList[i].wow,
                    signAccountNum: signAcountList[i].num,
                    signAccountWow: signAcountList[i].wow,
                    unsignAccountNum: unsignAcountList[i].num,
                    unsignAccountWow: unsignAcountList[i].wow,
                    signAndunsignAcountNum: signAndunsignAcountList[i].num,
                    signAndunsignAcountWow: signAndunsignAcountList[i].wow,

                }
                signTable.push(row)
            }
        }
    }
    return {
        result: {
            signTable: signTable
        },
        status: 'success'
    }
}

//亲情号开通前用户支付能力
export const prePaymentFilter = (response) => {
    let paymentData = response.result ? response.result : [];
    let rowDate = null;
    let tableData = [];
    let newRow = {};
    for (let row of paymentData) {
        if (row.dt != rowDate) {
            rowDate = row.dt;
            newRow = {};
            newRow['dt'] = row.dt;
            tableData.push(newRow);
        }

        switch (row.pay_ability_pre) {
            case '0':
                newRow.T0 = row.num * 1;
                newRow.T0Ratio = row.ratio * 1;
                break;
            case '1':
                newRow.T1 = row.num * 1;
                newRow.T1Ratio = row.ratio * 1;
                break;
            case '2':
                newRow.T2 = row.num * 1;
                newRow.T2Ratio = row.ratio * 1;
                break;
            case '3':
                newRow.T3 = row.num * 1;
                newRow.T3Ratio = row.ratio * 1;
                break;
            case '4':
                newRow.T4 = row.num * 1;
                newRow.T4Ratio = row.ratio * 1;
                break;
        }
    }
    return {
        result: {
            data: tableData
        },
        status: 'success'
    }
}

//使用数据处理
export const useDataFilter = (response, useTpye) => {
    let useData = {};
    useData[useTpye + "_num"] = 0;
    useData['wow'] = 0;
    if (response.result && response.result.length > 0) {
        useData = response.result[0];
        useData.wow = useData.wow ? useData.wow : 0;
    }
    return {
        result: useData,
        status: 'success'
    }
}

//使用分析表格处理
export const useTableFilter = (response) => {
    let useTable = [];
    if (response.result) {
        let resultObj = response.result
        let tradeList = resultObj.trade ? resultObj.trade : [];
        let quotaList = resultObj.quota ? resultObj.quota : [];
        let userList = resultObj.user ? resultObj.user : [];
        let tradeMonthList = resultObj.trade_month ? resultObj.trade_month : [];
        let quotaMonthList = resultObj.quota_month ? resultObj.quota_month : [];
        let userMonthList = resultObj.user_month ? resultObj.user_month : [];

        if (tradeList.length > 0) {
            for (let i = 0; i < tradeList.length; i++) {
                let row = {
                    dt: tradeList[i].dt,
                    tradeNum: tradeList[i].trade_num ? tradeList[i].trade_num * 1 : null,
                    tradeWow: tradeList[i].wow ? tradeList[i].wow * 1 : null,
                    quotaNum: quotaList[i].quota_num ? quotaList[i].quota_num * 1 : null,
                    quotaWow: quotaList[i].wow ? quotaList[i].wow * 1 : null,
                    userNum: userList[i].user_num ? userList[i].user_num * 1 : null,
                    userWow: userList[i].wow ? userList[i].wow * 1 : null,
                    tradeMonthNum: tradeMonthList[i].trade_num ? tradeMonthList[i].trade_num * 1 : null,
                    tradeMonthWow: tradeMonthList[i].wow ? tradeMonthList[i].wow * 1 : null,
                    quotaMonthNum: quotaMonthList[i].quota_num ? quotaMonthList[i].quota_num * 1 : null,
                    quotaMonthWow: quotaMonthList[i].wow ? quotaMonthList[i].wow * 1 : null,
                    userMonthNum: userMonthList[i].user_num ? userMonthList[i].user_num * 1 : null,
                    userMonthWow: userMonthList[i].wow ? userMonthList[i].wow * 1 : null,

                }
                useTable.push(row)
            }
        }
    }
    return {
        result: useTable,
        status: 'success'
    }
}

//支付能力跃迁
export const paymentChangeFilter = (response) => {
    let paymentData = response.result ? response.result : [];
    let tableData = [];
    let t0To3 = paymentData.find(item => item.pay_ability_pre == 0 && item.business_principal_payability == 3);
    let t0To4 = paymentData.find(item => item.pay_ability_pre == 0 && item.business_principal_payability == 4);
    let row0 = {
        name: 'T0',
        T3: t0To3 ? t0To3.num * 1 : null,
        T4: t0To4 ? t0To4.num * 1 : null,
    }
    tableData.push(row0)

    let t1To3 = paymentData.find(item => item.pay_ability_pre == 1 && item.business_principal_payability == 3);
    let t1To4 = paymentData.find(item => item.pay_ability_pre == 1 && item.business_principal_payability == 4);
    let row1 = {
        name: 'T1',
        T3: t1To3 ? t1To3.num * 1 : null,
        T4: t1To4 ? t1To4.num * 1 : null,
    }
    tableData.push(row1)

    let t2To3 = paymentData.find(item => item.pay_ability_pre == 2 && item.business_principal_payability == 3);
    let t2To4 = paymentData.find(item => item.pay_ability_pre == 2 && item.business_principal_payability == 4);
    let row2 = {
        name: 'T2',
        T3: t2To3 ? t2To3.num * 1 : null,
        T4: t2To4 ? t2To4.num * 1 : null,
    }
    tableData.push(row2)

    let t3To3 = paymentData.find(item => item.pay_ability_pre == 3 && item.business_principal_payability == 3);
    let t3To4 = paymentData.find(item => item.pay_ability_pre == 3 && item.business_principal_payability == 4);
    let row3 = {
        name: 'T3',
        T3: t3To3 ? t3To3.num * 1 : null,
        T4: t3To4 ? t3To3.num * 1 : null,
    }
    tableData.push(row3)

    let t4To3 = paymentData.find(item => item.pay_ability_pre == 4 && item.business_principal_payability == 3);
    let t4To4 = paymentData.find(item => item.pay_ability_pre == 4 && item.business_principal_payability == 4);
    let row4 = {
        name: 'T4',
        T3: t4To3 ? t4To3.num * 1 : null,
        T4: t4To4 ? t4To4.num * 1 : null,
    }
    tableData.push(row4)

    return {
        result: tableData,
        status: 'success'
    }
}


//场景分析
export const screenDataFilter = (response) => {
    let screenData = response.result ? response.result : [];
    let screen10 = screenData.slice(0, 10);

    let yAxisData = [];
    let seriesData = [];
    for (let item of screen10) {
        yAxisData.unshift(item.unidata_bizname);
        seriesData.unshift(item.trade_num);
    }

    const rtn = {
        result: {
            grid: {
                top: 20,
                bottom: 20,
                left: 20,
                right: 30
            },
            xAxis: {
                type: 'value',
                position: "top"
            },
            yAxis: {
                type: 'category',
                data: yAxisData,
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: (params) => {
                    let name = params[0].name;
                    let barObj = screenData.find(item => item.unidata_bizname == name);
                    return barObj.unidata_bizname + ":" + numeral(barObj.trade_num).format('0,0') + "(" + numeral(barObj.ratio).format('0.00%') + ")";
                }
            },
            series: [{
                type: 'bar',
                data: seriesData
            }]
        },
        status: 'success',
    };
    return rtn;


}

//场景分析表格
export const screenTableFilter = (response) => {
    let screenData = response.result ? response.result : [];
    let rowDate = null;
    let tableData = [];
    let newRow = {};
    for (let row of screenData) {
        if (row.dt != rowDate) {
            rowDate = row.dt;
            newRow = {};
            newRow['dt'] = row.dt;
            tableData.push(newRow);
        }

        switch (row.unidata_bizname) {
            case '集团收单-淘宝C2C(其他)':
                newRow.trade0 = row.trade_num * 1;
                newRow.trade0Ratio = row.ratio * 1;
                break;
            case '集团收单-天猫B2C(其他)':
                newRow.trade1 = row.trade_num * 1;
                newRow.trade1Ratio = row.ratio * 1;
                break;
            case '移动快捷app支付':
                newRow.trade2 = row.trade_num * 1;
                newRow.trade2Ratio = row.ratio * 1;
                break;
            case '外部商户交易':
                newRow.trade3 = row.trade_num * 1;
                newRow.trade3Ratio = row.ratio * 1;
                break;
            case '单笔转账到支付宝账户':
                newRow.trade4 = row.trade_num * 1;
                newRow.trade4Ratio = row.ratio * 1;
                break;
            case '新当面付':
                newRow.trade5 = row.trade_num * 1;
                newRow.trade5Ratio = row.ratio * 1;
                break;
            case '集团收单-天猫手机充值':
                newRow.trade6 = row.trade_num * 1;
                newRow.trade6Ratio = row.ratio * 1;
                break;
        }
    }
    return {
        result: tableData,
        status: 'success'
    }

}

//倒序排列
export const reverseArrFilter = (response) => {
    let arr = response.result ? response.result : [];
    return {
        result: arr.reverse(),
        status: 'success'
    }
}

//数组倒序
export const reverseArr = (data) => {
    data = data ? data : [];
    let revArr = lodash.cloneDeep(data);
    return revArr.reverse()
}


//年龄分析排序
export const ageSortFilter = (data) => {
    data = data ? data : [];
    let sortData = [];
    if (data.length > 1) {
        sortData.push(data[1]);
        sortData.push(data[0]);
        for (let i = 2; i < data.length; i++) {
            sortData.push(data[i])
        }
    }

    return sortData
}

export const relationOptionFilter = (event, showName, optionName) => {
    let obj = {};
    obj["T." + showName] = true;
    obj["T." + optionName] = event.name;
    return JSON.stringify(obj)
}

export const openTooltipFilter = (params) => {
    let tooltip = `${params[0].name}<br/>
    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params[0].color};"></span>
    ${params[0].seriesName}:${numeral(params[0].value).format('0,0')}<br/>
    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params[1].color};"></span>
    ${params[1].seriesName}:${numeral(params[1].value).format('0.00%')}`
    return tooltip
}


export const quotaOptionFilter = (event) => {
    if(event.name != '其他'){
        return JSON.stringify({
            "T.T.quotaOption":event.name
        })
    }   
}
