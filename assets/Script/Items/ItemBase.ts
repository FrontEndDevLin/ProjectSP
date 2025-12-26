/**
 * 基础道具类, 只有数值的增减的道具可继承该类
 */

export default class ItemBase {
    public itemData: any;

    constructor(itemData) {
        this.itemData = itemData
    }

    // 道具介绍
    public getItemIntro() {
        return this.itemData.intro;
    }

    // 使用道具
    public use() {
        // TODO: 将道具中的buff应用上
    }
}
