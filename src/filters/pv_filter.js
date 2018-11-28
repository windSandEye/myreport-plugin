/*
PV报表页面
*/
import numeral from 'numeral';
// export const barLineFilter = (response) => {
//     let data = response.result ? response.result : [];
//     //按照日期分组
//     let dtList = groupBy(data, (item) => {
//         return item.dt;
//     })

//     let barData = [];
//     for (let dtGroup of dtList) {
//         //页面分组
//         let pageList = groupBy(dtGroup, (item) => {
//             return item.name.split("-")[0]
//         });
//         let row = {};
//         for (let pageGroup of pageList) {
//             let fristItem = pageGroup[0];
//             if (!row.dt) {
//                 row.dt = fristItem.dt;
//             }
//             let pageName = fristItem.name.split("-")[0];
//             //统计总数
//             let pageCnt = pageGroup.reduce((prev, cur) => {
//                 return prev + parseInt(cur.cnt);
//             }, 0);

//             switch (pageName) {
//                 case '实名页':
//                     row.realname_page_cnt = pageCnt;
//                     break;
//                 case '花呗签约页':
//                     row.hb_page_cnt = pageCnt;
//                     break;
//                 case '短信验证页':
//                     row.msg_page_cnt = pageCnt;
//                     break;
//                 case '注册页':
//                     row.regist_page_cnt = pageCnt;
//                     break;
//                 case '引导页':
//                     row.boot_page_cnt = pageCnt;
//                     break;
//                 case '其它方式页':
//                     row.other_page_cnt = pageCnt;
//                     break;
//                 case '注册点击':
//                     row.regist_click_cnt = pageCnt;
//                     break;
//                 case '登录点击':
//                     row.login_click_cnt = pageCnt;
//                     break;
//             }
//         }
//         barData.push(row);

//     }

//     return {
//         result: barData,
//         status: 'success'
//     }

// }

// const groupBy = (list, fn) => {
//     const groups = {};
//     list.forEach(function (o) {
//         const group = JSON.stringify(fn(o));
//         groups[group] = groups[group] || [];
//         groups[group].push(o);
//     });
//     return Object.keys(groups).map(function (group) {
//         return groups[group];
//     });
// }

export const tooltipFilter = (params) => {
    let tooltip = `${params[0].name}<br/>`
    for (let param of params) {
        if (JSON.stringify(param.value).indexOf('.') == -1) {
            tooltip = tooltip
                + '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params[0].color};"></span>'
                + `${param.seriesName}:${numeral(param.value).format('0,0')}<br/>`
        }else{
            tooltip = tooltip
            + '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params[0].color};"></span>'
            + `${param.seriesName}:${numeral(param.value).format('0.00%')}<br/>`
        }
    }
    return tooltip
}