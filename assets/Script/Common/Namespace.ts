import { Vec3 } from "cc"

export enum GAME_NODE {
    FIGHTING, // 进行中
    PASS_FIGHT, // 通过
    CORE_SELECT, // 核心选择
    LEVEL_UP, // 升级中
    PASS_LEVEL_UP, // 升级结束
    PREPARE, // 备战中
    PASS_PREPARE // 备战结束
}

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
        GAME_OVER,
        CORE_SELECT_TIME_INIT,
        CORE_SELECT_DEAD_TIME,
        CORE_SELECT_TIME_REDUCE,
        CORE_SELECT_TIMEOUT,
        CORE_SELECT_FINISH,
        ATK_CORE_CHANGE,
        LEVEL_UP,
        LEVEL_UP_TIME_INIT,
        LEVEL_UP_TIME_REDUCE,
        LEVEL_UP_DEAD_TIME,
        LEVEL_UP_TIMEOUT,
        LEVEL_UP_FINISH,
        DROP_ITEM_RECOVER_FINISH,
        PREPARE_TIME_INIT,
        PREPARE_TIME_REDUCE,
        PREPARE_DEAD_TIME,
        PREPARE_TIMEOUT,
        PREPARE_FINISH,
        ITEM_CHANGE,
        PICK_UP_EXP,
        PICK_UP_TROPHY,
        RECOVER_EXP,
        EXP_CHANGE,
        HP_CHANGE,
        PROP_INIT,
        PROP_UPDATE
    }

    export enum GUI {
        SHOW_GAME_PLAY = 100,
        HIDE_GAME_PLAY,
        SHOW_PROP_UI,
        SHOW_PREVIEW_ITEM_UI,
        // HIDE_PREVIEW_ITEM_UI,
        SHOW_PROP_INTRO_UI,
        UPDATE_TROPHY_ICON,
        SHOW_PREVIEW_WAR_CORE_UI
    }

    export enum STORE {
        LEVEL_UP_LIST_UPDATE = 130,
        STORE_ITEM_LIST_UPDATE,

        LEVEL_UP_REF_COST_CHANGE,
        STORE_REF_COST_CHANGE
    }

    export enum CURRENCY {
        CURRENCY_CHANGE = 140,
        STORAGE_CHANGE
    }
}

export interface SaveDoc {
    wave: number,
    status: number,
    // 和CHRProp.Prop一样
    chr_prop: CHRInfo.PropValMap,
    chr_slot: CHRInfo.CHRSlot
}

export namespace GameConfigInfo {
    export interface EMYSpawnRole {
        enemy_type: string,
        spawn_mode?: string,
        spawn_rate?: number,
        // 总生成数量
        spawn_total: number,
        // 一次生成的数量
        spawn_once_time: number,
        spawn_interval: number,
        // 生成位置模式 random随机, pixed->固定位置, corners->屏幕四个角落",
        spawn_pattern: string,
        spawn_point: Point,
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
        spwaned: boolean,
        hp: number,
        dmg?: number,
        spec_dmg?: number,
        // 是否在逃跑(超时)掉落战利品
        timeout_drop_trophy?: boolean
    }

    export interface EmyPreloadConfig {
        emyId: string,
        count: number
    }

    export interface BulletPreloadConfig {
        bulletId: string,
        count: number
    }

    export interface PreloadConfig {
        alert: number,
        exp: number,
        exp_particle: number,
        trophy: number,
        emy: EmyPreloadConfig[],
        emy_particle: number,
        bullet: BulletPreloadConfig[],
        bullet_particle: number,
        dmg_txt: number
    }

    export enum WAVE_TYPE {
        NORMAL = 1,
        ELITE = 2
    }

    export interface TrophyConfig {
        [enemy_type: string]: ItemInfo.TROPHY_TYPE
    }

    export interface WaveRole {
        wave: number,
        wave_type: WAVE_TYPE,
        duration: number,
        max_emy: number,
        max_emy_elite_fight: number,
        preload: PreloadConfig,
        spawn_roles: EMYSpawnRole[],
        trophy_config?: TrophyConfig
    }

    export interface GameConfig {
        waves: WaveRole[]
    }
}

export namespace WarCoreInfo {
    export interface AtkWarCoreDataAttr {
        // 分裂
        split?: number,
        range: number,
        // 暴击率
        ctl: number,
        // 暴击伤害倍率
        ctl_dmg_rate: number,
        cd: number,
        dmg: number,
        base_dmg: number,
        boost?: BoostConfig
    }

    export interface AtkWarCoreAttr extends AtkWarCoreDataAttr {
        id: string,
        name: string,
        intro: string,
        atk_intro: string,
        icon_ui: string,
        icon_gaming: string,
        bullet: string,
        // 特性列表
        traits?: string[]
    }

