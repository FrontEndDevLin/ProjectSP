import { find, Node } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import { CHRInfo, GamePlayEvent, ItemInfo } from "../Common/Namespace";
import DBManager from "./DBManager";
import { copyObject, getRandomNumber } from "../Common/utils";
import ProcessManager from "./ProcessManager";
import OBT from "../OBT";
import CHRManager from "./CHRManager";

interface GetRandomItemConfig {
    quality?: number,
    ignoreKeyList?: string[]
}

const STORE_ITEM_COUNT: number = 3;

export default class ItemsManager extends OBT_UIManager {
    static instance: ItemsManager;
    public rootNode: Node = find("Canvas/GamePlay/GamePlay");

    public itemData: ItemInfo.ItemData;
    // 按道具的群组来分组
    private  _groupMap: ItemInfo.GroupMap = {
        normal: [],
        limit: [],
        special: []
    };

    // 触发刷新的次数
    private _refreshTime: number = 0;
    // 下次刷新的费用
    private _nextRefreshCost: number = 0;
    public storeItemList: ItemInfo.Item[] = [];

    // 当前背包道具
    public backpack: ItemInfo.BackpackItem[] = [];

    private _itemPreviewNode: Node;

    // 当前捡起的战利品列表, 不包含普通战利品
    // private _pickUpTrophyList: ItemInfo.TROPHY_TYPE[] = [ItemInfo.TROPHY_TYPE.CORE_UPGRADE];
    private _pickUpTrophyList: ItemInfo.TROPHY_TYPE[] = [];

