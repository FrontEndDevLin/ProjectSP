import { _decorator, BoxCollider2D, Color, Contact2DType, Node, Sprite, SpriteComponent, v3, Vec3, Animation } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { Common, DamageInfo, EMYInfo, FLASH_TIME, GameCollider, GamePlayEventOptions, ITEM_QUALITY, PIXEL_UNIT, REPEL_TIME } from '../../../Common/Namespace';
import EMYManager from '../../../CManager/EMYManager';
import CHRManager from '../../../CManager/CHRManager';
import ProcessManager from '../../../CManager/ProcessManager';
import { copyObject, getAngleByVector, getRandomNumber, getVectorByAngle } from '../../../Common/utils';
import DropItemManager from '../../../CManager/DropItemManager';
import DamageManager from '../../../CManager/DamageManager';
import RealTimeEventManager from '../../../CManager/RealTimeEventManager';
import WarCoreManager from '../../../CManager/WarCoreManager';
import { HitInfo } from '../../../CManager/CombatManager';
import WeaponBasic from '../Weapons/WeaponBasic';
import WeaponManager from '../../../CManager/WeaponManager';
import Weapon_Emy_Body from '../Weapons/Weapon_Emy_Body';
const { ccclass, property } = _decorator;

/**
 * 敌人系统构造
 *  敌人基类，只负责“持有数据”和“管理子组件”，不包含任何具体的移动或攻击逻辑
 *    - 动态挂载移动行为类
 *    - 动态挂载攻击行为类(武器类)
 *  每个敌人都有身体碰撞体(属于一种武器)
 */

@ccclass('EmyBasic1')
export class EmyBasic1 extends OBT_Component {
    protected alive: boolean = true;

    protected props: EMYInfo.EMYProps;
    protected id: string;
    protected maxHp: number;

    // 与角色的距离
    protected dis: number;
    protected vector: Vec3;
    protected cd: number = 0;

    // 减伤率
    protected dmgReduceRate: number = 0;

    protected bodyWeaponCtx: Weapon_Emy_Body;

    protected moveBehavior1: string;
    protected moveBehavior2: string;
    protected moveBehavior3: string;
    protected moveBehavior1Ctx: any;
    protected moveBehavior2Ctx: any;
    protected moveBehavior3Ctx: any;

    protected weapon1: string;
    protected weapon2: string;
    protected weapon3: string;
    protected weapon1Ctx: WeaponBasic;
    protected weapon2Ctx: WeaponBasic;
    protected weapon3Ctx: WeaponBasic;

    start() {
    }

    protected onLoad(): void {
        
    }
    // 阵亡动画播放完成
    // public dieAnimationPlayoff() {
    //     this._remove();
    // }
    // 其他初始化操作, 子组件需要可使用
    protected initOther() {}

    public init(props: EMYInfo.EMYProps, id: string) {
        this.id = id;
        this.alive = true;

        this.node.OBT_param2 = {
            // id,
            runAway: this.runAway.bind(this)
        }
        this.props = copyObject(props);
        if (!this.props.move) {
            this.props.move = "none";
        }
        // console.log(`生成敌人${props.id}, 血量${props.c_hp}, 伤害${props.c_dmg}, 特殊伤害${props.c_spec_dmg}`)
        this.maxHp = props.c_hp;

        if (!this.bodyWeaponCtx) {
            this.bodyWeaponCtx = WeaponManager.instance.getIWeaponCtxById("Weapon_Emy_Body") as Weapon_Emy_Body;
            this.bodyWeaponCtx.mountBehaviorModule(this.node);
        }
        this.bodyWeaponCtx.behaviorCtx.init(id);

        this.initOther();
    }

    public onHit(damageInfo: HitInfo) {
        let dmg = damageInfo.damage;
        if (damageInfo.isCritical) {
            // console.log('触发暴击，伤害为' + dmg);
            RealTimeEventManager.instance.onCtiticalAttack();
        }
        if (dmg <= 0) {
            return;
        }

        this.props.c_hp -= dmg;

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
        }
    }

    protected onHpReduce() {}

    // 获取角色相对于自身的夹角
    protected getToCHRAngle(): number {
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
    private _createVector(): Vec3 {
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

    protected onDie(bulletId?: string) {
        // RealTimeEventManager.instance.
    }

    protected onDieEvent() {

    }

    public die() {
        this.alive = false;
        this.onDie();
        EMYManager.instance.removeEnemy(this.id);
        this._playDieAni();
        // 掉落物品并爆出粒子效果
        DropItemManager.instance.dropItem(this.props.id, this.node.position);
    }
    // 逃跑
    protected runAway() {
        this.alive = false;
        // this.collider.enabled = false;
        EMYManager.instance.removeEnemy(this.id);
        this._playDieAni();
        // 如果是核心精英, 掉落核心
        if (this.props.timeout_drop_trophy) {
            DropItemManager.instance.dropTrophyItem(this.props.id, this.node.position);
        }
    }

    private _playDieAni() {
        this.node.getComponent(Animation).stop();
        this.node.getComponent(Animation).play("EMY01_die");
    }
    private _remove() {
        this.node.getComponent(Animation).stop();
        EMYManager.instance.removeEmyNode(this.node);
    }

    update(deltaTime: number) {
        if (!ProcessManager.instance.isOnPlaying()) {
            return;
        }
        if (!this.alive) {
            return;
        }
        this._updateEnemyInfo();
    }
}

