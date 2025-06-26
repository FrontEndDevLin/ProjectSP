/**
 * 项目入口总线
 * 
 *                              总线
 *                /              |              \
 *            模块管理         资源管理        事件总线
 *      /       |
 *    登录     GamePlay
 *         /      |      \
 *    各个大场景间，需要实现UI节点之间方便的切换，显示，隐藏
 *    大场景有多个预设体，需统一管理，加载大场景时，一次性预载所有预设体
 * 
 * 初始化优先级: 资源管理 -> 事件中心 -> 模块管理
 */

import { _decorator, Component, instantiate, Node, Prefab, UI } from 'cc';
import OBT_EventBusManager from './Manager/OBT_EventBusManager';
import OBT_ResourceManager from './Manager/OBT_ResourceManager';
import OBT_ModuleManager, { MODULE_TYPE } from './Manager/OBT_ModuleManager';
const { ccclass, property } = _decorator;

@ccclass('Obital')
export default class Obital extends Component {
    static instance: Obital;

    public eventBus: OBT_EventBusManager;
    public resourceManager: OBT_ResourceManager;
    public moduleManager: OBT_ModuleManager;

    protected onLoad(): void {
        Obital.instance = this
        this.resourceManager = new OBT_ResourceManager();
        this.eventBus = new OBT_EventBusManager();
        this.moduleManager = new OBT_ModuleManager(this.eventBus, this.resourceManager);

        this.moduleManager.enterModule(MODULE_TYPE.START_MENU);
    }
}

export function getResourceManager(): OBT_ResourceManager {
    return Obital.instance ? Obital.instance.resourceManager : null
}
