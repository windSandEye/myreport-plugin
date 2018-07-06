import React, { Component } from 'react';
import { utils } from '@alipay/report-engine';
import underscore from 'underscore';
import { drawNode, drawLine } from '../common/treenode';

interface CanvasTreeProps {
    source: any[],
    fit: boolean,
    width: number,
    height: number,
    nodeWidth: number,
    nodeHeight: number,
    radius: number,          //nodeWidth*0.2-10
    innerRadius: number      //nodeWidth*0.2-25
}

interface CanvasTreeState {
    color: string[];
    treeData: any[];
}

interface NodeProps {
    id: string,
    desc: string,
    count: number,
    percent: number
    pieData: number[],
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
        treeData: this.treeSource(this.props.source) || []
    };


    static defaultProps = {
        fit: false,
        width: 850,
        height: 400,
        nodeWidth: 200,
        nodeHeight: 80,
        radius: 30,          //nodeWidth*0.2-10
        innerRadius: 15      //nodeWidth*0.2-25
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
            rootTree.pieData = [0, 1];
        } else {
            rootTree.percent = 100;
            rootTree.pieData = [1, 0];
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
        let treeNode: NodeProps = {
            id: null,
            desc: null,
            count: null,
            percent: null,
            pieData: [],
            children: []
        }
        treeNode.count = count;

        //遍历设置今日淘宝支付宝注册占比
        for (let node of treeChildren) {
            if (treeNode.count == 0) {
                node.percent = 0;
                node.pieData = [0, 1]
            } else {
                node.percent = Math.round((node.count * 10000 / treeNode.count)) / 100;
                node.pieData = [node.percent / 100, 1 - node.percent / 100];
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
    dealData(canvas) {
        const width = canvas.width;
        const height = canvas.height;
        let treeData = this.state.treeData;
        const depth = this.getMaxDepath(treeData);
        this.setNodeDepth(treeData);
        const nodeYSacle = (height - this.props.nodeHeight - 30) / (depth - 1);
        this.setNodePoint(treeData, width, height, nodeYSacle);
    }

    //设置节点的x,y坐标
    setNodePoint(treeData, width, height, nodeYSacle) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            let nodeXScale = 0;
            for (let i = 0; i < nodeLength; i++) {
                let floorList = this.getNodeDepathNum(this.state.treeData, treeData[i].depth);
                nodeXScale = width / (Math.pow(2, treeData[i].depth));   //横纵度量：2的depth次方为每个深度最大的节点数
                let nodeIndex = floorList.findIndex((node) => node.id === treeData[i].id);
                treeData[i].x = nodeXScale * (2 * (nodeIndex + 1) - 1); //每个节点间的距离2n-1
                treeData[i].y = nodeYSacle * (treeData[i].depth - 1) + 15 + this.props.nodeHeight / 2;
                if (treeData[i].children) {
                    this.setNodePoint(treeData[i].children, width, height, nodeYSacle);
                }
            }
        }
    }



    componentDidMount() {
        this.redrawTree(this.state.treeData);
    }

    redrawTree(treeData) {
        let canvas: any;
        canvas = document.getElementById("customTree");
        if (this.props.fit) {
            if (canvas.parentNode.offsetWidth > 850) {
                canvas.width = canvas.parentNode.offsetWidth;
            } else {
                canvas.width = 850;
            }
        }
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.dealData(canvas)
        this.drawTree(ctx, treeData, null);
    }

    componentWillReceiveProps(nextProps: CanvasTreeProps) {
        if (!underscore.isEqual(nextProps.source, this.props.source)) {
            let newData = this.treeSource(nextProps.source);
            this.setState({ treeData: newData }, function () {
                this.redrawTree(newData);
            });
        }
    }


    drawTree(ctx, treeData, parentNode) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                drawNode(ctx, node, node.x, node.y, this.props.nodeWidth,
                    this.props.nodeHeight, this.props.radius, this.props.innerRadius, this.state.color);
                if (parentNode) {
                    drawLine(ctx, parentNode.x, parentNode.y, node.x, node.y);
                }
                if (node.children) {
                    this.drawTree(ctx, node.children, node);
                }
            }
        }
    }

    render() {
        return (
            <div {...this.props}>
                <canvas id="customTree" width={this.props.width} height={this.props.height}></canvas>
            </div>
        )
    }

}

export default CanvasTree;
