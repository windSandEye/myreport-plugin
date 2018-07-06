import React, { Component } from 'react';
import { utils } from '@alipay/report-engine';
import underscore from 'underscore';
import { drawNode, drawLine } from '../common/treenode';

interface PayAbilityLoginTreeProps {
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

// interface NodeProps {
//     id: string,
//     desc: string,
//     count: number,
//     percent: number
//     pieData: number[],
//     children: NodeProps[]
// }

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
        treeData: this.treeSource(this.props.source) || []
    };


    static defaultProps = {
        source: [
            { position: "root", depth: 1, desc: "当日登陆用户", count: 2321341, percent: 100, pieData: [1] },
            { position: "left", depth: 2, desc: "当日新增登陆", count: 2321341, percent: 50, pieData: [0.5, 0.5] },
            { position: "right", depth: 2, desc: "非当日新增登陆", count: 2321341, percent: 60, pieData: [0.6, 0.4] },
            { position: "left", depth: 3, desc: "非T4用户", count: 2321341, percent: 20, pieData: [0.2, 0.8] },
            { position: "right", depth: 3, desc: "非T4用户", count: 2321341, percent: 30, pieData: [0.3, 0.7] },
            { position: "left", depth: 4, desc: "当日T4转化", count: 2321341, percent: 33, pieData: [0.33, 0.67] },
            { position: "right", depth: 4, desc: "当日T4转化", count: 2321341, percent: 22, pieData: [0.22, 0.78] },
            { position: "left", depth: 5, desc: "七日T4转化", count: 2321341, percent: 66, pieData: [0.66, 0.34] },
            { position: "right", depth: 5, desc: "七日T4转化", count: 2321341, percent: 55.5, pieData: [0.555, 0.445] },
            { position: "left", depth: 6, desc: "三十日T4转化", count: 2321341, percent: 36.66, pieData: [0.3666, 0.6334] },
            { position: "right", depth: 6, desc: "三十日T4转化", count: 2321341, percent: 23, pieData: [0.23, 0.77] },
        ],
        fit: false,
        width: 850,
        height: 800,
        nodeWidth: 200,
        nodeHeight: 80,
        radius: 30,          //nodeWidth*0.2-10
        innerRadius: 15      //nodeWidth*0.2-25
    }

    //源数据封装
    treeSource(source) {
        return source;
    }


    //为节点添加x，y坐标
    dealData(canvas) {
        const width = canvas.width;
        const height = canvas.height;
        let treeData = this.state.treeData;
        let depth = 6;
        const nodeYSacle = (height - this.props.nodeHeight - 30) / (depth - 1);
        this.setNodePoint(treeData, width, nodeYSacle);
    }

    //设置节点的x,y坐标
    setNodePoint(treeData, width, nodeYSacle) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                if (node.position == "root") {
                    let nodeXSacle = width / 2;
                    node.x = nodeXSacle;
                } else {
                    let nodeXSacle = width / 3;
                    if (node.position == "left") {
                        node.x = nodeXSacle;
                    } else {
                        node.x = nodeXSacle * 2;
                    }
                }
                node.y = nodeYSacle * (node.depth - 1) + this.props.nodeHeight / 2;
            }
        }
    }

    componentDidMount() {
        this.redrawTree(this.state.treeData);
    }

    redrawTree(treeData) {
        let canvas: any;
        canvas = document.getElementById("payAbilityLoginTree");
        if(this.props.fit){
            canvas.width =  canvas.parentNode.offsetWidth;
        }
        const ctx = canvas.getContext('2d');
        this.dealData(canvas)
        this.drawTree(ctx, treeData);
    }

    drawTree(ctx, treeData) {
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
                drawNode(ctx, node, node.x, node.y, this.props.nodeWidth, this.props.nodeHeight, this.props.radius, this.props.innerRadius, this.state.color);
                if (parentNode) {
                    drawLine(ctx, parentNode.x, parentNode.y, node.x, node.y, this.props.nodeHeight);
                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!underscore.isEqual(nextProps.source, this.props.source)) {
            let newData = this.treeSource(nextProps.source);
            this.setState({ treeData: newData }, function () {
                this.redrawTree(newData);
            });
        }
    }




    render() {
        return (
            <div {...this.props}>
                <canvas id="payAbilityLoginTree" width={this.props.width} height={this.props.height}></canvas>
            </div>
        )
    }

}

export default PayAbilityLoginTree;
