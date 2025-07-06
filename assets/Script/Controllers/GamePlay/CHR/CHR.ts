import { _decorator, BoxCollider2D, CircleCollider2D, Component, Contact2DType, find, Game, Node, v3, Vec3 } from 'cc';
import OBT_Component from '../../../OBT_Component';
import OBT from '../../../OBT';
import { EMYInfo, GameCollider, GamePlayEvent, PIXEL_UNIT, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import EMYManager from '../../../CManager/EMYManager';
const { ccclass, property } = _decorator;

@ccclass('CHR')
export class CHR extends OBT_Component {
    private _moving: boolean = false;
    private _vector: Vec3 = null;

    private _baseSpd: number = 0;

    // 警戒碰撞盒
    private _alertDomainCollider: CircleCollider2D = null;
    // 攻击碰撞盒
    private _attackDomainCollider: CircleCollider2D = null;
    // 警戒范围内的敌人
    private _highEnemyList: string[] = [];
    // 攻击范围内的队列，当该队列中有敌人时，优先从中选择，性能会有提升
    private _dangerEnemyList: string[] = [];

    start() {
        console.log("角色控制脚本加载")

        OBT.instance.eventCenter.on(GamePlayEvent.COMPASS.TOUCH_START, this._compassTouchStart, this);
        OBT.instance.eventCenter.on(GamePlayEvent.COMPASS.TOUCH_END, this._compassTouchEnd, this);
        OBT.instance.eventCenter.on(GamePlayEvent.COMPASS.TOUCH_MOVE, this._compassTouchMove, this);

        this._baseSpd = CHRManager.instance.basicProps.spd;
        
        this._initDomainCollider();
    }

    private _compassTouchStart() {
        this._moving = true;
    }
    private _compassTouchEnd() {
        this._moving = false;
        this._vector = null;
    }
    private _compassTouchMove(vector: Vec3) {
        this._vector = vector;
    }

    private _initDomainCollider() {
        let colliders: CircleCollider2D[] = this.view("DomainCLD").getComponents(CircleCollider2D);
        for (let collider of colliders) {
            switch (collider.tag) {
                case GameCollider.TAG.CHR_RANGE_ALERT: {
                    this._alertDomainCollider = collider;
                } break;
                case GameCollider.TAG.CHR_RANGE_ATTACK: {
                    this._attackDomainCollider = collider;
                } break;
            }
            collider.on(Contact2DType.BEGIN_CONTACT, this._onCHRDomainBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this._onCHRDomainEndContact, this);
        }
        // let { range, alert } = this.weaponPanel;
        let range: number = CHRManager.instance.basicProps.range;
        this._attackDomainCollider.radius = range * PIXEL_UNIT;
        this._alertDomainCollider.radius = (range + 2) * PIXEL_UNIT;
    }

    private _move(dt: number) {
        if (!this._vector) {
            return
        }
        // x < 0 摇杆向左，人物朝向向左
        // if (this._vector.x < 0) {
        //     this.views["SF"].scaleX = -1;
        // } else {
        //     this.views["SF"].scaleX = 1;
        // }
        
        // let spd = this._baseSpd + getCharacterPropValue("spd") * this._baseSpd;
        let gamePlaySpd = this._baseSpd;
        let speed = dt * gamePlaySpd * PIXEL_UNIT;
        let newPosition = this.node.position.add(new Vec3(this._vector.x * speed, this._vector.y * speed));

        let thresholdX = SCREEN_WIDTH / 2;
        let thresholdY = SCREEN_HEIGHT / 2;
        // 判断边界值
        if (newPosition.x > thresholdX) {
            newPosition.x = thresholdX;
        }
        if (newPosition.y > thresholdY) {
            newPosition.y = thresholdY;
        }
        if (newPosition.x < -thresholdX) {
            newPosition.x = -thresholdX;
        }
        if (newPosition.y < -thresholdY) {
            newPosition.y = -thresholdY;
        }
        this.node.setPosition(newPosition);
    }

    private _onCHRDomainBeginContact(selfCollider: CircleCollider2D, otherCollider: BoxCollider2D) {
        if (otherCollider.group === GameCollider.GROUP.ENEMY) {
            switch (selfCollider.tag) {
                case GameCollider.TAG.CHR_RANGE_ALERT: {
                    // 将敌人放入队列中，结束碰撞时将敌人移出
                    this._highEnemyList[otherCollider.node.uuid] = 1;
                } break;
                case GameCollider.TAG.CHR_RANGE_ATTACK: {
                    this._dangerEnemyList[otherCollider.node.uuid] = 1;
                } break;
            }
        }
    }
    private _onCHRDomainEndContact(selfCollider: CircleCollider2D, otherCollider: BoxCollider2D) {
        if (otherCollider.group === GameCollider.GROUP.ENEMY) {
            switch (selfCollider.tag) {
                case GameCollider.TAG.CHR_RANGE_ALERT: {
                    delete this._highEnemyList[otherCollider.node.uuid];
                } break;
                case GameCollider.TAG.CHR_RANGE_ATTACK: {
                    delete this._dangerEnemyList[otherCollider.node.uuid];
                } break;
            }
        }
    }
    // 旋转武器(改变贴图朝向)
    private _rotateWeapon() {
        // if (this._animateAttacking) {
        //     return;
        // }
        this._chooseTarget((isCanBeAttacked: boolean, target: EMYInfo.RealTimeInfo) => {
            if (!target) {
                return;
            }

            // 武器指向离得最近的目标
            let chrLoc: Vec3 = CHRManager.instance.getCHRLoc();
            // 将武器坐标转为地图坐标
            // let currentVec: Vec3 = v3(chrLoc.x + this.node.position.x, chrLoc.y + this.node.position.y);
            let currentVec: Vec3 = v3(chrLoc.x, chrLoc.y);
            let vecX = target.x - currentVec.x;
            let vecY = target.y - currentVec.y;

            let angle = Number((Math.atan(vecY / vecX) * 57.32).toFixed(2));
            let scaleX = 1;
            if (vecX < 0) {
                scaleX = -1;
            }

            this.view("Pic/Hole").angle = angle;
            this.view("Pic/Hole").setScale(v3(scaleX, 1));
        }); 
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

    protected onDestroy(): void {
        OBT.instance.eventCenter.off(GamePlayEvent.COMPASS.TOUCH_START, this._compassTouchStart, this);
        OBT.instance.eventCenter.off(GamePlayEvent.COMPASS.TOUCH_END, this._compassTouchEnd, this);
        OBT.instance.eventCenter.off(GamePlayEvent.COMPASS.TOUCH_MOVE, this._compassTouchMove, this);

        // this._pickRangeCollider.off(Contact2DType.BEGIN_CONTACT, this._onPickDomainBeginContact, this);
    }

    update(deltaTime: number) {
        // if (!ChapterManager.instance.onPlaying) {
        //     return;
        // }
        this._rotateWeapon();
        if (this._moving) {
            this._move(deltaTime);
        }
        CHRManager.instance.setCHRLoc(this.node.position);
    }
}


