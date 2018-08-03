define(function (require, exports, module) {

    var moment = require('moment');
    //数据表名过滤
    exports.paramFilter = function (source) {
        var paramObj = source.data;
        if (!paramObj) {
            return source;
        }

        //通用选项
        var commonList = [paramObj.is_new_user_order, paramObj.is_merchant];
        //常用选项
        var oftenList = [paramObj.pd_code, paramObj.biz_identity, paramObj.bizproduct, paramObj.payer_pay_ability,
            paramObj.is_online, paramObj.cashier_product, paramObj.major_pay_tool_type, paramObj.crd_cs_reg_from_type
        ];
        //更多选项
        var moreList = [paramObj.ab_order_list, paramObj.payer_ab_user_list, paramObj.camp_id, paramObj.prize_id,
            paramObj.payer_gender, paramObj.payer_age_phase, paramObj.payer_res_city_degree, paramObj.payer_pay_city,
            paramObj.payer_occupation, paramObj.allpay_biz_success_orders_month, paramObj.unidata_biz_num_month,
            paramObj.avg_amount_range, paramObj.payer_own_dcdcnt, paramObj.payer_own_cdcnt, paramObj.payer_yeb_balance,
            paramObj.payer_hb_credit, paramObj.payer_irp_sign
        ];

        //计算改选哪张表
        var oftenFlag = false;
        for (var i = 0; i < oftenList.length; i++) {
            var oftenObj = oftenList[i];
            if (oftenObj && oftenObj != "" && oftenObj != "[]") {
                oftenFlag = true;
                break;
            }
        }
        var moreFlag = false;
        for (var i = 0; i < moreList.length; i++) {
            if (moreList[i] && moreList[i] != "" && moreList[i] != "[]") {
                moreFlag = true;
                break;
            }
        }
        var tableName = "A";
        if (oftenFlag && !moreFlag) {
            tableName = "B";
        } else if (!oftenFlag && !moreFlag) {
            tableName = "A";
        } else {
            tableName = "C";
        }

        paramObj.table_name = tableName;
        return source;
    };



    function isArray(arry) {
        return Object.prototype.toString.call(arry) == '[object Array]';
    }

    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }

    //报表时间改变同步更新范围时间
    exports.changeDateRangeFilter = function (e) {
        var beginDate = moment(e.substring(0, 10)).subtract('days', 7);
        beginDate = moment(beginDate).format("YYYY-MM-DD");
        var rangeDate = [beginDate, e.substring(0, 10)];
        var rangeDateChange = {
            report_date_range: rangeDate,
            report_date_range1: [e.substring(0, 10), e.substring(0, 10)],
            report_date_range2: rangeDate,
            report_date_range_error: [e.substring(0, 10), e.substring(0, 10)],
            report_date_range3: [e.substring(0, 10), e.substring(0, 10)],
            report_date_range4: [e.substring(0, 10), e.substring(0, 10)],
            report_date_range5: [e.substring(0, 10), e.substring(0, 10)]
        }
        return JSON.stringify(rangeDateChange);
    }

    //图表属性url封装
    exports.optionUrlFilter = function (optionUrl, fileds, values) {
        var optionUrlObj = {};
        var optionUrlStr = "";
        var regex = new RegExp("^.*[\u4e00-\u9fa5]+.*$");
        for (var i = 0; i < fileds.length; i++) {
            if (values[i]) { //值存在则拼接
                if (regex.test(values[i])) {
                    optionUrlStr += (fileds[i] + "=" + encodeURIComponent(values[i]) + "&");
                } else {
                    optionUrlStr += (fileds[i] + "=" + values[i] + "&");
                }
            }
        }

        optionUrlStr = optionUrlStr.substring(0, optionUrlStr.length - 1);
        return optionUrlStr;
    }

    //响应数据处理
    exports.responseFilter = function (response) {
        var rtn = {
            result: {
                data: response.result
            },
            status: 'success'
        };
        return rtn;
    }

    // //柱状折线图
    //     <div id="bar-line-chart">
    //     <div render="{{table == false}}">
    //       <Chart source="{value:{{data | toJSON}}}" style="{'width':'90%','height':'350px','margin':'20px auto 0 auto'}" filters="{{ response | barLineCharFilter }}"/>
    //     </div>
    //   </div>
    // exports.barLineCharFilter = function (response, lengend) {

    //     var xAxisList = [];
    //     var data = response.result;
    //     for (var i = 0; i < data.length; i++) {
    //         xAxisList.push(data[i].x_1);
    //     }
    //     return {
    //         result: {
    //             tooltip: {
    //                 trigger: 'axis'
    //             },
    //             grid: {
    //                 top: '20%',
    //                 left: '70',
    //                 right: '70',
    //                 bottom: '70'
    //             },
    //             legend: {
    //                 data: lengend
    //             },
    //             xAxis: [
    //                 {
    //                     type: 'category',
    //                     axisTick: {
    //                         alignWithLabel: true
    //                     },
    //                     data: xAxisList
    //                 }
    //             ],
    //             dataZoom: [
    //                 {
    //                     type: 'slider',
    //                     xAxisIndex: 0,
    //                     filterMode: 'empty',
    //                     bottom: 20
    //                 },
    //                 {
    //                     type: 'slider',
    //                     yAxisIndex: 0,
    //                     filterMode: 'empty',
    //                     left: 20
    //                 },
    //                 {
    //                     type: 'slider',
    //                     yAxisIndex: 1,
    //                     filterMode: 'empty',
    //                     right: 20
    //                 }
    //             ],
    //             yAxis: [
    //                 {
    //                     type: 'value',
    //                     position: 'left',
    //                     formatter= function (value, index) {

    //                     }
    //                 },
    //                 {
    //                     type: 'value',
    //                     position: 'right',
    //                 }
    //             ],
    //             series: [
    //                 {
    //                     name: '蒸发量',
    //                     type: 'bar',
    //                     data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
    //                 },
    //                 {
    //                     name: '降水量',
    //                     type: 'bar',
    //                     yAxisIndex: 1,
    //                     data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
    //                 },
    //                 {
    //                     name: '平均温度',
    //                     type: 'line',
    //                     yAxisIndex: 2,
    //                     data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
    //                 }
    //             ]
    //         },
    //         status: 'success'
    //     }
    // }

    function NFormat(value, unit) {
        if (unit == '0.0 zh') {
            if (value.indexOf("E") > -1) {
                valueList = value.split("E");
                if (valueList[1] >= 4 && valueList[1] < 8) { //转化为万
                    var newValue = parseFloat(valueList[0]) * Math.pow(10, parseInt(valueList[1] - 4));
                    newValue = Math.round(newValue * 10) / 10; //保留一位小数
                    newValue = newValue + "万";
                }
            }
        }
    }

    //获取当前时间戳
    exports.getRefreshTime = function (e) {
        var timestamp = (new Date()).getTime();
        var refreshObj = {};
        refreshObj["T.refreshTime"] = timestamp;
        return JSON.stringify(refreshObj);
    }
});