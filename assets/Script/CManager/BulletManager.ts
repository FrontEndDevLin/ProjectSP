import { _decorator, Component, Node, Prefab, Vec3, tween, v3, find } from 'cc';
import OBT_UIManager from '../Manager/OBT_UIManager';
import { BulletInfo, GameCollider } from '../Common/Namespace';
import OBT from '../OBT';
import DBManager from './DBManager';
const { ccclass, property } = _decorator;

/**
 * 弹头管理类
 * 
 * 传入弹头
 * warhead_type, 
 *  damage, 
 *  type, 飞行类/静止类
 *      -- 只有type=飞行类时生效
 *      vector向量, 
 *      speed,
 *  visiable: 是否可见
 *      -- 只有可见时才生效
 *      pic
 */

const bulletScriptMap = {
}

/**
 * 这个类要初始化一个弹头列表（来自弹头db），存储角色身上武器所携带的弹头数据，角色面板发生变化时，更新该列表的数据
 */
export default class BulletManager extends OBT_UIManager {
    static instance: BulletManager = null;
    public rootNode: Node = find("Canvas/GamePlay/GamePlay");
    public bulletRootNode: Node = null;

    public bulletData: BulletInfo.BulletDBData = {}

    // 存储当前装备的武器的弹头数据
    private _bulletCldMap: BulletInfo.BulletCldData = {};

    start() {
        
    }

    protected onLoad(): void {
        if (!BulletManager.instance) {
            BulletManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        this.bulletData = DBManager.instance.getDBData("Bullet");
        
        this._initBulletCldMap();
    }

    private _initBulletCldMap(): void {
        for (let bulletId in this.bulletData) {
            const bulletAttr: BulletInfo.BulletAttr = this.bulletData[bulletId];
            this._bulletCldMap[bulletAttr.cld] = bulletAttr;
        }
    }

    public updateBulletList() {
        // let weaponList: any[] = WeaponManager.instance.weaponList;
        // // 根据该列表，生成新的列表格式为 { 弹头Tag: { 弹头数据 } }，弹头数据需要结合角色面板进行计算
        // for (let data of weaponList) {
        //     let weaponKey: string = data.key;
        //     let bulletId = data.bullet;
        //     let bData = bulletDb[bulletId];
        //     bData.damage = WeaponManager.instance.getWeaponDamage(weaponKey);
        //     this._bulletCldMap[bData.cld] = bData;
        // }
    }
    public getBulletDamage(cld: GameCollider.TAG): number {
        return this._bulletCldMap[cld].damage;
    }
    public getBulletTag(bulletId: string) {
        // return bulletDb[bulletId].cld;
    }

    public createBullet(bulletId: string, position: Vec3, vector: Vec3) {
        if (!this.bulletRootNode) {
            this.bulletRootNode = this.mountEmptyNode({ nodeName: "BulletBox", parentNode: this.rootNode });
        }

        // console.log(`创建子弹${bulletId}`)
        const bulletAttr = this.bulletData[bulletId];
        // let scriptName = bulletScriptMap[bulletId] || "BulletCtrl";
        const bulletNode: Node = this.loadPrefab({ prefabPath: `Bullet/${bulletAttr.prefab}`, scriptName: bulletAttr.script });
        bulletNode.setPosition(position);

        // 旋转子弹
        let vX: number = vector.x;
        let vY: number = vector.y;
        let angle = Number((Math.atan(vY / vX) * (180 / Math.PI)).toFixed(2));
        let scaleX = 1;
        if (vX < 0) {
            scaleX = -1;
        }
        let sfNode: Node = bulletNode.getChildByName("SF");
        sfNode.angle = angle;
        sfNode.setScale(v3(scaleX, 1));
        
        // 直接断言脚本是BulletCtrl的实例即可，需要实现initAttr方法
        // const scriptComp: BulletCtrl = this.appendUINode(bulletNode).getComponent(scriptName);
        // scriptComp.initAttr();
        bulletNode.OBT_param1 = { attr: bulletAttr, vector };
        this.mountNode({ node: bulletNode, parentNode: this.bulletRootNode });
    }

    update(deltaTime: number) {
        
    }
}

