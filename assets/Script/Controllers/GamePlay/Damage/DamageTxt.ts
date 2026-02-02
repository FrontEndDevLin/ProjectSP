import { _decorator, Color, Component, Node, tween, UITransform, v3, Vec3 } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { DamageInfo } from '../../../Common/Namespace';
const { ccclass, property } = _decorator;

@ccclass('DamageTxt')
export class DamageTxt extends OBT_Component {
    private _init: boolean = false;

    // protected criticalEffect: Node = null; // 暴击特效节点

    private NORMAL_COLOR = new Color(255, 255, 255, 255); // 白色
    private CRITICAL_COLOR = new Color(255, 50, 50, 255); // 红色
    private HEAL_COLOR = new Color(50, 255, 50, 255); // 绿色

    protected onLoad(): void {
      // super.onLoad();
    }

    start() {
        
    }

    public init(options: DamageInfo.ShowDamageTxtOptions) {
        const { position, isCtitical, isEnemy, isHealth, dmg } = options;
        // if (!targetVec) {
        //     return;
        // }
        // this._init = true;
        // this.node.OBT_param2 = {
        //     absorbing: false,
        //     recovery: this._beenRecovery.bind(this)
        // }
        // this._expCnt = expCnt;
        // this._droping = true;
        // tween(this.node)
        //     .to(0.1, { position: targetVec })
        //     .call(() => {
        //         this._droping = false;
        //     })
        // .start();

        // 显示暴击特效
        // if (this.criticalEffect && options.isCritical) {
        //     this.criticalEffect.active = true;
        //     this.criticalEffect.scale = v3(0, 0, 1);
            
        //     tween(this.criticalEffect)
        //         .to(0.2, { scale: v3(1, 1, 1) }, { easing: 'backOut' })
        //         .delay(0.3)
        //         .to(0.2, { scale: v3(0, 0, 1) })
        //         .call(() => {
        //             this.criticalEffect.active = false;
        //         })
        //         .start();
        // }
    }

    protected play() {

    }

    // /**
    //  * 播放跳动动画
    //  */
    // private playJumpAnimation(startPos: Vec3, offsetX: number, offsetY: number) {
    //     const jumpHeight = this.JUMP_HEIGHT + offsetY;
    //     const halfDuration = this.DURATION * 0.5;
        
    //     // 上升阶段
    //     tween(this.node.position)
    //         .to(halfDuration, 
    //             v3(
    //                 startPos.x + offsetX * 0.5,
    //                 startPos.y + jumpHeight,
    //                 startPos.z
    //             ),
    //             { easing: 'sineOut' }
    //         )
    //         // 下降阶段
    //         .to(halfDuration,
    //             v3(
    //                 startPos.x + offsetX,
    //                 startPos.y,
    //                 startPos.z
    //             ),
    //             { easing: 'sineIn' }
    //         )
    //         .start();
    // }
    
    // /**
    //  * 播放缩放动画
    //  */
    // private playScaleAnimation() {
    //     // 弹入效果
    //     tween(this.node)
    //         .to(0.2, { scale: v3(1.2, 1.2, 1) }, { easing: 'backOut' })
    //         .to(0.1, { scale: v3(1, 1, 1) })
    //         .start();
    // }
    
    // /**
    //  * 播放渐隐动画
    //  */
    // private playFadeAnimation() {
    //     const uiOpacity = this.node.getComponent(UIOpacity);
        
    //     tween(uiOpacity)
    //         .delay(this.DURATION * 0.7)
    //         .to(0.3, { opacity: 0 })
    //         .start();
    // }

    update(dt: number) {
    }
}


