(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main-content-apps-apps-module"],{

/***/ "./src/app/main/content/apps/apps.module.ts":
/*!**************************************************!*\
  !*** ./src/app/main/content/apps/apps.module.ts ***!
  \**************************************************/
/*! exports provided: FuseAppsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FuseAppsModule", function() { return FuseAppsModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _fuse_shared_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fuse/shared.module */ "./src/@fuse/shared.module.ts");
/* harmony import */ var _material_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../material.module */ "./src/app/material.module.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var routes = [
    {
        path: 'anasayfa',
        loadChildren: './dashboards/analytics/analytics.module#FuseAnalyticsDashboardModule'
    },
    {
        path: 'mail',
        loadChildren: './mail-ngrx/mail.module#FuseMailNgrxModule'
    },
    {
        path: 'sorudeposu',
        loadChildren: './sorular/sorular.module#SorularModule'
    },
    {
        path: 'uyelik',
        loadChildren: './uyelik/uyelik.module#UyelikModule'
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'anasayfa'
    }
];
var FuseAppsModule = /** @class */ (function () {
    function FuseAppsModule() {
    }
    FuseAppsModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _fuse_shared_module__WEBPACK_IMPORTED_MODULE_2__["FuseSharedModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes),
                _material_module__WEBPACK_IMPORTED_MODULE_3__["MaterialModule"]
            ],
            declarations: []
        })
    ], FuseAppsModule);
    return FuseAppsModule;
}());



/***/ })

}]);
//# sourceMappingURL=main-content-apps-apps-module.js.map