import { _decorator, Component, Label, Node } from 'cc';
import OBT_Component from '../../OBT_Component';
import { CHRInfo, GamePlayEvent, ItemInfo } from '../../Common/Namespace';
import OBT from '../../OBT';
import CHRManager from '../../CManager/CHRManager';
import { ItemPreview } from './GUI_Popup/ItemPreview';
import ItemsManager from '../../CManager/ItemsManager';
import { PropIntro } from './GUI_Popup/PropIntro';
const { ccclass, property } = _decorator;

@ccclass('GUI_Popup')
export class GUI_Popup extends OBT_Component {
    protected itemPreviewPopupCtx: ItemPreview;
    protected propIntroCtx: PropIntro;

    protected onLoad(): void {
        this.view("ItemPreview").addComponent("ItemPreview");
        this.view("PropIntro").addComponent("PropIntro");

        this.view("Mask").on(Node.EventType.TOUCH_END, this._hideAll, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GUI.SHOW_PREVIEW_ITEM_UI, this._showItemPreviewPopup, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GUI.SHOW_PROP_INTRO_UI, this._showPropIntroPopup, this);
    }

    start() {
        
    }

    private _showPropIntroPopup(propKey: string, index: number) {
        if (!this.propIntroCtx) {
            this.propIntroCtx = <PropIntro>this.view("PropIntro").getComponent("PropIntro");
        }
        let item: CHRInfo.Prop = CHRManager.instance.propCtx.getPropInfo(propKey);
        this.propIntroCtx.showPropIntro(item, index);
        this.showNodeByPath();
    }
    private _hidePropIntroPopup() {
        if (!this.propIntroCtx) {
            this.propIntroCtx = <PropIntro>this.view("PropIntro").getComponent("PropIntro");
        }
        this.propIntroCtx.hidePropIntro();
        this.hideNodeByPath();
    }

    private _showItemPreviewPopup(id: string, index: number) {
        if (!this.itemPreviewPopupCtx) {
            this.itemPreviewPopupCtx = <ItemPreview>this.view("ItemPreview").getComponent("ItemPreview");
        }
        let item: ItemInfo.Item = ItemsManager.instance.getItemById(id);
        this.itemPreviewPopupCtx.showPreviewPopup(item, index);
        this.showNodeByPath();
    }
    private _hideItemPreviewPopup() {
        if (!this.itemPreviewPopupCtx) {
            this.itemPreviewPopupCtx = <ItemPreview>this.view("ItemPreview").getComponent("ItemPreview");
        }
        this.itemPreviewPopupCtx.hidePreviewPopup();
        this.hideNodeByPath();
    }

    private _hideAll() {
        this._hidePropIntroPopup();
        this._hideItemPreviewPopup();
    }

    private _updateView() {
        // this.view("CardWrap/ItemCard").OBT_param2.updateView(item);
    }

    protected onDestroy(): void {
    }

    update(deltaTime: number) {
        
    }
}


