import { find, Node } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import { GamePlayEvent, ItemInfo } from "../Common/Namespace";
import DBManager from "./DBManager";
import { getRandomNumber } from "../Common/utils";
import ProcessManager from "./ProcessManager";
import OBT from "../OBT";

interface GetRandomItemConfig {
    quality?: number,
    ignoreKeyList?: string[]
}

export default class ItemsManager extends OBT_UIManager {
    static instance: ItemsManager;
    public rootNode: Node = find("Canvas/GamePlay/GamePlay");

    public itemsData: ItemInfo.Item[] = [];

    public storeItemList: ItemInfo.Item[] = [];

    protected onLoad(): void {
        if (!ItemsManager.instance) {
            ItemsManager.instance = this
        } else {
            this.destroy();
            return;
        }

        this.itemsData = DBManager.instance.getDBData("Items").items;
    }

    private _loadStoreList(n: number = 3): ItemInfo.Item[] {
        let items: ItemInfo.Item[] = []
        if (n === 0) {
            return items;
        }
        let ignoreList = []
        for (let i = 0; i < n; i++) {
            let item: ItemInfo.Item = this._getRandomItemByStore({ ignoreKeyList: ignoreList });
            if (item) {
                ignoreList.push(item.id);
                items.push(item);
            }
        }
        this.storeItemList = items;
        OBT.instance.eventCenter.emit(GamePlayEvent.STORE.STORE_ITEM_LIST_UPDATE);
        return items;
    }

    // 获取一个符合当前阶段的道具，刷新商店用
    private _getRandomItemByStore(options: GetRandomItemConfig = {}): ItemInfo.Item {
        let currentWave: number = ProcessManager.instance.waveRole.wave;
        // 物品质量根据当前波次决定，低级物品概率大
        let quality = options.quality || 1;
        let ignoreList = options.ignoreKeyList;

        let item: ItemInfo.Item = null;
        switch (quality) {
            case 1: {
                let itemPool: ItemInfo.Item[] = this._getItemsList(ignoreList);
                if (itemPool.length) {
                    let idx: number = getRandomNumber(0, itemPool.length - 1);
                    item = itemPool[idx];
                }
            } break;
            case ItemInfo.TROPHY_TYPE.GREAT_CHEST: {

            } break;
        }
        return item;
    }

    private _getItemsList(ignoreKeyList: string[] = []) {
        // TODO: 从itemsMap中获取道具池给用户选择，需要先排除掉角色已拥有的独特道具，和已达到限制的道具
        let pool: ItemInfo.Item[] = [];
        for (let item of this.itemsData) {
            // 排除已进入当前商店列表的项目
            if (ignoreKeyList.indexOf(item.id) !== -1) {
                continue;
            }
            pool.push(item)
        }
        return pool;
    }

    // private _getRandomItem(quality: number = ItemInfo.TROPHY_TYPE.CHEST): ItemInfo.Item {
    //     let item: ItemInfo.Item = null;
    //     switch (quality) {
    //         // TODO: 普通宝箱，大概率获得白色、蓝色道具；小概率获得紫色道具；极小概率获得红色道具(概率也要随着关卡变动)
    //         case ItemInfo.TROPHY_TYPE.CHEST: {
    //             let itemKeysList: string[] = this._getItemsKeyList();
    //             if (itemKeysList.length) {
    //                 let idx: number = getRandomNumber(0, itemKeysList.length - 1);
    //                 let key: string = itemKeysList[idx];
    //                 item = this.itemsData[key];
    //             }
    //         } break;
    //         // 极品宝箱，百分百获得红色道具
    //         case ItemInfo.TROPHY_TYPE.GREAT_CHEST: {

    //         } break;
    //     }
    //     return item;
    // }

    // private _getStoreItems(): string[] {
        // let randomIdxList: number[] = getRandomNumbers(0, this._ableUpdatePropsList.length - 1, 3);
        // let props: string[] = [];
        // for (let i = 0; i < randomIdxList.length; i++) {
        //     let idx: number = randomIdxList[i];
        //     props.push(this._ableUpdatePropsList[idx]);
        // }
        // return props;
    // }
    
    // 刷新商店
    public refreshStoreList() {
        // 这个方法里面做扣金币操作

        // _loadStoreList只做刷新商店
        this._loadStoreList();
    }

    protected onDestroy(): void {
        console.log('销毁地图管理ing')

        ItemsManager.instance = null;
    }
}
