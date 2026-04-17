import { _decorator, Component, Node, Prefab, Vec3, tween, v3, find, NodePool } from 'cc';
import OBT_UIManager from '../Manager/OBT_UIManager';
import { BoostConfig, BulletInfo, COLOR, Common, GameCollider, GameConfigInfo, ITEM_QUALITY } from '../Common/Namespace';
import OBT from '../OBT';
import DBManager from './DBManager';
import { BulletParticleCtrl } from './Class/BulletParticleCtrl';
import { Bullet } from '../Controllers/GamePlay/Bullet/Bullet';
import ProcessManager from './ProcessManager';
import DamageManager from './DamageManager';
import CHRManager from './CHRManager';
import { copyObject } from '../Common/utils';
import WarCoreManager from './WarCoreManager';
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
        for (let bulletId in this._nodePoolMap) {
            this._nodePoolMap[bulletId].clear();
        }
        this._nodePoolMap = {};
        configList.forEach(({ bulletId, count }) => {
            const bulletAttr: BulletInfo.BulletAttr = this.bulletData[bulletId];
            if (!this._nodePoolMap[bulletId]) {
                this._nodePoolMap[bulletId] = new NodePool();
            }
            for (let i = 0; i < count; i++) {
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

    // 获取子弹基础伤害, 如果是当前核心的武器子弹, 返回对应核心品质的子弹伤害
    public getBulletDamage(bulletId: string, isCurrentWarCoreBullet?: boolean): number {
        let damageAry: number[] = this.getBulletInfo(bulletId, "damage");
        let damage: number;
        if (isCurrentWarCoreBullet) {
            let quality: ITEM_QUALITY = WarCoreManager.instance.warCore.quality || 1;
            damage = damageAry[quality - 1] || damageAry[0];
        } else {
            damage = damageAry[0];
        }
        return damage;
    }
    public getBulletInfo(bulletId: string, prop?: string) {
        return prop ? this.bulletData[bulletId][prop] : this.bulletData[bulletId];
    }
    public getBulletTag(bulletId: string) {
        // return bulletDb[bulletId].cld;
    }

    // 获取指定bulletId的实时属性
    public getBulletRealTimeAttr(bulletId: string, isCurrentWarCoreBullet?: boolean): BulletInfo.BulletRealTimeAttr {
        let base_dmg: number = this.getBulletDamage(bulletId, isCurrentWarCoreBullet);
        let dmg: number = DamageManager.instance.getBulletRealDamage(bulletId, isCurrentWarCoreBullet);
        let boost: BoostConfig = this.getBulletInfo(bulletId, "boost");

        return {
            bulletId,
            base_dmg,
            dmg,
            boost
        }
    }

    public createBullet({ bulletId, position, vector }: BulletInfo.CreateBulletNodeParams): Node {
        // console.log(`创建子弹${bulletId}`)
        const bulletAttr: BulletInfo.BulletAttr = this.bulletData[bulletId];
        const nodePool = this._nodePoolMap[bulletId];
        let bulletNode: Node = nodePool ? nodePool.get() : null;
        if (!bulletNode) {
            bulletNode = this.loadPrefab({ prefabPath: `Bullet/${bulletAttr.prefab}`, scriptName: bulletAttr.script });
        }
        bulletNode.setPosition(position);

        // 旋转子弹
        if (vector) {
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
        }

        return bulletNode;
    }

    /**
     * 主角创建的子弹
     */
    public createBulletByCHR({ bulletId, position, vector, ignoreList, groupId, penetrate, pen_dmg, rootNode, sleep }: BulletInfo.CreateBulletParams) {
        const bulletAttr: BulletInfo.BulletAttr = this.bulletData[bulletId];
        let bulletNode: Node = this.createBullet({ bulletId, position, vector });

        bulletAttr.penetrate = penetrate || 0;
        bulletAttr.pen_dmg = pen_dmg || 1;
        // 直接断言脚本是BulletCtrl的实例即可，需要实现initAttr方法
        const scriptComp: Bullet = <Bullet>bulletNode.getComponent(bulletAttr.script);
        bulletNode.OBT_param2 = { attr: bulletAttr };
        scriptComp.init({ attr: bulletAttr, vector, ignoreList, groupId, sleep });
        this.mountNode({ node: bulletNode, parentNode: rootNode || this.bulletRootNode });
    }

    /**
     * 敌人创建的子弹
     *  存在enemyId
     *  penetrate和pen_dmg直接从子弹配置属性中拿取
     */
    public createBulletByEnemy({ bulletId, position, vector, ignoreList, groupId, enemyId, rootNode, sleep }: BulletInfo.CreateBulletParams): Node {
        const bulletAttr: BulletInfo.BulletAttr = copyObject(this.bulletData[bulletId]);
        let bulletNode: Node = this.createBullet({ bulletId, position, vector });

        bulletAttr.penetrate = bulletAttr.penetrate || 0;
        bulletAttr.pen_dmg = bulletAttr.pen_dmg || 1;
        // 直接断言脚本是BulletCtrl的实例即可，需要实现initAttr方法
        const scriptComp: Bullet = <Bullet>bulletNode.getComponent(bulletAttr.script);
        bulletNode.OBT_param2 = { attr: bulletAttr };
        scriptComp.init({ attr: bulletAttr, vector, ignoreList, enemyId, groupId, sleep });
        this.mountNode({ node: bulletNode, parentNode: rootNode || this.bulletRootNode });

        return bulletNode;
    }

    update(deltaTime: number) {

    }
}

