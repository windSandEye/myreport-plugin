import moment from 'moment';

//本日、本周、本月日期计算
export const changeReportRange = (e,type) => {
    let date = moment().date();
    let week = moment().day();
    let today = moment().format("YYYY-MM-DD");
    switch (type) {
        case 'date':
            return JSON.stringify({
                report_date_range: [today, today]
            });
        case 'month':
            let monthFirst = moment().subtract(date-1, 'days');
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