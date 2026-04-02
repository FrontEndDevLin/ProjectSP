import { _decorator, Component, Label, Node, RichText, Sprite, SpriteFrame } from 'cc';
import { CHRInfo } from '../../../Common/Namespace';
import OBT_Component from '../../../OBT_Component';
import CHRManager from '../../../CManager/CHRManager';
import { getSuccessRichTxt } from '../../../Common/utils';
const { ccclass, property } = _decorator;

@ccclass('PropIntro_Popup')
export class PropIntro_Popup extends OBT_Component {
    start() {

    }

    public updateView(item: CHRInfo.Prop) {
        if (item.ico) {
            let assets: SpriteFrame = this.view("Container/CardHead/PicWrap/Pic").getComponent(Sprite).spriteAtlas.getSpriteFrame(item.ico);
            this.view("Container/CardHead/PicWrap/Pic").getComponent(Sprite).spriteFrame = assets;
        } else {
            this.view("Container/CardHead/PicWrap/Pic").getComponent(Sprite).spriteFrame = null;
        }
        this.view("Container/CardHead/TitleWrap/Title").getComponent(Label).string = item.txt;
        this.view("Container/CardHead/TitleWrap/SubTitle").getComponent(Label).string = "主要属性";

        let intro = item.intro;

        switch (item.prop) {
            case "def": {
                let defPercent: number = Math.round(CHRManager.instance.propCtx.getDefReduceRate() * 100);
                intro += `${getSuccessRichTxt(defPercent)}%`;
            } break;
        }

        this.view("Container/Content/Intro").getComponent(RichText).string = intro;
    }

    update(deltaTime: number) {
        
    }
}


