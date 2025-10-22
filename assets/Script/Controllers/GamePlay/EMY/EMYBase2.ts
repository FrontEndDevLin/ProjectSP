import { _decorator, BoxCollider2D, Color, Component, Contact2DType, Node, Sprite, SpriteComponent, v3, Vec3, Animation } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { EMYInfo, FLASH_TIME, GameCollider, PIXEL_UNIT } from '../../../Common/Namespace';
import EMYManager from '../../../CManager/EMYManager';
import CHRManager from '../../../CManager/CHRManager';
import ProcessManager from '../../../CManager/ProcessManager';
import { copyObject } from '../../../Common/utils';
import DropItemManager from '../../../CManager/DropItemManager';
import DamageManager from '../../../CManager/DamageManager';
const { ccclass, property } = _decorator;

@ccclass('EMYBase2')
export class EMYBase2 extends OBT_Component {
    protected alive: boolean = true;

    protected collider: BoxCollider2D = null;

    protected flashing: boolean = false;
    protected flashTime: number = FLASH_TIME;
    protected FLASH_COLOR: Color = new Color(0, 255, 255);
    protected NORMAL_COLOR: Color = new Color(255, 255, 255);

    protected props: EMYInfo.EMYProps;

    protected id: string;

    start() {
    }

    protected onLoad(): void {
    }
    public init(props: EMYInfo.EMYProps, id: string) {
        this.id = id;
        this.alive = true;
        if (!this.collider) {
            this.loadCldComp();
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        this.collider.enabled = true;
        this.node.OBT_param2 = {
            id,
            runAway: this.runAway.bind(this)
        }
        this.props = copyObject(props);
    }
    protected loadCldComp() {
        this.collider = this.node.getComponent(BoxCollider2D);
    }

    protected onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        if (!this.alive || !ProcessManager.instance.isOnPlaying()) {
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
                    this.flash();
                }
            } break;
            // case GP_GROUP.CHARACTER: {
            //     console.log('击中角色')
            // } break;
        }
    }

    protected flash() {
        if (!this.flashing) {
            this.flashing = true;
            // this.spComp.color = this.FLASH_COLOR;
        }
        // 重置闪烁时间
        this.flashTime = FLASH_TIME;
    }
    private _cancelFlash() {
        this.flashing = false;
        // this.spComp.color = this.NORMAL_COLOR;
    }
    private _checkFlash(dt) {
        if (this.flashing) {
            this.flashTime -= dt;
            if (this.flashTime <= 0) {
                this._cancelFlash();
            }
        }
    }
    
    private _move(dt) {
        if (!this.alive) {
            return;
        }
        if (!ProcessManager.instance.isOnPlaying()) {
            return;
        }

        switch (this.props.move) {
            case "none": {
                // 移动类型为none时，不移动
            } break;
            default: {
                this.move(dt);
            } break;
        }

        this._updateEnemyInfo();
    }
    /**
     * 不同类型的兵行动逻辑不一样，普通杂兵只会向主角移动
     * 如果移动逻辑不同，在另外的类里重写这个方法
     */
    protected move(dt) {
        let characterLoc: Vec3 = CHRManager.instance.getCHRLoc();
        let speed = dt * this.props.spd;
        let vector: Vec3 = v3(characterLoc.x - this.node.position.x, characterLoc.y - this.node.position.y).normalize();
        let newPos: Vec3 = this.node.position.add(new Vec3(vector.x * speed, vector.y * speed));
        this.node.setPosition(newPos);
    }
    private _updateEnemyInfo() {
        let ctrVec: Vec3 = CHRManager.instance.getCHRLoc();
        let cX = ctrVec.x;
        let cY = ctrVec.y;
        let { x, y } = this.node.position;
        let dis = Math.sqrt(Math.pow(x - cX, 2) + Math.pow(y - cY, 2));
        EMYManager.instance.updateEnemy(this.id, { alive: 1, dis, x, y });
    }

    public die() {
        this.runAway();
        // 掉落物品并爆出粒子效果
        DropItemManager.instance.dropItem(this.props.id, this.node.position);
        EMYManager.instance.particleCtrl.createDieParticle(this.node.position, 4);
    }
    // 逃跑不掉东西
    protected runAway() {
        this.alive = false;
        this.node.getComponent(BoxCollider2D).enabled = false;
        EMYManager.instance.removeEnemy(this.id);
        this._playDieAni();
    }

    private _playDieAni() {
        // this.aniComp.play("EMY01_die");
    }
    private _remove() {
        EMYManager.instance.removeEmyNode(this.node);
    }

    update(deltaTime: number) {
        if (!ProcessManager.instance.isOnPlaying()) {
            return;
        }
        this._move(deltaTime);
        this._checkFlash(deltaTime);
    }
}

