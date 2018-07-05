import React, { Component } from 'react';
import { utils } from '@alipay/report-engine';
// import underscore from 'underscore';

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
        treeData: []
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


   

    render() {
        return (
            <div {...this.props}>
                <canvas id="payAbilityLoginTree" width={this.props.width} height={this.props.height}></canvas>
            </div>
        )
    }

}

export default PayAbilityLoginTree;
