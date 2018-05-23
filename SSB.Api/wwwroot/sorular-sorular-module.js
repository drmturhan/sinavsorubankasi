(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["sorular-sorular-module"],{

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),

/***/ "./node_modules/rxjs-compat/_esm5/BehaviorSubject.js":
/*!***********************************************************!*\
  !*** ./node_modules/rxjs-compat/_esm5/BehaviorSubject.js ***!
  \***********************************************************/
/*! exports provided: BehaviorSubject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BehaviorSubject", function() { return rxjs__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"]; });


//# sourceMappingURL=BehaviorSubject.js.map

/***/ }),

/***/ "./node_modules/rxjs-compat/_esm5/Subject.js":
/*!***************************************************!*\
  !*** ./node_modules/rxjs-compat/_esm5/Subject.js ***!
  \***************************************************/
/*! exports provided: Subject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Subject", function() { return rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]; });


//# sourceMappingURL=Subject.js.map

/***/ }),

/***/ "./node_modules/rxjs-compat/_esm5/add/operator/catch.js":
/*!**************************************************************!*\
  !*** ./node_modules/rxjs-compat/_esm5/add/operator/catch.js ***!
  \**************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _operator_catch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../operator/catch */ "./node_modules/rxjs-compat/_esm5/operator/catch.js");


rxjs__WEBPACK_IMPORTED_MODULE_0__["Observable"].prototype.catch = _operator_catch__WEBPACK_IMPORTED_MODULE_1__["_catch"];
rxjs__WEBPACK_IMPORTED_MODULE_0__["Observable"].prototype._catch = _operator_catch__WEBPACK_IMPORTED_MODULE_1__["_catch"];
//# sourceMappingURL=catch.js.map

/***/ }),

/***/ "./node_modules/rxjs-compat/_esm5/operator/catch.js":
/*!**********************************************************!*\
  !*** ./node_modules/rxjs-compat/_esm5/operator/catch.js ***!
  \**********************************************************/
/*! exports provided: _catch */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_catch", function() { return _catch; });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");

/**
 * Catches errors on the observable to be handled by returning a new observable or throwing an error.
 *
 * <img src="./img/catch.png" width="100%">
 *
 * @example <caption>Continues with a different Observable when there's an error</caption>
 *
 * Observable.of(1, 2, 3, 4, 5)
 *   .map(n => {
 * 	   if (n == 4) {
 * 	     throw 'four!';
 *     }
 *	   return n;
 *   })
 *   .catch(err => Observable.of('I', 'II', 'III', 'IV', 'V'))
 *   .subscribe(x => console.log(x));
 *   // 1, 2, 3, I, II, III, IV, V
 *
 * @example <caption>Retries the caught source Observable again in case of error, similar to retry() operator</caption>
 *
 * Observable.of(1, 2, 3, 4, 5)
 *   .map(n => {
 * 	   if (n === 4) {
 * 	     throw 'four!';
 *     }
 * 	   return n;
 *   })
 *   .catch((err, caught) => caught)
 *   .take(30)
 *   .subscribe(x => console.log(x));
 *   // 1, 2, 3, 1, 2, 3, ...
 *
 * @example <caption>Throws a new error when the source Observable throws an error</caption>
 *
 * Observable.of(1, 2, 3, 4, 5)
 *   .map(n => {
 *     if (n == 4) {
 *       throw 'four!';
 *     }
 *     return n;
 *   })
 *   .catch(err => {
 *     throw 'error in source. Details: ' + err;
 *   })
 *   .subscribe(
 *     x => console.log(x),
 *     err => console.log(err)
 *   );
 *   // 1, 2, 3, error in source. Details: four!
 *
 * @param {function} selector a function that takes as arguments `err`, which is the error, and `caught`, which
 *  is the source observable, in case you'd like to "retry" that observable by returning it again. Whatever observable
 *  is returned by the `selector` will be used to continue the observable chain.
 * @return {Observable} An observable that originates from either the source or the observable returned by the
 *  catch `selector` function.
 * @method catch
 * @name catch
 * @owner Observable
 */
function _catch(selector) {
    return Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["catchError"])(selector)(this);
}
//# sourceMappingURL=catch.js.map

/***/ }),

/***/ "./src/app/main/content/apps/sorular/anahtar-kelimeler/anahtar-kelimeler.component.html":
/*!**********************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/anahtar-kelimeler/anahtar-kelimeler.component.html ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ekran\" fxLayout=\"column\" fxLayoutAlign=\"start stretch\" fxLayoutGap=\"20px\" fxFlex=\"1 1 auto\">\n  <div class=\"araclar\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\n    <mat-form-field fxFlex=\"auto\">\n      <input #akInput class=\"anahtar-kelime-input\" matInput placeholder=\"Anahtar kelime\" [formControl]=\"yeniAnahtarKelime\" (keypress)=\"enterBasildi($event)\">\n      <mat-error *ngIf=\"yeniAnahtarKelime.hasError('required')\">\n        Anahtar kelime girmediniz.\n      </mat-error>\n      <mat-error *ngIf=\"yeniAnahtarKelime.hasError('minlength')\">\n        En az 3 karakter olmalıdır.\n      </mat-error>\n      <mat-hint>Anahtar kelime girip ENTER a basınız.</mat-hint>\n    </mat-form-field>\n    <div fxFlex=\"100px\">\n      <button mat-button (click)=\"ekle()\" [disabled]=\"!yeniAnahtarKelime.valid\" class=\"mat-icon-button\">\n        <mat-icon matTooltip=\"Anahtar kelime ekle\">add_box</mat-icon>\n      </button>\n      <button mat-button (click)=\"tumunuSil()\" class=\"mat-icon-button\">\n        <mat-icon matTooltip=\"Anahtar kelimelerin hepsini sil.\">delete_sweep</mat-icon>\n      </button>\n    </div>\n  </div>\n\n  <div class=\"liste\">\n    <ol *ngIf=\"anahtarKelimelerArr\">\n      <li *ngFor=\"let control of anahtarKelimelerArr.controls\">\n        <div class=\"satir\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\" fxFlex=\"auto\">\n          <div>{{control.value}}</div>\n          <button mat-button class=\"sil mat-icon-button\" (click)=\"sil(control)\" matTooltip=\"Aktif anahtar kelimeyi sil.\">\n            <mat-icon style=\"color:white!important\">delete</mat-icon>\n          </button>\n        </div>\n      </li>\n    </ol>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/anahtar-kelimeler/anahtar-kelimeler.component.scss":
/*!**********************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/anahtar-kelimeler/anahtar-kelimeler.component.scss ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n:host .ekran {\n  padding: 10%;\n  padding-top: 48px;\n  height: 60vh; }\n:host .araclar .mat-input-element {\n  color: #406D95; }\n:host .liste {\n  padding: 100px;\n  padding-top: 24px; }\n:host .liste ol {\n    counter-reset: li;\n    list-style: none;\n    *list-style: decimal;\n    font-size: 15px;\n    padding: 0;\n    margin-bottom: 4em; }\n:host .liste ol ol {\n    margin: 0 0 0 2em; }\n:host .liste li {\n    position: relative;\n    display: block;\n    padding: .4em .4em .4em 2em;\n    *padding: .4em;\n    margin: .5em 0;\n    background: #D8E8E9;\n    color: #406D95;\n    text-decoration: none;\n    transition: all .5s ease-in-out; }\n:host .liste li:hover {\n    background: #406D95;\n    color: #D8E8E9;\n    -webkit-transform: scale(1.1);\n            transform: scale(1.1); }\n:host .liste li:hover .sil {\n      display: block;\n      color: white; }\n:host .liste li:before {\n    content: counter(li);\n    counter-increment: li;\n    position: absolute;\n    left: -1.2em;\n    top: 50%;\n    margin-top: -1.2em;\n    background: #A8D0DA;\n    height: 2em;\n    width: 2em;\n    line-height: 2em;\n    text-align: center;\n    font-weight: bold;\n    color: #FFF; }\n:host .sil {\n  display: none;\n  margin-right: 8px; }\n:host .mat-icon-button {\n  color: #406D95; }\n"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/anahtar-kelimeler/anahtar-kelimeler.component.ts":
/*!********************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/anahtar-kelimeler/anahtar-kelimeler.component.ts ***!
  \********************************************************************************************/
/*! exports provided: AnahtarKelimelerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnahtarKelimelerComponent", function() { return AnahtarKelimelerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _core_services_sb_mesaj_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../core/services/sb-mesaj.service */ "./src/app/core/services/sb-mesaj.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AnahtarKelimelerComponent = /** @class */ (function () {
    function AnahtarKelimelerComponent(cdRef, mesajService) {
        this.cdRef = cdRef;
        this.mesajService = mesajService;
        this.bosalt = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.yeniAnahtarKelime = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(3)]);
    }
    AnahtarKelimelerComponent.prototype.enterBasildi = function (event) {
        if (event && event.keyCode === 13) {
            event.stopPropagation();
            event.preventDefault();
            this.ekle();
        }
    };
    AnahtarKelimelerComponent.prototype.ekle = function () {
        if (this.yeniAnahtarKelime.valid) {
            if (this.anahtarKelimelerArr && this.anahtarKelimelerArr.length >= 5) {
                this.mesajService.hata({ kod: '', tanim: 'En fazla 5 anahtar kelime girebilirsiniz.' });
                return;
            }
            this.anahtarKelimelerArr.push(new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.yeniAnahtarKelime.value));
            this.anahtarKelimelerArr.markAsDirty();
            this.cdRef.detectChanges();
            this.elAnahtarKelime.nativeElement.focus();
            this.elAnahtarKelime.nativeElement.value = '';
        }
    };
    AnahtarKelimelerComponent.prototype.sil = function (kontrol) {
        var indeks = this.anahtarKelimelerArr.controls.indexOf(kontrol);
        if (indeks >= 0) {
            this.anahtarKelimelerArr.removeAt(indeks);
        }
    };
    AnahtarKelimelerComponent.prototype.tumunuSil = function () {
        this.bosalt.emit();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])('anahtar-kelimeler'),
        __metadata("design:type", _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormArray"])
    ], AnahtarKelimelerComponent.prototype, "anahtarKelimelerArr", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], AnahtarKelimelerComponent.prototype, "bosalt", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('akInput'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], AnahtarKelimelerComponent.prototype, "elAnahtarKelime", void 0);
    AnahtarKelimelerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-anahtar-kelimeler',
            template: __webpack_require__(/*! ./anahtar-kelimeler.component.html */ "./src/app/main/content/apps/sorular/anahtar-kelimeler/anahtar-kelimeler.component.html"),
            styles: [__webpack_require__(/*! ./anahtar-kelimeler.component.scss */ "./src/app/main/content/apps/sorular/anahtar-kelimeler/anahtar-kelimeler.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"],
            _core_services_sb_mesaj_service__WEBPACK_IMPORTED_MODULE_2__["SbMesajService"]])
    ], AnahtarKelimelerComponent);
    return AnahtarKelimelerComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/coktan-secmeli-iliskili-soru.component.html":
/*!********************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/coktan-secmeli-iliskili-soru.component.html ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n<div id=\"soru\" class=\"page-layout carded left-sidenav\" fusePerfectScrollbar>\n  <!-- TOP BACKGROUND -->\n  <div class=\"top-bg\" style=\"background-color: #E2474C\"></div>\n  <!-- / TOP BACKGROUND -->\n\n  <mat-sidenav-container>\n\n    <div class=\"center\">\n          <!-- CONTENT HEADER -->\n          <div class=\"header\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\n\n            <div class=\"search-wrapper\" fxFlex fxLayout=\"row\" fxLayoutAlign=\"start center\">\n                  <button mat-button class=\"mat-icon-button sidenav-toggle\" fuseMatSidenavToggler=\"carded-left-sidenav\" fxHide.gt-md aria-label=\"Toggle Sidenav\">\n                      <mat-icon>menu</mat-icon>\n                  </button>\n\n                  <div class=\"search\" flex fxLayout=\"row\" fxLayoutAlign=\"start center\">\n                      <mat-icon style=\"color:#2F3A57\">home</mat-icon>\n                      <div class=\"baslik\">\n                          {{baslik}}\n                      </div>\n                  </div>\n\n              </div>\n          </div>\n          <!-- / CONTENT HEADER -->\n\n          <!-- CONTENT CARD -->\n          <div class=\"content-card\" style=\"background-color:#A8D0DA\" [ngClass]=\"{'current-mail-selected':aktifSoru$ | async}\">\n\n              <!-- CONTENT TOOLBAR -->\n              <div class=\"toolbar px-24 py-8\">\n                  <div class=\"mail-selection\" fxFlex=\"row\" fxLayoutAlign=\"start center\">\n\n                      <mat-checkbox (click)=\"toggleSelectAll($event)\" [checked]=\"hasSelectedSorular\" [indeterminate]=\"isIndeterminate\">\n                      </mat-checkbox>\n\n                      <button mat-icon-button [matMenuTriggerFor]=\"selectMenu\">\n                          <mat-icon>arrow_drop_down</mat-icon>\n                      </button>\n                      <mat-menu #selectMenu=\"matMenu\">\n                          <button mat-menu-item (click)=\"tumSorulariSec()\">Tümü</button>\n                          <button mat-menu-item (click)=\"hicSoruSecilmesin()\">Hiçbiri</button>\n                          <!-- <button mat-menu-item (click)=\"selectMailsByParameter('read', true)\">Read</button>\n                          <button mat-menu-item (click)=\"selectMailsByParameter('read', false)\">Unread</button>\n                          <button mat-menu-item (click)=\"selectMailsByParameter('starred', true)\">Starred</button>\n                          <button mat-menu-item (click)=\"selectMailsByParameter('starred', false)\">Unstarred</button>\n                          <button mat-menu-item (click)=\"selectMailsByParameter('important', true)\">Important</button>\n                          <button mat-menu-item (click)=\"selectMailsByParameter('important', false)\">Unimportant</button> -->\n                      </mat-menu>\n\n                      <div class=\"toolbar-separator\" *ngIf=\"hasSelectedSorular\"></div>\n\n                      <button mat-button class=\"mat-icon-button\" (click)=\"seciliSorulariSil()\" *ngIf=\"hasSelectedSorular\">\n                          <mat-icon matTooltip=\"Seçilmiş {{selectedSorularIds.length}} soruyu siler.\">delete</mat-icon>\n                      </button>\n\n                      <span *ngIf=\"hasSelectedSorular\">{{selectedSorularIds.length}} soru seçildi.</span>\n\n                      <!-- <button mat-icon-button [matMenuTriggerFor]=\"folderMenu\" *ngIf=\"hasSelectedSorular\">\n                          <mat-icon>folder</mat-icon>\n                      </button> -->\n                      <!-- <mat-menu #folderMenu=\"matMenu\">\n                          <button mat-menu-item *ngFor=\"let folder of folders$ | async\"\n                                  (click)=\"setFolderOnSelectedMails(folder.id)\">{{folder.title}}\n                          </button>\n                      </mat-menu> -->\n\n                      <!-- <button mat-icon-button [matMenuTriggerFor]=\"labelMenu\" *ngIf=\"hasSelectedSorular\">\n                          <mat-icon>label</mat-icon>\n                      </button>\n                      <mat-menu #labelMenu=\"matMenu\">\n                          <button mat-menu-item *ngFor=\"let label of labels$ | async\"\n                                  (click)=\"toggleLabelOnSelectedMails(label.id)\">{{label.title}}\n                          </button>\n                      </mat-menu> -->\n                  </div>\n\n                  <div *ngIf=\"aktifSoru$ | async\" fxHide.gt-xs>\n                      <button mat-icon-button (click)=\"aktifSoruyuBosYap()\">\n                          <mat-icon>arrow_back</mat-icon>\n                      </button>\n                  </div>\n\n              </div>\n\n              <!-- / CONTENT TOOLBAR -->\n              <!-- CONTENT -->\n              <div class=\"content\" fxLayoutAlign=\"row\">\n                  \n                      <fuse-soru-listesi fusePerfectScrollbar fxFlex [sorular]=\"sorular$ | async\" [aktifSoru]=\"aktifSoru$|async\" (sorudegisti)=\"soruGoster($event)\"></fuse-soru-listesi>\n                      <fuse-soru-detay [soru]=\"aktifSoru$|async\" fusePerfectScrollbar fxflex> </fuse-soru-detay>\n                  \n              </div>\n              <!-- / CONTENT -->\n\n          </div>\n          <!-- / CONTENT CARD -->\n\n      </div>\n      <!-- / SIDENAV -->\n  </mat-sidenav-container>\n</div>"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/coktan-secmeli-iliskili-soru.component.scss":
/*!********************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/coktan-secmeli-iliskili-soru.component.scss ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/coktan-secmeli-iliskili-soru.component.ts":
/*!******************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/coktan-secmeli-iliskili-soru.component.ts ***!
  \******************************************************************************************************************/
/*! exports provided: CoktanSecmeliIliskiliSoruComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoktanSecmeliIliskiliSoruComponent", function() { return CoktanSecmeliIliskiliSoruComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _fuse_components_confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fuse/components/confirm-dialog/confirm-dialog.component */ "./src/@fuse/components/confirm-dialog/confirm-dialog.component.ts");
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



var CoktanSecmeliIliskiliSoruComponent = /** @class */ (function () {
    function CoktanSecmeliIliskiliSoruComponent(dialog) {
        this.dialog = dialog;
    }
    CoktanSecmeliIliskiliSoruComponent.prototype.ngOnInit = function () {
    };
    CoktanSecmeliIliskiliSoruComponent.prototype.toggleSelectAll = function (ev) {
        ev.preventDefault();
        if (this.selectedSorularIds.length && this.selectedSorularIds.length > 0) {
            this.hicSoruSecilmesin();
        }
        else {
            this.tumSorulariSec();
        }
    };
    CoktanSecmeliIliskiliSoruComponent.prototype.tumSorulariSec = function () {
    };
    CoktanSecmeliIliskiliSoruComponent.prototype.hicSoruSecilmesin = function () {
    };
    CoktanSecmeliIliskiliSoruComponent.prototype.seciliSorulariSil = function () {
        var dialogRef = this.dialog.open(_fuse_components_confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_1__["FuseConfirmDialogComponent"], {
            width: '600px',
            height: '400',
            data: {
                onaybasligi: 'Silme onayı!',
                onaymesaji: "<p>Silinsin derseniz listede se\u00E7ilmi\u015F olan sorular\u0131n (" + this.selectedSorularIds.length + " soru) hepsi sistemden tamamen silinecek!</p> Soru(lar) silinsin mi?",
                olumluButonYazisi: 'Silinsin',
                olumsuzButonYazisi: 'Vazgeçtim'
            }
        });
    };
    CoktanSecmeliIliskiliSoruComponent.prototype.aktifSoruyuBosYap = function () {
    };
    CoktanSecmeliIliskiliSoruComponent.prototype.soruGoster = function (degisenSoruId) {
    };
    CoktanSecmeliIliskiliSoruComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-coktan-secmeli-iliskili-soru',
            template: __webpack_require__(/*! ./coktan-secmeli-iliskili-soru.component.html */ "./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/coktan-secmeli-iliskili-soru.component.html"),
            styles: [__webpack_require__(/*! ./coktan-secmeli-iliskili-soru.component.scss */ "./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/coktan-secmeli-iliskili-soru.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"]])
    ], CoktanSecmeliIliskiliSoruComponent);
    return CoktanSecmeliIliskiliSoruComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-item/iliskili-soru-item.component.html":
/*!***************************************************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-item/iliskili-soru-item.component.html ***!
  \***************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  iliskili-soru-item works!\n</p>\n"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-item/iliskili-soru-item.component.scss":
/*!***************************************************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-item/iliskili-soru-item.component.scss ***!
  \***************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-item/iliskili-soru-item.component.ts":
/*!*************************************************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-item/iliskili-soru-item.component.ts ***!
  \*************************************************************************************************************************************************/
/*! exports provided: IliskiliSoruItemComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IliskiliSoruItemComponent", function() { return IliskiliSoruItemComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var IliskiliSoruItemComponent = /** @class */ (function () {
    function IliskiliSoruItemComponent() {
    }
    IliskiliSoruItemComponent.prototype.ngOnInit = function () {
    };
    IliskiliSoruItemComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-iliskili-soru-item',
            template: __webpack_require__(/*! ./iliskili-soru-item.component.html */ "./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-item/iliskili-soru-item.component.html"),
            styles: [__webpack_require__(/*! ./iliskili-soru-item.component.scss */ "./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-item/iliskili-soru-item.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], IliskiliSoruItemComponent);
    return IliskiliSoruItemComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-listesi.component.html":
/*!***********************************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-listesi.component.html ***!
  \***********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  iliskili-soru-listesi works!\n</p>\n"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-listesi.component.scss":
/*!***********************************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-listesi.component.scss ***!
  \***********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-listesi.component.ts":
/*!*********************************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-listesi.component.ts ***!
  \*********************************************************************************************************************************/
/*! exports provided: IliskiliSoruListesiComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IliskiliSoruListesiComponent", function() { return IliskiliSoruListesiComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var IliskiliSoruListesiComponent = /** @class */ (function () {
    function IliskiliSoruListesiComponent() {
    }
    IliskiliSoruListesiComponent.prototype.ngOnInit = function () {
    };
    IliskiliSoruListesiComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-iliskili-soru-listesi',
            template: __webpack_require__(/*! ./iliskili-soru-listesi.component.html */ "./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-listesi.component.html"),
            styles: [__webpack_require__(/*! ./iliskili-soru-listesi.component.scss */ "./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-listesi.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], IliskiliSoruListesiComponent);
    return IliskiliSoruListesiComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-soru-secenek.service.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-soru-secenek.service.ts ***!
  \**********************************************************************************/
/*! exports provided: CoktanSecmeliSoruSecenekService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoktanSecmeliSoruSecenekService", function() { return CoktanSecmeliSoruSecenekService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_BehaviorSubject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/BehaviorSubject */ "./node_modules/rxjs-compat/_esm5/BehaviorSubject.js");
/* harmony import */ var rxjs_Subject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/Subject */ "./node_modules/rxjs-compat/_esm5/Subject.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var CoktanSecmeliSoruSecenekService = /** @class */ (function () {
    function CoktanSecmeliSoruSecenekService(formBuilder) {
        var _this = this;
        this.formBuilder = formBuilder;
        this.searchText = '';
        this.secilebilirOgrenimHedefleriDegisti = new rxjs_BehaviorSubject__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]([]);
        this.formDegisti = new rxjs_BehaviorSubject__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](null);
        this.dogruSecenekSayisiDegisti = new rxjs_BehaviorSubject__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](0);
        this.hemenElenebilirSecenekSayisiDegisti = new rxjs_BehaviorSubject__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](0);
        this.kabulEdilebilirkikIndeksiDegisti = new rxjs_BehaviorSubject__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](0);
        this.onSelectedTodosChanged = new rxjs_BehaviorSubject__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]([]);
        this.onCurrentTodoChanged = new rxjs_BehaviorSubject__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](null);
        // onSelectedOgrenimHedefleriChanged: BehaviorSubject<any> = new BehaviorSubject([]);
        this.onFiltersChanged = new rxjs_BehaviorSubject__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]([]);
        this.onTagsChanged = new rxjs_BehaviorSubject__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]([]);
        this.onSearchTextChanged = new rxjs_BehaviorSubject__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]('');
        this.onNewTodoClicked = new rxjs_Subject__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.yeniSecenekNumarasi = 0;
        this.selectedTodos = [];
        // this.selectedOgrenimHedefleri = [];
        this.onNewTodoClicked.subscribe(function () {
            _this.yeniSenecekNumarasiniBelirle();
            _this.yeniSecenegiFormaKoy();
        });
        this.secilebilirOgrenimHedefleriDegisti.subscribe(function (hedefler) {
            _this.secilebilirOgrenimHedefleri = hedefler;
        });
    }
    Object.defineProperty(CoktanSecmeliSoruSecenekService.prototype, "seceneklerFormArray", {
        get: function () {
            return this.soruForm ? this.soruForm.get('secenekler') : null;
        },
        enumerable: true,
        configurable: true
    });
    CoktanSecmeliSoruSecenekService.prototype.yeniSecenegiFormaKoy = function () {
        if (this.soruForm) {
            var yeniForm = this.yeniSecenekFormuYarat();
            this.soruForm.get('secenekler').push(yeniForm);
            this.onCurrentTodoChanged.next(yeniForm);
        }
    };
    CoktanSecmeliSoruSecenekService.prototype.yeniSenecekNumarasiniBelirle = function () {
        var _this = this;
        if (this.seceneklerFormArray) {
            this.seceneklerFormArray.controls.forEach(function (ctrl) {
                var deger = ctrl.get('tekDogruluSoruSecenekId').value;
                var enKucukDeger = 0;
                if (deger < enKucukDeger) {
                    enKucukDeger = deger;
                }
                if (_this.yeniSecenekNumarasi > enKucukDeger) {
                    _this.yeniSecenekNumarasi = enKucukDeger;
                }
            });
        }
    };
    CoktanSecmeliSoruSecenekService.prototype.yeniSecenekFormuYarat = function () {
        this.yeniSecenekNumarasi = this.yeniSecenekNumarasi - 1;
        return this.formBuilder.group({
            tekDogruluSoruSecenekId: this.yeniSecenekNumarasi,
            secenekMetni: [''],
            dogruSecenek: [false],
            hemenElenebilir: [false]
        });
    };
    CoktanSecmeliSoruSecenekService.prototype.toogleDogruSecenek = function (id) {
        if (this.soruForm) {
            for (var index = 0; index < this.soruForm.get('secenekler').controls.length; index++) {
                var element = this.soruForm.get('secenekler').controls[index];
                if (element.get('tekDogruluSoruSecenekId').value === id) {
                    var deger = element.get('dogruSecenek').value;
                    element.patchValue({ dogruSecenek: !deger });
                    this.onCurrentTodoChanged.next(element);
                }
            }
        }
    };
    CoktanSecmeliSoruSecenekService.prototype.seciliSoruSecenekleriniSil = function () {
        var _this = this;
        if (this.soruForm) {
            var silinecekNolar_1 = [];
            this.selectedTodos.forEach(function (element) {
                var silinecekIndeks = _this.secenekIndeksiBul(element.get('tekDogruluSoruSecenekId').value);
                if (silinecekIndeks >= 0) {
                    silinecekNolar_1.push(silinecekIndeks);
                }
            });
            if (silinecekNolar_1.length > 0) {
                var seceneklerArray_1 = this.soruForm.get('secenekler');
                silinecekNolar_1.forEach(function (no) {
                    seceneklerArray_1.removeAt(no);
                });
            }
        }
    };
    CoktanSecmeliSoruSecenekService.prototype.silTekDogruluSecenek = function (secenek) {
        if (this.soruForm) {
            var indis = this.secenekIndeksiBul(secenek.get('tekDogruluSoruSecenekId').value);
            if (indis >= 0) {
                this.soruForm.get('secenekler').removeAt(indis);
                this.onCurrentTodoChanged.next(null);
            }
        }
    };
    CoktanSecmeliSoruSecenekService.prototype.secenekIndeksiBul = function (id) {
        for (var index = 0; index < this.soruForm.get('secenekler').controls.length; index++) {
            var element = this.soruForm.get('secenekler').controls[index];
            if (element.get('tekDogruluSoruSecenekId').value === id) {
                return index;
            }
        }
        return -1;
    };
    CoktanSecmeliSoruSecenekService.prototype.setCurrentSecenek = function (id) {
        this.currentTodo = this.soruForm.get('secenekler').controls.find(function (todo) {
            return todo.get('tekDogruluSoruSecenekId').value === id;
        });
        this.onCurrentTodoChanged.next(this.currentTodo);
    };
    CoktanSecmeliSoruSecenekService.prototype.toggleSelectedtekDogruluSecenek = function (id) {
        // First, check if we already have that todo as selected...
        if (this.selectedTodos.length > 0) {
            for (var _i = 0, _a = this.selectedTodos; _i < _a.length; _i++) {
                var todo = _a[_i];
                // ...delete the selected todo
                if (todo.get('tekDogruluSoruSecenekId').value === id) {
                    var index = this.selectedTodos.indexOf(todo);
                    if (index !== -1) {
                        this.selectedTodos.splice(index, 1);
                        // Trigger the next event
                        this.onSelectedTodosChanged.next(this.selectedTodos);
                        // Return
                        return;
                    }
                }
            }
        }
        // If we don't have it, push as selected
        this.selectedTodos.push(this.soruForm.get('secenekler').controls.find(function (todo) {
            return todo.get('tekDogruluSoruSecenekId').value === id;
        }));
        // Trigger the next event
        this.onSelectedTodosChanged.next(this.selectedTodos);
    };
    CoktanSecmeliSoruSecenekService.prototype.toggleSelectAll = function () {
        if (this.selectedTodos.length > 0) {
            this.deselectTodos();
        }
        else {
            this.selectTodos();
        }
    };
    CoktanSecmeliSoruSecenekService.prototype.selectTodos = function (filterParameter, filterValue) {
        var _this = this;
        this.selectedTodos = [];
        // If there is no filter, select all todos
        if (filterParameter === undefined || filterValue === undefined) {
            this.soruForm.get('secenekler').controls.forEach(function (element) {
                _this.selectedTodos.push(element);
            });
        }
        else {
            (_a = this.selectedTodos).push.apply(_a, this.soruForm.get('secenekler').controls.filter(function (todo) {
                return todo.get(filterParameter).value === filterValue;
            }));
        }
        // Trigger the next event
        this.onSelectedTodosChanged.next(this.selectedTodos);
        var _a;
    };
    CoktanSecmeliSoruSecenekService.prototype.deselectTodos = function () {
        this.selectedTodos = [];
        // Trigger the next event
        this.onSelectedTodosChanged.next(this.selectedTodos);
    };
    CoktanSecmeliSoruSecenekService.prototype.oncekiSonrakiSecenegeGit = function (adim) {
        var indeks = this.secenekIndeksiBul(this.currentTodo.get('tekDogruluSoruSecenekId').value);
        var seceneklerArray = this.soruForm.get('secenekler');
        var sonrakiSecenek;
        if (!this.secenekIndeksiBul) {
            return;
        }
        if (indeks === -1 || indeks + adim >= 5) {
            sonrakiSecenek = seceneklerArray.controls[0];
        }
        else {
            if (indeks + adim < 0) {
                sonrakiSecenek = seceneklerArray.controls[seceneklerArray.length - 1];
            }
            else {
                sonrakiSecenek = seceneklerArray.controls[indeks + adim];
            }
        }
        if (sonrakiSecenek) {
            this.currentTodo = sonrakiSecenek;
            this.onCurrentTodoChanged.next(sonrakiSecenek);
        }
    };
    CoktanSecmeliSoruSecenekService.prototype.ogrenimHedefIndeksiniBul = function (hedefId) {
        if (hedefId < 1) {
            return -1;
        }
        else {
            var kontroller = this.soruForm.get('soruHedefleri').controls;
            for (var index = 0; index < kontroller.length; index++) {
                var element = kontroller[index];
                if (element.value === hedefId) {
                    return index;
                }
            }
            return -1;
        }
    };
    CoktanSecmeliSoruSecenekService.prototype.hesaplariYap = function (secenekler) {
        if (!secenekler) {
            secenekler = this.soruForm.get('secenekler');
        }
        var dogruSecenekSayisi = secenekler.controls.filter(function (el) { return el.get('dogruSecenek').value === true; }).length;
        var hessGuncelDegeri = secenekler.controls.filter(function (el) { return el.get('hemenElenebilir').value === true; }).length;
        var kei = this.kabulEdilebilirlikIndeksiniHesapla(secenekler.length, hessGuncelDegeri);
        this.soruForm.patchValue({
            kabulEdilebilirlikIndeksi: kei,
            hemenElenebilirSecenekSayisi: hessGuncelDegeri
        });
        this.hemenElenebilirSecenekSayisiDegisti.next(hessGuncelDegeri);
        this.dogruSecenekSayisiDegisti.next(dogruSecenekSayisi);
        this.kabulEdilebilirkikIndeksiDegisti.next(kei);
        return { dogruSecenekSayisi: dogruSecenekSayisi, hess: hessGuncelDegeri, kei: kei };
    };
    CoktanSecmeliSoruSecenekService.prototype.kabulEdilebilirlikIndeksiniHesapla = function (seceneksayisi, hemenElenebilirSecenekSayisi) {
        if (seceneksayisi <= 0) {
            return 0;
        }
        if (seceneksayisi - hemenElenebilirSecenekSayisi !== 0) {
            return (1 / (seceneksayisi - hemenElenebilirSecenekSayisi));
        }
        else {
            return 0;
        }
    };
    CoktanSecmeliSoruSecenekService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormBuilder"]])
    ], CoktanSecmeliSoruSecenekService);
    return CoktanSecmeliSoruSecenekService;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/coktan-secmeli-soru.component.html":
/*!**************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-soru/coktan-secmeli-soru.component.html ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"sayfa\" fxLayout=\"column\">\n  <div class=\"sayfa-basi\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\n    <div class=\"ekran-baslik\" fxFlex=\"1 0 auto\">\n      <div *ngIf=\"data.yeni\"> Yeni soru</div>\n      <div *ngIf=\"!data.yeni\"> {{data.degisecekSoru.kaynakca|ozet}} : (değişiyor)</div>\n    </div>\n    <div class=\"ekran-baslik-kapatma-butonu\" fxFlex=\"1 1 32px\">\n      <!-- <button mat-button class=\"mat-icon-button\" (click)=\"tamEkran=!tamEkran;\" aria-label=\"Ekrani kapat\" matTooltip=\"Formu kaydetmeden kapat\">\n              <mat-icon *ngIf=\"!tamEkran\">fullscreen</mat-icon>\n              <mat-icon *ngIf=\"tamEkran\">fullscreen_exit</mat-icon>\n            </button> -->\n      <button mat-button class=\"mat-icon-button\" (click)=\"dialogRef.close()\" aria-label=\"Ekrani kapat\" matTooltip=\"Formu kaydetmeden kapat\">\n        <mat-icon>close</mat-icon>\n      </button>\n    </div>\n  </div>\n  <form class=\"sayfa-ici\" name=\"soruFormu\" [formGroup]=\"coktanSecmeliSoruSecenekService.soruForm\" fxLayout=\"column\" fusePerfectScrollbar>\n\n    <div class=\"ders-konu-paneli\" fxLayout=\"column\" fxLayout.gt-xs=\"row\" style=\"overflow-y: auto\">\n      <div class=\"ders-konu-adlari\">\n        <div class=\"ders-sutunu\" fxLayout=\"row\" fxFlexAlign=\"start center\">\n          <div class=\"ders-baslik\" fxHide fxShow.gt-xs fxFlex=\"60px\">Ders</div>\n          <div *ngIf=\"data.ders\" class=\"ders\" fxFill> {{' '+data.ders.dersAdi|ozet:'120'}}</div>\n        </div>\n        <div class=\"konu-sutunu\" *ngIf=\"konu\" fxLayout=\"row\" fxFlexAlign=\"start center\">\n          <div class=\"konu-baslik\" fxHide fxShow.gt-xs fxFlex=\"60px\">Konu</div>\n          <div *ngIf=\"konu\" class=\"konu\" fxFill> {{' '+konu.konuAdi|ozet:'120'}}</div>\n        </div>\n\n      </div>\n\n      <!-- KABUL EDILERBİLİRLİK İNDEKSİ -->\n      <fuse-widget class=\"widget\" fxLayout=\"column\" style=\"width: 350px\" fxHide.lt-md>\n\n        <!-- Front -->\n        <div class=\"fuse-widget-front mat-elevation-z4\">\n          <div class=\"pl-16 pr-0 py-16\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\n            <div matTooltip=\"Kabul Edilebilirlik İndeksi\">KEİ</div>\n            <button mat-icon-button fuseWidgetToggle class=\"fuse-widget-flip-button\" aria-label=\"more\">\n              <mat-icon>info</mat-icon>\n            </button>\n          </div>\n          <div class=\"pt-8 pb-24\" fxLayout=\"column\" fxLayoutAlign=\"center center\">\n            <div class=\"font-size-32 line-height-32\" style=\"color:#E2474C\">\n              {{coktanSecmeliSoruSecenekService.soruForm.get('kabulEdilebilirlikIndeksi').value|number:'0.1-2'}}\n            </div>\n\n          </div>\n        </div>\n        <!-- / Front -->\n\n        <!-- Back -->\n        <div class=\"fuse-widget-back p-16 pt-32 mat-white-bg mat-elevation-z2\" style=\"overflow-y: auto!important;padding-bottom: 8px\">\n          <button mat-icon-button fuseWidgetToggle class=\"fuse-widget-flip-button\" aria-label=\"Flip widget\">\n            <mat-icon class=\"s-16\">close</mat-icon>\n          </button>\n          <div>\n            <span style=\"font-weight: bold\"> KEİ=1/(Ns-Ne)</span>\n            Kabul edilebilir performans düzeyi geçme ya da kalma eşiğini belirler. Değer marjinal öğrenciden (tam geçmeye yetecek kadar\n            bilen öğrenci) beklenen performans iler belirlenir. Hesaplanması: Çoktan seçmeli sınav sorusunde seçenekler arasıdan\n            \"tam geçmeye seçenekler arasında yetecek kadar bilen öğrenci\" nin, tüm seçenekler arasında (Ns) bir bakışta eleyebileceği\n            seçenek sayısı tahmin edilir (Ne değeri). Daha sonra aşağıdaki formüle göre ilgili sorunun \"Kabul edilebilirlik\n            indeksi\" hesaplanır.\n          </div>\n        </div>\n        <!-- / Back -->\n\n      </fuse-widget>\n      <!-- / KABUL EDILERBİLİRLİK İNDEKSİ -->\n\n    </div>\n    <div fxLayout=\"column\">\n      <mat-tab-group dynamicHeight=false #defter>\n        <mat-tab label=\"Soru Tanımı\">\n          <ng-template mat-tab-label>\n            <div fxHide fxShow.gt-sm>Soru Tanımı ve Seçenekleri</div>\n            <mat-icon fxHide.gt-sm matTooltip=\"Soru metni ve seçenekleri tanımlamak için seçin.\">edit</mat-icon>\n          </ng-template>\n          <div class=\"soru-tanim-sayfa-icerik\">\n            <fuse-sb-html-editor id=\"soru-metni\" [parentForm]=\"coktanSecmeliSoruSecenekService.soruForm\" parentFormControlName=\"soruMetni\"></fuse-sb-html-editor>\n            <fuse-tek-dogrulu-secenek class=\"doldur\"></fuse-tek-dogrulu-secenek>\n          </div>\n        </mat-tab>\n        <mat-tab label=\"Özellikleri\">\n          <ng-template mat-tab-label>\n            <div fxHide fxShow.gt-sm>Özellikler</div>\n            <mat-icon fxHide.gt-sm matTooltip=\"Özellikleri ayrıntılı olarak tanımlamak için seçin\">settings</mat-icon>\n          </ng-template>\n          <div class=\"soru-ozellik-sayfa-icerik\" fxLayout=\"column wrap\" fxLayoutAlign=\"row\" fxFlex>\n\n            <div class=\"kart-sari\" fxFlex>\n              <h2>Özellikler</h2>\n              <div class=\"px-12\" fxLayout=\"column\" fxLayoutAlign=\"start stretch\">\n                <mat-form-field>\n                  <mat-select placeholder=\"Zorluk derecesi\" [formControl]=\"coktanSecmeliSoruSecenekService.soruForm.get('soruZorlukNo')\">\n                    <mat-option>Zorluk derecesini seçin</mat-option>\n                    <mat-option *ngFor=\"let zorluk of (soruZorluklari$|async)\" [value]=\"zorluk.zorlukId\">\n                      {{zorluk.zorlukAdi}}\n                    </mat-option>\n                  </mat-select>\n                  <mat-error *ngIf=\"displayMessage.soruZorlukNo\">{{displayMessage.soruZorlukNo}}</mat-error>\n                </mat-form-field>\n                <mat-form-field>\n                  <div fxLayout=\"row\" fxLayoutAlign=\"space-between center\" fxLayoutGap=\"10px\">\n                    <input matInput #cevapSuresi placeholder=\"Cevaplama süresi\" formControlName=\"cevaplamaSuresi\"  fxFlex=\"50px\"  (keyup)=\"sureSlider.value=cevapSuresi.value\" >\n                    <mat-slider  #sureSlider [max]=\"360\" [min]=\"20\" [step]=\"1\" [thumbLabel]=\"true\"  [tickInterval]=\"20\" fxFlex=\"auto\" (change)=\"cevaplamaSuresiDegisti($event)\">\n                    </mat-slider>\n                  </div>\n                  <mat-error *ngIf=\"displayMessage.cevaplamaSuresi\">{{displayMessage.cevaplamaSuresi}}</mat-error>\n                  <mat-hint>Cevaplama süresini saniye olarak (20-180 sn) seçin.</mat-hint>\n                </mat-form-field>\n                <mat-form-field>\n                  <mat-select placeholder=\"Soru tipi\" [formControl]=\"coktanSecmeliSoruSecenekService.soruForm.get('soruTipNo')\">\n                    <mat-option>Soru tipini seçin</mat-option>\n                    <mat-option *ngFor=\"let tip of (soruTipleri$|async)\" [value]=\"tip.soruTipId\">\n                      {{tip.soruTipAdi}}\n                    </mat-option>\n                  </mat-select>\n                  <mat-error *ngIf=\"displayMessage.soruTipNo\">{{displayMessage.soruTipNo}}</mat-error>\n                </mat-form-field>\n\n                <mat-form-field>\n                  <mat-select placeholder=\"Bilişsel düzey\" [formControl]=\"coktanSecmeliSoruSecenekService.soruForm.get('bilisselDuzeyNo')\">\n                    <mat-option>Bilişsel düzey seçin</mat-option>\n                    <mat-option *ngFor=\"let bd of (bilisselDuzeyler$|async)\" [value]=\"bd.bilisselDuzeyId\">\n                      {{bd.duzeyAdi}}\n                    </mat-option>\n                  </mat-select>\n                  <mat-error *ngIf=\"displayMessage.bilisselDuzeyId\">{{displayMessage.bilisselDuzeyId}}</mat-error>\n                </mat-form-field>\n\n              </div>\n            </div>\n            <div class=\"kart-sari\" fxFlex>\n              <h2>Geçerlilik süreleri</h2>\n              <div class=\"px-12\" fxLayout=\"column\" fxLayoutAlign=\"start stretch\">\n                <mat-form-field formGroupName=\"gecerlilik\">\n                  <input matInput #baslangic [matDatepicker]=\"pickerBaslangic\" placeholder=\"Başlangıç tarihi\" formControlName=\"baslangic\">\n                  <mat-datepicker-toggle matSuffix [for]=\"pickerBaslangic\"></mat-datepicker-toggle>\n                  <mat-datepicker #pickerBaslangic startView=\"year\" [startAt]=\"onTanimBaslangicTarihi\"></mat-datepicker>\n                </mat-form-field>\n\n                <mat-form-field formGroupName=\"gecerlilik\">\n                  <input matInput [matDatepicker]=\"pickerBitis\" placeholder=\"Bitiş tarihi\" formControlName=\"bitis\">\n                  <mat-datepicker-toggle matSuffix [for]=\"pickerBitis\"></mat-datepicker-toggle>\n                  <mat-datepicker #pickerBitis [startAt]=\"baslangic.value\"></mat-datepicker>\n                </mat-form-field>\n                <mat-error *ngIf=\"displayMessage.gecerlilik\">{{displayMessage.gecerlilik}}</mat-error>\n              </div>\n            </div>\n            <div class=\"kart-sari\" fxFlex>\n              <h2>Kaynakça ve cevap açıklaması</h2>\n\n              <div class=\"px-12\" fxLayout=\"column\" fxLayoutAlign=\"start stretch\">\n                <mat-form-field>\n                  <textarea matInput matTextareaAutosize matAutosizeMinRows=\"4\" formControlName=\"kaynakca\" placeholder=\"Kaynakça\"></textarea>\n                  <mat-error *ngIf=\"displayMessage.kaynakca\">{{displayMessage.kaynajca}}</mat-error>\n                </mat-form-field>\n                <mat-form-field>\n                  <textarea matInput matTextareaAutosize matAutosizeMinRows=\"4\" formControlName=\"aciklama\" placeholder=\"Cevap açıklaması\"></textarea>\n                  <mat-error *ngIf=\"displayMessage.aciklama\">{{displayMessage.aciklama}}</mat-error>\n                </mat-form-field>\n\n\n              </div>\n            </div>\n          </div>\n        </mat-tab>\n        <mat-tab label=\"Hedefleri\">\n          <ng-template mat-tab-label>\n            <div fxHide fxShow.gt-sm>Öğrenim Hedefleri</div>\n            <mat-icon fxHide.gt-sm matTooltip=\"Sorunun ilişkili olduğu öğrenim hedeflerini belirlemek için seçin\">my_location</mat-icon>\n          </ng-template>\n          <div class=\"soru-hedefler-sayfa-icerik\">\n            Öğrenim hedefleri\n\n            <fuse-ogrenim-hedefleri> </fuse-ogrenim-hedefleri>\n\n\n          </div>\n        </mat-tab>\n\n        <mat-tab label=\"Anahtar Kelimeler\">\n          <ng-template mat-tab-label>\n            <div fxHide fxShow.gt-sm>Anahtar Kelimeler</div>\n            <mat-icon fxHide.gt-sm matTooltip=\"Soruyu bulmak için kullanılacak anahtar kelimeleri tanımlamak için girin\">vpn_key</mat-icon>\n          </ng-template>\n\n          <fuse-anahtar-kelimeler fusePerfectScrollbar [anahtar-kelimeler]=\"coktanSecmeliSoruSecenekService.soruForm.get('anahtarKelimeler')\"\n            (bosalt)=\"anahtarkelimeleriBosalt()\">\n          </fuse-anahtar-kelimeler>\n\n        </mat-tab>\n\n      </mat-tab-group>\n\n    </div>\n  </form>\n\n  <div matDialogActions class=\"sayfa-sonu\" fxLayout=\"row\" fxLayoutAlign=\"center center\" fxLayoutGap=\"30px\">\n    <button mat-button [fuseSubmitIfValid]=\"this.coktanSecmeliSoruSecenekService.soruForm\" (invalid)=\"formEksik()\" (valid)=\"tamam()\"\n      class=\"buton\" matTooltip=\"Formu kaydet\" aria-label=\"KAYDET\">\n      <mat-icon class=\"buton\">sd_storage</mat-icon>\n      Kaydet\n    </button>\n    <button mat-button (click)=\"dialogRef.close(['kapat',coktanSecmeliSoruSecenekService.soruForm])\" aria-label=\"KAPAT\" matTooltip=\"Formu kaydetmeden kapat\"\n      class=\"buton\">\n      <mat-icon class=\"buton\">close</mat-icon>\n      Kapat\n    </button>\n  </div>\n\n</div>"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/coktan-secmeli-soru.component.scss":
/*!**************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-soru/coktan-secmeli-soru.component.scss ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n.mat-dialog-container {\n  border-radius: 12px;\n  display: block;\n  padding: 0px;\n  background-color: #252D43;\n  overflow-y: hidden;\n  color: #D8E8E9; }\n.mat-dialog-container .popup-masaustu,\n  .mat-dialog-container .popup-mobil,\n  .mat-dialog-container .tam-ekran {\n    max-width: none;\n    width: 100vw;\n    height: 100vh;\n    background-color: yellow; }\n.mat-dialog-container .sayfa {\n    height: 100%;\n    width: 100%;\n    background-color: #D8E8E9; }\n.mat-dialog-container .sayfa-basi {\n    background-color: #E2474C;\n    padding: 12px;\n    width: 100%; }\n.mat-dialog-container .sayfa-ici {\n    width: 100%;\n    height: 100% !important;\n    border-left: 4px solid #E2474C;\n    border-right: 4px solid #E2474C; }\n.mat-dialog-container .sayfa-ici .mat-tab-group {\n      background-color: #D8E8E9;\n      width: 100%;\n      height: 100% !important;\n      box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\n      transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1); }\n.mat-dialog-container .sayfa-sonu {\n    font-size: 16px;\n    min-height: 40px;\n    height: 60px;\n    font-weight: bolder;\n    background-color: #E2474C;\n    margin-bottom: 12px;\n    margin-bottom: 0px;\n    width: 100%; }\n.mat-dialog-container .sayfa-sonu .buton {\n      color: white; }\n.popup-masaustu .mat-tab-body-wrapper,\n.popup-mobil .mat-tab-body-wrapper {\n  height: 100%; }\n.ders-konu-paneli {\n  background-color: transparent;\n  padding: 4px;\n  color: #406D95; }\n.ders-konu-paneli .ders-konu-adlari {\n    width: 100%;\n    padding-left: 12px;\n    line-height: 32px; }\n.ders-konu-paneli .ders-konu-adlari .ders-sutunu {\n      font-size: 1.5em; }\n.ders-konu-paneli .ders-konu-adlari .ders-sutunu .ders-baslik {\n        color: #252D43; }\n@media (max-width: 959px) {\n        .ders-konu-paneli .ders-konu-adlari .ders-sutunu .ders {\n          font-size: 0.8em; } }\n.ders-konu-paneli .ders-konu-adlari .konu-sutunu {\n      font-size: 1.5em; }\n.ders-konu-paneli .ders-konu-adlari .konu-sutunu .konu-baslik {\n        color: #252D43; }\n@media (max-width: 959px) {\n        .ders-konu-paneli .ders-konu-adlari .konu-sutunu .konu {\n          font-size: 0.6em; } }\n.ders-konu-paneli .kabul-edilebilirlik-indeks-kutusu {\n    background-color: #E2474C;\n    border: 2px solid #E2474C;\n    padding: 10px; }\n.ders-konu-paneli .kabul-edilebilirlik-indeks-kutusu .indeks-yazisi {\n      font-size: 12px;\n      text-align: center;\n      color: white; }\n@media (max-width: 959px) {\n        .ders-konu-paneli .kabul-edilebilirlik-indeks-kutusu .indeks-yazisi {\n          display: none; } }\n.ders-konu-paneli .kabul-edilebilirlik-indeks-kutusu .kutu {\n      padding: 4px;\n      font-size: 2em;\n      font-weight: 900;\n      height: 100px;\n      min-height: 80px;\n      overflow: auto;\n      text-align: center;\n      color: white; }\n.kart {\n  border-radius: 2px;\n  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  padding: 24px;\n  margin: 12px;\n  color: #252D43; }\n.kart mat-form-field {\n    min-width: 150px;\n    margin: 8px;\n    color: #252D43;\n    width: 100%; }\n.soru-metni {\n  background-color: #3E6A91; }\n.doldur {\n  height: 100% !important; }\n/* Styles for the ink bar */\n.mat-ink-bar {\n  background-color: transparent; }\n/* label style */\n.mat-tab-label {\n  background: #D8E8E9;\n  color: #406D95; }\n/* focus style */\n.mat-tab-group.mat-primary .mat-tab-label:not(.mat-tab-disabled):focus,\n.mat-tab-group.mat-primary .mat-tab-link:not(.mat-tab-disabled):focus,\n.mat-tab-nav-bar.mat-primary .mat-tab-label:not(.mat-tab-disabled):focus,\n.mat-tab-nav-bar.mat-primary .mat-tab-link:not(.mat-tab-disabled):focus {\n  background: #E2474C;\n  color: white; }\n/* ink bar style */\n.mat-tab-group.mat-primary .mat-ink-bar,\n.mat-tab-nav-bar.mat-primary .mat-ink-bar {\n  background-color: #E2474C;\n  height: 8px; }\n.soru-tanim-sayfa-icerik {\n  padding: 2px; }\n.ekran-baslik {\n  font-size: 20px; }\n.ekran-baslik-kapatma-butonu mat-icon {\n  color: white; }\n.kart-sari {\n  border-radius: 4px;\n  box-shadow: 0 5px 2px -4px rgba(0, 0, 0, 0.4), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\n  transition: box-shadow 560ms cubic-bezier(0.4, 0, 0.2, 1);\n  padding: 12px;\n  margin: 12px;\n  padding-bottom: 24px;\n  background-color: #D8E8E9;\n  color: #252D43; }\n@media (max-width: 959px) {\n    .kart-sari {\n      margin-right: 10%;\n      padding: 12px;\n      padding-right: 0px; } }\n.kart-sari h2 {\n    font-weight: 400;\n    color: #252D43; }\n.kart-sari .mat-input-element {\n    overflow-y: hidden;\n    height: 24px !important; }\n.kart-sari .mat-input-wrapper {\n    height: 24px !important; }\n.fuse-widget-front {\n  padding: 12px;\n  background-color: #E2E3DD !important;\n  color: #E2474C; }\n.anahtar-kelime-kutusu {\n  border-radius: 2px;\n  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  padding: 24px;\n  margin: 12px;\n  width: 100%;\n  font-size: 16px;\n  padding: 8px;\n  color: #E2474C;\n  background-color: #D8E8E9; }\n.soru-anahtar-kelimeler-sayfa-icerik {\n  background-color: #A8D0DA;\n  color: #252D43; }\n"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/coktan-secmeli-soru.component.ts":
/*!************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-soru/coktan-secmeli-soru.component.ts ***!
  \************************************************************************************************/
/*! exports provided: CoktanSecmeliSoruComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoktanSecmeliSoruComponent", function() { return CoktanSecmeliSoruComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_cdk_platform__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/cdk/platform */ "./node_modules/@angular/cdk/esm5/platform.es5.js");
/* harmony import */ var _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/cdk/layout */ "./node_modules/@angular/cdk/esm5/layout.es5.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/esm5/ngx-translate-core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _soru_store_index__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../soru-store/index */ "./src/app/main/content/apps/sorular/soru-store/index.ts");
/* harmony import */ var _fuse_validators_generic_validator__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @fuse/validators/generic-validator */ "./src/@fuse/validators/generic-validator.ts");
/* harmony import */ var _fuse_services_config_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @fuse/services/config.service */ "./src/@fuse/services/config.service.ts");
/* harmony import */ var _core_services_sb_mesaj_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../core/services/sb-mesaj.service */ "./src/app/core/services/sb-mesaj.service.ts");
/* harmony import */ var _coktan_secmeli_soru_secenek_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../coktan-secmeli-soru-secenek.service */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru-secenek.service.ts");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./validators */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/validators.ts");
/* harmony import */ var _sorular_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../sorular.service */ "./src/app/main/content/apps/sorular/sorular.service.ts");
/* harmony import */ var _validasyon_mesajlari__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./validasyon.mesajlari */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/validasyon.mesajlari.ts");
/* harmony import */ var _models_soru__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../models/soru */ "./src/app/main/content/apps/sorular/models/soru.ts");
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


















var CoktanSecmeliSoruComponent = /** @class */ (function () {
    function CoktanSecmeliSoruComponent(dialogRef, data, formBuilder, fuseConfig, store, translate, mesajService, soruValidatorleri, activatedRoute, platform, cd, coktanSecmeliSoruSecenekService, sorularService, changeDetectorRef, media) {
        var _this = this;
        this.dialogRef = dialogRef;
        this.data = data;
        this.formBuilder = formBuilder;
        this.fuseConfig = fuseConfig;
        this.store = store;
        this.translate = translate;
        this.mesajService = mesajService;
        this.soruValidatorleri = soruValidatorleri;
        this.activatedRoute = activatedRoute;
        this.platform = platform;
        this.cd = cd;
        this.coktanSecmeliSoruSecenekService = coktanSecmeliSoruSecenekService;
        this.sorularService = sorularService;
        this.onTanimBaslangicTarihi = new Date(2018, 0, 1);
        this.validationMessages = {};
        this.displayMessage = {};
        this.konu = null;
        this.mobileQuery = media.matchMedia('(max-width: 800px)');
        this._mobileQueryListener = function () { return changeDetectorRef.detectChanges(); };
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.konu = this.konuBul();
        this.soruTipleri$ = this.store.select(_soru_store_index__WEBPACK_IMPORTED_MODULE_9__["getSoruTipleri"]);
        this.soruZorluklari$ = this.store.select(_soru_store_index__WEBPACK_IMPORTED_MODULE_9__["getSoruZorluklari"]);
        this.bilisselDuzeyler$ = this.store.select(_soru_store_index__WEBPACK_IMPORTED_MODULE_9__["getBilisselDuzeyler"]);
        this.translate.onLangChange.subscribe(function (aktifDil) {
            if (aktifDil['lang']) {
                if (aktifDil['lang'] === 'tr') {
                    _this.validationMessages = Object(_validasyon_mesajlari__WEBPACK_IMPORTED_MODULE_16__["CoktanSecmeliSoruValidasyonMesajlari_tr"])();
                }
                else if (aktifDil['lang'] === 'en') {
                    _this.validationMessages = Object(_validasyon_mesajlari__WEBPACK_IMPORTED_MODULE_16__["CoktanSecmeliSoruValidasyonMesajlari_tr"])();
                }
            }
            if (_this.validationMessages) {
                _this.genericValidator = new _fuse_validators_generic_validator__WEBPACK_IMPORTED_MODULE_10__["GenericValidator"](_this.validationMessages);
                _this.displayMessage = _this.genericValidator.processMessages(_this.coktanSecmeliSoruSecenekService.soruForm);
            }
        });
    }
    Object.defineProperty(CoktanSecmeliSoruComponent.prototype, "seceneklerFormArray", {
        get: function () {
            return this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler');
        },
        enumerable: true,
        configurable: true
    });
    CoktanSecmeliSoruComponent.prototype.ngOnInit = function () {
        this.validationMessages = Object(_validasyon_mesajlari__WEBPACK_IMPORTED_MODULE_16__["CoktanSecmeliSoruValidasyonMesajlari_tr"])();
        this.genericValidator = new _fuse_validators_generic_validator__WEBPACK_IMPORTED_MODULE_10__["GenericValidator"](this.validationMessages);
        if (this.data.degisecekSoru === undefined) {
            // if (environment.production === false) {
            this.data.degisecekSoru = this.denemeSoruYarat();
            // }
        }
        this.coktanSecmeliSoruSecenekService.soruForm = this.formYarat();
        this.secilebilirOgrenimHedefleriniAyarla();
        if (this.data.degisecekSoru !== undefined) {
            this.formYukle(this.data.degisecekSoru);
        }
    };
    CoktanSecmeliSoruComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var controlBlurs = this.formInputElements.map(function (formControl) { return Object(rxjs__WEBPACK_IMPORTED_MODULE_7__["fromEvent"])(formControl.nativeElement, 'blur'); });
        // Merge the blur event observable with the valueChanges observable
        rxjs__WEBPACK_IMPORTED_MODULE_7__["merge"].apply(void 0, [this.coktanSecmeliSoruSecenekService.soruForm.valueChanges].concat(controlBlurs)).debounceTime(600)
            .subscribe(function (value) {
            _this.displayMessage = _this.genericValidator.processMessages(_this.coktanSecmeliSoruSecenekService.soruForm);
        });
        if (this.coktanSecmeliSoruSecenekService.soruForm) {
            this.coktanSecmeliSoruSecenekService.soruForm.get('anahtarKelimeler').valueChanges.subscribe(function (anahtarlar) {
                _this.anahtarKelimeler = anahtarlar;
            });
        }
    };
    CoktanSecmeliSoruComponent.prototype.secilebilirOgrenimHedefleriniAyarla = function () {
        var sonuc = [];
        var konuNumarasi = this.coktanSecmeliSoruSecenekService.soruForm.get('konuNo').value;
        if (this.data.ders && this.data.ders.konulari.length > 0) {
            var konu = null;
            if (konuNumarasi > 0) {
                // tslint:disable-next-line:triple-equals
                konu = this.data.ders.konulari.find(function (d) { return d.konuId == konuNumarasi; });
            }
            if (konu === null) {
                this.data.ders.konulari.forEach(function (k) {
                    k.ogrenimHedefleri.forEach(function (hedef) {
                        sonuc.push(hedef);
                    });
                });
            }
            else {
                konu.ogrenimHedefleri.forEach(function (hedef) {
                    sonuc.push(hedef);
                });
            }
        }
        this.coktanSecmeliSoruSecenekService.secilebilirOgrenimHedefleriDegisti.next(sonuc);
    };
    CoktanSecmeliSoruComponent.prototype.formYarat = function () {
        return this.formBuilder.group({
            birimNo: this.data.ders ? this.data.ders.birimNo : null,
            programNo: this.data.ders ? this.data.ders.programNo : null,
            donemNo: this.data.ders ? this.data.ders.donemNo : null,
            dersGrubuNo: this.data.ders ? this.data.ders.dersGrubuNo : null,
            dersNo: this.data.dersNo,
            konuNo: this.data.konuNo,
            soruTipNo: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]],
            soruZorlukNo: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]],
            kaynakca: [''],
            soruMetni: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]],
            gecerlilik: this.formBuilder.group({
                baslangic: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]],
                bitis: [null]
            }, { validator: this.soruValidatorleri.BitisBaslangictanOnceOlamaz('baslangic', 'bitis') }),
            aciklama: [''],
            secenekler: this.formBuilder.array([], this.soruValidatorleri.tekDogruluCoktanSecmeliSeceneklerValidator),
            hemenElenebilirSecenekSayisi: 0,
            kabulEdilebilirlikIndeksi: [0],
            bilisselDuzeyNo: [0, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]],
            cevaplamaSuresi: [0],
            anahtarKelimeler: this.formBuilder.array([], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required),
            soruHedefleri: this.formBuilder.array([]),
        });
    };
    CoktanSecmeliSoruComponent.prototype.formYukle = function (soruBilgi) {
        var _this = this;
        this.coktanSecmeliSoruSecenekService.soruForm.patchValue({
            birimNo: soruBilgi.birimNo,
            programNo: soruBilgi.programNo,
            donemNo: soruBilgi.donemNo,
            dersGrubuNo: soruBilgi.dersGrubuNo,
            dersNo: soruBilgi.dersNo,
            konuNo: soruBilgi.konuNo,
            soruTipNo: soruBilgi.soruTipNo,
            sorusozNo: soruBilgi.soruZorlukNo,
            kaynakca: soruBilgi.kaynakca,
            soruMetni: soruBilgi.soruMetni,
            soruZorlukNo: soruBilgi.soruZorlukNo,
            gecerlilik: {
                baslangic: soruBilgi.baslangic,
                bitis: soruBilgi.bitis
            },
            aciklama: soruBilgi.aciklama,
            kabulEdilebilirlikIndeksi: soruBilgi.kabulEdilebilirlikIndeksi,
            bilisselDuzeyNo: soruBilgi.bilisselDuzeyNo,
            cevaplamaSuresi: soruBilgi.cevaplamaSuresi,
        });
        if (soruBilgi.tekDogruluSecenekleri != null && soruBilgi.tekDogruluSecenekleri.length > 0) {
            var secenekler_1 = this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler');
            soruBilgi.tekDogruluSecenekleri.forEach(function (elSecenek) {
                secenekler_1.push(_this.formBuilder.group({
                    tekDogruluSoruSecenekId: elSecenek.tekDogruluSoruSecenekId,
                    secenekMetni: elSecenek.secenekMetni,
                    dogruSecenek: elSecenek.dogruSecenek,
                    hemenElenebilir: elSecenek.hemenElenebilir,
                }));
            });
            var sonuc = this.coktanSecmeliSoruSecenekService.hesaplariYap(secenekler_1);
            this.coktanSecmeliSoruSecenekService.dogruSecenekSayisiDegisti.next(sonuc.dogruSecenekSayisi);
            this.coktanSecmeliSoruSecenekService.hemenElenebilirSecenekSayisiDegisti.next(sonuc.hess);
            this.coktanSecmeliSoruSecenekService.kabulEdilebilirkikIndeksiDegisti.next(sonuc.kei);
        }
        if (soruBilgi.soruHedefleri && soruBilgi.soruHedefleri.length > 0) {
            var hedefler_1 = this.coktanSecmeliSoruSecenekService.soruForm.get('soruHedefleri');
            soruBilgi.soruHedefleri.forEach(function (elHedef) {
                hedefler_1.push(_this.formBuilder.control(elHedef));
            });
            // this.tekDogruluSecenekService.onSelectedOgrenimHedefleriChanged.next(seciliHedefler);
        }
        if (soruBilgi.anahtarKelimeler && soruBilgi.anahtarKelimeler.length > 0) {
            soruBilgi.anahtarKelimeler.forEach(function (keyword) {
                _this.coktanSecmeliSoruSecenekService.soruForm.get('anahtarKelimeler').push(_this.formBuilder.control(keyword));
            });
        }
        this.sureKulagi.value = soruBilgi.cevaplamaSuresi;
        this.displayMessage = this.genericValidator.processMessages(this.coktanSecmeliSoruSecenekService.soruForm);
    };
    CoktanSecmeliSoruComponent.prototype.anahtarkelimeleriBosalt = function () {
        while (this.coktanSecmeliSoruSecenekService.soruForm.get('anahtarKelimeler').length !== 0) {
            this.coktanSecmeliSoruSecenekService.soruForm.get('anahtarKelimeler').removeAt(0);
        }
    };
    CoktanSecmeliSoruComponent.prototype.konuBul = function () {
        var _this = this;
        var donecekKonu = null;
        if (this.data.konuNo <= 0 || this.data.ders == null || !this.data.ders.konulari.length) {
            return donecekKonu;
        }
        else {
            // tslint:disable-next-line:triple-equals
            donecekKonu = this.data.ders.konulari.find(function (k) { return k.konuId == _this.data.konuNo; });
            return donecekKonu;
        }
    };
    CoktanSecmeliSoruComponent.prototype.cevaplamaSuresiDegisti = function (deger) {
        console.log(deger);
        this.coktanSecmeliSoruSecenekService.soruForm.patchValue({ cevaplamaSuresi: deger.value });
    };
    CoktanSecmeliSoruComponent.prototype.hessSuresiDegisti = function (deger) {
        this.coktanSecmeliSoruSecenekService.soruForm.patchValue({ hemenElenebilirSecenekSayisi: deger });
        this.refresh();
    };
    CoktanSecmeliSoruComponent.prototype.denemeSoruYarat = function () {
        this.mesajService.goster('Lütfen yeni soru bilgilerini doldurup kaydedin.');
        return {
            birimNo: this.data.ders.birimNo,
            programNo: this.data.ders.programNo,
            donemNo: this.data.ders.donemNo,
            dersGrubuNo: this.data.ders.dersGrubuNo,
            dersNo: this.data.dersNo,
            konuNo: this.data.konuNo,
            // kaynakca: 'Otoskleroz tanımı',
            soruTipNo: 1,
            soruMetni: 'Aşağıdakilerden hangisi .... değildir? ',
            tekDogruluSecenekleri: [{
                    'tekDogruluSoruSecenekId': -1,
                    'secenekMetni': '',
                    'dogruSecenek': false,
                    'hemenElenebilir': false
                },
                {
                    'tekDogruluSoruSecenekId': -2,
                    'secenekMetni': '',
                    'dogruSecenek': false,
                    'hemenElenebilir': false
                },
                {
                    'tekDogruluSoruSecenekId': -3,
                    'secenekMetni': '',
                    'dogruSecenek': false,
                    'hemenElenebilir': false
                },
                {
                    'tekDogruluSoruSecenekId': -4,
                    'secenekMetni': '',
                    'dogruSecenek': false,
                    'hemenElenebilir': false
                },
                {
                    'tekDogruluSoruSecenekId': -5,
                    'secenekMetni': '',
                    'dogruSecenek': false,
                    'hemenElenebilir': false
                }],
            // anahtarKelimeler: ['kelime ', 'işitme kaybı', 'genetik', 'çınlama'],
            kaynakca: '',
            aciklama: '',
            bilisselDuzeyNo: 2,
            soruZorlukNo: 1,
            cevaplamaSuresi: 80,
            baslangic: '2018-01-01T00:00:00.000Z',
            bitis: '2020-03-24T00:00:00.000Z'
        };
    };
    CoktanSecmeliSoruComponent.prototype.bosHedef = function () {
        return this.formBuilder.group({
            ogrenimHedefId: null,
            ogrenimHedefAdi: ''
        });
    };
    CoktanSecmeliSoruComponent.prototype.secenekFormuYarat = function () {
        return this.formBuilder.group([
            {
                tekDogruluSoruSecenekId: [0],
                secenekMetni: [''],
                dogruSecenek: [false]
            }
        ]);
    };
    CoktanSecmeliSoruComponent.prototype.ekle = function () {
        this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler').push(this.formBuilder.group(new _models_soru__WEBPACK_IMPORTED_MODULE_17__["TekDogruluSoruSecenek"]({})));
    };
    CoktanSecmeliSoruComponent.prototype.tumSecenekleriSil = function () {
        if (this.coktanSecmeliSoruSecenekService.soruForm) {
            while (this.coktanSecmeliSoruSecenekService.soruForm.get('tekDogruluSecenekleri').length !== 0) {
                this.coktanSecmeliSoruSecenekService.soruForm.get('tekDogruluSecenekleri').removeAt(0);
            }
        }
    };
    CoktanSecmeliSoruComponent.prototype.secenekSil = function (indeks) {
        var secenekListesi = this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler');
        secenekListesi.removeAt(indeks);
    };
    CoktanSecmeliSoruComponent.prototype.tamam = function () {
        var secenekler = this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler');
        var seceneklerDeger = secenekler.value;
        var hemDogruHemdeElenebilirSorular = seceneklerDeger.filter(function (el) { return el.dogruSecenek && el.hemenElenebilir; });
        if (hemDogruHemdeElenebilirSorular.length > 0) {
            this.mesajService.hataStr('Aynı zamanda hem doğru seçenek hem de hemen elenebilir seçenek olarak işaretlenmiş seçenek var!');
            return;
        }
        this.dialogRef.close(['kaydet', this.coktanSecmeliSoruSecenekService.soruForm, this.data.degisecekSoru]);
    };
    CoktanSecmeliSoruComponent.prototype.formEksik = function () {
        if (this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler').errors) {
            if (this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler').errors.hicSecenekGirilmemis) {
                this.mesajService.hataStr('Hiç seçenek girilmemiş!');
                this.defter.selectedIndex = 0;
                return;
            }
            if (this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler').errors.dogruSecenekGirilmemis) {
                this.mesajService.hataStr('Doğru seçenek belirtilmemiş.');
                this.defter.selectedIndex = 0;
                return;
            }
            if (this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler').errors.tekDogruSecenekOlabilir) {
                this.mesajService.hataStr('Bu soru tipi için sadece tek seçenek doğru olarak işaretlenebilir!');
                this.defter.selectedIndex = 0;
                return;
            }
            if (this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler').errors.secenekMetniBos) {
                this.mesajService.hataStr('Seçeneklerin biri veya daha fazlasında SEÇENEK METNİ boş!');
                this.defter.selectedIndex = 0;
                return;
            }
        }
        if (this.coktanSecmeliSoruSecenekService.soruForm.get('anahtarKelimeler').errors) {
            this.mesajService.hataStr('Anahtar kelimeler eksik!');
            this.defter.selectedIndex = 3;
            return;
        }
        this.displayMessage = this.genericValidator.processMessages(this.coktanSecmeliSoruSecenekService.soruForm, true);
        this.defter.selectedIndex = 1;
        this.mesajService.hataStr('Lütfen eksik bıraktığınız kırmızı alanları doldurun!');
    };
    CoktanSecmeliSoruComponent.prototype.getTekDogruluSecenekSayisi = function () {
        var tekDoguruluSecenekler = this.coktanSecmeliSoruSecenekService.soruForm.get('secenekler');
        if (!tekDoguruluSecenekler) {
            return 0;
        }
        return tekDoguruluSecenekler.length;
    };
    CoktanSecmeliSoruComponent.prototype.refresh = function () {
        this.cd.markForCheck();
    };
    CoktanSecmeliSoruComponent.prototype.ngOnDestroy = function () {
        this.cd.detach();
        this.mobileQuery.removeListener(this._mobileQueryListener);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])(_angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControlName"], { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
    ], CoktanSecmeliSoruComponent.prototype, "formInputElements", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('hedefler'),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatSelectionList"])
    ], CoktanSecmeliSoruComponent.prototype, "hedeflerSecimListesi", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('defter'),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatTabGroup"])
    ], CoktanSecmeliSoruComponent.prototype, "defter", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('sureSlider'),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatSlider"])
    ], CoktanSecmeliSoruComponent.prototype, "sureKulagi", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostBinding"])('class.tam-ekran'),
        __metadata("design:type", Boolean)
    ], CoktanSecmeliSoruComponent.prototype, "tamEkran", void 0);
    CoktanSecmeliSoruComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-coktan-secmeli-soru',
            template: __webpack_require__(/*! ./coktan-secmeli-soru.component.html */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/coktan-secmeli-soru.component.html"),
            styles: [__webpack_require__(/*! ./coktan-secmeli-soru.component.scss */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/coktan-secmeli-soru.component.scss")],
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].Default,
            encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewEncapsulation"].None
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_4__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_4__["MatDialogRef"], Object, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormBuilder"],
            _fuse_services_config_service__WEBPACK_IMPORTED_MODULE_11__["FuseConfigService"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_8__["Store"],
            _ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__["TranslateService"],
            _core_services_sb_mesaj_service__WEBPACK_IMPORTED_MODULE_12__["SbMesajService"],
            _validators__WEBPACK_IMPORTED_MODULE_14__["CoktanSecmeliSoruValidatorleri"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _angular_cdk_platform__WEBPACK_IMPORTED_MODULE_2__["Platform"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"],
            _coktan_secmeli_soru_secenek_service__WEBPACK_IMPORTED_MODULE_13__["CoktanSecmeliSoruSecenekService"],
            _sorular_service__WEBPACK_IMPORTED_MODULE_15__["SorularService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"],
            _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_3__["MediaMatcher"]])
    ], CoktanSecmeliSoruComponent);
    return CoktanSecmeliSoruComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-detay/tek-dogrulu-secenek-detay.component.html":
/*!******************************************************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-detay/tek-dogrulu-secenek-detay.component.html ***!
  \******************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"!secenekFormu\" fxLayout=\"column\" fxLayoutAlign=\"center center\" fxFlex>\n  <mat-icon class=\"s-120 mb-12 select-todo-icon\" *fuseIfOnDom [@animate]=\"{value:'*',params:{delay:'300ms',scale:'0.2'}}\">check_box\n  </mat-icon>\n  <span class=\"hint-text mat-h1 select-todo-text\" *fuseIfOnDom [@animate]=\"{value:'*',params:{delay:'400ms'}}\">Seçenek seç\n  </span>\n</div>\n\n<div *ngIf=\"secenekFormu\">\n  <div class=\"todo-header\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\n\n    <div class=\"actions\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\n\n      <button mat-button class=\"mat-icon-button\" (click)=\"addTekDogruluSecenek($event)\" aria-label=\"Seçenek ekle\" fxHide.lt-lg>\n        <mat-icon matTooltip=\"Yeni seçenek ekle\" class=\"ekle\">add_box</mat-icon>\n      </button>\n\n      <button mat-button class=\"mat-icon-button\" (click)=\"toggleSecenekSil($event)\" aria-label=\"Toggle delete\" fxHide.lt-lg>\n        <mat-icon matTooltip=\"Bu seçeneği sil\">delete</mat-icon>\n      </button>\n\n    </div>\n    <div class=\"actions\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\n      <button mat-button class=\"mat-icon-button\" (click)=\"tekDogruluSecenekService.oncekiSonrakiSecenegeGit(-1)\" aria-label=\"Toggle delete\">\n        <mat-icon matTooltip=\"Önceki seçeneğe git\">navigate_before</mat-icon>\n      </button>\n      <button mat-button class=\"mat-icon-button\" (click)=\"tekDogruluSecenekService.oncekiSonrakiSecenegeGit(1)\" aria-label=\"Toggle delete\">\n        <mat-icon matTooltip=\"Sonraki seçeneğe git\">navigate_next</mat-icon>\n      </button>\n    </div>\n  </div>\n  <div class=\"todo-content\">\n    <form [formGroup]=\"secenekFormu\">\n      <fuse-sb-html-editor [parentForm]=\"secenekFormu\" parentFormControlName=\"secenekMetni\"  ></fuse-sb-html-editor>\n\n      <div class=\"secenek-ozellik-listesi\" fxLayout=\"column\" fxLayoutAlign=\"start start\" fxLayoutGap=\"10px\">\n        <mat-checkbox formControlName=\"dogruSecenek\" (change)=\"toggleDogruSecenek($event)\" [disabled]=\"hemenElenebilirSecenek\" >\n          Doğru seçenek\n        </mat-checkbox>\n\n        <mat-checkbox formControlName=\"hemenElenebilir\" (change)=\"toggleHemenElenebilir($event)\" [disabled]=\"dogruSecenek\">\n          İlk bakışta elenebilir seçenek.\n        </mat-checkbox>\n      </div>\n      <!-- <div class=\"tags m-12\" fxLayout=\"row\" fxLayoutAlign=\"start center\" fxLayoutWrap fxHide.lt->\n  \n          <div class=\"tag\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\n            <div class=\"tag-color\" [ngStyle]=\"{'background-color': dogruSecenek?'green':'#E2474C'}\"></div>\n            <div class=\"tag-label\">{{dogruSecenek?'Doğru Cevap':'Çeldirici'}}</div>\n          </div>\n  \n          <div class=\"tag\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\n            <div class=\"tag-color\" [ngStyle]=\"{'background-color': hemenElenebilirSecenek?'#252D43':'#AF373A'}\"></div>\n            <div class=\"tag-label\">{{hemenElenebilirSecenek?'Hemen Elenebilir':'Hemen Elenemez'}}</div>\n          </div>\n  \n        </div> -->\n\n    </form>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-detay/tek-dogrulu-secenek-detay.component.scss":
/*!******************************************************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-detay/tek-dogrulu-secenek-detay.component.scss ***!
  \******************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n:host {\n  display: flex;\n  flex: 1 0 auto;\n  flex-direction: column;\n  min-height: 20vh;\n  height: 50vh;\n  background-color: #E2E3DD;\n  color: #406D95; }\n:host .todo-header {\n    padding: 22px;\n    padding-bottom: 23px;\n    border-bottom: 1px solid rgba(0, 0, 0, 0.12);\n    background: rgba(0, 0, 0, 0.06); }\n:host .todo-header .actions {\n      min-width: 88px; }\n:host .todo-content {\n    padding: 8; }\n:host .todo-content .title {\n      font-size: 17px;\n      font-weight: 700; }\n:host .todo-content .tag {\n      font-size: 11px;\n      border-radius: 2px;\n      margin: 8px 4px 0 0;\n      padding: 3px 8px;\n      background-color: rgba(0, 0, 0, 0.08); }\n:host .todo-content .tag .tag-color {\n        width: 8px;\n        height: 8px;\n        margin-right: 8px;\n        border-radius: 50%; }\n:host .todo-content .dates .mat-form-field {\n      width: auto !important; }\n:host .sil {\n    color: #AF373A !important; }\n:host .ekle {\n    color: #406D95 !important; }\n:host .secenek-ozellik-listesi {\n    padding-left: 24px; }\n"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-detay/tek-dogrulu-secenek-detay.component.ts":
/*!****************************************************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-detay/tek-dogrulu-secenek-detay.component.ts ***!
  \****************************************************************************************************************************************************/
/*! exports provided: TekDogruluSecenekDetayComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TekDogruluSecenekDetayComponent", function() { return TekDogruluSecenekDetayComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var rxjs_add_operator_debounceTime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/add/operator/debounceTime */ "./node_modules/rxjs-compat/_esm5/add/operator/debounceTime.js");
/* harmony import */ var rxjs_add_operator_distinctUntilChanged__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/add/operator/distinctUntilChanged */ "./node_modules/rxjs-compat/_esm5/add/operator/distinctUntilChanged.js");
/* harmony import */ var _fuse_animations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fuse/animations */ "./src/@fuse/animations/index.ts");
/* harmony import */ var _coktan_secmeli_soru_secenek_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../coktan-secmeli-soru-secenek.service */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru-secenek.service.ts");
/* harmony import */ var _core_services_sb_mesaj_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../../core/services/sb-mesaj.service */ "./src/app/core/services/sb-mesaj.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var TekDogruluSecenekDetayComponent = /** @class */ (function () {
    function TekDogruluSecenekDetayComponent(tekDogruluSecenekService, cd, mesajService, formBuilder) {
        this.tekDogruluSecenekService = tekDogruluSecenekService;
        this.cd = cd;
        this.mesajService = mesajService;
        this.formBuilder = formBuilder;
    }
    TekDogruluSecenekDetayComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Subscribe to update the current todo
        this.onCurrentTodoChanged =
            this.tekDogruluSecenekService.onCurrentTodoChanged
                .subscribe(function (todo) {
                _this.secenekFormu = todo;
                _this.stilSiniflariniAyarla();
                _this.cd.detectChanges();
            });
    };
    TekDogruluSecenekDetayComponent.prototype.stilSiniflariniAyarla = function () {
        if (this.secenekFormu) {
            this.dogruSecenek = this.secenekFormu.get('dogruSecenek').value;
            this.yanlisSecenek = !this.dogruSecenek;
            this.hemenElenebilirSecenek = this.secenekFormu.get('hemenElenebilir').value;
        }
    };
    TekDogruluSecenekDetayComponent.prototype.toggleDogruSecenek = function () {
        this.tekDogruluSecenekService.hesaplariYap();
        this.tekDogruluSecenekService.onCurrentTodoChanged.next(this.secenekFormu);
    };
    TekDogruluSecenekDetayComponent.prototype.toggleHemenElenebilir = function () {
        this.tekDogruluSecenekService.hesaplariYap();
        this.tekDogruluSecenekService.onCurrentTodoChanged.next(this.secenekFormu);
    };
    TekDogruluSecenekDetayComponent.prototype.toggleSecenekSil = function (event) {
        event.stopPropagation();
        this.tekDogruluSecenekService.silTekDogruluSecenek(this.secenekFormu);
    };
    TekDogruluSecenekDetayComponent.prototype.addTekDogruluSecenek = function () {
        this.tekDogruluSecenekService.onNewTodoClicked.next('');
    };
    TekDogruluSecenekDetayComponent.prototype.ngOnDestroy = function () {
        if (this.onFormChange) {
            this.onFormChange.unsubscribe();
        }
        this.onCurrentTodoChanged.unsubscribe();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostBinding"])('class.selected'),
        __metadata("design:type", Boolean)
    ], TekDogruluSecenekDetayComponent.prototype, "selected", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostBinding"])('class.aktif'),
        __metadata("design:type", Boolean)
    ], TekDogruluSecenekDetayComponent.prototype, "aktif", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostBinding"])('class.dogru'),
        __metadata("design:type", Boolean)
    ], TekDogruluSecenekDetayComponent.prototype, "dogruSecenek", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostBinding"])('class.yanlis'),
        __metadata("design:type", Boolean)
    ], TekDogruluSecenekDetayComponent.prototype, "yanlisSecenek", void 0);
    TekDogruluSecenekDetayComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-tek-dogrulu-secenek-detay',
            template: __webpack_require__(/*! ./tek-dogrulu-secenek-detay.component.html */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-detay/tek-dogrulu-secenek-detay.component.html"),
            styles: [__webpack_require__(/*! ./tek-dogrulu-secenek-detay.component.scss */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-detay/tek-dogrulu-secenek-detay.component.scss")],
            animations: _fuse_animations__WEBPACK_IMPORTED_MODULE_4__["fuseAnimations"]
        }),
        __metadata("design:paramtypes", [_coktan_secmeli_soru_secenek_service__WEBPACK_IMPORTED_MODULE_5__["CoktanSecmeliSoruSecenekService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"],
            _core_services_sb_mesaj_service__WEBPACK_IMPORTED_MODULE_6__["SbMesajService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]])
    ], TekDogruluSecenekDetayComponent);
    return TekDogruluSecenekDetayComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-item/tek-dogrulu-secenek-item.component.html":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-item/tek-dogrulu-secenek-item.component.html ***!
  \*****************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n\n    <mat-checkbox [(ngModel)]=\"selected\" (ngModelChange)=\"onSelectedChange()\" class=\"mr-16\" fxFlex=\"0 1 auto\" (click)=\"$event.stopPropagation()\">\n    </mat-checkbox>\n\n    <div fxLayout=\"row\" fxLayoutAlign=\"start center\" fxFlex>\n\n        <div class=\"info\" fxFlex fxFlexLayout=\"column\">\n            <div class=\"notes\">\n\n                <div [innerHTML]=\"secenekCtrl.get('secenekMetni').value\"></div>\n\n            </div>\n            <!-- <div class=\"notes\">\n                    {{secenekCtrl.get('tekDogruluSoruSecenekId').value}}\n            </div> -->\n            <div  class=\"tags\" fxLayout=\"row\" fxLayoutAlign=\"start center\" fxLayoutWrap\n                fxHide.lt-lg>\n\n                <div *ngIf=\"secenekCtrl.get('dogruSecenek')?.value\" class=\"tag\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\n                    <div class=\"tag-color\" [ngStyle]=\"{'background-color':'green'}\"></div>\n                    <div class=\"tag-label\">Doğru seçenek</div>\n                </div>\n\n                <div *ngIf=\"secenekCtrl.get('hemenElenebilir')?.value\" class=\"tag\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\n                    <div class=\"tag-color\" [ngStyle]=\"{'background-color':'#252D43'}\"></div>\n                    <div class=\"tag-label\">İlk bakışta elenebilir seçenek.</div>\n                </div>\n\n            </div>\n\n        </div>\n        <div class=\"actions\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\n            <div fxHide fxShow.gt-md>\n                <button mat-button class=\"mat-icon-button\" (click)=\"secenekSil($event)\" aria-label=\"Toggle delete\">\n                    <mat-icon >delete</mat-icon>\n                </button>\n            </div>\n            <button mat-button [matMenuTriggerFor]=\"moreMenu\" aria-label=\"More\" class=\"mat-icon-button\" (click)=\"$event.stopPropagation();\"\n                fxHide.xs>\n                <mat-icon>more_vert</mat-icon>\n            </button>\n            <mat-menu #moreMenu=\"matMenu\">\n                <button mat-menu-item aria-label=\"dogru secenek degistirici\" (click)=\"toggleDogruSecenek($event)\">\n                    <ng-container *ngIf=\"secenekCtrl.get('dogruSecenek')?.value===true\">\n                        <span>Doğru seçenek olmasın</span>\n                    </ng-container>\n                    <ng-container *ngIf=\"!secenekCtrl.get('dogruSecenek')?.value===true\">\n                        <span>Doğru seçenek yap</span>\n                    </ng-container>\n                </button>\n                <button mat-menu-item aria-label=\"ilk bakista elenebilir secenek degistirici\" (click)=\"toggleHemenElenebilir($event)\">\n                        <ng-container *ngIf=\"secenekCtrl.get('hemenElenebilir')?.value===true\">\n                            <span>İlk bakışta elenebilir olmasın</span>\n                        </ng-container>\n                        <ng-container *ngIf=\"secenekCtrl.get('hemenElenebilir')?.value===false\">\n                            <span>İlk bakışta elenebilir yap</span>\n                        </ng-container>\n                    </button>\n    \n               \n            </mat-menu>\n\n        </div>\n\n    </div>\n\n</div>"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-item/tek-dogrulu-secenek-item.component.scss":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-item/tek-dogrulu-secenek-item.component.scss ***!
  \*****************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n.todo-list-item {\n  display: block;\n  position: relative;\n  padding: 16px 16px 16px 24px;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.08);\n  text-transform: none;\n  cursor: pointer;\n  flex-shrink: 0;\n  background: #D8E8E9; }\n.todo-list-item .tags .tag {\n    font-size: 11px;\n    border-radius: 2px;\n    margin: 8px 4px 0 0;\n    padding: 3px 8px;\n    background-color: rgba(0, 0, 0, 0.08); }\n.todo-list-item .tags .tag .tag-color {\n      width: 8px;\n      height: 8px;\n      margin-right: 8px;\n      border-radius: 50%; }\n.todo-list-item.selected {\n    background: #A8D0DA; }\n.todo-list-item.aktif {\n    background: #E2E3DD; }\n.todo-list-item .info {\n    color: #2F3A57;\n    margin: 0 16px 0 8px; }\n.todo-list-item .info .title {\n      font-size: 15px;\n      font-weight: 500; }\n.todo-list-item .info .notes {\n      margin-top: 4px; }\n.todo-list-item .buttons .is-starred {\n    margin: 0 0 0 16px; }\n.todo-list-item .buttons .is-important {\n    margin: 0; }\n.todo-list-item .sil {\n    color: #E2474C !important; }\n.todo-list-item .actions {\n    color: #2F3A57; }\n"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-item/tek-dogrulu-secenek-item.component.ts":
/*!***************************************************************************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-item/tek-dogrulu-secenek-item.component.ts ***!
  \***************************************************************************************************************************************************************************/
/*! exports provided: TekDogruluSecenekItemComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TekDogruluSecenekItemComponent", function() { return TekDogruluSecenekItemComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _coktan_secmeli_soru_secenek_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../coktan-secmeli-soru-secenek.service */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru-secenek.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var TekDogruluSecenekItemComponent = /** @class */ (function () {
    function TekDogruluSecenekItemComponent(tekDogruluSecenekService) {
        this.tekDogruluSecenekService = tekDogruluSecenekService;
    }
    TekDogruluSecenekItemComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Subscribe to update on selected todo change
        this.onSelectedTodosChanged =
            this.tekDogruluSecenekService.onSelectedTodosChanged
                .subscribe(function (selectedTodos) {
                _this.selected = false;
                if (selectedTodos && selectedTodos.length > 0) {
                    for (var _i = 0, selectedTodos_1 = selectedTodos; _i < selectedTodos_1.length; _i++) {
                        var todo = selectedTodos_1[_i];
                        if (todo.get('tekDogruluSoruSecenekId').value === _this.secenekCtrl.get('tekDogruluSoruSecenekId').value) {
                            _this.selected = true;
                            break;
                        }
                    }
                }
            });
        this.onAktifSecenekChanged = this.tekDogruluSecenekService.onCurrentTodoChanged.subscribe(function (suanki) {
            _this.aktif = false;
            _this.dogruSecenek = false;
            if (suanki) {
                _this.aktif = (suanki.get('tekDogruluSoruSecenekId').value === _this.secenekCtrl.get('tekDogruluSoruSecenekId').value);
                if (_this.aktif) {
                    _this.secenekCtrl = suanki;
                    _this.dogruSecenek = _this.secenekCtrl.get('dogruSecenek').value;
                    _this.hemenElenebilirSecenek = _this.secenekCtrl.get('hemenElenebilir').value;
                }
            }
        });
    };
    TekDogruluSecenekItemComponent.prototype.secenekSil = function (event) {
        event.stopPropagation();
        this.tekDogruluSecenekService.silTekDogruluSecenek(this.secenekCtrl);
    };
    TekDogruluSecenekItemComponent.prototype.toggleHemenElenebilir = function (event) {
        event.stopPropagation();
        var hemenElenebilirSecenek = this.secenekCtrl.get('hemenElenebilir').value;
        this.secenekCtrl.patchValue({ hemenElenebilir: !hemenElenebilirSecenek });
        this.tekDogruluSecenekService.onCurrentTodoChanged.next(this.secenekCtrl);
    };
    TekDogruluSecenekItemComponent.prototype.ngOnDestroy = function () {
        this.onSelectedTodosChanged.unsubscribe();
        this.onAktifSecenekChanged.unsubscribe();
    };
    TekDogruluSecenekItemComponent.prototype.onSelectedChange = function () {
        var id = this.secenekCtrl.get('tekDogruluSoruSecenekId').value;
        this.tekDogruluSecenekService.toggleSelectedtekDogruluSecenek(id);
    };
    TekDogruluSecenekItemComponent.prototype.toggleDogruSecenek = function (event) {
        event.stopPropagation();
        var id = this.secenekCtrl.get('tekDogruluSoruSecenekId').value;
        this.tekDogruluSecenekService.toogleDogruSecenek(id);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"])
    ], TekDogruluSecenekItemComponent.prototype, "secenekCtrl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], TekDogruluSecenekItemComponent.prototype, "indeks", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostBinding"])('class.selected'),
        __metadata("design:type", Boolean)
    ], TekDogruluSecenekItemComponent.prototype, "selected", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostBinding"])('class.aktif'),
        __metadata("design:type", Boolean)
    ], TekDogruluSecenekItemComponent.prototype, "aktif", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostBinding"])('class.dogru'),
        __metadata("design:type", Boolean)
    ], TekDogruluSecenekItemComponent.prototype, "dogruSecenek", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostBinding"])('class.yanlis'),
        __metadata("design:type", Boolean)
    ], TekDogruluSecenekItemComponent.prototype, "yanlisSecenek", void 0);
    TekDogruluSecenekItemComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-tek-dogrulu-secenek-item',
            template: __webpack_require__(/*! ./tek-dogrulu-secenek-item.component.html */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-item/tek-dogrulu-secenek-item.component.html"),
            styles: [__webpack_require__(/*! ./tek-dogrulu-secenek-item.component.scss */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-item/tek-dogrulu-secenek-item.component.scss")],
            encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewEncapsulation"].None,
        }),
        __metadata("design:paramtypes", [_coktan_secmeli_soru_secenek_service__WEBPACK_IMPORTED_MODULE_2__["CoktanSecmeliSoruSecenekService"]])
    ], TekDogruluSecenekItemComponent);
    return TekDogruluSecenekItemComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-list.component.html":
/*!****************************************************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-list.component.html ***!
  \****************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"secenekler?.controls?.length === 0\" fxLayout=\"column\" fxLayoutAlign=\"center center\" fxFlexFill>\n    <span class=\"no-todos-text  hint-text\">Hiç seçenek yok!</span>\n  </div>\n  \n  <div class=\"todo-list\" *fuseIfOnDom [@animateStagger]=\"{value:'50'}\">\n    <fuse-tek-dogrulu-secenek-item class=\"todo-list-item has-handle\" *ngFor=\"let secenekCtrl of secenekler.controls let i=index\"\n      [indeks]=\"i\" [secenekCtrl]=\"secenekCtrl\"  (click)=\"readTodo(secenekCtrl.get('tekDogruluSoruSecenekId'))\"\n      [ngClass]=\"{'current-todo':secenekCtrl?.get('tekDogruluSoruSecenekId').value == currentTodo?.get('tekDogruluSoruSecenekId').value}\"\n      matRipple [@animate]=\"{value:'*',params:{y:'100%'}}\">\n    </fuse-tek-dogrulu-secenek-item>\n  </div>"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-list.component.scss":
/*!****************************************************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-list.component.scss ***!
  \****************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: flex;\n  flex: 1 0 auto;\n  flex-direction: column;\n  overflow-y: auto;\n  position: relative;\n  padding: 0;\n  border-right: 1px solid rgba(0, 0, 0, 0.12);\n  min-height: 20vh;\n  height: 50vh;\n  background-color: #D8E8E9; }\n  :host .no-todos-text {\n    font-size: 24px;\n    font-weight: 300; }\n"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-list.component.ts":
/*!**************************************************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-list.component.ts ***!
  \**************************************************************************************************************************************************/
/*! exports provided: TekDogruluSecenekListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TekDogruluSecenekListComponent", function() { return TekDogruluSecenekListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _fuse_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fuse/animations */ "./src/@fuse/animations/index.ts");
/* harmony import */ var _coktan_secmeli_soru_secenek_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../coktan-secmeli-soru-secenek.service */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru-secenek.service.ts");
/* harmony import */ var _core_services_sb_mesaj_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../../core/services/sb-mesaj.service */ "./src/app/core/services/sb-mesaj.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var TekDogruluSecenekListComponent = /** @class */ (function () {
    function TekDogruluSecenekListComponent(tekDogruluSecenekService, mesajService) {
        this.tekDogruluSecenekService = tekDogruluSecenekService;
        this.mesajService = mesajService;
    }
    Object.defineProperty(TekDogruluSecenekListComponent.prototype, "secenekler", {
        get: function () {
            return this.tekDogruluSecenekService.soruForm.get('secenekler');
        },
        enumerable: true,
        configurable: true
    });
    TekDogruluSecenekListComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Subscribe to update current todo on changes
        this.onCurrentTodoChanged =
            this.tekDogruluSecenekService.onCurrentTodoChanged
                .subscribe(function (currentTodo) {
                if (!currentTodo) {
                    _this.currentTodo = null;
                }
                else {
                    _this.currentTodo = currentTodo;
                }
            });
        this.secenekler.valueChanges.subscribe(function (gelenler) {
            var dogruSecenekSayisi = gelenler.filter(function (s) { return s.dogruSecenek === true; });
            if (dogruSecenekSayisi && dogruSecenekSayisi.length > 1) {
                _this.mesajService.hataStr("Bu soru i\u00E7in  SADECE bir do\u011Fru se\u00E7enek belirleyebilirsiniz! Siz " + dogruSecenekSayisi.length + " se\u00E7ene\u011Fi do\u011Fru olarak i\u015Faretlediniz!");
            }
        });
    };
    TekDogruluSecenekListComponent.prototype.readTodo = function (todoId) {
        // Set current todo
        this.tekDogruluSecenekService.setCurrentSecenek(todoId.value);
    };
    TekDogruluSecenekListComponent.prototype.onDrop = function (ev) {
    };
    TekDogruluSecenekListComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-tek-dogrulu-secenek-list',
            template: __webpack_require__(/*! ./tek-dogrulu-secenek-list.component.html */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-list.component.html"),
            styles: [__webpack_require__(/*! ./tek-dogrulu-secenek-list.component.scss */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-list.component.scss")],
            animations: _fuse_animations__WEBPACK_IMPORTED_MODULE_1__["fuseAnimations"]
        }),
        __metadata("design:paramtypes", [_coktan_secmeli_soru_secenek_service__WEBPACK_IMPORTED_MODULE_2__["CoktanSecmeliSoruSecenekService"], _core_services_sb_mesaj_service__WEBPACK_IMPORTED_MODULE_3__["SbMesajService"]])
    ], TekDogruluSecenekListComponent);
    return TekDogruluSecenekListComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek.component.html":
/*!**********************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek.component.html ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"page-layout carded left-sidenav\" fusePerfectScrollbar>\n    <!-- TOP BACKGROUND -->\n    <!-- <div class=\"top-bg mat-accent-bg\"></div> -->\n    <!-- / TOP BACKGROUND -->\n    <!-- CENTER -->\n    <div class=\"center\">\n        <!-- CONTENT HEADER -->\n        <!-- <div class=\"header\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\n            <div class=\"search-wrapper mat-white-bg\" fxFlex fxLayout=\"row\" fxLayoutAlign=\"start center\">\n                <button mat-button class=\"mat-icon-button sidenav-toggle\" fuseMatSidenavToggler=\"carded-left-sidenav\" fxHide.gt-md aria-label=\"Toggle Sidenav\">\n                    <mat-icon>menu</mat-icon>\n                </button>\n                <div class=\"search\" flex fxLayout=\"row\" fxLayoutAlign=\"start center\">\n                    <mat-icon>search</mat-icon>\n                    <input [formControl]=\"searchInput\" placeholder=\"Aramak için kelime yazın\" fxFlex>\n                </div>\n            </div>\n        </div> -->\n        <!-- / CONTENT HEADER -->\n        <!-- CONTENT CARD -->\n        <div class=\"content-card\" [ngClass]=\"{'aktif-secenek-var':currentTodo}\">\n            <!-- CONTENT TOOLBAR -->\n            <div class=\"toolbar\">\n                <div class=\"todo-selection\" fxFlex=\"row\" fxLayoutAlign=\"start center\">\n                    <mat-checkbox (click)=\"toggleSelectAll()\" [checked]=\"hasSelectedTodos\" [indeterminate]=\"isIndeterminate\"></mat-checkbox>\n                    <button mat-icon-button [matMenuTriggerFor]=\"selectMenu\">\n                        <mat-icon>arrow_drop_down</mat-icon>\n                    </button>\n\n                    <mat-menu #selectMenu=\"matMenu\">\n                        <button mat-menu-item (click)=\"selectTodos()\">Tümü</button>\n                        <button mat-menu-item (click)=\"deselectTodos()\">Hiçbiri</button>\n                        <button mat-menu-item (click)=\"selectTodos('dogruSecenek', true)\">Doğru olanlar</button>\n                        <button mat-menu-item (click)=\"selectTodos('dogruSecenek', false)\">Doğru olmayanlar</button>\n                        <button mat-menu-item (click)=\"selectTodos('hemenElenebilir', true)\">Hemen elenebilirler</button>\n                        <button mat-menu-item (click)=\"selectTodos('hemenElenebilir', false)\">Hemen elenemezler</button>\n                    </mat-menu>\n                    <div class=\"toolbar-separator\"></div>\n                    <button mat-button class=\"mat-icon-button\" (click)=\"addTekDogruluSecenek($event)\" aria-label=\"Seçenek ekle\">\n                        <mat-icon class=\"ekle\" matTooltip=\"Yeni seçenek ekle\">add_box</mat-icon>\n                    </button>\n                    <div class=\"toolbar-separator\" *ngIf=\"hasSelectedTodos\"></div>\n                    <button mat-icon-button (click)=\"seciliSecenekleriSil()\" *ngIf=\"hasSelectedTodos\">\n                        <mat-icon class=\"sil\" matTooltip=\"Seçili seçenekleri sil\">delete_sweep</mat-icon>\n                    </button>\n                    <div class=\"toolbar-separator\"></div>\n                    <div matTooltip=\"Tek seferde elenebilir soru sayısı\">\n                        HESS :{{hemenElenebilirSecenekSayisi}}\n                    </div>\n                    <div class=\"toolbar-separator\"></div>\n                    <div matTooltip=\"Doğru seçenek sayısı\">\n                        D.S.S.:{{dogruSeceneksayisi}}\n                    </div>\n                </div>\n                <div *ngIf=\"currentTodo\" fxHide.gt-md>\n                    <button mat-icon-button (click)=\"deSelectCurrentTodo()\">\n                        <mat-icon>arrow_back</mat-icon>\n                    </button>\n                    <button mat-button class=\"mat-icon-button\" (click)=\"addTekDogruluSecenek($event)\" aria-label=\"Seçenek ekle\">\n                            <mat-icon matTooltip=\"Yeni seçenek ekle\" class=\"ekle\">add_box</mat-icon>\n                    </button>\n                    <button mat-button class=\"mat-icon-button\" (click)=\"toggleSecenekSil($event)\" aria-label=\"Toggle delete\">\n                            <mat-icon class=\"sil\" matTooltip=\"Bu seçeneği sil\">delete</mat-icon>\n                    </button>\n                </div>\n            </div>\n            <!-- / CONTENT TOOLBAR -->\n            <!-- CONTENT -->\n            <div class=\"content\"  fxLayout=\"row\" fxFlexAlign=\"row\">\n                <fuse-tek-dogrulu-secenek-list fusePerfectScrollbar fxFlex></fuse-tek-dogrulu-secenek-list>\n                <fuse-tek-dogrulu-secenek-detay fusePerfectScrollbar fxFlex></fuse-tek-dogrulu-secenek-detay>\n            </div>\n            <!-- / CONTENT -->\n        </div>\n        <!-- / CONTENT CARD -->\n    </div>\n    <!-- / CENTER -->\n</div>"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek.component.scss":
/*!**********************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek.component.scss ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n:host {\n  width: 100%; }\n:host .center .header .search-wrapper {\n    box-shadow: 0px 4px 5px -2px rgba(0, 0, 0, 0.2), 0px 7px 10px 1px rgba(0, 0, 0, 0.14), 0px 2px 16px 1px rgba(0, 0, 0, 0.12); }\n:host .center .header .search-wrapper .sidenav-toggle {\n      margin: 0;\n      width: 56px;\n      height: 56px;\n      border-radius: 0;\n      border-right: 1px solid rgba(0, 0, 0, 0.12); }\n:host .center .header .search-wrapper .search {\n      width: 100%;\n      height: 56px;\n      line-height: 56px;\n      padding: 18px; }\n:host .center .header .search-wrapper .search input {\n        height: 56px;\n        padding-left: 16px;\n        color: rgba(0, 0, 0, 0.54);\n        border: none;\n        outline: none; }\n:host .center .content-card .content {\n    background-color: #A8D0DA;\n    border-radius: 2px;\n    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\n    transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n    margin: 12px; }\n:host .center .content-card .toolbar {\n    background-color: #A8D0DA;\n    color: #2F3A57;\n    border-radius: 2px;\n    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\n    transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n    padding: 24px;\n    padding-top: 8px;\n    padding-bottom: 8px;\n    margin: 12px; }\n@media (max-width: 1279px) {\n    :host .center .content-card fuse-tek-dogrulu-secenek-list {\n      border-right: 0; }\n    :host .center .content-card fuse-tek-dogrulu-secenek-list,\n    :host .center .content-card fuse-tek-dogrulu-secenek-detay {\n      flex: 1 0 100%; }\n    :host .center .content-card fuse-tek-dogrulu-secenek-detay {\n      display: none !important; }\n    :host .center .content-card.aktif-secenek-var .toolbar {\n      padding-left: 16px !important; }\n      :host .center .content-card.aktif-secenek-var .toolbar .todo-selection {\n        display: none !important; }\n    :host .center .content-card.aktif-secenek-var .content fuse-tek-dogrulu-secenek-list {\n      display: none !important; }\n    :host .center .content-card.aktif-secenek-var .content fuse-tek-dogrulu-secenek-detay {\n      display: flex !important; } }\n:host .center .ekle {\n    color: #406D95 !important; }\n:host .center .sil {\n    color: #AF373A !important; }\n"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek.component.ts":
/*!********************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek.component.ts ***!
  \********************************************************************************************************************/
/*! exports provided: TekDogruluSecenekComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TekDogruluSecenekComponent", function() { return TekDogruluSecenekComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _fuse_animations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fuse/animations */ "./src/@fuse/animations/index.ts");
/* harmony import */ var _coktan_secmeli_soru_secenek_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../coktan-secmeli-soru-secenek.service */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru-secenek.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var TekDogruluSecenekComponent = /** @class */ (function () {
    function TekDogruluSecenekComponent(tekDogruluSecenekService, cd) {
        this.tekDogruluSecenekService = tekDogruluSecenekService;
        this.cd = cd;
        this.hemenElenebilirSecenekSayisi = 0;
        this.dogruSeceneksayisi = 0;
        this.searchInput = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('');
    }
    TekDogruluSecenekComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.onSelectedTodosChanged =
            this.tekDogruluSecenekService.onSelectedTodosChanged
                .subscribe(function (selectedTodos) {
                setTimeout(function () {
                    if (selectedTodos) {
                        _this.hasSelectedTodos = selectedTodos.length > 0;
                        _this.isIndeterminate = (selectedTodos.length !== _this.tekDogruluSecenekService.selectedTodos.length && selectedTodos.length > 0);
                    }
                    else {
                        _this.hasSelectedTodos = false;
                        _this.isIndeterminate = false;
                    }
                }, 0);
            });
        this.dogruSeceneksayisiDegisti = this.tekDogruluSecenekService
            .dogruSecenekSayisiDegisti.subscribe(function (gelensayi) { return _this.dogruSeceneksayisi = gelensayi; });
        this.hemenElenebilirSecenekSayisiDegisti = this.tekDogruluSecenekService
            .hemenElenebilirSecenekSayisiDegisti.subscribe(function (gelensayi) { return _this.hemenElenebilirSecenekSayisi = gelensayi; });
        this.searchInput.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(function (searchText) {
            _this.tekDogruluSecenekService.onSearchTextChanged.next(searchText);
        });
        this.onCurrentTodoChanged =
            this.tekDogruluSecenekService.onCurrentTodoChanged
                .subscribe(function (currentTodo) {
                if (!currentTodo) {
                    _this.currentTodo = null;
                }
                else {
                    _this.currentTodo = currentTodo;
                }
                _this.cd.detectChanges();
            });
    };
    TekDogruluSecenekComponent.prototype.deSelectCurrentTodo = function () {
        this.tekDogruluSecenekService.onCurrentTodoChanged.next(null);
    };
    TekDogruluSecenekComponent.prototype.seciliSecenekleriSil = function () {
        this.tekDogruluSecenekService.seciliSoruSecenekleriniSil();
    };
    TekDogruluSecenekComponent.prototype.ngOnDestroy = function () {
        this.onSelectedTodosChanged.unsubscribe();
        this.onCurrentTodoChanged.unsubscribe();
        this.cd.detach();
    };
    TekDogruluSecenekComponent.prototype.toggleSelectAll = function () {
        this.tekDogruluSecenekService.toggleSelectAll();
    };
    TekDogruluSecenekComponent.prototype.selectTodos = function (filterParameter, filterValue) {
        this.tekDogruluSecenekService.selectTodos(filterParameter, filterValue);
    };
    TekDogruluSecenekComponent.prototype.deselectTodos = function () {
        this.tekDogruluSecenekService.deselectTodos();
    };
    TekDogruluSecenekComponent.prototype.addTekDogruluSecenek = function (event) {
        event.stopPropagation();
        this.tekDogruluSecenekService.onNewTodoClicked.next('');
    };
    TekDogruluSecenekComponent.prototype.toggleSecenekSil = function (event) {
        event.stopPropagation();
        this.tekDogruluSecenekService.silTekDogruluSecenek(this.currentTodo);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_2__["MatSidenav"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatSidenav"])
    ], TekDogruluSecenekComponent.prototype, "navigasyon", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroup"])
    ], TekDogruluSecenekComponent.prototype, "soruForm", void 0);
    TekDogruluSecenekComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-tek-dogrulu-secenek',
            template: __webpack_require__(/*! ./tek-dogrulu-secenek.component.html */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek.component.html"),
            styles: [__webpack_require__(/*! ./tek-dogrulu-secenek.component.scss */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek.component.scss")],
            animations: _fuse_animations__WEBPACK_IMPORTED_MODULE_3__["fuseAnimations"]
        }),
        __metadata("design:paramtypes", [_coktan_secmeli_soru_secenek_service__WEBPACK_IMPORTED_MODULE_4__["CoktanSecmeliSoruSecenekService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]])
    ], TekDogruluSecenekComponent);
    return TekDogruluSecenekComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/validasyon.mesajlari.ts":
/*!***************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-soru/validasyon.mesajlari.ts ***!
  \***************************************************************************************/
/*! exports provided: CoktanSecmeliSoruValidasyonMesajlari_tr */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoktanSecmeliSoruValidasyonMesajlari_tr", function() { return CoktanSecmeliSoruValidasyonMesajlari_tr; });
function CoktanSecmeliSoruValidasyonMesajlari_tr() {
    return {
        // kaynakca: {
        //     required: 'Soru adı alanına bilgi girilmesi gerekli.',
        //     minlength: 'En az 3 karakter olmalıdır.',
        //     maxlength: 'En fazla 200 karakter olmalıdır.'
        // },
        soruBelgesi: {
            required: 'Soru belgesi alanına bilgi girilmesi gerekli.',
            minlength: 'En az 3 karakter olmalıdır.'
        },
        baslangic: {
            required: 'Başlangıç tarihi alanına bilgi girilmesi gerekli.'
        },
        gecerlilik: {
            bitisbaslangictanonceolamaz: 'Başlangıç tarihi bitiş tarihinden sonra olamaz.'
        },
        // aciklama: {
        //     required: 'Açıklama alanına bilgi girilmesi gerekli.',
        //     minlength: 'En az 3 karakter olmalıdır.',
        //     maxlength: 'En fazla 500 karakter olmalıdır.'
        // },
        anahtarKelimeler: {
            required: 'Anahtar kelimeler alanına bilgi girilmesi gerekli.',
        },
        soruTipNo: {
            required: 'Soru tipini seçmediniz.',
        },
        soruZorlukNo: {
            required: 'Soru zorluk derecesini seçmediniz.',
        },
        bilisselDuzeyNo: {
            required: 'Bilişsel düzeyi seçmediniz.',
        },
        tekDogruluSecenekleri: {
            hicSecenekGirilmemis: 'Seçenek girilmemiş.',
            secenekMetniBos: 'Seçenek metinleri boş olamaz.',
            tekDogruSecenekOlabilir: 'Sadece bir doğru seçenek olabilir.',
            dogruSecenekGirilmemis: 'Bir doğru seçenek belirlemeniz gerekli.'
        }
    };
}


/***/ }),

/***/ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/validators.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/coktan-secmeli-soru/validators.ts ***!
  \*****************************************************************************/
/*! exports provided: CoktanSecmeliSoruValidatorleri */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoktanSecmeliSoruValidatorleri", function() { return CoktanSecmeliSoruValidatorleri; });
/* harmony import */ var rxjs_add_operator_map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/add/operator/map */ "./node_modules/rxjs-compat/_esm5/add/operator/map.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var CoktanSecmeliSoruValidatorleri = /** @class */ (function () {
    function CoktanSecmeliSoruValidatorleri() {
    }
    CoktanSecmeliSoruValidatorleri.prototype.tekDogruluCoktanSecmeliSeceneklerValidator = function (control) {
        var array = control;
        if (!array) {
            return { tekDoguruluCoktanSecmeliSecenek: { value: true } };
        }
        else {
            var secenekSayisi = array.length;
            var dogruSecenekSayisi_1 = 0;
            var eksikSatirSayisi_1 = 0;
            if (array.length > 0) {
                array.controls.forEach(function (element) {
                    var secenekMetniValue = element.get('secenekMetni').value;
                    var dogruSecenekValue = element.get('dogruSecenek').value;
                    if (!secenekMetniValue || secenekMetniValue === '') {
                        eksikSatirSayisi_1++;
                    }
                    if (dogruSecenekValue === true) {
                        dogruSecenekSayisi_1++;
                    }
                });
            }
            if (secenekSayisi === 0) {
                return { hicSecenekGirilmemis: true };
            }
            if (eksikSatirSayisi_1 > 0) {
                return { secenekMetniBos: true };
            }
            if (dogruSecenekSayisi_1 === 0) {
                return { dogruSecenekGirilmemis: true };
            }
            if (dogruSecenekSayisi_1 > 1) {
                return { tekDogruSecenekOlabilir: true };
            }
            return null;
        }
    };
    CoktanSecmeliSoruValidatorleri.prototype.hemenElenebilirSecenekSayisi = function (control) {
        var tekDogruluSeceneklerArray = control.get('tekDogruluSecenekler');
        var hemenElenebiliSecenekSayisiControl = control.get('hemenElenebilirSecenekSayisi');
        if (tekDogruluSeceneklerArray == null || tekDogruluSeceneklerArray.length === 0 || hemenElenebiliSecenekSayisiControl == null) {
            return null;
        }
        if (tekDogruluSeceneklerArray.length < +hemenElenebiliSecenekSayisiControl.value) {
            return { hemenElenebilirSecenekSayisiYanlis: true };
        }
        return null;
    };
    CoktanSecmeliSoruValidatorleri.prototype.BitisBaslangictanOnceOlamaz = function (baslangicAdi, bitisAdi) {
        if (baslangicAdi === void 0) { baslangicAdi = ''; }
        if (bitisAdi === void 0) { bitisAdi = ''; }
        return function (c) {
            if (!baslangicAdi) {
                baslangicAdi = 'baslangic';
            }
            if (!bitisAdi) {
                bitisAdi = 'bitis';
            }
            var startControl = c.get(baslangicAdi);
            var endControl = c.get(bitisAdi);
            if (startControl != null && endControl != null) {
                if (startControl.pristine && endControl.pristine) {
                    return null;
                }
                if (startControl.value === '' || endControl.value === '') {
                    return null;
                }
                if (startControl.value < endControl.value) {
                    return null;
                }
            }
            return { 'bitisbaslangictanonceolamaz': true };
        };
    };
    CoktanSecmeliSoruValidatorleri.prototype.regExValidator = function (patern, validatosyonSonucStr) {
        return function (control) {
            var deger = patern.test(control.value);
            return deger ? null : { validatosyonSonucStr: { value: true } };
        };
    };
    CoktanSecmeliSoruValidatorleri = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])()
    ], CoktanSecmeliSoruValidatorleri);
    return CoktanSecmeliSoruValidatorleri;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/i18n/en.ts":
/*!******************************************************!*\
  !*** ./src/app/main/content/apps/sorular/i18n/en.ts ***!
  \******************************************************/
/*! exports provided: locale */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "locale", function() { return locale; });
var locale = {
    lang: 'en',
    data: {
        'SORUDEPO': {
            'LOGO_BASLIK': 'Soru Deposu',
            'YENI_SORU': 'YENİ SORU',
            'PROGRAMLAR': 'PROGRAMLAR',
            'DONEMLER': 'DONEMLER',
            'DERSKURULLARI': 'DERS KURULLARI',
            'STAJLAR': 'STAJLAR',
            'DERSLER': 'DERSLER',
            'KONULAR': 'KONULAR',
            'FILTRELER': 'FİLTRELER',
            'CEPBILGILERI': 'ÇEP BİLGİ',
            'SORU_YOK': 'Empty list.',
            'SORU_SEC': 'Ayrıntısını görmek için soru seçin',
            'ARA_PLACEHOLDER': 'Ders, konu, hedef ya da soru adı yazın',
            'OKUMAK_ICIN_SORU_SECIN': 'Okumak için bir soru seçin'
        }
    }
};


/***/ }),

/***/ "./src/app/main/content/apps/sorular/i18n/tr.ts":
/*!******************************************************!*\
  !*** ./src/app/main/content/apps/sorular/i18n/tr.ts ***!
  \******************************************************/
/*! exports provided: locale */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "locale", function() { return locale; });
var locale = {
    lang: 'tr',
    data: {
        'SORUDEPO': {
            'LOGO_BASLIK': 'Soru Deposu',
            'YENI_SORU': 'YENİ SORU',
            'PROGRAMLAR': 'PROGRAMLAR',
            'DONEMLER': 'DONEMLER',
            'DERSKURULLARI': 'DERS KURULLARI',
            'STAJLAR': 'STAJLAR',
            'DERSLER': 'DERSLER',
            'KONULAR': 'KONULAR',
            'FILTRELER': 'FİLTRELER',
            'CEPBILGILERI': 'ÇEP BİLGİ',
            'SORU_YOK': 'Kriterlere uyan soru yok.',
            'SORU_SEC': 'Ayrıntısını görmek için soru seçin',
            'ARA_PLACEHOLDER': 'Ders, konu, hedef ya da soru adı yazın',
            'OKUMAK_ICIN_SORU_SECIN': 'Okumak için bir soru seçin'
        }
    }
};


/***/ }),

/***/ "./src/app/main/content/apps/sorular/models/birim-program-donem-ders.ts":
/*!******************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/models/birim-program-donem-ders.ts ***!
  \******************************************************************************/
/*! exports provided: SoruBirimItem, SoruProgramItem, ProgramDonemItem, DersGrupItem, DersItem, KonuItem, SoruTipItem, SoruZorlukItem, SoruBilisselDuzeyItem, OgrenimHedefItem, HocaItem, AlanKoduItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruBirimItem", function() { return SoruBirimItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruProgramItem", function() { return SoruProgramItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgramDonemItem", function() { return ProgramDonemItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DersGrupItem", function() { return DersGrupItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DersItem", function() { return DersItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KonuItem", function() { return KonuItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruTipItem", function() { return SoruTipItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruZorlukItem", function() { return SoruZorlukItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruBilisselDuzeyItem", function() { return SoruBilisselDuzeyItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OgrenimHedefItem", function() { return OgrenimHedefItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HocaItem", function() { return HocaItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AlanKoduItem", function() { return AlanKoduItem; });
var SoruBirimItem = /** @class */ (function () {
    function SoruBirimItem() {
    }
    return SoruBirimItem;
}());

var SoruProgramItem = /** @class */ (function () {
    function SoruProgramItem() {
    }
    return SoruProgramItem;
}());

var ProgramDonemItem = /** @class */ (function () {
    function ProgramDonemItem() {
    }
    return ProgramDonemItem;
}());

var DersGrupItem = /** @class */ (function () {
    function DersGrupItem() {
    }
    return DersGrupItem;
}());

var DersItem = /** @class */ (function () {
    function DersItem() {
    }
    return DersItem;
}());

var KonuItem = /** @class */ (function () {
    function KonuItem() {
    }
    return KonuItem;
}());

var SoruTipItem = /** @class */ (function () {
    function SoruTipItem() {
    }
    return SoruTipItem;
}());

var SoruZorlukItem = /** @class */ (function () {
    function SoruZorlukItem() {
    }
    return SoruZorlukItem;
}());

var SoruBilisselDuzeyItem = /** @class */ (function () {
    function SoruBilisselDuzeyItem() {
    }
    return SoruBilisselDuzeyItem;
}());

var OgrenimHedefItem = /** @class */ (function () {
    function OgrenimHedefItem() {
    }
    return OgrenimHedefItem;
}());

var HocaItem = /** @class */ (function () {
    function HocaItem() {
    }
    return HocaItem;
}());

var AlanKoduItem = /** @class */ (function () {
    function AlanKoduItem() {
    }
    return AlanKoduItem;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/models/soru.ts":
/*!**********************************************************!*\
  !*** ./src/app/main/content/apps/sorular/models/soru.ts ***!
  \**********************************************************/
/*! exports provided: SoruListe, SoruYarat, SoruDegistir, IliskiliSoruListe, IliskiliSoruYarat, IliskiliSoruDegistir, OgrenimHedef, TekDogruluSoruSecenek */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruListe", function() { return SoruListe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruYarat", function() { return SoruYarat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruDegistir", function() { return SoruDegistir; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IliskiliSoruListe", function() { return IliskiliSoruListe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IliskiliSoruYarat", function() { return IliskiliSoruYarat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IliskiliSoruDegistir", function() { return IliskiliSoruDegistir; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OgrenimHedef", function() { return OgrenimHedef; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TekDogruluSoruSecenek", function() { return TekDogruluSoruSecenek; });
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SoruListe = /** @class */ (function () {
    function SoruListe(soru) {
        this.soruId = soru.soruId;
        this.birimNo = soru.birimNo;
        this.dersNo = soru.dersNo;
        this.dersAdi = soru.dersAdi;
        this.konuNo = soru.konuNo;
        this.soruTipNo = soru.soruTipNo;
        this.soruTipAdi = soru.soruTipAdi;
        this.soruZorlukNo = soru.soruZorlukNo;
        this.soruZorlukAdi = soru.soruZorlukAdi;
        this.kaynakca = soru.kaynakca;
        this.soruMetni = soru.soruMetni;
        this.soruKokuMetni = soru.soruKokuMetni;
        this.soruKokuNo = soru.soruKokuNo;
        this.soruKokuSorulariSayisi = soru.soruKokuSorulariSayisi;
        this.tekDogruluSecenekleri = soru.tekDogruluSecenekleri;
        this.secenekSayisi = soru.secenekSayisi;
        this.baslangic = soru.baslangic;
        this.bitis = soru.bitis;
        this.aciklama = soru.aciklama;
        this.hemenElenebilirSecenekSayisi = soru.hemenElenebilirSecenekSayisi;
        this.kabulEdilebilirlikIndeksi = soru.kabulEdilebilirlikIndeksi;
        this.bilisselDuzeyNo = soru.bilisselDuzeyNo;
        this.bilisselDuzeyAdi = soru.bilisselDuzeyAdi;
        this.cevaplamaSuresi = soru.cevaplamaSuresi;
        this.anahtarKelimeler = soru.anahtarKelimeler;
        this.soruHedefleri = soru.soruHedefleri;
        this.aktif = soru.aktif;
        this.onaylandi = soru.onaylandi;
        this.favori = soru.favori;
        this.silinemez = soru.silinemez;
        this.soruMetni = soru.soruMetni;
    }
    return SoruListe;
}());

var SoruYarat = /** @class */ (function () {
    function SoruYarat() {
    }
    return SoruYarat;
}());

var SoruDegistir = /** @class */ (function (_super) {
    __extends(SoruDegistir, _super);
    function SoruDegistir() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SoruDegistir;
}(SoruYarat));

var IliskiliSoruListe = /** @class */ (function () {
    function IliskiliSoruListe() {
    }
    return IliskiliSoruListe;
}());

var IliskiliSoruYarat = /** @class */ (function () {
    function IliskiliSoruYarat() {
    }
    return IliskiliSoruYarat;
}());

var IliskiliSoruDegistir = /** @class */ (function () {
    function IliskiliSoruDegistir() {
    }
    return IliskiliSoruDegistir;
}());

var OgrenimHedef = /** @class */ (function () {
    function OgrenimHedef() {
    }
    return OgrenimHedef;
}());

var TekDogruluSoruSecenek = /** @class */ (function () {
    function TekDogruluSoruSecenek(secenek) {
        this.tekDogruluSoruSecenekId = secenek.tekDogruluSoruSecenekId;
        this.secenekMetni = secenek.secenekMetni;
        this.dogruSecenek = secenek.dogruSecenek;
        this.hemenElenebilir = secenek.hemenElenebilir;
    }
    TekDogruluSoruSecenek.prototype.toogleDogruSecenek = function () {
        this.dogruSecenek = !this.dogruSecenek;
    };
    TekDogruluSoruSecenek.prototype.tooglehemenElenebilir = function () {
        this.hemenElenebilir = !this.hemenElenebilir;
    };
    return TekDogruluSoruSecenek;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-list.component.html":
/*!******************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-list.component.html ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"secilebilirOgrenimHedefleri?.length === 0\" fxLayout=\"column\" fxLayoutAlign=\"center center\" fxFlexFill>\n    <span class=\"no-todos-text  hint-text\">Seçilecek öğrenim hedefi yok!</span>\n  </div>\n  <div class=\"todo-list\"  *fuseIfOnDom [@animateStagger]=\"{value:'50'}\" >\n    <fuse-ogrenim-hedef-satir class=\"todo-list-item\" *ngFor=\"let hedef of secilebilirOgrenimHedefleri let i=index\" [indeks]=\"i\" [hedef]=\"hedef\"\n      matRipple   [@animate]=\"{value:'*',params:{y:'100%'}}\"></fuse-ogrenim-hedef-satir>\n    \n  </div>"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-list.component.scss":
/*!******************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-list.component.scss ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: flex;\n  flex: 1 0 auto;\n  flex-direction: column;\n  overflow-y: auto;\n  position: relative;\n  padding: 12px;\n  min-height: 20vh;\n  height: 50vh;\n  background-color: #D8E8E9; }\n  :host .no-todos-text {\n    font-size: 24px;\n    font-weight: 300; }\n"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-list.component.ts":
/*!****************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-list.component.ts ***!
  \****************************************************************************************************************/
/*! exports provided: OgrenimHedefListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OgrenimHedefListComponent", function() { return OgrenimHedefListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _fuse_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fuse/animations */ "./src/@fuse/animations/index.ts");
/* harmony import */ var _coktan_secmeli_soru_secenek_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../coktan-secmeli-soru-secenek.service */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru-secenek.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var OgrenimHedefListComponent = /** @class */ (function () {
    function OgrenimHedefListComponent(tekDogruluSecenekService) {
        this.tekDogruluSecenekService = tekDogruluSecenekService;
    }
    OgrenimHedefListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.onSecilebilirOgrenimHedefleriDegisti = this.tekDogruluSecenekService
            .secilebilirOgrenimHedefleriDegisti.subscribe(function (hedefler) {
            _this.secilebilirOgrenimHedefleri = hedefler;
        });
    };
    OgrenimHedefListComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-ogrenim-hedef-list',
            template: __webpack_require__(/*! ./ogrenim-hedef-list.component.html */ "./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-list.component.html"),
            styles: [__webpack_require__(/*! ./ogrenim-hedef-list.component.scss */ "./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-list.component.scss")],
            animations: _fuse_animations__WEBPACK_IMPORTED_MODULE_1__["fuseAnimations"]
        }),
        __metadata("design:paramtypes", [_coktan_secmeli_soru_secenek_service__WEBPACK_IMPORTED_MODULE_2__["CoktanSecmeliSoruSecenekService"]])
    ], OgrenimHedefListComponent);
    return OgrenimHedefListComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-satir/ogrenim-hedef-satir.component.html":
/*!***************************************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-satir/ogrenim-hedef-satir.component.html ***!
  \***************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n\n    <mat-checkbox [(ngModel)]=\"selected\" (ngModelChange)=\"onSelectedChange()\" class=\"mr-16\" fxFlex=\"0 1 auto\" (click)=\"$event.stopPropagation()\">\n    </mat-checkbox>\n\n    <div fxLayout=\"row\" fxLayoutAlign=\"start center\" fxFlex>\n\n        <div class=\"info\" fxFlex fxFlexLayout=\"column\">\n            <div class=\"notes\">\n                {{hedef.ogrenimHedefAdi}}\n            </div>\n\n        </div>\n        <div class=\"actions\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\n        </div>\n\n    </div>\n\n</div>"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-satir/ogrenim-hedef-satir.component.scss":
/*!***************************************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-satir/ogrenim-hedef-satir.component.scss ***!
  \***************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n.todo-list-item {\n  display: block;\n  position: relative;\n  padding: 16px 16px 16px 24px;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.08);\n  text-transform: none;\n  cursor: pointer;\n  flex-shrink: 0;\n  background: #E2E3DD; }\n.todo-list-item .tags .tag {\n    font-size: 11px;\n    border-radius: 2px;\n    margin: 8px 4px 0 0;\n    padding: 3px 8px;\n    background-color: rgba(0, 0, 0, 0.08); }\n.todo-list-item .tags .tag .tag-color {\n      width: 8px;\n      height: 8px;\n      margin-right: 8px;\n      border-radius: 50%; }\n.todo-list-item.aktif {\n    background: #A3C9D3;\n    color: #252D43; }\n.todo-list-item.aktif .title,\n    .todo-list-item.aktif .notes {\n      color: #252D43; }\n.todo-list-item.selected {\n    background: #E2474C; }\n.todo-list-item.selected .notes {\n      color: white; }\n.todo-list-item .info {\n    color: #2F3A57;\n    margin: 0 16px 0 8px; }\n.todo-list-item .info .title {\n      font-size: 15px;\n      font-weight: 500; }\n.todo-list-item .info .notes {\n      margin-top: 4px; }\n.todo-list-item .buttons .is-starred {\n    margin: 0 0 0 16px; }\n.todo-list-item .buttons .is-important {\n    margin: 0; }\n.todo-list-item .sil {\n    color: #E2474C !important; }\n"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-satir/ogrenim-hedef-satir.component.ts":
/*!*************************************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-satir/ogrenim-hedef-satir.component.ts ***!
  \*************************************************************************************************************************************/
/*! exports provided: OgrenimHedefSatirComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OgrenimHedefSatirComponent", function() { return OgrenimHedefSatirComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _models_birim_program_donem_ders__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../models/birim-program-donem-ders */ "./src/app/main/content/apps/sorular/models/birim-program-donem-ders.ts");
/* harmony import */ var _coktan_secmeli_soru_secenek_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../coktan-secmeli-soru-secenek.service */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru-secenek.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var OgrenimHedefSatirComponent = /** @class */ (function () {
    function OgrenimHedefSatirComponent(tekDogruluSecenekService, fb) {
        this.tekDogruluSecenekService = tekDogruluSecenekService;
        this.fb = fb;
    }
    OgrenimHedefSatirComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Set the initial values
        this.selected = this.isSelected(this.tekDogruluSecenekService.soruForm.get('soruHedefleri'));
        // Subscribe to update on selected todo change
        this.tekDogruluSecenekService.soruForm.get('soruHedefleri').valueChanges.subscribe(function (gelenHedefler) {
            _this.selected = _this.isSelected(_this.tekDogruluSecenekService.soruForm.get('soruHedefleri'));
        });
    };
    OgrenimHedefSatirComponent.prototype.isSelected = function (hedefArray) {
        if (hedefArray && hedefArray.length > 0) {
            for (var _i = 0, _a = hedefArray.controls; _i < _a.length; _i++) {
                var ctrl = _a[_i];
                if (ctrl.value === this.hedef.ogrenimHedefId) {
                    return true;
                }
            }
        }
        return false;
    };
    OgrenimHedefSatirComponent.prototype.onSelectedChange = function () {
        if (!this.hedef) {
            return -1;
        }
        var indeks = this.tekDogruluSecenekService.ogrenimHedefIndeksiniBul(this.hedef.ogrenimHedefId);
        if (indeks >= 0) {
            this.tekDogruluSecenekService.soruForm.get('soruHedefleri').removeAt(indeks);
        }
        else {
            this.tekDogruluSecenekService.soruForm.get('soruHedefleri').push(this.fb.control(this.hedef.ogrenimHedefId));
        }
        this.tekDogruluSecenekService.soruForm.markAsDirty();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _models_birim_program_donem_ders__WEBPACK_IMPORTED_MODULE_2__["OgrenimHedefItem"])
    ], OgrenimHedefSatirComponent.prototype, "hedef", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], OgrenimHedefSatirComponent.prototype, "indeks", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostBinding"])('class.selected'),
        __metadata("design:type", Boolean)
    ], OgrenimHedefSatirComponent.prototype, "selected", void 0);
    OgrenimHedefSatirComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-ogrenim-hedef-satir',
            template: __webpack_require__(/*! ./ogrenim-hedef-satir.component.html */ "./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-satir/ogrenim-hedef-satir.component.html"),
            styles: [__webpack_require__(/*! ./ogrenim-hedef-satir.component.scss */ "./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-satir/ogrenim-hedef-satir.component.scss")]
        }),
        __metadata("design:paramtypes", [_coktan_secmeli_soru_secenek_service__WEBPACK_IMPORTED_MODULE_3__["CoktanSecmeliSoruSecenekService"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]])
    ], OgrenimHedefSatirComponent);
    return OgrenimHedefSatirComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedefleri.component.html":
/*!**********************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedefleri.component.html ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"\" fusePerfectScrollbar>\n    <!-- TOP BACKGROUND -->\n    <!-- <div class=\"top-bg mat-accent-bg\"></div> -->\n    <!-- / TOP BACKGROUND -->\n    <!-- CENTER -->\n    <div class=\"center\">\n        <!-- CONTENT HEADER -->\n        <!-- <div class=\"header\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\n            <div class=\"search-wrapper mat-white-bg\" fxFlex fxLayout=\"row\" fxLayoutAlign=\"start center\">\n                <button mat-button class=\"mat-icon-button sidenav-toggle\" fuseMatSidenavToggler=\"carded-left-sidenav\" fxHide.gt-md aria-label=\"Toggle Sidenav\">\n                    <mat-icon>menu</mat-icon>\n                </button>\n                <div class=\"search\" flex fxLayout=\"row\" fxLayoutAlign=\"start center\">\n                    <mat-icon>search</mat-icon>\n                    <input [formControl]=\"searchInput\" placeholder=\"Aramak için kelime yazın\" fxFlex>\n                </div>\n            </div>\n        </div> -->\n        <!-- / CONTENT HEADER -->\n        <!-- CONTENT CARD -->\n        <div class=\"content-card\">\n            <!-- CONTENT TOOLBAR -->\n            <div class=\"toolbar\">\n                <div class=\"todo-selection\" fxFlex=\"row\" fxLayoutAlign=\"start center\">\n                    <mat-checkbox   #secim (click)=\"toggleselectAll(secim)\" [checked]=\"hasSelectedTodos\" [indeterminate]=\"isIndeterminate\"></mat-checkbox>\n                    <button mat-icon-button [matMenuTriggerFor]=\"selectMenu\">\n                        <mat-icon>arrow_drop_down</mat-icon>\n                    </button>\n\n                    <mat-menu #selectMenu=\"matMenu\">\n                        <button mat-menu-item (click)=\"selectAll()\">Tümü</button>\n                        <button mat-menu-item (click)=\"deselectAll()\">Hiçbiri</button>\n                    </mat-menu>\n                    <div *ngIf=\"soruHedefleri?.controls.length\">\n                        {{'Seçilebilir '+ogrenimHedefleri.length+' öğrenim hedefi var. '+soruHedefleri.controls.length+\n                        ' hedef seçildi.'}}\n                    </div>\n                </div>\n            </div>\n            <!-- / CONTENT TOOLBAR -->\n            <!-- CONTENT -->\n            <div class=\" ontent \" fxFlexAlign=\"row \">\n                <div *ngIf=\"!ogrenimHedefleri \">Seçilebilir öğrenim hedefi yok!</div>\n                <fuse-ogrenim-hedef-list *ngIf=\"ogrenimHedefleri \" fusePerfectScrollbar fxFlex></fuse-ogrenim-hedef-list>\n            </div>\n            <!-- / CONTENT -->\n        </div>\n        <!-- / CONTENT CARD -->\n    </div>\n    <!-- / CENTER -->\n</div>"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedefleri.component.scss":
/*!**********************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedefleri.component.scss ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n:host {\n  width: 100%; }\n:host .center .header .search-wrapper {\n    box-shadow: 0px 4px 5px -2px rgba(0, 0, 0, 0.2), 0px 7px 10px 1px rgba(0, 0, 0, 0.14), 0px 2px 16px 1px rgba(0, 0, 0, 0.12); }\n:host .center .header .search-wrapper .sidenav-toggle {\n      margin: 0;\n      width: 56px;\n      height: 56px;\n      border-radius: 0; }\n:host .center .header .search-wrapper .search {\n      width: 100%;\n      height: 56px;\n      line-height: 56px;\n      padding: 18px; }\n:host .center .header .search-wrapper .search input {\n        height: 56px;\n        padding-left: 16px;\n        color: rgba(0, 0, 0, 0.54);\n        border: none;\n        outline: none; }\n:host .center .content-card .content {\n    background-color: #E2E3DD;\n    border-radius: 2px;\n    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\n    transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n    margin: 12px;\n    padding: 8px; }\n:host .center .content-card .toolbar {\n    background-color: #A8D0DA;\n    color: #2F3A56;\n    border-radius: 2px;\n    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\n    transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n    padding: 24px;\n    margin: 12px; }\n@media (max-width: 1279px) and (max-width: 1279px) {\n  :host .center .content-card fuse-ogrenim-hedef-list {\n    border-right: 0; }\n  :host .center .content-card fuse-ogrenim-hedef-list {\n    flex: 1 0 100%; }\n  :host .center .content-card.aktif-secenek-var .toolbar {\n    padding-left: 16px !important; }\n    :host .center .content-card.aktif-secenek-var .toolbar .todo-selection {\n      display: none !important; }\n  :host .center .content-card.aktif-secenek-var .content fuse-ogrenim-hedef-list {\n    display: none !important; } }\n:host .center .ekle {\n    color: #406D95 !important; }\n:host .center .sil {\n    color: #AF373A !important; }\n"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedefleri.component.ts":
/*!********************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedefleri.component.ts ***!
  \********************************************************************************************/
/*! exports provided: OgrenimHedefleriComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OgrenimHedefleriComponent", function() { return OgrenimHedefleriComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _coktan_secmeli_soru_secenek_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../coktan-secmeli-soru-secenek.service */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru-secenek.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var OgrenimHedefleriComponent = /** @class */ (function () {
    function OgrenimHedefleriComponent(secenekService, cd, fb) {
        this.secenekService = secenekService;
        this.cd = cd;
        this.fb = fb;
    }
    Object.defineProperty(OgrenimHedefleriComponent.prototype, "soruHedefleri", {
        get: function () {
            return this.secenekService.soruForm.get('soruHedefleri');
        },
        enumerable: true,
        configurable: true
    });
    OgrenimHedefleriComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.onSecilebilirOgrenimHedefleriDegisti = this.secenekService
            .secilebilirOgrenimHedefleriDegisti.subscribe(function (hedefler) {
            _this.ogrenimHedefleri = hedefler;
        });
        this.onSelectedOgrenimHedefleriChanged =
            this.soruHedefleri.valueChanges
                .subscribe(function (gelenSoruHedefleri) {
                setTimeout(function () {
                    if (gelenSoruHedefleri) {
                        _this.hasSelectedTodos = gelenSoruHedefleri.length > 0;
                        _this.isIndeterminate = (gelenSoruHedefleri.length !== _this.secenekService.secilebilirOgrenimHedefleri.length && gelenSoruHedefleri.length > 0);
                    }
                    else {
                        _this.hasSelectedTodos = false;
                        _this.isIndeterminate = false;
                    }
                }, 0);
            });
    };
    OgrenimHedefleriComponent.prototype.ngOnDestroy = function () {
        this.onSelectedOgrenimHedefleriChanged.unsubscribe();
        this.cd.detach();
    };
    OgrenimHedefleriComponent.prototype.toggleselectAll = function (secim) {
        if (secim.checked) {
            this.deselectAll();
        }
        else {
            this.selectAll();
        }
    };
    OgrenimHedefleriComponent.prototype.selectAll = function () {
        var _this = this;
        var degisensayi = 0;
        this.ogrenimHedefleri.forEach(function (hedef) {
            var zatenSecili = _this.secenekService.ogrenimHedefIndeksiniBul(hedef.ogrenimHedefId) >= 0;
            if (!zatenSecili) {
                _this.secenekService.soruForm.get('soruHedefleri').push(_this.fb.control(hedef.ogrenimHedefId));
                degisensayi++;
            }
        });
        if (degisensayi > 0) {
            this.secenekService.soruForm.markAsDirty();
        }
    };
    OgrenimHedefleriComponent.prototype.deselectAll = function () {
        while (this.secenekService.soruForm.get('soruHedefleri').length !== 0) {
            this.secenekService.soruForm.get('soruHedefleri').removeAt(0);
        }
    };
    OgrenimHedefleriComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-ogrenim-hedefleri',
            template: __webpack_require__(/*! ./ogrenim-hedefleri.component.html */ "./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedefleri.component.html"),
            styles: [__webpack_require__(/*! ./ogrenim-hedefleri.component.scss */ "./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedefleri.component.scss")]
        }),
        __metadata("design:paramtypes", [_coktan_secmeli_soru_secenek_service__WEBPACK_IMPORTED_MODULE_2__["CoktanSecmeliSoruSecenekService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]])
    ], OgrenimHedefleriComponent);
    return OgrenimHedefleriComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/sb-html-editor/sb-html-editor.component.html":
/*!****************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/sb-html-editor/sb-html-editor.component.html ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<fuse-widget class=\"p-12\" class=\"widget\" fxLayout=\"column\">\n  <!-- Front -->\n  <div class=\"fuse-widget-front mat-elevation-z2\">\n    <div fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\n      <div class=\"h3\">SORU KÖKÜ</div>\n      <button mat-icon-button fuseWidgetToggle class=\"fuse-widget-flip-button\" aria-label=\"more\">\n        <mat-icon>info</mat-icon>\n      </button>\n    </div>\n    <div fxFlex=\"auto\" class=\"metin\">\n      <form fxFlex=\"auto\" *ngIf=\"parentForm\" [formGroup]=\"parentForm\">\n        <div *ngIf=\"!parentFormGroupName\">\n          <div *ngIf=\"parentFormControlName\" style=\"background-color: white;padding:8px\">\n            <textarea matInput #metinAlani  formControlName=\"{{parentFormControlName}}\" matTextareaAutosize matAutosizeMinRows=\"2\"\n            matAutosizeMaxRows=\"10\" ></textarea>\n            <!-- <textarea matInput #metinAlani [froalaEditor] formControlName=\"{{parentFormControlName}}\"></textarea> -->\n            <!-- <ckeditor [(ngModel)]=\"content\" formControlName=\"area\" #myckeditor [config]=\"ckeConfig\" debounce=\"500\"></ckeditor>   -->\n            <!-- <ckeditor  formControlName=\"{{parentFormControlName}}\" #editorum\n            [config]=\"ckeConfig\" debounce=\"500\"></ckeditor>   -->\n            <!-- <ckeditor  [config]=\"{uiColor: '#cccccc'}\" debounce=\"500\">\n            </ckeditor> -->\n          </div>\n        </div>\n      </form>\n    </div>\n  </div>\n  <!-- / Front -->\n\n  <!-- Back -->\n  <div class=\"fuse-widget-back p-16 pt-32 mat-white-bg mat-elevation-z2\">\n    <button mat-icon-button fuseWidgetToggle class=\"fuse-widget-flip-button\" aria-label=\"Flip widget\">\n      <mat-icon class=\"s-16\">close</mat-icon>\n    </button>\n\n    <div>\n      Kabul edilebilirlik indeksi şudur budur.\n    </div>\n  </div>\n  <!-- / Back -->\n\n</fuse-widget>"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/sb-html-editor/sb-html-editor.component.scss":
/*!****************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/sb-html-editor/sb-html-editor.component.scss ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n:host() .fuse-widget-front {\n  padding: 12px;\n  background-color: #A8D0DA !important;\n  color: #315474; }\n:host() .metin {\n  width: 100%; }\n:host() .metin /deep/ .mat-input-underline {\n    color: #315474; }\n:host() .metin .mat-form-field {\n    width: 100%; }\n:host() .metin .mat-form-field textarea {\n      font-size: 32px;\n      width: 100%;\n      min-height: 50px; }\n:host() .metin .mat-hint {\n    color: #A8B4B4; }\n:host() .metin .mat-input-placeholder {\n    font-size: 24px; }\n@media (max-width: 1919px) {\n      :host() .metin .mat-input-placeholder {\n        font-size: 18px; } }\n@media (max-width: 1279px) {\n      :host() .metin .mat-input-placeholder {\n        font-size: 14px; } }\n"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/sb-html-editor/sb-html-editor.component.ts":
/*!**************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/sb-html-editor/sb-html-editor.component.ts ***!
  \**************************************************************************************/
/*! exports provided: SbHtmlEditorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SbHtmlEditorComponent", function() { return SbHtmlEditorComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_2__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SbHtmlEditorComponent = /** @class */ (function () {
    function SbHtmlEditorComponent() {
        this.gerekli = false;
        this.minSatir = 2;
        this.maksSatir = 10;
        this.tamam = new events__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
    }
    SbHtmlEditorComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroup"])
    ], SbHtmlEditorComponent.prototype, "parentForm", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], SbHtmlEditorComponent.prototype, "parentFormGroupName", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], SbHtmlEditorComponent.prototype, "parentFormControlName", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], SbHtmlEditorComponent.prototype, "metinPlaceholder", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], SbHtmlEditorComponent.prototype, "gerekli", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], SbHtmlEditorComponent.prototype, "minSatir", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], SbHtmlEditorComponent.prototype, "maksSatir", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], SbHtmlEditorComponent.prototype, "tamam", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('metinAlani'),
        __metadata("design:type", Object)
    ], SbHtmlEditorComponent.prototype, "metinAlani", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('editorum'),
        __metadata("design:type", Object)
    ], SbHtmlEditorComponent.prototype, "ckeditor", void 0);
    SbHtmlEditorComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-sb-html-editor',
            template: __webpack_require__(/*! ./sb-html-editor.component.html */ "./src/app/main/content/apps/sorular/sb-html-editor/sb-html-editor.component.html"),
            styles: [__webpack_require__(/*! ./sb-html-editor.component.scss */ "./src/app/main/content/apps/sorular/sb-html-editor/sb-html-editor.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], SbHtmlEditorComponent);
    return SbHtmlEditorComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-detay/soru-detay.component.html":
/*!********************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-detay/soru-detay.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"!soru\" fxLayout=\"column\" fxLayoutAlign=\"center center\" fxFlex=\"1 2 auto\">\n    <mat-icon class=\"s-128 mb-16\">\n        question_answer\n    </mat-icon>\n    <span class=\"soru-sec-yazisi hint-text\">\n        <span>Bir soru seçin.</span>\n    </span>\n</div>\n\n<div *ngIf=\"soru\" style=\"color:#252D43\">\n    <div class=\"mail-header\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\n        <div>\n            <div class=\"subject\" flex>{{dersKonuAdi}}</div>\n\n            <div class=\"labels\" fxLayout=\"row\" fxLayoutWrap>\n                <div class=\"label\" *ngFor=\"let kelime of soru.anahtarKelimeler\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\n                    <div class=\"label-color\"></div>\n                    <div class=\"label-title\">{{kelime}}</div>\n                </div>\n            </div>\n        </div>\n        <!-- <div class=\"actions\" fxHide fxShow.gt-lg fxLayout=\"row\" fxLayoutAlign=\"start center\">\n            <button fxHide fxShow.gt-md mat-icon-button (click)=\"$event.stopPropagation();\" aria-label=\"Toggle star\">\n                <mat-icon *ngIf=\"!bitisTarihiGecerli\" matTooltip=\"Aksi belirtilene kadar soru geçerli.\">all_inclusive</mat-icon>\n            </button>\n            <button mat-button class=\"mat-icon-button\" aria-label=\"Soru aktif\" (click)=\"soruyuAcKapat()\">\n                <mat-icon *ngIf=\"soru.aktif\" matTooltip=\"Bu soru aktif. Aktif sorular onay yapıldıktan sonra sınavlarda çıkabilir.\">fast_forward</mat-icon>\n                <mat-icon *ngIf=\"!soru.aktif\" matTooltip=\"Bu soru aktif değil. Pasif sorular sınavlarda çıkmaz.\">stop</mat-icon>\n            </button>\n\n            <button mat-button class=\"mat-icon-button\" aria-label=\"Staj dersi\" (click)=\"favoriToogle()\">\n                <mat-icon *ngIf=\"soru.favori\" matTooltip=\"Bu soru sizin favori sorunuz.\">star</mat-icon>\n                <mat-icon *ngIf=\"!soru.favori\" matTooltip=\"Bu soru sizin için favori olmayan bir sorudur.\">star_outline</mat-icon>\n            </button>\n\n\n            <button mat-button class=\"mat-icon-button\" aria-label=\"Ders kurulu dersi\">\n                <mat-icon *ngIf=\"soru.onaylandi\" matTooltip=\"Bu soru onaylanmış. Sınavlarda çıkabilir.\">thumb_up</mat-icon>\n                <mat-icon *ngIf=\"!soru.onaylandi\" matTooltip=\"Bu soru onaysız. Sınavlarda ÇIKMAZ!.\">thumb_down</mat-icon>\n            </button>\n        </div> -->\n    </div>\n\n    <!-- <div class=\"actions alt-cizgi\" fxShow fxHide.gt-lg fxLayout=\"row\" fxLayoutAlign=\"start center\">\n\n\n        <button mat-button class=\"mat-icon-button\" aria-label=\"Soru aktif\">\n            <mat-icon *ngIf=\"soru.aktif\" matTooltip=\"Bu soru aktif. Aktif sorular onay yapıldıktan sonra sınavlarda çıkabilir.\">fast_forward</mat-icon>\n            <mat-icon *ngIf=\"!soru.aktif\" matTooltip=\"Bu soru aktif değil. Pasif sorular sınavlarda çıkmaz.\">stop</mat-icon>\n        </button>\n        <button *ngIf=\"!bitisTarihiGecerli\" mat-icon-button (click)=\"$event.stopPropagation();\" aria-label=\"Toggle star\">\n            <mat-icon matTooltip=\"Aksi belirtilene kadar soru geçerli.\">all_inclusive</mat-icon>\n        </button>\n        <button mat-button class=\"mat-icon-button\" aria-label=\"Staj dersi\">\n            <mat-icon *ngIf=\"soru.favori\" matTooltip=\"Bu soru sizin favori sorunuz.\">star</mat-icon>\n            <mat-icon *ngIf=\"!soru.favori\" matTooltip=\"Bu soru sizin için favori olmayan bir sorudur.\">star_outline</mat-icon>\n        </button>\n\n\n        <button mat-button class=\"mat-icon-button\" aria-label=\"Ders kurulu dersi\">\n            <mat-icon *ngIf=\"soru.onaylandi\" matTooltip=\"Bu soru onaylanmış. Sınavlarda çıkabilir.\">thumb_up</mat-icon>\n            <mat-icon *ngIf=\"!soru.onaylandi\" matTooltip=\"Bu soru onaysız. Sınavlarda ÇIKMAZ!.\">thumb_down</mat-icon>\n        </button>\n    </div> -->\n\n\n    <div class=\"mail-content\" fxLayout=\"column\" fxLayoutAlign=\"start stretch\" fxLayoutgap=\"16px\">\n\n        <div class=\"info\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\n\n            <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n                <!-- <span fxFlex=\"auto\" class=\"name\">{{soru?.soruMetni| slice:0:100}}{{soru?.soruMetni.length > 100 ? '...' : ''}}</span> -->\n                <button  *ngIf=\"!bitisTarihiGecerli\" mat-icon-button class=\"mat-icon-button\" (click)=\"$event.stopPropagation();\" aria-label=\"Toggle star\">\n                    <mat-icon  matTooltip=\"Aksi belirtilene kadar soru geçerli.\">all_inclusive</mat-icon>\n                </button>\n                <button mat-button class=\"mat-icon-button\" aria-label=\"Soru aktif\" (click)=\"soruyuAcKapat()\">\n                    <mat-icon *ngIf=\"soru.aktif\" matTooltip=\"Bu soru aktif. Aktif sorular onay yapıldıktan sonra sınavlarda çıkabilir.\">fast_forward</mat-icon>\n                    <mat-icon *ngIf=\"!soru.aktif\" matTooltip=\"Bu soru aktif değil. Pasif sorular sınavlarda çıkmaz.\">stop</mat-icon>\n                </button>\n\n                <button mat-button class=\"mat-icon-button\" aria-label=\"Staj dersi\" (click)=\"favoriToogle()\">\n                    <mat-icon *ngIf=\"soru.favori\" matTooltip=\"Bu soru sizin favori sorunuz.\">star</mat-icon>\n                    <mat-icon *ngIf=\"!soru.favori\" matTooltip=\"Bu soru sizin için favori olmayan bir sorudur.\">star_outline</mat-icon>\n                </button>\n\n\n                <button mat-icon-button class=\"mat-icon-button\" aria-label=\"Ders kurulu dersi\">\n                    <mat-icon *ngIf=\"soru.onaylandi\" matTooltip=\"Bu soru onaylanmış. Sınavlarda çıkabilir.\">thumb_up</mat-icon>\n                    <mat-icon *ngIf=\"!soru.onaylandi\" matTooltip=\"Bu soru onaysız. Sınavlarda ÇIKMAZ!.\">thumb_down</mat-icon>\n                </button>\n            </div>\n            <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n\n                <button mat-button class=\"mat-icon-button\" (click)=\"soruyuDegistir()\" matTooltip=\"Düzenleme ekranını aç\">\n                    <mat-icon>edit</mat-icon>\n                </button>\n\n                <button mat-button [matMenuTriggerFor]=\"moreMenu\" aria-label=\"More\" class=\"mat-icon-button\" (click)=\"$event.stopPropagation()\">\n                    <mat-icon>more_vert</mat-icon>\n                </button>\n\n                <mat-menu #moreMenu=\"matMenu\">\n\n                    <button *ngIf=\"soru.aktif\" mat-menu-item aria-label=\"Kapat\" (click)=\"soruyuKapat()\">\n                        <mat-icon>stop</mat-icon>\n                        <span matTooltip=\"Soruyu inaktif yaparsanız sonraki sınavlarda çıkmasını önlersiniz.\">İnaktif yap</span>\n                    </button>\n\n                    <button *ngIf=\"!soru.aktif\" mat-menu-item aria-label=\"Aç\" (click)=\"soruyuAc()\">\n                        <mat-icon>fast_forward</mat-icon>\n                        <span matTooltip=\"Aktif yaptığınız sorular sınavlarda onaylandıktan sonra çıkabilir.\">Aktif yap</span>\n                    </button>\n                    <button mat-menu-item aria-label=\"Reply\" (click)=\"soruyuDegistir()\" matTooltip=\"Düzenleme ekranını aç\">\n                        <mat-icon>edit</mat-icon>\n                        <span>Düzelt</span>\n                    </button>\n                    <button mat-menu-item aria-label=\"Print\" (click)=\"soruOnIzlemeGoster()\" fxHide.lt-lg>\n                        <mat-icon>print</mat-icon>\n                        <span>Yazdır</span>\n                    </button>\n                    <mat-divider></mat-divider>\n                    <button *ngIf=\"!soru.favori\" mat-menu-item aria-label=\"Favori yap\" (click)=\"soruyuFavoriYap()\">\n                        <mat-icon matTooltip=\"Favori olarak işaretlerseniz sınavlarda çıkma olasılığı artar\">star</mat-icon>\n                        <span>Favori sorum olsun</span>\n                    </button>\n\n                    <button *ngIf=\"soru.favori\" mat-menu-item aria-label=\"Sıradan yap\" (click)=\"soruyuSiradanYap()\">\n                        <mat-icon matTooltip=\" Soruyu sıradan yaparsanız, sınavlarda çıkma şansı az olur. \">star_outline</mat-icon>\n                        <span>Favori sorum olmasın</span>\n                    </button>\n\n                    <mat-divider></mat-divider>\n                    <button mat-menu-item aria-label=\"Forward \" [disabled]=\"soru.silinemez \" (click)=\"soruyuSilindiYap()\">\n                        <mat-icon>delete</mat-icon>\n                        <span *ngIf=\"!soru.silinemez \" matTooltip=\"Soruyu sildikten sonra geri alamazsınız! \">Sil</span>\n                        <span *ngIf=\"soru.silinemez \" matTooltip=\"Bu soru silinemez olarak işaretlenmiş. \">Sil</span>\n                    </button>\n                </mat-menu>\n            </div>\n        </div>\n\n        <button class=\"toggle-details\" mat-button (click)=\"detayToogle()\">\n            <span *ngIf=\"!detayGoster\">Ayrıntı</span>\n            <span *ngIf=\"detayGoster\">Ayrıntıyı gizle</span>\n        </button>\n\n        <div class=\"kart detay\" *ngIf=\"detayGoster\">\n            <div class=\"details\" fxLayout=\"row\" fxLayoutAlign=\"start start\">\n                <div fxLayout=\"column\">\n                    <span class=\"title\">Birim</span>\n                    <span class=\"title\">Program</span>\n                    <span class=\"title\">Donem</span>\n                    <span *ngIf=\"Ders.dersGrubuNo>0\" class=\"title\">Ders grubu</span>\n                    <span class=\"title\">Ders</span>\n                    <span *ngIf=\"soru.konuNo\" class=\"title\">Konu</span>\n                    <span class=\"title\">Zorluk derecesi</span>\n                    <span class=\"title\">Cevaplama süresi</span>\n                    <span class=\"title\">Hemen elenebilir seçenek sayısı</span>\n                    <span class=\"title\">Kabul edilebilirlik indeksi</span>\n\n                    <span class=\"title\">Soru tipi</span>\n                    <span class=\"title\">Bilissel düzeyi</span>\n                    <span class=\"title\">Başlangıç</span>\n                    <span class=\"title\">Bitiş</span>\n                </div>\n                <div fxLayout=\"column\">\n                    <span class=\"detail\">{{Ders.birimAdi}}</span>\n                    <span class=\"detail\">{{Ders.programAdi}}</span>\n                    <span class=\"detail\">{{Ders.donemAdi}}</span>\n                    <span *ngIf=\"Ders.dersGrubuNo>0\" class=\"detail\">{{Ders.dersGrubuAdi}}</span>\n                    <span class=\"detail\">{{Ders.dersAdi}}</span>\n                    <span *ngIf=\"soru.konuNo\" class=\"detail\">{{getKonu(soru.konuNo).konuAdi}}</span>\n                    <span class=\"detail\">{{soru.soruZorlukAdi}}</span>\n                    <span class=\"detail\">{{soru.cevaplamaSuresi+' saniye.'}}</span>\n                    <span *ngIf=\"soru.hemenElenebilirSecenekSayisi===0\" class=\"detail\">Yok</span>\n                    <span *ngIf=\"soru.hemenElenebilirSecenekSayisi>0\" class=\"detail\">{{soru.hemenElenebilirSecenekSayisi}}</span>\n                    <span class=\"detail\">{{soru.kabulEdilebilirlikIndeksi}}</span>\n                    <span class=\"detail\">{{soru.soruTipAdi}}</span>\n                    <span class=\"detail\">{{soru.bilisselDuzeyAdi}}</span>\n                    <span class=\"detail\">{{soru.baslangic| date: 'MMMM, yyyy'}}</span>\n                    <span *ngIf=\"soru.bitis\" class=\"detail\">{{ soru.bitis| date: 'MMMM, yyyy'}}</span>\n                    <span *ngIf=\"!soru.bitis\" class=\"detail\">Belirtilmemiş</span>\n                </div>\n\n            </div>\n        </div>\n        <div class=\"kart\" style=\"background-color: #DB4549;color:#E2E3DD;\" *ngIf=\"soru.soruKokuMetni\">\n            <div fxLayout=\"row\" fxLayoutAlign=\"start center\" fxLayoutGap=\"16px\">\n                <mat-icon class=\"mat-18\">attachment</mat-icon>\n                <h2>Soru Kökü</h2>\n            </div>\n            <mat-divider></mat-divider>\n            <div [innerHTML]=\"soru.soruKokuMetni\" style=\"padding:24px;text-align: justify; \"></div>\n        </div>\n\n        <div class=\"kart\">\n            <div fxLayout=\"row\" fxLayoutAlign=\"start center\" fxLayoutGap=\"16px\">\n                <mat-icon class=\"mat-18\">library_books</mat-icon>\n                <h2>Soru metni ve seçenekler</h2>\n            </div>\n            <mat-divider></mat-divider>\n            <div class=\"soru-metni kart\">{{soru.soruMetni}}</div>\n            <ol class=\"rectangle-list soru-secenekler kart \">\n                <li *ngFor=\"let secenek of soru.tekDogruluSecenekleri \">\n                    <a [ngStyle]=\"{ 'border-right': secenek.dogruSecenek===true? '5px solid #5BA36F': '5px solid #E2474C'} \">\n                        <div [innerHTML]=\"secenek.secenekMetni\"></div>\n                    </a>\n                </li>\n            </ol>\n        </div>\n\n\n        <div *ngIf=\"soru.soruHedefleri.length>0\" id=\"soru-hedefleri\" class=\"kart\">\n\n            <div fxLayout=\"row\" fxLayoutAlign=\"start center\" fxLayoutGap=\"16px\">\n                <mat-icon class=\"mat-18\">my_location</mat-icon>\n                <h2>Sorunun ilişkilendirildiği öğrenim hedefleri</h2>\n            </div>\n            <mat-divider></mat-divider>\n            <div *ngIf=\"soru.soruHedefleri.length===0\">\n                <h2>Soru ile ilişkilendirilmiş öğrenim hedefi yok!</h2>\n            </div>\n            <ol>\n                <li *ngFor=\"let item of soru.soruHedefleri let i=index \">\n                    <p>\n                        <em>{{item.ogrenimHedefAdi}}</em>\n                    </p>\n                </li>\n            </ol>\n        </div>\n\n        <div fxLayout=\"column\" fxLayoutAlign=\"start stretch\">\n            <div class=\"kart\">\n                <div fxLayout=\"row\" fxLayoutAlign=\"start center\" fxLayoutGap=\"16px\">\n                    <mat-icon class=\"mat-18\">assignment</mat-icon>\n                    <h2>Kaynakça</h2>\n                </div>\n                <mat-divider></mat-divider>\n                <div class=\"name\">\n                    {{soru.kaynakca|htmlToPlaintext}}\n                </div>\n                <div *ngIf=\"!soru.kaynakca\" class=\"name\">\n                    Kaynakça girilmemiş!\n                </div>\n            </div>\n            <div class=\"kart\">\n\n                <div fxLayout=\"row\" fxLayoutAlign=\"start center\" fxLayoutGap=\"16px\">\n                    <mat-icon class=\"mat-18\">lightbulb_outline</mat-icon>\n                    <h2>Cevap açıklaması</h2>\n                </div>\n                <mat-divider></mat-divider>\n                <div class=\"to\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\n                    <div>{{soru.aciklama|htmlToPlaintext}}</div>\n                    <div *ngIf=\"!soru.aciklama\" class=\"name\">\n                        Cevap açıklaması girilmemiş!\n                    </div>\n                </div>\n            </div>\n        </div>\n\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-detay/soru-detay.component.scss":
/*!********************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-detay/soru-detay.component.scss ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n:host {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  overflow-y: auto;\n  padding: 24px;\n  background-color: #D8E8E9; }\n:host .select-message-text {\n    font-size: 24px;\n    font-weight: 300; }\n:host .mail-header {\n    padding-bottom: 16px;\n    border-bottom: 1px solid rgba(0, 0, 0, 0.12); }\n:host .mail-header .actions {\n      min-width: 88px; }\n:host .mail-header .subject {\n      font-size: 17px;\n      font-weight: 500; }\n:host .mail-header .label {\n      font-size: 11px;\n      border-radius: 2px;\n      margin: 4px 4px 4px 0;\n      padding: 3px 8px;\n      background-color: rgba(0, 0, 0, 0.08); }\n:host .mail-header .label .label-color {\n        width: 8px;\n        height: 8px;\n        margin-right: 8px;\n        border-radius: 50%;\n        background-color: #DB4549; }\n:host .mail-content {\n    padding: 24px 0; }\n:host .mail-content .info {\n      background-color: #E2E3DD;\n      padding: 12px;\n      box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\n      transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1); }\n:host .mail-content .info .avatar {\n        margin-right: 16px;\n        background-color: #039be5; }\n:host .mail-content .info .name {\n        margin-right: 8px;\n        font-weight: 500;\n        font-size: 1.1em; }\n:host .toggle-details {\n    color: #406D95;\n    text-align: left;\n    margin-top: 12px; }\n:host .toggle-details:hover {\n    color: #DB4549;\n    -webkit-text-decoration: #406D95;\n            text-decoration: #406D95;\n    -webkit-text-decoration-style: dashed;\n            text-decoration-style: dashed;\n    -webkit-text-decoration-line: underline;\n            text-decoration-line: underline; }\n:host ol {\n    counter-reset: li;\n    /* Initiate a counter */\n    list-style: none;\n    /* Remove default numbering */\n    *list-style: upper-alpha;\n    /* Keep using default numbering for IE6/7 */\n    font: 15px 'trebuchet MS', 'lucida sans';\n    padding: 0;\n    margin-bottom: 4em;\n    text-shadow: 0 1px 0 rgba(5, 5, 5, 0.1); }\n:host .rectangle-list a {\n    position: relative;\n    display: block;\n    padding: .4em .4em .4em .8em;\n    *padding: .4em;\n    margin: .5em 0 .5em 2.5em;\n    background: #A8D0DA;\n    color: #2F3A57;\n    text-decoration: none;\n    transition: all .3s ease-out; }\n:host .rectangle-list a:hover {\n    background: #406D95;\n    color: #A8D0DA; }\n:host .rectangle-list a:before {\n    content: counter(li, upper-alpha);\n    counter-increment: li;\n    position: absolute;\n    left: -2.5em;\n    top: 50%;\n    color: white;\n    margin-top: -1em;\n    background: #2F3A57;\n    height: 2em;\n    width: 2em;\n    line-height: 2em;\n    text-align: center;\n    font-weight: bold; }\n:host .rectangle-list a:after {\n    position: absolute;\n    content: '';\n    border: .5em solid transparent;\n    left: -1em;\n    top: 50%;\n    margin-top: -.5em;\n    transition: all .3s ease-out; }\n:host .rectangle-list a:hover:after {\n    left: -.5em;\n    border-left-color: #2F3A57; }\n:host .kart {\n    border-radius: 2px;\n    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\n    transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n    padding: 24px;\n    background-color: #E2E3DD;\n    margin-top: 12px; }\n:host .detay {\n    background-color: #E2E3DD;\n    padding-top: 8px; }\n:host .detay .title {\n      color: #406D95;\n      margin-right: 8px; }\n:host .detay .detail {\n      padding-left: 2px;\n      color: #2F3A57;\n      font-weight: 500; }\n:host .actions.alt-cizgi {\n    border-bottom: 1px solid rgba(0, 0, 0, 0.12); }\n:host .soru-metni {\n    background-color: #406D95;\n    color: white;\n    font-size: 1.2em; }\n:host .soru-secenekler {\n    background-color: #A8D0DA;\n    color: #E2474C;\n    font-size: .9em; }\n:host #soru-hedefleri {\n    padding: 8px;\n    padding-left: 24px; }\n:host #soru-hedefleri h3 {\n      margin: 0;\n      color: #406D95;\n      font-weight: 700;\n      font-size: 20px; }\n:host #soru-hedefleri ol {\n      font-style: italic;\n      font-family: Georgia, Times, serif;\n      font-size: 16px;\n      color: #406D95; }\n:host #soru-hedefleri ol li {\n      color: white; }\n:host #soru-hedefleri ol li p {\n      padding: 8px;\n      font-style: normal;\n      font-family: Arial;\n      font-size: 13px;\n      color: #406D95;\n      border-left: 2px solid #E2474C; }\n:host #soru-hedefleri ol li p em {\n      display: block; }\n"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-detay/soru-detay.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-detay/soru-detay.component.ts ***!
  \******************************************************************************/
/*! exports provided: SoruDetayComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruDetayComponent", function() { return SoruDetayComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _models_soru__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/soru */ "./src/app/main/content/apps/sorular/models/soru.ts");
/* harmony import */ var _sorular_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../sorular.service */ "./src/app/main/content/apps/sorular/sorular.service.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_cdk_platform__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/cdk/platform */ "./node_modules/@angular/cdk/esm5/platform.es5.js");
/* harmony import */ var _store_actions_ui_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../store/actions/ui.actions */ "./src/app/store/actions/ui.actions.ts");
/* harmony import */ var _soru_store_index__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../soru-store/index */ "./src/app/main/content/apps/sorular/soru-store/index.ts");
/* harmony import */ var _core_services_sb_mesaj_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../core/services/sb-mesaj.service */ "./src/app/core/services/sb-mesaj.service.ts");
/* harmony import */ var _coktan_secmeli_soru_coktan_secmeli_soru_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../coktan-secmeli-soru/coktan-secmeli-soru.component */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/coktan-secmeli-soru.component.ts");
/* harmony import */ var _fuse_components_confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @fuse/components/confirm-dialog/confirm-dialog.component */ "./src/@fuse/components/confirm-dialog/confirm-dialog.component.ts");
/* harmony import */ var _soru_onizleme_soru_onizleme_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../soru-onizleme/soru-onizleme.component */ "./src/app/main/content/apps/sorular/soru-onizleme/soru-onizleme.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












var SoruDetayComponent = /** @class */ (function () {
    function SoruDetayComponent(dialog, sorularService, store, mesajService, platform) {
        this.dialog = dialog;
        this.sorularService = sorularService;
        this.store = store;
        this.mesajService = mesajService;
        this.platform = platform;
        this.detayGoster = false;
        // this.labels$ = this.store.select(fromStore.getLabelsArr);
    }
    Object.defineProperty(SoruDetayComponent.prototype, "Ders", {
        get: function () {
            if (this.soru && !this.ders) {
                this.ders = this.sorularService.dersBul(this.soru.dersNo);
                this._dersKonuAdi = undefined;
            }
            return this.ders;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoruDetayComponent.prototype, "dersKonuAdi", {
        get: function () {
            if (!this._dersKonuAdi) {
                this._dersKonuAdi = this.dersKonuAdiniAl();
            }
            return this._dersKonuAdi;
        },
        enumerable: true,
        configurable: true
    });
    SoruDetayComponent.prototype.ngOnInit = function () {
    };
    SoruDetayComponent.prototype.ngOnChanges = function (changes) {
        if (this.soru) {
            if (this.soru.baslangic) {
                if (this.soru.bitis) {
                    this.bitisTarihiGecerli = this.soru.baslangic < this.soru.bitis;
                }
                else {
                    this.bitisTarihiGecerli = false;
                }
            }
        }
    };
    SoruDetayComponent.prototype.detayToogle = function () {
        this.detayGoster = !this.detayGoster;
    };
    SoruDetayComponent.prototype.dersKonuAdiniAl = function () {
        var sonuc = null;
        if (this.Ders) {
            var konu = null;
            if (this.soru.konuNo) {
                konu = this.getKonu(this.soru.konuNo);
            }
            if (konu) {
                sonuc = this.ders.dersAdi + " : " + konu.konuAdi;
            }
            else {
                return this.ders.dersAdi;
            }
        }
        return sonuc;
    };
    SoruDetayComponent.prototype.getKonu = function (konuNo) {
        if (this.Ders && konuNo > 0) {
            for (var index = 0; index < this.ders.konulari.length; index++) {
                var konu = this.ders.konulari[index];
                // tslint:disable-next-line:triple-equals
                if (konu.konuId == konuNo) {
                    return konu;
                }
            }
        }
        return null;
    };
    SoruDetayComponent.prototype.soruyuDegistir = function () {
        var _this = this;
        this.store.dispatch(new _store_actions_ui_actions__WEBPACK_IMPORTED_MODULE_6__["StartLoading"]());
        var degisecekSoru = this.sorularService.getSoruById(this.soru.soruId).subscribe(function (sonuc) {
            _this.store.dispatch(new _store_actions_ui_actions__WEBPACK_IMPORTED_MODULE_6__["StopLoading"]());
            if (!sonuc.basarili) {
                _this.mesajService.hatalar(sonuc.hatalar);
                return;
            }
            var en = '70vw';
            var boy = '90vh';
            var sinif = 'popup-masaustu';
            if (_this.platform.ANDROID || _this.platform.IOS) {
                en = '99vw';
                boy = '95vh';
                sinif = 'popup-mobil';
            }
            _this.dialogRef = _this.dialog.open(_coktan_secmeli_soru_coktan_secmeli_soru_component__WEBPACK_IMPORTED_MODULE_9__["CoktanSecmeliSoruComponent"], {
                data: { dersNo: _this.soru.dersNo, konuNo: _this.soru.konuNo, ders: _this.ders, degisecekSoru: sonuc.donenNesne },
                height: boy,
                width: en,
                panelClass: sinif
            });
            _this.dialogRef.afterClosed()
                .subscribe(function (response) {
                if (!response) {
                    return;
                }
                var actionType = response[0];
                var formData = response[1];
                if (formData.pristine) {
                    console.log('Kaydetmeye gerek yok!');
                    return;
                }
                var kaydedilecekSoru = response[2];
                switch (actionType) {
                    /**
                     * Kaydete tıklandı
                     */
                    case 'kaydet':
                        _this.soruDegisiklikKaydet(formData, kaydedilecekSoru);
                        break;
                    /**
                     * Kapata tıklandı
                     */
                    case 'kapat':
                        break;
                }
            });
        }, function (hata) {
            _this.store.dispatch(new _store_actions_ui_actions__WEBPACK_IMPORTED_MODULE_6__["StopLoading"]());
            _this.mesajService.hataStr('Soru bilgisi alınamadı!');
        });
    };
    SoruDetayComponent.prototype.soruDegisiklikKaydet = function (formData, degisecekSoru) {
        var kaydedilecekSoru = Object.assign({}, degisecekSoru, formData.getRawValue());
        kaydedilecekSoru.tekDogruluSecenekleri = formData.get('secenekler').value;
        this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_7__["UpdateSoru"](kaydedilecekSoru));
    };
    SoruDetayComponent.prototype.soruyuAcKapat = function () {
        if (this.soru.aktif === true) {
            this.soruyuKapat();
        }
        else {
            this.soruyuAc();
        }
    };
    SoruDetayComponent.prototype.soruyuKapat = function () {
        this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_7__["SoruAcKapa"]({ soruNo: this.soru.soruId, ac: false }));
    };
    SoruDetayComponent.prototype.soruyuAc = function () {
        this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_7__["SoruAcKapa"]({ soruNo: this.soru.soruId, ac: true }));
    };
    SoruDetayComponent.prototype.favoriToogle = function () {
        if (this.soru.favori) {
            this.soruyuSiradanYap();
        }
        else {
            this.soruyuFavoriYap();
        }
    };
    SoruDetayComponent.prototype.soruyuFavoriYap = function () {
        this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_7__["SoruFavoriDegistir"]({ soruNo: this.soru.soruId, favori: true }));
    };
    SoruDetayComponent.prototype.soruyuSiradanYap = function () {
        this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_7__["SoruFavoriDegistir"]({ soruNo: this.soru.soruId, favori: false }));
    };
    SoruDetayComponent.prototype.soruyuSilindiYap = function () {
        var _this = this;
        var dialogRef = this.dialog.open(_fuse_components_confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_10__["FuseConfirmDialogComponent"], {
            width: '600px',
            height: '400px',
            data: {
                onaybasligi: 'Silme onayı',
                onaymesaji: '<p>Silinsin derseniz BU SORU sistemden tamamen silinecek!</p> Soru silinsin mi?',
                olumluButonYazisi: 'Silinsin',
                olumsuzButonYazisi: 'Vazgeçtim'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_7__["SoruSilindiIsaretle"](_this.soru.soruId));
            }
        });
    };
    SoruDetayComponent.prototype.soruOnIzlemeGoster = function () {
        var en = '100vw';
        var boy = '10 0vh';
        var sinif = 'popup-masaustu';
        if (this.platform.ANDROID || this.platform.IOS) {
            en = '600px';
            boy = '960px';
            sinif = 'popup-mobil';
        }
        var dialogRef = this.dialog.open(_soru_onizleme_soru_onizleme_component__WEBPACK_IMPORTED_MODULE_11__["SoruOnizlemeComponent"], {
            height: boy,
            width: en,
            panelClass: sinif,
            data: {
                soru: this.soru,
                ders: this.ders,
                konu: this.getKonu(this.soru.konuNo)
            }
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])('soru'),
        __metadata("design:type", _models_soru__WEBPACK_IMPORTED_MODULE_2__["SoruListe"])
    ], SoruDetayComponent.prototype, "soru", void 0);
    SoruDetayComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-soru-detay',
            template: __webpack_require__(/*! ./soru-detay.component.html */ "./src/app/main/content/apps/sorular/soru-detay/soru-detay.component.html"),
            styles: [__webpack_require__(/*! ./soru-detay.component.scss */ "./src/app/main/content/apps/sorular/soru-detay/soru-detay.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_4__["MatDialog"],
            _sorular_service__WEBPACK_IMPORTED_MODULE_3__["SorularService"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"],
            _core_services_sb_mesaj_service__WEBPACK_IMPORTED_MODULE_8__["SbMesajService"],
            _angular_cdk_platform__WEBPACK_IMPORTED_MODULE_5__["Platform"]])
    ], SoruDetayComponent);
    return SoruDetayComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-listesi/soru-listesi-satiri/soru-listesi-satiri.component.html":
/*!***************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-listesi/soru-listesi-satiri/soru-listesi-satiri.component.html ***!
  \***************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n\n    <mat-checkbox [checked]=\"selected\" (change)=\"onSelectedChange()\" (click)=\"$event.stopPropagation();\" style=\"margin-right: 8px\">\n    </mat-checkbox>\n    <button mat-button class=\"mat-icon-button\" (click)=\"$event.stopPropagation()\" (click)=\" soruyuDegistir()\">\n        <mat-icon matTooltip=\"Düzenleme ekranını aç\">edit</mat-icon>\n    </button>\n    <div class=\"info\" fxFlex FlexLayout=\"column\">\n\n        <!-- <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n\n            <div class=\"soru-adi\" fxFlex>\n\n                <span *ngIf=\"soru?.kaynakca\">{{soru.kaynakca}}</span>\n\n            </div>\n            <div *ngIf=\"soru.baslangic\" fxHide fxShow.gt-lg>\n                <div matTooltip=\"Gecerlilik başlangıç - bitiş tarihi\" class=\"time\">\n                    <span> {{soru.baslangic| date: 'MMMM yyyy'}}</span>\n                    <span *ngIf=\"bitisTarihiGecerli\">- {{soru.bitis| date: 'MMMM yyyy'}}</span>\n\n                </div>\n            </div>\n        </div> -->\n\n        <div fxLayout=\"row\" fxLayoutAlign=\"space-betwwen center\">\n            <div class=\"aciklama\" *ngIf=\"soru?.soruMetni\" fxFlex fxLayout=\"row\" fxLayoutAlign=\"star start\" fxLayoutGap=\"10px\">\n\n                <div class=\"mx-4\">\n                    <mat-icon style=\"color:#E2474C\" *ngIf=\"soru?.soruKokuSorulariSayisi>0\" matTooltip=\"İlişkili sorudur. Yani aynı soru köküne bağlı birden fazla soru var. Bu soru da onlardan biridir.\">link</mat-icon>\n                    <!-- <mat-icon style=\"color:#252D43\" *ngIf=\"soru?.soruKokuSorulariSayisi===0\" matTooltip=\"Bağlantısız soru. İlişkili olduğu soru yok. \">label_outline</mat-icon> -->\n                </div>\n                {{soru?.soruMetni | htmlToPlaintext | slice:0:500}}{{soru?.soruMetni.length > 500 ? '...' : ''}}\n                <!-- <div *ngIf=\"soru.baslangic\" fxHide fxShow.gt-lg>\n                        <div matTooltip=\"Gecerlilik başlangıç - bitiş tarihi\" class=\"time\">\n                            <span> {{soru.baslangic| date: 'MMMM yyyy'}}</span>\n                            <span *ngIf=\"bitisTarihiGecerli\">- {{soru.bitis| date: 'MMMM yyyy'}}</span>\n        \n                        </div>\n                    </div> -->\n            </div>\n\n\n            <div *ngIf=\"soru?.baslangic\" fxLayout=\"row\" fxLayoutAlign=\"end center\" fxFlex.gt-lg=\"1 1 150px\" fxFlex=\"1 1 40px\">\n\n\n\n                <button fxHide fxShow.gt-lg mat-icon-button (click)=\"$event.stopPropagation();\" aria-label=\"Toggle star\">\n                    <mat-icon *ngIf=\"!bitisTarihiGecerli\" matTooltip=\"Aksi belirtilene kadar soru geçerli.\">all_inclusive</mat-icon>\n                </button>\n                <button fxHide fxShow.gt-lg mat-icon-button *ngIf=\"!bitisTarihiGecerli\" (click)=\"$event.stopPropagation();favoriToogle()\" aria-label=\"Toggle star\">\n                    <mat-icon *ngIf=\"soru?.favori\" matTooltip=\"Bu soru sizin favori sorunuz.\">star</mat-icon>\n                    <mat-icon *ngIf=\"!soru?.favori\" matTooltip=\"Bu soru sizin için favori olmayan bir sorudur.\">star_outline</mat-icon>\n                </button>\n                <button fxHide fxShow.gt-lg mat-button class=\"mat-icon-button\" aria-label=\"Ders kurulu dersi\">\n                    <mat-icon *ngIf=\"soru?.onaylandi\" matTooltip=\"Bu soru onaylanmış. Sınavlarda çıkabilir.\">thumb_up</mat-icon>\n                    <mat-icon *ngIf=\"!soru?.onaylandi\" matTooltip=\"Bu soru onaysız. Sınavlarda ÇIKMAZ!.\">thumb_down</mat-icon>\n                </button>\n\n                <button mat-icon-button [matMenuTriggerFor]=\"moreMenu\" aria-label=\"More\" (click)=\"$event.stopPropagation();\">\n                    <mat-icon>more_vert</mat-icon>\n                </button>\n\n                <mat-menu #moreMenu=\"matMenu\">\n                    <button *ngIf=\"soru?.aktif\" mat-menu-item aria-label=\"Kapat\" (click)=\"soruyuKapat()\">\n                        <mat-icon>stop</mat-icon>\n                        <span matTooltip=\"Soruyu inkatif yaparak sonraki sınavlarda çıkmasını önlersiniz.\">İnaktif yap</span>\n                    </button>\n\n                    <button *ngIf=\"!soru?.aktif\" mat-menu-item aria-label=\"Aç\" (click)=\"soruyuAc()\">\n                        <mat-icon>fast_forward</mat-icon>\n                        <span matTooltip=\"Aktif yaptığınız sorular sınavlarda onaylandıktan sonra çıkabilir.\">Aktif yap</span>\n                    </button>\n                    <button mat-menu-item aria-label=\"Reply\" (click)=\"soruyuDegistir()\">\n                        <mat-icon matTooltip=\"Düzenleme ekranını aç\">edit</mat-icon>\n                        <span>Düzelt</span>\n                    </button>\n                    <!-- <button mat-menu-item aria-label=\"Print\">\n                        <mat-icon>print</mat-icon>\n                        <span>Yazdır</span>\n                    </button> -->\n                    <mat-divider></mat-divider>\n                    <button *ngIf=\"!soru?.favori\" mat-menu-item aria-label=\"Favori yap\" (click)=\"soruyuFavoriYap()\">\n                        <mat-icon matTooltip=\"Favori olarak işaretlerseniz sınavlarda çıkma olasılığı artar\">star</mat-icon>\n                        <span>Favori sorum olsun</span>\n                    </button>\n\n                    <button *ngIf=\"soru?.favori\" mat-menu-item aria-label=\"Sıradan yap\" (click)=\"soruyuSiradanYap()\">\n                        <mat-icon matTooltip=\"Soruyu favori yapmazsanız, sınavlarda çıkma şansı az olur. \">star_outline</mat-icon>\n                        <span>Favori sorum olmasın</span>\n                    </button>\n\n                    <mat-divider></mat-divider>\n\n                    <button mat-menu-item aria-label=\"Forward \" [disabled]=\"soru?.silinemez\" (click)=\"soruyuSilindiYap()\">\n                        <mat-icon>delete</mat-icon>\n                        <span *ngIf=\"!soru?.silinemez \" matTooltip=\"Soruyu sildikten sonra geri alamazsınız! \">Sil</span>\n                        <span *ngIf=\"soru?.silinemez \" matTooltip=\"Bu soru silinemez olarak işaretlenmiş. \">Sil</span>\n                    </button>\n\n                </mat-menu>\n            </div>\n\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-listesi/soru-listesi-satiri/soru-listesi-satiri.component.scss":
/*!***************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-listesi/soru-listesi-satiri/soru-listesi-satiri.component.scss ***!
  \***************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n:host {\n  flex-shrink: 0;\n  position: relative;\n  padding: 16px 24px;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.12);\n  cursor: pointer;\n  background: #E2E3DD; }\n:host.selected {\n    background: #D8E8E9; }\n:host.current-mail {\n    background: #A8D0DA; }\n:host.current-mail .soru-adi {\n      color: #2F3A57; }\n:host.current-mail .aciklama {\n      color: #2F3A57; }\n:host.current-mail .info .row-2 .labels {\n      background: #FFF8E1; }\n:host .info {\n    overflow: hidden;\n    width: 0;\n    margin-left: 8px;\n    position: relative; }\n:host .info .row-1 {\n      margin-bottom: 8px; }\n:host .info .row-1 .name {\n        font-size: 15px;\n        font-weight: 500; }\n:host .info .row-1 .name .avatar {\n          min-width: 32px;\n          width: 32px;\n          height: 32px;\n          line-height: 32px;\n          background-color: #039be5; }\n:host .info .row-1 .actions {\n        margin-left: 4px; }\n:host .info .row-1 .actions .mat-icon-button {\n          width: 32px;\n          height: 32px;\n          line-height: 1; }\n:host .info .row-2 .labels {\n      position: absolute;\n      background: #FFFFFF;\n      bottom: 0;\n      right: 0;\n      padding-left: 6px; }\n:host .info .row-2 .labels .label {\n        font-size: 11px;\n        border-radius: 2px;\n        margin: 0 4px 0 0;\n        padding: 3px 8px;\n        background-color: rgba(0, 0, 0, 0.08); }\n:host .info .row-2 .labels .label .label-color {\n          width: 8px;\n          height: 8px;\n          margin-right: 8px;\n          border-radius: 50%; }\n:host .soru-adi {\n    font-weight: 500;\n    color: #2F3A57;\n    font-size: 1.5em; }\n@media (max-width: 959px) {\n      :host .soru-adi {\n        font-size: 1em; } }\n:host .aciklama {\n    font-weight: normal;\n    color: #406D95;\n    font-size: 1.2em; }\n@media (max-width: 959px) {\n      :host .aciklama {\n        font-size: .8em; } }\n"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-listesi/soru-listesi-satiri/soru-listesi-satiri.component.ts":
/*!*************************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-listesi/soru-listesi-satiri/soru-listesi-satiri.component.ts ***!
  \*************************************************************************************************************/
/*! exports provided: SoruListesiSatiriComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruListesiSatiriComponent", function() { return SoruListesiSatiriComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _models_soru__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../models/soru */ "./src/app/main/content/apps/sorular/models/soru.ts");
/* harmony import */ var _sorular_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../sorular.service */ "./src/app/main/content/apps/sorular/sorular.service.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_cdk_platform__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/cdk/platform */ "./node_modules/@angular/cdk/esm5/platform.es5.js");
/* harmony import */ var _soru_store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../soru-store */ "./src/app/main/content/apps/sorular/soru-store/index.ts");
/* harmony import */ var _store_actions_ui_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../../store/actions/ui.actions */ "./src/app/store/actions/ui.actions.ts");
/* harmony import */ var _core_services_sb_mesaj_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../core/services/sb-mesaj.service */ "./src/app/core/services/sb-mesaj.service.ts");
/* harmony import */ var _coktan_secmeli_soru_coktan_secmeli_soru_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../coktan-secmeli-soru/coktan-secmeli-soru.component */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/coktan-secmeli-soru.component.ts");
/* harmony import */ var _fuse_components_confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @fuse/components/confirm-dialog/confirm-dialog.component */ "./src/@fuse/components/confirm-dialog/confirm-dialog.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var SoruListesiSatiriComponent = /** @class */ (function () {
    function SoruListesiSatiriComponent(dialog, store, sorularService, mesajService, platform, cd) {
        this.dialog = dialog;
        this.store = store;
        this.sorularService = sorularService;
        this.mesajService = mesajService;
        this.platform = platform;
        this.cd = cd;
        this.selectedSoruIds$ = this.store.select(_soru_store__WEBPACK_IMPORTED_MODULE_6__["getSelectedSoruNumaralari"]);
        this.selected = false;
    }
    SoruListesiSatiriComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.soru = new _models_soru__WEBPACK_IMPORTED_MODULE_2__["SoruListe"](this.soru);
        this.bitisTarihiGecerli = this.soru.baslangic < this.soru.bitis;
        this.selectedSoruIds$.subscribe(function (selectedMailIds) {
            // tslint:disable-next-line:triple-equals
            var sonuc = selectedMailIds.find(function (id) { return id == _this.soru.soruId; });
            _this.selected = selectedMailIds.length > 0 && sonuc !== undefined;
            // tslint:disable-next-line:triple-equals
            if (selectedMailIds.length == 1) {
                _this.store.dispatch(new _soru_store__WEBPACK_IMPORTED_MODULE_6__["SetAktifSoru"](selectedMailIds[0]));
            }
            _this.refresh();
        });
    };
    SoruListesiSatiriComponent.prototype.refresh = function () {
        this.cd.markForCheck();
    };
    SoruListesiSatiriComponent.prototype.onSelectedChange = function () {
        this.store.dispatch(new _soru_store__WEBPACK_IMPORTED_MODULE_6__["SoruSecimiDegistir"](this.soru.soruId.toString()));
    };
    SoruListesiSatiriComponent.prototype.ngOnDestroy = function () {
    };
    SoruListesiSatiriComponent.prototype.soruyuDegistir = function () {
        var _this = this;
        this.store.dispatch(new _store_actions_ui_actions__WEBPACK_IMPORTED_MODULE_7__["StartLoading"]());
        var degisecekSoru = this.sorularService.getSoruById(this.soru.soruId)
            .subscribe(function (sonuc) {
            _this.store.dispatch(new _store_actions_ui_actions__WEBPACK_IMPORTED_MODULE_7__["StopLoading"]());
            if (!sonuc.basarili) {
                _this.mesajService.hatalar(sonuc.hatalar);
                return;
            }
            var ders = _this.sorularService.dersBul(sonuc.donenNesne.dersNo);
            var en = '70vw';
            var boy = '90vh';
            var sinif = 'popup-masaustu';
            if (_this.platform.ANDROID || _this.platform.IOS) {
                en = '99vw';
                boy = '95vh';
                sinif = 'popup-mobil';
            }
            _this.dialogRef = _this.dialog.open(_coktan_secmeli_soru_coktan_secmeli_soru_component__WEBPACK_IMPORTED_MODULE_9__["CoktanSecmeliSoruComponent"], {
                data: {
                    dersNo: _this.soru.dersNo,
                    konuNo: _this.soru.konuNo,
                    ders: ders,
                    degisecekSoru: sonuc.donenNesne
                },
                height: boy,
                width: en,
                panelClass: sinif
            });
            _this.dialogRef.afterClosed()
                .subscribe(function (response) {
                if (!response) {
                    return;
                }
                var actionType = response[0];
                var formData = response[1];
                if (!formData.dirty) {
                    console.log('Kaydetmeye gerek yok!');
                    return;
                }
                var kaydedilecekSoru = response[2];
                switch (actionType) {
                    /**
                     * Kaydete tıklandı
                     */
                    case 'kaydet':
                        _this.soruDegisiklikKaydet(formData, kaydedilecekSoru);
                        break;
                    /**
                     * Kapata tıklandı
                     */
                    case 'kapat':
                        break;
                }
            });
        }, function (hata) { _this.mesajService.hataStr('Soru bilgisi alınamadı!'); }, function () { return _this.store.dispatch(new _store_actions_ui_actions__WEBPACK_IMPORTED_MODULE_7__["StopLoading"]()); });
    };
    SoruListesiSatiriComponent.prototype.soruDegisiklikKaydet = function (formData, degisecekSoru) {
        this.sorularService.formuNesneyeCevirKaydet(formData, degisecekSoru);
    };
    SoruListesiSatiriComponent.prototype.soruyuKapat = function () {
        this.store.dispatch(new _soru_store__WEBPACK_IMPORTED_MODULE_6__["SoruAcKapa"]({ soruNo: this.soru.soruId, ac: false }));
    };
    SoruListesiSatiriComponent.prototype.soruyuAc = function () {
        this.store.dispatch(new _soru_store__WEBPACK_IMPORTED_MODULE_6__["SoruAcKapa"]({ soruNo: this.soru.soruId, ac: true }));
    };
    SoruListesiSatiriComponent.prototype.favoriToogle = function () {
        if (this.soru.favori) {
            this.soruyuSiradanYap();
        }
        else {
            this.soruyuFavoriYap();
        }
    };
    SoruListesiSatiriComponent.prototype.soruyuFavoriYap = function () {
        this.store.dispatch(new _soru_store__WEBPACK_IMPORTED_MODULE_6__["SoruFavoriDegistir"]({ soruNo: this.soru.soruId, favori: true }));
    };
    SoruListesiSatiriComponent.prototype.soruyuSiradanYap = function () {
        this.store.dispatch(new _soru_store__WEBPACK_IMPORTED_MODULE_6__["SoruFavoriDegistir"]({ soruNo: this.soru.soruId, favori: true }));
    };
    SoruListesiSatiriComponent.prototype.soruyuSilindiYap = function () {
        var _this = this;
        var dialogRef = this.dialog.open(_fuse_components_confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_10__["FuseConfirmDialogComponent"], {
            width: '600px',
            height: '400',
            data: {
                onaybasligi: 'Silme onayı',
                onaymesaji: '<p>Silinsin derseniz BU SORU sistemden tamamen silinecek!</p> Soru silinsin mi?',
                olumluButonYazisi: 'Silinsin',
                olumsuzButonYazisi: 'Vazgeçtim'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.store.dispatch(new _soru_store__WEBPACK_IMPORTED_MODULE_6__["SoruSilindiIsaretle"](_this.soru.soruId));
            }
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _models_soru__WEBPACK_IMPORTED_MODULE_2__["SoruListe"])
    ], SoruListesiSatiriComponent.prototype, "soru", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostBinding"])('class.selected'),
        __metadata("design:type", Boolean)
    ], SoruListesiSatiriComponent.prototype, "selected", void 0);
    SoruListesiSatiriComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-soru-listesi-satiri',
            template: __webpack_require__(/*! ./soru-listesi-satiri.component.html */ "./src/app/main/content/apps/sorular/soru-listesi/soru-listesi-satiri/soru-listesi-satiri.component.html"),
            styles: [__webpack_require__(/*! ./soru-listesi-satiri.component.scss */ "./src/app/main/content/apps/sorular/soru-listesi/soru-listesi-satiri/soru-listesi-satiri.component.scss")],
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_4__["MatDialog"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"],
            _sorular_service__WEBPACK_IMPORTED_MODULE_3__["SorularService"],
            _core_services_sb_mesaj_service__WEBPACK_IMPORTED_MODULE_8__["SbMesajService"],
            _angular_cdk_platform__WEBPACK_IMPORTED_MODULE_5__["Platform"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]])
    ], SoruListesiSatiriComponent);
    return SoruListesiSatiriComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-listesi/soru-listesi.component.html":
/*!************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-listesi/soru-listesi.component.html ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"sorular.length === 0 && !yukleniyor\" fxLayout=\"column\" fxLayoutAlign=\"center center\" fxFlexFill>\n    <span class=\"no-messages-text hint-text\">SORU LİSTESİ BOŞ</span>\n  </div>\n  <fuse-yukleniyor [yukleniyor]=\"yukleniyor\">\n    <div class=\"mail-list\">\n      <fuse-soru-listesi-satiri matRipple *ngFor=\"let soru of sorular\" [soru]=\"soru\" (click)=\"readSoru(soru)\" [ngClass]=\"{'current-mail':soru?.soruId == aktifSoru?.soruId}\"></fuse-soru-listesi-satiri>\n    </div>\n  </fuse-yukleniyor>"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-listesi/soru-listesi.component.scss":
/*!************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-listesi/soru-listesi.component.scss ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  overflow-y: auto;\n  padding: 0;\n  border-right: 1px solid rgba(0, 0, 0, 0.12);\n  background-color: #E2E3DD; }\n  :host .no-messages-text {\n    font-size: 24px;\n    font-weight: 300; }\n  :host .mail-list {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    flex: 1;\n    background-color: #E2E3DD; }\n"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-listesi/soru-listesi.component.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-listesi/soru-listesi.component.ts ***!
  \**********************************************************************************/
/*! exports provided: SoruListesiComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruListesiComponent", function() { return SoruListesiComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_soru__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/soru */ "./src/app/main/content/apps/sorular/models/soru.ts");
/* harmony import */ var _soru_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../soru-store */ "./src/app/main/content/apps/sorular/soru-store/index.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SoruListesiComponent = /** @class */ (function () {
    function SoruListesiComponent(store) {
        var _this = this;
        this.store = store;
        this.sorudegisti = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.store.select(_soru_store__WEBPACK_IMPORTED_MODULE_2__["getSorularLoading"]).subscribe(function (loading) {
            _this.yukleniyor = loading;
        });
    }
    SoruListesiComponent.prototype.readSoru = function (soru) {
        this.sorudegisti.emit(soru.soruId);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], SoruListesiComponent.prototype, "sorular", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _models_soru__WEBPACK_IMPORTED_MODULE_1__["SoruListe"])
    ], SoruListesiComponent.prototype, "aktifSoru", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], SoruListesiComponent.prototype, "sorudegisti", void 0);
    SoruListesiComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-soru-listesi',
            template: __webpack_require__(/*! ./soru-listesi.component.html */ "./src/app/main/content/apps/sorular/soru-listesi/soru-listesi.component.html"),
            styles: [__webpack_require__(/*! ./soru-listesi.component.scss */ "./src/app/main/content/apps/sorular/soru-listesi/soru-listesi.component.scss")],
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"]])
    ], SoruListesiComponent);
    return SoruListesiComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-onizleme/soru-onizleme.component.html":
/*!**************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-onizleme/soru-onizleme.component.html ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"invoice\" class=\"modern page-layout blank\" fxLayout=\"row\" fusePerfectScrollbar>\n\n  <div class=\"invoice-container\">\n\n    <!-- INVOICE -->\n    <div class=\"card\">\n\n      <div class=\"header\" fxLayout=\"row\" fxLayoutAlign=\"space-between start\">\n\n        <div class=\"ids\" fxLayout=\"column\" fxFlex=\"70%\">\n\n          <div fxLayout=\"row\" class=\"seller\" fxLayoutAlign=\"start center\">\n\n            <div class=\"detail\">\n              <div class=\"title\">\n                <span>Soru Adı:</span>\n                {{data.soru.kaynakca}}</div>\n              <div class=\"address\">\n                <span>Soru Açıklaması:</span>\n                {{data.soru.aciklama}}\n              </div>\n              <div *ngIf=\"data.ders\" class=\"website\">\n                {{data.ders.birimAdi}} {{','+data.ders.programAdi+' programı'}}\n              </div>\n              <div *ngIf=\"data.ders\" class=\"website\">\n                {{data.ders.donemAdi}}\n              </div>\n              <div *ngIf=\"data.ders\" class=\"phone\">\n                <span>Ders:</span>\n                {{data.ders.dersAdi}}\n              </div>\n              <div *ngIf=\"data.konu\">\n                <span>Konu:</span>\n                {{data.konu.konuAdi}}\n              </div>\n\n            </div>\n          </div>\n\n          <div fxLayout=\"row\" class=\"client\" fxLayoutAlign=\"start center\">\n            <div class=\"label\" fxLayout=\"row\" fxLayoutAlign=\"end center\">\n              <div *ngIf=\"!data.konu\">Ders Anlatan Hocalar</div>\n              <div *ngIf=\"data.konu\">Konu Anlatan Hocalar</div>\n            </div>\n\n            <div class=\"divider\"></div>\n\n            <div *ngIf=\"!data.konu\" class=\"detail\">\n              <div class=\"title\" *ngFor=\"let hoca of data.ders.anlatanHocalar\">\n                {{hoca.unvanAdSoyad}}\n              </div>\n             \n            </div>\n            <div *ngIf=\"data.konu\" class=\"detail\">\n              <div class=\"title\" *ngFor=\"let hoca of data.konu.anlatanHocalar\">\n                  {{hoca.unvanAdSoyad}}\n              </div>\n            </div>\n          </div>\n        </div>\n\n        <table class=\"summary\" fxFlex=\"30%\">\n          <tr class=\"code\">\n            <td class=\"label\">SORU</td>\n            <td class=\"value\">{{data.soru.soruId}}</td>\n          </tr>\n\n          <tr>\n            <td class=\"label\">Başlangıç</td>\n            <td class=\"value\">{{data.soru.baslangic| date: 'MMMM yyyy'}}</td>\n          </tr>\n\n          <tr>\n            <td class=\"label\">Bitiş</td>\n            <td class=\"value\">{{data.soru.bitis| date: 'MMMM yyyy'}}</td>\n          </tr>\n\n          <tr>\n            <td class=\"label\">KEI</td>\n            <td class=\"value\">{{data.soru.kabulEdilebilirlikIndeksi}}</td>\n          </tr>\n        </table>\n      </div>\n\n      <div class=\"content\">\n\n        <div>{{data.soru.soruMetni}}</div>\n        <ol type=\"a\">\n          <li *ngFor=\"let secenek of data.soru.tekDogruluSecenekleri \">\n            <div [innerHTML]=\"secenek.secenekMetni\"></div>\n          </li>\n        </ol>\n      </div>\n      <div class=\"footer\">\n        <div class=\"note\">Yukarıdaki çerçeve içinde soruyu görmektesiniz. Buraya bakarak sorunun sınavda nasıl çıkacağı konusunda yaklaşık\n          bilgi elde edebilirsiniz.</div>\n        <div fxLayout=\"row\" fxLayoutAlign=\"start start\">\n          <div class=\"small-note\">\n            Lütfen siyah çerçeve içinde sorunun görünüşüne dikkat edin. Buradaki problemleri varsa görüp soru düzeltme kısmından gerekli\n            değişiklikleri yaptıktan sonra soruyu kaydedin. Sonra tekrar bu ekrana gelip sorunun son görünüşüne bakın.\n          </div>\n        </div>\n      </div>\n\n      <!--\n\n          Use the following elements to add breaks to your pages. This will make sure that the section in between\n          these elements will be printed on a new page. The following two elements must be used before and after the\n          page content that you want to show as a new page. So, you have to wrap your content with them.\n\n          Elements:\n          ---------\n          <div class=\"page-break-after\"></div>\n          <div class=\"page-break-before\"></div>\n\n          -->\n\n      <!--\n\n          Example:\n          --------\n\n          Initial page content!\n\n          <div class=\"page-break-after\"></div>\n          <div class=\"page-break-before\"></div>\n\n          This is the second page!\n\n          <div class=\"page-break-after\"></div>\n          <div class=\"page-break-before\"></div>\n\n          This is the third page!\n\n          <div class=\"page-break-after\"></div>\n          <div class=\"page-break-before\"></div>\n\n          -->\n\n    </div>\n    <!-- / INVOICE -->\n\n  </div>\n\n</div>"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-onizleme/soru-onizleme.component.scss":
/*!**************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-onizleme/soru-onizleme.component.scss ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n:host {\n  /* PRINT STYLES */ }\n:host .popup-mobil {\n    width: 100%; }\n:host #invoice.modern {\n    padding: 0;\n    overflow: auto; }\n:host #invoice.modern .invoice-container {\n      padding: 64px; }\n:host #invoice.modern .invoice-container .card {\n        width: 1020px;\n        min-width: 1020px;\n        max-width: 1020px;\n        padding: 88px;\n        overflow: hidden;\n        background: #FFFFFF;\n        box-shadow: 0px 4px 5px -2px rgba(0, 0, 0, 0.2), 0px 7px 10px 1px rgba(0, 0, 0, 0.14), 0px 2px 16px 1px rgba(0, 0, 0, 0.12); }\n:host #invoice.modern .invoice-container .card .header .ids {\n          line-height: 22px;\n          color: rgba(0, 0, 0, 0.54); }\n:host #invoice.modern .invoice-container .card .header .ids .detail .title {\n            font-weight: bolder; }\n:host #invoice.modern .invoice-container .card .header .ids .detail .address {\n            color: rgba(0, 0, 0, 0.3); }\n:host #invoice.modern .invoice-container .card .header .ids .seller {\n            margin-bottom: 80px; }\n:host #invoice.modern .invoice-container .card .header .ids .client .label {\n            font-size: 24px;\n            font-weight: 300; }\n:host #invoice.modern .invoice-container .card .header .ids .divider {\n            width: 1px;\n            margin: 0 48px;\n            background-color: rgba(0, 0, 0, 0.12);\n            height: 144px; }\n:host #invoice.modern .invoice-container .card .header .summary {\n          font-size: 15px; }\n:host #invoice.modern .invoice-container .card .header .summary .label {\n            color: rgba(0, 0, 0, 0.54);\n            text-align: right;\n            padding-right: 16px; }\n:host #invoice.modern .invoice-container .card .header .summary .value {\n            color: black; }\n:host #invoice.modern .invoice-container .card .header .summary .code {\n            font-size: 35px;\n            font-weight: 300; }\n:host #invoice.modern .invoice-container .card .header .summary .code td {\n              padding-bottom: 32px; }\n:host #invoice.modern .invoice-container .card .content {\n          padding: 24px;\n          margin-top: 12px;\n          border: 1px solid black; }\n:host #invoice.modern .invoice-container .card .content .invoice-table {\n            margin-top: 96px;\n            font-size: 15px; }\n:host #invoice.modern .invoice-container .card .content .invoice-table .title {\n              font-size: 17px; }\n:host #invoice.modern .invoice-container .card .content .invoice-table .detail {\n              margin-top: 8px;\n              font-size: 12px;\n              color: rgba(0, 0, 0, 0.54); }\n:host #invoice.modern .invoice-container .card .content .invoice-table-footer {\n            margin: 32px 0 96px 0; }\n:host #invoice.modern .invoice-container .card .content .invoice-table-footer tr td {\n              text-align: right;\n              font-size: 17px;\n              font-weight: 500;\n              color: rgba(0, 0, 0, 0.54);\n              border-bottom: none;\n              padding: 8px 8px; }\n:host #invoice.modern .invoice-container .card .content .invoice-table-footer tr td:first-child {\n                text-align: left; }\n:host #invoice.modern .invoice-container .card .content .invoice-table-footer tr.discount td {\n              padding-bottom: 32px; }\n:host #invoice.modern .invoice-container .card .content .invoice-table-footer tr.total td {\n              padding: 32px 8px;\n              border-top: 1px solid rgba(0, 0, 0, 0.12);\n              font-size: 35px;\n              font-weight: 300;\n              color: black; }\n:host #invoice.modern .invoice-container .card .footer {\n          margin-top: 24px; }\n:host #invoice.modern .invoice-container .card .footer .note {\n            font-size: 15px;\n            font-weight: 500;\n            margin-bottom: 24px; }\n:host #invoice.modern .invoice-container .card .footer .logo,\n          :host #invoice.modern .invoice-container .card .footer .small-note {\n            -ms-flex: 0 1 auto; }\n:host #invoice.modern .invoice-container .card .footer .logo {\n            width: 32px;\n            min-width: 32px;\n            margin-right: 24px; }\n:host #invoice.modern .invoice-container .card .footer .small-note {\n            font-size: 12px;\n            font-weight: 500;\n            color: rgba(0, 0, 0, 0.54);\n            line-height: 18px; }\n@media print {\n    :host {\n      /* Invoice Specific Styles */ }\n      :host #invoice.modern .invoice-container {\n        padding: 0; }\n        :host #invoice.modern .invoice-container .card {\n          width: 100%;\n          min-width: 100%;\n          background: none;\n          padding: 0;\n          box-shadow: none; }\n          :host #invoice.modern .invoice-container .card .header .ids .seller {\n            margin-bottom: 8pt; }\n          :host #invoice.modern .invoice-container .card .header .ids .client {\n            margin-top: 24px; }\n            :host #invoice.modern .invoice-container .card .header .ids .client .label {\n              font-size: 16pt; }\n          :host #invoice.modern .invoice-container .card .header .ids .divider {\n            margin: 0 12pt;\n            height: 100pt; }\n          :host #invoice.modern .invoice-container .card .header .summary {\n            font-size: 10pt; }\n            :host #invoice.modern .invoice-container .card .header .summary .code {\n              font-size: 18pt; }\n              :host #invoice.modern .invoice-container .card .header .summary .code td {\n                padding-bottom: 10pt; }\n          :host #invoice.modern .invoice-container .card .content {\n            margin-top: 20px; }\n          :host #invoice.modern .invoice-container .card .footer .note {\n            font-size: 10pt;\n            margin-bottom: 8pt; }\n          :host #invoice.modern .invoice-container .card .footer .logo {\n            font-size: 14pt;\n            margin-right: 8pt; }\n          :host #invoice.modern .invoice-container .card .footer .small-note {\n            font-size: 8pt;\n            line-height: normal; } }\n"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-onizleme/soru-onizleme.component.ts":
/*!************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-onizleme/soru-onizleme.component.ts ***!
  \************************************************************************************/
/*! exports provided: SoruOnizlemeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruOnizlemeComponent", function() { return SoruOnizlemeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
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


var SoruOnizlemeComponent = /** @class */ (function () {
    function SoruOnizlemeComponent(data) {
        this.data = data;
    }
    SoruOnizlemeComponent.prototype.ngOnInit = function () {
    };
    SoruOnizlemeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-soru-onizleme',
            template: __webpack_require__(/*! ./soru-onizleme.component.html */ "./src/app/main/content/apps/sorular/soru-onizleme/soru-onizleme.component.html"),
            styles: [__webpack_require__(/*! ./soru-onizleme.component.scss */ "./src/app/main/content/apps/sorular/soru-onizleme/soru-onizleme.component.scss")]
        }),
        __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [Object])
    ], SoruOnizlemeComponent);
    return SoruOnizlemeComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/actions/birimler.actions.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/actions/birimler.actions.ts ***!
  \**********************************************************************************/
/*! exports provided: BIRIMLER_SIFIRLA, GET_BIRIMLER, GET_BIRIMLER_SUCCESS, GET_BIRIMLER_FAILED, GET_DERSLER, GET_DERSLER_SUCCESS, SEC_AKTIF_BIRIM, SEC_AKTIF_DERS, SEC_AKTIF_KONU, KONTROL_ET_AKTIF_BIRIM, BIRIM_ILKINI_SEC, BirimleriSifirla, GetBirimler, GetBirimlerSuccess, GetDersler, GetDerslerSuccess, GetBirimlerFailed, SecAktifBirim, SecAktifDers, SecAktifKonu, KontrolEtAktifBirim, IlkBirimiSec */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIRIMLER_SIFIRLA", function() { return BIRIMLER_SIFIRLA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_BIRIMLER", function() { return GET_BIRIMLER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_BIRIMLER_SUCCESS", function() { return GET_BIRIMLER_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_BIRIMLER_FAILED", function() { return GET_BIRIMLER_FAILED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_DERSLER", function() { return GET_DERSLER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_DERSLER_SUCCESS", function() { return GET_DERSLER_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SEC_AKTIF_BIRIM", function() { return SEC_AKTIF_BIRIM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SEC_AKTIF_DERS", function() { return SEC_AKTIF_DERS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SEC_AKTIF_KONU", function() { return SEC_AKTIF_KONU; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KONTROL_ET_AKTIF_BIRIM", function() { return KONTROL_ET_AKTIF_BIRIM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIRIM_ILKINI_SEC", function() { return BIRIM_ILKINI_SEC; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BirimleriSifirla", function() { return BirimleriSifirla; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetBirimler", function() { return GetBirimler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetBirimlerSuccess", function() { return GetBirimlerSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetDersler", function() { return GetDersler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetDerslerSuccess", function() { return GetDerslerSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetBirimlerFailed", function() { return GetBirimlerFailed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SecAktifBirim", function() { return SecAktifBirim; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SecAktifDers", function() { return SecAktifDers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SecAktifKonu", function() { return SecAktifKonu; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KontrolEtAktifBirim", function() { return KontrolEtAktifBirim; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IlkBirimiSec", function() { return IlkBirimiSec; });
var BIRIMLER_SIFIRLA = '[BIRIMLER] SIFIRLA';
var GET_BIRIMLER = '[BIRIMLER] GET BIRIMLER';
var GET_BIRIMLER_SUCCESS = '[BIRIMLER] GET BIRIMLER SUCCESS';
var GET_BIRIMLER_FAILED = '[BIRIMLER] GET BIRIMLER FAILED';
var GET_DERSLER = '[DERSLER] GET DERSLER';
var GET_DERSLER_SUCCESS = '[DERSLER] GET BIRIMLER SUCCESS';
var SEC_AKTIF_BIRIM = '[BIRIMLER] SEC AKTIF BIRIM';
var SEC_AKTIF_DERS = '[BIRIMLER] SEC AKTIF DERS';
var SEC_AKTIF_KONU = '[BIRIMLER] SEC AKTIF KONU';
var KONTROL_ET_AKTIF_BIRIM = '[BIRIMLER] KONTROL ET AKTIF BIRIM';
var BIRIM_ILKINI_SEC = '[BIRIMLER] BIRIM ILKINI SEC';
var BirimleriSifirla = /** @class */ (function () {
    function BirimleriSifirla() {
        this.type = BIRIMLER_SIFIRLA;
    }
    return BirimleriSifirla;
}());

var GetBirimler = /** @class */ (function () {
    function GetBirimler(payload) {
        this.payload = payload;
        this.type = GET_BIRIMLER;
    }
    return GetBirimler;
}());

var GetBirimlerSuccess = /** @class */ (function () {
    function GetBirimlerSuccess(payload) {
        this.payload = payload;
        this.type = GET_BIRIMLER_SUCCESS;
    }
    return GetBirimlerSuccess;
}());

var GetDersler = /** @class */ (function () {
    function GetDersler() {
        this.type = GET_DERSLER;
    }
    return GetDersler;
}());

var GetDerslerSuccess = /** @class */ (function () {
    function GetDerslerSuccess(payload) {
        this.payload = payload;
        this.type = GET_DERSLER_SUCCESS;
    }
    return GetDerslerSuccess;
}());

var GetBirimlerFailed = /** @class */ (function () {
    function GetBirimlerFailed(payload) {
        this.payload = payload;
        this.type = GET_BIRIMLER_FAILED;
    }
    return GetBirimlerFailed;
}());

var SecAktifBirim = /** @class */ (function () {
    function SecAktifBirim(payload) {
        this.payload = payload;
        this.type = SEC_AKTIF_BIRIM;
    }
    return SecAktifBirim;
}());

var SecAktifDers = /** @class */ (function () {
    function SecAktifDers(payload) {
        this.payload = payload;
        this.type = SEC_AKTIF_DERS;
    }
    return SecAktifDers;
}());

var SecAktifKonu = /** @class */ (function () {
    function SecAktifKonu(payload) {
        this.payload = payload;
        this.type = SEC_AKTIF_KONU;
    }
    return SecAktifKonu;
}());

var KontrolEtAktifBirim = /** @class */ (function () {
    function KontrolEtAktifBirim() {
        this.type = KONTROL_ET_AKTIF_BIRIM;
    }
    return KontrolEtAktifBirim;
}());

var IlkBirimiSec = /** @class */ (function () {
    function IlkBirimiSec(payload) {
        this.payload = payload;
        this.type = BIRIM_ILKINI_SEC;
    }
    return IlkBirimiSec;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/actions/gerekli-listeler.actions.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/actions/gerekli-listeler.actions.ts ***!
  \******************************************************************************************/
/*! exports provided: GET_BILISSEL_DUZEYLER, GET_BILISSEL_DUZEYLER_TAMAM, GET_BILISSEL_DUZEYLER_HATA, GET_SORU_TIPLERI, GET_SORU_TIPLERI_TAMAM, GET_SORU_TIPLERI_HATA, GET_SORU_ZORLUKLARI, GET_SORU_ZORLUKLARI_TAMAM, GET_SORU_ZORLUKLARI_HATA, GetBilisselDuzeyler, GetBilisselDuzeylerTamam, GetBilisselDuzeylerHata, GetSoruTipleri, GetSoruTipleriTamam, GetSoruTipleriHata, GetSoruZorluklari, GetSoruZorluklariTamam, GetSoruZorluklariHata */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_BILISSEL_DUZEYLER", function() { return GET_BILISSEL_DUZEYLER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_BILISSEL_DUZEYLER_TAMAM", function() { return GET_BILISSEL_DUZEYLER_TAMAM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_BILISSEL_DUZEYLER_HATA", function() { return GET_BILISSEL_DUZEYLER_HATA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_SORU_TIPLERI", function() { return GET_SORU_TIPLERI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_SORU_TIPLERI_TAMAM", function() { return GET_SORU_TIPLERI_TAMAM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_SORU_TIPLERI_HATA", function() { return GET_SORU_TIPLERI_HATA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_SORU_ZORLUKLARI", function() { return GET_SORU_ZORLUKLARI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_SORU_ZORLUKLARI_TAMAM", function() { return GET_SORU_ZORLUKLARI_TAMAM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_SORU_ZORLUKLARI_HATA", function() { return GET_SORU_ZORLUKLARI_HATA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetBilisselDuzeyler", function() { return GetBilisselDuzeyler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetBilisselDuzeylerTamam", function() { return GetBilisselDuzeylerTamam; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetBilisselDuzeylerHata", function() { return GetBilisselDuzeylerHata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetSoruTipleri", function() { return GetSoruTipleri; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetSoruTipleriTamam", function() { return GetSoruTipleriTamam; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetSoruTipleriHata", function() { return GetSoruTipleriHata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetSoruZorluklari", function() { return GetSoruZorluklari; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetSoruZorluklariTamam", function() { return GetSoruZorluklariTamam; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetSoruZorluklariHata", function() { return GetSoruZorluklariHata; });
var GET_BILISSEL_DUZEYLER = '[GEREKLILISTELER] GET BILISSEL DUZEYLER';
var GET_BILISSEL_DUZEYLER_TAMAM = '[GEREKLILISTELER] GET BILISSEL DUZEYLER TAMAM';
var GET_BILISSEL_DUZEYLER_HATA = '[GEREKLILISTELER] GET BILISSEL DUZEYLER HATA';
var GET_SORU_TIPLERI = '[GEREKLILISTELER] GET SORU TIPLERI';
var GET_SORU_TIPLERI_TAMAM = '[GEREKLILISTELER] GET SORU TIPLERI TAMAM';
var GET_SORU_TIPLERI_HATA = '[GEREKLILISTELER] GET SORU TIPLERI HATA';
var GET_SORU_ZORLUKLARI = '[GEREKLILISTELER] GET SORU ZORLUKLARI';
var GET_SORU_ZORLUKLARI_TAMAM = '[GEREKLILISTELER] GET SORU ZORLUKLARI TAMAM';
var GET_SORU_ZORLUKLARI_HATA = '[GEREKLILISTELER] GET SORU ZORLUKLARI HATA';
var GetBilisselDuzeyler = /** @class */ (function () {
    function GetBilisselDuzeyler() {
        this.type = GET_BILISSEL_DUZEYLER;
    }
    return GetBilisselDuzeyler;
}());

var GetBilisselDuzeylerTamam = /** @class */ (function () {
    function GetBilisselDuzeylerTamam(payload) {
        this.payload = payload;
        this.type = GET_BILISSEL_DUZEYLER_TAMAM;
    }
    return GetBilisselDuzeylerTamam;
}());

var GetBilisselDuzeylerHata = /** @class */ (function () {
    function GetBilisselDuzeylerHata() {
        this.type = GET_BILISSEL_DUZEYLER_HATA;
    }
    return GetBilisselDuzeylerHata;
}());

var GetSoruTipleri = /** @class */ (function () {
    function GetSoruTipleri() {
        this.type = GET_SORU_TIPLERI;
    }
    return GetSoruTipleri;
}());

var GetSoruTipleriTamam = /** @class */ (function () {
    function GetSoruTipleriTamam(payload) {
        this.payload = payload;
        this.type = GET_SORU_TIPLERI_TAMAM;
    }
    return GetSoruTipleriTamam;
}());

var GetSoruTipleriHata = /** @class */ (function () {
    function GetSoruTipleriHata() {
        this.type = GET_SORU_TIPLERI_HATA;
    }
    return GetSoruTipleriHata;
}());

var GetSoruZorluklari = /** @class */ (function () {
    function GetSoruZorluklari() {
        this.type = GET_SORU_ZORLUKLARI;
    }
    return GetSoruZorluklari;
}());

var GetSoruZorluklariTamam = /** @class */ (function () {
    function GetSoruZorluklariTamam(payload) {
        this.payload = payload;
        this.type = GET_SORU_ZORLUKLARI_TAMAM;
    }
    return GetSoruZorluklariTamam;
}());

var GetSoruZorluklariHata = /** @class */ (function () {
    function GetSoruZorluklariHata() {
        this.type = GET_SORU_ZORLUKLARI_HATA;
    }
    return GetSoruZorluklariHata;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/actions/index.ts":
/*!***********************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/actions/index.ts ***!
  \***********************************************************************/
/*! exports provided: BIRIMLER_SIFIRLA, GET_BIRIMLER, GET_BIRIMLER_SUCCESS, GET_BIRIMLER_FAILED, GET_DERSLER, GET_DERSLER_SUCCESS, SEC_AKTIF_BIRIM, SEC_AKTIF_DERS, SEC_AKTIF_KONU, KONTROL_ET_AKTIF_BIRIM, BIRIM_ILKINI_SEC, BirimleriSifirla, GetBirimler, GetBirimlerSuccess, GetDersler, GetDerslerSuccess, GetBirimlerFailed, SecAktifBirim, SecAktifDers, SecAktifKonu, KontrolEtAktifBirim, IlkBirimiSec, GET_SORULAR, GET_SORULAR_TAMAM, GET_SORULAR_BASARISIZ, SET_SORULAR_ARAMA_CUMLESI, UPDATE_SORU, UPDATE_SORU_TAMAM, SORU_AC_KAPA, SORU_FAVORI_DEGISTIR, UPDATE_SORULAR, UPDATE_SORULAR_TAMAM, SORU_SIL, SORU_SIL_TAMAM, SET_AKTIF_SORU, SET_AKTIF_SORU_SUCCESS, SELECT_SORULAR_TUMU, SORU_SECIMI_DEGISTIR, SORULAR_SIFIRLA, SELECT_SORULAR_PARAMETREYE_GORE, DESELECT_SORULAR_TUMU, SorulariSifirla, GetSorular, GetSorularTamam, GetSorularBasarisiz, SetAktifSoru, SetAktifSoruSuccess, SetSorularAramaCumlesi, SelectSorularTumu, SelectSorularParametreyeGore, DeselectSorularTumu, UpdateSoru, SoruAcKapa, SoruFavoriDegistir, UpdateSoruTamam, UpdateSorular, SoruSilindiIsaretle, SoruSilindi, UpdateSorularTamam, SoruSecimiDegistir, GET_BILISSEL_DUZEYLER, GET_BILISSEL_DUZEYLER_TAMAM, GET_BILISSEL_DUZEYLER_HATA, GET_SORU_TIPLERI, GET_SORU_TIPLERI_TAMAM, GET_SORU_TIPLERI_HATA, GET_SORU_ZORLUKLARI, GET_SORU_ZORLUKLARI_TAMAM, GET_SORU_ZORLUKLARI_HATA, GetBilisselDuzeyler, GetBilisselDuzeylerTamam, GetBilisselDuzeylerHata, GetSoruTipleri, GetSoruTipleriTamam, GetSoruTipleriHata, GetSoruZorluklari, GetSoruZorluklariTamam, GetSoruZorluklariHata */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _birimler_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./birimler.actions */ "./src/app/main/content/apps/sorular/soru-store/actions/birimler.actions.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BIRIMLER_SIFIRLA", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["BIRIMLER_SIFIRLA"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_BIRIMLER", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["GET_BIRIMLER"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_BIRIMLER_SUCCESS", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["GET_BIRIMLER_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_BIRIMLER_FAILED", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["GET_BIRIMLER_FAILED"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_DERSLER", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["GET_DERSLER"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_DERSLER_SUCCESS", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["GET_DERSLER_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SEC_AKTIF_BIRIM", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["SEC_AKTIF_BIRIM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SEC_AKTIF_DERS", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["SEC_AKTIF_DERS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SEC_AKTIF_KONU", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["SEC_AKTIF_KONU"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "KONTROL_ET_AKTIF_BIRIM", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["KONTROL_ET_AKTIF_BIRIM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BIRIM_ILKINI_SEC", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["BIRIM_ILKINI_SEC"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BirimleriSifirla", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["BirimleriSifirla"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetBirimler", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["GetBirimler"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetBirimlerSuccess", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["GetBirimlerSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetDersler", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["GetDersler"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetDerslerSuccess", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["GetDerslerSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetBirimlerFailed", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["GetBirimlerFailed"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SecAktifBirim", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["SecAktifBirim"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SecAktifDers", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["SecAktifDers"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SecAktifKonu", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["SecAktifKonu"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "KontrolEtAktifBirim", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["KontrolEtAktifBirim"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IlkBirimiSec", function() { return _birimler_actions__WEBPACK_IMPORTED_MODULE_0__["IlkBirimiSec"]; });

/* harmony import */ var _sorular_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sorular.actions */ "./src/app/main/content/apps/sorular/soru-store/actions/sorular.actions.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_SORULAR", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["GET_SORULAR"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_SORULAR_TAMAM", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["GET_SORULAR_TAMAM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_SORULAR_BASARISIZ", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["GET_SORULAR_BASARISIZ"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SET_SORULAR_ARAMA_CUMLESI", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SET_SORULAR_ARAMA_CUMLESI"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UPDATE_SORU", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["UPDATE_SORU"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UPDATE_SORU_TAMAM", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["UPDATE_SORU_TAMAM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SORU_AC_KAPA", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SORU_AC_KAPA"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SORU_FAVORI_DEGISTIR", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SORU_FAVORI_DEGISTIR"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UPDATE_SORULAR", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["UPDATE_SORULAR"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UPDATE_SORULAR_TAMAM", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["UPDATE_SORULAR_TAMAM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SORU_SIL", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SORU_SIL"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SORU_SIL_TAMAM", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SORU_SIL_TAMAM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SET_AKTIF_SORU", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SET_AKTIF_SORU"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SET_AKTIF_SORU_SUCCESS", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SET_AKTIF_SORU_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SELECT_SORULAR_TUMU", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SELECT_SORULAR_TUMU"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SORU_SECIMI_DEGISTIR", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SORU_SECIMI_DEGISTIR"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SORULAR_SIFIRLA", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SORULAR_SIFIRLA"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SELECT_SORULAR_PARAMETREYE_GORE", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SELECT_SORULAR_PARAMETREYE_GORE"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DESELECT_SORULAR_TUMU", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["DESELECT_SORULAR_TUMU"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SorulariSifirla", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SorulariSifirla"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetSorular", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["GetSorular"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetSorularTamam", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["GetSorularTamam"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetSorularBasarisiz", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["GetSorularBasarisiz"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SetAktifSoru", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SetAktifSoru"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SetAktifSoruSuccess", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SetAktifSoruSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SetSorularAramaCumlesi", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SetSorularAramaCumlesi"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SelectSorularTumu", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SelectSorularTumu"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SelectSorularParametreyeGore", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SelectSorularParametreyeGore"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DeselectSorularTumu", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["DeselectSorularTumu"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UpdateSoru", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["UpdateSoru"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SoruAcKapa", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SoruAcKapa"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SoruFavoriDegistir", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SoruFavoriDegistir"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UpdateSoruTamam", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["UpdateSoruTamam"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UpdateSorular", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["UpdateSorular"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SoruSilindiIsaretle", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SoruSilindiIsaretle"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SoruSilindi", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SoruSilindi"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UpdateSorularTamam", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["UpdateSorularTamam"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SoruSecimiDegistir", function() { return _sorular_actions__WEBPACK_IMPORTED_MODULE_1__["SoruSecimiDegistir"]; });

/* harmony import */ var _gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gerekli-listeler.actions */ "./src/app/main/content/apps/sorular/soru-store/actions/gerekli-listeler.actions.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_BILISSEL_DUZEYLER", function() { return _gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_2__["GET_BILISSEL_DUZEYLER"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_BILISSEL_DUZEYLER_TAMAM", function() { return _gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_2__["GET_BILISSEL_DUZEYLER_TAMAM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_BILISSEL_DUZEYLER_HATA", function() { return _gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_2__["GET_BILISSEL_DUZEYLER_HATA"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_SORU_TIPLERI", function() { return _gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_2__["GET_SORU_TIPLERI"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_SORU_TIPLERI_TAMAM", function() { return _gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_2__["GET_SORU_TIPLERI_TAMAM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_SORU_TIPLERI_HATA", function() { return _gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_2__["GET_SORU_TIPLERI_HATA"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_SORU_ZORLUKLARI", function() { return _gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_2__["GET_SORU_ZORLUKLARI"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_SORU_ZORLUKLARI_TAMAM", function() { return _gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_2__["GET_SORU_ZORLUKLARI_TAMAM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_SORU_ZORLUKLARI_HATA", function() { return _gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_2__["GET_SORU_ZORLUKLARI_HATA"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetBilisselDuzeyler", function() { return _gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_2__["GetBilisselDuzeyler"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetBilisselDuzeylerTamam", function() { return _gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_2__["GetBilisselDuzeylerTamam"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetBilisselDuzeylerHata", function() { return _gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_2__["GetBilisselDuzeylerHata"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetSoruTipleri", function() { return _gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_2__["GetSoruTipleri"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetSoruTipleriTamam", function() { return _gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_2__["GetSoruTipleriTamam"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetSoruTipleriHata", function() { return _gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_2__["GetSoruTipleriHata"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetSoruZorluklari", function() { return _gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_2__["GetSoruZorluklari"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetSoruZorluklariTamam", function() { return _gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_2__["GetSoruZorluklariTamam"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetSoruZorluklariHata", function() { return _gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_2__["GetSoruZorluklariHata"]; });






/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/actions/sorular.actions.ts":
/*!*********************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/actions/sorular.actions.ts ***!
  \*********************************************************************************/
/*! exports provided: GET_SORULAR, GET_SORULAR_TAMAM, GET_SORULAR_BASARISIZ, SET_SORULAR_ARAMA_CUMLESI, UPDATE_SORU, UPDATE_SORU_TAMAM, SORU_AC_KAPA, SORU_FAVORI_DEGISTIR, UPDATE_SORULAR, UPDATE_SORULAR_TAMAM, SORU_SIL, SORU_SIL_TAMAM, SET_AKTIF_SORU, SET_AKTIF_SORU_SUCCESS, SELECT_SORULAR_TUMU, SORU_SECIMI_DEGISTIR, SORULAR_SIFIRLA, SELECT_SORULAR_PARAMETREYE_GORE, DESELECT_SORULAR_TUMU, SorulariSifirla, GetSorular, GetSorularTamam, GetSorularBasarisiz, SetAktifSoru, SetAktifSoruSuccess, SetSorularAramaCumlesi, SelectSorularTumu, SelectSorularParametreyeGore, DeselectSorularTumu, UpdateSoru, SoruAcKapa, SoruFavoriDegistir, UpdateSoruTamam, UpdateSorular, SoruSilindiIsaretle, SoruSilindi, UpdateSorularTamam, SoruSecimiDegistir */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_SORULAR", function() { return GET_SORULAR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_SORULAR_TAMAM", function() { return GET_SORULAR_TAMAM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_SORULAR_BASARISIZ", function() { return GET_SORULAR_BASARISIZ; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_SORULAR_ARAMA_CUMLESI", function() { return SET_SORULAR_ARAMA_CUMLESI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_SORU", function() { return UPDATE_SORU; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_SORU_TAMAM", function() { return UPDATE_SORU_TAMAM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SORU_AC_KAPA", function() { return SORU_AC_KAPA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SORU_FAVORI_DEGISTIR", function() { return SORU_FAVORI_DEGISTIR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_SORULAR", function() { return UPDATE_SORULAR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_SORULAR_TAMAM", function() { return UPDATE_SORULAR_TAMAM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SORU_SIL", function() { return SORU_SIL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SORU_SIL_TAMAM", function() { return SORU_SIL_TAMAM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_AKTIF_SORU", function() { return SET_AKTIF_SORU; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_AKTIF_SORU_SUCCESS", function() { return SET_AKTIF_SORU_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SELECT_SORULAR_TUMU", function() { return SELECT_SORULAR_TUMU; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SORU_SECIMI_DEGISTIR", function() { return SORU_SECIMI_DEGISTIR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SORULAR_SIFIRLA", function() { return SORULAR_SIFIRLA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SELECT_SORULAR_PARAMETREYE_GORE", function() { return SELECT_SORULAR_PARAMETREYE_GORE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DESELECT_SORULAR_TUMU", function() { return DESELECT_SORULAR_TUMU; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SorulariSifirla", function() { return SorulariSifirla; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetSorular", function() { return GetSorular; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetSorularTamam", function() { return GetSorularTamam; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetSorularBasarisiz", function() { return GetSorularBasarisiz; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetAktifSoru", function() { return SetAktifSoru; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetAktifSoruSuccess", function() { return SetAktifSoruSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetSorularAramaCumlesi", function() { return SetSorularAramaCumlesi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectSorularTumu", function() { return SelectSorularTumu; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectSorularParametreyeGore", function() { return SelectSorularParametreyeGore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeselectSorularTumu", function() { return DeselectSorularTumu; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateSoru", function() { return UpdateSoru; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruAcKapa", function() { return SoruAcKapa; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruFavoriDegistir", function() { return SoruFavoriDegistir; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateSoruTamam", function() { return UpdateSoruTamam; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateSorular", function() { return UpdateSorular; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruSilindiIsaretle", function() { return SoruSilindiIsaretle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruSilindi", function() { return SoruSilindi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateSorularTamam", function() { return UpdateSorularTamam; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruSecimiDegistir", function() { return SoruSecimiDegistir; });
var GET_SORULAR = '[SORULAR] GET SORULAR';
var GET_SORULAR_TAMAM = '[SORULAR] GET SORULAR TAMAM';
var GET_SORULAR_BASARISIZ = '[SORULAR] GET SORULAR BASARISIZ';
var SET_SORULAR_ARAMA_CUMLESI = '[SORULAR] SET SORULAR ARAMA CUMLESI';
var UPDATE_SORU = '[SORULAR] UPDATE SORU';
var UPDATE_SORU_TAMAM = '[SORULAR] UPDATE SORU TAMAM';
var SORU_AC_KAPA = '[SORULAR] SORU AC KAPA';
var SORU_FAVORI_DEGISTIR = '[SORULAR] SORU FAVORI DEGISTIR';
var UPDATE_SORULAR = '[SORULAR] UPDATE SORULAR';
var UPDATE_SORULAR_TAMAM = '[SORULAR] UPDATE SORULAR TAMAM';
var SORU_SIL = '[SORULAR] SORU SILINDI OLARAK ISARETLE';
var SORU_SIL_TAMAM = '[SORULAR] SORU SILINDI TAMAM';
var SET_AKTIF_SORU = '[SORULAR] SET AKTIF SORU';
var SET_AKTIF_SORU_SUCCESS = '[SORULAR] SET AKTIF SORU SUCCESS';
var SELECT_SORULAR_TUMU = '[SORULAR] SELECT SORULAR TUMU';
var SORU_SECIMI_DEGISTIR = '[SORULAR] SORU SECIMI DEGISTIR';
var SORULAR_SIFIRLA = '[SORULAR] SIFIRLA';
var SELECT_SORULAR_PARAMETREYE_GORE = '[SORULAR] SELECT SORULAR PARAMETREYE GORE';
var DESELECT_SORULAR_TUMU = '[SORULAR] DESELECT SORULAR TUMU';
var SorulariSifirla = /** @class */ (function () {
    function SorulariSifirla() {
        this.type = SORULAR_SIFIRLA;
    }
    return SorulariSifirla;
}());

var GetSorular = /** @class */ (function () {
    function GetSorular() {
        this.type = GET_SORULAR;
    }
    return GetSorular;
}());

var GetSorularTamam = /** @class */ (function () {
    function GetSorularTamam(payload) {
        this.payload = payload;
        this.type = GET_SORULAR_TAMAM;
    }
    return GetSorularTamam;
}());

var GetSorularBasarisiz = /** @class */ (function () {
    function GetSorularBasarisiz(payload) {
        this.payload = payload;
        this.type = GET_SORULAR_BASARISIZ;
    }
    return GetSorularBasarisiz;
}());

var SetAktifSoru = /** @class */ (function () {
    function SetAktifSoru(payload) {
        this.payload = payload;
        this.type = SET_AKTIF_SORU;
    }
    return SetAktifSoru;
}());

var SetAktifSoruSuccess = /** @class */ (function () {
    function SetAktifSoruSuccess(payload) {
        this.payload = payload;
        this.type = SET_AKTIF_SORU_SUCCESS;
    }
    return SetAktifSoruSuccess;
}());

var SetSorularAramaCumlesi = /** @class */ (function () {
    function SetSorularAramaCumlesi(payload) {
        this.payload = payload;
        this.type = SET_SORULAR_ARAMA_CUMLESI;
    }
    return SetSorularAramaCumlesi;
}());

var SelectSorularTumu = /** @class */ (function () {
    function SelectSorularTumu() {
        this.type = SELECT_SORULAR_TUMU;
    }
    return SelectSorularTumu;
}());

var SelectSorularParametreyeGore = /** @class */ (function () {
    function SelectSorularParametreyeGore(payload) {
        this.payload = payload;
        this.type = SELECT_SORULAR_PARAMETREYE_GORE;
    }
    return SelectSorularParametreyeGore;
}());

var DeselectSorularTumu = /** @class */ (function () {
    function DeselectSorularTumu() {
        this.type = DESELECT_SORULAR_TUMU;
    }
    return DeselectSorularTumu;
}());

var UpdateSoru = /** @class */ (function () {
    function UpdateSoru(payload) {
        this.payload = payload;
        this.type = UPDATE_SORU;
    }
    return UpdateSoru;
}());

var SoruAcKapa = /** @class */ (function () {
    function SoruAcKapa(payload) {
        this.payload = payload;
        this.type = SORU_AC_KAPA;
    }
    return SoruAcKapa;
}());

var SoruFavoriDegistir = /** @class */ (function () {
    function SoruFavoriDegistir(payload) {
        this.payload = payload;
        this.type = SORU_FAVORI_DEGISTIR;
    }
    return SoruFavoriDegistir;
}());

var UpdateSoruTamam = /** @class */ (function () {
    function UpdateSoruTamam(payload) {
        this.payload = payload;
        this.type = UPDATE_SORU_TAMAM;
    }
    return UpdateSoruTamam;
}());

var UpdateSorular = /** @class */ (function () {
    function UpdateSorular(payload) {
        this.payload = payload;
        this.type = UPDATE_SORULAR;
    }
    return UpdateSorular;
}());

var SoruSilindiIsaretle = /** @class */ (function () {
    function SoruSilindiIsaretle(payload) {
        this.payload = payload;
        this.type = SORU_SIL;
    }
    return SoruSilindiIsaretle;
}());

var SoruSilindi = /** @class */ (function () {
    function SoruSilindi(payload) {
        this.payload = payload;
        this.type = SORU_SIL_TAMAM;
    }
    return SoruSilindi;
}());

var UpdateSorularTamam = /** @class */ (function () {
    function UpdateSorularTamam() {
        this.type = UPDATE_SORULAR_TAMAM;
    }
    return UpdateSorularTamam;
}());

var SoruSecimiDegistir = /** @class */ (function () {
    function SoruSecimiDegistir(payload) {
        this.payload = payload;
        this.type = SORU_SECIMI_DEGISTIR;
    }
    return SoruSecimiDegistir;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/effects/birimler.effects.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/effects/birimler.effects.ts ***!
  \**********************************************************************************/
/*! exports provided: BirimlerEffect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BirimlerEffect", function() { return BirimlerEffect; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var rxjs_Observable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/Observable */ "./node_modules/rxjs-compat/_esm5/Observable.js");
/* harmony import */ var rxjs_add_operator_delay__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/add/operator/delay */ "./node_modules/rxjs-compat/_esm5/add/operator/delay.js");
/* harmony import */ var rxjs_add_operator_map__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/add/operator/map */ "./node_modules/rxjs-compat/_esm5/add/operator/map.js");
/* harmony import */ var rxjs_observable_of__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/observable/of */ "./node_modules/rxjs-compat/_esm5/observable/of.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _actions_birimler_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../actions/birimler.actions */ "./src/app/main/content/apps/sorular/soru-store/actions/birimler.actions.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _sorular_effects_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./sorular-effects.service */ "./src/app/main/content/apps/sorular/soru-store/effects/sorular-effects.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var BirimlerEffect = /** @class */ (function () {
    function BirimlerEffect(actions, service, store) {
        var _this = this;
        this.actions = actions;
        this.service = service;
        this.store = store;
        /**
         * Get Folders from Server
         * @type {Observable<any>}
         */
        this.getBirimler = this.actions
            .ofType(_actions_birimler_actions__WEBPACK_IMPORTED_MODULE_7__["GET_BIRIMLER"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["switchMap"])(function (action) {
            return _this.service.getKullanicininAnlattigiDersler()
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["tap"])(function (birimler) {
                birimler.forEach(function (birim) {
                    if (birim.programlari.length > 0) {
                        birim.programlari.forEach(function (program) {
                            if (program.donemleri.length > 0) {
                                program.donemleri.forEach(function (donem) {
                                    if (donem.dersGruplari.length > 0) {
                                        donem.dersGruplari.forEach(function (grup) {
                                            grup.dersleri.forEach(function (ders) {
                                                ders.birimNo = birim.birimId;
                                                ders.birimAdi = birim.birimAdi;
                                                ders.programNo = program.programId;
                                                ders.programAdi = program.programAdi;
                                                ders.donemNo = donem.donemId;
                                                ders.donemAdi = donem.donemAdi;
                                                ders.dersGrubuNo = grup.dersGrupId;
                                                ders.stajDersi = grup.staj;
                                                ders.dersKuruluDersi = grup.dersKurulu;
                                                ders.dersGrubuAdi = grup.grupAdi;
                                            });
                                            _this.store.dispatch(new _actions_birimler_actions__WEBPACK_IMPORTED_MODULE_7__["GetDerslerSuccess"](grup.dersleri));
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (birimler) {
                return new _actions_birimler_actions__WEBPACK_IMPORTED_MODULE_7__["GetBirimlerSuccess"](birimler);
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["catchError"])(function (err) {
                return Object(rxjs_observable_of__WEBPACK_IMPORTED_MODULE_5__["of"])(new _actions_birimler_actions__WEBPACK_IMPORTED_MODULE_7__["GetBirimlerFailed"](err));
            }));
        }));
    }
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])(),
        __metadata("design:type", rxjs_Observable__WEBPACK_IMPORTED_MODULE_2__["Observable"])
    ], BirimlerEffect.prototype, "getBirimler", void 0);
    BirimlerEffect = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Actions"],
            _sorular_effects_service__WEBPACK_IMPORTED_MODULE_9__["SorularEffectsService"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_8__["Store"]])
    ], BirimlerEffect);
    return BirimlerEffect;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/effects/gerekli-listeler.effects.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/effects/gerekli-listeler.effects.ts ***!
  \******************************************************************************************/
/*! exports provided: GerekliListelerEffect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GerekliListelerEffect", function() { return GerekliListelerEffect; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var rxjs_Observable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/Observable */ "./node_modules/rxjs-compat/_esm5/Observable.js");
/* harmony import */ var rxjs_add_operator_delay__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/add/operator/delay */ "./node_modules/rxjs-compat/_esm5/add/operator/delay.js");
/* harmony import */ var rxjs_add_operator_map__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/add/operator/map */ "./node_modules/rxjs-compat/_esm5/add/operator/map.js");
/* harmony import */ var rxjs_observable_of__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/observable/of */ "./node_modules/rxjs-compat/_esm5/observable/of.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../actions/gerekli-listeler.actions */ "./src/app/main/content/apps/sorular/soru-store/actions/gerekli-listeler.actions.ts");
/* harmony import */ var _sorular_effects_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./sorular-effects.service */ "./src/app/main/content/apps/sorular/soru-store/effects/sorular-effects.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var GerekliListelerEffect = /** @class */ (function () {
    function GerekliListelerEffect(actions, service) {
        var _this = this;
        this.actions = actions;
        this.service = service;
        this.GetBilisselDuzeyler = this.actions
            .ofType(_actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_7__["GET_BILISSEL_DUZEYLER"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["switchMap"])(function (action) {
            return _this.service.getBilisselDuzeyler()
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (folders) {
                return new _actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_7__["GetBilisselDuzeylerTamam"](folders.donenListe);
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["catchError"])(function (err) { return Object(rxjs_observable_of__WEBPACK_IMPORTED_MODULE_5__["of"])(new _actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_7__["GetBilisselDuzeylerHata"]()); }));
        }));
        this.GetSoruTipleri = this.actions
            .ofType(_actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_7__["GET_SORU_TIPLERI"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["switchMap"])(function (action) {
            return _this.service.getSoruTipleri()
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (folders) {
                return new _actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_7__["GetSoruTipleriTamam"](folders.donenListe);
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["catchError"])(function (err) { return Object(rxjs_observable_of__WEBPACK_IMPORTED_MODULE_5__["of"])(new _actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_7__["GetSoruTipleriHata"]()); }));
        }));
        this.GetSoruZorluklari = this.actions
            .ofType(_actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_7__["GET_SORU_ZORLUKLARI"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["switchMap"])(function (action) {
            return _this.service.getSoruZorluklari()
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (folders) {
                return new _actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_7__["GetSoruZorluklariTamam"](folders.donenListe);
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["catchError"])(function (err) { return Object(rxjs_observable_of__WEBPACK_IMPORTED_MODULE_5__["of"])(new _actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_7__["GetSoruZorluklariHata"]()); }));
        }));
    }
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])(),
        __metadata("design:type", rxjs_Observable__WEBPACK_IMPORTED_MODULE_2__["Observable"])
    ], GerekliListelerEffect.prototype, "GetBilisselDuzeyler", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])(),
        __metadata("design:type", rxjs_Observable__WEBPACK_IMPORTED_MODULE_2__["Observable"])
    ], GerekliListelerEffect.prototype, "GetSoruTipleri", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])(),
        __metadata("design:type", rxjs_Observable__WEBPACK_IMPORTED_MODULE_2__["Observable"])
    ], GerekliListelerEffect.prototype, "GetSoruZorluklari", void 0);
    GerekliListelerEffect = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Actions"],
            _sorular_effects_service__WEBPACK_IMPORTED_MODULE_8__["SorularEffectsService"]])
    ], GerekliListelerEffect);
    return GerekliListelerEffect;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/effects/index.ts":
/*!***********************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/effects/index.ts ***!
  \***********************************************************************/
/*! exports provided: effects, BirimlerEffect, SorularEffect, GerekliListelerEffect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "effects", function() { return effects; });
/* harmony import */ var _sorular_effects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sorular.effects */ "./src/app/main/content/apps/sorular/soru-store/effects/sorular.effects.ts");
/* harmony import */ var _birimler_effects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./birimler.effects */ "./src/app/main/content/apps/sorular/soru-store/effects/birimler.effects.ts");
/* harmony import */ var _gerekli_listeler_effects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gerekli-listeler.effects */ "./src/app/main/content/apps/sorular/soru-store/effects/gerekli-listeler.effects.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BirimlerEffect", function() { return _birimler_effects__WEBPACK_IMPORTED_MODULE_1__["BirimlerEffect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SorularEffect", function() { return _sorular_effects__WEBPACK_IMPORTED_MODULE_0__["SorularEffect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GerekliListelerEffect", function() { return _gerekli_listeler_effects__WEBPACK_IMPORTED_MODULE_2__["GerekliListelerEffect"]; });




var effects = [
    _sorular_effects__WEBPACK_IMPORTED_MODULE_0__["SorularEffect"],
    _birimler_effects__WEBPACK_IMPORTED_MODULE_1__["BirimlerEffect"],
    _gerekli_listeler_effects__WEBPACK_IMPORTED_MODULE_2__["GerekliListelerEffect"]
];





/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/effects/sorular-effects.service.ts":
/*!*****************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/effects/sorular-effects.service.ts ***!
  \*****************************************************************************************/
/*! exports provided: SorularEffectsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SorularEffectsService", function() { return SorularEffectsService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_Observable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/Observable */ "./node_modules/rxjs-compat/_esm5/Observable.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _store_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../../store/index */ "./src/app/store/index.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SorularEffectsService = /** @class */ (function () {
    function SorularEffectsService(http, rootStore) {
        var _this = this;
        this.http = http;
        this.rootStore = rootStore;
        this.baseUrl = environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].apiUrl;
        this.sorularUrl = 'sorular';
        this.dersanlatanHocalarUrl = 'dersanlatanhocalar';
        this.soruTipleriUrl = 'sorutipleri';
        this.bilisselDuzeylerUrl = 'bilisselduzeyler';
        rootStore.select(_store_index__WEBPACK_IMPORTED_MODULE_4__["getAuthState"]).subscribe(function (authState) { return _this.kb = authState.kullaniciBilgi; });
    }
    SorularEffectsService.prototype.getKullanicininAnlattigiDersler = function () {
        var adres = this.baseUrl + "/" + this.dersanlatanHocalarUrl + "/kullanicininanlattigiderslervekonular/";
        return this.http.get(adres);
    };
    SorularEffectsService.prototype.getBilisselDuzeyler = function () {
        var adres = this.baseUrl + "/" + this.bilisselDuzeylerUrl + "/";
        return this.http.get(adres);
    };
    SorularEffectsService.prototype.getKullanicininSorulari = function (handle) {
        var adres = this.baseUrl + "/" + this.sorularUrl + "/kullanicininsorulari/";
        return this.http.get(adres + this.createQuery(handle));
    };
    SorularEffectsService.prototype.updateSoru = function (soru) {
        var kaydedilecekSoru = Object.assign({}, soru, { personelNo: this.kb.personelNo });
        delete kaydedilecekSoru['gecerlilik'];
        if (soru && soru['soruId']) {
            return this.soruDegisiklikKaydet(kaydedilecekSoru);
        }
        else {
            return this.yeniSoruEkle(kaydedilecekSoru);
        }
    };
    SorularEffectsService.prototype.yeniSoruEkle = function (yeni) {
        var adres = this.baseUrl + "/" + this.sorularUrl + "/";
        return this.http.post(adres, yeni);
    };
    SorularEffectsService.prototype.soruDegisiklikKaydet = function (degisecekSoru) {
        var adres = this.baseUrl + "/" + this.sorularUrl + "/";
        return this.http.put(adres, degisecekSoru);
    };
    SorularEffectsService.prototype.soruAcKapaDegistir = function (bilgi) {
        var adres = this.baseUrl + "/" + this.sorularUrl + "/kismen";
        return this.http.put(adres, bilgi);
    };
    SorularEffectsService.prototype.soruFavoriDegistir = function (bilgi) {
        var adres = this.baseUrl + "/" + this.sorularUrl + "/kismen";
        return this.http.put(adres, bilgi);
    };
    SorularEffectsService.prototype.soruSilindiOlarakIsaretle = function (soruNo) {
        var adres = this.baseUrl + "/" + this.sorularUrl + "/" + soruNo;
        return this.http.delete(adres);
    };
    SorularEffectsService.prototype.getSoruTipleri = function () {
        var adres = this.baseUrl + "/" + this.soruTipleriUrl + "/";
        return this.http.get(adres);
    };
    SorularEffectsService.prototype.getSoruZorluklari = function () {
        var adres = this.baseUrl + "/soruzorluklari/";
        return this.http.get(adres);
    };
    SorularEffectsService.prototype.createQuery = function (handle) {
        var str = '?';
        handle.forEach(function (h) {
            str = str + (h.id + "=" + h.value + "&");
        });
        return str.substr(0, str.length - 1);
    };
    SorularEffectsService.prototype.soruHandleYarat = function (routerState) {
        var handle = [];
        var routeParams = rxjs_Observable__WEBPACK_IMPORTED_MODULE_1__["Observable"].of('programNo', 'donemNo', 'dersNo', 'konuNo', 'soruId');
        routeParams.subscribe(function (param) {
            if (routerState.params[param]) {
                handle.push({
                    id: param,
                    value: routerState.params[param]
                });
            }
        });
        return handle;
    };
    SorularEffectsService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_5__["Store"]])
    ], SorularEffectsService);
    return SorularEffectsService;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/effects/sorular.effects.ts":
/*!*********************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/effects/sorular.effects.ts ***!
  \*********************************************************************************/
/*! exports provided: SorularEffect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SorularEffect", function() { return SorularEffect; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs_Observable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/Observable */ "./node_modules/rxjs-compat/_esm5/Observable.js");
/* harmony import */ var rxjs_observable_of__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/observable/of */ "./node_modules/rxjs-compat/_esm5/observable/of.js");
/* harmony import */ var rxjs_add_observable_of__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/add/observable/of */ "./node_modules/rxjs-compat/_esm5/add/observable/of.js");
/* harmony import */ var rxjs_add_operator_catch__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/add/operator/catch */ "./node_modules/rxjs-compat/_esm5/add/operator/catch.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../actions/sorular.actions */ "./src/app/main/content/apps/sorular/soru-store/actions/sorular.actions.ts");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../selectors */ "./src/app/main/content/apps/sorular/soru-store/selectors/index.ts");
/* harmony import */ var _core_services_sb_mesaj_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../../core/services/sb-mesaj.service */ "./src/app/core/services/sb-mesaj.service.ts");
/* harmony import */ var _store_index__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../../store/index */ "./src/app/store/index.ts");
/* harmony import */ var _sorular_effects_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./sorular-effects.service */ "./src/app/main/content/apps/sorular/soru-store/effects/sorular-effects.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






// import 'rxjs/add/operator/map';







var SorularEffect = /** @class */ (function () {
    function SorularEffect(actions, service, store, mesajService) {
        var _this = this;
        this.actions = actions;
        this.service = service;
        this.store = store;
        this.mesajService = mesajService;
        // @Effect({dispatch: false})
        this.getSorular = this.actions
            .ofType(_actions_sorular_actions__WEBPACK_IMPORTED_MODULE_8__["GET_SORULAR"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["exhaustMap"])(function (action) {
            var handle = _this.service.soruHandleYarat(_this.routerState);
            if (_this.aktifBirim !== null && _this.aktifBirim.programlari && _this.aktifBirim.programlari.length > 0) {
                handle.push({ id: 'birimNo', value: _this.aktifBirim.birimId });
                _this.store.dispatch(new _store_index__WEBPACK_IMPORTED_MODULE_11__["StartLoading"]());
                return _this.service.getKullanicininSorulari(handle)
                    .map(function (sorular) {
                    _this.store.dispatch(new _store_index__WEBPACK_IMPORTED_MODULE_11__["StopLoading"]());
                    _this.mesajService.goster('Soru listesi alındı.');
                    return new _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_8__["GetSorularTamam"]({
                        loaded: handle,
                        sorular: sorular
                    });
                })
                    .catch(function (err) { return Object(rxjs_observable_of__WEBPACK_IMPORTED_MODULE_4__["of"])(new _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_8__["GetSorularBasarisiz"](err)); });
            }
            else {
                return Object(rxjs_observable_of__WEBPACK_IMPORTED_MODULE_4__["of"])(new _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_8__["GetSorularBasarisiz"]('Birim seçilmemiş'));
            }
        }));
        this.setAktifSoru = this.actions
            .ofType(_actions_sorular_actions__WEBPACK_IMPORTED_MODULE_8__["SET_AKTIF_SORU"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["withLatestFrom"])(this.store.select(_selectors__WEBPACK_IMPORTED_MODULE_9__["getSorularState"])), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["map"])(function (_a) {
            var action = _a[0], state = _a[1];
            return new _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_8__["SetAktifSoruSuccess"](state.entities[action.payload]);
        }));
        this.updateSoru = this.actions
            .ofType(_actions_sorular_actions__WEBPACK_IMPORTED_MODULE_8__["UPDATE_SORU"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["exhaustMap"])(function (action) {
            _this.store.dispatch(new _store_index__WEBPACK_IMPORTED_MODULE_11__["StartLoading"]());
            return _this.service.updateSoru(action.payload)
                .map(function (sonuc) {
                _this.store.dispatch(new _store_index__WEBPACK_IMPORTED_MODULE_11__["StopLoading"]());
                if (sonuc.basarili) {
                    _this.mesajService.goster('Soru kaydedildi.');
                    return new _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_8__["UpdateSoruTamam"](sonuc.donenNesne);
                }
                else {
                    _this.mesajService.hatalar(sonuc.hatalar);
                }
            }).catch(function (err) { return Object(rxjs_observable_of__WEBPACK_IMPORTED_MODULE_4__["of"])(new _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_8__["GetSorularBasarisiz"](err)); });
        }));
        this.soruAcKapa = this.actions
            .ofType(_actions_sorular_actions__WEBPACK_IMPORTED_MODULE_8__["SORU_AC_KAPA"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["exhaustMap"])(function (action) {
            _this.store.dispatch(new _store_index__WEBPACK_IMPORTED_MODULE_11__["StartLoading"]());
            return _this.service.soruAcKapaDegistir(action.payload)
                .map(function (sonuc) {
                _this.store.dispatch(new _store_index__WEBPACK_IMPORTED_MODULE_11__["StopLoading"]());
                if (sonuc.basarili) {
                    _this.mesajService.goster('İşlem başarılı');
                    return new _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_8__["UpdateSoruTamam"](sonuc.donenNesne);
                }
                else {
                    _this.mesajService.hatalar(sonuc.hatalar);
                }
            });
        }));
        this.soruFavoriDegistir = this.actions
            .ofType(_actions_sorular_actions__WEBPACK_IMPORTED_MODULE_8__["SORU_FAVORI_DEGISTIR"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["exhaustMap"])(function (action) {
            _this.store.dispatch(new _store_index__WEBPACK_IMPORTED_MODULE_11__["StartLoading"]());
            return _this.service.soruFavoriDegistir(action.payload)
                .map(function (sonuc) {
                _this.store.dispatch(new _store_index__WEBPACK_IMPORTED_MODULE_11__["StopLoading"]());
                if (sonuc.basarili) {
                    _this.mesajService.goster('İşlem başarılı');
                    return new _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_8__["UpdateSoruTamam"](sonuc.donenNesne);
                }
                else {
                    _this.mesajService.hatalar(sonuc.hatalar);
                }
            });
        }));
        this.soruyuSilindiOlarakIsaretle = this.actions
            .ofType(_actions_sorular_actions__WEBPACK_IMPORTED_MODULE_8__["SORU_SIL"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["exhaustMap"])(function (action) {
            _this.store.dispatch(new _store_index__WEBPACK_IMPORTED_MODULE_11__["StartLoading"]());
            return _this.service.soruSilindiOlarakIsaretle(action.payload)
                .map(function (sonuc) {
                _this.store.dispatch(new _store_index__WEBPACK_IMPORTED_MODULE_11__["StopLoading"]());
                if (sonuc.basarili) {
                    _this.mesajService.goster('İşlem başarılı');
                    return new _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_8__["SoruSilindi"](action.payload);
                }
                else {
                    _this.mesajService.hatalar(sonuc.hatalar);
                }
            });
        }));
        this.updateSorularTamam = this.actions
            .ofType(_actions_sorular_actions__WEBPACK_IMPORTED_MODULE_8__["UPDATE_SORULAR_TAMAM"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["mergeMap"])(function () {
            return [
                new _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_8__["DeselectSorularTumu"](),
                new _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_8__["GetSorular"]()
            ];
        }));
        this.store.select(_store_index__WEBPACK_IMPORTED_MODULE_11__["getRouterState"]).subscribe(function (routerState) {
            if (routerState) {
                _this.routerState = routerState.state;
            }
        });
        this.store.select(_selectors__WEBPACK_IMPORTED_MODULE_9__["getAktifBirim"]).subscribe(function (birim) { return _this.aktifBirim = birim; });
    }
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])(),
        __metadata("design:type", rxjs_Observable__WEBPACK_IMPORTED_MODULE_3__["Observable"])
    ], SorularEffect.prototype, "getSorular", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])(),
        __metadata("design:type", rxjs_Observable__WEBPACK_IMPORTED_MODULE_3__["Observable"])
    ], SorularEffect.prototype, "setAktifSoru", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])(),
        __metadata("design:type", rxjs_Observable__WEBPACK_IMPORTED_MODULE_3__["Observable"])
    ], SorularEffect.prototype, "updateSoru", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])(),
        __metadata("design:type", rxjs_Observable__WEBPACK_IMPORTED_MODULE_3__["Observable"])
    ], SorularEffect.prototype, "soruAcKapa", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])(),
        __metadata("design:type", rxjs_Observable__WEBPACK_IMPORTED_MODULE_3__["Observable"])
    ], SorularEffect.prototype, "soruFavoriDegistir", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])(),
        __metadata("design:type", rxjs_Observable__WEBPACK_IMPORTED_MODULE_3__["Observable"])
    ], SorularEffect.prototype, "soruyuSilindiOlarakIsaretle", void 0);
    __decorate([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Effect"])(),
        __metadata("design:type", rxjs_Observable__WEBPACK_IMPORTED_MODULE_3__["Observable"])
    ], SorularEffect.prototype, "updateSorularTamam", void 0);
    SorularEffect = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Actions"],
            _sorular_effects_service__WEBPACK_IMPORTED_MODULE_12__["SorularEffectsService"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"],
            _core_services_sb_mesaj_service__WEBPACK_IMPORTED_MODULE_10__["SbMesajService"]])
    ], SorularEffect);
    return SorularEffect;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/guards/sorular-resolve.guard.ts":
/*!**************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/guards/sorular-resolve.guard.ts ***!
  \**************************************************************************************/
/*! exports provided: SorularResolveGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SorularResolveGuard", function() { return SorularResolveGuard; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_observable_of__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/observable/of */ "./node_modules/rxjs-compat/_esm5/observable/of.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var rxjs_add_observable_forkJoin__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/add/observable/forkJoin */ "./node_modules/rxjs-compat/_esm5/add/observable/forkJoin.js");
/* harmony import */ var _helpers_soru_depo_veri_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers/soru-depo-veri.service */ "./src/app/main/content/apps/sorular/soru-store/helpers/soru-depo-veri.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var SorularResolveGuard = /** @class */ (function () {
    function SorularResolveGuard(helperService) {
        this.helperService = helperService;
    }
    SorularResolveGuard.prototype.canActivate = function (route, state) {
        return this.helperService.checkStore().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["switchMap"])(function () { return Object(rxjs_observable_of__WEBPACK_IMPORTED_MODULE_1__["of"])(true); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) {
            return Object(rxjs_observable_of__WEBPACK_IMPORTED_MODULE_1__["of"])(error === 1);
        }));
    };
    SorularResolveGuard = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_helpers_soru_depo_veri_service__WEBPACK_IMPORTED_MODULE_4__["SoruDepoVeriService"]])
    ], SorularResolveGuard);
    return SorularResolveGuard;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/helpers/soru-depo-veri.service.ts":
/*!****************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/helpers/soru-depo-veri.service.ts ***!
  \****************************************************************************************/
/*! exports provided: SoruDepoVeriService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruDepoVeriService", function() { return SoruDepoVeriService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs_Observable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/Observable */ "./node_modules/rxjs-compat/_esm5/Observable.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../index */ "./src/app/main/content/apps/sorular/soru-store/index.ts");
/* harmony import */ var _store_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../../store/index */ "./src/app/store/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SoruDepoVeriService = /** @class */ (function () {
    function SoruDepoVeriService(store) {
        var _this = this;
        this.store = store;
        this.store.select(_store_index__WEBPACK_IMPORTED_MODULE_5__["getRouterState"]).subscribe(function (routerState) {
            if (routerState) {
                _this.routerState = routerState.state;
            }
        });
    }
    SoruDepoVeriService.prototype.checkStore = function () {
        var _this = this;
        return rxjs_Observable__WEBPACK_IMPORTED_MODULE_2__["Observable"]
            .forkJoin(this.getBirimler(), this.getSoruTipleri(), this.getSoruBilisselDuzeyleri(), this.getSoruZorluklari())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])(function (_a) {
            var birimlerLoaded = _a[0], soruTipleriLoaded = _a[1], soruZorluklariLoaded = _a[2], bilisselDuzeylerLoaded = _a[3];
            return birimlerLoaded && soruTipleriLoaded && soruZorluklariLoaded && bilisselDuzeylerLoaded;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function () {
            return _this.getSorular();
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function () {
            _this.store.dispatch(new _index__WEBPACK_IMPORTED_MODULE_4__["SetAktifSoru"](_this.routerState.params.soruId));
        }));
    };
    SoruDepoVeriService.prototype.getBirimler = function () {
        var _this = this;
        return this.store.select(_index__WEBPACK_IMPORTED_MODULE_4__["getBirimlerLoaded"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(function (loaded) {
            if (!loaded) {
                _this.store.dispatch(new _index__WEBPACK_IMPORTED_MODULE_4__["GetBirimler"]([]));
            }
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])(function (loaded) { return loaded; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1));
    };
    SoruDepoVeriService.prototype.getSoruTipleri = function () {
        var _this = this;
        return this.store.select(_index__WEBPACK_IMPORTED_MODULE_4__["getSoruTipleriLoaded"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(function (loaded) {
            if (!loaded) {
                _this.store.dispatch(new _index__WEBPACK_IMPORTED_MODULE_4__["GetSoruTipleri"]());
            }
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])(function (loaded) { return loaded; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1));
    };
    SoruDepoVeriService.prototype.getSoruZorluklari = function () {
        var _this = this;
        return this.store.select(_index__WEBPACK_IMPORTED_MODULE_4__["getSoruZorluklariLoaded"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(function (loaded) {
            if (!loaded) {
                _this.store.dispatch(new _index__WEBPACK_IMPORTED_MODULE_4__["GetSoruZorluklari"]());
            }
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])(function (loaded) { return loaded; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1));
    };
    SoruDepoVeriService.prototype.getSoruBilisselDuzeyleri = function () {
        var _this = this;
        return this.store.select(_index__WEBPACK_IMPORTED_MODULE_4__["getBilisselDuzeylerLoaded"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(function (loaded) {
            if (!loaded) {
                _this.store.dispatch(new _index__WEBPACK_IMPORTED_MODULE_4__["GetBilisselDuzeyler"]());
            }
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])(function (loaded) { return loaded; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1));
    };
    SoruDepoVeriService.prototype.getSorular = function () {
        var _this = this;
        return this.store.select(_index__WEBPACK_IMPORTED_MODULE_4__["getSorularLoaded"])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(function (loaded) {
            if (!_this.routerState.params[loaded.id] || _this.routerState.params[loaded.id] !== loaded.value) {
                _this.store.dispatch(new _index__WEBPACK_IMPORTED_MODULE_4__["GetSorular"]());
                _this.store.dispatch(new _index__WEBPACK_IMPORTED_MODULE_4__["SetSorularAramaCumlesi"](''));
                _this.store.dispatch(new _index__WEBPACK_IMPORTED_MODULE_4__["DeselectSorularTumu"]());
            }
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])(function (loaded) {
            return !_this.routerState.params[loaded.id] || _this.routerState.params[loaded.id] !== loaded.value;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1));
    };
    SoruDepoVeriService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"]])
    ], SoruDepoVeriService);
    return SoruDepoVeriService;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/index.ts":
/*!***************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/index.ts ***!
  \***************************************************************/
/*! exports provided: getSoruDepoAppState, getAppState, reducers, effects, BIRIMLER_SIFIRLA, GET_BIRIMLER, GET_BIRIMLER_SUCCESS, GET_BIRIMLER_FAILED, GET_DERSLER, GET_DERSLER_SUCCESS, SEC_AKTIF_BIRIM, SEC_AKTIF_DERS, SEC_AKTIF_KONU, KONTROL_ET_AKTIF_BIRIM, BIRIM_ILKINI_SEC, BirimleriSifirla, GetBirimler, GetBirimlerSuccess, GetDersler, GetDerslerSuccess, GetBirimlerFailed, SecAktifBirim, SecAktifDers, SecAktifKonu, KontrolEtAktifBirim, IlkBirimiSec, GET_SORULAR, GET_SORULAR_TAMAM, GET_SORULAR_BASARISIZ, SET_SORULAR_ARAMA_CUMLESI, UPDATE_SORU, UPDATE_SORU_TAMAM, SORU_AC_KAPA, SORU_FAVORI_DEGISTIR, UPDATE_SORULAR, UPDATE_SORULAR_TAMAM, SORU_SIL, SORU_SIL_TAMAM, SET_AKTIF_SORU, SET_AKTIF_SORU_SUCCESS, SELECT_SORULAR_TUMU, SORU_SECIMI_DEGISTIR, SORULAR_SIFIRLA, SELECT_SORULAR_PARAMETREYE_GORE, DESELECT_SORULAR_TUMU, SorulariSifirla, GetSorular, GetSorularTamam, GetSorularBasarisiz, SetAktifSoru, SetAktifSoruSuccess, SetSorularAramaCumlesi, SelectSorularTumu, SelectSorularParametreyeGore, DeselectSorularTumu, UpdateSoru, SoruAcKapa, SoruFavoriDegistir, UpdateSoruTamam, UpdateSorular, SoruSilindiIsaretle, SoruSilindi, UpdateSorularTamam, SoruSecimiDegistir, GET_BILISSEL_DUZEYLER, GET_BILISSEL_DUZEYLER_TAMAM, GET_BILISSEL_DUZEYLER_HATA, GET_SORU_TIPLERI, GET_SORU_TIPLERI_TAMAM, GET_SORU_TIPLERI_HATA, GET_SORU_ZORLUKLARI, GET_SORU_ZORLUKLARI_TAMAM, GET_SORU_ZORLUKLARI_HATA, GetBilisselDuzeyler, GetBilisselDuzeylerTamam, GetBilisselDuzeylerHata, GetSoruTipleri, GetSoruTipleriTamam, GetSoruTipleriHata, GetSoruZorluklari, GetSoruZorluklariTamam, GetSoruZorluklariHata, BirimInitialState, BirimlerReducer, SorularInitialState, SorularReducer, SoruGerekliListelerInitialState, SoruGerekliListelerReducer, getBirimlerState, getBirimler, getAktifBirim, getAktifDers, getAktifKonu, getBirimlerLoaded, getBirimlerArr, getDersler, getSorularState, getSorular, getSorularLoaded, getSorularLoading, getSorularAramaCumlesi, getSorularArr, getCurrentSoru, getSelectedSoruNumaralari, getSorulardaHataVar, getGerekliListelerState, getBilisselDuzeyler, getSoruTipleri, getSoruZorluklari, getSoruTipleriLoaded, getSoruZorluklariLoaded, getBilisselDuzeylerLoaded, BirimlerEffect, SorularEffect, GerekliListelerEffect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions */ "./src/app/main/content/apps/sorular/soru-store/actions/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BIRIMLER_SIFIRLA", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["BIRIMLER_SIFIRLA"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_BIRIMLER", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_BIRIMLER"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_BIRIMLER_SUCCESS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_BIRIMLER_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_BIRIMLER_FAILED", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_BIRIMLER_FAILED"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_DERSLER", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_DERSLER"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_DERSLER_SUCCESS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_DERSLER_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SEC_AKTIF_BIRIM", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SEC_AKTIF_BIRIM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SEC_AKTIF_DERS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SEC_AKTIF_DERS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SEC_AKTIF_KONU", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SEC_AKTIF_KONU"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "KONTROL_ET_AKTIF_BIRIM", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["KONTROL_ET_AKTIF_BIRIM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BIRIM_ILKINI_SEC", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["BIRIM_ILKINI_SEC"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BirimleriSifirla", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["BirimleriSifirla"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetBirimler", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetBirimler"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetBirimlerSuccess", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetBirimlerSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetDersler", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetDersler"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetDerslerSuccess", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetDerslerSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetBirimlerFailed", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetBirimlerFailed"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SecAktifBirim", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SecAktifBirim"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SecAktifDers", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SecAktifDers"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SecAktifKonu", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SecAktifKonu"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "KontrolEtAktifBirim", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["KontrolEtAktifBirim"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IlkBirimiSec", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["IlkBirimiSec"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_SORULAR", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_SORULAR"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_SORULAR_TAMAM", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_SORULAR_TAMAM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_SORULAR_BASARISIZ", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_SORULAR_BASARISIZ"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SET_SORULAR_ARAMA_CUMLESI", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SET_SORULAR_ARAMA_CUMLESI"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UPDATE_SORU", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["UPDATE_SORU"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UPDATE_SORU_TAMAM", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["UPDATE_SORU_TAMAM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SORU_AC_KAPA", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SORU_AC_KAPA"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SORU_FAVORI_DEGISTIR", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SORU_FAVORI_DEGISTIR"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UPDATE_SORULAR", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["UPDATE_SORULAR"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UPDATE_SORULAR_TAMAM", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["UPDATE_SORULAR_TAMAM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SORU_SIL", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SORU_SIL"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SORU_SIL_TAMAM", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SORU_SIL_TAMAM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SET_AKTIF_SORU", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SET_AKTIF_SORU"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SET_AKTIF_SORU_SUCCESS", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SET_AKTIF_SORU_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SELECT_SORULAR_TUMU", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SELECT_SORULAR_TUMU"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SORU_SECIMI_DEGISTIR", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SORU_SECIMI_DEGISTIR"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SORULAR_SIFIRLA", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SORULAR_SIFIRLA"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SELECT_SORULAR_PARAMETREYE_GORE", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SELECT_SORULAR_PARAMETREYE_GORE"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DESELECT_SORULAR_TUMU", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["DESELECT_SORULAR_TUMU"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SorulariSifirla", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SorulariSifirla"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetSorular", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetSorular"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetSorularTamam", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetSorularTamam"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetSorularBasarisiz", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetSorularBasarisiz"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SetAktifSoru", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SetAktifSoru"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SetAktifSoruSuccess", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SetAktifSoruSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SetSorularAramaCumlesi", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SetSorularAramaCumlesi"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SelectSorularTumu", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SelectSorularTumu"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SelectSorularParametreyeGore", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SelectSorularParametreyeGore"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DeselectSorularTumu", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["DeselectSorularTumu"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UpdateSoru", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["UpdateSoru"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SoruAcKapa", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SoruAcKapa"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SoruFavoriDegistir", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SoruFavoriDegistir"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UpdateSoruTamam", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["UpdateSoruTamam"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UpdateSorular", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["UpdateSorular"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SoruSilindiIsaretle", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SoruSilindiIsaretle"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SoruSilindi", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SoruSilindi"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UpdateSorularTamam", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["UpdateSorularTamam"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SoruSecimiDegistir", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["SoruSecimiDegistir"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_BILISSEL_DUZEYLER", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_BILISSEL_DUZEYLER"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_BILISSEL_DUZEYLER_TAMAM", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_BILISSEL_DUZEYLER_TAMAM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_BILISSEL_DUZEYLER_HATA", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_BILISSEL_DUZEYLER_HATA"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_SORU_TIPLERI", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_SORU_TIPLERI"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_SORU_TIPLERI_TAMAM", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_SORU_TIPLERI_TAMAM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_SORU_TIPLERI_HATA", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_SORU_TIPLERI_HATA"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_SORU_ZORLUKLARI", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_SORU_ZORLUKLARI"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_SORU_ZORLUKLARI_TAMAM", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_SORU_ZORLUKLARI_TAMAM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GET_SORU_ZORLUKLARI_HATA", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GET_SORU_ZORLUKLARI_HATA"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetBilisselDuzeyler", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetBilisselDuzeyler"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetBilisselDuzeylerTamam", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetBilisselDuzeylerTamam"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetBilisselDuzeylerHata", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetBilisselDuzeylerHata"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetSoruTipleri", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetSoruTipleri"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetSoruTipleriTamam", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetSoruTipleriTamam"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetSoruTipleriHata", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetSoruTipleriHata"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetSoruZorluklari", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetSoruZorluklari"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetSoruZorluklariTamam", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetSoruZorluklariTamam"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GetSoruZorluklariHata", function() { return _actions__WEBPACK_IMPORTED_MODULE_0__["GetSoruZorluklariHata"]; });

/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reducers */ "./src/app/main/content/apps/sorular/soru-store/reducers/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSoruDepoAppState", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["getSoruDepoAppState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getAppState", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["getAppState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "reducers", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["reducers"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BirimInitialState", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["BirimInitialState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BirimlerReducer", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["BirimlerReducer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SorularInitialState", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["SorularInitialState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SorularReducer", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["SorularReducer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SoruGerekliListelerInitialState", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["SoruGerekliListelerInitialState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SoruGerekliListelerReducer", function() { return _reducers__WEBPACK_IMPORTED_MODULE_1__["SoruGerekliListelerReducer"]; });

/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selectors */ "./src/app/main/content/apps/sorular/soru-store/selectors/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getBirimlerState", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getBirimlerState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getBirimler", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getBirimler"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getAktifBirim", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getAktifBirim"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getAktifDers", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getAktifDers"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getAktifKonu", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getAktifKonu"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getBirimlerLoaded", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getBirimlerLoaded"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getBirimlerArr", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getBirimlerArr"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getDersler", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getDersler"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSorularState", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getSorularState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSorular", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getSorular"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSorularLoaded", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getSorularLoaded"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSorularLoading", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getSorularLoading"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSorularAramaCumlesi", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getSorularAramaCumlesi"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSorularArr", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getSorularArr"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getCurrentSoru", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getCurrentSoru"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSelectedSoruNumaralari", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getSelectedSoruNumaralari"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSorulardaHataVar", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getSorulardaHataVar"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getGerekliListelerState", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getGerekliListelerState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getBilisselDuzeyler", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getBilisselDuzeyler"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSoruTipleri", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getSoruTipleri"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSoruZorluklari", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getSoruZorluklari"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSoruTipleriLoaded", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getSoruTipleriLoaded"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSoruZorluklariLoaded", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getSoruZorluklariLoaded"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getBilisselDuzeylerLoaded", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getBilisselDuzeylerLoaded"]; });

/* harmony import */ var _effects__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./effects */ "./src/app/main/content/apps/sorular/soru-store/effects/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "effects", function() { return _effects__WEBPACK_IMPORTED_MODULE_3__["effects"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BirimlerEffect", function() { return _effects__WEBPACK_IMPORTED_MODULE_3__["BirimlerEffect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SorularEffect", function() { return _effects__WEBPACK_IMPORTED_MODULE_3__["SorularEffect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GerekliListelerEffect", function() { return _effects__WEBPACK_IMPORTED_MODULE_3__["GerekliListelerEffect"]; });







/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/reducers/birim.reducer.ts":
/*!********************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/reducers/birim.reducer.ts ***!
  \********************************************************************************/
/*! exports provided: BirimInitialState, BirimlerReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BirimInitialState", function() { return BirimInitialState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BirimlerReducer", function() { return BirimlerReducer; });
/* harmony import */ var _actions_birimler_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/birimler.actions */ "./src/app/main/content/apps/sorular/soru-store/actions/birimler.actions.ts");
/* harmony import */ var tassign__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tassign */ "./node_modules/tassign/lib/index.js");
/* harmony import */ var tassign__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tassign__WEBPACK_IMPORTED_MODULE_1__);
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};


var BirimInitialState = {
    entities: {},
    dersler: [],
    aktifBirim: null,
    aktifDers: null,
    aktifKonu: null,
    loading: false,
    loaded: false
};
function BirimlerReducer(state, action) {
    if (state === void 0) { state = BirimInitialState; }
    switch (action.type) {
        case _actions_birimler_actions__WEBPACK_IMPORTED_MODULE_0__["BIRIMLER_SIFIRLA"]: {
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(BirimInitialState);
        }
        case _actions_birimler_actions__WEBPACK_IMPORTED_MODULE_0__["GET_BIRIMLER"]: {
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, {
                loading: true,
                loaded: false
            });
        }
        case _actions_birimler_actions__WEBPACK_IMPORTED_MODULE_0__["GET_BIRIMLER_SUCCESS"]: {
            var birimler = action.payload;
            var entities = birimler.reduce(function (_entities, soruBirim) {
                return __assign({}, _entities, (_a = {}, _a[soruBirim.birimId] = soruBirim, _a));
                var _a;
            }, {});
            return __assign({}, state, { loading: false, loaded: true, entities: entities });
        }
        case _actions_birimler_actions__WEBPACK_IMPORTED_MODULE_0__["GET_DERSLER"]: {
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, { dersler: state.dersler });
        }
        case _actions_birimler_actions__WEBPACK_IMPORTED_MODULE_0__["GET_DERSLER_SUCCESS"]: {
            var dersler_1 = [];
            if (state.dersler) {
                Object.assign(dersler_1, [], state.dersler);
            }
            action.payload.forEach(function (ders) {
                if (dersler_1.indexOf(ders) < 0) {
                    dersler_1.push(ders);
                }
            });
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, { dersler: dersler_1 });
        }
        case _actions_birimler_actions__WEBPACK_IMPORTED_MODULE_0__["GET_BIRIMLER_FAILED"]: {
            return __assign({}, state, { loading: false, loaded: false });
        }
        case _actions_birimler_actions__WEBPACK_IMPORTED_MODULE_0__["SEC_AKTIF_BIRIM"]: {
            var gelen = action.payload;
            var ders = null;
            if (gelen != null && gelen.programlari.length > 0 && gelen.programlari[0].donemleri.length > 0) {
                if (gelen.programlari[0].donemleri[0].dersGruplari.length > 0) {
                    ders = gelen.programlari[0].donemleri[0].dersGruplari[0].dersleri[0];
                }
            }
            if (ders != null && ders.dersId > 0) {
                return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, { aktifBirim: gelen, aktifDers: ders });
            }
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, { aktifBirim: gelen, aktifDers: null, aktifKonu: null });
        }
        case _actions_birimler_actions__WEBPACK_IMPORTED_MODULE_0__["SEC_AKTIF_DERS"]: {
            var gelen = action.payload;
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, { aktifDers: gelen });
        }
        case _actions_birimler_actions__WEBPACK_IMPORTED_MODULE_0__["SEC_AKTIF_KONU"]: {
            var gelen = action.payload;
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, { aktifDers: gelen.ders, aktifKonu: gelen.konu });
        }
        case _actions_birimler_actions__WEBPACK_IMPORTED_MODULE_0__["KONTROL_ET_AKTIF_BIRIM"]: {
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state);
        }
        case _actions_birimler_actions__WEBPACK_IMPORTED_MODULE_0__["BIRIM_ILKINI_SEC"]: {
            var birimler = Object.keys(state.entities).map(function (birimId) { return state.entities[birimId]; });
            var birim = null;
            if (birimler != null && birimler.length > 0) {
                birim = birimler[0];
            }
            var ders = null;
            if (birim != null && birim.programlari.length > 0 && birim.programlari[0].donemleri.length > 0) {
                if (birim.programlari[0].donemleri[0].dersGruplari.length > 0) {
                    ders = birim.programlari[0].donemleri[0].dersGruplari[0].dersleri[0];
                }
            }
            var konu = null;
            if (ders != null && ders.konulari.length > 0) {
                konu = ders.konulari[0];
            }
            if (action.payload === false) {
                return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, { aktifBirim: birim, aktifDers: null, aktifKonu: null });
            }
            else {
                return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, { aktifBirim: birim, aktifDers: ders, aktifKonu: konu });
            }
        }
        default:
            return state;
    }
}


/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/reducers/gerekli-listeler.reducers.ts":
/*!********************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/reducers/gerekli-listeler.reducers.ts ***!
  \********************************************************************************************/
/*! exports provided: SoruGerekliListelerInitialState, SoruGerekliListelerReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruGerekliListelerInitialState", function() { return SoruGerekliListelerInitialState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruGerekliListelerReducer", function() { return SoruGerekliListelerReducer; });
/* harmony import */ var _actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/gerekli-listeler.actions */ "./src/app/main/content/apps/sorular/soru-store/actions/gerekli-listeler.actions.ts");
/* harmony import */ var tassign__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tassign */ "./node_modules/tassign/lib/index.js");
/* harmony import */ var tassign__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tassign__WEBPACK_IMPORTED_MODULE_1__);


var SoruGerekliListelerInitialState = {
    bilisselDuzeyler: [],
    soruTipleri: [],
    soruZorluklari: [],
    loading: false,
    soruTipleriLoaded: false,
    soruZorluklariLoaded: false,
    bilisselDuzeylerLoaded: false
};
function SoruGerekliListelerReducer(state, action) {
    if (state === void 0) { state = SoruGerekliListelerInitialState; }
    switch (action.type) {
        case _actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_0__["GET_BILISSEL_DUZEYLER"]: {
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, {
                loading: true,
                bilisselDuzeylerLoaded: false
            });
        }
        case _actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_0__["GET_BILISSEL_DUZEYLER_TAMAM"]: {
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, {
                bilisselDuzeyler: action.payload,
                loading: false,
                bilisselDuzeylerLoaded: true
            });
        }
        case _actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_0__["GET_BILISSEL_DUZEYLER_HATA"]: {
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, {
                loading: false,
                bilisselDuzeylerLoaded: false
            });
        }
        case _actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_0__["GET_SORU_TIPLERI"]: {
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, {
                loading: true,
                soruTipleriLoaded: false
            });
        }
        case _actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_0__["GET_SORU_TIPLERI_TAMAM"]: {
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, {
                soruTipleri: action.payload,
                loading: false,
                soruTipleriLoaded: true
            });
        }
        case _actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_0__["GET_SORU_TIPLERI_HATA"]: {
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, {
                loading: false,
                soruTipleriLoaded: false
            });
        }
        case _actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_0__["GET_SORU_ZORLUKLARI"]: {
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, {
                loading: true,
                soruZorluklariLoaded: false
            });
        }
        case _actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_0__["GET_SORU_ZORLUKLARI_TAMAM"]: {
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, {
                soruZorluklari: action.payload,
                loading: false,
                soruZorluklariLoaded: true
            });
        }
        case _actions_gerekli_listeler_actions__WEBPACK_IMPORTED_MODULE_0__["GET_SORU_ZORLUKLARI_HATA"]: {
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, {
                loading: false,
                soruZorluklariLoaded: false
            });
        }
        default: return state;
    }
}


/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/reducers/index.ts":
/*!************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/reducers/index.ts ***!
  \************************************************************************/
/*! exports provided: getSoruDepoAppState, getAppState, reducers, BirimInitialState, BirimlerReducer, SorularInitialState, SorularReducer, SoruGerekliListelerInitialState, SoruGerekliListelerReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSoruDepoAppState", function() { return getSoruDepoAppState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAppState", function() { return getAppState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reducers", function() { return reducers; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _soru_reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./soru.reducer */ "./src/app/main/content/apps/sorular/soru-store/reducers/soru.reducer.ts");
/* harmony import */ var _birim_reducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./birim.reducer */ "./src/app/main/content/apps/sorular/soru-store/reducers/birim.reducer.ts");
/* harmony import */ var _gerekli_listeler_reducers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gerekli-listeler.reducers */ "./src/app/main/content/apps/sorular/soru-store/reducers/gerekli-listeler.reducers.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BirimInitialState", function() { return _birim_reducer__WEBPACK_IMPORTED_MODULE_2__["BirimInitialState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BirimlerReducer", function() { return _birim_reducer__WEBPACK_IMPORTED_MODULE_2__["BirimlerReducer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SorularInitialState", function() { return _soru_reducer__WEBPACK_IMPORTED_MODULE_1__["SorularInitialState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SorularReducer", function() { return _soru_reducer__WEBPACK_IMPORTED_MODULE_1__["SorularReducer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SoruGerekliListelerInitialState", function() { return _gerekli_listeler_reducers__WEBPACK_IMPORTED_MODULE_3__["SoruGerekliListelerInitialState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SoruGerekliListelerReducer", function() { return _gerekli_listeler_reducers__WEBPACK_IMPORTED_MODULE_3__["SoruGerekliListelerReducer"]; });





var getSoruDepoAppState = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createFeatureSelector"])('soru-depo-app');
var getAppState = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getSoruDepoAppState, function (state) { return state; });
var reducers = {
    birimler: _birim_reducer__WEBPACK_IMPORTED_MODULE_2__["BirimlerReducer"],
    sorular: _soru_reducer__WEBPACK_IMPORTED_MODULE_1__["SorularReducer"],
    gerekliListeler: _gerekli_listeler_reducers__WEBPACK_IMPORTED_MODULE_3__["SoruGerekliListelerReducer"]
};





/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/reducers/soru.reducer.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/reducers/soru.reducer.ts ***!
  \*******************************************************************************/
/*! exports provided: SorularInitialState, SorularReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SorularInitialState", function() { return SorularInitialState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SorularReducer", function() { return SorularReducer; });
/* harmony import */ var _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/sorular.actions */ "./src/app/main/content/apps/sorular/soru-store/actions/sorular.actions.ts");
/* harmony import */ var tassign__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tassign */ "./node_modules/tassign/lib/index.js");
/* harmony import */ var tassign__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tassign__WEBPACK_IMPORTED_MODULE_1__);
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};


var SorularInitialState = {
    entities: {},
    currentSoru: null,
    selectedSoruIds: [],
    searchText: '',
    loading: false,
    loaded: false,
    hataMesaji: null
};
function SorularReducer(state, action) {
    if (state === void 0) { state = SorularInitialState; }
    switch (action.type) {
        case _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_0__["SORULAR_SIFIRLA"]: {
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(SorularInitialState);
        }
        case _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_0__["GET_SORULAR"]: {
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, { loading: true });
        }
        case _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_0__["GET_SORULAR_TAMAM"]:
            {
                var sorular = action.payload.sorular.donenListe;
                var loaded = action.payload.loaded;
                var entities = sorular.reduce(function (_entities, soru) {
                    return __assign({}, _entities, (_a = {}, _a[soru.soruId] = soru, _a));
                    var _a;
                }, {});
                return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, {
                    entities: entities,
                    loading: false,
                    loaded: loaded
                });
            }
        case _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_0__["GET_SORULAR_BASARISIZ"]:
            {
                return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, {
                    entities: {},
                    loading: false,
                    loaded: false,
                    hataMesaji: action.payload
                });
            }
        case _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_0__["SET_AKTIF_SORU_SUCCESS"]:
            {
                return __assign({}, state, { currentSoru: action.payload });
            }
        case _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_0__["SET_SORULAR_ARAMA_CUMLESI"]:
            {
                return __assign({}, state, { searchText: action.payload });
            }
        case _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_0__["SELECT_SORULAR_TUMU"]:
            {
                var arr = Object.keys(state.entities).map(function (k) { return state.entities[k]; });
                var tumSorular = arr.map(function (soru) { return soru.soruId; });
                return __assign({}, state, { selectedSoruIds: tumSorular });
            }
        case _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_0__["DESELECT_SORULAR_TUMU"]:
            {
                return __assign({}, state, { selectedSoruIds: [] });
            }
        case _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_0__["UPDATE_SORU_TAMAM"]: {
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, {
                entities: Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state.entities, (_a = {},
                    _a[action.payload.soruId] = action.payload,
                    _a)),
                selectedSoruIds: [],
                currentSoru: action.payload
            });
        }
        case _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_0__["SORU_SIL_TAMAM"]: {
            var soruId_1 = action.payload;
            var arr = Object.keys(state.entities).map(function (k) { return state.entities[k]; });
            var loaded = arr.filter(function (s) { return s.soruId !== soruId_1; });
            var entities = loaded.reduce(function (_entities, soru) {
                return __assign({}, _entities, (_a = {}, _a[soru.soruId] = soru, _a));
                var _a;
            }, {});
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, {
                entities: entities,
                loading: false,
                loaded: loaded
            });
        }
        case _actions_sorular_actions__WEBPACK_IMPORTED_MODULE_0__["SORU_SECIMI_DEGISTIR"]: {
            var soruId_2 = action.payload;
            var selectedSorularinNumaralari = state.selectedSoruIds.slice();
            var sonuc = selectedSorularinNumaralari.find(function (id) { return id === soruId_2; });
            if (sonuc !== undefined) {
                selectedSorularinNumaralari = selectedSorularinNumaralari.filter(function (id) { return id !== soruId_2; });
            }
            else {
                selectedSorularinNumaralari = selectedSorularinNumaralari.concat([soruId_2]);
            }
            return Object(tassign__WEBPACK_IMPORTED_MODULE_1__["tassign"])(state, {
                selectedSoruIds: selectedSorularinNumaralari
            });
        }
        default:
            return state;
    }
    var _a;
}


/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/selectors/birimler.selectors.ts":
/*!**************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/selectors/birimler.selectors.ts ***!
  \**************************************************************************************/
/*! exports provided: getBirimlerState, getBirimler, getAktifBirim, getAktifDers, getAktifKonu, getBirimlerLoaded, getBirimlerArr, getDersler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBirimlerState", function() { return getBirimlerState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBirimler", function() { return getBirimler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAktifBirim", function() { return getAktifBirim; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAktifDers", function() { return getAktifDers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAktifKonu", function() { return getAktifKonu; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBirimlerLoaded", function() { return getBirimlerLoaded; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBirimlerArr", function() { return getBirimlerArr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDersler", function() { return getDersler; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reducers */ "./src/app/main/content/apps/sorular/soru-store/reducers/index.ts");


var getBirimlerState = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(_reducers__WEBPACK_IMPORTED_MODULE_1__["getSoruDepoAppState"], function (state) { return state.birimler; });
var getBirimler = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getBirimlerState, function (state) { return state.entities; });
var getAktifBirim = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getBirimlerState, function (state) { return state.aktifBirim; });
var getAktifDers = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getBirimlerState, function (state) { return state.aktifDers; });
var getAktifKonu = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getBirimlerState, function (state) { return state.aktifKonu; });
var getBirimlerLoaded = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getBirimlerState, function (state) { return state.loaded; });
var getBirimlerArr = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getBirimler, function (entities) { return Object.keys(entities).map(function (birimId) { return entities[birimId]; }); });
var getDersler = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getBirimlerState, function (state) { return state.dersler; });


/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/selectors/gerekli-listeler.selectors.ts":
/*!**********************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/selectors/gerekli-listeler.selectors.ts ***!
  \**********************************************************************************************/
/*! exports provided: getGerekliListelerState, getBilisselDuzeyler, getSoruTipleri, getSoruZorluklari, getSoruTipleriLoaded, getSoruZorluklariLoaded, getBilisselDuzeylerLoaded */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getGerekliListelerState", function() { return getGerekliListelerState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBilisselDuzeyler", function() { return getBilisselDuzeyler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSoruTipleri", function() { return getSoruTipleri; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSoruZorluklari", function() { return getSoruZorluklari; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSoruTipleriLoaded", function() { return getSoruTipleriLoaded; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSoruZorluklariLoaded", function() { return getSoruZorluklariLoaded; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBilisselDuzeylerLoaded", function() { return getBilisselDuzeylerLoaded; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reducers */ "./src/app/main/content/apps/sorular/soru-store/reducers/index.ts");


var getGerekliListelerState = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(_reducers__WEBPACK_IMPORTED_MODULE_1__["getSoruDepoAppState"], function (state) { return state.gerekliListeler; });
var getBilisselDuzeyler = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getGerekliListelerState, function (state) { return state.bilisselDuzeyler; });
var getSoruTipleri = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getGerekliListelerState, function (state) { return state.soruTipleri; });
var getSoruZorluklari = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getGerekliListelerState, function (state) { return state.soruZorluklari; });
var getSoruTipleriLoaded = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getGerekliListelerState, function (state) { return state.soruTipleriLoaded; });
var getSoruZorluklariLoaded = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getGerekliListelerState, function (state) { return state.soruZorluklariLoaded; });
var getBilisselDuzeylerLoaded = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getGerekliListelerState, function (state) { return state.bilisselDuzeylerLoaded; });


/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/selectors/index.ts":
/*!*************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/selectors/index.ts ***!
  \*************************************************************************/
/*! exports provided: getBirimlerState, getBirimler, getAktifBirim, getAktifDers, getAktifKonu, getBirimlerLoaded, getBirimlerArr, getDersler, getSorularState, getSorular, getSorularLoaded, getSorularLoading, getSorularAramaCumlesi, getSorularArr, getCurrentSoru, getSelectedSoruNumaralari, getSorulardaHataVar, getGerekliListelerState, getBilisselDuzeyler, getSoruTipleri, getSoruZorluklari, getSoruTipleriLoaded, getSoruZorluklariLoaded, getBilisselDuzeylerLoaded */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _birimler_selectors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./birimler.selectors */ "./src/app/main/content/apps/sorular/soru-store/selectors/birimler.selectors.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getBirimlerState", function() { return _birimler_selectors__WEBPACK_IMPORTED_MODULE_0__["getBirimlerState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getBirimler", function() { return _birimler_selectors__WEBPACK_IMPORTED_MODULE_0__["getBirimler"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getAktifBirim", function() { return _birimler_selectors__WEBPACK_IMPORTED_MODULE_0__["getAktifBirim"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getAktifDers", function() { return _birimler_selectors__WEBPACK_IMPORTED_MODULE_0__["getAktifDers"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getAktifKonu", function() { return _birimler_selectors__WEBPACK_IMPORTED_MODULE_0__["getAktifKonu"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getBirimlerLoaded", function() { return _birimler_selectors__WEBPACK_IMPORTED_MODULE_0__["getBirimlerLoaded"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getBirimlerArr", function() { return _birimler_selectors__WEBPACK_IMPORTED_MODULE_0__["getBirimlerArr"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getDersler", function() { return _birimler_selectors__WEBPACK_IMPORTED_MODULE_0__["getDersler"]; });

/* harmony import */ var _sorular_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sorular.selectors */ "./src/app/main/content/apps/sorular/soru-store/selectors/sorular.selectors.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSorularState", function() { return _sorular_selectors__WEBPACK_IMPORTED_MODULE_1__["getSorularState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSorular", function() { return _sorular_selectors__WEBPACK_IMPORTED_MODULE_1__["getSorular"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSorularLoaded", function() { return _sorular_selectors__WEBPACK_IMPORTED_MODULE_1__["getSorularLoaded"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSorularLoading", function() { return _sorular_selectors__WEBPACK_IMPORTED_MODULE_1__["getSorularLoading"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSorularAramaCumlesi", function() { return _sorular_selectors__WEBPACK_IMPORTED_MODULE_1__["getSorularAramaCumlesi"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSorularArr", function() { return _sorular_selectors__WEBPACK_IMPORTED_MODULE_1__["getSorularArr"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getCurrentSoru", function() { return _sorular_selectors__WEBPACK_IMPORTED_MODULE_1__["getCurrentSoru"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSelectedSoruNumaralari", function() { return _sorular_selectors__WEBPACK_IMPORTED_MODULE_1__["getSelectedSoruNumaralari"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSorulardaHataVar", function() { return _sorular_selectors__WEBPACK_IMPORTED_MODULE_1__["getSorulardaHataVar"]; });

/* harmony import */ var _gerekli_listeler_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gerekli-listeler.selectors */ "./src/app/main/content/apps/sorular/soru-store/selectors/gerekli-listeler.selectors.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getGerekliListelerState", function() { return _gerekli_listeler_selectors__WEBPACK_IMPORTED_MODULE_2__["getGerekliListelerState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getBilisselDuzeyler", function() { return _gerekli_listeler_selectors__WEBPACK_IMPORTED_MODULE_2__["getBilisselDuzeyler"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSoruTipleri", function() { return _gerekli_listeler_selectors__WEBPACK_IMPORTED_MODULE_2__["getSoruTipleri"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSoruZorluklari", function() { return _gerekli_listeler_selectors__WEBPACK_IMPORTED_MODULE_2__["getSoruZorluklari"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSoruTipleriLoaded", function() { return _gerekli_listeler_selectors__WEBPACK_IMPORTED_MODULE_2__["getSoruTipleriLoaded"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSoruZorluklariLoaded", function() { return _gerekli_listeler_selectors__WEBPACK_IMPORTED_MODULE_2__["getSoruZorluklariLoaded"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getBilisselDuzeylerLoaded", function() { return _gerekli_listeler_selectors__WEBPACK_IMPORTED_MODULE_2__["getBilisselDuzeylerLoaded"]; });






/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/selectors/sorular.selectors.ts":
/*!*************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/selectors/sorular.selectors.ts ***!
  \*************************************************************************************/
/*! exports provided: getSorularState, getSorular, getSorularLoaded, getSorularLoading, getSorularAramaCumlesi, getSorularArr, getCurrentSoru, getSelectedSoruNumaralari, getSorulardaHataVar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSorularState", function() { return getSorularState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSorular", function() { return getSorular; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSorularLoaded", function() { return getSorularLoaded; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSorularLoading", function() { return getSorularLoading; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSorularAramaCumlesi", function() { return getSorularAramaCumlesi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSorularArr", function() { return getSorularArr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrentSoru", function() { return getCurrentSoru; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSelectedSoruNumaralari", function() { return getSelectedSoruNumaralari; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSorulardaHataVar", function() { return getSorulardaHataVar; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reducers */ "./src/app/main/content/apps/sorular/soru-store/reducers/index.ts");
/* harmony import */ var _fuse_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fuse/utils */ "./src/@fuse/utils/index.ts");



var getSorularState = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(_reducers__WEBPACK_IMPORTED_MODULE_1__["getSoruDepoAppState"], function (state) { return state.sorular; });
var getSorular = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getSorularState, function (state) { return state.entities; });
var getSorularLoaded = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getSorularState, function (state) { return state.loaded; });
var getSorularLoading = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getSorularState, function (state) { return state.loading; });
var getSorularAramaCumlesi = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getSorularState, function (state) { return state.searchText; });
var getSorularArr = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getSorular, getSorularAramaCumlesi, function (entities, searchText) {
    var arr = Object.keys(entities).map(function (id) { return entities[id]; });
    return _fuse_utils__WEBPACK_IMPORTED_MODULE_2__["FuseUtils"].filterArrayByString(arr, searchText);
});
var getCurrentSoru = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getSorularState, function (state) { return state.currentSoru; });
var getSelectedSoruNumaralari = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getSorularState, function (state) { return state.selectedSoruIds; });
var getSorulardaHataVar = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getSorularState, function (state) { return state.hataMesaji; });


/***/ }),

/***/ "./src/app/main/content/apps/sorular/soru-store/soru-store.module.ts":
/*!***************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/soru-store/soru-store.module.ts ***!
  \***************************************************************************/
/*! exports provided: SoruStoreModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoruStoreModule", function() { return SoruStoreModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var _reducers_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./reducers/index */ "./src/app/main/content/apps/sorular/soru-store/reducers/index.ts");
/* harmony import */ var _effects_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./effects/index */ "./src/app/main/content/apps/sorular/soru-store/effects/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var SoruStoreModule = /** @class */ (function () {
    function SoruStoreModule() {
    }
    SoruStoreModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _ngrx_store__WEBPACK_IMPORTED_MODULE_1__["StoreModule"].forFeature('soru-depo-app', _reducers_index__WEBPACK_IMPORTED_MODULE_3__["reducers"]),
                _ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["EffectsModule"].forFeature(_effects_index__WEBPACK_IMPORTED_MODULE_4__["effects"])
            ],
            providers: []
        })
    ], SoruStoreModule);
    return SoruStoreModule;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/sorular-side-nav/sorular-side-nav.component.html":
/*!********************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/sorular-side-nav/sorular-side-nav.component.html ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- SIDENAV HEADER -->\n<div fxLayout=\"column\" fxLayoutAlign=\"space-between start\" class=\"header p-24 pb-4\" ngClass=\"kucuk-ekran\" ngClass.gt-md=\"buyuk-ekran\">\n    <div class=\"logo\" fxFlex fxLayout=\"row\" fxLayoutAlign=\"start center\" matTooltip=\"Sayfayı tazelemek için tıklayın\">\n\n        <button class=\"logo\">\n            <span class=\"logo-text\">SORU DEPOSU</span>\n        </button>\n    </div>\n\n    <div class=\"birimler\" fxLayout=\"column\" style=\"color:2F3A57;font-size:16px\">\n        <div>Çalıştığınız Birimler</div>\n        <mat-form-field floatPlaceholder=\"never\">\n            <mat-select class=\"account-selection\" placeholder=\"Birim seçin\" [(ngModel)]=\"seciliBirim\">\n                <mat-option *ngFor=\"let birim of (birimler$ |async)\" [value]=\"birim\">\n                    {{birim.birimAdi}}\n                </mat-option>\n            </mat-select>\n        </mat-form-field>\n    </div>\n\n</div>\n<!-- / SIDENAV HEADER -->\n\n\n<!-- SIDENAV CONTENT -->\n<div class=\"content\" ngClass=\"kucuk-ekran\" ngClass.gt-md=\"buyuk-ekran\" fusePerfectScrollbar>\n\n    <div class=\"p-12\">\n        <fuse-yeni-soru-btn [menuItems]=\"yenimenuItems\" [gecerli]=\"dersNo>0\" (islem)=\"yeniSoruYarat($event)\" ipucu=\"Bir ders veya konu için soru yaratabilirsiniz. Lütfen ders veya konu seçiniz.\">\n\n        </fuse-yeni-soru-btn>\n        <!-- <button [matMenuTriggerFor]=\"yeniMenu\" x-position=\"after\"  mat-raised-button fxFlex class=\"compose-dialog-button\" #yeniButon aria-label=\"Compose\"\n            [disabled]=\"dersNo<=0\">\n            YENİ SORU\n            <mat-icon *ngIf=\"dersNo>0\" class=\"yeni-ikon\">arrow_drop_down </mat-icon>\n            <mat-icon matTooltip=\"Bir ders veya konu için soru yaratabilirsiniz. Lütfen ders veya konu seçiniz.\" *ngIf=\"dersNo<=0\">error </mat-icon>\n        </button>\n        <mat-menu #yeniMenu=\"matMenu\" >\n            <button mat-menu-item (click)=\"composeDialog()\">Basit Soru</button>\n            <button mat-menu-item>İlişkili Soru</button>\n        </mat-menu> -->\n    </div>\n    <div class=\"navbar-content\" fusePerfectScrollbar>\n        <fuse-navigation [navigation]=\"navigation\" layout=\"vertical\"></fuse-navigation>\n    </div>\n\n\n    <div class=\"nav\" ngClass=\"yan-acik\" ngClass.gt-md=\"yan\">\n        <div *ngIf=\"!seciliBirim?.programlari || seciliBirim?.programlari.length===0\">\n            <span class=\"nav-subheader\">Ders ve/veya konu yok.</span>\n        </div>\n        <div *ngIf=\"seciliBirim?.programlari && seciliBirim?.programlari?.length>0\">\n            <div class=\"nav-subheader\" fxLayout=\"row\" fxLayoutAlign=\"center center\">\n                <span> DERSLER / KONULAR</span>\n                <button mat-icon-button matTooltip=\"Ders konu ağacını yeniden yükle\" (click)=\"sayfayiTazele()\">\n                    <mat-icon>loop</mat-icon>\n                </button>\n            </div>\n\n            <div class=\"nav-item\" *ngFor=\"let program of seciliBirim.programlari\">\n                <a class=\"nav-link program\" matRipple [routerLink]=\"'/sorudeposu/program/' + program.programId\" (click)=\"$event.stopPropagation()\"\n                    routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact:true}\">\n                    <mat-icon class=\"nav-link-icon\" matTooltip=\"{{seciliBirim.birimAdi +','+program.programAdi+' programı'}}\">account_balance</mat-icon>\n                    <span matTooltip=\"{{'Program adı: '+program.programAdi}}\">{{program.programAdi|ozet}}</span>\n                </a>\n                <div class=\"nav-item\" *ngFor=\"let donem of program.donemleri\">\n                    <a class=\"nav-link\" matRipple [routerLink]=\"'/sorudeposu/program/' + program.programId+'/donem/'+donem.donemId\" (click)=\"$event.stopPropagation()\"\n                    routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact:true}\">\n                        <div class=\"donem\">\n                            <mat-icon class=\"nav-link-icon\" matTooltip=\"{{donem.donemAdi}}\">event</mat-icon>\n                            <span matTooltip=\"{{donem.sinifi+' .sınıf,'+ donem.donemAdi}}\">{{donem.sinifi+'. Sınıf, '+donem.donemAdi|ozet}}</span>\n                        </div>\n                    </a>\n                    <div *ngIf=\"donem.dersGruplari\">\n                        <div *ngFor=\"let dersGrubu of donem.dersGruplari\">\n                            <div class=\"nav-item\" *ngFor=\"let ders of dersGrubu.dersleri\">\n                                <a  class=\"nav-link\" matRipple [routerLink]=\"'/sorudeposu/program/'+program.programId+'/donem/'+donem.donemId+'/ders/' + ders.dersId\"\n                                    routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact:true}\" (click)=\"$event.stopPropagation()\">\n                                    <div class=\"ders\">\n                                        <mat-icon class=\"nav-link-icon\" matTooltip=\"{{program.programAdi}} - {{donem.donemAdi}}:{{dersGrubu.dersGrubuAdi}} dersi\">import_contacts</mat-icon>\n                                        <span matTooltip=\"Ders:{{ders.dersAdi}}\">{{ders.dersAdi|ozet:50}}</span>\n                                    </div>\n                                </a>\n                                \n\n                                <div class=\"nav-item\" *ngFor=\"let konu of ders.konulari\">\n                                    <a class=\"nav-link\" matRipple [routerLink]=\"'/sorudeposu/program/'+program.programId+'/donem/'+donem.donemId+'/ders/' + ders.dersId+'/konu/'+konu.konuId\"\n                                        routerLinkActive=\"active\" (click)=\"$event.stopPropagation()\">\n                                        <div class=\"konu\">\n                                            <mat-icon class=\"nav-link-icon\" matTooltip=\"{{program.programAdi}} - {{donem.donemAdi}}, \n                                        {{ders.dersAdi}} {{dersGrubu.staj?' stajı' :''}} \n                                        {{dersGrubu.dersKurulu?' komitesi':''}}\n                                        {{!dersGrubu.staj &&  !dersGrubu.dersKurulu?' dersi':''}}\n                                         {{konu.konuAdi}} konusu\">label</mat-icon>\n                                            <span matTooltip=\"Konu:{{konu.konuAdi}}\">{{konu.konuAdi|ozet:30}}</span>\n                                        </div>\n                                    </a>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n    </div>\n\n</div>\n<!-- / SIDENAV CONTENT -->"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/sorular-side-nav/sorular-side-nav.component.scss":
/*!********************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/sorular-side-nav/sorular-side-nav.component.scss ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: flex;\n  flex: 1 0 auto;\n  flex-direction: column;\n  height: 100%; }\n  :host .header .logo {\n    cursor: pointer; }\n  :host .header .logo .logo-text {\n      font-size: 24px;\n      line-height: 24px;\n      font-weight: 700;\n      color: #E2E3DD; }\n  :host .header .birimler {\n    width: 100%;\n    color: #E2E3DD; }\n  :host .content {\n    background-color: #E2E3DD; }\n  :host .content .compose-dialog-button {\n      background-color: #E2474C;\n      color: white;\n      width: 90%; }\n  :host .nav .nav-subheader {\n    display: block;\n    font-size: 1em; }\n  :host .nav .nav-subheader :hover {\n    cursor: pointer; }\n  :host .nav .nav-item .nav-link.active {\n    background-color: #E2E3DD;\n    color: #2F3A57;\n    font-weight: bolder; }\n  :host .nav .nav-item .nav-link.active .nav-link-icon {\n      color: #2F3A57; }\n  :host .nav .nav-item {\n    color: #3E6A91; }\n  :host .nav-link-icon {\n    color: #3E6A91; }\n  :host .program {\n    font-size: 1.2em;\n    color: #2F3A57;\n    font-weight: bolder; }\n  :host .donem {\n    margin-left: 24px;\n    font-size: 1em;\n    color: #2F3A57;\n    font-weight: bolder; }\n  :host .ders {\n    margin-left: 36px;\n    font-size: 0.9em;\n    font-weight: bolder; }\n  :host .konu {\n    margin-left: 48px;\n    font-size: 0.8em; }\n  :host .yeni-ikon {\n    margin-bottom: 4px;\n    margin-right: 12px;\n    color: white; }\n  :host .kucuk-ekran {\n    background-color: #E2474C; }\n  :host .kucuk-ekran .nav .nav-item {\n      color: #2F3A57; }\n  :host .kucuk-ekran .nav-link-icon {\n      color: #2F3A57; }\n  :host .kucuk-ekran .compose-dialog-button {\n      background-color: #406D95;\n      color: #A8D0DA; }\n  :host .kucuk-ekran .yeni-ikon {\n      color: #A8D0DA; }\n  :host .yan-acik {\n    background-color: transparent; }\n  :host .navbar-content {\n    flex: 1; }\n"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/sorular-side-nav/sorular-side-nav.component.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/sorular-side-nav/sorular-side-nav.component.ts ***!
  \******************************************************************************************/
/*! exports provided: SorularSideNavComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SorularSideNavComponent", function() { return SorularSideNavComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _soru_store_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../soru-store/index */ "./src/app/main/content/apps/sorular/soru-store/index.ts");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../store */ "./src/app/store/index.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs_add_operator_map__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/add/operator/map */ "./node_modules/rxjs-compat/_esm5/add/operator/map.js");
/* harmony import */ var _angular_cdk_platform__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/cdk/platform */ "./node_modules/@angular/cdk/esm5/platform.es5.js");
/* harmony import */ var _soru_store_effects_sorular_effects_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../soru-store/effects/sorular-effects.service */ "./src/app/main/content/apps/sorular/soru-store/effects/sorular-effects.service.ts");
/* harmony import */ var _core_services_sb_mesaj_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../core/services/sb-mesaj.service */ "./src/app/core/services/sb-mesaj.service.ts");
/* harmony import */ var _soru_store_helpers_soru_depo_veri_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../soru-store/helpers/soru-depo-veri.service */ "./src/app/main/content/apps/sorular/soru-store/helpers/soru-depo-veri.service.ts");
/* harmony import */ var _coktan_secmeli_soru_coktan_secmeli_soru_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../coktan-secmeli-soru/coktan-secmeli-soru.component */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/coktan-secmeli-soru.component.ts");
/* harmony import */ var _sorular_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../sorular.service */ "./src/app/main/content/apps/sorular/sorular.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};













var SorularSideNavComponent = /** @class */ (function () {
    function SorularSideNavComponent(effectsService, sorularService, platform, dialog, cd, store, mesajService, helperService, router) {
        var _this = this;
        this.effectsService = effectsService;
        this.sorularService = sorularService;
        this.platform = platform;
        this.dialog = dialog;
        this.cd = cd;
        this.store = store;
        this.mesajService = mesajService;
        this.helperService = helperService;
        this.router = router;
        this.dersNo = null;
        this.konuNo = null;
        this.yenimenuItems = [
            { name: 'basit', icon: 'add', title: 'Yeni soru' },
            { name: 'iliskili', icon: 'attachment', title: 'Yeni ilişkili soru' }
        ];
        this.store.select(_store__WEBPACK_IMPORTED_MODULE_4__["getRouterState"]).subscribe(function (routerState) {
            if (routerState) {
                _this.routerState = routerState.state;
                var handle = _this.effectsService.soruHandleYarat(_this.routerState);
                handle.forEach(function (h) {
                    if (h.id === 'dersNo') {
                        _this.dersNo = h.value;
                    }
                    if (h.id === 'konuNo') {
                        _this.konuNo = h.value;
                    }
                });
            }
        });
        this.birimler$ = this.store.select(_soru_store_index__WEBPACK_IMPORTED_MODULE_3__["getBirimlerArr"]);
        this.seciliBirim$ = this.store.select(_soru_store_index__WEBPACK_IMPORTED_MODULE_3__["getAktifBirim"]);
    }
    Object.defineProperty(SorularSideNavComponent.prototype, "seciliBirim", {
        get: function () {
            return this._seciliBirim;
        },
        set: function (value) {
            if (this._seciliBirim !== value) {
                this._seciliBirim = value;
                this.birimSecimiDegisti();
            }
        },
        enumerable: true,
        configurable: true
    });
    SorularSideNavComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.seciliBirim$.subscribe(function (birim) {
            _this._seciliBirim = birim;
            _this.navigation = _this.sorularService.createNavigationTree(birim);
        });
    };
    SorularSideNavComponent.prototype.ngAfterViewChecked = function () {
        var _this = this;
        if (this._seciliBirim === null) {
            setTimeout(function () {
                _this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_3__["IlkBirimiSec"](false));
                _this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_3__["GetSorular"]());
            });
        }
        this.refresh();
    };
    SorularSideNavComponent.prototype.sayfayiTazele = function () {
        this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_3__["BirimleriSifirla"]());
        this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_3__["GetBirimler"]([]));
        this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_3__["SorulariSifirla"]());
        this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_3__["GetSorular"]());
    };
    SorularSideNavComponent.prototype.birimSecimiDegisti = function () {
        var value = this.seciliBirim;
        this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_3__["SecAktifBirim"](value));
        if (value === null) {
            return;
        }
        var ders = null;
        if (value.programlari && value.programlari.length > 0) {
            if (value.programlari[0].donemleri && value.programlari[0].donemleri.length > 0) {
                if (value.programlari[0].donemleri[0].dersGruplari
                    && value.programlari[0].donemleri[0].dersGruplari.length > 0
                    && value.programlari[0].donemleri[0].dersGruplari[0].dersleri.length > 0) {
                    ders = value.programlari[0].donemleri && value.programlari[0].donemleri[0].dersGruplari[0].dersleri[0];
                }
            }
        }
        if (ders != null) {
            this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_3__["SecAktifDers"](ders));
            this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_3__["GetSorular"]());
            if (ders.konulari.length > 0) {
                this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_3__["SecAktifKonu"]({ ders: ders, konu: ders.konulari[0] }));
                this.router.navigate(["sorudeposu/ders/" + ders.dersId + "/konu/" + ders.konulari[0].konuId]);
            }
            else {
                this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_3__["SecAktifKonu"](null));
                this.router.navigate(['sorudeposu/ders/', ders.dersId]);
            }
        }
        else {
            this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_3__["SecAktifDers"](null));
            this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_3__["SecAktifKonu"](null));
            this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_3__["GetSorular"]());
            this.router.navigate(['sorudeposu/']);
        }
    };
    SorularSideNavComponent.prototype.composeDialog = function () {
        var _this = this;
        var ders = this.sorularService.dersBul(this.dersNo);
        if (!ders) {
            this.mesajService.hataStr('Ders bilgisi alınamadığı için yeni soru ekranı açılamadı.');
            return;
        }
        if (ders && ders.konulari.length > 0 && !(this.konuNo && this.konuNo > 0)) {
            this.mesajService.goster(ders.dersAdi + " adl\u0131 dersin konular\u0131 mevcut. L\u00FCtfen bir konu se\u00E7in.");
            return;
        }
        var en = '70vw';
        var boy = '90vh';
        var sinif = 'popup-masaustu';
        if (this.platform.ANDROID || this.platform.IOS) {
            en = '99vw';
            boy = '99vh';
            sinif = 'popup-mobil';
        }
        this.dialogRef = this.dialog.open(_coktan_secmeli_soru_coktan_secmeli_soru_component__WEBPACK_IMPORTED_MODULE_11__["CoktanSecmeliSoruComponent"], {
            data: {
                dersNo: this.dersNo,
                konuNo: this.konuNo,
                ders: ders,
                yeni: true
            },
            height: boy,
            width: en,
            panelClass: sinif
        });
        this.dialogRef.afterClosed()
            .subscribe(function (response) {
            if (!response) {
                return;
            }
            var actionType = response[0];
            var formData = response[1];
            var degisecekSoru = response[2];
            switch (actionType) {
                /**
                 * Kaydete tıklandı
                 */
                case 'kaydet':
                    if (degisecekSoru) {
                        _this.yeniSoruEkle(formData, ders);
                    }
                    break;
                /**
                 * Kapata tıklandı
                 */
                case 'kapat':
                    break;
            }
        });
    };
    SorularSideNavComponent.prototype.yeniSoruEkle = function (formData, ders) {
        var yeniSoru = Object.assign({}, formData.getRawValue());
        yeniSoru.tekDogruluSecenekleri = formData.get('secenekler').value;
        yeniSoru.kabulEdilebilirlikIndeksi = formData.get('kabulEdilebilirlikIndeksi').value;
        yeniSoru.baslangic = formData.get('gecerlilik.baslangic').value;
        yeniSoru.bitis = formData.get('gecerlilik.bitis').value;
        if (yeniSoru.dersNo > 0) {
            if (ders != null) {
                yeniSoru.birimNo = ders.birimNo;
                yeniSoru.programNo = ders.programNo;
                yeniSoru.donemNo = ders.donemNo;
                yeniSoru.dersGrubuNo = ders.dersGrubuNo;
            }
        }
        this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_3__["UpdateSoru"](yeniSoru));
    };
    SorularSideNavComponent.prototype.refresh = function () {
        this.cd.markForCheck();
    };
    SorularSideNavComponent.prototype.yeniSoruYarat = function (islem) {
        switch (islem) {
            case 'iliskili':
                break;
            default:
                this.composeDialog();
                break;
        }
    };
    SorularSideNavComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-sorular-side-nav',
            template: __webpack_require__(/*! ./sorular-side-nav.component.html */ "./src/app/main/content/apps/sorular/sorular-side-nav/sorular-side-nav.component.html"),
            styles: [__webpack_require__(/*! ./sorular-side-nav.component.scss */ "./src/app/main/content/apps/sorular/sorular-side-nav/sorular-side-nav.component.scss")],
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [_soru_store_effects_sorular_effects_service__WEBPACK_IMPORTED_MODULE_8__["SorularEffectsService"],
            _sorular_service__WEBPACK_IMPORTED_MODULE_12__["SorularService"],
            _angular_cdk_platform__WEBPACK_IMPORTED_MODULE_7__["Platform"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialog"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"],
            _core_services_sb_mesaj_service__WEBPACK_IMPORTED_MODULE_9__["SbMesajService"],
            _soru_store_helpers_soru_depo_veri_service__WEBPACK_IMPORTED_MODULE_10__["SoruDepoVeriService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]])
    ], SorularSideNavComponent);
    return SorularSideNavComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/sorular-side-nav/yeni-soru-btn/yeni-soru-btn.component.html":
/*!*******************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/sorular-side-nav/yeni-soru-btn/yeni-soru-btn.component.html ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- Fab -->\n<button *ngIf=\"menuItems\" mat-fab [@preventInitialAnimation] [satPopoverAnchorFor]=\"dial\" [disabled]=\"!gecerli\" (click)=\"dial.toggle()\" ng-blur=\"dial.close()\" \n  style=\"background-color: #E2474C;\">\n  <mat-icon [@spinInOut]=\"'in'\" *ngIf=\"!gecerli\" [@spinInOut]=\"'in'\" style=\"background-color: #E2474C;\" matTooltip=\"{{ipucu}}\">warning</mat-icon>\n  <mat-icon [@spinInOut]=\"'in'\" *ngIf=\"gecerli && dial.isOpen()\" style=\"background-color: #E2474C;\" matTooltip=\"Kapat\" >close</mat-icon>\n  <mat-icon [@spinInOut]=\"'in'\" *ngIf=\"gecerli && !dial.isOpen()\" style=\"background-color: #E2474C;\" matTooltip=\"Soru Ekle\">add</mat-icon>\n</button>\n\n<!-- Actions -->\n<sat-popover #dial verticalAlign=\"above\">\n  <div class=\"dial\">\n    <ng-container *ngFor=\"let a of menuItems\">\n      <button mat-mini-fab [satPopoverAnchorFor]=\"tooltip\" (mouseenter)=\"tooltip.open()\" (mouseleave)=\"tooltip.close()\" (click)=\"dial.close()\"\n        (click)=\"islem.emit(a.name)\" style=\"background-color: #3E6A91;\">\n        <mat-icon>{{a.icon}}</mat-icon>\n      </button>\n      <sat-popover #tooltip horizontalAlign=\"before\">\n        <div class=\"tooltip mat-body-1\">\n          {{a.title}}\n        </div>\n      </sat-popover>\n    </ng-container>\n  </div>\n</sat-popover>"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/sorular-side-nav/yeni-soru-btn/yeni-soru-btn.component.scss":
/*!*******************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/sorular-side-nav/yeni-soru-btn/yeni-soru-btn.component.scss ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: block;\n  padding-left: 30%;\n  margin-bottom: 0px !important; }\n\n.mat-fab .mat-icon {\n  position: absolute;\n  top: 16px;\n  left: 16px;\n  color: white; }\n\n.dial {\n  margin-bottom: 8px;\n  display: flex;\n  flex-direction: column-reverse; }\n\n.dial .mat-mini-fab {\n    margin: 8px 0; }\n\n.tooltip {\n  padding: 4px 8px;\n  background-color: #E2474C;\n  color: white;\n  border-radius: 2px;\n  margin: 8px;\n  font-size: 12px; }\n"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/sorular-side-nav/yeni-soru-btn/yeni-soru-btn.component.ts":
/*!*****************************************************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/sorular-side-nav/yeni-soru-btn/yeni-soru-btn.component.ts ***!
  \*****************************************************************************************************/
/*! exports provided: YeniSoruBtnComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "YeniSoruBtnComponent", function() { return YeniSoruBtnComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/fesm5/animations.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var YeniSoruBtnComponent = /** @class */ (function () {
    function YeniSoruBtnComponent() {
        this.islem = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.gecerli = true;
    }
    YeniSoruBtnComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], YeniSoruBtnComponent.prototype, "islem", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], YeniSoruBtnComponent.prototype, "gecerli", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], YeniSoruBtnComponent.prototype, "menuItems", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], YeniSoruBtnComponent.prototype, "ipucu", void 0);
    YeniSoruBtnComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-yeni-soru-btn',
            template: __webpack_require__(/*! ./yeni-soru-btn.component.html */ "./src/app/main/content/apps/sorular/sorular-side-nav/yeni-soru-btn/yeni-soru-btn.component.html"),
            styles: [__webpack_require__(/*! ./yeni-soru-btn.component.scss */ "./src/app/main/content/apps/sorular/sorular-side-nav/yeni-soru-btn/yeni-soru-btn.component.scss")],
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["trigger"])('spinInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["style"])({ transform: 'rotate(0)', opacity: '1' })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["transition"])(':enter', [
                        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["style"])({ transform: 'rotate(-180deg)', opacity: '0' }),
                        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["animate"])('150ms ease')
                    ]),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["transition"])(':leave', [
                        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["animate"])('150ms ease', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["style"])({ transform: 'rotate(180deg)', opacity: '0' }))
                    ]),
                ]),
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["trigger"])('preventInitialAnimation', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["transition"])(':enter', [
                        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_1__["query"])(':enter', [], { optional: true })
                    ]),
                ]),
            ]
        }),
        __metadata("design:paramtypes", [])
    ], YeniSoruBtnComponent);
    return YeniSoruBtnComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/sorular.component.html":
/*!******************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/sorular.component.html ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"soru\" class=\"page-layout carded left-sidenav\" fusePerfectScrollbar>\n    <!-- TOP BACKGROUND -->\n    <div class=\"top-bg\" style=\"background-color: #E2474C\"></div>\n    <!-- / TOP BACKGROUND -->\n\n    <mat-sidenav-container>\n        <!-- SIDENAV -->\n        <mat-sidenav class=\"sidenav\" align=\"start\" mode=\"side\" opened=\"true\" fuseMatSidenavHelper=\"carded-left-sidenav\" mat-is-locked-open=\"gt-md\">\n            <fuse-sorular-side-nav></fuse-sorular-side-nav>\n\n        </mat-sidenav>\n\n        <div class=\"center\">\n            <!-- CONTENT HEADER -->\n\n            <div class=\"header\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\n\n                <div class=\"search-wrapper\" fxFlex fxLayout=\"row\" fxLayoutAlign=\"start center\">\n                    <button mat-button class=\"mat-icon-button sidenav-toggle\" fuseMatSidenavToggler=\"carded-left-sidenav\" fxHide.gt-md aria-label=\"Toggle Sidenav\">\n                        <mat-icon>menu</mat-icon>\n                    </button>\n\n                    <div class=\"search\" flex fxLayout=\"row\" fxLayoutAlign=\"start center\">\n                        <mat-icon style=\"color:#2F3A57\">home</mat-icon>\n                        <div class=\"baslik\">\n                            {{baslik}}\n                        </div>\n                    </div>\n\n                </div>\n            </div>\n            <!-- / CONTENT HEADER -->\n\n\n            <!-- CONTENT CARD -->\n            <div class=\"content-card\" style=\"background-color:#A8D0DA\" [ngClass]=\"{'current-mail-selected':aktifSoru$ | async}\">\n\n                <!-- CONTENT TOOLBAR -->\n                <div class=\"toolbar px-24 py-8\">\n                    <div class=\"mail-selection\" fxFlex=\"row\" fxLayoutAlign=\"start center\">\n\n                        <mat-checkbox (click)=\"toggleSelectAll($event)\" [checked]=\"hasSelectedSorular\" [indeterminate]=\"isIndeterminate\">\n                        </mat-checkbox>\n\n                        <button mat-icon-button [matMenuTriggerFor]=\"selectMenu\">\n                            <mat-icon>arrow_drop_down</mat-icon>\n                        </button>\n                        <mat-menu #selectMenu=\"matMenu\">\n                            <button mat-menu-item (click)=\"tumSorulariSec()\">Tümü</button>\n                            <button mat-menu-item (click)=\"hicSoruSecilmesin()\">Hiçbiri</button>\n                            <!-- <button mat-menu-item (click)=\"selectMailsByParameter('read', true)\">Read</button>\n                            <button mat-menu-item (click)=\"selectMailsByParameter('read', false)\">Unread</button>\n                            <button mat-menu-item (click)=\"selectMailsByParameter('starred', true)\">Starred</button>\n                            <button mat-menu-item (click)=\"selectMailsByParameter('starred', false)\">Unstarred</button>\n                            <button mat-menu-item (click)=\"selectMailsByParameter('important', true)\">Important</button>\n                            <button mat-menu-item (click)=\"selectMailsByParameter('important', false)\">Unimportant</button> -->\n                        </mat-menu>\n\n                        <div class=\"toolbar-separator\" *ngIf=\"hasSelectedSorular\"></div>\n\n                        <button mat-button class=\"mat-icon-button\" (click)=\"seciliSorulariSil()\" *ngIf=\"hasSelectedSorular\">\n                            <mat-icon matTooltip=\"Seçilmiş {{selectedSorularIds.length}} soruyu siler.\">delete</mat-icon>\n                        </button>\n\n                        <span *ngIf=\"hasSelectedSorular\">{{selectedSorularIds.length}} soru seçildi.</span>\n\n                        <!-- <button mat-icon-button [matMenuTriggerFor]=\"folderMenu\" *ngIf=\"hasSelectedSorular\">\n                            <mat-icon>folder</mat-icon>\n                        </button> -->\n                        <!-- <mat-menu #folderMenu=\"matMenu\">\n                            <button mat-menu-item *ngFor=\"let folder of folders$ | async\"\n                                    (click)=\"setFolderOnSelectedMails(folder.id)\">{{folder.title}}\n                            </button>\n                        </mat-menu> -->\n\n                        <!-- <button mat-icon-button [matMenuTriggerFor]=\"labelMenu\" *ngIf=\"hasSelectedSorular\">\n                            <mat-icon>label</mat-icon>\n                        </button>\n                        <mat-menu #labelMenu=\"matMenu\">\n                            <button mat-menu-item *ngFor=\"let label of labels$ | async\"\n                                    (click)=\"toggleLabelOnSelectedMails(label.id)\">{{label.title}}\n                            </button>\n                        </mat-menu> -->\n                    </div>\n\n                    <div *ngIf=\"aktifSoru$ | async\" fxHide.gt-xs>\n                        <button mat-icon-button (click)=\"aktifSoruyuBosYap()\">\n                            <mat-icon>arrow_back</mat-icon>\n                        </button>\n                    </div>\n\n                </div>\n\n                <!-- / CONTENT TOOLBAR -->\n                <!-- CONTENT -->\n                <div class=\"content\" fxLayoutAlign=\"row\">\n                    \n                        <fuse-soru-listesi fusePerfectScrollbar fxFlex [sorular]=\"sorular$ | async\" [aktifSoru]=\"aktifSoru$|async\" (sorudegisti)=\"soruGoster($event)\"></fuse-soru-listesi>\n                        <fuse-soru-detay [soru]=\"aktifSoru$|async\" fusePerfectScrollbar fxflex> </fuse-soru-detay>\n                    \n                </div>\n                <!-- / CONTENT -->\n\n            </div>\n            <!-- / CONTENT CARD -->\n\n        </div>\n        <!-- / SIDENAV -->\n    </mat-sidenav-container>\n</div>"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/sorular.component.scss":
/*!******************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/sorular.component.scss ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/**\n * Applies styles for users in high contrast mode. Note that this only applies\n * to Microsoft browsers. Chrome can be included by checking for the `html[hc]`\n * attribute, however Chrome handles high contrast differently.\n */\n/* Theme for the ripple elements.*/\n/* stylelint-disable material/no-prefixes */\n/* stylelint-enable */\n:host {\n  width: 100%; }\n:host .page-layout {\n    background-color: #A8D0DA; }\n:host .page-layout.carded {\n      background-color: #A8D0DA; }\n:host .page-layout.carded .top-bg {\n        background-color: #2F3A57; }\n:host .page-layout.carded .sidenav .yan-acik {\n        background-color: A8D0DA; }\n:host .page-layout .center .header .search-wrapper {\n      background-color: #A8D0DA;\n      box-shadow: 0px 4px 5px -2px rgba(0, 0, 0, 0.2), 0px 7px 10px 1px rgba(0, 0, 0, 0.14), 0px 2px 16px 1px rgba(0, 0, 0, 0.12); }\n:host .page-layout .center .header .search-wrapper .sidenav-toggle {\n        margin: 0;\n        width: 56px;\n        height: 56px;\n        background: #E2E3DD;\n        border-radius: 0;\n        border-right: 1px solid rgba(0, 0, 0, 0.12); }\n:host .page-layout .center .header .search-wrapper .search {\n        width: 100%;\n        height: 56px;\n        line-height: 56px;\n        padding: 18px;\n        font-weight: 700;\n        color: #2F3A57; }\n:host .page-layout .center .header .search-wrapper .search .baslik {\n          height: 56px;\n          padding-left: 32px;\n          font-size: 1.5em;\n          border: none;\n          outline: none;\n          background-color: #A8D0DA; }\n@media screen and (max-width: 599px) {\n      :host .page-layout .center .content-card fuse-soru-listesi {\n        border-right: none; }\n      :host .page-layout .center .content-card fuse-soru-listesi,\n      :host .page-layout .center .content-card fuse-soru-detay {\n        flex: 1 0 100%; }\n      :host .page-layout .center .content-card fuse-soru-detay {\n        display: none !important; }\n      :host .page-layout .center .content-card.current-mail-selected .toolbar {\n        padding-left: 16px !important; }\n        :host .page-layout .center .content-card.current-mail-selected .toolbar .mail-selection {\n          display: none !important; }\n      :host .page-layout .center .content-card.current-mail-selected .content fuse-soru-listesi {\n        display: none !important; }\n      :host .page-layout .center .content-card.current-mail-selected .content fuse-soru-detay {\n        display: flex !important; } }\n"

/***/ }),

/***/ "./src/app/main/content/apps/sorular/sorular.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/sorular.component.ts ***!
  \****************************************************************/
/*! exports provided: SorularComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SorularComponent", function() { return SorularComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _fuse_components_confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fuse/components/confirm-dialog/confirm-dialog.component */ "./src/@fuse/components/confirm-dialog/confirm-dialog.component.ts");
/* harmony import */ var _fuse_services_config_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fuse/services/config.service */ "./src/@fuse/services/config.service.ts");
/* harmony import */ var _fuse_services_translation_loader_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fuse/services/translation-loader.service */ "./src/@fuse/services/translation-loader.service.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs_add_operator_debounceTime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/add/operator/debounceTime */ "./node_modules/rxjs-compat/_esm5/add/operator/debounceTime.js");
/* harmony import */ var rxjs_add_operator_distinctUntilChanged__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/add/operator/distinctUntilChanged */ "./node_modules/rxjs-compat/_esm5/add/operator/distinctUntilChanged.js");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../store */ "./src/app/store/index.ts");
/* harmony import */ var _i18n_en__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./i18n/en */ "./src/app/main/content/apps/sorular/i18n/en.ts");
/* harmony import */ var _i18n_tr__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./i18n/tr */ "./src/app/main/content/apps/sorular/i18n/tr.ts");
/* harmony import */ var _soru_store__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./soru-store */ "./src/app/main/content/apps/sorular/soru-store/index.ts");
/* harmony import */ var _soru_store_effects_sorular_effects_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./soru-store/effects/sorular-effects.service */ "./src/app/main/content/apps/sorular/soru-store/effects/sorular-effects.service.ts");
/* harmony import */ var _soru_store_helpers_soru_depo_veri_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./soru-store/helpers/soru-depo-veri.service */ "./src/app/main/content/apps/sorular/soru-store/helpers/soru-depo-veri.service.ts");
/* harmony import */ var _sorular_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./sorular.service */ "./src/app/main/content/apps/sorular/sorular.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


















var SorularComponent = /** @class */ (function () {
    function SorularComponent(configService, translationLoader, store, rootStore, authStore, sorularService, effectsService, cd, route, dialog, helperServide) {
        var _this = this;
        this.configService = configService;
        this.translationLoader = translationLoader;
        this.store = store;
        this.rootStore = rootStore;
        this.authStore = authStore;
        this.sorularService = sorularService;
        this.effectsService = effectsService;
        this.cd = cd;
        this.route = route;
        this.dialog = dialog;
        this.helperServide = helperServide;
        this.baslik = '';
        this.aktifBirim = null;
        this.aktifders = null;
        this.aktifKonu = null;
        this.rootStore.select(_store__WEBPACK_IMPORTED_MODULE_10__["getRouterState"]).subscribe(function (routerState) {
            if (routerState) {
                _this.routerState = routerState.state;
                var handle = _this.effectsService.soruHandleYarat(_this.routerState);
                var aktifDersNo_1 = 0;
                var aktifKonuNo_1 = 0;
                handle.forEach(function (h) {
                    if (h.id === 'dersNo') {
                        aktifDersNo_1 = h.value;
                    }
                    if (h.id === 'konuNo') {
                        aktifKonuNo_1 = h.value;
                    }
                });
                if (aktifDersNo_1 > 0) {
                    _this.aktifders = _this.sorularService.dersBul(aktifDersNo_1);
                }
                else {
                    _this.aktifders = null;
                }
                if (_this.aktifders && aktifKonuNo_1 > 0) {
                    var konular = _this.aktifders.konulari.filter(function (k) { return k.konuId == aktifKonuNo_1; });
                    if (konular && konular.length === 1) {
                        _this.aktifKonu = konular[0];
                    }
                    else {
                        _this.aktifKonu = null;
                    }
                }
                _this.soruBasliginiOlustur();
            }
        });
        this.store.select(_soru_store__WEBPACK_IMPORTED_MODULE_13__["getAktifBirim"]).subscribe(function (birim) {
            if (birim) {
                _this.aktifBirim = birim;
                _this.soruBasliginiOlustur();
            }
        });
        this.kullaniciTakip$ = this.authStore.select(_store__WEBPACK_IMPORTED_MODULE_10__["getAuthState"]).subscribe(function (authBilgi) {
            if (!authBilgi.kullaniciAdi) {
                _this.store.dispatch(new _soru_store__WEBPACK_IMPORTED_MODULE_13__["SorulariSifirla"]());
                _this.store.dispatch(new _soru_store__WEBPACK_IMPORTED_MODULE_13__["BirimleriSifirla"]());
                _this.route.navigate(['/']);
            }
        });
        this.store.select(_soru_store__WEBPACK_IMPORTED_MODULE_13__["getAktifDers"]).subscribe(function (ders) {
            if (ders) {
                _this.aktifders = ders;
                _this.soruBasliginiOlustur();
            }
        });
        this.store.select(_soru_store__WEBPACK_IMPORTED_MODULE_13__["getAktifKonu"]).subscribe(function (konu) {
            _this.aktifKonu = konu;
            _this.soruBasliginiOlustur();
        });
        this.store.select(_soru_store__WEBPACK_IMPORTED_MODULE_13__["getSorulardaHataVar"]).subscribe(function (mesaj) {
            if (mesaj) {
                console.log(mesaj);
            }
        });
        this.searchInput = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('');
        this.translationLoader.loadTranslations(_i18n_en__WEBPACK_IMPORTED_MODULE_11__["locale"], _i18n_tr__WEBPACK_IMPORTED_MODULE_12__["locale"]);
        this.aktifSoru$ = this.store.select(_soru_store__WEBPACK_IMPORTED_MODULE_13__["getCurrentSoru"]);
        this.sorular$ = this.store.select(_soru_store__WEBPACK_IMPORTED_MODULE_13__["getSorularArr"]);
        this.selectedSorularIds$ = this.store.select(_soru_store__WEBPACK_IMPORTED_MODULE_13__["getSelectedSoruNumaralari"]);
        this.searchText$ = this.store.select(_soru_store__WEBPACK_IMPORTED_MODULE_13__["getSorularAramaCumlesi"]);
        this.sorular = [];
        this.selectedSorularIds = [];
        this.configService.setConfig({
            routerAnimation: 'none'
        });
    }
    SorularComponent.prototype.ngOnInit = function () {
        // this.sorular$.subscribe(sorular => {
        //   this.sorular = sorular;
        //   this.cd.detectChanges();
        //   console.log(sorular);
        // });
        var _this = this;
        this.selectedSorularIds$
            .subscribe(function (selectedMailIds) {
            _this.selectedSorularIds = selectedMailIds;
            _this.hasSelectedSorular = selectedMailIds.length > 0;
            _this.isIndeterminate = (selectedMailIds.length !== _this.sorular.length && selectedMailIds.length > 0);
            _this.refresh();
        });
        this.searchText$.subscribe(function (searchText) {
            _this.searchInput.setValue(searchText);
        });
        this.searchInput.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(function (searchText) {
            _this.store.dispatch(new _soru_store__WEBPACK_IMPORTED_MODULE_13__["SetSorularAramaCumlesi"](searchText));
        });
    };
    SorularComponent.prototype.soruBasliginiOlustur = function () {
        if (this.aktifders == null && this.aktifKonu == null) {
            if (this.aktifBirim !== null) {
                this.baslik = "" + this.aktifBirim.birimAdi;
            }
            else {
                this.baslik = '';
            }
        }
        if (this.aktifders != null && this.aktifKonu != null) {
            this.baslik = this.aktifders.dersAdi + " - " + this.aktifKonu.konuAdi;
        }
        if (this.aktifders == null || this.aktifKonu == null) {
            if (this.aktifders != null) {
                this.baslik = "" + this.aktifders.dersAdi;
            }
            if (this.aktifKonu != null) {
                this.baslik = "" + this.aktifKonu.konuAdi;
            }
        }
        this.baslik = this.baslik + ' Soruları';
        this.store.dispatch(new _soru_store__WEBPACK_IMPORTED_MODULE_13__["GetSorular"]());
        this.store.dispatch(new _soru_store__WEBPACK_IMPORTED_MODULE_13__["SetSorularAramaCumlesi"](''));
        this.store.dispatch(new _soru_store__WEBPACK_IMPORTED_MODULE_13__["DeselectSorularTumu"]());
    };
    SorularComponent.prototype.yukle = function () {
        // this.store.dispatch(new UI.StartLoading());
    };
    SorularComponent.prototype.toggleSelectAll = function (ev) {
        ev.preventDefault();
        if (this.selectedSorularIds.length && this.selectedSorularIds.length > 0) {
            this.hicSoruSecilmesin();
        }
        else {
            this.tumSorulariSec();
        }
    };
    SorularComponent.prototype.tumSorulariSec = function () {
        this.store.dispatch(new _soru_store__WEBPACK_IMPORTED_MODULE_13__["SelectSorularTumu"]());
    };
    SorularComponent.prototype.hicSoruSecilmesin = function () {
        this.store.dispatch(new _soru_store__WEBPACK_IMPORTED_MODULE_13__["DeselectSorularTumu"]());
    };
    SorularComponent.prototype.selectMailsByParameter = function (parameter, value) {
        this.store.dispatch(new _soru_store__WEBPACK_IMPORTED_MODULE_13__["SelectSorularParametreyeGore"]({
            parameter: parameter,
            value: value
        }));
    };
    SorularComponent.prototype.seciliSorulariSil = function () {
        var _this = this;
        var dialogRef = this.dialog.open(_fuse_components_confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_4__["FuseConfirmDialogComponent"], {
            width: '600px',
            height: '400',
            data: {
                onaybasligi: 'Silme onayı!',
                onaymesaji: "<p>Silinsin derseniz listede se\u00E7ilmi\u015F olan sorular\u0131n (" + this.selectedSorularIds.length + " soru) hepsi sistemden tamamen silinecek!</p> Soru(lar) silinsin mi?",
                olumluButonYazisi: 'Silinsin',
                olumsuzButonYazisi: 'Vazgeçtim'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                for (var index = 0; index < _this.selectedSorularIds.length; index++) {
                    var soruNo = _this.selectedSorularIds[index];
                    _this.store.dispatch(new _soru_store__WEBPACK_IMPORTED_MODULE_13__["SoruSilindiIsaretle"](+soruNo));
                }
            }
        });
    };
    SorularComponent.prototype.aktifSoruyuBosYap = function () {
        this.store.dispatch(new _soru_store__WEBPACK_IMPORTED_MODULE_13__["SetAktifSoru"](''));
    };
    SorularComponent.prototype.refresh = function () {
        this.cd.markForCheck();
    };
    SorularComponent.prototype.ngOnDestroy = function () {
        if (this.kullaniciTakip$) {
            this.kullaniciTakip$.unsubscribe();
        }
        this.cd.detach();
    };
    SorularComponent.prototype.soruGoster = function (degisenSoruId) {
        this.store.dispatch(new _soru_store__WEBPACK_IMPORTED_MODULE_13__["SetAktifSoru"](degisenSoruId));
    };
    SorularComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'fuse-sorular',
            template: __webpack_require__(/*! ./sorular.component.html */ "./src/app/main/content/apps/sorular/sorular.component.html"),
            styles: [__webpack_require__(/*! ./sorular.component.scss */ "./src/app/main/content/apps/sorular/sorular.component.scss")],
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        }),
        __metadata("design:paramtypes", [_fuse_services_config_service__WEBPACK_IMPORTED_MODULE_5__["FuseConfigService"],
            _fuse_services_translation_loader_service__WEBPACK_IMPORTED_MODULE_6__["FuseTranslationLoaderService"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_7__["Store"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_7__["Store"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_7__["Store"],
            _sorular_service__WEBPACK_IMPORTED_MODULE_16__["SorularService"],
            _soru_store_effects_sorular_effects_service__WEBPACK_IMPORTED_MODULE_14__["SorularEffectsService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"],
            _soru_store_helpers_soru_depo_veri_service__WEBPACK_IMPORTED_MODULE_15__["SoruDepoVeriService"]])
    ], SorularComponent);
    return SorularComponent;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/sorular.module.ts":
/*!*************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/sorular.module.ts ***!
  \*************************************************************/
/*! exports provided: SorularModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SorularModule", function() { return SorularModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _sorular_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sorular.component */ "./src/app/main/content/apps/sorular/sorular.component.ts");
/* harmony import */ var _sorular_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./sorular.service */ "./src/app/main/content/apps/sorular/sorular.service.ts");
/* harmony import */ var _soru_store_soru_store_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./soru-store/soru-store.module */ "./src/app/main/content/apps/sorular/soru-store/soru-store.module.ts");
/* harmony import */ var _soru_store_effects_sorular_effects_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./soru-store/effects/sorular-effects.service */ "./src/app/main/content/apps/sorular/soru-store/effects/sorular-effects.service.ts");
/* harmony import */ var _coktan_secmeli_soru_coktan_secmeli_soru_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./coktan-secmeli-soru/coktan-secmeli-soru.component */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/coktan-secmeli-soru.component.ts");
/* harmony import */ var _anahtar_kelimeler_anahtar_kelimeler_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./anahtar-kelimeler/anahtar-kelimeler.component */ "./src/app/main/content/apps/sorular/anahtar-kelimeler/anahtar-kelimeler.component.ts");
/* harmony import */ var _material_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../material.module */ "./src/app/material.module.ts");
/* harmony import */ var _core_sb_core_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../core/sb-core.module */ "./src/app/core/sb-core.module.ts");
/* harmony import */ var _fuse_shared_module__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @fuse/shared.module */ "./src/@fuse/shared.module.ts");
/* harmony import */ var _ogrenim_hedefleri_ogrenim_hedefleri_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./ogrenim-hedefleri/ogrenim-hedefleri.component */ "./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedefleri.component.ts");
/* harmony import */ var _ogrenim_hedefleri_ogrenim_hedef_list_ogrenim_hedef_list_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-list.component */ "./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-list.component.ts");
/* harmony import */ var _ogrenim_hedefleri_ogrenim_hedef_list_ogrenim_hedef_satir_ogrenim_hedef_satir_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-satir/ogrenim-hedef-satir.component */ "./src/app/main/content/apps/sorular/ogrenim-hedefleri/ogrenim-hedef-list/ogrenim-hedef-satir/ogrenim-hedef-satir.component.ts");
/* harmony import */ var _coktan_secmeli_soru_tek_dogrulu_secenek_tek_dogrulu_secenek_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek.component */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek.component.ts");
/* harmony import */ var _coktan_secmeli_soru_tek_dogrulu_secenek_tek_dogrulu_secenek_detay_tek_dogrulu_secenek_detay_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-detay/tek-dogrulu-secenek-detay.component */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-detay/tek-dogrulu-secenek-detay.component.ts");
/* harmony import */ var _sb_html_editor_sb_html_editor_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./sb-html-editor/sb-html-editor.component */ "./src/app/main/content/apps/sorular/sb-html-editor/sb-html-editor.component.ts");
/* harmony import */ var _fuse_components__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @fuse/components */ "./src/@fuse/components/index.ts");
/* harmony import */ var _coktan_secmeli_soru_tek_dogrulu_secenek_tek_dogrulu_secenek_list_tek_dogrulu_secenek_list_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-list.component */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-list.component.ts");
/* harmony import */ var _coktan_secmeli_soru_tek_dogrulu_secenek_tek_dogrulu_secenek_list_tek_dogrulu_secenek_item_tek_dogrulu_secenek_item_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-item/tek-dogrulu-secenek-item.component */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/tek-dogrulu-secenek/tek-dogrulu-secenek-list/tek-dogrulu-secenek-item/tek-dogrulu-secenek-item.component.ts");
/* harmony import */ var _soru_detay_soru_detay_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./soru-detay/soru-detay.component */ "./src/app/main/content/apps/sorular/soru-detay/soru-detay.component.ts");
/* harmony import */ var _sorular_side_nav_sorular_side_nav_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./sorular-side-nav/sorular-side-nav.component */ "./src/app/main/content/apps/sorular/sorular-side-nav/sorular-side-nav.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _soru_listesi_soru_listesi_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./soru-listesi/soru-listesi.component */ "./src/app/main/content/apps/sorular/soru-listesi/soru-listesi.component.ts");
/* harmony import */ var _soru_listesi_soru_listesi_satiri_soru_listesi_satiri_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./soru-listesi/soru-listesi-satiri/soru-listesi-satiri.component */ "./src/app/main/content/apps/sorular/soru-listesi/soru-listesi-satiri/soru-listesi-satiri.component.ts");
/* harmony import */ var _soru_store_helpers_soru_depo_veri_service__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./soru-store/helpers/soru-depo-veri.service */ "./src/app/main/content/apps/sorular/soru-store/helpers/soru-depo-veri.service.ts");
/* harmony import */ var _soru_store_guards_sorular_resolve_guard__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./soru-store/guards/sorular-resolve.guard */ "./src/app/main/content/apps/sorular/soru-store/guards/sorular-resolve.guard.ts");
/* harmony import */ var _soru_onizleme_soru_onizleme_component__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./soru-onizleme/soru-onizleme.component */ "./src/app/main/content/apps/sorular/soru-onizleme/soru-onizleme.component.ts");
/* harmony import */ var _coktan_secmeli_soru_validators__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./coktan-secmeli-soru/validators */ "./src/app/main/content/apps/sorular/coktan-secmeli-soru/validators.ts");
/* harmony import */ var _sorular_side_nav_yeni_soru_btn_yeni_soru_btn_component__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./sorular-side-nav/yeni-soru-btn/yeni-soru-btn.component */ "./src/app/main/content/apps/sorular/sorular-side-nav/yeni-soru-btn/yeni-soru-btn.component.ts");
/* harmony import */ var _ncstate_sat_popover__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @ncstate/sat-popover */ "./node_modules/@ncstate/sat-popover/@ncstate/sat-popover.es5.js");
/* harmony import */ var _coktan_secmeli_iliskili_soru_coktan_secmeli_iliskili_soru_component__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./coktan-secmeli-iliskili-soru/coktan-secmeli-iliskili-soru.component */ "./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/coktan-secmeli-iliskili-soru.component.ts");
/* harmony import */ var _coktan_secmeli_iliskili_soru_iliskili_soru_listesi_iliskili_soru_listesi_component__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-listesi.component */ "./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-listesi.component.ts");
/* harmony import */ var _coktan_secmeli_iliskili_soru_iliskili_soru_listesi_iliskili_soru_item_iliskili_soru_item_component__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-item/iliskili-soru-item.component */ "./src/app/main/content/apps/sorular/coktan-secmeli-iliskili-soru/iliskili-soru-listesi/iliskili-soru-item/iliskili-soru-item.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


































var routes = [
    {
        path: '',
        component: _sorular_component__WEBPACK_IMPORTED_MODULE_2__["SorularComponent"],
        canActivate: [_soru_store_guards_sorular_resolve_guard__WEBPACK_IMPORTED_MODULE_26__["SorularResolveGuard"]]
    },
    {
        path: 'birim/:birimNo',
        component: _sorular_component__WEBPACK_IMPORTED_MODULE_2__["SorularComponent"],
        canActivate: [_soru_store_guards_sorular_resolve_guard__WEBPACK_IMPORTED_MODULE_26__["SorularResolveGuard"]]
    },
    {
        path: 'program/:programNo',
        component: _sorular_component__WEBPACK_IMPORTED_MODULE_2__["SorularComponent"],
        canActivate: [_soru_store_guards_sorular_resolve_guard__WEBPACK_IMPORTED_MODULE_26__["SorularResolveGuard"]]
    },
    {
        path: 'program/:programNo/donem/:donemNo',
        component: _sorular_component__WEBPACK_IMPORTED_MODULE_2__["SorularComponent"],
        canActivate: [_soru_store_guards_sorular_resolve_guard__WEBPACK_IMPORTED_MODULE_26__["SorularResolveGuard"]]
    },
    {
        path: 'program/:programNo/donem/:donemNo/ders/:dersNo',
        component: _sorular_component__WEBPACK_IMPORTED_MODULE_2__["SorularComponent"],
        canActivate: [_soru_store_guards_sorular_resolve_guard__WEBPACK_IMPORTED_MODULE_26__["SorularResolveGuard"]]
    },
    {
        path: 'program/:programNo/donem/:donemNo/ders/:dersNo/konu/:konuNo',
        component: _sorular_component__WEBPACK_IMPORTED_MODULE_2__["SorularComponent"],
        canActivate: [_soru_store_guards_sorular_resolve_guard__WEBPACK_IMPORTED_MODULE_26__["SorularResolveGuard"]]
    },
    {
        path: 'ders/:dersNo/konu/:konuNo/soru/:soruId',
        component: _sorular_component__WEBPACK_IMPORTED_MODULE_2__["SorularComponent"],
        canActivate: [_soru_store_guards_sorular_resolve_guard__WEBPACK_IMPORTED_MODULE_26__["SorularResolveGuard"]]
    },
    {
        path: 'ders/:dersNo/soru/:soruId',
        component: _sorular_component__WEBPACK_IMPORTED_MODULE_2__["SorularComponent"],
        canActivate: [_soru_store_guards_sorular_resolve_guard__WEBPACK_IMPORTED_MODULE_26__["SorularResolveGuard"]]
    },
    {
        path: 'soru/:soruId',
        component: _sorular_component__WEBPACK_IMPORTED_MODULE_2__["SorularComponent"],
        canActivate: [_soru_store_guards_sorular_resolve_guard__WEBPACK_IMPORTED_MODULE_26__["SorularResolveGuard"]]
    },
    {
        path: '**',
        redirectTo: ''
    },
];
var SorularModule = /** @class */ (function () {
    function SorularModule() {
    }
    SorularModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_22__["RouterModule"].forChild(routes),
                _soru_store_soru_store_module__WEBPACK_IMPORTED_MODULE_4__["SoruStoreModule"],
                _material_module__WEBPACK_IMPORTED_MODULE_8__["MaterialModule"],
                _fuse_shared_module__WEBPACK_IMPORTED_MODULE_10__["FuseSharedModule"],
                _core_sb_core_module__WEBPACK_IMPORTED_MODULE_9__["SbCoreModule"],
                _ncstate_sat_popover__WEBPACK_IMPORTED_MODULE_30__["SatPopoverModule"],
                _fuse_components__WEBPACK_IMPORTED_MODULE_17__["FuseWidgetModule"],
                _fuse_components__WEBPACK_IMPORTED_MODULE_17__["FuseConfirmDialogModule"],
                _fuse_components__WEBPACK_IMPORTED_MODULE_17__["FuseNavigationModule"]
            ],
            declarations: [
                _sorular_component__WEBPACK_IMPORTED_MODULE_2__["SorularComponent"],
                _coktan_secmeli_soru_coktan_secmeli_soru_component__WEBPACK_IMPORTED_MODULE_6__["CoktanSecmeliSoruComponent"],
                _anahtar_kelimeler_anahtar_kelimeler_component__WEBPACK_IMPORTED_MODULE_7__["AnahtarKelimelerComponent"],
                _ogrenim_hedefleri_ogrenim_hedefleri_component__WEBPACK_IMPORTED_MODULE_11__["OgrenimHedefleriComponent"],
                _ogrenim_hedefleri_ogrenim_hedef_list_ogrenim_hedef_list_component__WEBPACK_IMPORTED_MODULE_12__["OgrenimHedefListComponent"],
                _ogrenim_hedefleri_ogrenim_hedef_list_ogrenim_hedef_satir_ogrenim_hedef_satir_component__WEBPACK_IMPORTED_MODULE_13__["OgrenimHedefSatirComponent"],
                _coktan_secmeli_soru_tek_dogrulu_secenek_tek_dogrulu_secenek_component__WEBPACK_IMPORTED_MODULE_14__["TekDogruluSecenekComponent"],
                _coktan_secmeli_soru_tek_dogrulu_secenek_tek_dogrulu_secenek_detay_tek_dogrulu_secenek_detay_component__WEBPACK_IMPORTED_MODULE_15__["TekDogruluSecenekDetayComponent"],
                _sb_html_editor_sb_html_editor_component__WEBPACK_IMPORTED_MODULE_16__["SbHtmlEditorComponent"],
                _coktan_secmeli_soru_tek_dogrulu_secenek_tek_dogrulu_secenek_list_tek_dogrulu_secenek_list_component__WEBPACK_IMPORTED_MODULE_18__["TekDogruluSecenekListComponent"],
                _coktan_secmeli_soru_tek_dogrulu_secenek_tek_dogrulu_secenek_list_tek_dogrulu_secenek_item_tek_dogrulu_secenek_item_component__WEBPACK_IMPORTED_MODULE_19__["TekDogruluSecenekItemComponent"],
                _soru_detay_soru_detay_component__WEBPACK_IMPORTED_MODULE_20__["SoruDetayComponent"],
                _sorular_side_nav_sorular_side_nav_component__WEBPACK_IMPORTED_MODULE_21__["SorularSideNavComponent"],
                _soru_listesi_soru_listesi_component__WEBPACK_IMPORTED_MODULE_23__["SoruListesiComponent"],
                _soru_listesi_soru_listesi_satiri_soru_listesi_satiri_component__WEBPACK_IMPORTED_MODULE_24__["SoruListesiSatiriComponent"],
                _soru_onizleme_soru_onizleme_component__WEBPACK_IMPORTED_MODULE_27__["SoruOnizlemeComponent"],
                _sorular_side_nav_yeni_soru_btn_yeni_soru_btn_component__WEBPACK_IMPORTED_MODULE_29__["YeniSoruBtnComponent"],
                _coktan_secmeli_iliskili_soru_coktan_secmeli_iliskili_soru_component__WEBPACK_IMPORTED_MODULE_31__["CoktanSecmeliIliskiliSoruComponent"],
                _coktan_secmeli_iliskili_soru_iliskili_soru_listesi_iliskili_soru_listesi_component__WEBPACK_IMPORTED_MODULE_32__["IliskiliSoruListesiComponent"],
                _coktan_secmeli_iliskili_soru_iliskili_soru_listesi_iliskili_soru_item_iliskili_soru_item_component__WEBPACK_IMPORTED_MODULE_33__["IliskiliSoruItemComponent"]
            ],
            providers: [
                _soru_store_effects_sorular_effects_service__WEBPACK_IMPORTED_MODULE_5__["SorularEffectsService"],
                _soru_store_helpers_soru_depo_veri_service__WEBPACK_IMPORTED_MODULE_25__["SoruDepoVeriService"],
                _sorular_service__WEBPACK_IMPORTED_MODULE_3__["SorularService"],
                _coktan_secmeli_soru_validators__WEBPACK_IMPORTED_MODULE_28__["CoktanSecmeliSoruValidatorleri"],
                _soru_store_guards_sorular_resolve_guard__WEBPACK_IMPORTED_MODULE_26__["SorularResolveGuard"]
            ],
            entryComponents: [_soru_onizleme_soru_onizleme_component__WEBPACK_IMPORTED_MODULE_27__["SoruOnizlemeComponent"], _coktan_secmeli_soru_coktan_secmeli_soru_component__WEBPACK_IMPORTED_MODULE_6__["CoktanSecmeliSoruComponent"]]
        })
    ], SorularModule);
    return SorularModule;
}());



/***/ }),

/***/ "./src/app/main/content/apps/sorular/sorular.service.ts":
/*!**************************************************************!*\
  !*** ./src/app/main/content/apps/sorular/sorular.service.ts ***!
  \**************************************************************/
/*! exports provided: SorularService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SorularService", function() { return SorularService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _store_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../store/index */ "./src/app/store/index.ts");
/* harmony import */ var _soru_store_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./soru-store/index */ "./src/app/main/content/apps/sorular/soru-store/index.ts");
/* harmony import */ var _models_sb_navigation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../models/sb-navigation */ "./src/app/models/sb-navigation.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var SorularService = /** @class */ (function () {
    function SorularService(http, store) {
        var _this = this;
        this.http = http;
        this.store = store;
        this.baseUrl = environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].apiUrl;
        this.sorularUrl = 'sorular';
        this.store.select(_soru_store_index__WEBPACK_IMPORTED_MODULE_5__["getDersler"]).subscribe(function (dersler) {
            _this.dersler = dersler;
        });
        this.store.select(_store_index__WEBPACK_IMPORTED_MODULE_4__["getAuthState"]).subscribe(function (auth) {
            _this.kb = auth.kullaniciBilgi;
        });
        this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_5__["GetDersler"]());
    }
    SorularService.prototype.createQuery = function (handle) {
        var str = '?';
        handle.forEach(function (h) {
            str = str + (h.id + "=" + h.value + "&");
        });
        return str.substr(0, str.length - 1);
    };
    SorularService.prototype.getDersinSorulari = function (dersNo) {
        var adres = this.baseUrl + "/" + this.sorularUrl + "?dersNo=dersNo";
        return this.http.get(adres);
    };
    SorularService.prototype.getKonununSorulari = function (konuNo) {
        var adres = this.baseUrl + "/" + this.sorularUrl + "?konuNo=KonuNo";
        return this.http.get(adres);
    };
    SorularService.prototype.getSoruById = function (soruId) {
        var adres = this.baseUrl + "/" + this.sorularUrl + "/sorual/" + soruId;
        return this.http.get(adres);
    };
    SorularService.prototype.dersBul = function (dersNo) {
        var donecekDers = null;
        if (dersNo > 0 && this.dersler.length > 0) {
            this.dersler.forEach(function (ders) {
                // tslint:disable-next-line:triple-equals
                if (ders.dersId == dersNo) {
                    donecekDers = ders;
                    return;
                }
            });
        }
        return donecekDers;
    };
    SorularService.prototype.formuNesneyeCevirKaydet = function (formData, degisecekSoru) {
        var kaydedilecekSoru = Object.assign({}, degisecekSoru, formData.getRawValue());
        kaydedilecekSoru.tekDogruluSecenekleri = formData.get('secenekler').value;
        kaydedilecekSoru.hemenElenebilirSecenekSayisi = formData.get('hemenElenebilirSecenekSayisi').value;
        kaydedilecekSoru.baslangic = formData.get('gecerlilik.baslangic').value;
        kaydedilecekSoru.bitis = formData.get('gecerlilik.bitis').value;
        this.store.dispatch(new _soru_store_index__WEBPACK_IMPORTED_MODULE_5__["UpdateSoru"](kaydedilecekSoru));
    };
    SorularService.prototype.createNavigationTree = function (seciliBirim) {
        var navItems = [];
        if (!seciliBirim) {
            return navItems;
        }
        seciliBirim.programlari.forEach(function (program) {
            var programItem = new _models_sb_navigation__WEBPACK_IMPORTED_MODULE_6__["SbNavitaionItem"]();
            programItem.id = program.programId.toString();
            programItem.title = program.programAdi;
            programItem.type = 'group';
            programItem.icon = 'account_balance';
            programItem.url = "sorudeposu/program/" + program.programId;
            programItem.exactMatch = true;
            programItem.children = [];
            program.donemleri.forEach(function (donem) {
                var donemItem = new _models_sb_navigation__WEBPACK_IMPORTED_MODULE_6__["SbNavitaionItem"]();
                donemItem.id = donem.donemId.toString();
                donemItem.title = donem.sinifi + ". s\u0131n\u0131f, " + donem.donemAdi;
                donemItem.type = 'group';
                donemItem.icon = 'event';
                donemItem.url = programItem.url + "+/donem/" + donem.donemId;
                donemItem.exactMatch = true;
                donem.dersGruplari.forEach(function (dersGrubu) {
                    var dersGrubuItem = new _models_sb_navigation__WEBPACK_IMPORTED_MODULE_6__["SbNavitaionItem"]();
                    dersGrubuItem.id = dersGrubu.dersGrupId.toString();
                    dersGrubuItem.title = dersGrubu.grupAdi;
                    donemItem.type = 'group';
                    if (dersGrubu.staj || dersGrubu.dersKurulu) {
                        dersGrubuItem.icon = 'content_copy';
                    }
                    else {
                        dersGrubuItem.icon = 'folder';
                    }
                    dersGrubuItem.url = donemItem.url + "/dersgrubu/" + dersGrubu.dersGrupId;
                    dersGrubu.dersleri.forEach(function (ders) {
                        var dersItem = new _models_sb_navigation__WEBPACK_IMPORTED_MODULE_6__["SbNavitaionItem"]();
                        dersItem.id = ders.dersId.toString();
                        dersItem.title = ders.dersAdi;
                        dersItem.icon = 'book';
                        dersItem.url = dersGrubuItem.url + "/ders/" + ders.dersId;
                        if (ders.konulari) {
                            dersItem.type = 'group';
                        }
                        else {
                            dersItem.type = 'item';
                        }
                        ders.konulari.forEach(function (konu) {
                            var konuItem = new _models_sb_navigation__WEBPACK_IMPORTED_MODULE_6__["SbNavitaionItem"]();
                            konuItem.id = konu.konuId.toString();
                            konuItem.title = konu.konuAdi;
                            konuItem.type = 'item';
                            konuItem.url = dersItem.url + "/konu/" + konu.konuId;
                            dersItem.children.push(konuItem);
                        });
                        dersGrubuItem.children.push(dersItem);
                    });
                    donemItem.children.push(dersGrubuItem);
                });
                programItem.children.push(donemItem);
            });
            navItems.push(programItem);
        });
    };
    SorularService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"]])
    ], SorularService);
    return SorularService;
}());



/***/ }),

/***/ "./src/app/models/sb-navigation.ts":
/*!*****************************************!*\
  !*** ./src/app/models/sb-navigation.ts ***!
  \*****************************************/
/*! exports provided: SbNavitaionItem, SbNavigationBadge */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SbNavitaionItem", function() { return SbNavitaionItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SbNavigationBadge", function() { return SbNavigationBadge; });
var SbNavitaionItem = /** @class */ (function () {
    function SbNavitaionItem() {
        this.children = [];
    }
    return SbNavitaionItem;
}());

var SbNavigationBadge = /** @class */ (function () {
    function SbNavigationBadge() {
    }
    return SbNavigationBadge;
}());



/***/ })

}]);
//# sourceMappingURL=sorular-sorular-module.js.map