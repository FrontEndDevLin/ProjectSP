/**
 * 项目入口总线
 * 
 *                              总线
 *                /              |              \       \
 *            模块管理         资源管理        事件总线     UI管理
 *      /       |
 *    登录     GamePlay
 *         /      |      \
 *    各个大场景间，需要实现UI节点之间方便的切换，显示，隐藏
 *    大场景有多个预设体，需统一管理，加载大场景时，一次性预载所有预设体
 * 
 * 初始化优先级: 资源管理 -> 事件中心 -> 模块管理
 */

import { _decorator, Component, EPhysics2DDrawFlags, find, instantiate, Node, PhysicsSystem2D, Prefab, UI } from 'cc';
import OBT_EventCenterManager from './Manager/OBT_EventCenterManager';
import OBT_ResourceManager from './Manager/OBT_ResourceManager';
import OBT_ModuleManager, { MODULE_TYPE } from './Manager/OBT_ModuleManager';
import OBT_UIManager from './Manager/OBT_UIManager';
const { ccclass, property } = _decorator;

@ccclass('OBT')
export default class OBT extends Component {
    static instance: OBT;

    public eventCenter: OBT_EventCenterManager;
    public resourceManager: OBT_ResourceManager;
    public moduleManager: OBT_ModuleManager;
    public uiManager: OBT_UIManager;

    protected onLoad(): void {
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Shape;
        // return
        OBT.instance = this
        this.resourceManager = new OBT_ResourceManager();

        // 这里可以加一个加载通用资源的过程，比如在开始界面需要展示角色列表，那么可以把角色列表数据放在通用的bundle里，在这里统一完成加载
        this.uiManager = new OBT_UIManager();
        this.eventCenter = new OBT_EventCenterManager();
        this.moduleManager = new OBT_ModuleManager();

        this.moduleManager.enterModule(MODULE_TYPE.START_MENU);
    }

    public printStructure(): void {
        const output = {};
        const rootNode = find("Canvas");
        this._getStructure(rootNode, output);
        console.log(output);
    }

    private _getStructure(node: Node, obj) {
        if (node.children.length) {
            obj[node.name] = {}
            for (let sNode of node.children) {
                this._getStructure(sNode, obj[node.name])
            }
        } else {
            if (obj[node.name]) {
                obj[node.name]++;
            } else {
                obj[node.name] = 1;
            }
        }
    }
}

export function getResourceManager(): OBT_ResourceManager {
    return OBT.instance ? OBT.instance.resourceManager : null
}

export function getEventCenter(): OBT_EventCenterManager {
    return OBT.instance ? OBT.instance.eventCenter : null
}
