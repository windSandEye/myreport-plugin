import React, { Component } from "react";
import { utils } from '@alipay/report-engine';
import { getPixelRatio } from '../../common/treenode';
import numeral from 'numeral';
import lodash from 'lodash';

interface BulletProps {
    bulletId: string;
    ranges: number[];  //显示值范围
    width: number;  //组件宽度
    height: number; //组件高度
    titleDesc: string;  //描述标题
    actual: number; //真实值
    target: number;  //目标值
    unit: string;    //单位
    fit: boolean;      //是否自适应容器宽度
}

interface BulletState {
    rangeColor: string[];   //背景色
    actualColor: string;    //真实值颜色
    targetColor: string;    //目标值颜色
    arrowColor: string;      //箭头颜色
    bulletHeight: number;    //子弹高度
    titleWidth: number;      //描述标题所占长度
    titlePadding: number;    //标题与图形的间隔
    actualHeight: number;    //真实值高度
    targetHeight: number;    //目标值高度
    showTooltip: boolean;    //显示提示信息
    ratio: number;          //缩放设备像素比例
    mousePosition: MousePosition;//鼠标位置
}

//鼠标位置
interface MousePosition {
    x: number;   //相对画布的x值
    y: number;   //相对画布的y值
}

class Bullet extends Component<BulletProps>  {
    static processAttributes = (attributes) => {
        utils.dealTpl(attributes, 'width');
        utils.dealNumber(attributes, 'width');
        utils.dealTpl(attributes, 'height');
        utils.dealNumber(attributes, 'height');
        utils.dealTpl(attributes, 'titleDesc');
        utils.dealTpl(attributes, 'ranges');
        utils.dealObject(attributes, 'ranges');
        utils.dealTpl(attributes, 'actual');
        utils.dealNumber(attributes, 'actual');
        utils.dealTpl(attributes, 'target');
        utils.dealNumber(attributes, 'target');
        utils.dealTpl(attributes, 'unit');
        utils.dealTpl(attributes, 'fit');
        utils.dealBoolean(attributes, 'fit');
    }

    public state: BulletState = {
        rangeColor: ['#ffd7d4', '#ffe7c0', '#A7E8B4','#b0f7f3','#d2bbbb'],//背景色
        actualColor: '#223273',                       //真实值颜色
        arrowColor: '#d2bbbb',                        //箭头颜色
        targetColor: '#000000',                       //目标值颜色
        bulletHeight: 40,                             //子弹高度
        titleWidth: 120,                              //描述标题所占长度
        titlePadding: 10,                             //标题与图形的间隔
        actualHeight: 20,                             //真实值高度
        targetHeight: 34,                             //目标值高度
        showTooltip: false,                           //显示提示信息
        ratio: 1,
        mousePosition: {
            x: 0,
            y: 0
        }
    }

    static defaultProps = {
        bulletId: 'bullet1',                        //子弹图标识id
        width: 800,                                 //默认图形宽度
        height: 80,                                //默认图形高度
        ranges: [240, 365],                         //背景渲染数组
        titleDesc: 'FY19',                              //标题
        actual: 250,                                //实际值
        target: 240,                                //预期值
        unit: '',                                    //单位
        fit: true
    }

