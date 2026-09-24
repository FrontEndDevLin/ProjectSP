import { _decorator, BoxCollider2D, Node, v3, Vec3 } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { Common, DamageInfo, EMYInfo, GameCollider, GamePlayEventOptions, REPEL_TIME } from '../../../Common/Namespace';
import EMYManager from '../../../CManager/EMYManager';
import CHRManager from '../../../CManager/CHRManager';
import ProcessManager from '../../../CManager/ProcessManager';
import { copyObject, getFloatNumber, getRandomNumber, getVectorByAngle } from '../../../Common/utils';
import DropItemManager from '../../../CManager/DropItemManager';
import DamageManager from '../../../CManager/DamageManager';
import RealTimeEventManager from '../../../CManager/RealTimeEventManager';
import WarCoreManager from '../../../CManager/WarCoreManager';
import { HitInfo } from '../../../CManager/CombatManager';
import WeaponBasic from '../Weapons/WeaponBasic';
import WeaponManager from '../../../CManager/WeaponManager';
import MoveBasic from '../MoveBehavior/MoveBasic';
import { MoveBehavior_def } from '../MoveBehavior/MoveBehavior_def';
import { EmyEffect } from '../Effect/Emy/EmyEffect';
import WeaponEmy from '../Weapons/WeaponEmy';
import Weapon_Emy_Body from '../Weapons/Weapon_Emy_Body';
const { ccclass, property } = _decorator;

/**
 * 敌人系统构造
 *  敌人基类，只负责“持有数据”和“管理子组件”，不包含任何具体的移动或攻击逻辑
 *    - 动态挂载移动行为类
 *    - 动态挂载攻击行为类(武器类)
 *  每个敌人都有自身碰撞体, 用于检测与角色武器范围的碰撞
 *  大多数敌人都有身体碰撞武器, 用于与角色身体的碰撞
 *  中立生物没有身体碰撞武器，碰到角色时不会造成伤害
 */

@ccclass('EmyBasic1')
export class EmyBasic1 extends OBT_Component {
    protected alive: boolean = true;

    public props: EMYInfo.EMYProps;
    public id: string;
    protected maxHp: number;

    // 是否面向目标
    public isFaceToTarget: boolean = false;

    // 与角色的距离
    public dis: number;
    public vector: Vec3;
    protected cd: number = 0;

    protected isInit: boolean = false;
    protected bodyCollider: BoxCollider2D;

    // 移动行为, 第一个为默认移动行为
    protected moveBehavior1: string;
    protected moveBehavior2: string;
    protected moveBehavior3: string;
    protected moveBehavior1Ctx: MoveBasic;
    protected moveBehavior2Ctx: MoveBasic;
    protected moveBehavior3Ctx: MoveBasic;
    public currentMoveBehavior: MoveBasic;

    protected weapon1: string;
    protected weapon2: string;
    protected weapon3: string;
    protected weapon1Ctx: WeaponEmy;
    protected weapon2Ctx: WeaponEmy;
    protected weapon3Ctx: WeaponEmy;
    protected bodyWeaponCtx: Weapon_Emy_Body;

    protected bodyNode: Node;

    protected effectName: string = "EmyEffect";
    // 根据配置加载不同的效果
    protected effect: EmyEffect;

    protected hasSpecialAttack: boolean = false;
    public canSpecialAttack: boolean = false;

    protected buff: EMYInfo.EMYBuff = {};

    start() {
    }

    protected onLoad(): void {
        
    }
    // 初始化主体节点
    protected initBodyNode() {
        if (!this.bodyNode) {
            this.bodyNode = this.view("Body");
        }
        this.bodyNode.setScale(v3(1, 1));
    }
    protected initEffect() {
        let effect: EmyEffect = <EmyEffect>this.bodyNode.addComponent(this.effectName);
        effect.init(this);
        this.effect = effect;

        this.registerAnimationEvent("die", this._remove, this);
    }

