import WeaponBase from "./WeaponBase";
import WeaponOrbitsAtkWarCore from "./Weapon_OrbitsAtkWarCore";

import WeaponChrBaseFlyBullet from "./Weapon_Chr_BaseFlyBullet";
import WeaponEmyBody from "./Weapon_Emy_Body";

export namespace Weapon_def {
    export const Weapon_Base = WeaponBase;
    export const Weapon_BaseAtkWarCore = WeaponBase;
    export const Weapon_ScatterAtkWarCore = WeaponBase;
    export const Weapon_OrbitsAtkWarCore = WeaponOrbitsAtkWarCore;
    export const Weapon_Blossom = WeaponBase;
}

export namespace IWeapon_def {
    export const Weapon_Chr_BaseFlyBullet = WeaponChrBaseFlyBullet;
    export const Weapon_Emy_Body = WeaponEmyBody;
}