    componentDidMount() {
        this.redrawChart(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (!lodash.isEqual(this.props, nextProps)) {
            this.redrawChart(nextProps);
        }
    }


    //重绘
    redrawChart(props) {
        let canvas: any = document.getElementById(props.bulletId);
        const ctx = canvas.getContext('2d');
        let ratio = getPixelRatio(ctx);
        let scale = props.width / 800;
        if (props.fit) {
            let parentWidth = canvas.parentNode.offsetWidth;
            scale = parentWidth / 800;
            canvas.width = parentWidth * ratio;
        } else {
            canvas.width = props.width * ratio;
        }
        canvas.height = props.height * scale * ratio;
        scale = scale * ratio;

        this.setState({ ratio: 1 / ratio });
        ctx.clearRect(0, 0, canvas.width, canvas.height, null, false);

        this.drawBullet(ctx, canvas.width, canvas.height, scale, props);

        canvas.addEventListener('mousemove', (e) => {
            let eventX = e.clientX * ratio - canvas.getBoundingClientRect().left;
            let eventY = e.clientY * ratio - canvas.getBoundingClientRect().top;
            let mousePoint = { x: e.clientX, y: e.clientY };
            if (eventX > (this.state.titleWidth + this.state.titlePadding) * scale
                && eventX < canvas.width - this.state.titleWidth * scale
                && eventY > canvas.height * 0.55 - this.state.bulletHeight * scale / 2
                && eventY < canvas.height * 0.55 + this.state.bulletHeight * scale / 2
            ) {
                this.setState({ mousePosition: mousePoint, showTooltip: true });
            } else {
                this.setState({ showTooltip: false });
            }
        }, false)

        canvas.addEventListener('wheel', () => {
            this.setState({ showTooltip: false });
        }, false)
    }

    //绘制子弹图
    drawBullet(ctx, width, height, scale, props) {

        //辅助文字占据20%高度，子弹图占据80%高度。
        let topHeight = height * 0.1;
        let bulletHeight = height * 0.9;
        let bulletHCenter = topHeight + bulletHeight / 2;

        //标题文字
        if (props.titleDesc) {
            ctx.font = (16 * scale) + "px Arial";
            ctx.textAlign = "end";
            ctx.textBaseline = 'middle';
            ctx.fillText(props.titleDesc, this.state.titleWidth * scale, bulletHCenter);
        }

        //计算刻度
        let ranges = props.ranges;
        if (ranges.length == 0) {
            return;
        }
        let barWidth = width - (this.state.titleWidth * 2 + this.state.titlePadding + this.state.bulletHeight / 2) * scale;
        let maxMark = ranges[ranges.length - 1];//获取最大长度
        let mark = barWidth / maxMark;

        //画背景色
        for (let i = 0; i < ranges.length; i++) {
            let beginPos = (this.state.titleWidth + this.state.titlePadding) * scale;
            let bulletWidth = ranges[i] * mark;
            if (ranges[i - 1]) {
                beginPos = beginPos + ranges[i - 1] * mark;
                bulletWidth = (ranges[i] - ranges[i - 1]) * mark;
            }
            ctx.fillStyle = this.state.rangeColor[i];
            ctx.fillRect(beginPos, bulletHCenter - this.state.bulletHeight * scale / 2, bulletWidth, this.state.bulletHeight * scale);
        }
        //画三角箭头
        let bulletEnd = (this.state.titleWidth + this.state.titlePadding) * scale + maxMark * mark;
        ctx.beginPath();
        ctx.moveTo(bulletEnd, bulletHCenter - this.state.bulletHeight * scale / 2);
        ctx.lineTo(bulletEnd + this.state.bulletHeight / 2 * scale, bulletHCenter);
        ctx.lineTo(bulletEnd, bulletHCenter + this.state.bulletHeight * scale / 2);
        ctx.closePath();
        ctx.fillStyle = this.state.arrowColor;
        ctx.fill();

        //画真实值
        let actualBeginPos = (this.state.titleWidth + this.state.titlePadding) * scale;
        ctx.fillStyle = this.state.actualColor;
        ctx.fillRect(actualBeginPos,
            bulletHCenter - this.state.actualHeight * scale / 2,
            props.actual * mark,
            this.state.actualHeight * scale);

        //画目标值
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.moveTo((actualBeginPos + props.target * mark), bulletHCenter - this.state.targetHeight * scale / 2);
        ctx.lineTo((actualBeginPos + props.target * mark), bulletHCenter + this.state.targetHeight * scale / 2);
        ctx.fillStyle = this.state.targetColor;
        ctx.stroke();

        //画辅助文字
        //第一段目标值
        let fontSize = 14 * scale;
        ctx.font = fontSize + "px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = 'bottom';
        let targetTextX = actualBeginPos + props.target * mark / 2;
        let targetTextY = bulletHCenter - this.state.targetHeight * scale / 2 - 10 * scale
        ctx.fillText(props.target + props.unit, targetTextX, targetTextY);

        //画目标百分比
        let percent = numeral(props.target / maxMark).format('0.00%');
        ctx.fillText(percent, actualBeginPos + props.target * mark, targetTextY);

        //画超出预期部分辅助文字
        let overstep = maxMark - props.target;
        let overstepX = actualBeginPos + props.target * mark + overstep * mark / 2;
        ctx.fillText(overstep + props.unit, overstepX, targetTextY);

        //画最终值
        ctx.textAlign = "start";
        ctx.textBaseline = 'middle';
        ctx.fillText(maxMark + props.unit, bulletEnd + this.state.bulletHeight / 2 * scale + 10 * scale, bulletHCenter);

    }

    //获取提示的定位位置
    getTipPosition() {
        let tipDiv = document.getElementById(`${this.props.bulletId}Tip`);
        let mousePosition = this.state.mousePosition;
        let top1 = mousePosition.y + 12;
        let left = mousePosition.x + 12;
        if (tipDiv) {
            if (mousePosition.x + tipDiv.offsetWidth > window.innerWidth) {
                left = mousePosition.x - 12 - tipDiv.offsetWidth;
            }
            if (mousePosition.y + tipDiv.offsetHeight > window.innerHeight) {
                top1 = mousePosition.y - 12 - tipDiv.offsetHeight;
            }
        }
        return { top: top1, left: left }
    }

    render() {

        let position = this.getTipPosition();
        let tipClass: any = {
            position: 'fixed',
            zIndex: 999,
            visibility: this.state.showTooltip ? 'visible' : 'hidden',
            backgroundColor: 'rgba(50, 50, 50, 0.7)',
            top: position.top,
            left: position.left,
            padding: '10px',
            color: '#fff',
            borderRadius: '5px',
            textAlign: 'left'
        }

        return (
            <div {...this.props} >
                <canvas id={this.props.bulletId} width={this.props.width} height={this.props.height} style={{ zoom: this.state.ratio }}></canvas>
                <div style={tipClass} id={`${this.props.bulletId}Tip`}>
                    <div>{this.props.titleDesc}</div>
                    <div>
                        <span style={{
                            border: `5px solid ${this.state.actualColor}`, borderRadius: "5px", display: "inline-block", marginRight: "5px"
                        }}></span>
                        <span>实际值:{this.props.actual+this.props.unit}</span>
                    </div>
                    <div>
                        <span style={{
                            border: `5px solid ${this.state.targetColor}`,
                            borderRadius: "5px", display: "inline-block", marginRight: "5px"
                        }}></span>
                        <span>预期值:{this.props.target+this.props.unit}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default Bullet;
