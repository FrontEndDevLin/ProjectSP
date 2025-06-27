/**
 * 程序入口文件
 */

import { _decorator, Component, Node, Prefab, SpriteFrame, PhysicsSystem2D, EPhysics2DDrawFlags, find } from 'cc';
import { Callback } from '../OO/Interface';
import OO_UIManager from '../OO/Manager/OO_UIManager';
import OO_ResourceManager from '../OO/Manager/OO_ResourceManager';
import { EventCenter } from '../OO/Manager/OO_MsgManager';
import { OO_AddManager } from '../OO/OO_Manager';

export default class Main extends Component {
    static instance: Main = null;

    onLoad() {
        if (!Main.instance) {
            Main.instance = this;
        } else {
            this.destroy();
            return;
        }

        EventCenter.on("startGame", () => {
            this.startGame();
        });

        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Shape
    }

    public runGame(): void {
        this.addCustomManager();

        this.preload((err) => {
            if (err) {
                return;
            }
            OO_UIManager.instance.showUI("GUI_StartMenu");
        });
    }

    addCustomManager() {
        // OO_AddManager(DBManager);
        // DBManager.instance.dbLoaded(err => {
        //     OO_AddManager(ChapterManager);
        //     OO_AddManager(CountdownManager);
        //     OO_AddManager(MapManager);
        //     OO_AddManager(CharacterManager);
        //     OO_AddManager(CharacterPropManager);
        //     OO_AddManager(EnemyManager);
        //     OO_AddManager(WeaponManager);
        //     OO_AddManager(BulletManager);
        //     OO_AddManager(DamageManager);
        //     OO_AddManager(StoreManager);
        //     OO_AddManager(ItemsManager);
        // })
    }

    public startGame(): void {
        OO_UIManager.instance.removeUI("GUI_StartMenu");
    }

    protected preload(callback?: Callback): void {
        let pLoadPrefabs: string[] = [
            "Prefabs/StartMenu"
        ];
        OO_ResourceManager.instance.preloadResPkg([{ abName: "GUI", assetType: Prefab, urls: pLoadPrefabs }], (total, current) => {
            // console.log(total, current)
        }, (err, data: any) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(`预加载预设体"${pLoadPrefabs.join(",")}"完成`);

            if (callback) {
                callback(null)
            }
        })
    }
}
