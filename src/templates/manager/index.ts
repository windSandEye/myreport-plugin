import moment from 'moment';
import numeral from 'numeral';
import './index.less';

export const weekday = (maxDate, minDate= '2017-07-06', step = 7) => {
  const max = moment(maxDate);
  const min = moment(minDate);
  const list = [];
  let index = 0;
  while (true) {
    const d = max.clone().add(step * index * -1, 'd');
    if (d.isAfter(min)) {
      list.push({
        label:  d.format('YYYY-MM-DD'),
        value: d.format('YYYYMMDD'),
      });
    } else {
      break;
    }
    index += 1;
  }
  return list.reverse();
};

export const CIndex = ({
  code, name, mode = 'default',
  periodType = 'day', size = 'default', helper,
  color = '#1890ff', href, modal,
  width = '95%', ...rest }) => {
  const formatter = ({ default: '0.00 zhC', percent: '0.00%' })[mode];
  const text = { day: ['日环比', '周同比'], month: ['周同比', '月同比'], year: ['月同比', '年同比'] };
  const codes = [];
  const cc = {
    day: [`${code}_day_on_day`, `${code}_week_on_week`],
    month: [`${code}_week_on_week`, `${code}_month_on_month`],
    year: [`${code}_month_on_month`, `${code}_year_on_year`],
  }[periodType];
  if (mode === 'percent') {
    codes.push(`
      <Text class="fn-ml5" color="{{${cc[0]}_value|color}}"
        value="{{(${cc[0]}_value * 100)|NFormat('+0.00')|SDefault('- -')}}pt"
      />
    `);
    codes.push(`
      <Text class="fn-ml5" color="{{${cc[1]}_value|color}}"
        value="{{(${cc[1]}_value * 100)|NFormat('+0.00')|SDefault('- -')}}pt"
      />
    `);
  } else {
    codes.push(`
      <Text class="fn-ml5" color="{{${cc[0]}|color}}"
        value="{{${cc[0]}|NFormat('+0.00%')|SDefault('- -')}}"
      />
    `);
    codes.push(`
      <Text class="fn-ml5" color="{{${cc[1]}|color}}"
        value="{{${cc[1]}|NFormat('+0.00%')|SDefault('- -')}}"
      />
    `);
  }
  const core = `
<div class="index-card ${size !== 'large' ? 'index-card-small' : ''} fn-p15 ft-14" data-id="${rest['data-id'] || ''}">
  <div class="fn-mb15">
  ${href ? `<a href="${href}" class="manager-link">` : ''}
  <div class="fn-mb5 ${size === 'large' ? 'ft-18' : 'ft-14'}">${name}</div>
  ${href ? `</a>` : ''}
  ${helper ? `<div class="ft-lightgray ft-12">${helper}</div>` : '' }
  </div>
  <Flex>
    <FlexItem style="flex: 6.18">
      ${modal ? `<Modal
        style="width: ${width}" title="${name}趋势" closable="true" transparent="true"><ModalTrigger>` : ''}
      <div class="${size === 'large' ? 'ft-24' : 'ft-20'}">
        <Text color="${color}" value="{{(${code})|NFormat('${formatter}')|SDefault('- -')}}" />
      </div>
      ${modal ? `</ModalTrigger><ModalContent children="url(${modal})"/></Modal>` : ''}
    </FlexItem>
    <FlexItem class="ft-lightgray" style="flex: 3.72">
      <div class="fn-mb5">
        ${text[periodType][0]}
        ${codes[0]}
      </div>
      <div>
        ${text[periodType][1]}
        ${codes[1]}
      </div>
    </FlexItem>
  </Flex>
</div>
`;
  return core;
};

export const BizTip = (params, mode) => {
  const { name, value } = params[0];
  return mode === 'percent' ?
  `<div class="fn-p5">${name}: ${numeral(value).format('0.00%')}</div>` :
  `<div class="fn-p5">${name}: ${numeral(value).format('0,00')}</div>`
  ;
};

export const BizChart = ({ period, source, xKey, yKey, mode, ...rest }) => {
  //
  const xml = `
    <div data-id="${rest['data-id'] || ''}">
      <div class="fn-p15">
        <SegmentedControl name="${period}" tintColor="#3399ff" realtime="true">
          <SegmentedControlItem value="1">1个月</SegmentedControlItem>
          <SegmentedControlItem value="3">3个月</SegmentedControlItem>
          <SegmentedControlItem value="6">6个月</SegmentedControlItem>
          <SegmentedControlItem value="12">12个月</SegmentedControlItem>
          <SegmentedControlItem value="48">更多</SegmentedControlItem>
        </SegmentedControl>
      </div>
      <Chart source="${source}" style="width: 100%; height: 3rem">
        <ChartGrid top="5%" bottom="15%" left="5%" right="5%"/>
        <ChartXAxis type="category" itemValue="{{${xKey} |DFormat('YYMMDD')}}"/>
        <ChartYAxis formatter="{{value|NFormat('${mode !== 'percent' ? '0 zhC' : '0%'}')}}"/>
        <ChartLine itemValue="{{ ${yKey} }}"/>
        <ChartTooltip trigger="axis" formatter="{{ params | BizTip('${mode}')}}" />
        <ChartDataZoom start="0" end="100" top="90%" bottom="0" type="slider"
          handleIcon="M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z"
        />
      </Chart>
    </div>
  `;
  return xml;
};
