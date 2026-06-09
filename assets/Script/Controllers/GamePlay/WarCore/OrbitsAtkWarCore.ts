import { _decorator, BoxCollider2D, CircleCollider2D, Component, Contact2DType, Node, v3, Vec3 } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { EMYInfo, GameCollider, GamePlayEvent, WarCoreInfo  } from '../../../Common/Namespace';
import EMYManager from '../../../CManager/EMYManager';
import CHRManager from '../../../CManager/CHRManager';
import BulletManager from '../../../CManager/BulletManager';
import { getFloatNumber, getRandomNumber, getVectorByAngle } from '../../../Common/utils';
import ProcessManager from '../../../CManager/ProcessManager';
import WarCoreManager from '../../../CManager/WarCoreManager';
import ItemWarCore from '../Items/ItemWarCore';
import OBT from '../../../OBT';
import RealTimeEventManager from '../../../CManager/RealTimeEventManager';
import OBT_UIManager from '../../../Manager/OBT_UIManager';
const { ccclass, property } = _decorator;

/**
 * 轨道攻击核心
 */
@ccclass('OrbitsAtkWarCore')
export class OrbitsAtkWarCore extends OBT_Component {
    // 警戒碰撞盒
    // private _alertDomainCollider: CircleCollider2D = null;
    // 攻击碰撞盒
    private _attackDomainCollider: CircleCollider2D = null;
    // 警戒范围内的敌人
    private _highEnemyList: string[] = [];
    // 攻击范围内的队列，当该队列中有敌人时，优先从中选择，性能会有提升
    private _dangerEnemyList: string[] = [];

    private _cd: number = 0;

    protected warCore: ItemWarCore;

    protected bulletGroupId: number = 1;

    protected isInit: boolean = false;
    protected rotateNode: Node;
    protected rotateAngle: number = 0;

