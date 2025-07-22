import { _decorator, Component, Label, Node } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { CHRInfo } from '../../../Common/Namespace';
const { ccclass, property } = _decorator;

@ccclass('LevelUpCard')
export class LevelUpCard extends OBT_Component {
    protected onLoad(): void {
        const props: CHRInfo.UpdateProp = this.node.OBT_param1;
        console.log('卡片属性')
        console.log(props)

        this.view("Content/Txt").getComponent(Label).string = `+${props.value} ${props.propTxt}`;
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


