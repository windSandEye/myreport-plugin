import React, { Component } from 'react';
import { utils } from '@alipay/report-engine';
import lodash from 'lodash';
import { drawNode, drawLine, drawRingPie, dealNumber, getPixelRatio } from '../common/treenode';

interface PayAbilityLoginTreeProps {
    treeId: string,
    source: any[],
    fit: boolean,
    width: number,
    height: number,
    nodeWidth: number,
    nodeHeight: number,
    radius: number,          //nodeWidth*0.2-10
    innerRadius: number,      //nodeWidth*0.2-25
    pieRadius: number,
    pieInnerRadius: number
}

interface CanvasTreeState {
    color: string[];
    treeData: any[];
    pieColor: string[];
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

// interface NodeProps {
//     id: string,
//     desc: string,
//     count: number,
//     percent: number
//     pieData: number[],
//     children: NodeProps[]
// }

class PayAbilityCrowdGroupTree extends Component<PayAbilityLoginTreeProps> {

    static processAttributes = (attributes) => {
        utils.dealTpl(attributes, 'treeId');
        utils.dealNumber(attributes, 'width');
        utils.dealNumber(attributes, 'height');
        utils.dealNumber(attributes, 'nodeWidth');
        utils.dealNumber(attributes, 'nodeHeight');
        utils.dealNumber(attributes, 'radius');
        utils.dealNumber(attributes, 'innerRadius');
        utils.dealNumber(attributes, 'pieRadius');
        utils.dealNumber(attributes, 'pieInnerRadius');
        utils.dealBoolean(attributes, 'fit');
        utils.dealTpl(attributes, 'source');
        utils.dealObject(attributes, 'source');
    }

    public state: CanvasTreeState = {
        color: ['#0096FA', '#E9E9E9'],
        treeData: this.treeSource(this.props.source) || [],
        pieColor: ['#bd94ff', '#FCDA56', '#69D389', '#e295d5', '#62ca9a'],
        tipNode: null,
        ratio: 1,
        mousePosition: {
            x: 0,
            y: 0
        }
    };


    static defaultProps = {
        treeId: 'payAbilityCrowdGroupTree',
        source: [
            {
                id: 1, depth: 1, desc: "T0待转化用户", count: 2321341, percent: 100,
                pieData: [{ desc: "T0待转化用户", name: "T0待转化用户", value: "1" }],
                children: [
                    {
                        id: 2, depth: 2, desc: "淘宝来源", count: 2321341, percent: 50,
                        pieData: [{ desc: "淘宝来源", name: "淘宝来源", value: "0.5" }, { desc: "淘宝来源", name: "其他", value: "0.5" }],
                        children: [
                            {
                                id: 21, depth: 3, desc: "普遍性", count: 2321341, percent: 100,
                                pieData: [{ desc: "普遍性", name: "普遍性", value: "0.3" }, { desc: "普遍性", name: "其他", value: "0.7" }]
                            },
                            {
                                id: 22, depth: 3, desc: "低龄未知", count: 2321341, percent: 100,
                                pieData: [{ desc: "低龄未知", name: "低龄未知", value: "0.3" }, { desc: "低龄未知", name: "其他", value: "0.7" }]
                            },
                            {
                                id: 23, depth: 3, desc: "低龄高龄未知", count: 2321341, percent: 100,
                                pieData: [{ desc: "低龄高龄未知", name: "低龄高龄未知", value: "0.3" }, { desc: "低龄高龄未知", name: "其他", value: "0.7" }]
                            },
                            {
                                id: 24, depth: 3, desc: "低龄中龄高龄未知", count: 2321341, percent: 100,
                                pieData: [{ desc: "低龄中龄高龄未知", name: "低龄中龄高龄未知", value: "0.3" }, { desc: "低龄中龄高龄未知", name: "其他", value: "0.7" }]
                            },
                            {
                                id: 25, depth: 3, desc: "低龄", count: 2321341, percent: 100,
                                pieData: [{ desc: "低龄", name: "低龄", value: "0.3" }, { desc: "低龄", name: "其他", value: "0.7" }]
                            },
                        ]
                    },
                    {
                        id: 3, depth: 2, desc: "支付宝来源", count: 2321341, percent: 60,
                        pieData: [{ desc: "支付宝来源", name: "支付宝来源", value: "0.6" }, { desc: "支付宝来源", name: "其他", value: "0.4" }],
                        children: [
                            {
                                id: 31, depth: 3, desc: "普遍性", count: 2321341, percent: 100,
                                pieData: [{ desc: "普遍性", name: "普遍性", value: "0.3" }, { desc: "普遍性", name: "其他", value: "0.7" }]
                            },
                            {
                                id: 32, depth: 3, desc: "低龄未知", count: 2321341, percent: 100,
                                pieData: [{ desc: "低龄未知", name: "低龄未知", value: "0.3" }, { desc: "低龄未知", name: "其他", value: "0.7" }]
                            },
                            {
                                id: 33, depth: 3, desc: "低龄高龄未知", count: 2321341, percent: 100,
                                pieData: [{ desc: "低龄高龄未知", name: "低龄高龄未知", value: "0.3" }, { desc: "低龄高龄未知", name: "其他", value: "0.7" }]
                            },
                            {
                                id: 34, depth: 3, desc: "低龄中龄高龄未知", count: 2321341, percent: 100,
                                pieData: [{ desc: "低龄中龄高龄未知", name: "低龄中龄高龄未知", value: "0.3" }, { desc: "低龄中龄高龄未知", name: "其他", value: "0.7" }]
                            },
                            {
                                id: 35, depth: 3, desc: "低龄", count: 2321341, percent: 100,
                                pieData: [{ desc: "低龄", name: "低龄", value: "0.3" }, { desc: "低龄", name: "其他", value: "0.7" }]
                            },
                        ]
                    },
                ]
            }],
        fit: false,
        width: 1500,
        height: 1000,
        nodeWidth: 300,
        nodeHeight: 150,
        radius: 65,          //nodeWidth*0.2-10
        innerRadius: 40,      //nodeWidth*0.2-25
        pieRadius: 70,          //第3层外环半径
        pieInnerRadius: 50      //第三层内环半径
    }

