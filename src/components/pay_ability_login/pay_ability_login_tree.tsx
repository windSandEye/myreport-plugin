import React, { Component } from 'react';
import { utils } from '@alipay/report-engine';
import lodash from 'lodash';
import { drawNode, drawLine, getPixelRatio, isRingPostion, floatSub, floatDivision } from '../common/treenode';

interface PayAbilityLoginTreeProps {
    source: any[],
    fit: boolean,
    width: number,
    height: number,
    nodeWidth: number,
    nodeHeight: number,
    radius: number,          //nodeWidth*0.2-10
    innerRadius: number,      //nodeWidth*0.2-25
    treeId: string
}

interface CanvasTreeState {
    color: string[];    //环图颜色
    treeData: any[];    //树形数据
    ratio: number;      //像素比
    tipNode: PieProps,  //提示对象
    mousePosition: positionProps    //鼠标位置
}

//饼图对象
class PieProps {
    desc: string;
    name: string;
    value: number;
}

//位置对象
class positionProps {
    x: number;
    y: number;
}

//树节点对象
class NodeProps {
    desc: string;
    count: number;
    percent: number;
    pieData: PieProps[];
    position: string;
    depth: number;
}

class PayAbilityLoginTree extends Component<PayAbilityLoginTreeProps> {

    static processAttributes = (attributes) => {
        utils.dealNumber(attributes, 'width');
        utils.dealNumber(attributes, 'height');
        utils.dealNumber(attributes, 'nodeWidth');
        utils.dealNumber(attributes, 'nodeHeight');
        utils.dealNumber(attributes, 'radius');
        utils.dealNumber(attributes, 'innerRadius');
        utils.dealBoolean(attributes, 'fit');
        utils.dealTpl(attributes, 'source');
        utils.dealObject(attributes, 'source');
    }

    public state: CanvasTreeState = {
        color: ['#0096FA', '#E9E9E9'],
        treeData: this.treeSource(this.props.source) || [],
        tipNode: null,
        ratio: 1,
        mousePosition: {
            x: 0,
            y: 0
        }
    };


    static defaultProps = {
        source: [
            // {
            //     position: "root", depth: 1, desc: "当日登陆用户", count: 2321341, percent: 100,
            //     pieData: [{ desc: "当日登陆用户",name: "当日登陆用户", value: "1" }]
            // },
            // {
            //     position: "left", depth: 2, desc: "当日新增登陆", count: 2321341, percent: 50,
            //     pieData: [{ name: "当日新增登陆", value: "0.6" }, { name: "非当日新增登陆", value: "0.4" }]
            // },
            // {
            //     position: "right", depth: 2, desc: "非当日新增登陆", count: 2321341, percent: 60,
            //     pieData: [{ name: "非当日新增登陆", value: "0.4" }, { name: "当日新增登陆", value: "0.6" }]
            // },
            // {
            //     position: "left", depth: 3, desc: "非T4用户", count: 2321341, percent: 20,
            //     pieData: [{ name: "非T4用户", value: "0.2" }, { name: "T4用户", value: "0.8" }]
            // },
            // {
            //     position: "right", depth: 3, desc: "非T4用户", count: 2321341, percent: 30,
            //     pieData: [{ name: "非T4用户", value: "0.2" }, { name: "T4用户", value: "0.8" }]
            // },
            // {
            //     position: "left", depth: 4, desc: "当日T4转化", count: 2321341, percent: 33,
            //     pieData: [{ name: "当日T4转化", value: "0.33" }, { name: "当日T4转化", value: "0.67" }]
            // },
            // {
            //     position: "right", depth: 4, desc: "当日T4转化", count: 2321341, percent: 22,
            //     pieData: [{ name: "当日T4转化", value: "0.22" }, { name: "非当日T4转化", value: "0.78" }]
            // },
            // {
            //     position: "left", depth: 5, desc: "七日T4转化", count: 2321341, percent: 66,
            //     pieData: [{ name: "七日T4转化", value: "0.66" }, { name: "非七日T4转化", value: "0.34" }]
            // },
            // {
            //     position: "right", depth: 5, desc: "七日T4转化", count: 2321341, percent: 55.5,
            //     pieData: [{ name: "七日T4转化", value: "0.555" }, { name: "非七日T4转化", value: "0.445" }]
            // },
            // {
            //     position: "left", depth: 6, desc: "三十日T4转化", count: 2321341, percent: 36.66,
            //     pieData: [{ name: "三十日T4转化", value: "0.3666" }, { name: "非三十日T4转化", value: "0.6334" }]
            // },
            // {
            //     position: "right", depth: 6, desc: "三十日T4转化", count: 2321341, percent: 23,
            //     pieData: [{ name: "三十日T4转化", value: "0.23" }, { name: "非三十日T4转化", value: "0.77" }]
            // }
        ],
        treeId: "payAbilityLoginTree",
        fit: false,
        width: 1000,
        height: 1000,
        nodeWidth: 300,
        nodeHeight: 150,
        radius: 65,          //nodeWidth*0.25-10
        innerRadius: 40      //nodeWidth*0.25-35
    }

