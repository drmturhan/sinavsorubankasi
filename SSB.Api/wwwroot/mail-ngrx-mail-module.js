(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["mail-ngrx-mail-module"],{

/***/ "./src/app/main/content/apps/mail-ngrx/dialogs/compose/compose.component.html":
/*!************************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/dialogs/compose/compose.component.html ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"dialog-content-wrapper\">\r\n    <mat-toolbar class=\"mat-accent m-0\">\r\n        <mat-toolbar-row fxFlex fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\r\n            <span class=\"title dialog-title\">New Message</span>\r\n            <button mat-icon-button (click)=\"dialogRef.close()\" aria-label=\"Close dialog\">\r\n                <mat-icon>close</mat-icon>\r\n            </button>\r\n        </mat-toolbar-row>\r\n    </mat-toolbar>\r\n\r\n    <div mat-dialog-content class=\"p-24 m-0\" fusePerfectScrollbar>\r\n\r\n        <form name=\"composeForm\" [formGroup]=\"composeForm\" class=\"compose-form\" fxLayout=\"column\" fxFlex>\r\n\r\n            <mat-form-field>\r\n                <input matInput name=\"from\"\r\n                       placeholder=\"From\"\r\n                       formControlName=\"from\"\r\n                       type=\"email\">\r\n            </mat-form-field>\r\n\r\n            <mat-form-field>\r\n                <input matInput name=\"to\"\r\n                       placeholder=\"To\"\r\n                       formControlName=\"to\"\r\n                       type=\"email\" required>\r\n            </mat-form-field>\r\n\r\n            <mat-form-field>\r\n                <input matInput\r\n                       name=\"cc\"\r\n                       placeholder=\"Cc\"\r\n                       formControlName=\"cc\"\r\n                       type=\"email\">\r\n            </mat-form-field>\r\n\r\n            <mat-form-field>\r\n                <input matInput\r\n                       name=\"bcc\"\r\n                       placeholder=\"Bcc\"\r\n                       formControlName=\"bcc\"\r\n                       type=\"email\">\r\n            </mat-form-field>\r\n\r\n            <mat-form-field>\r\n                <input matInput name=\"subject\"\r\n                       placeholder=\"Subject\"\r\n                       formControlName=\"subject\">\r\n            </mat-form-field>\r\n\r\n            <mat-form-field>\r\n            <textarea matInput name=\"message\"\r\n                      placeholder=\"Message\"\r\n                      formControlName=\"message\"\r\n                      rows=\"6\">\r\n            </textarea>\r\n            </mat-form-field>\r\n\r\n            <div class=\"attachment-list\">\r\n\r\n                <div class=\"attachment\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\r\n                    <div>\r\n                        <span class=\"filename\">attachment-2.doc</span>\r\n                        <span class=\"size\">(12 Kb)</span>\r\n                    </div>\r\n\r\n                    <button mat-icon-button aria-label=\"Delete attachment\">\r\n                        <mat-icon class=\"s-16\">close</mat-icon>\r\n                    </button>\r\n                </div>\r\n\r\n                <div class=\"attachment\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\r\n                    <div>\r\n                        <span class=\"filename\">attachment-1.jpg</span>\r\n                        <span class=\"size\">(350 Kb)</span>\r\n                    </div>\r\n\r\n                    <button mat-icon-button aria-label=\"Delete attachment\">\r\n                        <mat-icon class=\"s-16\">close</mat-icon>\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </form>\r\n    </div>\r\n\r\n    <div mat-dialog-actions class=\"m-0 p-16\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\r\n        <div>\r\n            <button mat-raised-button\r\n                    (click)=\"dialogRef.close(['send',composeForm])\"\r\n                    class=\"save-button mat-accent\"\r\n                    [disabled]=\"composeForm.invalid\"\r\n                    aria-label=\"SAVE\">\r\n                SEND\r\n            </button>\r\n\r\n            <button mat-icon-button matTooltip=\"Attach a file\">\r\n                <mat-icon>attach_file</mat-icon>\r\n            </button>\r\n        </div>\r\n\r\n        <button mat-icon-button (click)=\"dialogRef.close(['delete',composeForm])\" aria-label=\"Delete\"\r\n                matTooltip=\"Delete\">\r\n            <mat-icon>delete</mat-icon>\r\n        </button>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/dialogs/compose/compose.component.scss":
/*!************************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/dialogs/compose/compose.component.scss ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".mail-compose-dialog .mat-dialog-container {\n  padding: 0;\n  width: 720px; }\n  .mail-compose-dialog .mat-dialog-container .compose-form .mat-form-field {\n    width: 100%; }\n  .mail-compose-dialog .mat-dialog-container .compose-form .attachment-list {\n    font-size: 13px;\n    padding-top: 16px; }\n  .mail-compose-dialog .mat-dialog-container .compose-form .attachment-list .attachment {\n      background-color: rgba(0, 0, 0, 0.08);\n      border: 1px solid rgba(0, 0, 0, 0.16);\n      padding-left: 16px;\n      margin-top: 8px;\n      border-radius: 2px; }\n  .mail-compose-dialog .mat-dialog-container .compose-form .attachment-list .attachment .filename {\n        font-weight: 500; }\n  .mail-compose-dialog .mat-dialog-container .compose-form .attachment-list .attachment:last-child {\n        margin-bottom: 0; }\n  .mail-compose-dialog .dialog-content-wrapper {\n  max-height: 85vh;\n  display: flex;\n  flex-direction: column; }\n"

/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/dialogs/compose/compose.component.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/dialogs/compose/compose.component.ts ***!
  \**********************************************************************************/
/*! exports provided: FuseMailNgrxComposeDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FuseMailNgrxComposeDialogComponent", function() { return FuseMailNgrxComposeDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};



var FuseMailNgrxComposeDialogComponent = /** @class */ (function () {
    function FuseMailNgrxComposeDialogComponent(dialogRef, data, formBuilder) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.formBuilder = formBuilder;
        this.composeForm = this.createComposeForm();
    }
    FuseMailNgrxComposeDialogComponent.prototype.createComposeForm = function () {
        return this.formBuilder.group({
            from: {
                value: ['johndoe@creapond.com'],
                disabled: [true]
            },
            to: [''],
            cc: [''],
            bcc: [''],
            subject: [''],
            message: ['']
        });
    };
    FuseMailNgrxComposeDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-mail-compose',
            template: __webpack_require__(/*! ./compose.component.html */ "./src/app/main/content/apps/mail-ngrx/dialogs/compose/compose.component.html"),
            styles: [__webpack_require__(/*! ./compose.component.scss */ "./src/app/main/content/apps/mail-ngrx/dialogs/compose/compose.component.scss")],
            encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewEncapsulation"].None
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_2__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialogRef"], Object, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]])
    ], FuseMailNgrxComposeDialogComponent);
    return FuseMailNgrxComposeDialogComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/i18n/en.ts":
/*!********************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/i18n/en.ts ***!
  \********************************************************/
/*! exports provided: locale */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "locale", function() { return locale; });
var locale = {
    lang: 'en',
    data: {
        'MAIL': {
            'COMPOSE': 'COMPOSE',
            'FOLDERS': 'FOLDERS',
            'FILTERS': 'FILTERS',
            'LABELS': 'LABELS',
            'NO_MESSAGES': 'There are no messages!',
            'SELECT_A_MESSAGE_TO_READ': 'Select a message to read',
            'SEARCH_PLACEHOLDER': 'Search for an e-mail or contact'
        }
    }
};


/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/i18n/tr.ts":
/*!********************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/i18n/tr.ts ***!
  \********************************************************/
/*! exports provided: locale */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "locale", function() { return locale; });
var locale = {
    lang: 'tr',
    data: {
        'MAIL': {
            'COMPOSE': 'YENİ E-POSTA',
            'FOLDERS': 'KLASÖRLER',
            'FILTERS': 'FİLTRELER',
            'LABELS': 'ETİKETLER',
            'NO_MESSAGES': 'Mesajiniz bulunmamakta!',
            'SELECT_A_MESSAGE_TO_READ': 'Okumak için bir mesaj seçin',
            'SEARCH_PLACEHOLDER': 'E-mail yada bir kişi arayın'
        }
    }
};


/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/mail-details/mail-details.component.html":
/*!**************************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/mail-details/mail-details.component.html ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"!mail\" fxLayout=\"column\" fxLayoutAlign=\"center center\" fxFlex>\r\n    <mat-icon class=\"s-128 mb-16 select-message-icon hint-text\">\r\n        email\r\n    </mat-icon>\r\n    <span class=\"select-message-text hint-text\">\r\n        <span>{{ 'MAIL.SELECT_A_MESSAGE_TO_READ' | translate }}</span>\r\n    </span>\r\n</div>\r\n\r\n<div *ngIf=\"mail\">\r\n\r\n    <div class=\"mail-header\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\r\n\r\n        <div>\r\n            <div class=\"subject\" flex>{{mail.subject}}</div>\r\n\r\n            <div class=\"labels\" fxLayout=\"row wrap\">\r\n                <div class=\"label\" *ngFor=\"let labelId of mail.labels\"\r\n                     fxLayout=\"row\" fxLayoutAlign=\"start center\">\r\n                    <div class=\"label-color\" [ngStyle]=\"{'background-color': (labels$ | async) | getById:labelId:'color'}\"></div>\r\n                    <div class=\"label-title\">{{(labels$ | async) | getById:labelId:'title'}}</div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"actions\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\r\n            <button mat-icon-button (click)=\"toggleStar($event)\" aria-label=\"Toggle star\">\r\n                <mat-icon class=\"amber-fg\" *ngIf=\"mail.starred\">star</mat-icon>\r\n                <mat-icon class=\"secondary-text\" *ngIf=\"!mail.starred\">star_outline</mat-icon>\r\n            </button>\r\n\r\n            <button mat-icon-button (click)=\"toggleImportant($event)\" aria-label=\"Toggle important\">\r\n                <mat-icon class=\"red-fg\" *ngIf=\"mail.important\">label</mat-icon>\r\n                <mat-icon class=\"secondary-text\" *ngIf=\"!mail.important\">label_outline</mat-icon>\r\n            </button>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"mail-content\">\r\n\r\n        <div class=\"info\" fxLayout=\"row\" fxLayoutAlign=\"space-between start\">\r\n\r\n            <div fxFlex fxLayout=\"column\" fxLayoutAlign=\"start start\">\r\n\r\n                <div fxLayout=\"row\" fxLayoutAlign=\"start start\">\r\n\r\n                    <div>\r\n                        <img *ngIf=\"mail.from.avatar\" alt=\"{{mail.from.name}}\"\r\n                             src=\"{{mail.from.avatar}}\" class=\"avatar\"/>\r\n\r\n                        <div *ngIf=\"!mail.from.avatar\" class=\"avatar\" ms-random-class=\"vm.colors\">\r\n                            {{mail.from.name[0]}}\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div fxLayout=\"column\" fxLayoutAlign=\"start start\">\r\n\r\n                        <div class=\"name\">\r\n                            {{mail.from.name}}\r\n                        </div>\r\n\r\n                        <div class=\"to\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\r\n                            <div class=\"to-text\">to</div>\r\n                            <div>{{mail.to[0].name}}</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n\r\n                <a class=\"toggle-details\" (click)=\"showDetails = !showDetails\">\r\n                    <span *ngIf=\"!showDetails\">Show Details</span>\r\n                    <span *ngIf=\"showDetails\">Hide Details</span>\r\n                </a>\r\n\r\n                <div *ngIf=\"showDetails\" class=\"details\" fxLayout=\"row\" fxLayoutAlign=\"start start\">\r\n\r\n                    <div fxLayout=\"column\">\r\n                        <span class=\"title\">From:</span>\r\n                        <span class=\"title\">To:</span>\r\n                        <span class=\"title\">Date:</span>\r\n                    </div>\r\n\r\n                    <div fxLayout=\"column\">\r\n                        <span class=\"detail\">{{mail.from.email}}</span>\r\n                        <span class=\"detail\">{{mail.to[0].email}}</span>\r\n                        <span class=\"detail\">{{mail.time}}</span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <button mat-icon-button [matMenuTriggerFor]=\"moreMenu\" aria-label=\"More\" (click)=\"$event.stopPropagation()\">\r\n                <mat-icon>more_vert</mat-icon>\r\n            </button>\r\n\r\n            <mat-menu #moreMenu=\"matMenu\">\r\n                <button mat-menu-item aria-label=\"Reply\">\r\n                    <mat-icon>reply</mat-icon>\r\n                    <span>Reply</span>\r\n                </button>\r\n\r\n                <button mat-menu-item aria-label=\"Forward\">\r\n                    <mat-icon>forward</mat-icon>\r\n                    <span>Forward</span>\r\n                </button>\r\n\r\n                <button mat-menu-item aria-label=\"Print\">\r\n                    <mat-icon>print</mat-icon>\r\n                    <span>Print</span>\r\n                </button>\r\n            </mat-menu>\r\n        </div>\r\n\r\n        <div [innerHTML]=\"mail.message\"></div>\r\n\r\n    </div>\r\n\r\n    <div *ngIf=\"mail.attachments\" class=\"mail-attachments\">\r\n\r\n        <div class=\"title\">\r\n            <span>Attachments</span>\r\n            ({{mail.attachments.length}})\r\n        </div>\r\n\r\n        <div class=\"attachment-list\" fxLayout=\"row wrap\">\r\n\r\n            <div class=\"attachment\" fxLayout=\"column\"\r\n                 *ngFor=\"let attachment of mail.attachments\">\r\n\r\n                <img class=\"preview\" src=\"{{attachment.preview}}\">\r\n\r\n                <div fxLayout=\"column\">\r\n                    <a href=\"#\" onclick=\"event.preventDefault()\">View</a>\r\n                    <a href=\"#\" onclick=\"event.preventDefault()\">Download</a>\r\n                    <div class=\"size\">({{attachment.size}})</div>\r\n                </div>\r\n\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/mail-details/mail-details.component.scss":
/*!**************************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/mail-details/mail-details.component.scss ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n:host {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  overflow-y: auto;\n  padding: 24px; }\n:host .select-message-text {\n    font-size: 24px;\n    font-weight: 300; }\n:host .mail-header {\n    padding-bottom: 16px;\n    border-bottom: 1px solid rgba(0, 0, 0, 0.12); }\n:host .mail-header .actions {\n      min-width: 88px; }\n:host .mail-header .subject {\n      font-size: 17px;\n      font-weight: 500; }\n:host .mail-header .label {\n      font-size: 11px;\n      border-radius: 2px;\n      margin: 4px 4px 4px 0;\n      padding: 3px 8px;\n      background-color: rgba(0, 0, 0, 0.08); }\n:host .mail-header .label .label-color {\n        width: 8px;\n        height: 8px;\n        margin-right: 8px;\n        border-radius: 50%; }\n:host .mail-content {\n    padding: 24px 0; }\n:host .mail-content .to {\n      color: rgba(0, 0, 0, 0.54); }\n:host .mail-content .to .to-text {\n        margin-right: 4px;\n        text-transform: lowercase; }\n:host .mail-content .info {\n      padding-bottom: 16px; }\n:host .mail-content .info .avatar {\n        margin-right: 16px;\n        background-color: #039be5; }\n:host .mail-content .info .name {\n        margin-right: 8px;\n        font-weight: 500; }\n:host .mail-content .info .toggle-details {\n        -webkit-user-select: none;\n           -moz-user-select: none;\n            -ms-user-select: none;\n                user-select: none;\n        text-decoration: underline;\n        padding-top: 16px;\n        cursor: pointer;\n        font-weight: 500; }\n:host .mail-content .info .details {\n        padding-top: 8px; }\n:host .mail-content .info .details .title {\n          font-weight: 500;\n          margin-right: 6px; }\n:host .mail-content .info .details .detail {\n          color: rgba(0, 0, 0, 0.54); }\n:host .mail-attachments {\n    padding: 24px 0;\n    border-top: 1px solid rgba(0, 0, 0, 0.12); }\n:host .mail-attachments .title {\n      margin-bottom: 16px;\n      font-weight: 500; }\n:host .mail-attachments .attachment .preview {\n      width: 100px;\n      margin: 0 16px 8px 0; }\n:host .mail-attachments .attachment .link {\n      margin-bottom: 2px; }\n:host .mail-attachments .attachment .size {\n      font-size: 11px; }\n"

/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/mail-details/mail-details.component.ts":
/*!************************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/mail-details/mail-details.component.ts ***!
  \************************************************************************************/
