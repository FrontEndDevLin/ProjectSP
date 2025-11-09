import { _decorator, BoxCollider2D, Color, Component, Contact2DType, Node, Sprite, SpriteComponent, v3, Vec3, Animation, UITransform } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { DamageInfo, EMYInfo, FLASH_TIME, GameCollider, PIXEL_UNIT, Point } from '../../../Common/Namespace';
import EMYManager from '../../../CManager/EMYManager';
import CHRManager from '../../../CManager/CHRManager';
import ProcessManager from '../../../CManager/ProcessManager';
import { copyObject, getAngleByVector, getFloatNumber, getRandomNumber, getVectorByAngle } from '../../../Common/utils';
import DropItemManager from '../../../CManager/DropItemManager';
import DamageManager from '../../../CManager/DamageManager';
import BulletManager from '../../../CManager/BulletManager';
const { ccclass, property } = _decorator;

@ccclass('EMY03')
export class EMY03 extends OBT_Component {
    protected alive: boolean = true;

    protected collider: BoxCollider2D = null;

    protected flashing: boolean = false;
    protected flashTime: number = FLASH_TIME;
    protected FLASH_COLOR: Color = new Color(0, 255, 255);
    protected NORMAL_COLOR: Color = new Color(255, 255, 255);
    protected spNode: Node;
    // protected spCompList: SpriteComponent[];
    protected spComp: SpriteComponent;
    protected aniComp: Animation;
    protected atkAniComp: Animation;

    protected props: EMYInfo.EMYProps;

    protected id: string;

    // 与角色的距离
    private _dis: number;
    private _vector: Vec3;
    private _cd: number = 0;

    private _attackStage: EMYInfo.ATTACK_STAGE = EMYInfo.ATTACK_STAGE.NONE;
    // 冲刺时间
    private _sprintTime: number = 1;

    start() {
    }

