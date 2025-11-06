import { TraitInfo } from "../Common/Namespace";

export default abstract class Trait {
    // 取巧操作, 在基类声明该公用方法后, 在TraitCtrl中可以用类引出来且不会报错, bug?, 子类要实现静态方法getRichTxt
    public getRichTxt(traitConfig: TraitInfo.TraitConfig): string {
        return "";
    }

    protected traitConfig: TraitInfo.TraitConfig = null;

    constructor(traitConfig: TraitInfo.TraitConfig) {
        this.traitConfig = traitConfig;
    }

    public abstract applyTrait(): void;

    public abstract appendTrait(): void;
}