    export interface AtkWarCoreMap {
        [atkWarCoreId: string]: AtkWarCoreAttr
    }
    export interface WarCoreDBData {
        atk_war_core_def: AtkWarCoreMap,
        pub_atk_war_core: string[]
    }
}

export namespace CHRInfo {
    export interface Buff {
        type: string,
        prop: string,
        value?: number
    }

    export interface Prop {
        prop: string,
        txt: string,
        val: number,
        // 实际修正后的值
        real_val: number,
        basic_val: number,
        forward_val: boolean,
        percent: boolean,
        intro: string,
        ico?: string
    }
    export interface PropValMap {
        [prop: string]: number
    }
    export interface PropMap {
        [prop: string]: Prop
    }
    export enum GroupKeys {
        major = 'major',
        sub = 'sub',
        unvisiable = 'unvisiable'
    }
    export interface PropGroup {
        major: string[],
        sub: string[],
        unvisiable: string[]
    }
    export interface QualityConfig {
        [prop: string]: number[]
    }
    export interface PropDBData {
        prop_def: PropMap,
        prop_group: PropGroup,
        quality_config: QualityConfig
    }

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
        buff_pos?: boolean
    }

    // export interface BasicProps {
    //     key: string,
    //     label?: string,
    //     group?: number,
    //     value?: number,
    //     // 是否使用百分比计算
    //     percent?: boolean,
    //     // true -> 当value值为正数时，为正向buff；false -> value值为负数时，为正向buff
    //     buff_pos?: boolean
    // }

    export interface upgradeProp {
        prop: string,
        propTxt: string,
        ico: string,
        level: number,   // 品质
        // TODO: 需要根据当前角色等级，调整刷出 低级/中级/高级 升级属性的概率
        value: number
    }
}

export namespace ItemInfo {
    export enum Group {
        NORMAL = "normal",
        LIMIT = "limit",
        SPECIAL = "special"
    }

    export interface Item {
        id: string,
        item_type: string,
        level: number,
        label: string,
        group: Group,
        group_label: string,
        ico: string,
        max: number,
        price: number,
        lock: boolean,
        buff_list: CHRInfo.Buff[]
    }

    export interface ItemMap {
        [itemId: string]: Item
    }

    export interface ItemData {
        item_def: ItemMap,
        item_id_list: string[]
    }

    export interface GroupMap {
        normal: string[],
        limit: string[],
        special: string[]
    }

    // 背包定义
    export interface BackpackItem {
        id: string,
        count: number
    }

    export enum TROPHY_TYPE {
        NONE = 0,
        NORMAL = 1,
        CORE = 2,
        CHEST,
        GREAT_CHEST
    }
}

// export type Point = [number, number];
export interface Point {
    [idx: number]: number
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
        cld: number,
        script?: string,
        type: string,
        move: string,
        attack: string,
        attack_cd: number[],
        broken_point: Point[] | Point[][],
        pic: string,
        spd: number,
        hp: number,
        dmg: number,
        spec_dmg: number,
        timeout_drop_trophy?: boolean
    }
    export interface EMYNormalData {
        [EMYId: string]: EMYProps
    }
    export interface EMYDBData {
        // EMY_def: EMYNormalData
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

    export interface CreateAnEnemyParams {
        enemyType: string,
        // 生成位置模式
        spawnPattern: string,
        // 生成点位
        spawnPoint?: Point,
        // 关系 normal->正常敌对 peace->中立
        relation?: string
    }

    export interface CreateEMYParams extends CreateAnEnemyParams {
        enemyCount: number,
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
        DROP_ITEM_TROPHY = 21,
        DROP_ITEM_CORE = 22,

        PEACE = 96,
        EMY_01 = 100,
        EMY_02 = 101,

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
        DROP_ITEM = 1<<6,
        EMY_BULLET = 1<<7
        // CTR_RIM = 1<<5,
    }
}

export namespace BulletInfo {
    export interface BulletAttr {
        id: string,
        prefab: string,
        type: string,
        script: string,
        damage?: number,
        speed: number,
        // 最大飞行距离
        max_dis: number,
        piercing: number,
        cld: number,
        boost?: BoostConfig
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
        vector: Vec3,
        // 指定enemyId, 是敌人创建的子弹, 伤害计算由GameConfig提供
        enemyId?: string
    }
}

export namespace DamageInfo {
    export interface DamageAttr {
        isCtitical: boolean,
        dmg: number
    }
}

export interface BoostConfig {
    [prop: string]: number
}

export const SCREEN_WIDTH = 1280;
export const SCREEN_HEIGHT = 720;
// 速度1，实际等于 1*PIXEL_UNIT = 20px/s
export const PIXEL_UNIT = 20;

export const FLASH_TIME: number = 0.06;

export const COLOR = {
  NORMAL: "#F5F5F5",
  SUCCESS: "#67C23A",
  DANGER: "#F56C6C"
}
