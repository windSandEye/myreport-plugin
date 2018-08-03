import React, { Component } from 'react';
import { utils } from '@alipay/report-engine';
import lodash from 'lodash';
import { drawNode, drawLine, getPixelRatio, floatSub, floatDivision } from '../common/treenode';

interface CanvasTreeProps {
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
    color: string[];
    treeData: any[];
    ratio: number;
    tipNode: PieProps;
    mousePosition: positionProps;
}

class PieProps {
    desc: string;
    name: string;
    value: number;
}

class positionProps {
    x: number;
    y: number;
}

class NodeProps {
    id: string;
    desc: string;
    count: number;
    percent: number;
    pieData: PieProps[];
    position: string;
    depth: number;
    children: NodeProps[]
}

class CanvasTree extends Component<CanvasTreeProps> {

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
        treeId: 'canvasTree',
        fit: false,
        width: 1400,
        height: 900,
        nodeWidth: 300,
        nodeHeight: 150,
        radius: 65,          //nodeWidth*0.25-10
        innerRadius: 40      //nodeWidth*0.25-25
    }

    //封装树
    treeSource(source) {
        let registerSource = this.statisticsRegister(source);
        //遍历数组生成id
        let todayChildren = [];
        let historyChildren = [];
        for (let item of registerSource.childrenList) {
            if (item.is_register_today == "1") {
                todayChildren.push(item);
            } else {
                historyChildren.push(item);
            }
        }

        //封装今日注册
        let todayTree = this.createTreeNode(todayChildren, registerSource.todayCount);
        todayTree.desc = "今日注册用户";
        todayTree.id = this.createGuid();

        //封装历史注册用户
        let historyTree = this.createTreeNode(historyChildren, registerSource.historyCount);
        historyTree.desc = "历史注册用户";
        historyTree.id = this.createGuid();

        //封装总注册用户
        let rootChildren = [todayTree, historyTree];
        let rootTree = this.createTreeNode(rootChildren, registerSource.todayCount + registerSource.historyCount);
        rootTree.desc = "总注册用户";
        if (rootTree.count == 0) {
            rootTree.percent = 0
            rootTree.pieData = [{ desc: rootTree.desc, name: rootTree.desc, value: 0 }, { desc: rootTree.desc, name: '其他', value: 1 }];
        } else {
            rootTree.percent = 100;
            rootTree.pieData = [{ desc: rootTree.desc, name: rootTree.desc, value: 1 }, { desc: rootTree.desc, name: '其他', value: 0 }];
        }
        rootTree.id = this.createGuid();;

        return [rootTree];
    }

    //统计注册用户
    statisticsRegister(data: any[]) {
        //今日淘宝注册
        let taobaoToday = data.find(item => item.is_register_today == "1" && item.trade_from == 'taobao');
        let taobaoTodayCount = taobaoToday ? taobaoToday.usercount : 0;
        //今日支付宝注册
        let alipayToday = data.find(item => item.is_register_today == "1" && item.trade_from == 'alipay');
        let alipayTodayCount = alipayToday ? alipayToday.usercount : 0;

        //历史淘宝注册
        let taobaoHistory = data.find(item => item.is_register_today == "0" && item.trade_from == 'taobao');
        let taobaoHistoryCount = taobaoHistory ? taobaoHistory.usercount : 0;

        //历史支付宝注册
        let alipayHistory = data.find(item => item.is_register_today == "0" && item.trade_from == 'alipay');
        let alipayHistoryCount = alipayHistory ? alipayHistory.usercount : 0;

        //今日注册
        let todayCount = data.reduce((prev, cur) => {
            if (cur.is_register_today == "1") {
                return prev + parseInt(cur.usercount);
            } else {
                return prev;
            }
        }, 0);

        //历史注册
        let historyCount = data.reduce((prev, cur) => {
            if (cur.is_register_today == "0") {
                return prev + parseInt(cur.usercount);
            } else {
                return prev;
            }
        }, 0);

        return {
            todayCount: todayCount,
            historyCount: historyCount,
            childrenList: [
                { "is_register_today": "1", "trade_from": "taobao", "count": taobaoTodayCount, desc: '淘宝注册用户', id: this.createGuid() },
                { "is_register_today": "1", "trade_from": "alipay", "count": alipayTodayCount, desc: '支付宝注册用户', id: this.createGuid() },
                { "is_register_today": "0", "trade_from": "taobao", "count": taobaoHistoryCount, desc: '淘宝注册用户', id: this.createGuid() },
                { "is_register_today": "0", "trade_from": "alipay", "count": alipayHistoryCount, desc: '支付宝注册用户', id: this.createGuid() },
            ]
        }

    }

    //根据子节点反向创建一个父节点
    createTreeNode(treeChildren, count) {
        let treeNode = new NodeProps();
        treeNode.count = count;
        //遍历设置今日淘宝支付宝注册占比
        for (let node of treeChildren) {
            if (treeNode.count == 0) {
                node.percent = 0;
                node.pieData = [{ desc: node.desc, name: node.desc, value: 0 }, { desc: node.desc, name: '其他', value: 1 }]
            } else {
                node.percent = Math.round((node.count * 10000 / treeNode.count)) / 100;
                node.pieData = [
                    { desc: node.desc, name: node.desc, value: floatDivision(node.percent, 100) },
                    { desc: node.desc, name: '其他', value: floatSub(1, floatDivision(node.percent, 100)) }]
            }
        }
        treeNode.children = treeChildren;
        return treeNode;
    }

    //生成uuid
    createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    //设置每级深度
    setNodeDepth(treeData, depth = 1) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                node.depth = depth;
                if (node.children) {
                    this.setNodeDepth(node.children, depth + 1)
                }
            }
        }
    }

    //获取最大深度
    getMaxDepath(treeData) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                let maxDepth = 1;
                if (node.children) {
                    maxDepth = Math.max(maxDepth, this.getMaxDepath(node.children) + 1)
                    return maxDepth
                } else {
                    maxDepth = 1;
                    return maxDepth;
                }
            }
        }
    }

    //获取相应深度节点数
    getNodeDepathNum(treeData, depth, floorList = []) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                if (node.depth == depth) {
                    floorList.push(node);
                }
                if (node.children) {
                    this.getNodeDepathNum(node.children, depth, floorList)
                }
            }
        }
        return floorList;
    }

    //为节点添加x，y坐标
    dealData(canvas, scale, treeData) {
        const width = canvas.width;
        const height = canvas.height;
        let newTreeData = lodash.cloneDeep(treeData);
        const depth = this.getMaxDepath(newTreeData);
        this.setNodeDepth(newTreeData);
        const nodeYSacle = (height - this.props.nodeHeight * scale) / (depth - 1);
        this.setNodePoint(newTreeData, newTreeData, width, height, nodeYSacle, scale);
        return newTreeData;
    }

    //设置节点的x,y坐标
    setNodePoint(treeData, childrenData, width, height, nodeYSacle, scale) {
        let nodeLength = childrenData.length;
        if (nodeLength > 0) {
            let nodeXScale = 0;
            for (let i = 0; i < nodeLength; i++) {
                let floorList = this.getNodeDepathNum(treeData, childrenData[i].depth);
                nodeXScale = width / (Math.pow(2, childrenData[i].depth));   //横纵度量：2的depth次方为每个深度最大的节点数
                let nodeIndex = floorList.findIndex((node) => node.id === childrenData[i].id);
                childrenData[i].x = nodeXScale * (2 * (nodeIndex + 1) - 1); //每个节点间的距离2n-1
                childrenData[i].y = nodeYSacle * (childrenData[i].depth - 1) + this.props.nodeHeight * scale / 2;
                if (childrenData[i].children) {
                    this.setNodePoint(treeData, childrenData[i].children, width, height, nodeYSacle, scale);
                }
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
            if (canvas.parentNode.offsetWidth > 1400) {
                canvas.width = canvas.parentNode.offsetWidth * scale;
                canvas.height = this.props.height * scale;
            } else {
                scale = canvas.parentNode.offsetWidth / 1400;
                canvas.width = canvas.parentNode.offsetWidth * ratio;
                canvas.height = this.props.height * scale * ratio;
                scale = scale * ratio;
            }
        }
        this.setState({ ratio: 1 / ratio });
        ctx.clearRect(0, 0, canvas.width, canvas.height, null, false);
        let newTreeData = this.dealData(canvas, scale, treeData)
        this.drawTree(ctx, newTreeData, null, scale);

        //鼠标移动事件
        canvas.addEventListener('mousemove', (e) => {
            //鼠标移入位置偏移ratio倍
            let eventX = e.clientX * ratio - canvas.getBoundingClientRect().left;
            let eventY = e.clientY * ratio - canvas.getBoundingClientRect().top;
            let mousePoint = { x: eventX, y: eventY, clientX: e.clientX, clientY: e.clientY };
            let isRingRange = this.isRingRangePostion(mousePoint, newTreeData, this.props.nodeWidth,
                this.props.innerRadius, this.props.radius, scale);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.drawTree(ctx, newTreeData, null, scale, mousePoint, isRingRange);
            if (!isRingRange) {
                this.setState({ tipNode: null });
            }
        }, false)

        //鼠标滚轮事件
        canvas.addEventListener('wheel', () => {
            this.setState({ tipNode: null });
        }, false)
    }


    componentWillReceiveProps(nextProps: CanvasTreeProps) {
        if (!lodash.isEqual(nextProps.source, this.props.source)) {
            let newData = this.treeSource(nextProps.source);
            this.setState({ treeData: newData }, function () {
                this.redrawTree(newData);
            });
        }
    }


    drawTree(ctx, treeData, parentNode, scale, mousePoint = null, isRingRange = false) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                drawNode(ctx, node, node.x, node.y, this.props.nodeWidth, this.props.nodeHeight,
                    this.props.radius, this.props.innerRadius, this.state.color, scale, mousePoint, isRingRange, this);
                if (parentNode) {
                    drawLine(ctx, parentNode.x, parentNode.y, node.x, node.y, this.props.nodeHeight * scale);
                }
                if (node.children) {
                    this.drawTree(ctx, node.children, node, scale, mousePoint, isRingRange);
                }
            }
        }
    }

    //是否在圆环上
    isRingRangePostion(mousePoint, treeData, nodeWidth, innerRadius, radius, scale) {
        if (!mousePoint) {
            return false;
        }
        let nodeLength = treeData.length;
        let eventX = mousePoint.x;
        let eventY = mousePoint.y;
        if (nodeLength > 0) {
            for (let node of treeData) {
                //点击位置到圆心的距离，勾股定理计算
                let cricleX = node.x + nodeWidth * scale / 4;//圆心x坐标
                let cricleY = node.y;
                let distanceFromCenter = Math.sqrt(Math.pow(cricleX - eventX, 2)
                    + Math.pow(cricleY - eventY, 2))
                //是否在圆环上
                if (distanceFromCenter > innerRadius * scale && distanceFromCenter < radius * scale) {
                    return true;
                }
                if (node.children) {
                    let ring = this.isRingRangePostion(mousePoint, node.children, nodeWidth, innerRadius, radius, scale);
                    if (ring) {
                        return true;
                    }
                }
            }
        }
        return false;
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
            <div {...this.props} >
                <canvas id={this.props.treeId} width={this.props.width} height={this.props.height} style={{ zoom: this.state.ratio }}></canvas>
                <div style={tipClass} id={`${this.props.treeId}Tip`}>
                    <div>{this.state.tipNode ? this.state.tipNode.desc : null}</div>
                    <div>{this.state.tipNode ? this.state.tipNode.name : null} : {this.state.tipNode ? this.state.tipNode.value : null}</div>
                </div>
            </div>
        )
    }

}

export default CanvasTree;