/*! exports provided: FuseMailNgrxDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FuseMailNgrxDetailsComponent", function() { return FuseMailNgrxDetailsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _mail_model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../mail.model */ "./src/app/main/content/apps/mail-ngrx/mail.model.ts");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../store */ "./src/app/main/content/apps/mail-ngrx/store/index.ts");
/* harmony import */ var _mail_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../mail.service */ "./src/app/main/content/apps/mail-ngrx/mail.service.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var FuseMailNgrxDetailsComponent = /** @class */ (function () {
    function FuseMailNgrxDetailsComponent(mailService, store) {
        this.mailService = mailService;
        this.store = store;
        this.showDetails = false;
        this.labels$ = this.store.select(_store__WEBPACK_IMPORTED_MODULE_3__["getLabelsArr"]);
    }
    FuseMailNgrxDetailsComponent.prototype.ngOnChanges = function () {
        this.updateModel(this.mailInput);
        this.markAsRead();
    };
    FuseMailNgrxDetailsComponent.prototype.markAsRead = function () {
        if (this.mail && !this.mail.read) {
            this.mail.markRead();
            this.updateMail();
        }
    };
    FuseMailNgrxDetailsComponent.prototype.toggleStar = function (event) {
        event.stopPropagation();
        this.mail.toggleStar();
        this.updateMail();
    };
    FuseMailNgrxDetailsComponent.prototype.toggleImportant = function (event) {
        event.stopPropagation();
        this.mail.toggleImportant();
        this.updateMail();
    };
    FuseMailNgrxDetailsComponent.prototype.updateModel = function (data) {
        this.mail = !data ? null : new _mail_model__WEBPACK_IMPORTED_MODULE_2__["Mail"](__assign({}, data));
    };
    FuseMailNgrxDetailsComponent.prototype.updateMail = function () {
        this.store.dispatch(new _store__WEBPACK_IMPORTED_MODULE_3__["UpdateMail"](this.mail));
        this.updateModel(this.mail);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])('mail'),
        __metadata("design:type", _mail_model__WEBPACK_IMPORTED_MODULE_2__["Mail"])
    ], FuseMailNgrxDetailsComponent.prototype, "mailInput", void 0);
    FuseMailNgrxDetailsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-mail-details',
            template: __webpack_require__(/*! ./mail-details.component.html */ "./src/app/main/content/apps/mail-ngrx/mail-details/mail-details.component.html"),
            styles: [__webpack_require__(/*! ./mail-details.component.scss */ "./src/app/main/content/apps/mail-ngrx/mail-details/mail-details.component.scss")],
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [_mail_service__WEBPACK_IMPORTED_MODULE_4__["MailNgrxService"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"]])
    ], FuseMailNgrxDetailsComponent);
    return FuseMailNgrxDetailsComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/mail-list/mail-list-item/mail-list-item.component.html":
/*!****************************************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/mail-list/mail-list-item/mail-list-item.component.html ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div fxLayout=\"row\" fxLayoutAlign=\"start center\">\r\n\r\n    <mat-checkbox [checked]=\"selected\" (change)=\"onSelectedChange()\"\r\n                  (click)=\"$event.stopPropagation();\">\r\n    </mat-checkbox>\r\n\r\n    <div class=\"info\" fxFlex FlexLayout=\"column\">\r\n\r\n        <div class=\"row-1\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\r\n\r\n            <div class=\"name\" fxLayout=\"row\" fxLayoutAlign=\"start center\" fxFlex>\r\n                <img class=\"avatar\" *ngIf=\"mail.from?.avatar\" alt=\"{{mail.from?.name}}\" src=\"{{mail.from?.avatar}}\"/>\r\n                <div class=\"avatar\" *ngIf=\"!mail.from?.avatar\">{{mail.from?.name[0]}}</div>\r\n                <span class=\"text-truncate\" *ngIf=\"mail?.from\">{{mail.from?.name}}</span>\r\n                <mat-icon *ngIf=\"mail.hasAttachments\">attachment</mat-icon>\r\n            </div>\r\n\r\n            <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\r\n                <div class=\"time\">{{mail.time}}</div>\r\n            </div>\r\n\r\n        </div>\r\n\r\n        <div class=\"row-2\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\r\n\r\n            <div fxLayout=\"column\" fxLayoutAlign=\"start start\">\r\n\r\n                <div class=\"subject text-truncate\">\r\n                    {{mail.subject}}\r\n                </div>\r\n\r\n                <div class=\"message text-truncate\" *ngIf=\"mail?.message\">\r\n                    {{mail.message | htmlToPlaintext | slice:0:180}}{{mail.message.length > 180 ? '...' : ''}}\r\n                </div>\r\n\r\n                <div class=\"labels\" fxLayout=\"row wrap\" fxHide fxShow.gt-sm>\r\n                    <div class=\"label\" *ngFor=\"let labelId of mail.labels\"\r\n                         fxLayout=\"row\" fxLayoutAlign=\"start center\">\r\n                        <div class=\"label-color\"\r\n                             [ngStyle]=\"{'background-color': (labels$ | async) | getById:labelId:'color'}\"></div>\r\n                        <div class=\"label-title\">{{(labels$ | async) | getById:labelId:'title'}}</div>\r\n                    </div>\r\n                </div>\r\n\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/mail-list/mail-list-item/mail-list-item.component.scss":
/*!****************************************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/mail-list/mail-list-item/mail-list-item.component.scss ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n:host {\n  flex-shrink: 0;\n  position: relative;\n  padding: 16px 24px;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.12);\n  cursor: pointer;\n  background: #FAFAFA; }\n:host.unread {\n    background: #FFFFFF; }\n:host.unread .info .name {\n      font-weight: 700; }\n:host.unread .info .row-2 .subject {\n      font-weight: 700; }\n:host.unread .info .row-2 .labels {\n      background: #FFFFFF; }\n:host.selected {\n    background: #FFF8E1; }\n:host.selected .info .row-2 .labels {\n      background: #FFF8E1; }\n:host.current-mail {\n    background: #E3F2FD; }\n:host.current-mail .info .row-2 .labels {\n      background: #E3F2FD; }\n:host .info {\n    overflow: hidden;\n    width: 0;\n    margin-left: 16px;\n    position: relative; }\n:host .info .row-1 {\n      margin-bottom: 8px; }\n:host .info .row-1 .name {\n        font-size: 15px;\n        font-weight: 500; }\n:host .info .row-1 .name .avatar {\n          min-width: 32px;\n          width: 32px;\n          height: 32px;\n          line-height: 32px;\n          background-color: #039be5; }\n:host .info .row-1 .actions {\n        margin-left: 4px; }\n:host .info .row-1 .actions .mat-icon-button {\n          width: 32px;\n          height: 32px;\n          line-height: 1; }\n:host .info .row-2 .subject,\n    :host .info .row-2 .message {\n      width: 100%; }\n:host .info .row-2 .message {\n      position: relative;\n      color: rgba(0, 0, 0, 0.54); }\n:host .info .row-2 .labels {\n      position: absolute;\n      background: #FFFFFF;\n      bottom: 0;\n      right: 0;\n      padding-left: 6px; }\n:host .info .row-2 .labels .label {\n        font-size: 11px;\n        border-radius: 2px;\n        margin: 0 4px 0 0;\n        padding: 3px 8px;\n        background-color: rgba(0, 0, 0, 0.08); }\n:host .info .row-2 .labels .label .label-color {\n          width: 8px;\n          height: 8px;\n          margin-right: 8px;\n          border-radius: 50%; }\n"

/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/mail-list/mail-list-item/mail-list-item.component.ts":
/*!**************************************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/mail-list/mail-list-item/mail-list-item.component.ts ***!
  \**************************************************************************************************/
/*! exports provided: FuseMailNgrxListItemComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FuseMailNgrxListItemComponent", function() { return FuseMailNgrxListItemComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _mail_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../mail.service */ "./src/app/main/content/apps/mail-ngrx/mail.service.ts");
/* harmony import */ var _mail_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../mail.model */ "./src/app/main/content/apps/mail-ngrx/mail.model.ts");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../store */ "./src/app/main/content/apps/mail-ngrx/store/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var FuseMailNgrxListItemComponent = /** @class */ (function () {
    function FuseMailNgrxListItemComponent(mailService, store, cd) {
        this.mailService = mailService;
        this.store = store;
        this.cd = cd;
        this.labels$ = this.store.select(_store__WEBPACK_IMPORTED_MODULE_4__["getLabelsArr"]);
        this.selectedMailIds$ = this.store.select(_store__WEBPACK_IMPORTED_MODULE_4__["getSelectedMailIds"]);
        this.selected = false;
    }
    FuseMailNgrxListItemComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Set the initial values
        this.mail = new _mail_model__WEBPACK_IMPORTED_MODULE_3__["Mail"](this.mail);
        this.unread = !this.mail.read;
        this.selectedMailIds$.subscribe(function (selectedMailIds) {
            _this.selected = selectedMailIds.length > 0 && selectedMailIds.find(function (id) { return id === _this.mail.id; }) !== undefined;
            _this.refresh();
        });
    };
    FuseMailNgrxListItemComponent.prototype.refresh = function () {
        this.cd.markForCheck();
    };
    FuseMailNgrxListItemComponent.prototype.onSelectedChange = function () {
        this.store.dispatch(new _store__WEBPACK_IMPORTED_MODULE_4__["ToggleInSelectedMails"](this.mail.id));
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _mail_model__WEBPACK_IMPORTED_MODULE_3__["Mail"])
    ], FuseMailNgrxListItemComponent.prototype, "mail", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostBinding"])('class.selected'),
        __metadata("design:type", Boolean)
    ], FuseMailNgrxListItemComponent.prototype, "selected", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostBinding"])('class.unread'),
        __metadata("design:type", Boolean)
    ], FuseMailNgrxListItemComponent.prototype, "unread", void 0);
    FuseMailNgrxListItemComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-mail-list-item',
            template: __webpack_require__(/*! ./mail-list-item.component.html */ "./src/app/main/content/apps/mail-ngrx/mail-list/mail-list-item/mail-list-item.component.html"),
            styles: [__webpack_require__(/*! ./mail-list-item.component.scss */ "./src/app/main/content/apps/mail-ngrx/mail-list/mail-list-item/mail-list-item.component.scss")],
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [_mail_service__WEBPACK_IMPORTED_MODULE_2__["MailNgrxService"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]])
    ], FuseMailNgrxListItemComponent);
    return FuseMailNgrxListItemComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/mail-list/mail-list.component.html":
/*!********************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/mail-list/mail-list.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"mails.length === 0\" fxLayout=\"column\" fxLayoutAlign=\"center center\" fxFlexFill>\r\n    <span class=\"no-messages-text hint-text\">{{ 'MAIL.NO_MESSAGES' | translate }}</span>\r\n</div>\r\n\r\n<div class=\"mail-list\">\r\n    <fuse-mail-list-item matRipple *ngFor=\"let mail of mails\" [mail]=\"mail\" (click)=\"readMail(mail.id)\"\r\n                         [ngClass]=\"{'current-mail':mail?.id == currentMail?.id}\">\r\n    </fuse-mail-list-item>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/mail-list/mail-list.component.scss":
/*!********************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/mail-list/mail-list.component.scss ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  overflow-y: auto;\n  padding: 0;\n  border-right: 1px solid rgba(0, 0, 0, 0.12); }\n  :host .no-messages-text {\n    font-size: 24px;\n    font-weight: 300; }\n  :host .mail-list {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    flex: 1; }\n"

/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/mail-list/mail-list.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/mail-list/mail-list.component.ts ***!
  \******************************************************************************/
