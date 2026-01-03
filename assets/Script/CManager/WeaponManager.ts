import { _decorator, Component, Node, Prefab, Vec3, tween, v3, find, NodePool } from 'cc';
import OBT_UIManager from "../Manager/OBT_UIManager";
import { BulletInfo, WeaponInfo } from '../Common/Namespace';
import DBManager from './DBManager';
import WeaponBase from '../Controllers/GamePlay/Weapons/WeaponBase';
import { Weapon_def } from '../Controllers/GamePlay/Weapons/Weapon_def';
import BulletManager from './BulletManager';
import { copyObject } from '../Common/utils';
const { ccclass, property } = _decorator;

export default class WeaponManager extends OBT_UIManager {
    static instance: WeaponManager = null;

    public weaponData: WeaponInfo.WeaponDBData;

    protected onLoad(): void {
        if (!WeaponManager.instance) {
            WeaponManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        this.weaponData = DBManager.instance.getDBData("Weapon");
    }

    public getWeaponCtxById(weaponId: string): WeaponBase {
        const weaponData: WeaponInfo.Weapon = this.weaponData.weapon_def[weaponId];
        if (weaponData.bullet) {
            const bulletRealTimeAttr: BulletInfo.BulletRealTimeAttr = BulletManager.instance.getBulletRealTimeAttr(weaponData.bullet);
            Object.assign(weaponData, bulletRealTimeAttr);
        }
        if (weaponData) {
            return new Weapon_def[weaponId](weaponData);
        }
        return null;
    }
}
