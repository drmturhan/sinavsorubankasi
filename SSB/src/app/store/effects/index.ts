import { RouterEffects } from './router.effect';
import { AuthEffect } from './auth.effects';
import { UIEffects } from './ui.effects';

export const effects: any[] = [RouterEffects, AuthEffect, UIEffects];

export * from './router.effect';
export * from './auth.effects';
export * from './ui.effects';