/*! exports provided: FuseMailNgrxListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FuseMailNgrxListComponent", function() { return FuseMailNgrxListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _mail_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../mail.service */ "./src/app/main/content/apps/mail-ngrx/mail.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var FuseMailNgrxListComponent = /** @class */ (function () {
    function FuseMailNgrxListComponent(route, mailService, router) {
        this.route = route;
        this.mailService = mailService;
        this.router = router;
    }
    /**
     * Read mail
     * @param mailId
     */
    FuseMailNgrxListComponent.prototype.readMail = function (mailId) {
        var labelHandle = this.route.snapshot.params.labelHandle, filterHandle = this.route.snapshot.params.filterHandle, folderHandle = this.route.snapshot.params.folderHandle;
        if (labelHandle) {
            this.router.navigate(['apps/mail-ngrx/label/' + labelHandle + '/' + mailId]);
        }
        else if (filterHandle) {
            this.router.navigate(['apps/mail-ngrx/filter/' + filterHandle + '/' + mailId]);
        }
        else {
            this.router.navigate(['apps/mail-ngrx/' + folderHandle + '/' + mailId]);
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], FuseMailNgrxListComponent.prototype, "mails", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], FuseMailNgrxListComponent.prototype, "currentMail", void 0);
    FuseMailNgrxListComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-mail-list',
            template: __webpack_require__(/*! ./mail-list.component.html */ "./src/app/main/content/apps/mail-ngrx/mail-list/mail-list.component.html"),
            styles: [__webpack_require__(/*! ./mail-list.component.scss */ "./src/app/main/content/apps/mail-ngrx/mail-list/mail-list.component.scss")],
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _mail_service__WEBPACK_IMPORTED_MODULE_2__["MailNgrxService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], FuseMailNgrxListComponent);
    return FuseMailNgrxListComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/mail.component.html":
/*!*****************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/mail.component.html ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"mail\" class=\"page-layout carded left-sidenav\" fusePerfectScrollbar>\r\n\r\n    <!-- TOP BACKGROUND -->\r\n    <div class=\"top-bg mat-accent-bg\"></div>\r\n    <!-- / TOP BACKGROUND -->\r\n\r\n    <mat-sidenav-container>\r\n\r\n        <!-- SIDENAV -->\r\n        <mat-sidenav class=\"sidenav mat-sidenav-opened\" position=\"start\" mode=\"side\" opened=\"true\"\r\n                     fuseMatSidenavHelper=\"carded-left-sidenav\" mat-is-locked-open=\"gt-md\">\r\n            <fuse-mail-main-sidenav></fuse-mail-main-sidenav>\r\n        </mat-sidenav>\r\n        <!-- / SIDENAV -->\r\n\r\n        <!-- CENTER -->\r\n        <div class=\"center\">\r\n\r\n            <!-- CONTENT HEADER -->\r\n            <div class=\"header\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\r\n\r\n                <div class=\"search-wrapper\" fxFlex fxLayout=\"row\" fxLayoutAlign=\"start center\">\r\n\r\n                    <button mat-icon-button class=\"sidenav-toggle\"\r\n                            fuseMatSidenavToggler=\"carded-left-sidenav\"\r\n                            fxHide.gt-md aria-label=\"Toggle Sidenav\">\r\n                        <mat-icon>menu</mat-icon>\r\n                    </button>\r\n\r\n                    <div class=\"search mat-white-bg\" flex fxLayout=\"row\" fxLayoutAlign=\"start center\">\r\n                        <mat-icon>search</mat-icon>\r\n                        <input [formControl]=\"searchInput\" [placeholder]=\"'MAIL.SEARCH_PLACEHOLDER' | translate\" fxFlex>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <!-- / CONTENT HEADER -->\r\n\r\n            <!-- CONTENT CARD -->\r\n            <div class=\"content-card mat-white-bg\" [ngClass]=\"{'current-mail-selected':currentMail$ | async}\">\r\n\r\n                <!-- CONTENT TOOLBAR -->\r\n                <div class=\"toolbar px-24 py-8\">\r\n\r\n                    <div class=\"mail-selection\" fxFlex=\"row\" fxLayoutAlign=\"start center\">\r\n\r\n                        <mat-checkbox (click)=\"toggleSelectAll($event)\"\r\n                                      [checked]=\"hasSelectedMails\"\r\n                                      [indeterminate]=\"isIndeterminate\">\r\n                        </mat-checkbox>\r\n\r\n                        <button mat-icon-button [matMenuTriggerFor]=\"selectMenu\">\r\n                            <mat-icon>arrow_drop_down</mat-icon>\r\n                        </button>\r\n                        <mat-menu #selectMenu=\"matMenu\">\r\n                            <button mat-menu-item (click)=\"selectAllMails()\">All</button>\r\n                            <button mat-menu-item (click)=\"deselectAllMails()\">None</button>\r\n                            <button mat-menu-item (click)=\"selectMailsByParameter('read', true)\">Read</button>\r\n                            <button mat-menu-item (click)=\"selectMailsByParameter('read', false)\">Unread</button>\r\n                            <button mat-menu-item (click)=\"selectMailsByParameter('starred', true)\">Starred</button>\r\n                            <button mat-menu-item (click)=\"selectMailsByParameter('starred', false)\">Unstarred</button>\r\n                            <button mat-menu-item (click)=\"selectMailsByParameter('important', true)\">Important</button>\r\n                            <button mat-menu-item (click)=\"selectMailsByParameter('important', false)\">Unimportant</button>\r\n                        </mat-menu>\r\n\r\n                        <div class=\"toolbar-separator\" *ngIf=\"hasSelectedMails\"></div>\r\n\r\n                        <button mat-icon-button (click)=\"setFolderOnSelectedMails(4)\" *ngIf=\"hasSelectedMails\">\r\n                            <mat-icon>delete</mat-icon>\r\n                        </button>\r\n\r\n                        <button mat-icon-button [matMenuTriggerFor]=\"folderMenu\" *ngIf=\"hasSelectedMails\">\r\n                            <mat-icon>folder</mat-icon>\r\n                        </button>\r\n                        <mat-menu #folderMenu=\"matMenu\">\r\n                            <button mat-menu-item *ngFor=\"let folder of folders$ | async\"\r\n                                    (click)=\"setFolderOnSelectedMails(folder.id)\">{{folder.title}}\r\n                            </button>\r\n                        </mat-menu>\r\n\r\n                        <button mat-icon-button [matMenuTriggerFor]=\"labelMenu\" *ngIf=\"hasSelectedMails\">\r\n                            <mat-icon>label</mat-icon>\r\n                        </button>\r\n                        <mat-menu #labelMenu=\"matMenu\">\r\n                            <button mat-menu-item *ngFor=\"let label of labels$ | async\"\r\n                                    (click)=\"toggleLabelOnSelectedMails(label.id)\">{{label.title}}\r\n                            </button>\r\n                        </mat-menu>\r\n                    </div>\r\n\r\n                    <div *ngIf=\"currentMail$ | async\" fxHide.gt-xs>\r\n                        <button mat-icon-button (click)=\"deSelectCurrentMail()\">\r\n                            <mat-icon>arrow_back</mat-icon>\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n                <!-- / CONTENT TOOLBAR -->\r\n\r\n                <!-- CONTENT -->\r\n                <div class=\"content\" fxLayout=\"row\">\r\n\r\n                    <fuse-mail-list fusePerfectScrollbar fxFlex [mails]=\"mails$ | async\" [currentMail]=\"currentMail$ | async\"></fuse-mail-list>\r\n                    <fuse-mail-details [mail]=\"currentMail$ | async\" fusePerfectScrollbar fxFlex></fuse-mail-details>\r\n\r\n                </div>\r\n                <!-- / CONTENT -->\r\n\r\n            </div>\r\n            <!-- / CONTENT CARD -->\r\n\r\n        </div>\r\n        <!-- / CENTER -->\r\n\r\n    </mat-sidenav-container>\r\n\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/mail.component.scss":
/*!*****************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/mail.component.scss ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n:host {\n  width: 100%; }\n:host .center .header .search-wrapper {\n    box-shadow: 0px 4px 5px -2px rgba(0, 0, 0, 0.2), 0px 7px 10px 1px rgba(0, 0, 0, 0.14), 0px 2px 16px 1px rgba(0, 0, 0, 0.12); }\n:host .center .header .search-wrapper .sidenav-toggle {\n      margin: 0;\n      width: 56px;\n      height: 56px;\n      background: #FFF;\n      border-radius: 0;\n      border-right: 1px solid rgba(0, 0, 0, 0.12); }\n:host .center .header .search-wrapper .search {\n      width: 100%;\n      height: 56px;\n      line-height: 56px;\n      padding: 18px; }\n:host .center .header .search-wrapper .search input {\n        height: 56px;\n        padding-left: 16px;\n        color: rgba(0, 0, 0, 0.54);\n        border: none;\n        outline: none; }\n@media screen and (max-width: 599px) {\n    :host .center .content-card fuse-mail-list {\n      border-right: none; }\n    :host .center .content-card fuse-mail-list,\n    :host .center .content-card fuse-mail-details {\n      flex: 1 0 100%; }\n    :host .center .content-card fuse-mail-details {\n      display: none !important; }\n    :host .center .content-card.current-mail-selected .toolbar {\n      padding-left: 16px !important; }\n      :host .center .content-card.current-mail-selected .toolbar .mail-selection {\n        display: none !important; }\n    :host .center .content-card.current-mail-selected .content fuse-mail-list {\n      display: none !important; }\n    :host .center .content-card.current-mail-selected .content fuse-mail-details {\n      display: flex !important; } }\n"

/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/mail.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/mail.component.ts ***!
  \***************************************************************/
/*! exports provided: FuseMailNgrxComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FuseMailNgrxComponent", function() { return FuseMailNgrxComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _fuse_services_translation_loader_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fuse/services/translation-loader.service */ "./src/@fuse/services/translation-loader.service.ts");
/* harmony import */ var _fuse_services_config_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fuse/services/config.service */ "./src/@fuse/services/config.service.ts");
/* harmony import */ var _mail_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./mail.service */ "./src/app/main/content/apps/mail-ngrx/mail.service.ts");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./store */ "./src/app/main/content/apps/mail-ngrx/store/index.ts");
/* harmony import */ var _i18n_en__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./i18n/en */ "./src/app/main/content/apps/mail-ngrx/i18n/en.ts");
/* harmony import */ var _i18n_tr__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./i18n/tr */ "./src/app/main/content/apps/mail-ngrx/i18n/tr.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var FuseMailNgrxComponent = /** @class */ (function () {
    function FuseMailNgrxComponent(configService, mailService, translationLoader, store, cd) {
        this.configService = configService;
        this.mailService = mailService;
        this.translationLoader = translationLoader;
        this.store = store;
        this.cd = cd;
        this.searchInput = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('');
        this.translationLoader.loadTranslations(_i18n_en__WEBPACK_IMPORTED_MODULE_8__["locale"], _i18n_tr__WEBPACK_IMPORTED_MODULE_9__["locale"]);
        this.currentMail$ = this.store.select(_store__WEBPACK_IMPORTED_MODULE_7__["getCurrentMail"]);
        this.mails$ = this.store.select(_store__WEBPACK_IMPORTED_MODULE_7__["getMailsArr"]);
        this.folders$ = this.store.select(_store__WEBPACK_IMPORTED_MODULE_7__["getFoldersArr"]);
        this.labels$ = this.store.select(_store__WEBPACK_IMPORTED_MODULE_7__["getLabelsArr"]);
        this.selectedMailIds$ = this.store.select(_store__WEBPACK_IMPORTED_MODULE_7__["getSelectedMailIds"]);
        this.searchText$ = this.store.select(_store__WEBPACK_IMPORTED_MODULE_7__["getSearchText"]);
        this.mails = [];
        this.selectedMailIds = [];
        this.configService.setConfig({
            routerAnimation: 'none'
        });
    }
    FuseMailNgrxComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.mails$.subscribe(function (mails) {
            _this.mails = mails;
        });
        this.selectedMailIds$
            .subscribe(function (selectedMailIds) {
            _this.selectedMailIds = selectedMailIds;
            _this.hasSelectedMails = selectedMailIds.length > 0;
            _this.isIndeterminate = (selectedMailIds.length !== _this.mails.length && selectedMailIds.length > 0);
            _this.refresh();
        });
        this.searchText$.subscribe(function (searchText) {
            _this.searchInput.setValue(searchText);
        });
        this.searchInput.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["debounceTime"])(300), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["distinctUntilChanged"])()).subscribe(function (searchText) {
            _this.store.dispatch(new _store__WEBPACK_IMPORTED_MODULE_7__["SetSearchText"](searchText));
        });
    };
    FuseMailNgrxComponent.prototype.ngOnDestroy = function () {
        this.cd.detach();
    };
    FuseMailNgrxComponent.prototype.toggleSelectAll = function (ev) {
        ev.preventDefault();
        if (this.selectedMailIds.length && this.selectedMailIds.length > 0) {
            this.deselectAllMails();
        }
        else {
            this.selectAllMails();
        }
    };
    FuseMailNgrxComponent.prototype.selectAllMails = function () {
        this.store.dispatch(new _store__WEBPACK_IMPORTED_MODULE_7__["SelectAllMails"]());
    };
    FuseMailNgrxComponent.prototype.deselectAllMails = function () {
        this.store.dispatch(new _store__WEBPACK_IMPORTED_MODULE_7__["DeselectAllMails"]());
    };
    FuseMailNgrxComponent.prototype.selectMailsByParameter = function (parameter, value) {
        this.store.dispatch(new _store__WEBPACK_IMPORTED_MODULE_7__["SelectMailsByParameter"]({
            parameter: parameter,
            value: value
        }));
    };
    FuseMailNgrxComponent.prototype.toggleLabelOnSelectedMails = function (labelId) {
        this.store.dispatch(new _store__WEBPACK_IMPORTED_MODULE_7__["AddLabelOnSelectedMails"](labelId));
    };
    FuseMailNgrxComponent.prototype.setFolderOnSelectedMails = function (folderId) {
        this.store.dispatch(new _store__WEBPACK_IMPORTED_MODULE_7__["SetFolderOnSelectedMails"](folderId));
    };
    FuseMailNgrxComponent.prototype.deSelectCurrentMail = function () {
        this.store.dispatch(new _store__WEBPACK_IMPORTED_MODULE_7__["SetCurrentMail"](''));
    };
    FuseMailNgrxComponent.prototype.refresh = function () {
        this.cd.markForCheck();
    };
    FuseMailNgrxComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-mail',
            template: __webpack_require__(/*! ./mail.component.html */ "./src/app/main/content/apps/mail-ngrx/mail.component.html"),
            styles: [__webpack_require__(/*! ./mail.component.scss */ "./src/app/main/content/apps/mail-ngrx/mail.component.scss")],
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [_fuse_services_config_service__WEBPACK_IMPORTED_MODULE_5__["FuseConfigService"],
            _mail_service__WEBPACK_IMPORTED_MODULE_6__["MailNgrxService"],
            _fuse_services_translation_loader_service__WEBPACK_IMPORTED_MODULE_4__["FuseTranslationLoaderService"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]])
    ], FuseMailNgrxComponent);
    return FuseMailNgrxComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/mail.model.ts":
/*!***********************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/mail.model.ts ***!
  \***********************************************************/
/*! exports provided: Mail */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Mail", function() { return Mail; });
var Mail = /** @class */ (function () {
    function Mail(mail) {
        this.id = mail.id;
        this.from = mail.from;
        this.to = mail.to;
        this.subject = mail.subject;
        this.message = mail.message;
        this.time = mail.time;
        this.read = mail.read;
        this.starred = mail.starred;
        this.important = mail.important;
        this.hasAttachments = mail.hasAttachments;
        this.attachments = mail.attachments;
        this.labels = mail.labels;
        this.folder = mail.folder;
    }
    Mail.prototype.toggleStar = function () {
        this.starred = !this.starred;
    };
    Mail.prototype.toggleImportant = function () {
        this.important = !this.important;
    };
    Mail.prototype.markRead = function () {
        this.read = true;
    };
    Mail.prototype.markUnRead = function () {
        this.read = false;
    };
    return Mail;
}());



/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/mail.module.ts":
/*!************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/mail.module.ts ***!
  \************************************************************/
/*! exports provided: FuseMailNgrxModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FuseMailNgrxModule", function() { return FuseMailNgrxModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/esm5/ngx-translate-core.js");
/* harmony import */ var _fuse_shared_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fuse/shared.module */ "./src/@fuse/shared.module.ts");
/* harmony import */ var _store_store_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./store/store.module */ "./src/app/main/content/apps/mail-ngrx/store/store.module.ts");
/* harmony import */ var _store_guards_index__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./store/guards/index */ "./src/app/main/content/apps/mail-ngrx/store/guards/index.ts");
/* harmony import */ var _mail_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./mail.component */ "./src/app/main/content/apps/mail-ngrx/mail.component.ts");
/* harmony import */ var _sidenavs_main_main_sidenav_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./sidenavs/main/main-sidenav.component */ "./src/app/main/content/apps/mail-ngrx/sidenavs/main/main-sidenav.component.ts");
/* harmony import */ var _mail_list_mail_list_item_mail_list_item_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./mail-list/mail-list-item/mail-list-item.component */ "./src/app/main/content/apps/mail-ngrx/mail-list/mail-list-item/mail-list-item.component.ts");
/* harmony import */ var _mail_list_mail_list_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./mail-list/mail-list.component */ "./src/app/main/content/apps/mail-ngrx/mail-list/mail-list.component.ts");
/* harmony import */ var _mail_details_mail_details_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./mail-details/mail-details.component */ "./src/app/main/content/apps/mail-ngrx/mail-details/mail-details.component.ts");
/* harmony import */ var _mail_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./mail.service */ "./src/app/main/content/apps/mail-ngrx/mail.service.ts");
/* harmony import */ var _dialogs_compose_compose_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./dialogs/compose/compose.component */ "./src/app/main/content/apps/mail-ngrx/dialogs/compose/compose.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};














