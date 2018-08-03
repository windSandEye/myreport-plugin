import React, { Component } from 'react';
import { utils } from '@alipay/report-engine';
import lodash from 'lodash';
import { drawNode, drawLine, drawFromLine, getPixelRatio, isRingPostion } from '../common/treenode';

interface PayAbilityCrowdTreeProps {
    treeId: string,
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

class PayAbilityCrowdTree extends Component<PayAbilityCrowdTreeProps> {

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


    // constructor(props) {
    //     super(props);
    //     // this.state = {
    //     //     color: ['#bd94ff', '#48eaa7'],
    //     //     treeData: this.treeSource(this.props.source) || []
    //     // }
    // }

    static defaultProps = {
        treeId: 'payAbilityCrowdTree',
        source: [
            {
                id: 1, position: "left", depth: 1, desc: "当日注册用户", count: 2321341, percent: 100,
                pieData: [{ desc: "当日注册用户", name: "当日注册用户", value: "1" }]
            },
            {
                id: 2, position: "right", depth: 1, desc: "历史注册用户", count: 2321341, percent: 50,
                pieData: [{ desc: "历史注册用户", name: "历史注册用户", value: "0.5" }, { desc: "历史注册用户", name: "其他", value: "0.5" }]
            },
            {
                id: 3, position: "center", depth: 2, desc: "总注册用户", count: 2321341, percent: 60,
                pieData: [{ desc: "总注册用户", name: "总注册用户", value: "0.6" }, { desc: "总注册用户", name: "其他", value: "0.4" }]
            },
            {
                id: 4, position: "left", depth: 3, desc: "当日场景支付用户", count: 2321341, percent: 20,
                pieData: [{ desc: "当日场景支付用户", name: "当日场景支付用户", value: "0.2" }, { desc: "当日场景支付用户", name: "其他", value: "0.8" }], from: null, to: 5
            },
            {
                id: 5, position: "right", depth: 3, desc: "当日登陆用户", count: 2321341, percent: 30,
                pieData: [{ desc: "当日登陆用户", name: "当日登陆用户", value: "0.3" }, { desc: "当日登陆用户", name: "其他", value: "0.7" }], from: 4, to: null
            },
            {
                id: 6, position: "center", depth: 4, desc: "升级页面", count: 2321341, percent: 33,
                pieData: [{ desc: "升级页面", name: "升级页面", value: "0.33" }, { desc: "升级页面", name: "其他", value: "0.67" }]
            },
            {
                id: 7, position: "left", depth: 5, desc: "升级支付能力", count: 2321341, percent: 22,
                pieData: [{ desc: "升级支付能力", name: "升级支付能力", value: "0.22" }, { desc: "升级支付能力", name: "其他", value: "0.78" }]
            },
            {
                id: 8, position: "right", depth: 5, desc: "未升级成功", count: 2321341, percent: 66,
                pieData: [{ desc: "未升级成功", name: "未升级成功", value: "0.66" }, { desc: "未升级成功", name: "其他", value: "0.34" }]
            },
        ],
        fit: false,
        width: 1000,
        height: 1200,
        nodeWidth: 300,
        nodeHeight: 150,
        radius: 65,          //nodeWidth*0.25-10
        innerRadius: 40      //nodeWidth*0.25-35
    }

    //源数据处理
    treeSource(source) {
        return source;
    }



    //为节点添加x，y坐标
    dealData(canvas, scale, treeData) {
        const width = canvas.width;
        const height = canvas.height;
        let newTreeData = lodash.cloneDeep(treeData);
        let depth = 5;
        const nodeYSacle = (height - this.props.nodeHeight * scale) / (depth - 1);
        this.setNodePoint(newTreeData, width, nodeYSacle, scale);
        return newTreeData;
    }

    //设置节点的x,y坐标
    setNodePoint(treeData, width, nodeYSacle, scale) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                if (node.position == "center") {
                    let nodeXSacle = width / 2;
                    node.x = nodeXSacle;
                } else {
                    if (node.position == "left") {
                        node.x = this.props.nodeWidth * scale / 2;
                    } else {
                        node.x = width - this.props.nodeWidth * scale / 2;
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
                scale = canvas.parentNode.offsetWidth / 1000;
                canvas.width = canvas.parentNode.offsetWidth * ratio;
                canvas.height = this.props.height * scale * ratio;
                scale = scale * ratio;
            }
        }
        this.setState({ ratio: 1 / ratio });
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let newTreeData = this.dealData(canvas, scale, treeData)
        this.drawTree(ctx, newTreeData, scale);

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

    componentWillReceiveProps(nextProps) {
        if (!lodash.isEqual(nextProps.source, this.props.source)) {
            let newData = this.treeSource(nextProps.source)
            this.setState({ treeData: newData }, function () {
                this.redrawTree(newData);
            });
        }
    }


    drawTree(ctx, treeData, scale, mousePoint = null, isRingRange = false) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                let parentList = null;
                if (node.depth == 1) {
                } else {
                    parentList = treeData.filter(item => item.depth == node.depth - 1);
                }
                drawNode(ctx, node, node.x, node.y, this.props.nodeWidth, this.props.nodeHeight,
                    this.props.radius, this.props.innerRadius, this.state.color, scale, mousePoint, isRingRange, this);
                if (parentList) {
                    for (let parent of parentList) {
                        drawLine(ctx, parent.x, parent.y, node.x, node.y, this.props.nodeHeight * scale);
                    }
                }
                //绘制横向线
                if (node.from) {
                    let fromObj = treeData.find(item => item.id == node.from);
                    drawFromLine(ctx, fromObj.x, fromObj.y, node.x, node.y, this.props.nodeWidth * scale);
                }
            }
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
            <div>
                <canvas id={this.props.treeId} width={this.props.width} height={this.props.height} style={{ zoom: this.state.ratio }}></canvas>
                <div style={tipClass} id={`${this.props.treeId}Tip`}>
                    <div>{this.state.tipNode ? this.state.tipNode.desc : null}</div>
                    <div>{this.state.tipNode ? this.state.tipNode.name : null} : {this.state.tipNode ? this.state.tipNode.value : null}</div>
                </div>
            </div>
        )
    }

}

export default PayAbilityCrowdTree;
