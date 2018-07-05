import moment from 'moment';
import { truncate, range, padStart } from 'lodash';

export const compareText = (type: string = 'day', index: number = 0) => {
  if (type === 'day') return ['较前一日', '较上周'][index];
  if (type === 'week') return ['较前一周', '较上月同周'][index];
  if (type === 'month') return ['较前一月', '较去年同月'][index];
};

export const timeSpan = (str: string) => {
  if (str === '轻餐') return 45;
  if (str === '正餐') return 90;
  if (str === '泛行业' || str === '零售商') return 180;
};

const DEFALUT_GAP = { day: 90, week: 12, month: 3 };

const MAP = { day: 'd', week: 'w', month: 'M', year: 'y' };

export const OFillHour = (result = [], hourKey: string = 'hr') => {
  const now = new Date().getHours();
  const hours = range(now + 1).map(item => padStart(`${item}`, 2, '0'));
  const obj = {};
  result.forEach(item => obj[item[hourKey]] = item);
  return hours.map((item) => {
    if (obj[item]) return obj[item];
    else return { [hourKey]: item };
  });
};

export const crmET = (str: string, type: string = 'day') => {
  if (type === 'day') {
    return moment(str);
  }
  if (type === 'week') {
    const m = moment(str);
    if (m.format('dd') === '日') {
      return m;
    } else {
      return m.weekday(-1);
    }
  }
  if (type === 'month') {
    const m = moment(str);
    const now = m.date();
    const last = m.add(1, 'm').date(0).date();
    if (now === last) return m;
    else return moment(str).date(0);
  }
};

export const crmST = (str: any, type: string = 'day', gap: any = DEFALUT_GAP) => {
  return crmET(str, type).subtract(gap[type], MAP[type]).add(1, 'd');
};

export const crmLST = (str: any, type: string = 'day') => {
  return crmST(str, type, { day: 1, week: 1, month: 1 });
};

export const crmDGap = (str: any, type: string = 'day', level: number = 1) => {
  const m = moment(str);
  if (level === 1) {
    return m.subtract(1, MAP[type]);
  } else if (level === 2) {
    if (type === 'day') return m.subtract((7 as any), MAP[type]);
    if (type === 'week') return m.subtract((4 as any), MAP[type]);
    if (type === 'month') return m.subtract((12 as any), MAP[type]);
  }
};

export const crmEllipsis = (str: string, el: number = 5, sl: number = 8) => {
  if (str && str.length > sl + el - 3) {
    const e = str.slice(-el);
    const s = str.slice(0, -el);
    return `${truncate(s, { length: sl })}${e}`;
  }
  return str;
};

export const changeRankType = (event, rankType) => {
  if (event.length === 1) {
    if (event[0] !== 'ALL') {
      if (rankType === 'province') {
        return 'city';
      }
    }
  } else if (event.length === 2) {
    if (rankType !== 'shop') {
      return 'shop';
    }
  }
  return rankType;
};

export const getLevel = (event) => {
  if (event.length === 1 && event[0] === 'ALL') return 1;
  else if (event.length === 1) return 2;
  return 3;
};

export const addAllOption = ({ result = [], ...rest }) => {
  return {
    result: [{ i: 'ALL', n: '全国' }].concat(result),
    ...rest,
  };
};