var routes = [
    {
        path: 'label/:labelHandle',
        component: _mail_component__WEBPACK_IMPORTED_MODULE_7__["FuseMailNgrxComponent"],
        canActivate: [_store_guards_index__WEBPACK_IMPORTED_MODULE_6__["ResolveGuard"]]
    },
    {
        path: 'label/:labelHandle/:mailId',
        component: _mail_component__WEBPACK_IMPORTED_MODULE_7__["FuseMailNgrxComponent"],
        canActivate: [_store_guards_index__WEBPACK_IMPORTED_MODULE_6__["ResolveGuard"]]
    },
    {
        path: 'filter/:filterHandle',
        component: _mail_component__WEBPACK_IMPORTED_MODULE_7__["FuseMailNgrxComponent"],
        canActivate: [_store_guards_index__WEBPACK_IMPORTED_MODULE_6__["ResolveGuard"]]
    },
    {
        path: 'filter/:filterHandle/:mailId',
        component: _mail_component__WEBPACK_IMPORTED_MODULE_7__["FuseMailNgrxComponent"],
        canActivate: [_store_guards_index__WEBPACK_IMPORTED_MODULE_6__["ResolveGuard"]]
    },
    {
        path: ':folderHandle',
        component: _mail_component__WEBPACK_IMPORTED_MODULE_7__["FuseMailNgrxComponent"],
        canActivate: [_store_guards_index__WEBPACK_IMPORTED_MODULE_6__["ResolveGuard"]]
    },
    {
        path: ':folderHandle/:mailId',
        component: _mail_component__WEBPACK_IMPORTED_MODULE_7__["FuseMailNgrxComponent"],
        canActivate: [_store_guards_index__WEBPACK_IMPORTED_MODULE_6__["ResolveGuard"]]
    },
    {
        path: '**',
        redirectTo: 'inbox'
    }
];
var FuseMailNgrxModule = /** @class */ (function () {
    function FuseMailNgrxModule() {
    }
    FuseMailNgrxModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [
                _mail_component__WEBPACK_IMPORTED_MODULE_7__["FuseMailNgrxComponent"],
                _mail_list_mail_list_component__WEBPACK_IMPORTED_MODULE_10__["FuseMailNgrxListComponent"],
                _mail_list_mail_list_item_mail_list_item_component__WEBPACK_IMPORTED_MODULE_9__["FuseMailNgrxListItemComponent"],
                _mail_details_mail_details_component__WEBPACK_IMPORTED_MODULE_11__["FuseMailNgrxDetailsComponent"],
                _sidenavs_main_main_sidenav_component__WEBPACK_IMPORTED_MODULE_8__["FuseMailNgrxMainSidenavComponent"],
                _dialogs_compose_compose_component__WEBPACK_IMPORTED_MODULE_13__["FuseMailNgrxComposeDialogComponent"]
            ],
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes),
                _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatCheckboxModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialogModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatFormFieldModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatInputModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatMenuModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatRippleModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatSelectModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatSidenavModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatToolbarModule"],
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__["TranslateModule"],
                _fuse_shared_module__WEBPACK_IMPORTED_MODULE_4__["FuseSharedModule"],
                _store_store_module__WEBPACK_IMPORTED_MODULE_5__["MailAppStoreModule"]
            ],
            providers: [
                _mail_service__WEBPACK_IMPORTED_MODULE_12__["MailNgrxService"],
                _store_guards_index__WEBPACK_IMPORTED_MODULE_6__["ResolveGuard"]
            ],
            entryComponents: [_dialogs_compose_compose_component__WEBPACK_IMPORTED_MODULE_13__["FuseMailNgrxComposeDialogComponent"]]
        })
    ], FuseMailNgrxModule);
    return FuseMailNgrxModule;
}());



/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/mail.service.ts":
/*!*************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/mail.service.ts ***!
  \*************************************************************/
/*! exports provided: MailNgrxService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MailNgrxService", function() { return MailNgrxService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _store_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./store/selectors */ "./src/app/main/content/apps/mail-ngrx/store/selectors/index.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var MailNgrxService = /** @class */ (function () {
    function MailNgrxService(http, store) {
        var _this = this;
        this.http = http;
        this.store = store;
        this.store.select(_store_selectors__WEBPACK_IMPORTED_MODULE_3__["getFoldersArr"]).subscribe(function (folders) {
            _this.foldersArr = folders;
        });
        this.store.select(_store_selectors__WEBPACK_IMPORTED_MODULE_3__["getFiltersArr"]).subscribe(function (filters) {
            _this.filtersArr = filters;
        });
        this.store.select(_store_selectors__WEBPACK_IMPORTED_MODULE_3__["getLabelsArr"]).subscribe(function (labels) {
            _this.labelsArr = labels;
        });
        this.store.select(_store_selectors__WEBPACK_IMPORTED_MODULE_3__["getMailsArr"]).subscribe(function (mails) {
            _this.mails = mails;
        });
        this.selectedMails = [];
    }
    MailNgrxService.prototype.getAllMails = function () {
        return this.http.get('api/mail-mails');
    };
    MailNgrxService.prototype.getFolders = function () {
        return this.http.get('api/mail-folders');
    };
    MailNgrxService.prototype.getFilters = function () {
        return this.http.get('api/mail-filters');
    };
    MailNgrxService.prototype.getLabels = function () {
        return this.http.get('api/mail-labels');
    };
    MailNgrxService.prototype.getMails = function (handle) {
        if (handle.id === 'labelHandle') {
            var labelId = this.labelsArr.find(function (label) { return label.handle === handle.value; }).id;
            return this.http.get('api/mail-mails?labels=' + labelId);
        }
        else if (handle.id === 'filterHandle') {
            return this.http.get('api/mail-mails?' + handle.value + '=true');
        }
        else {
            var folderId = this.foldersArr.find(function (folder) { return folder.handle === handle.value; }).id;
            return this.http.get('api/mail-mails?folder=' + folderId);
        }
    };
    /**
     * Update the mail
     * @param mail
     * @returns {Promise<any>}
     */
    MailNgrxService.prototype.updateMail = function (mail) {
        return this.http.post('api/mail-mails/' + mail.id, __assign({}, mail));
    };
    MailNgrxService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"]])
    ], MailNgrxService);
    return MailNgrxService;
}());



/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/sidenavs/main/main-sidenav.component.html":
/*!***************************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/sidenavs/main/main-sidenav.component.html ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- SIDENAV HEADER -->\r\n<div fxLayout=\"column\" fxLayoutAlign=\"space-between start\"\r\n     class=\"header p-24 pb-4\" ngClass=\"mat-accent-bg\" ngClass.gt-md=\"white-fg\">\r\n\r\n    <div class=\"logo\" fxFlex fxLayout=\"row\" fxLayoutAlign=\"start center\">\r\n        <mat-icon class=\"logo-icon s-32\">mail</mat-icon>\r\n        <span class=\"logo-text\">Mailbox Ngrx</span>\r\n    </div>\r\n\r\n    <div class=\"account\" fxLayout=\"column\">\r\n        <div class=\"title\">John Doe</div>\r\n        <mat-form-field floatLabel=\"never\">\r\n            <mat-select class=\"account-selection\" placeholder=\"Mail Selection\"\r\n                        [ngModel]=\"selectedAccount\">\r\n                <mat-option *ngFor=\"let account of (accounts | keys)\" [value]=\"account.key\">\r\n                    {{account.value}}\r\n                </mat-option>\r\n            </mat-select>\r\n        </mat-form-field>\r\n    </div>\r\n\r\n</div>\r\n<!-- / SIDENAV HEADER -->\r\n\r\n<!-- SIDENAV CONTENT -->\r\n<div class=\"content\" fusePerfectScrollbar>\r\n\r\n    <div class=\"p-24\">\r\n        <button mat-raised-button\r\n                class=\"mat-accent compose-dialog-button w-100-p\"\r\n                (click)=\"composeDialog()\"\r\n                aria-label=\"Compose\">\r\n            {{ 'MAIL.COMPOSE' | translate }}\r\n        </button>\r\n    </div>\r\n\r\n    <div class=\"nav\">\r\n\r\n        <div class=\"nav-subheader\">{{ 'MAIL.FOLDERS' | translate }}</div>\r\n\r\n        <div class=\"nav-item\" *ngFor=\"let folder of (folders$ | async)\">\r\n            <a class=\"nav-link\" matRipple [routerLink]=\"'/apps/mail-ngrx/' + folder.handle\" routerLinkActive=\"active\">\r\n                <mat-icon class=\"nav-link-icon\" *ngIf=\"folder.icon\">{{folder.icon}}</mat-icon>\r\n                <span>{{folder.title}}</span>\r\n            </a>\r\n        </div>\r\n\r\n        <div class=\"nav-subheader\">{{ 'MAIL.FILTERS' | translate }}</div>\r\n\r\n        <div class=\"nav-item\" *ngFor=\"let filter of (filters$ | async)\">\r\n            <a class=\"nav-link\" matRipple [routerLink]=\"'/apps/mail-ngrx/filter/' + filter.handle\"\r\n               routerLinkActive=\"active\">\r\n                <mat-icon class=\"nav-link-icon\" [ngClass]=\"filter.color\" *ngIf=\"filter.icon\">{{filter.icon}}</mat-icon>\r\n                <span>{{filter.title}}</span>\r\n            </a>\r\n        </div>\r\n\r\n        <div class=\"nav-subheader\">{{ 'MAIL.LABELS' | translate }}</div>\r\n\r\n        <div class=\"nav-item\" *ngFor=\"let label of (labels$ | async)\">\r\n            <a class=\"nav-link\" matRipple [routerLink]=\"'/apps/mail-ngrx/label/' + label.handle\"\r\n               routerLinkActive=\"active\">\r\n                <mat-icon class=\"nav-link-icon\" [ngStyle]=\"{'color':label.color}\">label</mat-icon>\r\n                <span>{{label.title}}</span>\r\n            </a>\r\n        </div>\r\n\r\n    </div>\r\n\r\n</div>\r\n<!-- / SIDENAV CONTENT -->\r\n"

/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/sidenavs/main/main-sidenav.component.scss":
/*!***************************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/sidenavs/main/main-sidenav.component.scss ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: flex;\n  flex: 1 0 auto;\n  flex-direction: column;\n  height: 100%; }\n  :host .header .logo .logo-icon {\n    margin: 0 16px 0 0; }\n  :host .header .logo .logo-text {\n    font-size: 24px;\n    line-height: 24px; }\n  :host .header .account {\n    width: 100%; }\n"

/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/sidenavs/main/main-sidenav.component.ts":
/*!*************************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/sidenavs/main/main-sidenav.component.ts ***!
  \*************************************************************************************/
/*! exports provided: FuseMailNgrxMainSidenavComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FuseMailNgrxMainSidenavComponent", function() { return FuseMailNgrxMainSidenavComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _mail_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../mail.service */ "./src/app/main/content/apps/mail-ngrx/mail.service.ts");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../store */ "./src/app/main/content/apps/mail-ngrx/store/index.ts");
/* harmony import */ var _dialogs_compose_compose_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../dialogs/compose/compose.component */ "./src/app/main/content/apps/mail-ngrx/dialogs/compose/compose.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var FuseMailNgrxMainSidenavComponent = /** @class */ (function () {
    function FuseMailNgrxMainSidenavComponent(mailService, dialog, store) {
        this.mailService = mailService;
        this.dialog = dialog;
        this.store = store;
        // Data
        this.accounts = {
            'creapond': 'johndoe@creapond.com',
            'withinpixels': 'johndoe@withinpixels.com'
        };
        this.selectedAccount = 'creapond';
        this.folders$ = this.store.select(_store__WEBPACK_IMPORTED_MODULE_4__["getFoldersArr"]);
        this.filters$ = this.store.select(_store__WEBPACK_IMPORTED_MODULE_4__["getFiltersArr"]);
        this.labels$ = this.store.select(_store__WEBPACK_IMPORTED_MODULE_4__["getLabelsArr"]);
    }
    FuseMailNgrxMainSidenavComponent.prototype.composeDialog = function () {
        this.dialogRef = this.dialog.open(_dialogs_compose_compose_component__WEBPACK_IMPORTED_MODULE_5__["FuseMailNgrxComposeDialogComponent"], {
            panelClass: 'mail-compose-dialog'
        });
        this.dialogRef.afterClosed()
            .subscribe(function (response) {
            if (!response) {
                return;
            }
            var actionType = response[0];
            var formData = response[1];
            switch (actionType) {
                /**
                 * Send
                 */
                case 'send':
                    console.log('new Mail', formData.getRawValue());
                    break;
                /**
                 * Delete
                 */
                case 'delete':
                    console.log('delete Mail');
                    break;
            }
        });
    };
    FuseMailNgrxMainSidenavComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-mail-main-sidenav',
            template: __webpack_require__(/*! ./main-sidenav.component.html */ "./src/app/main/content/apps/mail-ngrx/sidenavs/main/main-sidenav.component.html"),
            styles: [__webpack_require__(/*! ./main-sidenav.component.scss */ "./src/app/main/content/apps/mail-ngrx/sidenavs/main/main-sidenav.component.scss")],
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [_mail_service__WEBPACK_IMPORTED_MODULE_3__["MailNgrxService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialog"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"]])
    ], FuseMailNgrxMainSidenavComponent);
    return FuseMailNgrxMainSidenavComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/actions/filters.actions.ts":
/*!******************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/actions/filters.actions.ts ***!
  \******************************************************************************/
