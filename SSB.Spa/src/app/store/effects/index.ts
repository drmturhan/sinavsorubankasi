import { RouterEffects } from './router.effect';
import { AuthEffect } from './auth.effects';
import { UIEffects } from './ui.effects';
import { ArkadaslarEffect } from './arkadaslar.effects';

export const effects: any[] = [RouterEffects, AuthEffect, UIEffects, ArkadaslarEffect];

export * from './router.effect';
export * from './auth.effects';
export * from './ui.effects';