    public registerAnimationEvent(eventName: string, fn: Function, context?: any) {
        this.effect.registerAnimationEvent(eventName, fn, context);
    }
    public playBodyAnimation(animName: string) {
        this.effect.playBodyAnimation(animName);
    }

    // 其他初始化操作, 子组件需要可使用
    protected onInit() {}

    public init(props: EMYInfo.EMYProps, id: string) {
        this.id = id;
        this.alive = true;
        this.initBodyNode();
        this.node.OBT_param2 = {
            runAway: this.runAway.bind(this)
        }
        this.props = copyObject(props);

        if (this.props.attack_range) {
            this.hasSpecialAttack = true;
        }

        // console.log(`生成敌人${props.id}, 血量${props.c_hp}, 伤害${props.c_dmg}, 特殊伤害${props.c_spec_dmg}`)
        this.maxHp = props.c_hp;
        this.buff = {};

        // 加载身体碰撞
        if (!this.isInit) {
            this.bodyCollider = this.node.getComponent(BoxCollider2D);
            this.initWeapons();
            this.initEffect();
            this.initMoveBehaviors();
            this.isInit = true;
        }
        // if (!this.bodyWeaponCtx) {
        //     this.bodyWeaponCtx = WeaponManager.instance.getIWeaponCtxById("Weapon_Emy_Body") as Weapon_Emy_Body;
        //     this.bodyWeaponCtx.mountBehaviorModule(this.view("Weapons"));
        // }
        // this.bodyWeaponCtx.behaviorCtx.init(id, this);
        this.setColliderEnabled(true);
        this.runWeaponInitEvent();

        this.setCurrentMoveBehavior(this.moveBehavior1);
        this.onInit();
    }

    public onHit(damageInfo: HitInfo) {
        if (damageInfo.slowdown) {
            // console.log('TODO: 敌人减速', damageInfo.slowdown);
            // console.log('TODO: 敌人减速时间', damageInfo.slowdownTime);
            this.setBuff("spd", -damageInfo.slowdown, damageInfo.slowdownTime);
        }

        let dmg = damageInfo.damage;
        if (damageInfo.isCritical) {
            // console.log('触发暴击，伤害为' + dmg);
            RealTimeEventManager.instance.onCtiticalAttack();
        }
        if (!dmg || dmg <= 0) {
            return;
        }

        let dmgReduceRate: number = this.getBuffValue("dmg_reduce_rate");
        if (dmgReduceRate && dmgReduceRate > 0 && dmgReduceRate < 1) {
            dmg = Math.round(dmg * (1 - dmgReduceRate));
            console.log('触发减伤，伤害为' + dmg);
        }

        this.props.c_hp -= dmg;

        // TODO: 计算击退距离
        let repel: number = damageInfo.repel || 0;
        let weight: number = this.props.weight || 0;
        repel = repel - weight;
        if (repel > 0) {
            // console.log('击退敌人: ' + repel + '距离');
            // 角色->敌人向量
            // 角色->自身向量
            let characterLoc: Vec3 = CHRManager.instance.getCHRLoc();
            let vector = v3(this.node.position.x - characterLoc.x, this.node.position.y - characterLoc.y).normalize();
            // TODO: vector结合线速度做偏移
            this.vector = vector;
            this.currentMoveBehavior.doRepel(repel);
        }

        this.onHpReduce();

        // TODO: 位置根据当前敌人体型决定，目前是写死
        DamageManager.instance.showDamageTxt({ dmg, position: new Vec3(this.node.position.x + 20, this.node.position.y + 20, 0), isEnemy: true, isCtitical: damageInfo.isCritical });

        if (this.props.c_hp <= 0) {
            /**
             * 敌人被击杀, 应当把击杀子弹, 子弹方向, 受到伤害等属性记录返回
             */
            let vector: Vec3 = damageInfo.vector;
            const { x, y } = this.node.position;
            const dieParams: GamePlayEventOptions.EnemyDieParams = { vector, dmg, bullet: damageInfo.bullet, id: this.id, loc: v3(x, y) };
            RealTimeEventManager.instance.onEnemyDie(dieParams);
            this.die();
        } else {
            // 受击效果
            this.effect.flash();
        }
    }

