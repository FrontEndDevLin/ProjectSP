import { Component } from "cc";
import OBT_EventBusManager from "./Manager/OBT_EventBusManager";
import OBT_ResourceManager from "./Manager/OBT_ResourceManager";

export default abstract class OBT_Module extends Component {
    constructor(protected eventBus: OBT_EventBusManager, protected resourceManager: OBT_ResourceManager) {
        super();
    }

    abstract enter(): void;
    abstract exit(): void;
}
