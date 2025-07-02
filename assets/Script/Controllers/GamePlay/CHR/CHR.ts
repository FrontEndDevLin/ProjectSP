import { _decorator, CircleCollider2D, Component, Node, Vec3 } from 'cc';
import OBT_Component from '../../../OBT_Component';
import OBT from '../../../OBT';
import { GamePlayEvent } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
const { ccclass, property } = _decorator;

@ccclass('CHR')
export class CHR extends OBT_Component {
    private _moving: boolean = false;
    private _vector: Vec3 = null;

    private _baseSpd: number = 0;

    // 警戒碰撞盒
    private _alertRangeCollider: CircleCollider2D = null;
    // 攻击碰撞盒
    private _attackRangeCollider: CircleCollider2D = null;

    start() {
        console.log("角色控制脚本加载")

        OBT.instance.eventCenter.on(GamePlayEvent.COMPASS.TOUCH_START, this._compassTouchStart, this);
        OBT.instance.eventCenter.on(GamePlayEvent.COMPASS.TOUCH_END, this._compassTouchEnd, this);
        OBT.instance.eventCenter.on(GamePlayEvent.COMPASS.TOUCH_MOVE, this._compassTouchMove, this);


        this._baseSpd = CHRManager.instance.basicProps.spd;
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
        // let speed = dt * spd * GP_UNIT;
        let speed = dt * gamePlaySpd * 20;
        let newPosition = this.node.position.add(new Vec3(this._vector.x * speed, this._vector.y * speed));

        // let thresholdX = SCREEN_WIDTH / 2;
        let thresholdX = 720 / 2;
        // let thresholdY = SCREEN_HEIGHT / 2;
        let thresholdY = 1280 / 2;
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
        // if (!ChapterManager.instance.onPlaying) {
        //     return;
        // }
        if (this._moving) {
            this._move(deltaTime);
        }
        // CharacterManager.instance.setCharacterLoc(this.node.position)
    }
}


