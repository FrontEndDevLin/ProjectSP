import { _decorator, Component, find, Node } from 'cc';
import OBT_Component from '../../OBT_Component';
import ProcessManager from '../../CManager/ProcessManager';
const { ccclass, property } = _decorator;

@ccclass('GamePlay')
export class GamePlay extends OBT_Component {
    start() {
        // console.log(find("Canvas"))
        ProcessManager.instance.initGUI();
        // OBT.instance.printStructure();
        setTimeout(() => {
            ProcessManager.instance.startGame(true);
        })
    }

    update(deltaTime: number) {
        
    }
}


