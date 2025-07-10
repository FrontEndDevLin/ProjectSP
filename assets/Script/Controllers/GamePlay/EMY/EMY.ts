import { _decorator, BoxCollider2D, Component, Contact2DType, Node, v3, Vec3 } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { EMYInfo, GameCollider, PIXEL_UNIT } from '../../../Common/Namespace';
import EMYManager from '../../../CManager/EMYManager';
import CHRManager from '../../../CManager/CHRManager';
import BulletManager from '../../../CManager/BulletManager';
import ProcessManager from '../../../CManager/ProcessManager';
import { copyObject } from '../../../Common/utils';
import DropItemManager from '../../../CManager/DropItemManager';
const { ccclass, property } = _decorator;

@ccclass('EMY')
export class EMY extends OBT_Component {
    private _alive: boolean = true;

    private _collider: BoxCollider2D = null;

    public props: EMYInfo.EMYProps;

    start() {

    }

    protected onLoad(): void {
        this._collider = this.node.getComponent(BoxCollider2D);

        this._collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this);

        this.props = copyObject(this.node.OBT_param1);
    }
    private _onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        switch (otherCollider.group) {
            case GameCollider.GROUP.CHR_BULLET: {
                // 显示伤害由一个类单独管理
                // 通过tag获取弹头数据（tag也存在弹头db里），获取的弹头数据要经过角色面板的补正
                console.log('敌人被击中，扣血');
                let bulletDamage: number = BulletManager.instance.getBulletDamage(otherCollider.tag);
                // attr是自己的属性
                // let attr = null;
                // let realDamage: number = DamageManager.instance.calcDamage(bulletDamage, attr);
                let realDamage: number = bulletDamage;
                this.props.hp -= realDamage;
                // DamageManager.instance.showDamageTxt(realDamage, this.node.position);
                if (this.props.hp <= 0) {
                    this.die();
                }
            } break;
            // case GP_GROUP.CHARACTER: {
            //     console.log('击中角色')
            // } break;
        }
    }
    
    /**
     * 不同类型的兵行动逻辑不一样，普通杂兵只会向主角移动
     */
    private _move(dt) {
        // if (this._alive && ChapterManager.instance.onPlaying) {
        if (this._alive && true) {
            let characterLoc: Vec3 = CHRManager.instance.getCHRLoc();

            let speed = dt * this.props.spd * PIXEL_UNIT;
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
        DropItemManager.instance.dropItem(this.props.id, this.node.position);
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
        if (!ProcessManager.instance.isOnPlaying()) {
            return;
        }
        this._move(deltaTime);
    }
}

