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
        FIGHT_PASS
    }
}

export interface SaveDoc {
    wave: number,
    status: number,
    // 和CHRProp.Prop一样
    chr_prop: any,
    chr_slot: CHRInfo.CHRSlot
}

export namespace GameConfigInfo {
    export interface EMYSpawnRole {
        enemy_type: string,
        spawn_count: number,
        enemy_count: number,
        spawn_interval: number,
        spawn_pattern: string,
        start_delay: number,
        spawn_duration: number,
        // 当前生成次数
        spawned_count: number,
        // 下次生成时间
        next_spawn_time: number
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
        cd: number
    }

    export interface AtkWarCoreDBData {
        [atkWarCoreId: string]: AtkWarCoreAttr
    }
}

export namespace CHRInfo {
    // 角色基础数值支撑属性
    export interface CHRBasicProps {
        range: number,
        dmg: number,
        spd: number,
        exp_eff: 1,
        pick_range: number
    }

    export interface CHRSlot {
        atk_core: string
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
}

export namespace EMYInfo {
    export interface RealTimeInfo {
        x?: number,
        y?: number,
        dis?: number,
        alive: number
    }
    
    export interface ChooseTargetCallback {
        (isCanBeAttacked?: any, realTimeEnemyInfo?: RealTimeInfo): void
    }
}

export namespace GameCollider {
    export enum TAG {
        CHR_RANGE_ALERT = 10,
        CHR_RANGE_ATTACK = 11
    }

    export enum GROUP {
        DEFAULT = 1<<0,
        CHR = 1<<1,
        CORE_DOMAIN = 1<<2,
        ENEMY = 1<<3,
        CHR_BULLET = 1<<4,
        // CTR_RIM = 1<<5,
        // DROP_ITEM = 1<<6
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

    // 子弹碰撞id
    export enum TAG {
        BASE_BULLET = 500
    }
}

export const SCREEN_WIDTH = 720;
export const SCREEN_HEIGHT = 1280;
// 速度1，实际等于 1*PIXEL_UNIT = 20px/s
export const PIXEL_UNIT = 20;