    protected onLoad(): void {
        if (!ItemsManager.instance) {
            ItemsManager.instance = this
        } else {
            this.destroy();
            return;
        }

        this._initItemData();

        this._itemPreviewNode = this.showPrefab({ prefabPath: "GUI_Prepare/GUI_ItemPreview", parentNode: ProcessManager.instance.uiRootNode });

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PICK_UP_TROPHY, this._pickUpTrophy, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CORE_UPGRADE, this.coreLevelUp, this);
    }

    private _initItemData() {
        this.itemData = DBManager.instance.getDBData("Items");

        const { item_def, item_id_list } = this.itemData;

        for (let id of item_id_list) {
            let item: ItemInfo.Item = item_def[id];
            this._groupMap[item.group].push(id);
        }
    }

    // 刷新商店时，获取背包里已达上限/唯一的道具列表，以进行忽略操作
    private _getStoreIgnoreList(): string[] {
        let ignoreList: string[] = [];
        this.backpack.forEach((backpackItem: ItemInfo.BackpackItem, i: number) => {
            let itemId: string = backpackItem.id;
            let item: ItemInfo.Item = this.getItemById(itemId);
            switch (item.group) {
                case ItemInfo.Group.SPECIAL: {
                    ignoreList.push(itemId);
                } break;
                case ItemInfo.Group.LIMIT: {
                    item.max = item.max || 1;
                    if (backpackItem.count >= item.max) {
                        ignoreList.push(itemId);
                    }
                } break;
            }
        });

        return ignoreList;
    }

    private _getLockStoreItem(): ItemInfo.Item[] {
        return this.storeItemList.filter(item => item.lock === true);
    }
    private _loadStoreList(n: number = STORE_ITEM_COUNT): Boolean {
        // 筛除已锁定的道具(TODO: 已锁定的道具，不要出现在开箱的物品列表里，避免唯一道具出现多个的情况)
        let items: ItemInfo.Item[] = this._getLockStoreItem();
        n = n - items.length;
        if (n <= 0) {
            return false;
        }
        let ignoreList = this._getStoreIgnoreList();
        if (items.length) {
            items.forEach((item: ItemInfo.Item) => {
                ignoreList.push(item.id)
            });
        }
        for (let i = 0; i < n; i++) {
            let item: ItemInfo.Item = this._getRandomItemByStore({ ignoreKeyList: ignoreList });
            if (item) {
                ignoreList.push(item.id);
                let storeItem: ItemInfo.Item = copyObject(item);
                // TODO: 计算价格
                storeItem.price = 1;
                items.push(storeItem);
            }
        }
        this.storeItemList = items;
        OBT.instance.eventCenter.emit(GamePlayEvent.STORE.STORE_ITEM_LIST_UPDATE);
        return true;
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
        let pool: ItemInfo.Item[] = [];
        for (let id of this.itemData.item_id_list) {
            // 排除已进入当前商店列表/已达上限的项目
            if (ignoreKeyList.indexOf(id) !== -1) {
                continue;
            }
            pool.push(this.getItemById(id))
        }
        return pool;
    }

    public getItemById(id) {
        return this.itemData.item_def[id];
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

    // 刷新花费, 目前固定为1
    private _setNextRefreshCost() {
        // 后续结合刷新次数，当前波次决定
        this._nextRefreshCost = 1 + this._refreshTime - this._refreshTime;

        OBT.instance.eventCenter.emit(GamePlayEvent.STORE.STORE_REF_COST_CHANGE, this._nextRefreshCost);
    }

    // 获取指定道具的富文本属性标签词条
    public getItemsPanelRichTxt(key: string): string {
        if (!key) {
            return "";
        }
        let item: ItemInfo.Item = this.getItemById(key);
        if (!item) {
            return "";
        }
        let buffList: CHRInfo.Buff[] = item.buff_list;
        return this.getItemsPanelRickTxtByBuffList(buffList);
    }

    // 获取buff列表对应富文本
    public getItemsPanelRickTxtByBuffList(buffList: CHRInfo.Buff[]) {
        let buffTxt = "";
        buffList.forEach((buff, i) => {
            buffTxt += CHRManager.instance.propCtx.getBuffTxt(buff);
            if (i !== buffList.length - 1) {
                buffTxt += "<br/>";
            }
        });
        return buffTxt;
    }

    // 刷新商店
    public refreshStoreList(autoRefresh?: boolean): boolean {
        if (this._getLockStoreItem().length >= STORE_ITEM_COUNT) {
            // console.log('锁定数量上限');
            return false;
        }

        // 是否为系统自动刷新，用于刚进入备战流程
        if (autoRefresh) {
            this._refreshTime = 0;
        } else {
            let nowCurrency: number = CHRManager.instance.currencyCtrl.getCurrency();
            // 金币不够
            if (nowCurrency - this._nextRefreshCost < 0) {
                // console.log('金币不足');
                return false;
            }
            // 这个方法里面做扣金币操作
            CHRManager.instance.currencyCtrl.addCurrency(-this._nextRefreshCost);

            this._refreshTime++;
        }

        // _loadStoreList只做刷新商店
        this._loadStoreList();
        this._setNextRefreshCost();
    }

    // 获得道具
    public obtainItem(id: string) {
        let hasItemInBackpack:  boolean = false;
        for (let backpackItem of this.backpack) {
            if (backpackItem.id === id) {
                hasItemInBackpack = true;
                backpackItem.count++;
                // 道具更新, 数量变化
                OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.ITEM_CHANGE, { hasItemInBackpack, backpackItem });
                break;
            }
        }
        if (!hasItemInBackpack) {
            let backpackItem: ItemInfo.BackpackItem = { id, count: 1 };
            this.backpack.push(backpackItem);
            // 道具更新, 新增道具
            OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.ITEM_CHANGE, { hasItemInBackpack, backpackItem });
        }
        // TODO: 修改角色属性/插入事件
        let item: ItemInfo.Item = this.getItemById(id);
        CHRManager.instance.upgradePropByBuff(item.buff_list);
    }

    // 购买道具
    public buyItem(id: string): boolean {
        let storeItem: ItemInfo.Item = this.storeItemList.find((item: ItemInfo.Item) => item.id === id);
        if (!storeItem) {
            return false;
        }

        let price: number = storeItem.price;
        let nowCurrency: number = CHRManager.instance.currencyCtrl.getCurrency();
        if (nowCurrency < price) {
            console.log('元件不足');
            return false;
        }

        this.obtainItem(id);
        // 扣除元件
        CHRManager.instance.currencyCtrl.addCurrency(-price);
        return true;
    }

    // 锁定，解锁商店
    public toggleLockStoreItem(id: string) {
        let item: ItemInfo.Item = this.storeItemList.find(item => item.id === id);
        if (item) {
            item.lock = !item.lock;
        }
    }

    // 预览道具
    public previewItem(id: string, index: number) {
        let item: ItemInfo.Item = this.getItemById(id);
        this._itemPreviewNode.OBT_param2.updateView(item);

        this.showNode(this._itemPreviewNode);
    }

    // 当核心升级时，算作捡起一个升级道具
    protected coreLevelUp() {
        this._pickUpTrophy(ItemInfo.TROPHY_TYPE.CORE_UPGRADE);
    }

    // 捡起道具
    private _pickUpTrophy(trophy: ItemInfo.TROPHY_TYPE) {
        switch (trophy) {
            case ItemInfo.TROPHY_TYPE.CORE:
            case ItemInfo.TROPHY_TYPE.CORE_UPGRADE: {
                this._pickUpTrophyList.unshift(trophy);
                OBT.instance.eventCenter.emit(GamePlayEvent.GUI.UPDATE_TROPHY_ICON);
            } break;
        }
    }
    public getPickUpTrophyList(): ItemInfo.TROPHY_TYPE[] {
        return this._pickUpTrophyList;
    }
    public hasTrophy(): boolean {
        return this._pickUpTrophyList.length > 0;
    }
    public getNextTrophy(): ItemInfo.TROPHY_TYPE {
        return this._pickUpTrophyList[0];
    }
    public expendTrophy() {
        if (this._pickUpTrophyList.length) {
            this._pickUpTrophyList.shift();
            OBT.instance.eventCenter.emit(GamePlayEvent.GUI.UPDATE_TROPHY_ICON);
        }
    }

    protected onDestroy(): void {
        console.log('销毁道具管理ing')

        ItemsManager.instance = null;
    }
}
