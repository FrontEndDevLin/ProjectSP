import { _decorator, Color, Component, Label, Node, RichText, Sprite, SpriteFrame } from 'cc';
import OBT_Component from '../../../OBT_Component';
import ItemBase from '../Items/ItemBase';
import { ItemInfo } from '../../../Common/Namespace';
import ItemsManager from '../../../CManager/ItemsManager';
import OBT from '../../../OBT';
const { ccclass, property } = _decorator;

@ccclass('ItemCard')
export class ItemCard extends OBT_Component {
    protected onLoad(): void {
        const item: ItemBase = this.node.OBT_param1;

        this.node.OBT_param2 = {
            updateView: this._updateView.bind(this)
        }

        if (item) {
            this._updateView(item);
        }
    }

    start() {

    }

    private _updateView(item: ItemBase) {
        let level = item.level || 1;
        let uiConfg: ItemInfo.CardUIConfig = ItemsManager.instance.itemCardUIConfigMap[level];
        let borderAssets: SpriteFrame = OBT.instance.resourceManager.getSpriteFrameAssets(`Border/${uiConfg.border}`);
        this.view("Border").getComponent(Sprite).spriteFrame = borderAssets;

        this.view("Background").getComponent(Sprite).color = uiConfg.background;
        this.view("Container/Head/TitleWrap/ItemName").getComponent(Label).color = uiConfg.color;

        this.view("Container/Head/TitleWrap/ItemName").getComponent(Label).string = item.label;
        this.view("Container/Head/TitleWrap/ItemGroup").getComponent(Label).string = item.getGroupTxt();

        this.view("Container/Head/PicWrap/Pic").getComponent(Sprite).spriteFrame = item.getAssets();

        if (item.intro) {
            this.view("Container/Content/Intro").active = true;
            this.view("Container/Content/Intro").getComponent(RichText).string = item.getIntro();
        }

        let buffTxt: string = item.getBuffTxt();
        if (buffTxt) {
            this.view("Container/Content/RichTxt").getComponent(RichText).string = buffTxt;
        }
    }

    update(deltaTime: number) {
        
    }
}


