import { Vec3 } from "cc"

export namespace GamePlayEvent {
    export enum COMPASS {
        TOUCH_START = 10,
        TOUCH_END,
        TOUCH_MOVE
    }

    export enum GAME_PALY {
        FIGHT_START = 15,
        TIME_INIT,
        TIME_REDUCE_TINY,
        TIME_REDUCE,
        FIGHT_PASS,
        LEVEL_UP,
        EXP_CHANGE
    }
}

export interface SaveDoc {
    wave: number,
    status: number,
    // 和CHRProp.Prop一样
    chr_prop: CHRInfo.CHRProps,
    chr_slot: CHRInfo.CHRSlot
}

export namespace GameConfigInfo {
    export interface EMYSpawnRole {
        enemy_type: string,
        // 总生成数量
        spawn_total: number,
        // 一次生成的数量
        spawn_once_time: number,
        spawn_interval: number,
        // 生成位置模式 random随机, pixed->固定位置, corners->屏幕四个角落",
        spawn_pattern: string,
        // 批量生成模式
        batch_mode: string,
        start_delay: number,
        spawn_duration: number,
        // 总生成次数
        spawn_count: number,
        // 当前生成次数
        spawned_count: number,
        // 下次生成时间
        next_spawn_time: number,
        // 是否生成完毕
        spwaned: boolean
    }

    export interface WaveRole {
        wave: number,
        duration: number,
        spawn_roles: EMYSpawnRole[]
    }

    export interface GameConfig {
        waves: WaveRole[]
    }
}

export namespace WarCoreInfo {
    export interface AtkWarCoreAttr {
        intro: string,
        atk_intro: string,
        icon_ui: string,
        icon_gaming: string,
        bullet: string,
        range: number,
        cd: number
    }

    export interface AtkWarCoreDBData {
        [atkWarCoreId: string]: AtkWarCoreAttr
    }
}

export namespace CHRInfo {
    // 角色基础数值支撑属性
    export interface CHRBasicProps {
        basic_dmg: number,
        basic_spd: number,
        basic_exp_eff: number,
        basic_pick_range: number
    }

    export interface CHRSlot {
        atk_core: string,
        level: number
    }

    export interface CHRProps {
        hp: number,
        range: number,
        atk_spd: number,
        dmg: number,
        // range_dmg: 0,
        // melee_dmg: 0,
        def: number,
        spd: number,
        avd: number,
        exp_eff: number,
        pick_range: number
    }
    export interface CHRPropsAttr {
        prop: string,
        propTxt?: string,
        group?: string,
        value?: number,
        // 是否使用百分比计算
        percent?: boolean,
        // true -> 当value值为正数时，为正向buff；false -> value值为负数时，为正向buff
        buffPos?: boolean
    }

    // export interface BasicProps {
    //     key: string,
    //     label?: string,
    //     group?: number,
    //     value?: number,
    //     // 是否使用百分比计算
    //     percent?: boolean,
    //     // true -> 当value值为正数时，为正向buff；false -> value值为负数时，为正向buff
    //     buffPos?: boolean
    // }

    export interface UpdateProp {
        prop: string,
        propTxt: string,
        icon: string,
        level: number,   // 品质
        // TODO: 需要根据当前角色等级，调整刷出 低级/中级/高级 升级属性的概率
        value: number
    }
}

export namespace EMYInfo {
    export interface EMYDropInfo {
        id: string,
        exp_drop_rate: number,
        trophy_drop_rate: number,
        exp_cnt: number
    }
    export interface EMYDropData {
        [EMYId: string]: EMYDropInfo
    }
    export interface EMYProps extends EMYDropInfo {
        type: string,
        move: string,
        pic: string,
        spd: number,
        hp: number,
        dmg: number
    }
    export interface EMYDBData {
        [EMYId: string]: EMYProps
    }

    export interface RealTimeInfo {
        x?: number,
        y?: number,
        dis?: number,
        alive: number
    }
    
    export interface ChooseTargetCallback {
        (isCanBeAttacked?: any, realTimeEnemyInfo?: RealTimeInfo): void
    }

    export interface CreateEMYParams {
        enemyType: string,
        enemyCount: number,
        // 生成位置模式
        pattern: string,
        // 批量生成模式
        batchMode: string
    }
}

export namespace GameCollider {
    export enum TAG {
        DROP_ITEM_PICKER = 9,
        CHR_RANGE_ALERT = 10,
        CHR_RANGE_ATTACK = 11,

        DROP_ITEM_EXP = 20,

        // 子弹碰撞id
        BULLET_BASE = 500
    }

    export enum GROUP {
        DEFAULT = 1<<0,
        CHR = 1<<1,
        CORE_DOMAIN = 1<<2,
        ENEMY = 1<<3,
        CHR_BULLET = 1<<4,
        PICK_DOMAIN = 1<<5,
        DROP_ITEM = 1<<6
        // CTR_RIM = 1<<5,
    }
}

export namespace BulletInfo {
    export interface BulletAttr {
        id: string,
        prefab: string,
        type: string,
        script: string,
        damage: number,
        speed: number,
        // 最大飞行距离
        max_dis: number
        cld: number
    }

    export interface BulletDBData {
        [bulletId: string]: BulletAttr
    }
    export interface BulletCldData {
        [cld: string]: BulletAttr
    }

    // 子弹初始化参数
    export interface BulletInitParams {
        attr: BulletAttr,
        vector: Vec3
    }
}

export const SCREEN_WIDTH = 720;
export const SCREEN_HEIGHT = 1280;
// 速度1，实际等于 1*PIXEL_UNIT = 20px/s
export const PIXEL_UNIT = 20;
