import ItemEvent from "./ItemEvent";

export default class Item_YijingRing extends ItemEvent {
    public onPassWave(): void {
        console.log('敌袭结束 + 3%伤害')
    }
}
