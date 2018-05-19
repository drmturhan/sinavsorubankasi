import { SorularEffect } from './sorular.effects';
import { BirimlerEffect } from './birimler.effects';
import { GerekliListelerEffect } from './gerekli-listeler.effects';


export const effects = [
    SorularEffect,
    BirimlerEffect,
    GerekliListelerEffect
];

export * from './birimler.effects';
export * from './sorular.effects';
export * from './gerekli-listeler.effects';

