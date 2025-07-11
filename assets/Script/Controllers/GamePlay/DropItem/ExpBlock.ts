import { _decorator, Component, Node, tween, UITransform, v3, Vec3 } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { getDistance } from '../../../Common/utils';
import CHRManager from '../../../CManager/CHRManager';
import { PIXEL_UNIT } from '../../../Common/Namespace';
const { ccclass, property } = _decorator;

/**
 * OBT_param1.targetVec 被爆出后，运动到的最终位置
 * OBT_param1.expCnt 经验数量
 * OBT_param2 = 是否正被吸收
 */
@ccclass('ExpBlock')
export class ExpBlock extends OBT_Component {
    // 掉落中，动画过程不可被拾取
    private _droping: boolean = true;

    private _recovering: boolean = false;

    protected onLoad(): void {
        // super.onLoad();
    }

    start() {
        const targetVec: Vec3 = this.node.OBT_param1.targetVec;

        if (!targetVec) {
            return;
        }
        // console.log(targetVec);

        tween(this.node)
            .to(0.1, { position: targetVec })
            .call(() => {
                this._droping = false;
            })
        .start();
    }

    /**
     * 被角色吸收动画
     */
    private _absorb(dt: number) {
        if (this._recovering) {
            return;
        }
        // 吸走动画，每一帧检测角色位置朝角色位移，直到与角色位置小于5px，销毁
        let absorbing: boolean = this.node.OBT_param2;
        if (!absorbing) {
            return;
        }
        if (this._droping) {
            return;
        }
        let crtLoc: Vec3 = CHRManager.instance.getCHRLoc();
        let nodeLoc: Vec3 = this.node.position;
        let dis: number = getDistance(nodeLoc, crtLoc);
        if (dis <= 5) {
            // temp 可以做爆裂开的粒子效果
            let expCnt: number = this.node.OBT_param1.expCnt;
            CHRManager.instance.addExp(expCnt);
            // CurrencyManager.instance.addCurrency(expCnt);
            this.node.destroy();
            return;
        }

        let speed = dt * 10 * PIXEL_UNIT;
        let vector: Vec3 = v3(crtLoc.x - nodeLoc.x, crtLoc.y - nodeLoc.y).normalize();
        let newPos: Vec3 = nodeLoc.add(new Vec3(vector.x * speed, vector.y * speed));
        this.node.setPosition(newPos);
    }

    /**
     * 被回收
     */
    public recovery() {
        this._droping = false;
        this.node.OBT_param2 = false;
        this._recovering = true;
    }

    /**
     * 经验回收动画
     */
    private _recovery(dt: number) {
        // 朝血条下方回收图标位置位移，直到小于2px，销毁
        // if (!this._recovering) {
        //     return;
        // }

        // let iconLoc: Vec3 = DropItemManager.instance.expIconWorldPos;
        // let nodeLoc: Vec3 = this.node.position;
        // let dis: number = getDistance(nodeLoc, iconLoc);
        // if (dis <= 5) {
        //     // console.log('TODO: 经验被回收!');
        //     CurrencyManager.instance.addStorage(this.node.OBT_param1.expCnt);
        //     this.node.destroy();
        //     return;
        // }

        // let speed = dt * 16 * GP_UNIT;
        // let vector: Vec3 = v3(iconLoc.x - nodeLoc.x, iconLoc.y - nodeLoc.y).normalize();
        // let newPos: Vec3 = nodeLoc.add(new Vec3(vector.x * speed, vector.y * speed));
        // this.node.setPosition(newPos);
    }

    update(dt: number) {
        this._absorb(dt);
        // this._recovery(dt);
    }
}


