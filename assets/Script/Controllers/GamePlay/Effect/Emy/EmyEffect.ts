import { SpriteComponent, Node, Animation, Color } from "cc";
import { EmyBasic1 } from "../../EMY/EmyBasic1";
import { FLASH_TIME } from "../../../../Common/Namespace";

/**
 * 敌人动效
 */

export default class EmyEffect {
    protected ref: EmyBasic1;
    protected isInit: boolean = false;

    protected flashing: boolean = false;
    protected flashTime: number = FLASH_TIME;
    protected FLASH_COLOR: Color = new Color(0, 255, 255);
    protected NORMAL_COLOR: Color = new Color(255, 255, 255);

    protected bodyPath: string = "Body";
    protected bodyAnimation: Animation;

    protected spriteNodePaths: string[] = [`${this.bodyPath}/PIC`];
    // spNodes节点下的图形组件spComps和动画组件aniComps, 三者一起初始化
    protected spriteNodes: Node[] = [];
    protected spriteComps: SpriteComponent[] = [];
    protected animationComps: Animation[] = [];

    // 效果
    public init(emyRef: EmyBasic1) {
        this.ref = emyRef;
        this.initSprite();
    }

    // 初始化图形节点
    protected initSprite() {
        if (this.isInit) {
            return;
        }
        this.bodyAnimation = this.ref.view(this.bodyPath).getComponent(Animation);
        this.spriteNodePaths.forEach((path: string, i: number) => {
            let spNode: Node = this.ref.view(path);
            this.spriteNodes.push(spNode);
            this.spriteComps[i] = spNode.getComponent(SpriteComponent);
            this.animationComps[i] = spNode.getComponent(Animation);
        })
    }

    public flash() {
        if (!this.flashing) {
            this.flashing = true;
            this.flashSprite();
        }
        // 重置闪烁时间
        this.flashTime = FLASH_TIME;
    }
    private _cancelFlash() {
        this.flashing = false;
        this.offFlashSprite();
    }
    private _checkFlash(dt) {
        if (this.flashing) {
            this.flashTime -= dt;
            if (this.flashTime <= 0) {
                this._cancelFlash();
            }
        }
    }

    // 闪烁图形, 可以重写
    protected flashSprite() {
        this.spriteComps.forEach((spComp: SpriteComponent) => {
            spComp.color = this.FLASH_COLOR;
        })
    }
    protected offFlashSprite() {
        this.spriteComps.forEach((spComp: SpriteComponent) => {
            spComp.color = this.NORMAL_COLOR;
        })
    }

    public playDieEffect() {
        this.stopBodyAnimation();
        this.bodyAnimation.play("Emy_die01");
    }
    public stopBodyAnimation() {
        this.bodyAnimation.stop();
    }

    public runBehavior(dt: number) {
        this._checkFlash(dt);
    }
}
