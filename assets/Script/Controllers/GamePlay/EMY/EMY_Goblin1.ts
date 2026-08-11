
import { _decorator, BoxCollider2D, Color, Contact2DType, Node, Sprite, SpriteComponent, v3, Vec3, Animation } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { Common, DamageInfo, EMYInfo, FLASH_TIME, GameCollider, GamePlayEventOptions, ITEM_QUALITY, PIXEL_UNIT, REPEL_TIME } from '../../../Common/Namespace';
import EMYManager from '../../../CManager/EMYManager';
import CHRManager from '../../../CManager/CHRManager';
import ProcessManager from '../../../CManager/ProcessManager';
import { copyObject, getAngleByVector, getRandomNumber, getVectorByAngle } from '../../../Common/utils';
import DropItemManager from '../../../CManager/DropItemManager';
import DamageManager from '../../../CManager/DamageManager';
import RealTimeEventManager from '../../../CManager/RealTimeEventManager';
import WarCoreManager from '../../../CManager/WarCoreManager';
import { HitInfo } from '../../../CManager/CombatManager';
import WeaponBasic from '../Weapons/WeaponBasic';
import WeaponManager from '../../../CManager/WeaponManager';
import Weapon_Emy_Body from '../Weapons/Weapon_Emy_Body';
const { ccclass, property } = _decorator;

@ccclass('EmyGoblin')
export class EmyGoblin extends OBT_Component {
    
}