/*! exports provided: GET_FILTERS, GET_FILTERS_SUCCESS, GET_FILTERS_FAILED, GetFilters, GetFiltersSuccess, GetFiltersFailed */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_FILTERS", function() { return GET_FILTERS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_FILTERS_SUCCESS", function() { return GET_FILTERS_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_FILTERS_FAILED", function() { return GET_FILTERS_FAILED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetFilters", function() { return GetFilters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetFiltersSuccess", function() { return GetFiltersSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetFiltersFailed", function() { return GetFiltersFailed; });
var GET_FILTERS = '[FILTERS] GET FILTERS';
var GET_FILTERS_SUCCESS = '[FILTERS] GET FILTERS SUCCESS';
var GET_FILTERS_FAILED = '[FILTERS] GET FILTERS FAILED';
/**
 * Get Filters
 */
var GetFilters = /** @class */ (function () {
    function GetFilters(payload) {
        this.payload = payload;
        this.type = GET_FILTERS;
    }
    return GetFilters;
}());

/**
 * Get Filters Success
 */
var GetFiltersSuccess = /** @class */ (function () {
    function GetFiltersSuccess(payload) {
        this.payload = payload;
        this.type = GET_FILTERS_SUCCESS;
    }
    return GetFiltersSuccess;
}());

/**
 * Get Filters Failed
 */
var GetFiltersFailed = /** @class */ (function () {
    function GetFiltersFailed(payload) {
        this.payload = payload;
        this.type = GET_FILTERS_FAILED;
    }
    return GetFiltersFailed;
}());



/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/actions/folders.actions.ts":
/*!******************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/actions/folders.actions.ts ***!
  \******************************************************************************/
/*! exports provided: GET_FOLDERS, GET_FOLDERS_SUCCESS, GET_FOLDERS_FAILED, GetFolders, GetFoldersSuccess, GetFoldersFailed */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_FOLDERS", function() { return GET_FOLDERS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_FOLDERS_SUCCESS", function() { return GET_FOLDERS_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_FOLDERS_FAILED", function() { return GET_FOLDERS_FAILED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetFolders", function() { return GetFolders; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetFoldersSuccess", function() { return GetFoldersSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetFoldersFailed", function() { return GetFoldersFailed; });
var GET_FOLDERS = '[FOLDERS] GET FOLDERS';
var GET_FOLDERS_SUCCESS = '[FOLDERS] GET FOLDERS SUCCESS';
var GET_FOLDERS_FAILED = '[FOLDERS] GET FOLDERS FAILED';
/**
 * Get Folders
 */
var GetFolders = /** @class */ (function () {
    function GetFolders(payload) {
        this.payload = payload;
        this.type = GET_FOLDERS;
    }
    return GetFolders;
}());

/**
 * Get Folders Success
 */
var GetFoldersSuccess = /** @class */ (function () {
    function GetFoldersSuccess(payload) {
        this.payload = payload;
        this.type = GET_FOLDERS_SUCCESS;
    }
    return GetFoldersSuccess;
}());

/**
 * Get Folders Failed
 */
var GetFoldersFailed = /** @class */ (function () {
    function GetFoldersFailed(payload) {
        this.payload = payload;
        this.type = GET_FOLDERS_FAILED;
    }
    return GetFoldersFailed;
}());



/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/actions/index.ts":
/*!********************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/actions/index.ts ***!
  \********************************************************************/
/*! exports provided: GET_MAILS, GET_MAILS_SUCCESS, GET_MAILS_FAILED, SET_CURRENT_MAIL, SET_CURRENT_MAIL_SUCCESS, CHECK_CURRENT_MAIL, UPDATE_MAIL, UPDATE_MAIL_SUCCESS, UPDATE_MAILS, UPDATE_MAILS_SUCCESS, SET_SEARCH_TEXT, SELECT_ALL_MAILS, DESELECT_ALL_MAILS, TOGGLE_IN_SELECTED_MAILS, SELECT_MAILS_BY_PARAMETER, SET_FOLDER_ON_SELECTED_MAILS, ADD_LABEL_ON_SELECTED_MAILS, GetMails, GetMailsSuccess, GetMailsFailed, SetCurrentMail, SetCurrentMailSuccess, CheckCurrentMail, UpdateMail, UpdateMailSuccess, UpdateMails, UpdateMailsSuccess, SetSearchText, SelectAllMails, DeselectAllMails, ToggleInSelectedMails, SelectMailsByParameter, SetFolderOnSelectedMails, AddLabelOnSelectedMails, GET_FOLDERS, GET_FOLDERS_SUCCESS, GET_FOLDERS_FAILED, GetFolders, GetFoldersSuccess, GetFoldersFailed, GET_FILTERS, GET_FILTERS_SUCCESS, GET_FILTERS_FAILED, GetFilters, GetFiltersSuccess, GetFiltersFailed, GET_LABELS, GET_LABELS_SUCCESS, GET_LABELS_FAILED, GetLabels, GetLabelsSuccess, GetLabelsFailed */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mails_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mails.actions */ "./src/app/main/content/apps/mail-ngrx/store/actions/mails.actions.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_MAILS", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["GET_MAILS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_MAILS_SUCCESS", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["GET_MAILS_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_MAILS_FAILED", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["GET_MAILS_FAILED"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SET_CURRENT_MAIL", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["SET_CURRENT_MAIL"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SET_CURRENT_MAIL_SUCCESS", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["SET_CURRENT_MAIL_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CHECK_CURRENT_MAIL", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["CHECK_CURRENT_MAIL"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UPDATE_MAIL", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["UPDATE_MAIL"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UPDATE_MAIL_SUCCESS", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["UPDATE_MAIL_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UPDATE_MAILS", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["UPDATE_MAILS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UPDATE_MAILS_SUCCESS", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["UPDATE_MAILS_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SET_SEARCH_TEXT", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["SET_SEARCH_TEXT"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SELECT_ALL_MAILS", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["SELECT_ALL_MAILS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DESELECT_ALL_MAILS", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["DESELECT_ALL_MAILS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TOGGLE_IN_SELECTED_MAILS", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["TOGGLE_IN_SELECTED_MAILS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SELECT_MAILS_BY_PARAMETER", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["SELECT_MAILS_BY_PARAMETER"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SET_FOLDER_ON_SELECTED_MAILS", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["SET_FOLDER_ON_SELECTED_MAILS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ADD_LABEL_ON_SELECTED_MAILS", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["ADD_LABEL_ON_SELECTED_MAILS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetMails", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["GetMails"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetMailsSuccess", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["GetMailsSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetMailsFailed", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["GetMailsFailed"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SetCurrentMail", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["SetCurrentMail"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SetCurrentMailSuccess", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["SetCurrentMailSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CheckCurrentMail", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["CheckCurrentMail"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UpdateMail", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["UpdateMail"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UpdateMailSuccess", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["UpdateMailSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UpdateMails", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["UpdateMails"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UpdateMailsSuccess", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["UpdateMailsSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SetSearchText", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["SetSearchText"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SelectAllMails", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["SelectAllMails"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DeselectAllMails", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["DeselectAllMails"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ToggleInSelectedMails", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["ToggleInSelectedMails"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SelectMailsByParameter", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["SelectMailsByParameter"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SetFolderOnSelectedMails", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["SetFolderOnSelectedMails"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AddLabelOnSelectedMails", function() { return _mails_actions__WEBPACK_IMPORTED_MODULE_0__["AddLabelOnSelectedMails"]; });

/* harmony import */ var _folders_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./folders.actions */ "./src/app/main/content/apps/mail-ngrx/store/actions/folders.actions.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_FOLDERS", function() { return _folders_actions__WEBPACK_IMPORTED_MODULE_1__["GET_FOLDERS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_FOLDERS_SUCCESS", function() { return _folders_actions__WEBPACK_IMPORTED_MODULE_1__["GET_FOLDERS_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_FOLDERS_FAILED", function() { return _folders_actions__WEBPACK_IMPORTED_MODULE_1__["GET_FOLDERS_FAILED"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetFolders", function() { return _folders_actions__WEBPACK_IMPORTED_MODULE_1__["GetFolders"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetFoldersSuccess", function() { return _folders_actions__WEBPACK_IMPORTED_MODULE_1__["GetFoldersSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetFoldersFailed", function() { return _folders_actions__WEBPACK_IMPORTED_MODULE_1__["GetFoldersFailed"]; });

/* harmony import */ var _filters_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./filters.actions */ "./src/app/main/content/apps/mail-ngrx/store/actions/filters.actions.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_FILTERS", function() { return _filters_actions__WEBPACK_IMPORTED_MODULE_2__["GET_FILTERS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_FILTERS_SUCCESS", function() { return _filters_actions__WEBPACK_IMPORTED_MODULE_2__["GET_FILTERS_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_FILTERS_FAILED", function() { return _filters_actions__WEBPACK_IMPORTED_MODULE_2__["GET_FILTERS_FAILED"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetFilters", function() { return _filters_actions__WEBPACK_IMPORTED_MODULE_2__["GetFilters"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetFiltersSuccess", function() { return _filters_actions__WEBPACK_IMPORTED_MODULE_2__["GetFiltersSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetFiltersFailed", function() { return _filters_actions__WEBPACK_IMPORTED_MODULE_2__["GetFiltersFailed"]; });

/* harmony import */ var _labels_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./labels.actions */ "./src/app/main/content/apps/mail-ngrx/store/actions/labels.actions.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_LABELS", function() { return _labels_actions__WEBPACK_IMPORTED_MODULE_3__["GET_LABELS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_LABELS_SUCCESS", function() { return _labels_actions__WEBPACK_IMPORTED_MODULE_3__["GET_LABELS_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_LABELS_FAILED", function() { return _labels_actions__WEBPACK_IMPORTED_MODULE_3__["GET_LABELS_FAILED"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetLabels", function() { return _labels_actions__WEBPACK_IMPORTED_MODULE_3__["GetLabels"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetLabelsSuccess", function() { return _labels_actions__WEBPACK_IMPORTED_MODULE_3__["GetLabelsSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetLabelsFailed", function() { return _labels_actions__WEBPACK_IMPORTED_MODULE_3__["GetLabelsFailed"]; });







/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/actions/labels.actions.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/actions/labels.actions.ts ***!
  \*****************************************************************************/
/*! exports provided: GET_LABELS, GET_LABELS_SUCCESS, GET_LABELS_FAILED, GetLabels, GetLabelsSuccess, GetLabelsFailed */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_LABELS", function() { return GET_LABELS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_LABELS_SUCCESS", function() { return GET_LABELS_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_LABELS_FAILED", function() { return GET_LABELS_FAILED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetLabels", function() { return GetLabels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetLabelsSuccess", function() { return GetLabelsSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetLabelsFailed", function() { return GetLabelsFailed; });
var GET_LABELS = '[LABELS] GET LABELS';
var GET_LABELS_SUCCESS = '[LABELS] GET LABELS SUCCESS';
var GET_LABELS_FAILED = '[LABELS] GET LABELS FAILED';
/**
 * Get Labels
 */
var GetLabels = /** @class */ (function () {
    function GetLabels(payload) {
        this.payload = payload;
        this.type = GET_LABELS;
    }
    return GetLabels;
}());

/**
 * Get Labels Success
 */
var GetLabelsSuccess = /** @class */ (function () {
    function GetLabelsSuccess(payload) {
        this.payload = payload;
        this.type = GET_LABELS_SUCCESS;
    }
    return GetLabelsSuccess;
}());

/**
 * Get Labels Failed
 */
var GetLabelsFailed = /** @class */ (function () {
    function GetLabelsFailed(payload) {
        this.payload = payload;
        this.type = GET_LABELS_FAILED;
    }
    return GetLabelsFailed;
}());



/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/actions/mails.actions.ts":
/*!****************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/actions/mails.actions.ts ***!
  \****************************************************************************/
/*! exports provided: GET_MAILS, GET_MAILS_SUCCESS, GET_MAILS_FAILED, SET_CURRENT_MAIL, SET_CURRENT_MAIL_SUCCESS, CHECK_CURRENT_MAIL, UPDATE_MAIL, UPDATE_MAIL_SUCCESS, UPDATE_MAILS, UPDATE_MAILS_SUCCESS, SET_SEARCH_TEXT, SELECT_ALL_MAILS, DESELECT_ALL_MAILS, TOGGLE_IN_SELECTED_MAILS, SELECT_MAILS_BY_PARAMETER, SET_FOLDER_ON_SELECTED_MAILS, ADD_LABEL_ON_SELECTED_MAILS, GetMails, GetMailsSuccess, GetMailsFailed, SetCurrentMail, SetCurrentMailSuccess, CheckCurrentMail, UpdateMail, UpdateMailSuccess, UpdateMails, UpdateMailsSuccess, SetSearchText, SelectAllMails, DeselectAllMails, ToggleInSelectedMails, SelectMailsByParameter, SetFolderOnSelectedMails, AddLabelOnSelectedMails */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_MAILS", function() { return GET_MAILS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_MAILS_SUCCESS", function() { return GET_MAILS_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_MAILS_FAILED", function() { return GET_MAILS_FAILED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_CURRENT_MAIL", function() { return SET_CURRENT_MAIL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_CURRENT_MAIL_SUCCESS", function() { return SET_CURRENT_MAIL_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHECK_CURRENT_MAIL", function() { return CHECK_CURRENT_MAIL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_MAIL", function() { return UPDATE_MAIL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_MAIL_SUCCESS", function() { return UPDATE_MAIL_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_MAILS", function() { return UPDATE_MAILS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_MAILS_SUCCESS", function() { return UPDATE_MAILS_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_SEARCH_TEXT", function() { return SET_SEARCH_TEXT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SELECT_ALL_MAILS", function() { return SELECT_ALL_MAILS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DESELECT_ALL_MAILS", function() { return DESELECT_ALL_MAILS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TOGGLE_IN_SELECTED_MAILS", function() { return TOGGLE_IN_SELECTED_MAILS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SELECT_MAILS_BY_PARAMETER", function() { return SELECT_MAILS_BY_PARAMETER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_FOLDER_ON_SELECTED_MAILS", function() { return SET_FOLDER_ON_SELECTED_MAILS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ADD_LABEL_ON_SELECTED_MAILS", function() { return ADD_LABEL_ON_SELECTED_MAILS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetMails", function() { return GetMails; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetMailsSuccess", function() { return GetMailsSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetMailsFailed", function() { return GetMailsFailed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetCurrentMail", function() { return SetCurrentMail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetCurrentMailSuccess", function() { return SetCurrentMailSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CheckCurrentMail", function() { return CheckCurrentMail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateMail", function() { return UpdateMail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateMailSuccess", function() { return UpdateMailSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateMails", function() { return UpdateMails; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateMailsSuccess", function() { return UpdateMailsSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetSearchText", function() { return SetSearchText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectAllMails", function() { return SelectAllMails; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeselectAllMails", function() { return DeselectAllMails; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToggleInSelectedMails", function() { return ToggleInSelectedMails; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectMailsByParameter", function() { return SelectMailsByParameter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetFolderOnSelectedMails", function() { return SetFolderOnSelectedMails; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddLabelOnSelectedMails", function() { return AddLabelOnSelectedMails; });
var GET_MAILS = '[MAILS] GET MAILS';
var GET_MAILS_SUCCESS = '[MAILS] GET MAILS SUCCESS';
var GET_MAILS_FAILED = '[MAILS] GET MAILS FAILED';
var SET_CURRENT_MAIL = '[MAILS] SET CURRENT MAIL';
var SET_CURRENT_MAIL_SUCCESS = '[MAILS] SET CURRENT MAIL SUCCESS';
var CHECK_CURRENT_MAIL = '[MAILS] CHECK CURRENT MAIL';
var UPDATE_MAIL = '[MAILS] UPDATE MAIL';
var UPDATE_MAIL_SUCCESS = '[MAILS] UPDATE MAIL SUCCESS';
var UPDATE_MAILS = '[MAILS] UPDATE MAILS';
var UPDATE_MAILS_SUCCESS = '[MAILS] UPDATE MAILS SUCCESS';
var SET_SEARCH_TEXT = '[MAILS] SET SEARCH TEXT';
var SELECT_ALL_MAILS = '[MAILS] SELECT ALL MAILS';
var DESELECT_ALL_MAILS = '[MAILS] DESELECT ALL MAILS';
var TOGGLE_IN_SELECTED_MAILS = '[MAILS] TOGGLE IN SELECTED MAILS';
var SELECT_MAILS_BY_PARAMETER = '[MAILS] SELECT MAILS BY PARAMETER';
var SET_FOLDER_ON_SELECTED_MAILS = '[MAILS] SET FOLDER ON SELECTED MAILS';
var ADD_LABEL_ON_SELECTED_MAILS = '[MAILS] ADD LABEL ON SELECTED MAILS';
/**
 * Get Mails
 */
var GetMails = /** @class */ (function () {
    function GetMails() {
        this.type = GET_MAILS;
    }
    return GetMails;
}());

/**
 * Get Mails Success
 */
var GetMailsSuccess = /** @class */ (function () {
    function GetMailsSuccess(payload) {
        this.payload = payload;
        this.type = GET_MAILS_SUCCESS;
    }
    return GetMailsSuccess;
}());

/**
 * Get Mails Failed
 */
var GetMailsFailed = /** @class */ (function () {
    function GetMailsFailed(payload) {
        this.payload = payload;
        this.type = GET_MAILS_FAILED;
    }
    return GetMailsFailed;
}());

/**
 * Set Current Mail
 */
var SetCurrentMail = /** @class */ (function () {
    function SetCurrentMail(payload) {
        this.payload = payload;
        this.type = SET_CURRENT_MAIL;
    }
    return SetCurrentMail;
}());

/**
 * Set Current Mail Success
 */
var SetCurrentMailSuccess = /** @class */ (function () {
    function SetCurrentMailSuccess(payload) {
        this.payload = payload;
        this.type = SET_CURRENT_MAIL_SUCCESS;
    }
    return SetCurrentMailSuccess;
}());

/**
 * Check Current Mail
 */
var CheckCurrentMail = /** @class */ (function () {
    function CheckCurrentMail() {
        this.type = CHECK_CURRENT_MAIL;
    }
    return CheckCurrentMail;
}());

/**
 * Update Mail
 */
var UpdateMail = /** @class */ (function () {
    function UpdateMail(payload) {
        this.payload = payload;
        this.type = UPDATE_MAIL;
    }
    return UpdateMail;
}());

/**
 * Update Mail Success
 */
var UpdateMailSuccess = /** @class */ (function () {
    function UpdateMailSuccess(payload) {
        this.payload = payload;
        this.type = UPDATE_MAIL_SUCCESS;
    }
    return UpdateMailSuccess;
}());

/**
 * Update Mails
 */
var UpdateMails = /** @class */ (function () {
    function UpdateMails(payload) {
        this.payload = payload;
        this.type = UPDATE_MAILS;
    }
    return UpdateMails;
}());

/**
 * Update Mails Success
 */
var UpdateMailsSuccess = /** @class */ (function () {
    function UpdateMailsSuccess() {
        this.type = UPDATE_MAILS_SUCCESS;
    }
    return UpdateMailsSuccess;
}());

/**
 * Set Search Text
 */
var SetSearchText = /** @class */ (function () {
    function SetSearchText(payload) {
        this.payload = payload;
        this.type = SET_SEARCH_TEXT;
    }
    return SetSearchText;
}());

/**
 * Select All Mails
 */
var SelectAllMails = /** @class */ (function () {
    function SelectAllMails() {
        this.type = SELECT_ALL_MAILS;
    }
    return SelectAllMails;
}());

/**
 * Deselect All Mails
 */
var DeselectAllMails = /** @class */ (function () {
    function DeselectAllMails() {
        this.type = DESELECT_ALL_MAILS;
    }
    return DeselectAllMails;
}());

/**
 * Toggle In Selected Mails
 */
var ToggleInSelectedMails = /** @class */ (function () {
    function ToggleInSelectedMails(payload) {
        this.payload = payload;
        this.type = TOGGLE_IN_SELECTED_MAILS;
    }
    return ToggleInSelectedMails;
}());

/**
 * Select Mails by Parameter
 */
var SelectMailsByParameter = /** @class */ (function () {
    function SelectMailsByParameter(payload) {
        this.payload = payload;
        this.type = SELECT_MAILS_BY_PARAMETER;
    }
    return SelectMailsByParameter;
}());

/**
 * Set Folder on Selected Mails
 */
var SetFolderOnSelectedMails = /** @class */ (function () {
    function SetFolderOnSelectedMails(payload) {
        this.payload = payload;
        this.type = SET_FOLDER_ON_SELECTED_MAILS;
    }
    return SetFolderOnSelectedMails;
}());

/**
 * Add label on Selected Mails
 */
var AddLabelOnSelectedMails = /** @class */ (function () {
    function AddLabelOnSelectedMails(payload) {
        this.payload = payload;
        this.type = ADD_LABEL_ON_SELECTED_MAILS;
    }
    return AddLabelOnSelectedMails;
}());



/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/effects/filters.effects.ts":
/*!******************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/effects/filters.effects.ts ***!
  \******************************************************************************/
/*! exports provided: FiltersEffect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FiltersEffect", function() { return FiltersEffect; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _actions_filters_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../actions/filters.actions */ "./src/app/main/content/apps/mail-ngrx/store/actions/filters.actions.ts");
/* harmony import */ var _mail_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../mail.service */ "./src/app/main/content/apps/mail-ngrx/mail.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var FiltersEffect = /** @class */ (function () {
    function FiltersEffect(actions, mailService) {
        var _this = this;
        this.actions = actions;
        this.mailService = mailService;
        /**
         * Get filters from Server
         * @type {Observable<any>}
         */
        this.getFilters = this.actions
            .ofType(_actions_filters_actions__WEBPACK_IMPORTED_MODULE_4__["GET_FILTERS"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (action) {
            return _this.mailService.getFilters()
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (filters) {
                return new _actions_filters_actions__WEBPACK_IMPORTED_MODULE_4__["GetFiltersSuccess"](filters);
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(function (err) { return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(new _actions_filters_actions__WEBPACK_IMPORTED_MODULE_4__["GetFiltersFailed"](err)); }));
        }));
    }
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])(),
        __metadata("design:type", rxjs__WEBPACK_IMPORTED_MODULE_2__["Observable"])
    ], FiltersEffect.prototype, "getFilters", void 0);
    FiltersEffect = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Actions"],
            _mail_service__WEBPACK_IMPORTED_MODULE_5__["MailNgrxService"]])
    ], FiltersEffect);
    return FiltersEffect;
}());



/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/effects/folders.effects.ts":
/*!******************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/effects/folders.effects.ts ***!
  \******************************************************************************/
/*! exports provided: FoldersEffect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FoldersEffect", function() { return FoldersEffect; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _actions_folders_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../actions/folders.actions */ "./src/app/main/content/apps/mail-ngrx/store/actions/folders.actions.ts");
/* harmony import */ var _mail_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../mail.service */ "./src/app/main/content/apps/mail-ngrx/mail.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var FoldersEffect = /** @class */ (function () {
    function FoldersEffect(actions, mailService) {
        var _this = this;
        this.actions = actions;
        this.mailService = mailService;
        /**
         * Get Folders from Server
         * @type {Observable<any>}
         */
        this.getFolders = this.actions
            .ofType(_actions_folders_actions__WEBPACK_IMPORTED_MODULE_4__["GET_FOLDERS"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (action) {
            return _this.mailService.getFolders()
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (folders) {
                return new _actions_folders_actions__WEBPACK_IMPORTED_MODULE_4__["GetFoldersSuccess"](folders);
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(function (err) { return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(new _actions_folders_actions__WEBPACK_IMPORTED_MODULE_4__["GetFoldersFailed"](err)); }));
        }));
    }
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])(),
        __metadata("design:type", rxjs__WEBPACK_IMPORTED_MODULE_2__["Observable"])
    ], FoldersEffect.prototype, "getFolders", void 0);
    FoldersEffect = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Actions"],
            _mail_service__WEBPACK_IMPORTED_MODULE_5__["MailNgrxService"]])
    ], FoldersEffect);
    return FoldersEffect;
}());



/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/effects/index.ts":
/*!********************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/effects/index.ts ***!
  \********************************************************************/
/*! exports provided: effects, MailsEffect, FoldersEffect, FiltersEffect, LabelsEffect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "effects", function() { return effects; });
/* harmony import */ var _mails_effects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mails.effects */ "./src/app/main/content/apps/mail-ngrx/store/effects/mails.effects.ts");
/* harmony import */ var _folders_effects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./folders.effects */ "./src/app/main/content/apps/mail-ngrx/store/effects/folders.effects.ts");
/* harmony import */ var _filters_effects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./filters.effects */ "./src/app/main/content/apps/mail-ngrx/store/effects/filters.effects.ts");
/* harmony import */ var _labels_effects__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./labels.effects */ "./src/app/main/content/apps/mail-ngrx/store/effects/labels.effects.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MailsEffect", function() { return _mails_effects__WEBPACK_IMPORTED_MODULE_0__["MailsEffect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FoldersEffect", function() { return _folders_effects__WEBPACK_IMPORTED_MODULE_1__["FoldersEffect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FiltersEffect", function() { return _filters_effects__WEBPACK_IMPORTED_MODULE_2__["FiltersEffect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LabelsEffect", function() { return _labels_effects__WEBPACK_IMPORTED_MODULE_3__["LabelsEffect"]; });





var effects = [
    _mails_effects__WEBPACK_IMPORTED_MODULE_0__["MailsEffect"],
    _folders_effects__WEBPACK_IMPORTED_MODULE_1__["FoldersEffect"],
    _filters_effects__WEBPACK_IMPORTED_MODULE_2__["FiltersEffect"],
    _labels_effects__WEBPACK_IMPORTED_MODULE_3__["LabelsEffect"]
];






/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/effects/labels.effects.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/effects/labels.effects.ts ***!
  \*****************************************************************************/
/*! exports provided: LabelsEffect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LabelsEffect", function() { return LabelsEffect; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _actions_labels_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../actions/labels.actions */ "./src/app/main/content/apps/mail-ngrx/store/actions/labels.actions.ts");
/* harmony import */ var _mail_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../mail.service */ "./src/app/main/content/apps/mail-ngrx/mail.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var LabelsEffect = /** @class */ (function () {
    function LabelsEffect(actions, mailService) {
        var _this = this;
        this.actions = actions;
        this.mailService = mailService;
        /**
         * Get Labels from Server
         * @type {Observable<any>}
         */
        this.getLabels = this.actions
            .ofType(_actions_labels_actions__WEBPACK_IMPORTED_MODULE_4__["GET_LABELS"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (action) {
            return _this.mailService.getLabels()
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (labels) {
                return new _actions_labels_actions__WEBPACK_IMPORTED_MODULE_4__["GetLabelsSuccess"](labels);
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(function (err) { return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(new _actions_labels_actions__WEBPACK_IMPORTED_MODULE_4__["GetLabelsFailed"](err)); }));
        }));
    }
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])(),
        __metadata("design:type", rxjs__WEBPACK_IMPORTED_MODULE_2__["Observable"])
    ], LabelsEffect.prototype, "getLabels", void 0);
    LabelsEffect = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Actions"],
            _mail_service__WEBPACK_IMPORTED_MODULE_5__["MailNgrxService"]])
    ], LabelsEffect);
    return LabelsEffect;
}());



/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/effects/mails.effects.ts":
/*!****************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/effects/mails.effects.ts ***!
  \****************************************************************************/
/*! exports provided: MailsEffect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MailsEffect", function() { return MailsEffect; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var app_store_reducers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/store/reducers */ "./src/app/store/reducers/index.ts");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../selectors */ "./src/app/main/content/apps/mail-ngrx/store/selectors/index.ts");
/* harmony import */ var _actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../actions/mails.actions */ "./src/app/main/content/apps/mail-ngrx/store/actions/mails.actions.ts");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../store */ "./src/app/store/index.ts");
/* harmony import */ var _mail_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../mail.service */ "./src/app/main/content/apps/mail-ngrx/mail.service.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var MailsEffect = /** @class */ (function () {
    function MailsEffect(actions, mailService, store) {
        var _this = this;
        this.actions = actions;
        this.mailService = mailService;
        this.store = store;
        /**
         * Get Mails with router parameters
         * @type {Observable<any>}
         */
        this.getMails = this.actions
            .ofType(_actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["GET_MAILS"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["exhaustMap"])(function (action) {
            var handle = {
                id: '',
                value: ''
            };
            var routeParams = Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])('labelHandle', 'filterHandle', 'folderHandle');
            routeParams.subscribe(function (param) {
                if (_this.routerState.params[param]) {
                    handle = {
                        id: param,
                        value: _this.routerState.params[param]
                    };
                }
            });
            return _this.mailService.getMails(handle)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (mails) {
                return new _actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["GetMailsSuccess"]({
                    loaded: handle,
                    mails: mails
                });
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function (err) { return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(new _actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["GetMailsFailed"](err)); }));
        }));
        /**
         * Update Mail
         * @type {Observable<any>}
         */
        this.updateMail = this.actions
            .ofType(_actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["UPDATE_MAIL"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["exhaustMap"])(function (action) {
            return _this.mailService.updateMail(action.payload).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function () {
                return new _actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["UpdateMailSuccess"](action.payload);
            }));
        }));
        /**
         * UpdateMails
         * @type {Observable<any>}
         */
        this.updateMails = this.actions
            .ofType(_actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["UPDATE_MAILS"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["exhaustMap"])(function (action) {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["forkJoin"])(action.payload.map(function (mail) { return _this.mailService.updateMail(mail); }), function () {
                return new _actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["UpdateMailsSuccess"]();
            });
        }));
        /**
         * Set Current Mail
         * @type {Observable<SetCurrentMailSuccess>}
         */
        this.setCurrentMail = this.actions
            .ofType(_actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["SET_CURRENT_MAIL"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["withLatestFrom"])(this.store.select(_selectors__WEBPACK_IMPORTED_MODULE_6__["getMailsState"])), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (_a) {
            var action = _a[0], state = _a[1];
            return new _actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["SetCurrentMailSuccess"](state.entities[action.payload]);
        }));
        /**
         * Check Current Mail
         * Navigate to parent directory if not exist in mail list
         * Update Current Mail if exist in mail list
         * @type {Observable<any>}
         */
        this.checkCurrentMail = this.actions
            .ofType(_actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["CHECK_CURRENT_MAIL"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["withLatestFrom"])(this.store.select(_selectors__WEBPACK_IMPORTED_MODULE_6__["getMailsState"])), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (_a) {
            var action = _a[0], state = _a[1];
            if (!state.entities[_this.routerState.params.mailId]) {
                return new _store__WEBPACK_IMPORTED_MODULE_8__["Go"]({ path: [_this.routerState.url.replace(_this.routerState.params.mailId, '')] });
            }
            return new _actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["SetCurrentMailSuccess"](state.entities[_this.routerState.params.mailId]);
        }));
        /**
         * On Get Mails Success
         * @type {Observable<CheckCurrentMail>}
         */
        this.getMailsSuccess = this.actions
            .ofType(_actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["GET_MAILS_SUCCESS"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["mergeMap"])(function () {
            return [
                new _actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["CheckCurrentMail"]()
            ];
        }));
        /**
         * On Update Mails Success
         * @type {Observable<DeselectAllMails | GetMails>}
         */
        this.updateMailsSuccess = this.actions
            .ofType(_actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["UPDATE_MAILS_SUCCESS"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["mergeMap"])(function () {
            return [
                new _actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["DeselectAllMails"](),
                new _actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["GetMails"]()
            ];
        }));
        /**
         * On Update Mail Success
         * @type {Observable<GetMails>}
         */
        this.updateMailSuccess = this.actions
            .ofType(_actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["UPDATE_MAIL_SUCCESS"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["debounceTime"])(500), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function () {
            return new _actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["GetMails"]();
        }));
        /**
         * Set Folder on Selected Mails
         * @type {Observable<UpdateMails>}
         */
        this.setFolderOnSelectedMails = this.actions
            .ofType(_actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["SET_FOLDER_ON_SELECTED_MAILS"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["withLatestFrom"])(this.store.select(_selectors__WEBPACK_IMPORTED_MODULE_6__["getMailsState"])), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (_a) {
            var action = _a[0], state = _a[1];
            var entities = __assign({}, state.entities);
            var mailsToUpdate = [];
            state.selectedMailIds
                .map(function (id) {
                mailsToUpdate = mailsToUpdate.concat([
                    entities[id] = __assign({}, entities[id], { folder: action.payload })
                ]);
            });
            return new _actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["UpdateMails"](mailsToUpdate);
        }));
        /**
         * Add Label on Selected Mails
         * @type {Observable<UpdateMails>}
         */
        this.addLabelOnSelectedMails = this.actions
            .ofType(_actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["ADD_LABEL_ON_SELECTED_MAILS"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["withLatestFrom"])(this.store.select(_selectors__WEBPACK_IMPORTED_MODULE_6__["getMailsState"])), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (_a) {
            var action = _a[0], state = _a[1];
            var entities = __assign({}, state.entities);
            var mailsToUpdate = [];
            state.selectedMailIds
                .map(function (id) {
                var labels = entities[id].labels.slice();
                if (!entities[id].labels.includes(action.payload)) {
                    labels = labels.concat([action.payload]);
                }
                mailsToUpdate = mailsToUpdate.concat([
                    entities[id] = __assign({}, entities[id], { labels: labels })
                ]);
            });
            return new _actions_mails_actions__WEBPACK_IMPORTED_MODULE_7__["UpdateMails"](mailsToUpdate);
        }));
        this.store.select(app_store_reducers__WEBPACK_IMPORTED_MODULE_5__["getRouterState"]).subscribe(function (routerState) {
            if (routerState) {
                _this.routerState = routerState.state;
            }
        });
    }
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])(),
        __metadata("design:type", rxjs__WEBPACK_IMPORTED_MODULE_3__["Observable"])
    ], MailsEffect.prototype, "getMails", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])(),
        __metadata("design:type", rxjs__WEBPACK_IMPORTED_MODULE_3__["Observable"])
    ], MailsEffect.prototype, "updateMail", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])(),
        __metadata("design:type", rxjs__WEBPACK_IMPORTED_MODULE_3__["Observable"])
    ], MailsEffect.prototype, "updateMails", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])(),
        __metadata("design:type", rxjs__WEBPACK_IMPORTED_MODULE_3__["Observable"])
    ], MailsEffect.prototype, "setCurrentMail", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])(),
        __metadata("design:type", rxjs__WEBPACK_IMPORTED_MODULE_3__["Observable"])
    ], MailsEffect.prototype, "checkCurrentMail", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])(),
        __metadata("design:type", rxjs__WEBPACK_IMPORTED_MODULE_3__["Observable"])
    ], MailsEffect.prototype, "getMailsSuccess", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])(),
        __metadata("design:type", rxjs__WEBPACK_IMPORTED_MODULE_3__["Observable"])
    ], MailsEffect.prototype, "updateMailsSuccess", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])(),
        __metadata("design:type", rxjs__WEBPACK_IMPORTED_MODULE_3__["Observable"])
    ], MailsEffect.prototype, "updateMailSuccess", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])(),
        __metadata("design:type", rxjs__WEBPACK_IMPORTED_MODULE_3__["Observable"])
    ], MailsEffect.prototype, "setFolderOnSelectedMails", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])(),
        __metadata("design:type", rxjs__WEBPACK_IMPORTED_MODULE_3__["Observable"])
    ], MailsEffect.prototype, "addLabelOnSelectedMails", void 0);
    MailsEffect = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Actions"],
            _mail_service__WEBPACK_IMPORTED_MODULE_9__["MailNgrxService"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"]])
    ], MailsEffect);
    return MailsEffect;
}());



