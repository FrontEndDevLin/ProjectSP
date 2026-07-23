    import { _decorator } from 'cc';
    import OBT_Component from '../../../OBT_Component';
    const { ccclass, property } = _decorator;

    /**
     * 基础核心
     */
    @ccclass('BaseWarCore')
    export class BaseWarCore extends OBT_Component {
        start() {
            console.log('挂载基础核心 BaseWarCore');
        }

        protected onLoad(): void {
        }
    }

