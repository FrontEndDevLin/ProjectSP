import WeaponBase from "./WeaponBase";
import WeaponOrbitsAtkWarCore from "./Weapon_OrbitsAtkWarCore";

import WeaponBaseFlyBullet from "./Weapon_BaseFlyBullet";

export namespace Weapon_def {
    export const Weapon_Base = WeaponBase;
    export const Weapon_BaseAtkWarCore = WeaponBase;
    export const Weapon_ScatterAtkWarCore = WeaponBase;
    export const Weapon_OrbitsAtkWarCore = WeaponOrbitsAtkWarCore;
    export const Weapon_Blossom = WeaponBase;
}

export namespace IWeapon_def {
    export const Weapon_BaseFlyBullet = WeaponBaseFlyBullet;
}
