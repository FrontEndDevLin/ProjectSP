import { _decorator, Component, Node, Prefab, Vec3, tween, v3, find, NodePool } from 'cc';
import OBT_UIManager from "../Manager/OBT_UIManager";
import { BulletInfo, WeaponInfo } from '../Common/Namespace';
import DBManager from './DBManager';
import WeaponBase from '../Controllers/GamePlay/Weapons/WeaponBase';
import { Weapon_def, IWeapon_def } from '../Controllers/GamePlay/Weapons/Weapon_def';
import BulletManager from './BulletManager';
import { copyObject } from '../Common/utils';
import WeaponBasic from '../Controllers/GamePlay/Weapons/WeaponBasic';
const { ccclass, property } = _decorator;

export default class WeaponManager extends OBT_UIManager {
    static instance: WeaponManager = null;

    public weaponData: WeaponInfo.WeaponDBData;
    public iWeaponData: WeaponInfo.IWeaponDBData;

    protected onLoad(): void {
        if (!WeaponManager.instance) {
            WeaponManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        this.weaponData = DBManager.instance.getDBData("Weapon");
        this.iWeaponData = DBManager.instance.getDBData("I_Weapon");
    }

    public getWeaponDataById(weaponId: string): WeaponInfo.Weapon {
        const weaponData: WeaponInfo.Weapon = this.weaponData.weapon_def[weaponId];
        return copyObject(weaponData);
    }

    public getIWeaponDataById(weaponCode: string): WeaponInfo.IWeapon {
        const weaponData: WeaponInfo.IWeapon = this.iWeaponData.weapon_def[weaponCode];
        return copyObject(weaponData);
    }

    public getWeaponCtxById(weaponId: string): WeaponBase {
        const weaponData: WeaponInfo.Weapon = this.getWeaponDataById(weaponId);
        if (weaponData.bullet) {
            const bulletRealTimeAttr: BulletInfo.BulletRealTimeAttr = BulletManager.instance.getBulletRealTimeAttr(weaponData.bullet);
            Object.assign(weaponData, bulletRealTimeAttr);
        }
        if (weaponData) {
            return new Weapon_def[weaponId](weaponData);
        }
        return null;
    }

    public getIWeaponCtxById(weaponCode: string): WeaponBasic {
        const iWeaponData: WeaponInfo.IWeapon = this.getIWeaponDataById(weaponCode);
        if (iWeaponData) {
            if (IWeapon_def[weaponCode]) {
                return new IWeapon_def[weaponCode](iWeaponData);
            } else {
                console.error(`IWeapon_def 不存在 ${weaponCode}`);
            }
        }
        return null;
    }
}
