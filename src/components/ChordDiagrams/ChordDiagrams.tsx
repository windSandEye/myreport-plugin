import React, { Component } from 'react';
import { utils } from '@alipay/report-engine';

interface ChordDiagramsProps {
    height: number;
    width: number;
    fit: boolean;
    source: any[]
}


class ChordDiagrams extends Component<ChordDiagramsProps> {

    static processAttributes = (attributes) => {
        utils.dealNumber(attributes, 'width');
        utils.dealNumber(attributes, 'height');
        utils.dealBoolean(attributes, 'fit');
        utils.dealTpl(attributes, 'source');
        utils.dealObject(attributes, 'source');
    }

    render() {
        return (
            <div>asdfsafd</div>
        )
    }

}

export default ChordDiagrams;