    protected onHpReduce() {}

    // 获取角色相对于自身的夹角
    public getToCHRAngle(): number {
        const chrLoc: Vec3 = CHRManager.instance.getCHRLoc();
        const curLoc: Vec3 = this.node.position;
        
        let vecX = chrLoc.x - curLoc.x;
        let vecY = chrLoc.y - curLoc.y;
        let angle = Number((Math.atan(vecY / vecX) * (180 / Math.PI)).toFixed(2));
        if (vecX < 0) {
            if (vecY > 0) {
                angle += 180;
            } else {
                angle -= 180;
            }
        }
        return angle;
    }
    public createVector(): Vec3 {
        let angle: number = this.getToCHRAngle();
        let randomAngle: number = getRandomNumber(angle - 60, angle + 60);
        return getVectorByAngle(randomAngle);
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

    protected onDie() {
        // RealTimeEventManager.instance.
    }
    protected onRunAway() {}

    protected runWeaponInitEvent() {
        const weaponCtxList: WeaponBasic[] = [this.weapon1Ctx, this.weapon2Ctx, this.weapon3Ctx];
        weaponCtxList.forEach(ctx => {
            if (ctx) {
                ctx.onWeaponInit();
            }
        })
    }
    protected runWeaponRemoveEvent() {
        const weaponCtxList: WeaponBasic[] = [this.weapon1Ctx, this.weapon2Ctx, this.weapon3Ctx];
        weaponCtxList.forEach(ctx => {
            if (ctx) {
                ctx.onWeaponRemove();
            }
        })
    }

    public setCurrentMoveBehavior(behaviorName: string, isCanMove: boolean = true) {
        if (!behaviorName) {
            return;
        }
        let moveBehaviorList: MoveBasic[] = [this.moveBehavior1Ctx, this.moveBehavior2Ctx, this.moveBehavior3Ctx];
        for (let behavior of moveBehaviorList) {
            if (!behavior) {
                continue;
            }
            if (behavior.name == behaviorName) {
                this.currentMoveBehavior = behavior;
                this.currentMoveBehavior.isCanMove = isCanMove;
                break;
            }
        }
    }

    protected initWeapons() {
        if (this.weapon1) {
            this.weapon1Ctx = WeaponManager.instance.getIWeaponCtxById(this.weapon1) as WeaponEmy;
        }
        if (this.weapon2) {
            this.weapon2Ctx = WeaponManager.instance.getIWeaponCtxById(this.weapon2) as WeaponEmy;
        }
        if (this.weapon3) {
            this.weapon3Ctx = WeaponManager.instance.getIWeaponCtxById(this.weapon3) as WeaponEmy;
        }
        let ctxList: WeaponEmy[] = [this.weapon1Ctx, this.weapon2Ctx, this.weapon3Ctx];
        ctxList.forEach(ctx => {
            if (ctx) {
                ctx.setEnemyRef(this);
                ctx.updatePanel();
                ctx.mountBehaviorModule(this.view("Weapons"));
            }
        })
    }
    protected setColliderEnabled(enabled: boolean) {
        this.bodyCollider.enabled = enabled;
    }
    protected initMoveBehaviors() {
        let moveBehaviorList: string[] = [this.moveBehavior1, this.moveBehavior2, this.moveBehavior3];
        for (let i = 0; i < moveBehaviorList.length; i++) {
            let behavior = moveBehaviorList[i];
            if (!behavior) {
                continue;
            }
            let behaviorCtx: MoveBasic = new MoveBehavior_def[behavior](this);
            behaviorCtx.onInit();
            this[`moveBehavior${i + 1}Ctx`] = behaviorCtx;
        }
    }
    public setBodyWeapon(weapon: Weapon_Emy_Body) {
        this.bodyWeaponCtx = weapon;
    }

    public die() {
        this.alive = false;
        this.setColliderEnabled(false);
        this.runWeaponRemoveEvent();
        this.removeBuff();
        this.onDie();
        EMYManager.instance.removeEnemy(this.id);
        this.effect.playDieEffect();
        if (this.currentMoveBehavior) {
            this.currentMoveBehavior.onDie();
        }
        // 掉落物品并爆出粒子效果
        try {
            DropItemManager.instance.dropItem(this.props.code, this.node.position);
        } catch (error) {
            console.log(error)
        }
    }
    // 逃跑
    protected runAway() {
        this.alive = false;
        this.setColliderEnabled(false);
        this.runWeaponRemoveEvent();
        this.removeBuff();
        this.onRunAway();
        EMYManager.instance.removeEnemy(this.id);
        this.effect.playDieEffect();
        if (this.currentMoveBehavior) {
            this.currentMoveBehavior.onDie();
        }
        // 如果是核心精英, 掉落核心
        if (this.props.timeout_drop_trophy) {
            DropItemManager.instance.dropTrophyItem(this.props.code, this.node.position);
        }
    }

    protected move(dt: number) {
        this._updateEnemyInfo();
        if (!this.currentMoveBehavior) {
            return;
        }
        this.currentMoveBehavior.runBehavior(dt);
    }
    public stopMove() {
        if (!this.currentMoveBehavior) {
            return;
        }
        this.currentMoveBehavior.isCanMove = false;
    }
    public startMove() {
        if (!this.currentMoveBehavior) {
            return;
        }
        this.currentMoveBehavior.isCanMove = true;
    }

    private _remove() {
        this.effect.stopBodyAnimation();
        EMYManager.instance.removeEmyNode(this.node);
    }

    public setProps() {
        
    }

    protected checkSpecialAttack() {
        if (this.dis <= this.props.attack_range) {
            this.canSpecialAttack = true;
        } else {
            this.canSpecialAttack = false;
        }
    }

    public getBuffValue(buffKey: string) {
        return this.buff[buffKey]?.value || 0;
    }
    public setBuff(buffKey: string, buffValue: number, expireTime: number) {
        let oldValue = this.buff[buffKey]?.value;
        if (oldValue) {
            // 大的可覆盖
            if (buffValue > oldValue) {
                this.buff[buffKey] = {
                    value: buffValue,
                    expireTime
                };
            } else {
                return;
            }
        } else {
            this.buff[buffKey] = {
                value: buffValue,
                expireTime
            };
        }
    }
    public removeBuff(buffKey?: string) {
        if (!buffKey) {
            this.buff = {};
            return;
        }
        if (this.buff[buffKey]) {
            delete this.buff[buffKey];
        }
    }
    protected checkBuff(dt: number) {
        for (let buffKey in this.buff) {
            let buff = this.buff[buffKey];
            if (buff.expireTime === -1) {
                continue;
            }
            buff.expireTime -= dt;
            if (buff.expireTime <= 0) {
                this.removeBuff(buffKey);
            }
        }
    }

    update(deltaTime: number) {
        if (!ProcessManager.instance.isOnPlaying()) {
            return;
        }
        if (!this.alive) {
            return;
        }
        if (this.weapon1Ctx) {
            this.weapon1Ctx.runBehavior(deltaTime);
        }
        if (this.weapon2Ctx) {
            this.weapon2Ctx.runBehavior(deltaTime);
        }
        if (this.weapon3Ctx) {
            this.weapon3Ctx.runBehavior(deltaTime);
        }
        this.move(deltaTime);
        this.checkBuff(deltaTime);
        if (this.effect) {
            this.effect.runBehavior(deltaTime);
        }
        if (this.hasSpecialAttack) {
            this.checkSpecialAttack();
        }
    }
}

