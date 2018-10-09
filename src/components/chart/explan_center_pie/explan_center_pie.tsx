import React, { Component } from 'react';
import { utils } from '@alipay/report-engine';
import { Chart, Geom, Axis, Tooltip, Guide } from "bizcharts";
import moment from 'moment';
import './explanatory_bar.less';

const Html = Guide.Html;
interface ExplanCenterPieProps {
    height: number;
    width: number;
    fit: boolean;
    onClick: any;
    source: any[]
}

class ExplanCenterPie extends Component<ExplanCenterPieProps> {

    static processAttributes = (attributes) => {
        utils.dealNumber(attributes, 'width');
        utils.dealNumber(attributes, 'height');
        utils.dealBoolean(attributes, 'fit');
        utils.dealTpl(attributes, 'source');
        utils.dealObject(attributes, 'source');
        utils.dealTpl(attributes, 'onClick');
    }

    static defaultProps = {
        height: 350,
        width: 1000,
        fit: true,
        source: [
            { dt: "20180801", everydayIncrement: 38, last7Increment: 556 },
            { dt: "20180802", everydayIncrement: 44, last7Increment: 3533 },
            { dt: "20180803", everydayIncrement: 564, last7Increment: 555 },
            { dt: "20180804", everydayIncrement: 54, last7Increment: 4534 },
            { dt: "20180805", everydayIncrement: 546, last7Increment: 2321 },
            { dt: "20180806", everydayIncrement: 245, last7Increment: 1231 },
            { dt: "20180807", everydayIncrement: 57, last7Increment: 4534 },
            { dt: "20180808", everydayIncrement: 577, last7Increment: 4534 },
            { dt: "20180809", everydayIncrement: 355, last7Increment: 1231 },
            { dt: "20180810", everydayIncrement: 89, last7Increment: 2344 },
            { dt: "20180811", everydayIncrement: 566, last7Increment: 4534 },
            { dt: "20180812", everydayIncrement: 68, last7Increment: 773 },
            { dt: "20180813", everydayIncrement: 877, last7Increment: 4534 },
            { dt: "20180814", everydayIncrement: 544, last7Increment: 434 },
            { dt: "20180815", everydayIncrement: 222, last7Increment: 1234 },
            { dt: "20180816", everydayIncrement: 124, last7Increment: 7487 },
            { dt: "20180817", everydayIncrement: 565, last7Increment: 454 },
            { dt: "20180818", everydayIncrement: 675, last7Increment: 4577 },
            { dt: "20180819", everydayIncrement: 655, last7Increment: 4347 },
            { dt: "20180820", everydayIncrement: 47, last7Increment: 4567 },
            { dt: "20180821", everydayIncrement: 987, last7Increment: 8565 },
            { dt: "20180822", everydayIncrement: 565, last7Increment: 5756 },
            { dt: "20180823", everydayIncrement: 656, last7Increment: 987 },
            { dt: "20180824", everydayIncrement: 565, last7Increment: 5464 },
            { dt: "20180825", everydayIncrement: 338, last7Increment: 3556 },
            { dt: "20180826", everydayIncrement: 546, last7Increment: 7877 },
            { dt: "20180827", everydayIncrement: 38, last7Increment: 7867 },
            { dt: "20180828", everydayIncrement: 878, last7Increment: 7867 },
            { dt: "20180829", everydayIncrement: 456, last7Increment: 54345 },
            { dt: "20180830", everydayIncrement: 232, last7Increment: 3454 },
            { dt: "20180831", everydayIncrement: 456, last7Increment: 4634 },
        ]
    }

    selectBar(event) {
        window.scrollTo(0,500);
        this.props.onClick(event.data._origin.dt);
    }

    render() {
        const cols = {
            dt: {
                alias: '日(dt)[2018年]',
                tickCount: 10
            },
            everydayIncrement: {
                alias: '每日净增量'
            },
            last7Increment: {
                alias: '净增用户量7日平均（MA7）'
            }
        };

        const template = `
          <div>
            <strong>2018年8月2日</strong>
            <strong style="padding: 0 10px">星期二</strong>
          </div>
          <div>
            <strong>最近一周</strong>
            <strong style="padding: 0 10px">T4用户净增长量</strong>
            <strong style="padding-right:10px">为</strong>
            <span style="color: #3023FF">19</span>
            <span>万</span>
          </div>
          <div>
            <span>对比上一周T4用户均净增长量为</span>
            <span style="padding-left:0px">12万</span>
            <span>,</span>
          </div>
          <div>
            <span>周环比增长</span>
            <span style="padding-left: 10px; color: #3023FF">78.1</span>
            <span>%</span>
          </div>
          <div class="explanLine"></div>
    `;

        return (
            <div>
                <Chart height={this.props.height} data={this.props.source} scale={cols}
                    forceFit padding={[20, 100, 60, 100]}
                    onIntervalClick={this.selectBar.bind(this)}
                >
                    <Axis name="dt" title={{ offset: 50 }} label={{
                        formatter: (text) => {
                            if(text){
                                return moment(text).format("MM月DD日");
                            }
                        }
                    }} />
                    <Axis name="everydayIncrement" title={{ offset: 80 }} />
                    <Axis name="last7Increment" title={{ offset: 80 }} />
                    <Tooltip
                        crosshairs={{
                            type: "y"
                        }}
                    />
                    <Geom type="interval" position="dt*everydayIncrement" />
                    <Geom type="line" position="dt*last7Increment" color="#fdae6b" size={3} shape="smooth" />
                    <Geom type="point" position="dt*last7Increment" color="#fdae6b" size={3} shape="circle" />
                    <Guide>
                        <Html
                            position={{ dt: '20180806', everydayIncrement: 245 }}
                            html={`<div class="explanatoryBox">${template}</div>`}
                            offsetY={-101}
                            offsetX={203}
                        />
                        {/* <Html
                            position={{ year: "1957 年", sales: 145 }}
                            html={`<div class="explanatoryBox leftDown">${template}</div>`}
                            offsetY={94}
                            offsetX={-235}
                        />
                        <Html
                            position={{ year: "1957 年", sales: 145 }}
                            html={`<div class="explanatoryBox rightDown">${template}</div>`}
                            offsetY={94}
                            offsetX={261}
                        />
                        <Html
                            position={{ year: "1968 年", sales: 38 }}
                            html={`<div class="explanatoryBox leftUp">${template}</div>`}
                            offsetY={-101}
                            offsetX={-177}
                        />
                        <Html
                            position={{ year: "1965 年", sales: 38 }}
                            html={`<div class="explanatoryBox top">${template}</div>`}
                            offsetY={-102}
                            offsetX={0}
                        /> */}
                    </Guide>
                </Chart>
            </div>
        );
    }
}

export default ExplanCenterPie;
