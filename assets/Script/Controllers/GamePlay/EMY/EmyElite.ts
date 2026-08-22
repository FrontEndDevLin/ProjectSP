import { _decorator, UITransform, Node } from 'cc';
import { EmyBasic1 } from './EmyBasic1';
import WeaponManager from '../../../CManager/WeaponManager';
const { ccclass, property } = _decorator;

/**
 * 精英敌人, 有多个阶段
 */
@ccclass('EmyElite')
export class EmyElite extends EmyBasic1 {
    protected phase: number = 1;
    protected showHpBar: boolean = false;
    protected hpBarNode: Node = null;
    private hpBarWidth: number;

    // 转换2阶段的血量阈值
    protected phaseHpLine1: number = 0.5;

    protected onInit(): void {
        if (this.showHpBar && !this.hpBarNode) {
            this.hpBarNode = WeaponManager.instance.loadPrefab({ prefabPath: "Common/Elite_HPBar", scriptName: "NONE" });
            this.hpBarWidth = this.hpBarNode.getChildByName("BG").getComponent(UITransform).width;
            this.updateHpBar();
            let emyNodeHeight: number = this.node.getComponent(UITransform).height;
            this.hpBarNode.setPosition(0, emyNodeHeight / 2 + 30);
            this.hpBarNode.setParent(this.node);
        }
        this.hpBarNode.active = true;
    }

    protected updateHpBar() {
        let width: number = Math.floor(this.hpBarWidth * this.props.c_hp / this.maxHp);
        if (width < 0) {
            width = 0;
        }
        this.hpBarNode.getChildByName("HPProg").getComponent(UITransform).width = width;
    }

    protected onDie(): void {
        this.hpBarNode.active = false;
    }
    protected onRunAway(): void {
        this.hpBarNode.active = false;
    }

    private _changePhase() {
        this.vector = null;
        this.phase++;
        this.changePhase();
    }

    // 子类实现
    protected changePhase() {}

    protected onHpReduce(): void {
        if (this.phase === 1 && this.props.c_hp <= this.maxHp * this.phaseHpLine1) {
            this._changePhase();
        }
        if (this.showHpBar) {
            this.updateHpBar();
        }
    }
}

