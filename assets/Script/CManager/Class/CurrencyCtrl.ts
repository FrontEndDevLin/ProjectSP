import { _decorator, Component, Node } from 'cc';
import { BaseCtrl } from './BaseCtrl';
import OBT from '../../OBT';
import { GamePlayEvent } from '../../Common/Namespace';
const { ccclass, property } = _decorator;

/**
 * 金币管理
 */
export class CurrencyCtrl extends BaseCtrl {
    static instance: CurrencyCtrl = null;

    // 金币量
    private _currency: number = 0;
    // 库存量
    private _storage: number = 0;

    constructor() {
        super();
        if (!CurrencyCtrl.instance) {
            CurrencyCtrl.instance = this;
        } else {
            return CurrencyCtrl.instance;
        }
    }

    public getCurrency() {
        return this._currency;
    }
    public getStorage() {
        return this._storage;
    }

    public addCurrency(n: number) {
        if (n === 0) {
            return;
        }
        n = Math.floor(n);
        this._currency += n;

        OBT.instance.eventCenter.emit(GamePlayEvent.CURRENCY.CURRENCY_CHANGE);
    }
    public addStorage(n: number) {
        n = Math.floor(n);
        if (this._storage + n < 0) {
            n = -this._storage
        }
        this._storage += n;
        OBT.instance.eventCenter.emit(GamePlayEvent.CURRENCY.STORAGE_CHANGE);
    }
}