    //源数据封装
    treeSource(source) {
        //当日新增登陆
        let firstLoginCount = source.reduce((prev, cur) => {
            if (cur.is_first_login == "1") {
                return prev + parseInt(cur.usercount);
            } else {
                return prev;
            }
        }, 0);

        //非当日新增登陆
        let notFirstLoginCount = source.reduce((prev, cur) => {
            if (cur.is_first_login == "0") {
                return prev + parseInt(cur.usercount);
            } else {
                return prev;
            }
        }, 0);

        //当日非T4
        let todayNotT4Count = source.reduce((prev, cur) => {
            if (cur.is_first_login == "1" && cur.pay_ability_yesterday != 4) {
                return prev + parseInt(cur.usercount);
            } else {
                return prev;
            }
        }, 0);

        //非当日非T4
        let yesterdayNotT4Count = source.reduce((prev, cur) => {
            if (cur.is_first_login == "0" && cur.pay_ability_yesterday != 4) {
                return prev + parseInt(cur.usercount);
            } else {
                return prev;
            }
        }, 0);

        //当日T4转化
        let todayT4Count = source.reduce((prev, cur) => {
            if (cur.is_first_login == "1" && cur.pay_ability_yesterday != 4 && cur.pay_ability_today == "4") {
                return prev + parseInt(cur.usercount);
            } else {
                return prev;
            }
        }, 0);

        //非当日T4转化
        let yesterdayT4Count = source.reduce((prev, cur) => {
            if (cur.is_first_login == "0" && cur.pay_ability_yesterday != 4 && cur.pay_ability_today == "4") {
                return prev + parseInt(cur.usercount);
            } else {
                return prev;
            }
        }, 0);

        //当日登陆用户
        let todayLoginCount = firstLoginCount + notFirstLoginCount;
        let sourceData = [];
        sourceData.push(this.createTreeNode("root", 1, "当日登陆用户", todayLoginCount, null));
        sourceData.push(this.createTreeNode("left", 2, "当日新增登陆", firstLoginCount, todayLoginCount));
        sourceData.push(this.createTreeNode("right", 2, "非当日新增登陆", notFirstLoginCount, todayLoginCount));
        sourceData.push(this.createTreeNode("left", 3, "非T4用户", todayNotT4Count, firstLoginCount));
        sourceData.push(this.createTreeNode("right", 3, "非T4用户", yesterdayNotT4Count, notFirstLoginCount));
        sourceData.push(this.createTreeNode("left", 4, "当日T4转化", todayT4Count, todayNotT4Count));
        sourceData.push(this.createTreeNode("right", 4, "当日T4转化", yesterdayT4Count, yesterdayNotT4Count));

        return sourceData;
    }

    createTreeNode(position, depth, desc, count, parentCount) {
        let treeNode = new NodeProps();
        treeNode.position = position;
        treeNode.depth = depth;
        treeNode.desc = desc;
        treeNode.count = count;
        treeNode.position = position;

        if (parentCount == null) {//根节点处理
            if (count != 0) {
                treeNode.percent = 100
                treeNode.pieData = [{ desc: desc, name: desc, value: 1 }, { desc: desc, name: "其他", value: 0 }]
            } else {
                treeNode.percent = 0
                treeNode.pieData = [{ desc: desc, name: desc, value: 0 }, { desc: desc, name: "其他", value: 1 }]
            }
        } else if (parentCount == 0) {//分母为0处理
            treeNode.percent = 0
            treeNode.pieData = [{ desc: desc, name: desc, value: 0 }, { desc: desc, name: "其他", value: 1 }]
        } else {
            treeNode.percent = Math.round((count * 10000 / parentCount)) / 100;
            treeNode.pieData = [
                { desc: desc, name: desc, value: floatDivision(treeNode.percent, 100) },
                { desc: desc, name: '其他', value: floatSub(1, floatDivision(treeNode.percent, 100)) }
            ];
        }

        return treeNode;
    }


