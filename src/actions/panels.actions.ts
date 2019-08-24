import { Panels, PanelSides } from '../models/state';

export interface IPanelSideData {
    panel: Panels;
    side: PanelSides;
}

export const panelsActions = {
    INIT_PANELS: 'INIT_PANELS',
    initPanels(data: IPanelSideData[]) {
        return {
            type: panelsActions.INIT_PANELS,
            data
        };
    },

    CLOSE_ALL_PANELS: 'CLOSE_ALL_PANELS',
    closeAllPanels() {
        return {
            type: panelsActions.CLOSE_ALL_PANELS
        };
    },

    TOGGLE_PANEL: 'TOGGLE_PANEL',
    togglePanel(panel: Panels) {
        return {
            type: panelsActions.TOGGLE_PANEL,
            data: panel
        };
    },

    CLOSE_PANEL: 'CLOSE_PANEL',
    closePanel(panel: Panels) {
        return {
            type: panelsActions.CLOSE_PANEL,
            data: panel
        };
    },

    OPEN_PANEL: 'OPEN_PANEL',
    openPanel(panel: Panels) {
        return {
            type: panelsActions.OPEN_PANEL,
            data: panel
        };
    },
};
