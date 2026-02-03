import { _decorator, Color, Component, Label, Node, tween, UIOpacity, UITransform, v3, Vec3 } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { DamageInfo } from '../../../Common/Namespace';
import DamageManager from '../../../CManager/DamageManager';
const { ccclass, property } = _decorator;

@ccclass('DamageTxt')
export class DamageTxt extends OBT_Component {
    private _init: boolean = false;

    // protected criticalEffect: Node = null; // 暴击特效节点

    private NORMAL_COLOR = new Color(255, 255, 255, 255); // 白色
    private CRITICAL_COLOR = new Color(255, 50, 50, 255); // 红色
    private HEAL_COLOR = new Color(50, 255, 50, 255); // 绿色

    // 动画配置
    private DURATION = 1.0; // 总持续时间

    protected onLoad(): void {
      // super.onLoad();
    }

    start() {
    }

    public init(options: DamageInfo.ShowDamageTxtOptions) {
        const { position, isCtitical, isEnemy, isHealth, dmg } = options;

        this.node.getComponent(UIOpacity).opacity = 255;
        this.node.setPosition(position);
        this.node.getComponent(Label).string = `${dmg}`;

        let color = this.NORMAL_COLOR;
        if (isEnemy) {
            if (isCtitical) {
                color = this.CRITICAL_COLOR;
            }
        } else {
            if (isHealth) {
                color = this.HEAL_COLOR;
            } else {
                
            }
        }

        this.node.getComponent(Label).color = color;

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
        
        this.play();
    }

    protected play() {
        // 播放缩放动画
        this.playScaleAnimation();
        
        // 播放渐隐动画
        this.playFadeAnimation();
        
        // 动画结束后销毁
        this.scheduleOnce(() => {
            DamageManager.instance.recoverDamageTxtNode(this.node);
        }, this.DURATION + 0.2);
    }
    
    /**
     * 播放缩放动画
     */
    private playScaleAnimation() {
        // 弹入效果
        tween(this.node)
            .to(0.2, { scale: v3(1.6, 1.6, 1) }, { easing: 'backOut' })
            .to(0.1, { scale: v3(1, 1, 1) })
            .start();
    }
    
    /**
     * 播放渐隐动画
     */
    private playFadeAnimation() {
        const uiOpacity = this.node.getComponent(UIOpacity);
        
        tween(uiOpacity)
            .delay(this.DURATION * 0.7)
            .to(0.3, { opacity: 0 })
            .start();
    }

    update(dt: number) {
    }
}


