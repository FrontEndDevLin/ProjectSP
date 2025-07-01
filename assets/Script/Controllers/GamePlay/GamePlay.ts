import { _decorator, Component, find, Node } from 'cc';
import OBT_Component from '../../OBT_Component';
import MapManager from '../../CManager/MapManager';
import CHRManager from '../../CManager/CHRManager';
import OBT from '../../OBT';
const { ccclass, property } = _decorator;

@ccclass('GamePlay')
export class GamePlay extends OBT_Component {
    start() {
        MapManager.instance.showMap();
        CHRManager.instance.showCHR();
        // TODO: 挂入UI节点，角色控制

        // console.log(find("Canvas"))
        OBT.instance.printStructure();
    }

    update(deltaTime: number) {
        
    }
}


