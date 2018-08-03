/*
 * @Author: yuanshubing 
 * @Date: 2018-07-12 17:38:53 
 * @Last Modified by: yuanshubing
 * @Last Modified time: 2018-07-13 15:33:55
 */

//确定该选择哪张表
export const selectTableName = (pd_code,
    biz_identity, biz_product, payer_pay_ability, is_online, cashier_product, major_pay_tool_type,
    pay_tool, order_a, user_type_a, activity_id, prize_id, time_type, startTime, endTime, payer_gender,
    payer_age_phase, payer_res_city_degree, payer_pay_city, payer_occupation, payer_activity_day,
    allpay_biz_success_orders_month, unidata_biz_num_month, avg_amount) => {

    //通用列表
    // let commonList = [user_scope, is_merchant, report_date];
    //常用列表
    let oftenList = [pd_code, biz_identity, biz_product, payer_pay_ability, is_online, cashier_product, major_pay_tool_type, pay_tool];
    //更多列表
    let moreList = [order_a, user_type_a, activity_id, prize_id, time_type, startTime, endTime, payer_gender,
        payer_age_phase, payer_res_city_degree, payer_pay_city, payer_occupation, payer_activity_day,
        allpay_biz_success_orders_month, unidata_biz_num_month, avg_amount];

    let oftenNul = oftenList.some(item => item);
    let moreNull = moreList.some(item => item);
    if (oftenNul && !moreNull) {//存在通用，不存在更多
        return "{'tableName':'B'}";
    } else if (!oftenList && !moreList) {
        return "{'tableName':'A'}";
    } else {
        return "{'tableName':'C'}";
    }
}

//报表日期改变影响范围日期选择
export const changeDateRangeFilter = (e) => {
    var rangeDate = { report_date_range: [e.substring(0, 10), e.substring(0, 10)] };
    return JSON.stringify(rangeDate);
}

//拼接链接地址
export const jionUrlFilter = ()=>{

}

