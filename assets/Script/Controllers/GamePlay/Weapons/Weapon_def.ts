import WeaponBase from "./WeaponBase";
import WeaponOrbitsAtkWarCore from "./Weapon_OrbitsAtkWarCore";

import WeaponEmyBody from "./Weapon_Emy_Body";
import WeaponEmyTripleFlyBullet from "./Weapon_Emy_TripleFlyBullet";
import WeaponEmyDashAtk from "./Weapon_Emy_DashAtk";
import WeaponEmyRangeFlyBullet from "./Weapon_Emy_RangeFlyBullet";

import WeaponChrBaseFlyBullet from "./Weapon_Chr_BaseFlyBullet";
import WeaponChrScatter from "./Weapon_Chr_Scatter";
import WeaponChrFission from "./Weapon_Chr_Fission";

export namespace Weapon_def {
    export const Weapon_Base = WeaponBase;
    export const Weapon_BaseAtkWarCore = WeaponBase;
    export const Weapon_ScatterAtkWarCore = WeaponBase;
    export const Weapon_OrbitsAtkWarCore = WeaponOrbitsAtkWarCore;
    export const Weapon_Blossom = WeaponBase;
}

export namespace IWeapon_def {
    export const Weapon_Chr_BaseFlyBullet = WeaponChrBaseFlyBullet;
    export const Weapon_Chr_Scatter = WeaponChrScatter;
    export const Weapon_Chr_Fission = WeaponChrFission;
    export const Weapon_Emy_Goblin = WeaponEmyBody;
    export const Weapon_Emy_Goblin2 = WeaponEmyBody;
    export const Weapon_Emy_Marauder = WeaponEmyBody;
    export const Weapon_Emy_Witch = WeaponEmyBody;
    export const Weapon_Emy_Werewolf = WeaponEmyBody;
    export const Weapon_Emy_Mummy = WeaponEmyBody;
    export const Weapon_Emy_Elite01 = WeaponEmyBody;
    export const Weapon_Emy_Elite02 = WeaponEmyBody;
    export const Weapon_Emy_TripleFlyBullet = WeaponEmyTripleFlyBullet;
    export const Weapon_Emy_DashAtk = WeaponEmyDashAtk;
    export const Weapon_Emy_RangeFlyBullet = WeaponEmyRangeFlyBullet;
}
