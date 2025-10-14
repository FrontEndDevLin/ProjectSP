import { _decorator, Component, Label, Node } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { CHRInfo, GamePlayEvent, ItemInfo } from '../../../Common/Namespace';
import OBT from '../../../OBT';
import CHRManager from '../../../CManager/CHRManager';
const { ccclass, property } = _decorator;

@ccclass('GUI_ItemPreview')
export class GUI_ItemPreview extends OBT_Component {
    protected onLoad(): void {
        this.node.OBT_param2 = {
            updateView: this._updateView.bind(this)
        }

        this.view("Mask").on(Node.EventType.TOUCH_END, this._hideUI, this);

        this.view("CardWrap/ItemCard").addComponent("ItemCard");
    }

    start() {
        
    }

    private _updateView(item: ItemInfo.Item) {
        this.view("CardWrap/ItemCard").OBT_param2.updateView(item);
    }

    private _hideUI() {
        // CHRManager.instance.propCtx.hidePropIntro();
    }

    protected onDestroy(): void {
    }

    update(deltaTime: number) {
        
    }
}


