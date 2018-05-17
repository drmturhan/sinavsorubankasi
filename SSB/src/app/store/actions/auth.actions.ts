import { Action } from '@ngrx/store';
import { GuvenlikBilgi, SifreKurtarBilgi, KullaniciBilgi } from '../../models/kullanici';


export const AUTH_LOGIN_READ = '[AUTH] Login Read';
export const AUTH_LOGIN_CHECK = '[AUTH] Login Check';
export const AUTH_LOGIN_REQUIRED = '[AUTH] Login Required';

export const AUTH_LOGIN_CANCELLED = '[AUTH] Login Cancelled';

export const AUTH_LOGIN_RESET_COUNTER = '[AUTH] Login Reset Counter';


export const AUTH_LOGIN_START = '[AUTH] Login Start';
export const AUTH_LOGIN_SUCCESS = '[AUTH] Login Success';
export const AUTH_LOGIN_FAILED = '[AUTH] Login Failed';

export const AUTH_FACEBOOK_LOGIN_START = '[AUTH] Facebook Login Start';
export const AUTH_FACEBOOK_LOGIN_PROGRESS = '[AUTH] Facebook Login Progress';
export const AUTH_FACEBOOK_LOGIN_FAILED = '[AUTH] Facebook Login Failed';

export const AUTH_LOGOUT_START = '[AUTH] Logout Start';
export const AUTH_LOGOUT_SUCCESS = '[AUTH] Logout Success';
export const AUTH_LOGOUT_FAILED = '[AUTH] Logout Failed';

export const AUTH_SIFREKURTAR_REQUIRED = '[AUTH] SifreKurtar Required';
export const AUTH_SIFREKURTAR_CANCELLED = '[AUTH] SifreKurtar Cancelled';
export const AUTH_SIFREKURTAR_START = '[AUTH] SifreKurtar Start';
export const AUTH_SIFREKURTAR_SUCCESS = '[AUTH] SifreKurtar Success';
export const AUTH_SIFREKURTAR_FAILED = '[AUTH] SifreKurtar Failed';

export const AUTH_KULLANICI_BILGI_DEGISTI = '[AUTH] Kullanici Bilgi Degisti';


export class LoginRead implements Action {
    readonly type = AUTH_LOGIN_READ;
}

export class LoginCheck implements Action {
    readonly type = AUTH_LOGIN_CHECK;
}
export class LoginRequired implements Action {
    readonly type = AUTH_LOGIN_REQUIRED;
}



export class LoginCancelled implements Action {
    readonly type = AUTH_LOGIN_CANCELLED;
}

export class LoginResetCounter implements Action {
    readonly type = AUTH_LOGIN_RESET_COUNTER;
}


export class StartLogin implements Action {
    readonly type = AUTH_LOGIN_START;
    constructor(public payload: any) {
    }
}

export class LoginSuccess implements Action {
    readonly type = AUTH_LOGIN_SUCCESS;
    constructor(public payload: GuvenlikBilgi) {
    }
}
export class LoginFailed implements Action {
    readonly type = AUTH_LOGIN_FAILED;
    constructor(public payload: string) {
    }
}
export class LogoutStart implements Action {
    readonly type = AUTH_LOGOUT_START;
}
export class LogoutSuccess implements Action {
    readonly type = AUTH_LOGOUT_SUCCESS;
    constructor() {
    }
}
export class FacebookLoginStart implements Action {
    readonly type = AUTH_FACEBOOK_LOGIN_START;
    constructor(public payload: any) {
    }
}

export class FacebookLoginProgress implements Action {
    readonly type = AUTH_FACEBOOK_LOGIN_PROGRESS;
}
export class FacebookLoginFailed implements Action {
    readonly type = AUTH_FACEBOOK_LOGIN_FAILED;
    constructor() {
    }
}
export class LogoutFailed implements Action {
    readonly type = AUTH_LOGOUT_FAILED;
    constructor() {
    }
}


export class SifreKurtarRequired implements Action {
    readonly type = AUTH_SIFREKURTAR_REQUIRED;
}
export class SifreKurtarCancelled implements Action {
    readonly type = AUTH_SIFREKURTAR_CANCELLED;
}
export class SifreKurtarStart implements Action {
    readonly type = AUTH_SIFREKURTAR_START;
    constructor(public payload: SifreKurtarBilgi) { }
}
export class SifreKurtarSuccess implements Action {
    readonly type = AUTH_SIFREKURTAR_SUCCESS;
    constructor() {
    }
}

export class SifreKurtarFailed implements Action {
    readonly type = AUTH_SIFREKURTAR_FAILED;
    constructor() {
    }
}

export class KullaniciBilgiDegisti implements Action {
    readonly type = AUTH_KULLANICI_BILGI_DEGISTI;
    constructor(public payload: KullaniciBilgi) { }
}

export type AUTHActionsTypes = LoginRead | LoginCheck | LoginResetCounter | LoginRequired | LoginCancelled
    | StartLogin | FacebookLoginStart | FacebookLoginProgress | FacebookLoginFailed | LoginSuccess | LoginFailed
    | LogoutStart | LogoutSuccess | LogoutFailed | SifreKurtarRequired | SifreKurtarCancelled | SifreKurtarStart | SifreKurtarSuccess | SifreKurtarFailed
    | KullaniciBilgiDegisti ;
