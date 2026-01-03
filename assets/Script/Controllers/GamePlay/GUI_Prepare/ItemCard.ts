import { _decorator, Component, Label, Node, RichText, Sprite, SpriteFrame } from 'cc';
import OBT_Component from '../../../OBT_Component';
import ItemBase from '../Items/ItemBase';
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
        this.view("Head/TitleWrap/ItemName").getComponent(Label).string = item.label;
        this.view("Head/TitleWrap/ItemGroup").getComponent(Label).string = item.getGroupTxt();

        this.view("Head/Pic").getComponent(Sprite).spriteFrame = item.getAssets();

        if (item.intro) {
            this.view("Content/Intro").active = true;
            this.view("Content/Intro").getComponent(RichText).string = item.getIntro();
        }

        let buffTxt: string = item.getBuffTxt();
        if (buffTxt) {
            this.view("Content/RichTxt").getComponent(RichText).string = buffTxt;
        }
    }

    update(deltaTime: number) {
        
    }
}