/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/guards/index.ts":
/*!*******************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/guards/index.ts ***!
  \*******************************************************************/
/*! exports provided: ResolveGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _resolve_guard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./resolve.guard */ "./src/app/main/content/apps/mail-ngrx/store/guards/resolve.guard.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ResolveGuard", function() { return _resolve_guard__WEBPACK_IMPORTED_MODULE_0__["ResolveGuard"]; });




/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/guards/resolve.guard.ts":
/*!***************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/guards/resolve.guard.ts ***!
  \***************************************************************************/
/*! exports provided: ResolveGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResolveGuard", function() { return ResolveGuard; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../index */ "./src/app/main/content/apps/mail-ngrx/store/index.ts");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../selectors */ "./src/app/main/content/apps/mail-ngrx/store/selectors/index.ts");
/* harmony import */ var app_store_reducers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/store/reducers */ "./src/app/store/reducers/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var ResolveGuard = /** @class */ (function () {
    function ResolveGuard(store) {
        var _this = this;
        this.store = store;
        this.store.select(app_store_reducers__WEBPACK_IMPORTED_MODULE_6__["getRouterState"]).subscribe(function (routerState) {
            if (routerState) {
                _this.routerState = routerState.state;
            }
        });
    }
    ResolveGuard.prototype.canActivate = function (route, state) {
        return this.checkStore().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function () { return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(true); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(function () { return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(false); }));
    };
    ResolveGuard.prototype.checkStore = function () {
        var _this = this;
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["forkJoin"])(this.getFolders(), this.getFilters(), this.getLabels())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])(function (_a) {
            var foldersLoaded = _a[0], filtersLoaded = _a[1], labelsLoaded = _a[2];
            return filtersLoaded && foldersLoaded && labelsLoaded;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function () {
            return _this.getMails();
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function () { return _this.store.dispatch(new _index__WEBPACK_IMPORTED_MODULE_4__["SetCurrentMail"](_this.routerState.params.mailId)); }));
    };
    ResolveGuard.prototype.getFolders = function () {
        var _this = this;
        return this.store.select(_selectors__WEBPACK_IMPORTED_MODULE_5__["getFoldersLoaded"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(function (loaded) {
            if (!loaded) {
                _this.store.dispatch(new _index__WEBPACK_IMPORTED_MODULE_4__["GetFolders"]([]));
            }
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])(function (loaded) { return loaded; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1));
    };
    /**
     * Get Filters
     * @returns {Observable<any>}
     */
    ResolveGuard.prototype.getFilters = function () {
        var _this = this;
        return this.store.select(_selectors__WEBPACK_IMPORTED_MODULE_5__["getFiltersLoaded"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(function (loaded) {
            if (!loaded) {
                _this.store.dispatch(new _index__WEBPACK_IMPORTED_MODULE_4__["GetFilters"]([]));
            }
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])(function (loaded) { return loaded; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1));
    };
    /**
     * Get Labels
     * @returns {Observable<any>}
     */
    ResolveGuard.prototype.getLabels = function () {
        var _this = this;
        return this.store.select(_selectors__WEBPACK_IMPORTED_MODULE_5__["getLabelsLoaded"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(function (loaded) {
            if (!loaded) {
                _this.store.dispatch(new _index__WEBPACK_IMPORTED_MODULE_4__["GetLabels"]([]));
            }
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])(function (loaded) { return loaded; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1));
    };
    /**
     * Get Mails
     * @returns {Observable<any>}
     */
    ResolveGuard.prototype.getMails = function () {
        var _this = this;
        return this.store.select(_selectors__WEBPACK_IMPORTED_MODULE_5__["getMailsLoaded"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(function (loaded) {
            if (!_this.routerState.params[loaded.id] || _this.routerState.params[loaded.id] !== loaded.value) {
                _this.store.dispatch(new _index__WEBPACK_IMPORTED_MODULE_4__["GetMails"]());
                _this.store.dispatch(new _index__WEBPACK_IMPORTED_MODULE_4__["SetSearchText"](''));
                _this.store.dispatch(new _index__WEBPACK_IMPORTED_MODULE_4__["DeselectAllMails"]());
            }
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])(function (loaded) {
            return _this.routerState.params[loaded.id] && _this.routerState.params[loaded.id] === loaded.value;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1));
    };
    ResolveGuard = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"]])
    ], ResolveGuard);
    return ResolveGuard;
}());



/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/index.ts":
/*!************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/index.ts ***!
  \************************************************************/
/*! exports provided: getMailAppState, getAppState, reducers, effects, GET_MAILS, GET_MAILS_SUCCESS, GET_MAILS_FAILED, SET_CURRENT_MAIL, SET_CURRENT_MAIL_SUCCESS, CHECK_CURRENT_MAIL, UPDATE_MAIL, UPDATE_MAIL_SUCCESS, UPDATE_MAILS, UPDATE_MAILS_SUCCESS, SET_SEARCH_TEXT, SELECT_ALL_MAILS, DESELECT_ALL_MAILS, TOGGLE_IN_SELECTED_MAILS, SELECT_MAILS_BY_PARAMETER, SET_FOLDER_ON_SELECTED_MAILS, ADD_LABEL_ON_SELECTED_MAILS, GetMails, GetMailsSuccess, GetMailsFailed, SetCurrentMail, SetCurrentMailSuccess, CheckCurrentMail, UpdateMail, UpdateMailSuccess, UpdateMails, UpdateMailsSuccess, SetSearchText, SelectAllMails, DeselectAllMails, ToggleInSelectedMails, SelectMailsByParameter, SetFolderOnSelectedMails, AddLabelOnSelectedMails, GET_FOLDERS, GET_FOLDERS_SUCCESS, GET_FOLDERS_FAILED, GetFolders, GetFoldersSuccess, GetFoldersFailed, GET_FILTERS, GET_FILTERS_SUCCESS, GET_FILTERS_FAILED, GetFilters, GetFiltersSuccess, GetFiltersFailed, GET_LABELS, GET_LABELS_SUCCESS, GET_LABELS_FAILED, GetLabels, GetLabelsSuccess, GetLabelsFailed, MailsInitialState, MailsReducer, FoldersInitialState, FoldersReducer, FiltersInitialState, FiltersReducer, LabelsInitialState, LabelsReducer, getMailsState, getMails, getMailsLoaded, getSearchText, getMailsArr, getCurrentMail, getSelectedMailIds, getFoldersState, getFolders, getFoldersLoaded, getFoldersArr, getFiltersState, getFilters, getFiltersLoaded, getFiltersArr, getLabelsState, getLabels, getLabelsLoaded, getLabelsArr, MailsEffect, FoldersEffect, FiltersEffect, LabelsEffect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions */ "./src/app/main/content/apps/mail-ngrx/store/actions/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_MAILS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_MAILS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_MAILS_SUCCESS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_MAILS_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_MAILS_FAILED", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_MAILS_FAILED"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SET_CURRENT_MAIL", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SET_CURRENT_MAIL"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SET_CURRENT_MAIL_SUCCESS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SET_CURRENT_MAIL_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CHECK_CURRENT_MAIL", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["CHECK_CURRENT_MAIL"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UPDATE_MAIL", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["UPDATE_MAIL"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UPDATE_MAIL_SUCCESS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["UPDATE_MAIL_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UPDATE_MAILS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["UPDATE_MAILS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UPDATE_MAILS_SUCCESS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["UPDATE_MAILS_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SET_SEARCH_TEXT", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SET_SEARCH_TEXT"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SELECT_ALL_MAILS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SELECT_ALL_MAILS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DESELECT_ALL_MAILS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["DESELECT_ALL_MAILS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TOGGLE_IN_SELECTED_MAILS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["TOGGLE_IN_SELECTED_MAILS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SELECT_MAILS_BY_PARAMETER", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SELECT_MAILS_BY_PARAMETER"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SET_FOLDER_ON_SELECTED_MAILS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SET_FOLDER_ON_SELECTED_MAILS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ADD_LABEL_ON_SELECTED_MAILS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["ADD_LABEL_ON_SELECTED_MAILS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetMails", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetMails"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetMailsSuccess", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetMailsSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetMailsFailed", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetMailsFailed"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SetCurrentMail", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SetCurrentMail"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SetCurrentMailSuccess", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SetCurrentMailSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CheckCurrentMail", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["CheckCurrentMail"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UpdateMail", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["UpdateMail"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UpdateMailSuccess", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["UpdateMailSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UpdateMails", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["UpdateMails"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UpdateMailsSuccess", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["UpdateMailsSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SetSearchText", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SetSearchText"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SelectAllMails", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SelectAllMails"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DeselectAllMails", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["DeselectAllMails"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ToggleInSelectedMails", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["ToggleInSelectedMails"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SelectMailsByParameter", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SelectMailsByParameter"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SetFolderOnSelectedMails", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SetFolderOnSelectedMails"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AddLabelOnSelectedMails", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["AddLabelOnSelectedMails"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_FOLDERS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_FOLDERS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_FOLDERS_SUCCESS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_FOLDERS_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_FOLDERS_FAILED", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_FOLDERS_FAILED"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetFolders", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetFolders"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetFoldersSuccess", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetFoldersSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetFoldersFailed", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetFoldersFailed"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_FILTERS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_FILTERS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_FILTERS_SUCCESS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_FILTERS_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_FILTERS_FAILED", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_FILTERS_FAILED"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetFilters", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetFilters"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetFiltersSuccess", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetFiltersSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetFiltersFailed", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetFiltersFailed"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_LABELS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_LABELS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_LABELS_SUCCESS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_LABELS_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_LABELS_FAILED", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_LABELS_FAILED"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetLabels", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetLabels"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetLabelsSuccess", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetLabelsSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetLabelsFailed", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetLabelsFailed"]; });

/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reducers */ "./src/app/main/content/apps/mail-ngrx/store/reducers/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getMailAppState", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["getMailAppState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getAppState", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["getAppState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "reducers", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["reducers"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MailsInitialState", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["MailsInitialState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MailsReducer", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["MailsReducer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FoldersInitialState", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["FoldersInitialState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FoldersReducer", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["FoldersReducer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FiltersInitialState", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["FiltersInitialState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FiltersReducer", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["FiltersReducer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LabelsInitialState", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["LabelsInitialState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LabelsReducer", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["LabelsReducer"]; });

/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selectors */ "./src/app/main/content/apps/mail-ngrx/store/selectors/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getMailsState", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getMailsState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getMails", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getMails"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getMailsLoaded", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getMailsLoaded"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSearchText", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getSearchText"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getMailsArr", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getMailsArr"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getCurrentMail", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getCurrentMail"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSelectedMailIds", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getSelectedMailIds"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFoldersState", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getFoldersState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFolders", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getFolders"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFoldersLoaded", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getFoldersLoaded"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFoldersArr", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getFoldersArr"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFiltersState", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getFiltersState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFilters", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getFilters"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFiltersLoaded", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getFiltersLoaded"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFiltersArr", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getFiltersArr"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getLabelsState", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getLabelsState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getLabels", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getLabels"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getLabelsLoaded", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getLabelsLoaded"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getLabelsArr", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getLabelsArr"]; });

/* harmony import */ var _effects__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./effects */ "./src/app/main/content/apps/mail-ngrx/store/effects/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "effects", function() { return _effects__WEBPACK_IMPORTED_MODULE_3__["effects"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MailsEffect", function() { return _effects__WEBPACK_IMPORTED_MODULE_3__["MailsEffect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FoldersEffect", function() { return _effects__WEBPACK_IMPORTED_MODULE_3__["FoldersEffect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FiltersEffect", function() { return _effects__WEBPACK_IMPORTED_MODULE_3__["FiltersEffect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LabelsEffect", function() { return _effects__WEBPACK_IMPORTED_MODULE_3__["LabelsEffect"]; });







/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/reducers/filters.reducer.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/reducers/filters.reducer.ts ***!
  \*******************************************************************************/
/*! exports provided: FiltersInitialState, FiltersReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FiltersInitialState", function() { return FiltersInitialState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FiltersReducer", function() { return FiltersReducer; });
/* harmony import */ var _actions_filters_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/filters.actions */ "./src/app/main/content/apps/mail-ngrx/store/actions/filters.actions.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

var FiltersInitialState = {
    entities: {},
    loading: false,
    loaded: false
};
function FiltersReducer(state, action) {
    if (state === void 0) { state = FiltersInitialState; }
    switch (action.type) {
        case _actions_filters_actions__WEBPACK_IMPORTED_MODULE_0__["GET_FILTERS"]:
            return __assign({}, state, { loading: true, loaded: false });
        case _actions_filters_actions__WEBPACK_IMPORTED_MODULE_0__["GET_FILTERS_SUCCESS"]:
            var filters = action.payload;
            var entities = filters.reduce(function (_entities, filter) {
                return __assign({}, _entities, (_a = {}, _a[filter.id] = filter, _a));
                var _a;
            }, {});
            return __assign({}, state, { loading: false, loaded: true, entities: entities });
        case _actions_filters_actions__WEBPACK_IMPORTED_MODULE_0__["GET_FILTERS_FAILED"]:
            return __assign({}, state, { loading: false, loaded: false });
        default:
            return state;
    }
}


/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/reducers/folders.reducer.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/reducers/folders.reducer.ts ***!
  \*******************************************************************************/
/*! exports provided: FoldersInitialState, FoldersReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FoldersInitialState", function() { return FoldersInitialState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FoldersReducer", function() { return FoldersReducer; });
/* harmony import */ var _actions_folders_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/folders.actions */ "./src/app/main/content/apps/mail-ngrx/store/actions/folders.actions.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

var FoldersInitialState = {
    entities: {},
    loading: false,
    loaded: false
};
function FoldersReducer(state, action) {
    if (state === void 0) { state = FoldersInitialState; }
    switch (action.type) {
        case _actions_folders_actions__WEBPACK_IMPORTED_MODULE_0__["GET_FOLDERS"]:
            return __assign({}, state, { loading: true, loaded: false });
        case _actions_folders_actions__WEBPACK_IMPORTED_MODULE_0__["GET_FOLDERS_SUCCESS"]:
            var folders = action.payload;
            var entities = folders.reduce(function (_entities, folder) {
                return __assign({}, _entities, (_a = {}, _a[folder.id] = folder, _a));
                var _a;
            }, {});
            return __assign({}, state, { loading: false, loaded: true, entities: entities });
        case _actions_folders_actions__WEBPACK_IMPORTED_MODULE_0__["GET_FOLDERS_FAILED"]:
            return __assign({}, state, { loading: false, loaded: false });
        default:
            return state;
    }
}


/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/reducers/index.ts":
/*!*********************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/reducers/index.ts ***!
  \*********************************************************************/
/*! exports provided: getMailAppState, getAppState, reducers, MailsInitialState, MailsReducer, FoldersInitialState, FoldersReducer, FiltersInitialState, FiltersReducer, LabelsInitialState, LabelsReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMailAppState", function() { return getMailAppState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAppState", function() { return getAppState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reducers", function() { return reducers; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _mails_reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mails.reducer */ "./src/app/main/content/apps/mail-ngrx/store/reducers/mails.reducer.ts");
/* harmony import */ var _folders_reducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./folders.reducer */ "./src/app/main/content/apps/mail-ngrx/store/reducers/folders.reducer.ts");
/* harmony import */ var _filters_reducer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./filters.reducer */ "./src/app/main/content/apps/mail-ngrx/store/reducers/filters.reducer.ts");
/* harmony import */ var _labels_reducer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./labels.reducer */ "./src/app/main/content/apps/mail-ngrx/store/reducers/labels.reducer.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MailsInitialState", function() { return _mails_reducer__WEBPACK_IMPORTED_MODULE_1__["MailsInitialState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MailsReducer", function() { return _mails_reducer__WEBPACK_IMPORTED_MODULE_1__["MailsReducer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FoldersInitialState", function() { return _folders_reducer__WEBPACK_IMPORTED_MODULE_2__["FoldersInitialState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FoldersReducer", function() { return _folders_reducer__WEBPACK_IMPORTED_MODULE_2__["FoldersReducer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FiltersInitialState", function() { return _filters_reducer__WEBPACK_IMPORTED_MODULE_3__["FiltersInitialState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FiltersReducer", function() { return _filters_reducer__WEBPACK_IMPORTED_MODULE_3__["FiltersReducer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LabelsInitialState", function() { return _labels_reducer__WEBPACK_IMPORTED_MODULE_4__["LabelsInitialState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LabelsReducer", function() { return _labels_reducer__WEBPACK_IMPORTED_MODULE_4__["LabelsReducer"]; });






var getMailAppState = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createFeatureSelector"])('mail-app');
var getAppState = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getMailAppState, function (state) { return state; });
var reducers = {
    mails: _mails_reducer__WEBPACK_IMPORTED_MODULE_1__["MailsReducer"],
    folders: _folders_reducer__WEBPACK_IMPORTED_MODULE_2__["FoldersReducer"],
    filters: _filters_reducer__WEBPACK_IMPORTED_MODULE_3__["FiltersReducer"],
    labels: _labels_reducer__WEBPACK_IMPORTED_MODULE_4__["LabelsReducer"]
};






/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/reducers/labels.reducer.ts":
/*!******************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/reducers/labels.reducer.ts ***!
  \******************************************************************************/
/*! exports provided: LabelsInitialState, LabelsReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LabelsInitialState", function() { return LabelsInitialState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LabelsReducer", function() { return LabelsReducer; });
/* harmony import */ var _actions_labels_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/labels.actions */ "./src/app/main/content/apps/mail-ngrx/store/actions/labels.actions.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

var LabelsInitialState = {
    entities: {},
    loading: false,
    loaded: false
};
function LabelsReducer(state, action) {
    if (state === void 0) { state = LabelsInitialState; }
    switch (action.type) {
        case _actions_labels_actions__WEBPACK_IMPORTED_MODULE_0__["GET_LABELS"]:
            return __assign({}, state, { loading: true, loaded: false });
        case _actions_labels_actions__WEBPACK_IMPORTED_MODULE_0__["GET_LABELS_SUCCESS"]:
            var labels = action.payload;
            var entities = labels.reduce(function (_entities, label) {
                return __assign({}, _entities, (_a = {}, _a[label.id] = label, _a));
                var _a;
            }, {});
            return __assign({}, state, { loading: false, loaded: true, entities: entities });
        case _actions_labels_actions__WEBPACK_IMPORTED_MODULE_0__["GET_LABELS_FAILED"]:
            return __assign({}, state, { loading: false, loaded: false });
        default:
            return state;
    }
}


/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/reducers/mails.reducer.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/reducers/mails.reducer.ts ***!
  \*****************************************************************************/
/*! exports provided: MailsInitialState, MailsReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MailsInitialState", function() { return MailsInitialState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MailsReducer", function() { return MailsReducer; });
/* harmony import */ var _actions_mails_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/mails.actions */ "./src/app/main/content/apps/mail-ngrx/store/actions/mails.actions.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

var MailsInitialState = {
    entities: {},
    currentMail: null,
    selectedMailIds: [],
    searchText: '',
    loading: false,
    loaded: false
};
function MailsReducer(state, action) {
    if (state === void 0) { state = MailsInitialState; }
    switch (action.type) {
        case _actions_mails_actions__WEBPACK_IMPORTED_MODULE_0__["GET_MAILS"]:
            {
                return __assign({}, state, { loading: true });
            }
        case _actions_mails_actions__WEBPACK_IMPORTED_MODULE_0__["GET_MAILS_SUCCESS"]:
            {
                var mails = action.payload.mails;
                var loaded = action.payload.loaded;
                var entities = mails.reduce(function (_entities, mail) {
                    return __assign({}, _entities, (_a = {}, _a[mail.id] = mail, _a));
                    var _a;
                }, {});
                return __assign({}, state, { entities: entities, loading: false, loaded: loaded });
            }
        case _actions_mails_actions__WEBPACK_IMPORTED_MODULE_0__["GET_MAILS_FAILED"]:
            {
                return __assign({}, state, { loading: false, loaded: false });
            }
        case _actions_mails_actions__WEBPACK_IMPORTED_MODULE_0__["SET_CURRENT_MAIL_SUCCESS"]:
            {
                return __assign({}, state, { currentMail: action.payload });
            }
        case _actions_mails_actions__WEBPACK_IMPORTED_MODULE_0__["UPDATE_MAIL_SUCCESS"]:
            {
                return __assign({}, state, { entities: __assign({}, state.entities, (_a = {}, _a[action.payload.id] = action.payload, _a)) });
            }
        case _actions_mails_actions__WEBPACK_IMPORTED_MODULE_0__["SET_SEARCH_TEXT"]:
            {
                return __assign({}, state, { searchText: action.payload });
            }
        case _actions_mails_actions__WEBPACK_IMPORTED_MODULE_0__["TOGGLE_IN_SELECTED_MAILS"]:
            {
                var mailId_1 = action.payload;
                var selectedMailIds = state.selectedMailIds.slice();
                if (selectedMailIds.find(function (id) { return id === mailId_1; }) !== undefined) {
                    selectedMailIds = selectedMailIds.filter(function (id) { return id !== mailId_1; });
                }
                else {
                    selectedMailIds = selectedMailIds.concat([mailId_1]);
                }
                return __assign({}, state, { selectedMailIds: selectedMailIds });
            }
        case _actions_mails_actions__WEBPACK_IMPORTED_MODULE_0__["SELECT_ALL_MAILS"]:
            {
                var arr = Object.keys(state.entities).map(function (k) { return state.entities[k]; });
                var selectedMailIds = arr.map(function (mail) { return mail.id; });
                return __assign({}, state, { selectedMailIds: selectedMailIds });
            }
        case _actions_mails_actions__WEBPACK_IMPORTED_MODULE_0__["DESELECT_ALL_MAILS"]:
            {
                return __assign({}, state, { selectedMailIds: [] });
            }
        case _actions_mails_actions__WEBPACK_IMPORTED_MODULE_0__["SELECT_MAILS_BY_PARAMETER"]:
            {
                var filter_1 = action.payload;
                var arr = Object.keys(state.entities).map(function (k) { return state.entities[k]; });
                var selectedMailIds = arr.filter(function (mail) { return mail[filter_1.parameter] === filter_1.value; })
                    .map(function (mail) { return mail.id; });
                return __assign({}, state, { selectedMailIds: selectedMailIds });
            }
        case _actions_mails_actions__WEBPACK_IMPORTED_MODULE_0__["SET_FOLDER_ON_SELECTED_MAILS"]:
            {
                var entities_1 = __assign({}, state.entities);
                state.selectedMailIds.map(function (id) {
                    entities_1[id] = __assign({}, entities_1[id], { folder: action.payload });
                });
                return __assign({}, state, { entities: entities_1 });
            }
        default:
            return state;
    }
    var _a;
}


/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/selectors/filters.selectors.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/selectors/filters.selectors.ts ***!
  \**********************************************************************************/
/*! exports provided: getFiltersState, getFilters, getFiltersLoaded, getFiltersArr */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFiltersState", function() { return getFiltersState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFilters", function() { return getFilters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFiltersLoaded", function() { return getFiltersLoaded; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFiltersArr", function() { return getFiltersArr; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reducers */ "./src/app/main/content/apps/mail-ngrx/store/reducers/index.ts");


var getFiltersState = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(_reducers__WEBPACK_IMPORTED_MODULE_1__["getMailAppState"], function (state) { return state.filters; });
var getFilters = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getFiltersState, function (state) { return state.entities; });
var getFiltersLoaded = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getFiltersState, function (state) { return state.loaded; });
var getFiltersArr = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getFilters, function (entities) { return Object.keys(entities).map(function (id) { return entities[id]; }); });


/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/selectors/folders.selectors.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/selectors/folders.selectors.ts ***!
  \**********************************************************************************/
/*! exports provided: getFoldersState, getFolders, getFoldersLoaded, getFoldersArr */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFoldersState", function() { return getFoldersState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFolders", function() { return getFolders; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFoldersLoaded", function() { return getFoldersLoaded; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFoldersArr", function() { return getFoldersArr; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reducers */ "./src/app/main/content/apps/mail-ngrx/store/reducers/index.ts");


var getFoldersState = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(_reducers__WEBPACK_IMPORTED_MODULE_1__["getMailAppState"], function (state) { return state.folders; });
var getFolders = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getFoldersState, function (state) { return state.entities; });
var getFoldersLoaded = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getFoldersState, function (state) { return state.loaded; });
var getFoldersArr = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getFolders, function (entities) { return Object.keys(entities).map(function (id) { return entities[id]; }); });


/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/selectors/index.ts":
/*!**********************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/selectors/index.ts ***!
  \**********************************************************************/
/*! exports provided: getMailsState, getMails, getMailsLoaded, getSearchText, getMailsArr, getCurrentMail, getSelectedMailIds, getFoldersState, getFolders, getFoldersLoaded, getFoldersArr, getFiltersState, getFilters, getFiltersLoaded, getFiltersArr, getLabelsState, getLabels, getLabelsLoaded, getLabelsArr */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mails_selectors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mails.selectors */ "./src/app/main/content/apps/mail-ngrx/store/selectors/mails.selectors.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getMailsState", function() { return _mails_selectors__WEBPACK_IMPORTED_MODULE_0__["getMailsState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getMails", function() { return _mails_selectors__WEBPACK_IMPORTED_MODULE_0__["getMails"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getMailsLoaded", function() { return _mails_selectors__WEBPACK_IMPORTED_MODULE_0__["getMailsLoaded"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSearchText", function() { return _mails_selectors__WEBPACK_IMPORTED_MODULE_0__["getSearchText"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getMailsArr", function() { return _mails_selectors__WEBPACK_IMPORTED_MODULE_0__["getMailsArr"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getCurrentMail", function() { return _mails_selectors__WEBPACK_IMPORTED_MODULE_0__["getCurrentMail"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSelectedMailIds", function() { return _mails_selectors__WEBPACK_IMPORTED_MODULE_0__["getSelectedMailIds"]; });

/* harmony import */ var _folders_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./folders.selectors */ "./src/app/main/content/apps/mail-ngrx/store/selectors/folders.selectors.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFoldersState", function() { return _folders_selectors__WEBPACK_IMPORTED_MODULE_1__["getFoldersState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFolders", function() { return _folders_selectors__WEBPACK_IMPORTED_MODULE_1__["getFolders"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFoldersLoaded", function() { return _folders_selectors__WEBPACK_IMPORTED_MODULE_1__["getFoldersLoaded"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFoldersArr", function() { return _folders_selectors__WEBPACK_IMPORTED_MODULE_1__["getFoldersArr"]; });

/* harmony import */ var _filters_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./filters.selectors */ "./src/app/main/content/apps/mail-ngrx/store/selectors/filters.selectors.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFiltersState", function() { return _filters_selectors__WEBPACK_IMPORTED_MODULE_2__["getFiltersState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFilters", function() { return _filters_selectors__WEBPACK_IMPORTED_MODULE_2__["getFilters"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFiltersLoaded", function() { return _filters_selectors__WEBPACK_IMPORTED_MODULE_2__["getFiltersLoaded"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFiltersArr", function() { return _filters_selectors__WEBPACK_IMPORTED_MODULE_2__["getFiltersArr"]; });

/* harmony import */ var _labels_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./labels.selectors */ "./src/app/main/content/apps/mail-ngrx/store/selectors/labels.selectors.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getLabelsState", function() { return _labels_selectors__WEBPACK_IMPORTED_MODULE_3__["getLabelsState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getLabels", function() { return _labels_selectors__WEBPACK_IMPORTED_MODULE_3__["getLabels"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getLabelsLoaded", function() { return _labels_selectors__WEBPACK_IMPORTED_MODULE_3__["getLabelsLoaded"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getLabelsArr", function() { return _labels_selectors__WEBPACK_IMPORTED_MODULE_3__["getLabelsArr"]; });







/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/selectors/labels.selectors.ts":
/*!*********************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/selectors/labels.selectors.ts ***!
  \*********************************************************************************/
/*! exports provided: getLabelsState, getLabels, getLabelsLoaded, getLabelsArr */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLabelsState", function() { return getLabelsState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLabels", function() { return getLabels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLabelsLoaded", function() { return getLabelsLoaded; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLabelsArr", function() { return getLabelsArr; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reducers */ "./src/app/main/content/apps/mail-ngrx/store/reducers/index.ts");


var getLabelsState = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(_reducers__WEBPACK_IMPORTED_MODULE_1__["getMailAppState"], function (state) { return state.labels; });
var getLabels = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getLabelsState, function (state) { return state.entities; });
var getLabelsLoaded = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getLabelsState, function (state) { return state.loaded; });
var getLabelsArr = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getLabels, function (entities) { return Object.keys(entities).map(function (id) { return entities[id]; }); });


/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/selectors/mails.selectors.ts":
/*!********************************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/selectors/mails.selectors.ts ***!
  \********************************************************************************/
/*! exports provided: getMailsState, getMails, getMailsLoaded, getSearchText, getMailsArr, getCurrentMail, getSelectedMailIds */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMailsState", function() { return getMailsState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMails", function() { return getMails; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMailsLoaded", function() { return getMailsLoaded; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSearchText", function() { return getSearchText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMailsArr", function() { return getMailsArr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrentMail", function() { return getCurrentMail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSelectedMailIds", function() { return getSelectedMailIds; });
/* harmony import */ var _fuse_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @fuse/utils */ "./src/@fuse/utils/index.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../reducers */ "./src/app/main/content/apps/mail-ngrx/store/reducers/index.ts");



var getMailsState = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(_reducers__WEBPACK_IMPORTED_MODULE_2__["getMailAppState"], function (state) { return state.mails; });
var getMails = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getMailsState, function (state) { return state.entities; });
var getMailsLoaded = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getMailsState, function (state) { return state.loaded; });
var getSearchText = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getMailsState, function (state) { return state.searchText; });
var getMailsArr = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getMails, getSearchText, function (entities, searchText) {
    var arr = Object.keys(entities).map(function (id) { return entities[id]; });
    return _fuse_utils__WEBPACK_IMPORTED_MODULE_0__["FuseUtils"].filterArrayByString(arr, searchText);
});
var getCurrentMail = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getMailsState, function (state) { return state.currentMail; });
var getSelectedMailIds = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getMailsState, function (state) { return state.selectedMailIds; });


/***/ }),

/***/ "./src/app/main/content/apps/mail-ngrx/store/store.module.ts":
/*!*******************************************************************!*\
  !*** ./src/app/main/content/apps/mail-ngrx/store/store.module.ts ***!
  \*******************************************************************/
/*! exports provided: MailAppStoreModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MailAppStoreModule", function() { return MailAppStoreModule; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./reducers */ "./src/app/main/content/apps/mail-ngrx/store/reducers/index.ts");
/* harmony import */ var _effects__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./effects */ "./src/app/main/content/apps/mail-ngrx/store/effects/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var MailAppStoreModule = /** @class */ (function () {
    function MailAppStoreModule() {
    }
    MailAppStoreModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _ngrx_store__WEBPACK_IMPORTED_MODULE_0__["StoreModule"].forFeature('mail-app', _reducers__WEBPACK_IMPORTED_MODULE_3__["reducers"]),
                _ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["EffectsModule"].forFeature(_effects__WEBPACK_IMPORTED_MODULE_4__["effects"])
            ],
            providers: []
        })
    ], MailAppStoreModule);
    return MailAppStoreModule;
}());



/***/ })

}]);
//# sourceMappingURL=mail-ngrx-mail-module.js.map