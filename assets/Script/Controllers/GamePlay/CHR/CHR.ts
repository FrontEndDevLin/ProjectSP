import { _decorator, BoxCollider2D, CircleCollider2D, Contact2DType, Vec3 } from 'cc';
import OBT_Component from '../../../OBT_Component';
import OBT from '../../../OBT';
import { GameCollider, GamePlayEvent, PIXEL_UNIT, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import WarCoreManager from '../../../CManager/WarCoreManager';
import ProcessManager from '../../../CManager/ProcessManager';
import { getSaveCtrl } from '../../../CManager/Class/SaveCtrl';
import DamageManager from '../../../CManager/DamageManager';
import { getRandomNumber } from '../../../Common/utils';
const { ccclass, property } = _decorator;

@ccclass('CHR')
export class CHR extends OBT_Component {
    private _moving: boolean = false;
    private _vector: Vec3 = null;
    private _pickRangeCollider: CircleCollider2D = null;
    private _collider: BoxCollider2D = null;

    private _baseSpd: number = 0;

    start() {
        console.log("角色控制脚本加载")

        OBT.instance.eventCenter.on(GamePlayEvent.COMPASS.TOUCH_START, this._compassTouchStart, this);
        OBT.instance.eventCenter.on(GamePlayEvent.COMPASS.TOUCH_END, this._compassTouchEnd, this);
        OBT.instance.eventCenter.on(GamePlayEvent.COMPASS.TOUCH_MOVE, this._compassTouchMove, this);

        this._pickRangeCollider = this.node.getComponent(CircleCollider2D);
        this._initPickRangeCollider();

        this._collider = this.node.getComponent(BoxCollider2D);
        this._collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this);

        this._baseSpd = CHRManager.instance.propCtx.getPropRealValue("spd");

        WarCoreManager.instance.setWarCoreRootNode(this.view("Pic"));
        WarCoreManager.instance.mountAtkWarCore(getSaveCtrl().save.chr_slot.atk_core);
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
    private _initPickRangeCollider() {
        let pickRange: number = CHRManager.instance.propCtx.getPropRealValue("pick_range");
        this._pickRangeCollider.radius = pickRange;
        this._pickRangeCollider.on(Contact2DType.BEGIN_CONTACT, this._onPickDomainBeginContact, this);
    }
    private _onPickDomainBeginContact(selfCollider: CircleCollider2D, otherCollider: BoxCollider2D) {
        if (!ProcessManager.instance.isOnPlaying()) {
            return;
        }
        if (selfCollider.tag === GameCollider.TAG.DROP_ITEM_PICKER) {
            switch (otherCollider.tag) {
                case GameCollider.TAG.DROP_ITEM_EXP: {
                    otherCollider.node.OBT_param2.absorbing = true;
                } break;
                
                default:
                    break;
            }
        }
        // if (selfCollider.tag === GameCollider.TAG.)
    }

    // 角色受击处理/吸收战利品
    private _onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        if (otherCollider.group === GameCollider.GROUP.ENEMY || otherCollider.group === GameCollider.GROUP.EMY_BULLET) {
            if (otherCollider.tag === GameCollider.TAG.PEACE) {
                return;
            }
            // 根据角色闪避属性，决定是否受击
            let avdVal: number = CHRManager.instance.propCtx.getPropRealValue("avd");
            let isHit: boolean = true;
            if (avdVal > 0) {
                if (avdVal > 60) {
                    avdVal = 60;
                }
                let randomNum = getRandomNumber(1, 100);
                // 打不中
                if (randomNum <= avdVal) {
                    isHit = false;
                }
            }

            if (isHit) {
                let enemyId: string = otherCollider.node.name;
                let isSpecDmg: boolean = otherCollider.group === GameCollider.GROUP.EMY_BULLET;
                if (isSpecDmg) {
                    enemyId = otherCollider.node.OBT_param1;
                }
                let damage = DamageManager.instance.calcEnemyDamage(enemyId, isSpecDmg);
                CHRManager.instance.propCtx.addHP(-damage);
            } else {
                // 通知伤害数字管理，跳出“闪避”字样
                console.log('触发闪避')
            }
        }
        if (otherCollider.group === GameCollider.GROUP.DROP_ITEM) {
            switch (otherCollider.tag) {
                case GameCollider.TAG.DROP_ITEM_TROPHY:
                case GameCollider.TAG.DROP_ITEM_CORE: {
                    otherCollider.node.OBT_param2.absorbing = true;
                } break;
                default:
                    break;
            }
        }
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
        let speed = dt * this._baseSpd;
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

    protected onDestroy(): void {
        OBT.instance.eventCenter.off(GamePlayEvent.COMPASS.TOUCH_START, this._compassTouchStart, this);
        OBT.instance.eventCenter.off(GamePlayEvent.COMPASS.TOUCH_END, this._compassTouchEnd, this);
        OBT.instance.eventCenter.off(GamePlayEvent.COMPASS.TOUCH_MOVE, this._compassTouchMove, this);

        // this._pickRangeCollider.off(Contact2DType.BEGIN_CONTACT, this._onPickDomainBeginContact, this);
    }

    update(deltaTime: number) {
        if (!ProcessManager.instance.isOnPlaying()) {
            return;
        }
        if (this._moving) {
            this._move(deltaTime);
        }
        CHRManager.instance.setCHRLoc(this.node.position);
    }
}


