import { _decorator, Component, Node, Prefab, Size, Sprite, SpriteFrame, UITransform, v3, Vec3 } from 'cc';
// import { ChapterManager } from './ChapterManager';
// import { ExpBlockCtrl } from '../GameControllers/dropItem/ExpBlockCtrl';
// import { TrophyBlockCtrl } from '../GameControllers/dropItem/TrophyBlockCtrl';
// import { CurrencyManager } from './CurrencyManager';
import OBT_UIManager from '../Manager/OBT_UIManager';
import EMYManager from './EMYManager';
import { EMYInfo, PIXEL_UNIT } from '../Common/Namespace';
import OBT from '../OBT';
import { getFloatNumber, getRandomNumber } from '../Common/utils';
const { ccclass, property } = _decorator;

/**
 * 物品掉落管理
 *  经验掉落
 *  战利品掉落/战利品有几率变成宝箱
 *  物品掉落概率 = 该敌人自身掉宝率 * 全局掉宝率修正
 */

export enum TROPHY_TYPE {
    NONE = 0,
    NORMAL = 1,
    CHEST,
    GREAT_CHEST
}

export default class DropItemManager extends OBT_UIManager {
    static instance: DropItemManager = null;

    // 经验库存图标位置，用于关卡结束时，回收动画
    public expIconWorldPos: Vec3 = null;

    public dropItemRootNode: Node = null;

    private _dropRateMap: EMYInfo.EMYDropData = {};

    // 关卡爆率修正数据
    private _chapterData: any = {};

