export namespace GamePlayEvent {
    export enum COMPASS {
        TOUCH_START = 10,
        TOUCH_END,
        TOUCH_MOVE
    }
}

export namespace CHRProp {
    // 角色基础数值支撑属性
    export interface CHRBasicProps {
        range: number,
        dmg: number,
        spd: number,
        exp_eff: 1,
        pick_range: number
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

export const SCREEN_WIDTH = 720;
export const SCREEN_HEIGHT = 1280;
