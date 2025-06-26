import { AssetManager, EventTouch } from "cc";

export interface ResPkg {
    abName: string,
    assetType: any,
    urls: string[]
}
export interface AbDict {
    [assetBundleName: string]: AssetManager.Bundle
}
export interface ProgressCallback {
    (total: number, current: number): void
}
export interface AbProgressCallback {
    (total: number, current: number, abName: string): void
}
export interface Callback {
    (error?: any, data?: any): void
}
export interface EventTouchCallback {
    (event: EventTouch): void
}