    protected onLoad(): void {
        if (!DropItemManager.instance) {
            DropItemManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        console.log("DropItem Manager loaded");
    }

    start() {
        
    }

    public initRateMap() {
        this._dropRateMap = {};
        const enemyData: EMYInfo.EMYDBData = EMYManager.instance.enemyData;
        for (let emyId in enemyData) {
            if (!emyId.includes("EMY")) {
                continue;
            }
            const enemyProps: EMYInfo.EMYProps = enemyData[emyId];
            this._dropRateMap[emyId] = {
                id: enemyProps.id,
                exp_drop_rate: enemyProps.exp_drop_rate,
                trophy_drop_rate: enemyProps.trophy_drop_rate,
                exp_cnt: enemyProps.exp_cnt
            };
        }

    }

    // 更新全局爆率修正概率
    public updateChapterRateData() {
        // this._chapterData = ChapterManager.instance.getChapterData();
    }

    /**
     * 敌人死亡后，调用该接口，由该接口决定掉落物品
     */
    public dropItem(emyId: string, position: Vec3) {
        if (!this.dropItemRootNode) {
            this.dropItemRootNode = this.mountEmptyNode({ nodeName: "DropItemBox", parentNode: this.rootNode });
        }
        let emyRateData: any = this._dropRateMap[emyId];
        let dropExpCnt: number = this._dropExp(emyRateData);
        if (dropExpCnt) {
            let vecAry: Vec3[] = this._getRandomVec3Group(dropExpCnt, position);
            let expandExpCnt: number = dropExpCnt;
            // TODO: 请求CurrencyManager接口查询库存，有则+1，库存-1
            // let expandExpCnt: number = 0;
            // let storage: number = CurrencyManager.instance.getStorage();
            // if (storage >= 1) {
            //     if (storage >= dropExpCnt) {
            //         expandExpCnt = dropExpCnt;
            //     } else {
            //         expandExpCnt = storage;
            //     }
            // }
            for (let i = 0; i < dropExpCnt; i++) {
                // 生成经验值预制体，在position周围掉落(掉落滑动动画)
                let expNode: Node = this.loadPrefab({ prefabPath: "DropItem/ExpBlock", scriptName: "ExpBlock" });

                let randomNum: number = getRandomNumber(1, 5);
                let pic: SpriteFrame = OBT.instance.resourceManager.getSpriteFrameAssets(`DropItem/exp-${randomNum}`);
                const { width, height } = pic.rect;
                let picSize: Size = new Size(width, height);
                expNode.getComponent(UITransform).setContentSize(picSize);
                expNode.getComponent(Sprite).spriteFrame = pic;

                let expCnt = 1;
                // 经验块大小缩放
                // if (i < expandExpCnt) {
                //     expNode.setScale(v3(1.4, 1.4, 0));
                //     expCnt++;
                // }
                expNode.angle = getRandomNumber(0, 360);
                expNode.OBT_param1 = { targetVec: vecAry[i], expCnt };
                expNode.setPosition(position);
                this.mountNode({ node: expNode, parentNode: this.dropItemRootNode });
            }

            // if (expandExpCnt) {
            //     CurrencyManager.instance.addStorage(-expandExpCnt);
            // }
        }

        // let dropTrophy: number = this._dropTrophy(emyRateData);
        // if (dropTrophy) {
        //     let vecAry: Vec3[] = this._getRandomVec3Group(1, position);
        //     let trophyNode: Node;
        //     switch (dropTrophy) {
        //         case TROPHY_TYPE.NORMAL: {
        //             trophyNode = this.loadUINode("dropItem/TrophyBlock", "TrophyBlockCtrl");
        //         } break;
        //         case TROPHY_TYPE.CHEST: {
        //             trophyNode = this.loadUINode("dropItem/ChestBlock", "TrophyBlockCtrl");
        //         } break;
        //         case TROPHY_TYPE.GREAT_CHEST: {

        //         } break;
        //     }
        //     if (trophyNode) {
        //         // 战利品掉落不需要旋转角度
        //         trophyNode.OO_param1 = {
        //             targetVec: vecAry[0],
        //             quality: dropTrophy
        //         };
        //         trophyNode.setPosition(position);
        //         this.appendUINode(trophyNode);
        //     }
        // }
    }

    /**
     * 资源回收，用于关卡结束后
     */
    public resRecovery() {
        for (let dropNode of this.rootNode.children) {
            // if (dropNode.name === "ExpBlock") {
            //     let expBlockCtx: ExpBlockCtrl = dropNode.getComponent("ExpBlockCtrl") as ExpBlockCtrl;
            //     expBlockCtx.recovery();
            // } else if (dropNode.name === "TrophyBlock" || dropNode.name === "ChestBlock") {
            //     let trophyBlockCtx: TrophyBlockCtrl = dropNode.getComponent("TrophyBlockCtrl") as TrophyBlockCtrl;
            //     trophyBlockCtx.recovery();
            // }
        }
    }

    /**
     * 生成坐标组
     */
    private _getRandomVec3Group(n: number, position: Vec3): Vec3[] {
        // 上右下左，随机一个方向
        const dirGroup: any[] = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
        let dir: number[] = dirGroup[getRandomNumber(0, 3)];

        let deg: number = getFloatNumber(180 / n, 2);
        let vecAry: Vec3[] = [];
        // 半径
        const r: number = 0.8 * PIXEL_UNIT;
        let skew: number = 0;
        for (let i = 1; i <= n; i++) {
            let cDeg: number = getFloatNumber(deg * i);
            let x: number = getFloatNumber(r * Math.cos(cDeg));
            let y: number = getFloatNumber(r * Math.sin(cDeg));

            if (!skew) {
                skew = Math.floor(x / 2);
            }

            // 随机偏移
            let skewX: number = getRandomNumber(skew, skew * 2) * [1, -1][getRandomNumber(0, 1)];
            let skewY: number = getRandomNumber(skew, skew * 2) * [1, -1][getRandomNumber(0, 1)];

            let newX: number = position.x + x * dir[0] + skewX;
            let newY: number = position.y + y * dir[1] + skewY;

            vecAry.push(v3(newX, newY));
        }

        return vecAry;
    }

    // 判断掉落经验 判断当前关卡的全局掉落修正
    private _dropExp(emyRateData: any): number {
        let expDropRate: number = emyRateData.exp_drop_rate;
        // 经验爆率修正
        // let expDropAmend: number = this._chapterData.exp_drop_amend;
        let expDropAmend: number = 1;

        let rate: number = expDropRate * expDropAmend;
        if (rate >= 1) {
            return emyRateData.exp_cnt;
        } else {
            return Math.random() <= rate ? emyRateData.exp_cnt : 0;
        }
    }
    // 是否掉落战利品
    private _dropTrophy(emyRateData: any): number {
        let trophyDropRate: number = emyRateData.trophy_drop_rate;
        // 战利品爆率修正
        let trophyDropAmend: number = this._chapterData.trophy_drop_amend;

        let rate: number = trophyDropRate * trophyDropAmend;
        // 0->无, 1->普通战利品, 2->普通箱子, 3->极品箱子
        if (rate >= 1) {
            return this._beenChest();
        } else {
            if (Math.random() <= rate) {
                return this._beenChest();
            } else {
                return 0;
            }
        }
    }

    private _beenChest() {
        // TODO: 战利品掉落有几率变成箱子，和角色幸运值挂钩。目前临时处理
        let num = getRandomNumber(1, 100);
        if (num < 10) {
            return TROPHY_TYPE.CHEST;
        } else {
            return TROPHY_TYPE.NORMAL;
        }
    }

    update(deltaTime: number) {
        
    }
}