    start() {
        this.warCore = WarCoreManager.instance.warCore;
        this._initDomainCollider();

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.FIGHT_START, this.initKnife, this);
        // this.warCore.weaponCtx.split
    }

    protected onLoad(): void {

    }

    private _initDomainCollider() {
        let colliders: CircleCollider2D[] = this.getComponents(CircleCollider2D);
        for (let collider of colliders) {
            switch (collider.tag) {
                case GameCollider.TAG.CHR_RANGE_ALERT: {
                    // this._alertDomainCollider = collider;
                } break;
                case GameCollider.TAG.CHR_RANGE_ATTACK: {
                    this._attackDomainCollider = collider;
                } break;
            }
            collider.on(Contact2DType.BEGIN_CONTACT, this._onCHRDomainBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this._onCHRDomainEndContact, this);
        }
        // let { range, alert } = this.weaponPanel;
        let range: number = this.warCore.weaponCtx.range;
        this._attackDomainCollider.radius = range;
        // this._alertDomainCollider.radius = (range + 2) * PIXEL_UNIT;
    }

    private _onCHRDomainBeginContact(selfCollider: CircleCollider2D, otherCollider: BoxCollider2D) {
        if (otherCollider.group === GameCollider.GROUP.ENEMY) {
            switch (selfCollider.tag) {
                case GameCollider.TAG.CHR_RANGE_ALERT: {
                    // 将敌人放入队列中，结束碰撞时将敌人移出
                    let nodeId: string = otherCollider.node.OBT_param2.id;
                    this._highEnemyList[nodeId] = 1;
                } break;
                case GameCollider.TAG.CHR_RANGE_ATTACK: {
                    let nodeId: string = otherCollider.node.OBT_param2.id;
                    this._dangerEnemyList[nodeId] = 1;
                } break;
            }
        }
    }
    private _onCHRDomainEndContact(selfCollider: CircleCollider2D, otherCollider: BoxCollider2D) {
        if (otherCollider.group === GameCollider.GROUP.ENEMY) {
            switch (selfCollider.tag) {
                case GameCollider.TAG.CHR_RANGE_ALERT: {
                    let nodeId: string = otherCollider.node.OBT_param2.id;
                    delete this._highEnemyList[nodeId];
                } break;
                case GameCollider.TAG.CHR_RANGE_ATTACK: {
                    let nodeId: string = otherCollider.node.OBT_param2.id;
                    delete this._dangerEnemyList[nodeId];
                } break;
            }
        }
    }
    // 每帧检查队列中对应节点距离角色的距离
    private _chooseTarget(callback: EMYInfo.ChooseTargetCallback) {
        // 优先判断攻击范围内的敌人
        if (Object.keys(this._dangerEnemyList).length) {
            let target: EMYInfo.RealTimeInfo = EMYManager.instance.getNearestEnemy(this._dangerEnemyList);
            callback(true, target);
            return;
        }
        // 攻击范围内无敌人，再判断警戒范围内的敌人
        if (Object.keys(this._highEnemyList).length) {
            let target: EMYInfo.RealTimeInfo = EMYManager.instance.getNearestEnemy(this._highEnemyList);
            callback(false, target);
            return;
        }
    }

    // 对rotateNode进行旋转
    private _tryAttack(dt: number) {
        /**
         * 旋转一圈的时间为cd, 每一帧旋转的角度为360 / cd * dt
         */
        let cd: number = this.warCore.weaponCtx.realCd;
        let rotateAngle: number = 360 / cd * dt;
        this.rotateAngle += rotateAngle;
        if (this.rotateAngle >= 360) {
            this.rotateAngle -= 360;
        }
        this.rotateNode.angle = this.rotateAngle;
    }
    // private _attack(dt: number): void {
    //     this._chooseTarget((hasAtkTarget: boolean, target: EMYInfo.RealTimeInfo) => {
    //         if (!hasAtkTarget || !target) {
    //             return;
    //         }

    //         // 同一批次的子弹, groupId一致
    //         let groupId: number = this.bulletGroupId;
    //         let { bullet, penetrate, pen_dmg } = this.warCore.weaponCtx;
    //         // console.log("穿透数量:" + penetrate + ",穿透伤害:" + pen_dmg);
    //         this.bulletGroupId++;

    //         // RealTimeEventManager.instance.onWarCoreAttack();
    //         // 冷却结合攻击速度修正
    //         this._cd = this.warCore.weaponCtx.realCd;
    //     });
    // }

    // 展开n个刀片
    protected initKnife(n: number) {
        /**
         * 创建一个用于旋转的节点, 挂载n个刀片，刀片按照角度平均分布
         * 节点旋转速度为攻击速度
         */
        let rotateNode: Node = new Node("rotateNode");
        let rotateAry: number[] = [0, -120, -240];
        const moveDistance: number = 40;
        for (let angle of rotateAry) {
            let knifeNode: Node = BulletManager.instance.createBulletByCHR({
                bulletId: WarCoreManager.instance.warCoreWeapon.bullet,
                position: v3(0, 0, 0),
                vector: v3(1, 0, 0),
                rootNode: rotateNode,
                sleep: true
            });

            knifeNode.angle = angle;

            // 角度转弧度
            const rad = angle * Math.PI / 180;
            
            // 计算移动向量
            const dx = Math.sin(rad) * moveDistance;
            const dy = Math.cos(rad) * moveDistance;
            
            // 移动节点
            const pos = knifeNode.position;
            knifeNode.setPosition(pos.x - dx, pos.y + dy, pos.z);
        }
        this.rotateNode = rotateNode;
        this.node.addChild(rotateNode);
        this.isInit = true;
    }
    // 收起刀片
    protected retractKnife() {
        
    }

    update(deltaTime: number) {
        if (!ProcessManager.instance.isOnPlaying()) {
            return;
        }
        if (!this.isInit) {
            return;
        }
        this._tryAttack(deltaTime);
    }
}

