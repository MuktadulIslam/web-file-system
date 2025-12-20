import { ViewMode } from "../../types";

export const getItemWidth = (viewMode: ViewMode) => {
    switch (viewMode) {
        case 'extra_large': return 250;
        case 'large': return 200;
        case 'medium': return 150;
        case 'small': return 120;
        default: return 'auto';
    }
};

export const getItemGap = (viewMode: ViewMode) => {
    switch (viewMode) {
        case 'extra_large': return 60;
        case 'large': return 50;
        case 'medium': return 40;
        case 'small': return 30;
        default: return 0;
    }
};

export const getIconSize = (viewMode: ViewMode) => {
    switch (viewMode) {
        case 'extra_large': return 200;
        case 'large': return 64;
        case 'medium': return 48;
        case 'small': return 32;
        default: return 16;
    }
};