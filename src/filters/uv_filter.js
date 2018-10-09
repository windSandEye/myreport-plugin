/*
UV聚合页面
*/


export const sourceChangeFilter = (event) => {
    if (event == 'all') {
        return JSON.stringify({ source: event, name: 'all', disableName: true })
    } else {
        return JSON.stringify({ source: event, disableName: false })
    }
}