import lodash from 'lodash';

//数组倒序
export const reverseArr = (data) => {
    data = data ? data : [];
    let revArr = lodash.cloneDeep(data);
    return revArr.reverse()
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

