import { saveContractConfig } from './saveContractConfig.epic';
import {updateContractConfig} from './updateContractConfig.epic';

export const contractConfigurationEpics = [
    saveContractConfig,
    updateContractConfig,
];
