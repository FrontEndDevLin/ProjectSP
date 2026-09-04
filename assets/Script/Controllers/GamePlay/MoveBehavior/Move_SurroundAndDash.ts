import { v3, Vec3 } from "cc";
import MoveBasic from "./MoveBasic";
import CHRManager from "../../../CManager/CHRManager";
import { getAngleByVector, getRandomNumber } from "../../../Common/utils";
import Move_Surround from "./Move_Surround";
import { EMYInfo } from "../../../Common/Namespace";

export default class Move_SurroundAndDash extends Move_Surround {
    public name: string = "SurroundAndDash";

    private isInit: boolean = false;
    protected attackCd: number = 0;
    private attacking: boolean = false;

    protected attackStage: EMYInfo.ATTACK_STAGE = EMYInfo.ATTACK_STAGE.NONE;
    private sprintTime: number = 1;
    private sprintTimeCount: number = 0;
    private chargeTime: number = 0.2;
    private chargeTimeCount: number = 0;

    public onInit(): void {
        this.attackCd = this.ref.props.attack_cd;
        this.ref.registerAnimationEvent("beforeAttack", this.beforeAttackPlayoff, this);
        this.isInit = true;
    }

    protected calcCd(dt: number): boolean {
        if (this.attackCd <= 0) {
            return true;
        } else {
            this.attackCd -= dt;
            return false;
        }
    }

    private beforeAttackPlayoff(): void {
        // 攻击前摇动画结束, 呆滞0.2s
        this.attackStage = EMYInfo.ATTACK_STAGE.ENERGY_CHARGE;
    }

    public runBehavior(dt: number): void {
        if (!this.isInit) {
            return;
        }
        if (this.attacking) {
            if (this.attackStage == EMYInfo.ATTACK_STAGE.ENERGY_CHARGE) {
                // 前摇时, 一直朝向角色
                let angle = this.ref.getToCHRAngle();
                this.bodyNode.angle = angle;
                // 原地呆滞0.2s
                this.chargeTimeCount += dt;
                if (this.chargeTimeCount >= this.chargeTime) {
                    let characterLoc: Vec3 = CHRManager.instance.getCHRLoc();
                    this.ref.vector = v3(characterLoc.x - this.bodyNode.position.x, characterLoc.y - this.bodyNode.position.y).normalize();

                    this.boostSpeed = 300;
                    this.isCanMove = true;
                    this.attackStage = EMYInfo.ATTACK_STAGE.ATTKING;
                }
            }
            if (this.attackStage === EMYInfo.ATTACK_STAGE.ATTKING) {
                // 攻击中, 移动
                this.dashMove(dt);
                this.doMove(dt);
            }
            if (this.attackStage === EMYInfo.ATTACK_STAGE.AFTER_ATTACK) {
                // 攻击结束, 原地呆滞0.2s
                this.chargeTimeCount += dt;
                if (this.chargeTimeCount >= this.chargeTime) {
                    this.chargeTimeCount = 0;
                    this.boostSpeed = 0;
                    this.attackStage = EMYInfo.ATTACK_STAGE.NONE;
                    this.isCanMove = true;
                    this.attackCd = this.ref.props.attack_cd;
                    this.attacking = false;
                }
            }
            return;
        } else {
            this.move(dt);
            this.doMove(dt);
        }
        if (this.calcCd(dt) && this.ref.canSpecialAttack) {
            // 播放攻击前摇, 停止移动
            this.isCanMove = false;
            this.attacking = true;
            this.attackStage = EMYInfo.ATTACK_STAGE.BEFORE_ATTACK;
            this.ref.playBodyAnimation("Emy_Marauder_Spin");
        }
    }

    protected dashMove(dt: number) {
        // 冲刺1s
        this.sprintTimeCount += dt;
        if (this.sprintTimeCount >= this.sprintTime) {
            this.sprintTimeCount = 0;
            this.chargeTimeCount = 0;
            this.attackStage = EMYInfo.ATTACK_STAGE.AFTER_ATTACK;
            this.isCanMove = false;
        }
    }
}
