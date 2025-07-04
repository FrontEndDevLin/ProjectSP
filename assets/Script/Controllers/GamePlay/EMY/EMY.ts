import { _decorator, BoxCollider2D, Component, Contact2DType, Node, v3, Vec3 } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { PIXEL_UNIT } from '../../../Common/Namespace';
import EMYManager from '../../../CManager/EMYManager';
import CHRManager from '../../../CManager/CHRManager';
const { ccclass, property } = _decorator;

@ccclass('EMY')
export class EMY extends OBT_Component {
    private _alive: boolean = true;

    private _collider: BoxCollider2D = null; 
    // temp
    private _hp: number = 8;
    private _spd: number = 3;

    start() {

    }

    protected onLoad(): void {
        this._collider = this.node.getComponent(BoxCollider2D);

        this._collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this);
    }
    private _onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        // switch (otherCollider.group) {
        //     case GP_GROUP.BULLET: {
        //         // 显示伤害由一个类单独管理
        //         // 通过tag获取弹头数据（tag也存在弹头db里），获取的弹头数据要经过角色面板的补正
        //         // console.log('被击中，扣血' + )
        //         let bulletDamage: number = BulletManager.instance.getBulletDamage(otherCollider.tag);
        //         // attr是自己的属性
        //         let attr = null;
        //         let realDamage: number = DamageManager.instance.calcDamage(bulletDamage, attr);
        //         this._hp -= realDamage;
        //         DamageManager.instance.showDamageTxt(realDamage, this.node.position);
        //         if (this._hp <= 0) {
        //             this.die();
        //         }
        //     } break;
        //     case GP_GROUP.CHARACTER: {
        //         console.log('击中角色')
        //     } break;
        // }
    }
    
    /**
     * 不同类型的兵行动逻辑不一样，普通杂兵只会向主角移动
     */
    private _move(dt) {
        // if (this._alive && ChapterManager.instance.onPlaying) {
        if (this._alive && true) {
            let characterLoc: Vec3 = CHRManager.instance.getCHRLoc();

            let speed = dt * this._spd * PIXEL_UNIT;
            let vector: Vec3 = v3(characterLoc.x - this.node.position.x, characterLoc.y - this.node.position.y).normalize();
            let newPos: Vec3 = this.node.position.add(new Vec3(vector.x * speed, vector.y * speed));
            this.node.setPosition(newPos);

            this._updateEnemyInfo(characterLoc);
        }
    }
    private _updateEnemyInfo(ctrVec: Vec3) {
        let cX = ctrVec.x;
        let cY = ctrVec.y;
        let { x, y } = this.node.position;
        let dis = Math.sqrt(Math.pow(x - cX, 2) + Math.pow(y - cY, 2));
        EMYManager.instance.updateEnemy(this.node.uuid, { alive: 1, dis, x, y });
    }

    public die() {
        EMYManager.instance.updateEnemy(this.node.uuid, { alive: 0 });
        // DropItemManager.instance.dropItem('EMY001', this.node.position);
        // TODO: 播放死亡动画，播放完后再销毁节点
        this._die();
    }
    // 干脆的死
    public dieImmediate() {
        // TODO: 播放死亡动画，播放完后再销毁节点
        this.node.destroy();
    }

    private _die() {
        EMYManager.instance.removeEnemy(this.node.uuid);
        this.node.destroy();
    }

    update(deltaTime: number) {
        this._move(deltaTime);
    }
}

