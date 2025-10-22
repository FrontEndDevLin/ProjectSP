import { _decorator, BoxCollider2D, Color, Component, Contact2DType, Node, Sprite, SpriteComponent, v3, Vec3, Animation, UITransform } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { EMYInfo, FLASH_TIME, GameCollider, PIXEL_UNIT, Point } from '../../../Common/Namespace';
import EMYManager from '../../../CManager/EMYManager';
import CHRManager from '../../../CManager/CHRManager';
import ProcessManager from '../../../CManager/ProcessManager';
import { copyObject, getAngleByVector, getFloatNumber, getRandomNumber, getVectorByAngle } from '../../../Common/utils';
import DropItemManager from '../../../CManager/DropItemManager';
import DamageManager from '../../../CManager/DamageManager';
import BulletManager from '../../../CManager/BulletManager';
const { ccclass, property } = _decorator;

@ccclass('EMYElite')
export class EMYElite extends OBT_Component {
    // 阶段
    protected phase: number = 1;

    protected alive: boolean = true;

    protected collider: BoxCollider2D = null;

    protected flashing: boolean = false;
    protected flashTime: number = FLASH_TIME;
    protected FLASH_COLOR: Color = new Color(0, 255, 255);
    protected NORMAL_COLOR: Color = new Color(255, 255, 255);
    protected spNodes: Node[] = [];
    // protected spCompList: SpriteComponent[];
    protected spComps: SpriteComponent[] = [];
    protected aniComps: Animation[] = [];

    protected props: EMYInfo.EMYProps;
    private _maxHp: number;

    protected id: string;
    private _bulletId: string = "EMY_Bullet020";

    start() {
    }

