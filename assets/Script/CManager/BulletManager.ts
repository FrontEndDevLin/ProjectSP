import { _decorator, Component, Node, Prefab, Vec3, tween, v3, find, NodePool } from 'cc';
import OBT_UIManager from '../Manager/OBT_UIManager';
import { BulletInfo, GameCollider, GameConfigInfo } from '../Common/Namespace';
import OBT from '../OBT';
import DBManager from './DBManager';
import { BulletParticleCtrl } from './Class/BulletParticleCtrl';
import { Bullet } from '../Controllers/GamePlay/Bullet/Bullet';
import ProcessManager from './ProcessManager';
const { ccclass, property } = _decorator;

interface BulletPoolMap {
    [bulletId: string]: NodePool
}

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

/**
 * 这个类要初始化一个弹头列表（来自弹头db），存储角色身上武器所携带的弹头数据，角色面板发生变化时，更新该列表的数据
 */
export default class BulletManager extends OBT_UIManager {
    static instance: BulletManager = null;
    public bulletRootNode: Node = null;

    public bulletData: BulletInfo.BulletDBData = {};

    // 存储当前装备的武器的弹头数据
    // private _bulletCldMap: BulletInfo.BulletCldData = {};

    private _nodePoolMap: BulletPoolMap = {};

    // 子弹粒子特效管理
    public particleCtrl: BulletParticleCtrl;

    start() {
        
    }

    protected onLoad(): void {
        if (!BulletManager.instance) {
            BulletManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        this.particleCtrl = new BulletParticleCtrl();

        this.bulletData = DBManager.instance.getDBData("Bullet");
        
        // this._initBulletCldMap();
    }

    public preloadNode() {
        const preloadConfig: GameConfigInfo.PreloadConfig = ProcessManager.instance.waveRole.preload;
        this.preloadBullet(preloadConfig.bullet);
        this.particleCtrl.preloadParticle(preloadConfig.bullet_particle);
    }

    // private _initBulletCldMap(): void {
    //     for (let bulletId in this.bulletData) {
    //         const bulletAttr: BulletInfo.BulletAttr = this.bulletData[bulletId];
    //         this._bulletCldMap[bulletAttr.cld] = bulletAttr;
    //     }
    // }
    public initRootNode() {
        this.bulletRootNode = this.mountEmptyNode({ nodeName: "BulletBox", parentNode: ProcessManager.instance.unitRootNode });
        this.particleCtrl.initRootNode();
    }

    public preloadBullet(configList: GameConfigInfo.BulletPreloadConfig[]) {
        configList.forEach(({ bulletId, count }) => {
            const bulletAttr: BulletInfo.BulletAttr = this.bulletData[bulletId];
            if (!this._nodePoolMap[bulletId]) {
                this._nodePoolMap[bulletId] = new NodePool();
            }
            for (let i = this._nodePoolMap[bulletId].size(); i < count; i++) {
                const bulletNode: Node = this.loadPrefab({ prefabPath: `Bullet/${bulletAttr.prefab}`, scriptName: bulletAttr.script });
                this._nodePoolMap[bulletId].put(bulletNode);
            }
        });
    }
    public recoverBullet(bulletId: string, node: Node) {
        this.bulletRootNode.removeChild(node);
        if (!this._nodePoolMap[bulletId]) {
            this._nodePoolMap[bulletId] = new NodePool();
        }
        this._nodePoolMap[bulletId].put(node);
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
    public setBulletDamage(bulletId: string, damage: number) {
        this.bulletData[bulletId].damage = damage;
    }
    public getBulletDamage(bulletId): number {
        return this.bulletData[bulletId].damage;
        // return this._bulletCldMap[cld].damage;
    }
    public getBulletTag(bulletId: string) {
        // return bulletDb[bulletId].cld;
    }

    public createBullet(bulletId: string, position: Vec3, vector: Vec3) {
        // console.log(`创建子弹${bulletId}`)
        const bulletAttr = this.bulletData[bulletId];
        const nodePool = this._nodePoolMap[bulletId];
        let bulletNode: Node = nodePool ? nodePool.get() : null;
        if (!bulletNode) {
            bulletNode = this.loadPrefab({ prefabPath: `Bullet/${bulletAttr.prefab}`, scriptName: bulletAttr.script });
        }
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
        const scriptComp: Bullet = <Bullet>bulletNode.getComponent(bulletAttr.script);
        scriptComp.init({ attr: bulletAttr, vector });
        this.mountNode({ node: bulletNode, parentNode: this.bulletRootNode });
    }

    update(deltaTime: number) {

    }
}

