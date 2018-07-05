import moment from 'moment';

export const lastSunday = (str: string) => {
  const m = str ? moment(str) : moment().add(-1, 'd');
  let last;
  if (m.format('dd') === '日') {
    last = m;
  } else {
    last = m.weekday(-1);
  }
  return last;
};

export const getWeekList = (l = 8) => {
  const last = lastSunday('');
  const list = [];
  for (let i = 0; i <= l; i++) {
    const d = [moment(last).add((i + 1) * -7 + 1, 'd'), moment(last).add(i * -7, 'd')];
    list.push({
      value: d[1].format('YYYYMMDD'),
      label: d.map(item => item.format('MM/DD')).join('-'),
    });
  }
  return JSON.stringify(list);
};