    protected onLoad(): void {
    }
    public init(props: EMYInfo.EMYProps, id: string) {
        this.id = id;
        this.alive = true;
        if (!this.spNodes.length) {
            this.loadSpNode();
        }
        // this.spNode.setScale(v3(1, 1));
        if (!this.collider) {
            this.loadCldComp();
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        this.collider.enabled = true;
        if (!this.spComps.length) {
            this.loadSpComp();
        }
        if (!this.aniComps.length) {
            this.loadAniComp();
            this.aniComps[1].on(Animation.EventType.FINISHED, () => {
                this._remove();
            });
        }
        this.node.OBT_param2 = {
            id,
            runAway: this.runAway.bind(this)
        }
        this.props = copyObject(props);
        this._maxHp = this.props.hp;
        this.updateHpBar();

        BulletManager.instance.setBulletDamage("EMY_Bullet020", this.props.dmg)

        // this.props.core
    }
    protected loadSpNode() {
        this.spNodes[0] = this.view("Shell");
        this.spNodes[1] = this.view("Core");
    }
    protected loadCldComp() {
        this.collider = this.node.getComponent(BoxCollider2D);
    }
    protected loadSpComp() {
        this.spNodes.forEach((spNode: Node, i: number) => {
            this.spComps[i] = spNode.getComponent(Sprite);
        })
    }
    protected loadAniComp() {
        this.aniComps[0] = this.spNodes[0].getComponent(Animation);
        this.aniComps[1] = this.spNodes[1].getComponent(Animation);
    }
    protected updateHpBar() {
        let width: number = Math.floor(86 * this.props.hp / this._maxHp);
        this.view("Elite_HPBar/HPProg").getComponent(UITransform).width = width;
    }

    // 二阶段
    protected changePhase() {
        console.log('进入二阶段');
        this._breakShell();
        this._vector = null;
        this.phase = 2;
    }

    private _breakShell() {
        this.aniComps[0].play("EMY01_die");

        let curPosition: Vec3 = this.node.position;
        let shellBreakPoints: Vec3[] = [];

        let shellPoints: Point[] = <Point[]>this.props.broken_point[0];
        shellPoints.forEach((point: Point) => {
            let relPoint: Vec3 = v3(point[0], point[1], 0).add(curPosition);
            shellBreakPoints.push(relPoint);
        });

        EMYManager.instance.particleCtrl.createGroupDieParticle(shellBreakPoints, 2);
        // this.spNodes[0].active = false;
    }
    private _breakCore() {
        let curPosition: Vec3 = this.node.position;
        let coreBreakPoints: Vec3[] = [];

        let corePoints: Point[] = <Point[]>this.props.broken_point[1];
        corePoints.forEach((point: Point) => {
            let relPoint: Vec3 = v3(point[0], point[1], 0).add(curPosition);
            coreBreakPoints.push(relPoint);
        });

        EMYManager.instance.particleCtrl.createGroupDieParticle(coreBreakPoints, 3);
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
                if (this.phase === 1 && this.props.hp <= this._maxHp / 2) {
                    this.changePhase();
                }
                this.updateHpBar();
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
            let spComp: SpriteComponent = this.spComps[this.phase - 1];
            spComp.color = this.FLASH_COLOR;
        }
        // 重置闪烁时间
        this.flashTime = FLASH_TIME;
    }
    private _cancelFlash() {
        this.flashing = false;
        let spComp: SpriteComponent = this.spComps[this.phase - 1];
        spComp.color = this.NORMAL_COLOR;
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
    private _vector: Vec3;
    protected move(dt) {
        // 攻击前摇不移动
        if (this._isCharging()) {
            return;
        }
        switch (this.phase) {
            case 1: {
                let characterLoc: Vec3 = CHRManager.instance.getCHRLoc();
                this._vector = v3(characterLoc.x - this.node.position.x, characterLoc.y - this.node.position.y).normalize();
            } break;
            case 2: {
                if (!this._vector) {
                    this._vector = this._createVector();
                }
                // 获取角色相对于自身的夹角
                let angle = this._getToCHRAngle();
                // 当前向量于自身的夹角
                let curAngle: number = getAngleByVector(this._vector);
                if (curAngle < angle - 60 || curAngle > angle + 60) {
                    this._vector = this._createVector();
                } else if (getRandomNumber(1, 1000) <= 4) {
                    // 0.4%概率改变方向
                    this._vector = this._createVector();
                }
            } break;
        }
        let speed = dt * this.props.spd;
        let newPos: Vec3 = this.node.position.add(new Vec3(this._vector.x * speed, this._vector.y * speed));
        this.node.setPosition(newPos);
    }
    // 获取角色相对于自身的夹角
    private _getToCHRAngle(): number {
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
        let angle: number = this._getToCHRAngle();
        let randomAngle: number = getRandomNumber(angle - 60, angle + 60);
        return getVectorByAngle(randomAngle);
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
        this.view("Elite_HPBar").active = false;
        this.alive = false;
        this.node.getComponent(BoxCollider2D).enabled = false;
        EMYManager.instance.removeEnemy(this.id);
        this._playDieAni();
        // 掉落物品并爆出粒子效果
        DropItemManager.instance.dropItem(this.props.id, this.node.position);
        this._breakCore();
    }
    // 逃跑
    protected runAway() {
        this.alive = false;
        this.node.getComponent(BoxCollider2D).enabled = false;
        EMYManager.instance.removeEnemy(this.id);
        this._playDieAni();
        // 如果是核心精英, 掉落核心
        if (this.props.timeout_drop_trophy) {
            DropItemManager.instance.dropTrophyItem(this.props.id, this.node.position);
        }
    }

    private _playDieAni() {
        this.aniComps[1].play("EMY01_die");
    }
    private _remove() {
        EMYManager.instance.removeEmyNode(this.node);
    }

    private _chargeTime: number = 0.6;
    private _currentCharge: number = 0;
    private _cd: number = 0;

    private _tryRemoteAttack(dt: number) {
        if (this.phase === 1) {
            return;
        }
        if (this._cd <= 0) {
            this._remoteAttack(dt);
        } else {
            this._cd -= dt;
        }
    }
    private _remoteAttack(dt: number) {
        this._currentCharge += dt;
        if (this._currentCharge >= this._chargeTime) {
            /**
             * 远程攻击 向角色和角色夹角30度的位置发射3枚子弹
             */
            let angle: number = this._getToCHRAngle();
            const angleList: number[] = [angle - 20, angle, angle + 20];
            angleList.forEach((ang: number) => {
                let vector = getVectorByAngle(ang);
                BulletManager.instance.createBullet(this._bulletId, this.node.position, vector, this.props.id);
            });

            this._currentCharge = 0;
            this._cd = this.props.attack_cd[1];
        }
    }
    // 是否处于攻击前摇
    private _isCharging() {
        return this.phase === 2 && this._cd <= 0 && this._currentCharge < this._chargeTime;
    }

    update(deltaTime: number) {
        if (!ProcessManager.instance.isOnPlaying()) {
            return;
        }
        this._move(deltaTime);
        this._checkFlash(deltaTime);

        this._tryRemoteAttack(deltaTime);
    }
}

