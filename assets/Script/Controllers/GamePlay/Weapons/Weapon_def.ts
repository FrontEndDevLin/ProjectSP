import WeaponBase from "./WeaponBase";
import WeaponOrbitsAtkWarCore from "./Weapon_OrbitsAtkWarCore";

import WeaponChrBaseFlyBullet from "./Weapon_Chr_BaseFlyBullet";
import WeaponChrScatter from "./Weapon_Chr_Scatter";
import WeaponEmyBody from "./Weapon_Emy_Body";
import WeaponEmyTripleFlyBullet from "./Weapon_Emy_TripleFlyBullet";

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
    export const Weapon_Emy_Goblin = WeaponEmyBody;
    export const Weapon_Emy_Goblin2 = WeaponEmyBody;
    export const Weapon_Emy_Elite01 = WeaponEmyBody;
    export const Weapon_Emy_TripleFlyBullet = WeaponEmyTripleFlyBullet;
}