    //源数据封装
    treeSource(source) {
        return source;
    }


    //为节点添加x，y坐标
    dealData(canvas, scale, treeData) {
        const width = canvas.width;
        const height = canvas.height;
        let newTreeData = lodash.cloneDeep(treeData);
        let depth = 3;
        const nodeYSacle = (height - this.props.nodeHeight * scale / 2 - this.props.pieRadius * scale) * depth / 8;
        this.setNodePoint(newTreeData, newTreeData, width, height, nodeYSacle, scale);
        return newTreeData;
    }

    //设置节点的x,y坐标
    setNodePoint(treeData, childrenData, width, height, nodeYSacle, scale) {
        let nodeLength = childrenData.length;
        if (nodeLength > 0) {
            for (let node of childrenData) {
                let depthList = this.getNodeDepathNum(treeData, node.depth);
                if (node.depth < 3) {
                    let nodeXScale = width / (Math.pow(2, node.depth));
                    let nodeIndex = depthList.findIndex(item => item.id === node.id);
                    node.x = nodeXScale * (2 * (nodeIndex + 1) - 1);;
                    node.y = nodeYSacle * (node.depth - 1) + this.props.nodeHeight * scale / 2;
                } else {
                    let nodeXScale = (width / 2 - this.props.pieRadius * scale * 2 - 30 * scale) / (nodeLength - 1);//30为左右各留15px间距
                    let nodeIndex = depthList.findIndex(item => item.id === node.id);
                    if (nodeIndex < nodeLength) {
                        node.x = nodeXScale * nodeIndex + this.props.pieRadius * scale + 15 * scale;
                    } else {
                        node.x = width / 2 + nodeXScale * (nodeIndex - 5) + this.props.pieRadius * scale + 15 * scale;
                    }
                    node.y = height - this.props.pieRadius * scale;//第3级为最底层
                }

                if (node.children) {
                    this.setNodePoint(treeData, node.children, width, height, nodeYSacle, scale);
                }
            }
        }
    }

