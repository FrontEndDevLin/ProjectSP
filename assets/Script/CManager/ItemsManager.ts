import { find, Node } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import { ItemInfo } from "../Common/Namespace";
import DBManager from "./DBManager";
import { getRandomNumber } from "../Common/utils";
export default class ItemsManager extends OBT_UIManager {
    static instance: ItemsManager;
    public rootNode: Node = find("Canvas/GamePlay/GamePlay");

    public itemsData: ItemInfo.ItemDBData = {};

    private _randomItemKeys: string[] = [];

    protected onLoad(): void {
        if (!ItemsManager.instance) {
            ItemsManager.instance = this
        } else {
            this.destroy();
            return;
        }

        this.itemsData = DBManager.instance.getDBData("Items");
    }

    public getRandomItems(n?: number): ItemInfo.Item[] {
        this._randomItemKeys = [];
        let items: ItemInfo.Item[] = []
        if (n === 0) {
            return items;
        }
        n = n || 4;
        for (let i = 0; i < n; i++) {
            let item: ItemInfo.Item = this._getRandomItem();
            if (item) {
                this._randomItemKeys.push(item.id);
                items.push(item);
            }
        }
        this._randomItemKeys = [];
        return items;
    }

    private _getRandomItem(quality: number = ItemInfo.TROPHY_TYPE.CHEST): ItemInfo.Item {
        let item: ItemInfo.Item = null;
        switch (quality) {
            // TODO: 普通宝箱，大概率获得白色、蓝色道具；小概率获得紫色道具；极小概率获得红色道具(概率也要随着关卡变动)
            case ItemInfo.TROPHY_TYPE.CHEST: {
                let itemKeysList: string[] = this._getItemsKeyList();
                if (itemKeysList.length) {
                    let idx: number = getRandomNumber(0, itemKeysList.length - 1);
                    let key: string = itemKeysList[idx];
                    item = this.itemsData[key];
                }
            } break;
            // 极品宝箱，百分百获得红色道具
            case ItemInfo.TROPHY_TYPE.GREAT_CHEST: {

            } break;
        }
        return item;
    }

    private _getItemsKeyList() {
        // TODO: 从itemsMap中获取道具池给用户选择，需要先排除掉角色已拥有的独特道具，和已达到限制的道具
        let pool: string[] = [];
        for (let key in this.itemsData) {
            if (key.includes("desc")) {
                continue;
            }
            // 排除已进入当前商店列表的项目
            if (this._randomItemKeys.indexOf(key) !== -1) {
                continue;
            }
            pool.push(key)
        }
        return pool;
    }

    protected onDestroy(): void {
        console.log('销毁地图管理ing')

        ItemsManager.instance = null;
    }
}
