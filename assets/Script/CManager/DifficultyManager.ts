import { _decorator, JsonAsset, Node } from 'cc';
import OBT_UIManager from '../Manager/OBT_UIManager';
import OBT from '../OBT';
import { copyObject } from '../Common/utils';
import DBManager from './DBManager';
import { DifficultyInfo } from '../Common/Namespace';

export default class DifficultyManager extends OBT_UIManager {
    static instance: DifficultyManager = null;
    public difficultyData: DifficultyInfo.DifficultyDBData;
    public currentDifficulty: DifficultyInfo.Difficulty;

    protected onLoad(): void {
        if (!DifficultyManager.instance) {
            DifficultyManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        this.difficultyData = DBManager.instance.getDBData("DifficultyConfig");
    }

    start() {

    }

    public initDifficultyLevel(difficultyCode: string) {
        this.currentDifficulty = this.difficultyData.difficulty_config[difficultyCode];
    }

    public getEnemyGrowth(emyCode: string): DifficultyInfo.EmyGrowth {
        return this.currentDifficulty.emy_growth[emyCode];
    }

    update(deltaTime: number) {
        
    }
}

