/*
 * @Author: yuanshubing 
 * @Date: 2018-07-20 14:31:22 
 * @Last Modified by: yuanshubing
 * @Last Modified time: 2018-07-25 16:24:46
 */
//用户支付维度
define(function (require, exports, module) {

    var moment = require('moment');
    //数据表名过滤
    exports.paramFilter = function (source) {
        var paramObj = source.data;

        //通用选项
        var commonList = [paramObj.is_new_user_order, paramObj.is_merchant];
        //常用选项
        var oftenList = [paramObj.pd_code, paramObj.biz_identity, paramObj.bizproduct, paramObj.payer_pay_ability,
        paramObj.is_online, paramObj.cashier_product, paramObj.major_pay_tool_type, paramObj.crd_cs_reg_from_type];
        //更多选项
        var moreList = [paramObj.ab_order_list, paramObj.payer_ab_user_list, paramObj.camp_id, paramObj.prize_id,
        paramObj.payer_gender, paramObj.payer_age_phase, paramObj.payer_res_city_degree, paramObj.payer_pay_city,
        paramObj.payer_occupation, paramObj.allpay_biz_success_orders_month, paramObj.unidata_biz_num_month,
        paramObj.avg_amount_range, paramObj.payer_own_dcdcnt, paramObj.payer_own_cdcnt, paramObj.payer_yeb_balance,
        paramObj.payer_hb_credit, paramObj.payer_irp_sign,
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
            if (values[i]) {//值存在则拼接
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

     //获取当前时间戳
     exports.getRefreshTime = function (e) {
        var timestamp = (new Date()).getTime();
        var refreshObj = {};
        refreshObj["T.refreshTime"] = timestamp;
        return JSON.stringify(refreshObj);
    }
});


