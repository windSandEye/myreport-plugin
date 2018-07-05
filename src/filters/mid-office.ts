import { orderBy, padStart } from 'lodash';
export const sort = (result) => {
  if (result.detail.length > 0) {
    result.detail = orderBy(result.detail, (item) => {
      const { direct_sub_staff_realname = '', direct_sub_staff_no = '' } = item;
      if (!direct_sub_staff_realname) return 1;
      return  direct_sub_staff_no.indexOf('s') !== -1 ? 2 : 3;
    });
  }
  return result;
};

export const getId = (str: string) => {
  if (str) {
    const bl = str && str.indexOf('s') !== -1;
    return padStart(str, bl ? 7 : 6, '0');
  }
  return '';
};

export const hundred = (str) => {
  if (str) {
    if (str > 100) return 100;
    return str;
  }
  return 0;
};
