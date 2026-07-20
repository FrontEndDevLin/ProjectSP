import { _decorator } from 'cc';
import OBT_Component from '../../../OBT_Component';
import WarCoreManager from '../../../CManager/WarCoreManager';
import ItemWarCore from '../Items/ItemWarCore';
const { ccclass, property } = _decorator;

/**
 * 棱拳核心
 * 
 * 这个核心不在这里进行范围检测
 * 而是生成子的棱拳控制核心脚本，由子脚本负责范围检测和攻击行为
 */
@ccclass('PunchAtkWarCore')
export class PunchAtkWarCore extends OBT_Component {
    protected warCore: ItemWarCore;

    start() {
        this.warCore = WarCoreManager.instance.warCore;
    }

    update(deltaTime: number) {
    }
}