    //为节点添加x，y坐标
    dealData(canvas, scale, treeData) {
        const width = canvas.width;
        const height = canvas.height;
        let newTreeData = lodash.cloneDeep(treeData);
        let depth = 4;
        const nodeYSacle = (height - this.props.nodeHeight * scale) / (depth - 1);
        this.setNodePoint(newTreeData, width, nodeYSacle, scale);
        return newTreeData;
    }

    //设置节点的x,y坐标
    setNodePoint(treeData, width, nodeYSacle, scale) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                if (node.position == "root") {
                    let nodeXSacle = width / 2;
                    node.x = nodeXSacle;
                } else {
                    let nodeXSacle = (width - this.props.nodeWidth * scale) / 6;
                    if (node.position == "left") {
                        node.x = nodeXSacle + this.props.nodeWidth * scale / 2;
                    } else {
                        node.x = nodeXSacle * 5 + this.props.nodeWidth * scale / 2;;
                    }
                }
                node.y = nodeYSacle * (node.depth - 1) + this.props.nodeHeight * scale / 2;
            }
        }
    }

    componentDidMount() {
        this.redrawTree(this.state.treeData);
    }

    redrawTree(treeData) {
        let canvas: any;
        canvas = document.getElementById(this.props.treeId);
        const ctx = canvas.getContext('2d');
        let ratio = getPixelRatio(ctx);
        let scale = ratio;
        if (this.props.fit) {
            if (canvas.parentNode.offsetWidth > 1000) {
                canvas.width = canvas.parentNode.offsetWidth * ratio;
                canvas.height = this.props.height * ratio;
            } else {
                scale = (canvas.parentNode.offsetWidth / 1000);
                canvas.width = canvas.parentNode.offsetWidth * ratio;
                canvas.height = this.props.height * scale * ratio;
                scale = scale * ratio;
            }
        }
        this.setState({ ratio: 1 / ratio });
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let newTreeData = this.dealData(canvas, scale, treeData)
        this.drawTree(ctx, newTreeData, scale, null, false);

        canvas.addEventListener('mousemove', (e) => {
            let eventX = e.clientX * ratio - canvas.getBoundingClientRect().left;
            let eventY = e.clientY * ratio - canvas.getBoundingClientRect().top;
            let mousePoint = { x: eventX, y: eventY, clientX: e.clientX, clientY: e.clientY };
            let isRingRange = isRingPostion(mousePoint, newTreeData, this.props.nodeWidth,
                this.props.innerRadius, this.props.radius, scale);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.drawTree(ctx, newTreeData, scale, mousePoint, isRingRange);
            if (!isRingRange) {
                this.setState({ tipNode: null });
            }
        }, false)

         //鼠标滚轮事件
         canvas.addEventListener('wheel', () => {
            this.setState({ tipNode: null });
        }, false)
    }

    drawTree(ctx, treeData, scale, mousePoint = null, isRingRange = false) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                let parentNode = null;
                if (node.depth == 1) {
                } else if (node.depth == 2) {
                    parentNode = treeData.find(item => item.depth == node.depth - 1 && item.position == "root");
                } else {
                    parentNode = treeData.find(item => item.depth == node.depth - 1 && item.position == node.position);
                }
                drawNode(ctx, node, node.x, node.y, this.props.nodeWidth, this.props.nodeHeight,
                    this.props.radius, this.props.innerRadius, this.state.color, scale, mousePoint, isRingRange, this);
                if (parentNode) {
                    drawLine(ctx, parentNode.x, parentNode.y, node.x, node.y, this.props.nodeHeight * scale);
                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!lodash.isEqual(nextProps.source, this.props.source)) {
            let newData = this.treeSource(nextProps.source);
            this.setState({ treeData: newData }, function () {
                this.redrawTree(newData);
            });
        }
    }

    //获取提示的定位位置
    getTipPosition() {
        let tipDiv = document.getElementById(`${this.props.treeId}Tip`);
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
            visibility: this.state.tipNode ? 'visible' : 'hidden',
            backgroundColor: '#826d6d',
            top: position.top,
            left: position.left,
            padding: '15px',
            color: '#fff',
            borderRadius: '5px',
            textAlign: 'left'
        }

        return (
            <div {...this.props}>
                <canvas id={this.props.treeId} width={this.props.width} height={this.props.height} style={{ zoom: this.state.ratio }}></canvas>
                <div style={tipClass} id={`${this.props.treeId}Tip`}>
                    <div>{this.state.tipNode ? this.state.tipNode.desc : null}</div>
                    <div>{this.state.tipNode ? this.state.tipNode.name : null} : {this.state.tipNode ? this.state.tipNode.value : null}</div>
                </div>
            </div>
        )
    }

}

export default PayAbilityLoginTree;