    //获取相应深度节点数
    getNodeDepathNum(treeData, depth, floorList = []) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                if (node.depth === depth) {
                    floorList.push(node);
                    continue;
                }
                if (node.children) {
                    this.getNodeDepathNum(node.children, depth, floorList)
                }
            }
        }
        return floorList;
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
            if (canvas.parentNode.offsetWidth > 1500) {
                canvas.width = canvas.parentNode.offsetWidth * ratio;
                canvas.height = this.props.height * ratio;
            } else {
                scale = canvas.parentNode.offsetWidth / 1500;
                canvas.width = canvas.parentNode.offsetWidth * ratio;
                canvas.height = this.props.height * scale * ratio;
                scale = scale * ratio;
            }
        }
        this.setState({ ratio: 1 / ratio });
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let newTreeData = this.dealData(canvas, scale, treeData)
        this.drawTree(ctx, newTreeData, null, canvas.width, canvas.height, scale);

   
    }

    //是否存在上一个兄弟节点
    isPrevBrother(node) {
        let brotherList = this.getNodeDepathNum(this.state.treeData, node.depth);
        let nodeIndex = brotherList.findIndex(item => item.id === node.id);
        return brotherList[nodeIndex - 1] ? true : false;
    }

    drawTree(ctx, treeData, parentNode, width, height, scale, mousePoint = null, isRingRange = false) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                const nodeYSacle = (height - this.props.nodeHeight * scale / 2 - this.props.pieRadius * scale) * 3 / 8;
                if (node.depth < 3) {
                    drawNode(ctx, node, node.x, node.y, this.props.nodeWidth, this.props.nodeHeight,
                        this.props.radius, this.props.innerRadius, this.state.color, scale, mousePoint, isRingRange, this);
                    if (parentNode) {
                        drawLine(ctx, parentNode.x, parentNode.y, node.x, node.y, this.props.nodeHeight * scale);
                    }
                    if (node.children) {
                        this.drawTree(ctx, node.children, node, width, height, scale);
                        if (node.depth === 2) {
                            drawLine(ctx, node.x, node.y, node.x, node.y + nodeYSacle - 3, this.props.nodeHeight * scale);//分割线宽度为3

                            //画分割横线
                            ctx.beginPath();
                            let nodeY = node.y + nodeYSacle - this.props.nodeHeight * scale / 2;
                            ctx.lineWidth = 3;
                            if (!this.isPrevBrother(node)) {//第一个元素
                                ctx.moveTo(15, nodeY);
                                ctx.strokeStyle = "#9570E5";  //设置线的颜色状态
                                ctx.lineTo(width / 2 - 15, nodeY);
                                ctx.stroke();

                                //说明文字。放在这里是确保只画一次，不重复画
                                var img = new Image();
                                img.onload = () => {
                                    ctx.drawImage(img, 0, nodeY - 50, 30, 30);
                                }
                                img.src = "https://t.alipayobjects.com/images/rmsweb/T11aVgXc4eXXXXXXXX.svg";

                                let fontSize = 12;
                                ctx.font = fontSize + "px Arial";
                                let textX2 = 120;
                                let textY2 = nodeY - 36;
                                let explain = "待支付能力升级转化人群分组"
                                ctx.fillText(explain, textX2, textY2);

                                //画说明下划横线
                                ctx.beginPath();
                                ctx.lineWidth = 1;
                                ctx.moveTo(0, nodeY - 12)
                                ctx.lineTo(220, nodeY - 12);
                                ctx.strokeStyle = "#DBDBDB";  //设置线的颜色状态
                                ctx.stroke();

                            } else {
                                ctx.moveTo(width / 2 + 15, nodeY);
                                ctx.strokeStyle = "#E16757";  //设置线的颜色状态
                                ctx.lineTo(width - 15, nodeY);
                            }
                            ctx.stroke();
                        }
                    }
                } else {
                    let nodeY = parentNode.y + nodeYSacle - this.props.nodeHeight * scale / 2;

                    //画断线
                    ctx.beginPath();
                    ctx.moveTo(node.x, nodeY)
                    if (node.desc.length > 4) {
                        ctx.lineTo(node.x, nodeY + nodeYSacle / 3 - 14);//断线只有nodeYScale的1/3
                    } else {
                        ctx.lineTo(node.x, nodeY + nodeYSacle / 3 - 7);
                    }
                    ctx.strokeStyle = "#169BD5";
                    ctx.stroke();

                    //写描述
                    let fontSize = 12;
                    ctx.font = fontSize + "px Arial";
                    ctx.textBaseline = "middle";
                    ctx.textAlign = "center";
                    if (node.desc.length > 4) {
                        ctx.fillText(node.desc.substring(0, 4), node.x, nodeY + nodeYSacle / 3 - 7);
                        ctx.fillText(node.desc.substring(4), node.x, nodeY + nodeYSacle / 3 + 7);
                    } else {
                        ctx.fillText(node.desc, node.x, nodeY + nodeYSacle / 3);
                    }

                    //画下半断线
                    ctx.beginPath();
                    if (node.desc.length > 4) {
                        ctx.lineTo(node.x, nodeY + nodeYSacle / 3 + 14);
                    } else {
                        ctx.lineTo(node.x, nodeY + nodeYSacle / 3 + 7);
                    }
                    ctx.lineTo(node.x, nodeY + nodeYSacle);
                    ctx.strokeStyle = "#169BD5";
                    ctx.stroke();

                    //绘制箭头
                    ctx.moveTo(node.x, node.y - this.props.pieRadius * scale);
                    ctx.lineTo(node.x - 5, node.y - this.props.pieRadius * scale - 5);
                    ctx.lineTo(node.x + 5, node.y - this.props.pieRadius * scale - 5);
                    ctx.closePath();
                    ctx.fillStyle = "#169BD5";
                    ctx.fill();

                    //画统计数量
                    ctx.font = fontSize + "px Arial";
                    ctx.textBaseline = "middle";
                    ctx.textAlign = "center";
                    ctx.fillText(dealNumber(node.count), node.x, node.y - this.props.pieRadius * scale - 20);

                    //画饼图

                    //生成0~4的随机数
                    let numIndex = Math.floor(Math.random() * 4);
                    let pieColor = [this.state.pieColor[numIndex], '#E9E9E9']
                    drawRingPie(ctx, node, node.x, node.y, this.props.pieRadius, this.props.pieInnerRadius, scale,
                        pieColor, mousePoint, isRingRange, this)
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

export default PayAbilityCrowdGroupTree;