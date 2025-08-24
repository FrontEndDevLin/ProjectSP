import { _decorator, Component, Label, Node } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { CHRInfo, GAME_NODE, GamePlayEvent, ItemInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import ProcessManager from '../../../CManager/ProcessManager';
import OBT from '../../../OBT';
const { ccclass, property } = _decorator;

@ccclass('ItemCard')
export class ItemCard extends OBT_Component {
    private _props: ItemInfo.Item;

    protected onLoad(): void {
        this.node.OBT_param2 = {
            autoTouch: this._touchCard.bind(this)
        }

        const props: ItemInfo.Item = this.node.OBT_param1;
        this._props = props;

        // this.view("Content/Txt").getComponent(Label).string = `+${props.value} ${props.propTxt}`;

        this.node.once(Node.EventType.TOUCH_END, this._touchCard, this);
    }

    start() {

    }

    private _touchCard() {
        console.log('购买道具')
        // if (ProcessManager.instance.gameNode === GAME_NODE.LEVEL_UP) {
        //     CHRManager.instance.levelUpProp(this._props.prop);
        //     // 通知更新属性UI, TODO:(UI更新后2秒, 移除升级UI)
            this.hideNodeByPath();
        // }
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_END, this._touchCard, this);
    }

    update(deltaTime: number) {
        
    }
}