    protected onLoad(): void {
    }
    public init(props: EMYInfo.EMYProps, id: string) {
        this.id = id;
        this.alive = true;
        if (!this.spNode) {
            this.loadSpNode();
        }
        this.spNode.setScale(v3(1, 1));
        if (!this.collider) {
            this.loadCldComp();
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        this.collider.enabled = true;
        if (!this.spComp) {
            this.loadSpComp();
        }
        if (!this.aniComp) {
            this.loadAniComp();
            this.aniComp.on(Animation.EventType.FINISHED, () => {
                this._remove();
            });
            this.atkAniComp.on(Animation.EventType.FINISHED, () => {
                this._finishBeforeAttack();
            });
        }
        this.node.OBT_param2 = {
            id,
            runAway: this.runAway.bind(this)
        }
        this._attackStage = EMYInfo.ATTACK_STAGE.NONE;
        this.props = copyObject(props);
    }
    protected loadSpNode() {
        this.spNode = this.view("PIC");
    }
    protected loadCldComp() {
        this.collider = this.node.getComponent(BoxCollider2D);
    }
    protected loadSpComp() {
        this.spComp = this.spNode.getComponent(Sprite);
    }
    protected loadAniComp() {
        this.aniComp = this.spNode.getComponent(Animation);
        this.atkAniComp = this.node.getComponent(Animation);
    }

    protected onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        if (!this.alive || !ProcessManager.instance.isOnPlaying()) {
            return;
        }
        switch (otherCollider.group) {
            case GameCollider.GROUP.CHR_BULLET: {
                // 显示伤害由一个类单独管理
                let bulletId: string = otherCollider.node.name;
                let damageAttr: DamageInfo.DamageAttr = DamageManager.instance.calcAttackDamage(bulletId);
                // damageAttr.isCtitical // 暴击
                this.props.hp -= damageAttr.dmg;
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
        if (!this.flashing) {
            this.flashing = true;
            this.spComp.color = this.FLASH_COLOR;
        }
        // 重置闪烁时间
        this.flashTime = FLASH_TIME;
    }
    private _cancelFlash() {
        this.flashing = false;
        this.spComp.color = this.NORMAL_COLOR;
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
     * 
     * 生成一个向量, 朝该向量移动, 该向量与角色保持在120度内(-60, 60)
     * 每一帧出一个随机数, 命中之后(转向)重新生成向量
     * 当角色与该向量角度超出时, 转向
     */
    protected move(dt) {
        // 攻击过程中不走普通移动流程
        if (this._isAttacking()) {
            return;
        }
        let characterLoc: Vec3 = CHRManager.instance.getCHRLoc();
        this._vector = v3(characterLoc.x - this.node.position.x, characterLoc.y - this.node.position.y).normalize();
        // 移动时头始终朝向角色
        let angle = getAngleByVector(this._vector);
        this.spNode.angle = angle;
        let speed = dt * this.props.spd;
        let newPos: Vec3 = this.node.position.add(new Vec3(this._vector.x * speed, this._vector.y * speed));
        this.node.setPosition(newPos);
    }

    private _updateEnemyInfo() {
        let ctrVec: Vec3 = CHRManager.instance.getCHRLoc();
        let cX = ctrVec.x;
        let cY = ctrVec.y;
        let { x, y } = this.node.position;
        let dis = Math.sqrt(Math.pow(x - cX, 2) + Math.pow(y - cY, 2));
        this._dis = dis;
        EMYManager.instance.updateEnemy(this.id, { alive: 1, dis, x, y });
    }

    public die() {
        this.alive = false;
        this.node.getComponent(BoxCollider2D).enabled = false;
        EMYManager.instance.removeEnemy(this.id);
        this._playDieAni();
        // 掉落物品并爆出粒子效果
        DropItemManager.instance.dropItem(this.props.id, this.node.position);
    }
    // 逃跑
    protected runAway() {
        this.alive = false;
        this.node.getComponent(BoxCollider2D).enabled = false;
        EMYManager.instance.removeEnemy(this.id);
        this._playDieAni();
    }

    private _playDieAni() {
        this.aniComp.play("EMY01_die");
    }
    private _remove() {
        EMYManager.instance.removeEmyNode(this.node);
    }

    private _trySpecitalAttack(dt: number) {
        if (this._cd <= 0) {
            if (!this._dis) {
                return;
            }
            if (this.props.attack_range >= this._dis || this._attackStage === EMYInfo.ATTACK_STAGE.ATTKING) {
                this._specialAttack(dt);
            }
        } else {
            this._cd -= dt;
        }
    }

    /**
     * 进入攻击范围后，朝角色冲刺攻击
     * 前摇，旋转自身 + 原地呆滞0.1s
     * 攻击, 朝前摇阶段锁定的位置发起冲锋
     */
    private _specialAttack(dt: number) {
        if (this._attackStage === EMYInfo.ATTACK_STAGE.NONE) {
            this._attackStage = EMYInfo.ATTACK_STAGE.BEFORE_ATTACK;
            this.node.getComponent(Animation).play("EMY_sprint_before_attack");
        }
        if (this._attackStage === EMYInfo.ATTACK_STAGE.ATTKING) {
            this._sprint(dt);
        }
    }
    // 攻击前摇
    private _finishBeforeAttack() {
        this.scheduleOnce(() => {
            if (this.alive && ProcessManager.instance.isOnPlaying()) {
                this._attackStage = EMYInfo.ATTACK_STAGE.ATTKING;
            }
        }, 0.2)
    }
    // 冲刺攻击中
    private _sprint(dt: number) {
        let speed = dt * 300;
        let newPos: Vec3 = this.node.position.add(new Vec3(this._vector.x * speed, this._vector.y * speed));
        this.node.setPosition(newPos);
        this._sprintTime -= dt;
        if (this._sprintTime <= 0) {
            this._attackStage = EMYInfo.ATTACK_STAGE.NONE;
            this._cd = this.props.attack_cd;
            this._sprintTime = 1;
        }
    }

    // 是否处于攻击过程
    private _isAttacking() {
        return this._attackStage === EMYInfo.ATTACK_STAGE.BEFORE_ATTACK || this._attackStage === EMYInfo.ATTACK_STAGE.ATTKING;
    }

    update(deltaTime: number) {
        if (!ProcessManager.instance.isOnPlaying()) {
            return;
        }
        this._move(deltaTime);
        this._checkFlash(deltaTime);

        this._trySpecitalAttack(deltaTime);
    }
}

