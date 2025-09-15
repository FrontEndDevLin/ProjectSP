import { _decorator, Component, Node, tween, v3, Vec3 } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { ItemInfo, PIXEL_UNIT } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import { getDistance } from '../../../Common/utils';
const { ccclass, property } = _decorator;

/**
 * OBT_param1.targetVec 被爆出后，运动到的最终位置
 * OBT_param1.quality 战利品品质
 * OBT_param2 是否被捡起
 */
@ccclass('TrophyBlock')
export class TrophyBlock extends OBT_Component {
    // 掉落中，动画过程不可被拾取
    private _droping: boolean = true;
    private _quality: number;

    protected onLoad(): void {
        super.onLoad();
    }

    start() {
        const prop1 = this.node.OBT_param1;
        const targetVec: Vec3 = prop1.targetVec;
        this._quality = prop1.quality;

        switch (this._quality) {
            case ItemInfo.TROPHY_TYPE.NORMAL: {

            } break;
            case ItemInfo.TROPHY_TYPE.NORMAL: {

            } break;
            case ItemInfo.TROPHY_TYPE.NORMAL: {

            } break;
        }

        if (!targetVec) {
            return;
        }

        tween(this.node)
            .to(0.1, { position: targetVec })
            .call(() => {
                this._droping = false;
            })
            .start();
    }

    private _pickUp(dt: number) {
        if (this._droping) {
            return;
        }
        let absorbing: boolean = this.node.OBT_param2;
        if (!absorbing) {
            return;
        }

        let crtLoc: Vec3 = CHRManager.instance.getCHRLoc();
        let nodeLoc: Vec3 = this.node.position;
        let dis: number = getDistance(nodeLoc, crtLoc);
        if (dis <= 3) {
            console.log('TODO: 战利品被捡起!');
            switch (this._quality) {
                case ItemInfo.TROPHY_TYPE.CHEST: {
                    // TODO: 去道具管理类生成一个宝箱
                    // ItemsManager.instance.pickChest(TROPHY_TYPE.CHEST);
                } break;
            
                default:
                    break;
            }
            
            this.node.destroy();
            return;
        }

        let speed = dt * 10 * PIXEL_UNIT;
        let vector: Vec3 = v3(crtLoc.x - nodeLoc.x, crtLoc.y - nodeLoc.y).normalize();
        let newPos: Vec3 = nodeLoc.add(new Vec3(vector.x * speed, vector.y * speed));
        this.node.setPosition(newPos);
    }

    public recovery() {
        this._droping = false;
        this.node.OBT_param2 = true;
    }

    update(dt: number) {
        this._pickUp(dt);
    }
}

