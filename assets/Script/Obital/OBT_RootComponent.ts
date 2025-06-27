/**
 * 模块下预设体的根组件, 管理该根组件下的所有组件
 * 根组件受控于模块
 * 根组件可控制自身和所有子组件
 */

import { Component } from "cc";

export default class OBT_RootComponent extends Component {
    // 显示自身
    show() {}
    // 隐藏自身
    hide() {}
    // 显示子组件
    showUI() {}
    hideUI() {}
    removeUI() {}

    protected onLoad(): void {
    }
    
    // 将子元素和自身建立联系，
    private _updateViews() {}
}
