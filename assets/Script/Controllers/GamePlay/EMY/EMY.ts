import { _decorator, BoxCollider2D, Color, Component, Contact2DType, Node, Sprite, SpriteComponent, v3, Vec3, Animation, AnimationComponent } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { EMYInfo, FLASH_TIME, GameCollider, PIXEL_UNIT } from '../../../Common/Namespace';
import EMYManager from '../../../CManager/EMYManager';
import CHRManager from '../../../CManager/CHRManager';
import BulletManager from '../../../CManager/BulletManager';
import ProcessManager from '../../../CManager/ProcessManager';
import { copyObject } from '../../../Common/utils';
import DropItemManager from '../../../CManager/DropItemManager';
import DamageManager from '../../../CManager/DamageManager';
const { ccclass, property } = _decorator;

@ccclass('EMY')
export class EMY extends OBT_Component {
    private _alive: boolean = true;

    private _collider: BoxCollider2D = null;

    private _flashing: boolean = false;
    private _flashTime: number = FLASH_TIME;
    private _FLASH_COLOR: Color = new Color(0, 255, 255);
    private _NORMAL_COLOR: Color = new Color(255, 255, 255);
    private _spComp: SpriteComponent;
    private _aniComp: AnimationComponent;

    public props: EMYInfo.EMYProps;

    start() {

    }

    protected onLoad(): void {
        this._collider = this.node.getComponent(BoxCollider2D);
        this._spComp = this.view("PIC").getComponent(Sprite);
        this._aniComp = this.view("PIC").getComponent(Animation);

        this._collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this);

        this.props = copyObject(this.node.OBT_param1);

        this.node.OBT_param2 = {
            fadeOut: this._fadeout.bind(this)
        }

        this._aniComp.on(Animation.EventType.FINISHED, () => {
            this._remove();
        });
    }
    private _onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        if (!this._alive || !ProcessManager.instance.isOnPlaying()) {
            return;
        }
        switch (otherCollider.group) {
            case GameCollider.GROUP.CHR_BULLET: {
                // 显示伤害由一个类单独管理
                let bulletId: string = otherCollider.node.name;
                let damage: number = DamageManager.instance.calcAttackDamage(bulletId);
                this.props.hp -= damage;
                // DamageManager.instance.showDamageTxt(realDamage, this.node.position);
                if (this.props.hp <= 0) {
                    this.die();
                } else {
                    // 受击效果
                    this._flash();
                }
            } break;
            // case GP_GROUP.CHARACTER: {
            //     console.log('击中角色')
            // } break;
        }
    }

    private _flash() {
        if (!this._flashing) {
            this._flashing = true;
            this._spComp.color = this._FLASH_COLOR;
        }
        // 重置闪烁时间
        this._flashTime = FLASH_TIME;
    }
    private _cancelFlash() {
        this._flashing = false;
        this._spComp.color = this._NORMAL_COLOR;
    }
    private _checkFlash(dt) {
        if (this._flashing) {
            this._flashTime -= dt;
            if (this._flashTime <= 0) {
                this._cancelFlash();
            }
        }
    }
    
    /**
     * 不同类型的兵行动逻辑不一样，普通杂兵只会向主角移动
     */
    private _move(dt) {
        if (this._alive && ProcessManager.instance.isOnPlaying()) {
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
        this._alive = false;
        this.node.getComponent(BoxCollider2D).destroy();
        // 播放死亡动画并爆出粒子效果，
        EMYManager.instance.updateEnemy(this.node.uuid, { alive: 0 });
        DropItemManager.instance.dropItem(this.props.id, this.node.position);
        // TODO: 播放死亡动画，播放完后再销毁节点
        this._die();
    }
    // 干脆的死
    private _fadeout() {
        // 播放死亡动画，播放完后再销毁节点
        this._aniComp.play("EMY01_die");
    }
    private _remove() {
        this.node.destroy();
    }

    private _die() {
        this._fadeout();
        EMYManager.instance.removeEnemy(this.node.uuid);
        EMYManager.instance.particleCtrl.createDieParticle(this.node.position, 4);
        // this.node.destroy();
    }

    update(deltaTime: number) {
        if (!ProcessManager.instance.isOnPlaying()) {
            return;
        }
        this._move(deltaTime);
        this._checkFlash(deltaTime);
    }
}

