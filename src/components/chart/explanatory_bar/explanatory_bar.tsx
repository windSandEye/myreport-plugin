import React, { Component } from 'react';
import { utils } from '@alipay/report-engine';
import { Chart, Geom, Axis, Tooltip, Guide } from "bizcharts";
import moment from 'moment';
import numeral from 'numeral';
import lodash from 'lodash';
import './explanatory_bar.less';

const Html = Guide.Html;
interface ExplanatoryBarProps {
    height: number;
    width: number;
    fit: boolean;
    payAbility: string,
    onClick: any;
    source: any[]
}

class ExplanatoryBar extends Component<ExplanatoryBarProps> {

    static processAttributes = (attributes) => {
        utils.dealNumber(attributes, 'width');
        utils.dealNumber(attributes, 'height');
        utils.dealBoolean(attributes, 'fit');
        utils.dealTpl(attributes, 'source');
        utils.dealObject(attributes, 'source');
        utils.dealTpl(attributes, 'onClick');
        utils.dealTpl(attributes, 'payAbility');
    }

    static defaultProps = {
        height: 350,
        width: 1000,
        fit: true,
        source: []
    }

    componentWillReceiveProps(nextProps) {
        if (lodash.isEqual(this.props.source, nextProps.source)) {
            return JSON.stringify({ "T.selectBar": nextProps.source[nextProps.source.length - 1] })
        }
    }


    selectBar(event) {
        // window.scrollTo(0, 500);
        this.props.onClick(event.data._origin);
    }

    //获取辅助信心位置
    getGuidePosition(guideInfo) {
        const data = this.props.source;
        let max = 0;
        for (let barData of data) {
            if (max < barData.add_users * 1) {
                max = barData.add_users * 1;
            }
        }
        let pos = "top";
        if (guideInfo.add_users > max * 3 / 5) {
            pos = "leftDown";
        } else {
            pos = "leftUp";
        }
        return this.getGuideHtml(pos, guideInfo);
    }

    //获取辅助信息模板
    getGuideHtml(pos, guideInfo) {
        const template = `
          <div>
            <strong>${moment(guideInfo.dt).format('YYYY年MM月DD日')}</strong>
            <strong style="padding: 0 10px">${moment(guideInfo.dt).format('dddd')}</strong>
          </div>
          <div>
            <strong>${this.props.payAbility}净增用户量为</strong>
            <strong style="padding-left:10px;color: #3023FF">${numeral(guideInfo.add_users).format('0.00zh')}</strong>
          </div>
          <div>
            <span>最近1周累计净增T4用户量</span>
            <span style="padding-left:0px;color: #3023FF">${numeral(guideInfo.add_users_ms7).format('0.00zh')}</span>
            <span>,</span>
          </div>
          <div>
            <span>日均净增</span>
            <span style="padding-left:0;color: #3023FF">${numeral(guideInfo.add_users_ma7).format('0.00zh')}</span>
          </div>
          <div class="explanLine"></div>
    `;

        const gudiePos = { dt: guideInfo.dt, add_users: guideInfo.add_users };
        switch (pos) {
            case 'leftUp':
                return <Html
                    position={gudiePos}
                    html={`<div class="explanatoryBox leftUp">${template}</div>`}
                    offsetY={-101}
                    offsetX={-177}
                />
            case 'leftDown':
                return <Html
                    position={gudiePos}
                    html={`<div class="explanatoryBox leftDown">${template}</div>`}
                    offsetY={94}
                    offsetX={-225}
                />
            case 'rightDown':
                return <Html
                    position={gudiePos}
                    html={`<div class="explanatoryBox rightDown">${template}</div>`}
                    offsetY={94}
                    offsetX={253}
                />
            case 'top':
                return <Html
                    position={gudiePos}
                    html={`<div class="explanatoryBox top">${template}</div>`}
                    offsetY={-102}
                    offsetX={0}
                />
            default:
                return <Html
                    position={gudiePos}
                    html={`<div class="explanatoryBox">${template}</div>`}
                    offsetY={-101}
                    offsetX={193}
                />
        }

    }

    //获取辅助信息
    getGuideData() {
        const data = this.props.source;
        let guideData = [];
        if (Array.isArray(data) && data.length > 0) {
            let length = data.length;
            const lastObj = data[length - 1];
            const lastWeek = moment(lastObj.dt).subtract(7, 'days');
            const last7 = data.find(item => item.dt == moment(lastWeek).format('YYYYMMDD'));

            if (last7) {
                guideData.push(last7);
            }

            guideData.push(lastObj);
        }
        return guideData;
    }

    render() {
        const cols = {
            dt: {
                alias: '日(dt)[2018年]',
                tickCount: 10
            },
            add_users: {
                alias: '每日净增量',
                tickCount: 5
            },
            add_users_ma7: {
                alias: '净增用户量7日平均（MA7）',
                tickCount: 5
            }
        };


        const gudieData = this.getGuideData();
        let chartData = [];
        if (Array.isArray(this.props.source)) {
            chartData = this.props.source.map(item => {
                item.add_users = item.add_users * 1;
                item.add_users_ma7 = item.add_users_ma7 * 1;
                return item;
            })
        }

        return (
            <div>
                <Chart height={this.props.height} data={chartData} scale={cols}
                    forceFit padding={[20, 100, 60, 100]}
                    onIntervalClick={this.selectBar.bind(this)}
                >
                    <Axis name="dt" title={{ offset: 50 }} label={{
                        formatter: (text) => {
                            if (text) {
                                return moment(text).format("MM月DD日");
                            }
                        }
                    }} />
                    <Axis name="add_users" title={{ offset: 80 }} label={{
                        formatter: (text) => {
                            if (text) {
                                return numeral(text).format('0,0.00zh');
                            }
                        }
                    }}
                    />
                    <Axis name="add_users_ma7" title={{ offset: 80 }} label={{
                        formatter: (text) => {
                            if (text) {
                                return numeral(text).format('0,0.00zh');
                            }
                        }
                    }} />
                    <Tooltip
                        crosshairs={{
                            type: "y"
                        }}
                    />
                    <Geom type="interval" position="dt*add_users" tooltip={
                        ['dt*add_users', (dt, add_users) => {
                            return {
                                name: '每日净增量',
                                title: dt,
                                value: numeral(add_users).format('0,0.00zh')
                            };
                        }]
                    } />
                    <Geom type="line" position="dt*add_users_ma7" color="#fdae6b" size={3} shape="smooth" tooltip={
                        ['dt*add_users_ma7', (dt, add_users_ma7) => {
                            return {
                                name: '净增用户量7日平均',
                                title: dt,
                                value: numeral(add_users_ma7).format('0,0.00zh')
                            };
                        }]
                    } />
                    <Geom type="point" position="dt*add_users_ma7" color="#fdae6b" size={3} shape="circle" tooltip={
                        ['dt*add_users_ma7', (dt, add_users_ma7) => {
                            return {
                                name: '净增用户量7日平均',
                                title: dt,
                                value: numeral(add_users_ma7).format('0,0.00zh')
                            };
                        }]
                    } />
                    <Guide>
                        {
                            gudieData.map((item) => {
                                return this.getGuidePosition(item);
                            })
                        }
                    </Guide>
                </Chart>
            </div>
        );
    }
}

export default ExplanatoryBar;


