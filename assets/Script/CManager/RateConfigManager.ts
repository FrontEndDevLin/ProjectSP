import { _decorator, Component, Node, Prefab, Vec3, tween, v3, find, NodePool } from 'cc';
import OBT_UIManager from "../Manager/OBT_UIManager";
import { BulletInfo, ITEM_QUALITY, RateConfig, WeaponInfo } from '../Common/Namespace';
import DBManager from './DBManager';
import { getRandomNumber } from '../Common/utils';
const { ccclass, property } = _decorator;

export default class RateConfigManager extends OBT_UIManager {
    static instance: RateConfigManager = null;

    public rateConfigData: RateConfig.RateConfigDBData;

    protected upgradeLevelRangeList: string[] = [];
    protected waveRangeList: string[] = [];

    protected onLoad(): void {
        if (!RateConfigManager.instance) {
            RateConfigManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        this.rateConfigData = DBManager.instance.getDBData("RateConfig");

        this.initUpgradeLevelRangeList();
        this.initWaveRangeList();
        // for (let i = 0; i < 4; i++) {
        //     console.log(this.getUpgradeQuality(29))
        // }
    }

    /**
     * 等级对应范围数组: [null, "1-2", "1-2", "3-7"]...
     */
    protected initUpgradeLevelRangeList() {
        let upgradeStoreRateConfig = this.rateConfigData.upgrade_store_rate_config

        for (let levelRange in upgradeStoreRateConfig) {
            if (levelRange === "other") {
                continue;
            }
            let [minLevStr, maxLevStr] = levelRange.split("-");
            let minLev: number = Number(minLevStr);
            let maxLev: number = Number(maxLevStr);
            if (minLev && maxLev && minLev < maxLev) {
                for (let i = minLev; i <= maxLev; i++) {
                    this.upgradeLevelRangeList[i] = levelRange;
                }
            } else {
                continue;
            }
        }
    }

    /**
     * 获取对应等级的升级品质
     */
    public getUpgradeQuality(level: number): ITEM_QUALITY {
        let levelRange = this.upgradeLevelRangeList[level] || "other";
        let config: RateConfig.StoreConfigItem = this.rateConfigData.upgrade_store_rate_config[levelRange];

        let quality: ITEM_QUALITY = null;

        let randomNum: number = getRandomNumber(1, 100);
        let currentNum: number = 0;
        for (let qty in config) {
            currentNum += config[qty] * 100;
            // 命中
            if (randomNum <= currentNum) {
                quality = Number(qty)
                break;
            }
        }

        return quality;
    }

    /**
     * 波次对应范围数组
     */
    protected initWaveRangeList() {
        let itemStoreRateConfig = this.rateConfigData.item_store_rate_config

        for (let waveRange in itemStoreRateConfig) {
            if (waveRange === "other") {
                continue;
            }
            let [minWaveStr, maxWaveStr] = waveRange.split("-");
            let minWave: number = Number(minWaveStr);
            let maxWave: number = Number(maxWaveStr);
            if (minWave && maxWave && minWave < maxWave) {
                for (let i = minWave; i <= maxWave; i++) {
                    this.waveRangeList[i] = waveRange;
                }
            } else {
                continue;
            }
        }
    }

    /**
     * 获取对应波次的道具品质
     */
    public getItemQuality(wave: number): ITEM_QUALITY {
        let waveRange = this.waveRangeList[wave] || "other";
        let config: RateConfig.StoreConfigItem = this.rateConfigData.item_store_rate_config[waveRange];

        let quality: ITEM_QUALITY = null;

        let randomNum: number = getRandomNumber(1, 100);
        let currentNum: number = 0;
        for (let qty in config) {
            currentNum += config[qty] * 100;
            // 命中
            if (randomNum <= currentNum) {
                quality = Number(qty)
                break;
            }
        }

        return quality;
    }
}
