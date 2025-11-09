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

@ccclass('EMY_Base')
export class EMY_Base extends OBT_Component {
    protected alive: boolean = true;

    protected collider: BoxCollider2D = null;

    protected spNodePath: string[] = ["Body/PIC"];

    protected flashing: boolean = false;
    protected flashTime: number = FLASH_TIME;
    protected FLASH_COLOR: Color = new Color(0, 255, 255);
    protected NORMAL_COLOR: Color = new Color(255, 255, 255);
    // spNodes节点下的图形组件spComps和动画组件aniComps, 三者一起初始化
    protected spNodes: Node[] = [];
    protected spComps: SpriteComponent[] = [];
    protected aniComps: Animation[] = [];

    protected props: EMYInfo.EMYProps;

    protected id: string;

    protected bodyNode: Node;

    // 与角色的距离
    protected dis: number;
    protected vector: Vec3;

    protected cd: number = 0;

    // 攻击阶段
    protected attackStage: EMYInfo.ATTACK_STAGE = EMYInfo.ATTACK_STAGE.NONE;
    // 移动类型数组
    protected moveTypeList: string[] = [];
    // 当前移动类型
    protected currentMoveType: string;
    // 移动时是否朝向目标
    protected isFaceToTarget: boolean = false;

    start() {
    }

    protected onLoad(): void {
        
    }
    // 初始化主体节点
    protected initBodyNode() {
        if (!this.bodyNode) {
            this.bodyNode = this.view("Body");
            // 阵亡动画播放完成
            this.bodyNode.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
                this._remove();
            })
        }
        this.bodyNode.setScale(v3(1, 1));
    }
    // 初始化碰撞体
    protected initCollider() {
        if (this.collider) {
            this.collider.enabled = true;
            return;
        }
        this.collider = this.node.getComponent(BoxCollider2D);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.collider.enabled = true;
    }
    // 初始化图形节点
    protected initSprite() {
        if (this.spNodes) {
            return;
        }
        this.spNodePath.forEach((path: string, i: number) => {
            let spNode: Node = this.view(path);
            this.spNodes.push(spNode);
            this.spComps[i] = spNode.getComponent(Sprite);
            this.aniComps[i] = spNode.getComponent(Animation);
        })
    }
    // 其他初始化操作, 子组件需要可使用
    protected initOther() {}

    public init(props: EMYInfo.EMYProps, id: string) {
        this.id = id;
        this.alive = true;
        this.initBodyNode();
        this.initCollider();
        this.initSprite();

        this.node.OBT_param2 = {
            id,
            runAway: this.runAway.bind(this)
        }
        this.attackStage = EMYInfo.ATTACK_STAGE.NONE;
        this.props = copyObject(props);
        if (!this.props.move) {
            this.props.move = "none";
        }
        this.moveTypeList = this.props.move.split(",");
        this.currentMoveType = this.moveTypeList[0];

        this.initOther();
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
            this.spComps.forEach((spComp: Sprite) => {
                spComp.color = this.FLASH_COLOR;
            })
        }
        // 重置闪烁时间
        this.flashTime = FLASH_TIME;
    }
    private _cancelFlash() {
        this.flashing = false;
        this.spComps.forEach((spComp: Sprite) => {
            spComp.color = this.NORMAL_COLOR;
        })
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

        switch (this.currentMoveType) {
            case "none": {
                // 移动类型为none时，不移动
            } break;
            case "normal": {
                this.normalMove(dt);
            } break;
        }

        this._updateEnemyInfo();
    }
    /**
     * 不同类型的兵行动逻辑不一样，普通杂兵只会向主角移动
     * 如果移动逻辑不同，在另外的类里重写这个方法
     */
    protected normalMove(dt) {
        // 攻击过程中不走普通移动流程
        if (this.isAttacking()) {
            return;
        }
        let characterLoc: Vec3 = CHRManager.instance.getCHRLoc();
        this.vector = v3(characterLoc.x - this.node.position.x, characterLoc.y - this.node.position.y).normalize();
        // 移动时头始终朝向角色
        if (this.isFaceToTarget) {
            let angle = getAngleByVector(this.vector);
            this.bodyNode.angle = angle;
        }
        let speed = dt * this.props.spd;
        let newPos: Vec3 = this.node.position.add(new Vec3(this.vector.x * speed, this.vector.y * speed));
        this.node.setPosition(newPos);
    }

    private _updateEnemyInfo() {
        let ctrVec: Vec3 = CHRManager.instance.getCHRLoc();
        let cX = ctrVec.x;
        let cY = ctrVec.y;
        let { x, y } = this.node.position;
        let dis = Math.sqrt(Math.pow(x - cX, 2) + Math.pow(y - cY, 2));
        this.dis = dis;
        EMYManager.instance.updateEnemy(this.id, { alive: 1, dis, x, y });
    }

    public die() {
        this.alive = false;
        this.collider.enabled = false;
        EMYManager.instance.removeEnemy(this.id);
        this._playDieAni();
        // 掉落物品并爆出粒子效果
        DropItemManager.instance.dropItem(this.props.id, this.node.position);
    }
    // 逃跑
    protected runAway() {
        this.alive = false;
        this.collider.enabled = false;
        EMYManager.instance.removeEnemy(this.id);
        this._playDieAni();
    }

    private _playDieAni() {
        this.bodyNode.getComponent(Animation).play("EMY01_die");
    }
    private _remove() {
        EMYManager.instance.removeEmyNode(this.node);
    }

    protected trySpecitalAttack(dt: number) {}

    // 是否处于攻击过程
    protected isAttacking() {
        return this.attackStage === EMYInfo.ATTACK_STAGE.BEFORE_ATTACK || this.attackStage === EMYInfo.ATTACK_STAGE.ATTKING;
    }

    update(deltaTime: number) {
        if (!ProcessManager.instance.isOnPlaying()) {
            return;
        }
        this._move(deltaTime);
        this._checkFlash(deltaTime);

        this.trySpecitalAttack(deltaTime);
    }
}

