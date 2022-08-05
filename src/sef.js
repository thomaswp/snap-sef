/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/BlockFactory.ts":
/*!************************************!*\
  !*** ./src/blocks/BlockFactory.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BlockFactory = void 0;
var OverrideRegistry_1 = __webpack_require__(/*! ../extend/OverrideRegistry */ "./src/extend/OverrideRegistry.ts");
var Snap_1 = __webpack_require__(/*! ../snap/Snap */ "./src/snap/Snap.js");
var BlockFactory = /** @class */ (function () {
    function BlockFactory() {
        this.blocks = [];
        this.needsInit = false;
        this.blocks = [];
        this.needsInit = false;
        var myBlocks = this.blocks;
        var override = function (base, category) {
            var _this = this;
            var blocks = base.call(this, category);
            var checkSprite = this instanceof Snap_1.StageMorph;
            var added = 0;
            myBlocks.forEach(function (block) {
                if (block.category === category &&
                    !(checkSprite && block.spriteOnly)) {
                    if (block.top) {
                        blocks.splice(added, 0, block.toBlockMorph());
                        blocks.splice(added, 0, block.toToggle(_this));
                        added++;
                    }
                    else {
                        blocks.push(block.toToggle(_this));
                        blocks.push(block.toBlockMorph());
                    }
                }
            });
            return blocks;
        };
        OverrideRegistry_1.OverrideRegistry.extend(Snap_1.SpriteMorph, 'initBlocks', function (base) {
            base.call(this);
            myBlocks.forEach(function (block) {
                block.addToMap(Snap_1.SpriteMorph.prototype.blocks);
            });
        });
        OverrideRegistry_1.OverrideRegistry.extend(Snap_1.SpriteMorph, 'blockTemplates', override);
        OverrideRegistry_1.OverrideRegistry.extend(Snap_1.StageMorph, 'blockTemplates', override);
        this.refresh();
    }
    BlockFactory.prototype.registerBlock = function (block) {
        this.blocks.push(block);
        this.refresh();
    };
    BlockFactory.prototype.refresh = function () {
        var _this = this;
        if (this.needsInit)
            return;
        this.needsInit = true;
        setTimeout(function () {
            Snap_1.SpriteMorph.prototype.initBlocks();
            _this.needsInit = false;
        }, 1);
    };
    BlockFactory.prototype.addCategory = function (name, color) {
        Snap_1.SpriteMorph.prototype.categories.push(name);
        Snap_1.SpriteMorph.prototype.blockColor[name] = color;
    };
    return BlockFactory;
}());
exports.BlockFactory = BlockFactory;
var Block = /** @class */ (function () {
    function Block(selector, spec, defaults, type, category, spriteOnly, top, togglable) {
        this.selector = selector;
        this.spec = spec;
        this.defaults = defaults;
        this.type = type;
        this.category = category;
        this.spriteOnly = spriteOnly;
        this.top = top || false;
        this.togglable = togglable || false;
    }
    Block.prototype.addToMap = function (map) {
        map[this.selector] = {
            only: this.spriteOnly ? Snap_1.SpriteMorph : undefined,
            type: this.type,
            category: this.category,
            spec: (0, Snap_1.localize)(this.spec),
            defaults: this.defaults,
        };
    };
    Block.prototype.toBlockMorph = function () {
        if (Snap_1.StageMorph.prototype.hiddenPrimitives[this.selector]) {
            return null;
        }
        var newBlock = Snap_1.StageMorph.prototype.blockForSelector(this.selector, true);
        if (!newBlock) {
            console.warn('Cannot initialize block', this.selector);
            return null;
        }
        newBlock.isTemplate = true;
        return newBlock;
    };
    Block.prototype.toToggle = function (sprite) {
        if (!this.togglable)
            return null;
        var selector = this.selector;
        if (Snap_1.StageMorph.prototype.hiddenPrimitives[selector]) {
            return null;
        }
        var info = Snap_1.StageMorph.prototype.blocks[selector];
        return new Snap_1.ToggleMorph('checkbox', this, function () {
            sprite.toggleWatcher(selector, (0, Snap_1.localize)(info.spec), sprite.blockColor[info.category]);
        }, null, function () {
            return sprite.showingWatcher(selector);
        }, null);
    };
    Block.prototype.addSpriteAction = function (action) {
        Snap_1.SpriteMorph.prototype[this.selector] =
            Snap_1.StageMorph.prototype[this.selector] = action;
        return this;
    };
    return Block;
}());


/***/ }),

/***/ "./src/events/SnapEvent.ts":
/*!*********************************!*\
  !*** ./src/events/SnapEvent.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventManager = exports.SnapEvents = void 0;
var SnapEvents;
(function (SnapEvents) {
})(SnapEvents = exports.SnapEvents || (exports.SnapEvents = {}));
var EventManager = /** @class */ (function () {
    function EventManager() {
    }
    EventManager.prototype.trigger = function (type) {
        console.log(type);
    };
    return EventManager;
}());
exports.EventManager = EventManager;


/***/ }),

/***/ "./src/extend/OverrideRegistry.ts":
/*!****************************************!*\
  !*** ./src/extend/OverrideRegistry.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OverrideRegistry = void 0;
var OverrideRegistry = /** @class */ (function () {
    function OverrideRegistry() {
    }
    OverrideRegistry.extend = function (clazz, functionName, newFunction) {
        if (!clazz || !clazz.prototype) {
            // eslint-disable-next-line no-console
            console.error('extend requires a class for its first argument');
            return;
        }
        return OverrideRegistry.extendObject(clazz.prototype, functionName, newFunction);
    };
    OverrideRegistry.extendObject = function (object, functionName, newFunction) {
        if (!object[functionName]) {
            // eslint-disable-next-line no-console
            console.trace();
            // eslint-disable-next-line no-console
            console.error('Cannot extend function ' + functionName +
                ' because it does not exist.');
            return;
        }
        var oldFunction = object[functionName];
        if (!oldFunction.extended && oldFunction.length != undefined &&
            oldFunction.length + 1 !== newFunction.length) {
            var message = 'Extending function with wrong number of arguments: ' +
                functionName + ' ' +
                oldFunction.length + ' vs ' + newFunction.length;
            console.error(message);
        }
        object[functionName] = function () {
            var args = [].slice.call(arguments);
            args.unshift(oldFunction);
            return newFunction.apply(this, args);
        };
        object[functionName].extended = true;
        return oldFunction;
    };
    return OverrideRegistry;
}());
exports.OverrideRegistry = OverrideRegistry;


/***/ }),

/***/ "./src/meta/DefGenerator.ts":
/*!**********************************!*\
  !*** ./src/meta/DefGenerator.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports) {


var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefGenerator = void 0;
var DefGenerator = /** @class */ (function () {
    function DefGenerator() {
        this.classes = new Map;
    }
    DefGenerator.prototype.init = function () {
        var e_1, _a;
        var _this = this;
        try {
            for (var _b = __values(Object.keys(window)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                // console.log(key);
                if (!window.hasOwnProperty(key))
                    continue;
                var value = window[key];
                if (!(value instanceof Function))
                    continue;
                if (!value.prototype)
                    continue;
                if (value.name.length == 0)
                    continue;
                this.classes.set(key, new ClassDef(value));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.classes.forEach(function (c) { return c.addParentData(_this.classes); });
        console.log(this.outputDefinitions());
        console.log(this);
    };
    DefGenerator.prototype.outputExports = function () {
        return __spreadArray([], __read(this.classes.values()), false).map(function (c) { return c.exportStatement(); }).join('\n');
    };
    DefGenerator.prototype.outputDefinitions = function () {
        return "\nexport class SnapType {\n    prototype: any;\n    [key: string]: any;\n}\n\n" + __spreadArray([], __read(this.classes.values()), false).map(function (c) { return c.toTS(); }).join('\n\n');
    };
    DefGenerator.prototype.downloadAll = function () {
        this.downloadFile('Snap.js', this.outputExports());
        this.downloadFile('Snap.d.ts', this.outputDefinitions());
    };
    DefGenerator.prototype.downloadFile = function (filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
    return DefGenerator;
}());
exports.DefGenerator = DefGenerator;
var ClassDef = /** @class */ (function () {
    function ClassDef(func) {
        var e_2, _a;
        var _b, _c;
        this.uber = null;
        this.fields = new Map; //[] as Field[];
        this.methods = new Map;
        this.addedParentData = false;
        this.baseFunction = func;
        this.name = func.name;
        var proto = func.prototype;
        if (!proto)
            return;
        if (__spreadArray([], __read(Object.keys(proto)), false).length <= 1) {
            this.functionProxy = new Method(this.name, func);
            return;
        }
        this.uber = (_c = (_b = func['uber']) === null || _b === void 0 ? void 0 : _b.constructor) === null || _c === void 0 ? void 0 : _c.name;
        this.inferFields(func);
        try {
            for (var _d = __values(Object.getOwnPropertyNames(proto)), _e = _d.next(); !_e.done; _e = _d.next()) {
                var key = _e.value;
                // I think this is redundant...
                if (!proto.hasOwnProperty(key))
                    continue;
                var value = proto[key];
                if (value instanceof Function) {
                    this.methods.set(key, new Method(key, value));
                }
                else {
                    // TODO: distinguish between inherited fields and static fields
                    // this.fields.push(new Field(key, value, true));
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.inferFields(proto['init']);
    }
    ClassDef.prototype.addParentData = function (classes) {
        var e_3, _a, e_4, _b;
        if (this.addedParentData)
            return;
        this.addedParentData = true;
        if (this.functionProxy)
            return;
        if (!this.uber || !classes.has(this.uber))
            return;
        var parent = classes.get(this.uber);
        if (!parent.addedParentData)
            parent.addParentData(classes);
        try {
            for (var _c = __values(parent.methods), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), methodName = _e[0], method = _e[1];
                if (this.methods.has(methodName))
                    continue;
                this.methods.set(methodName, method);
                // If a field overshadows a parent method, it was probably
                // a mistake, so delete it.
                // TODO: Not sure this is the right call; could ignore inheritance
                this.fields.delete(methodName);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            for (var _f = __values(parent.fields), _g = _f.next(); !_g.done; _g = _f.next()) {
                var _h = __read(_g.value, 2), fieldName = _h[0], field = _h[1];
                // Don't copy fields that have shadowing methods
                if (this.methods.has(fieldName))
                    continue;
                if (this.fields.has(fieldName))
                    continue;
                this.fields.set(fieldName, field);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    ClassDef.prototype.inferFields = function (func) {
        var e_5, _a;
        if (!func)
            return;
        var js = func.toString();
        var varDec = /^\s*this\s*\.\s*([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=/gm;
        try {
            for (var _b = __values(js.matchAll(varDec)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var match = _c.value;
                var name_1 = match[1];
                if (this.fields.has(name_1))
                    continue;
                // Give precedence to methods
                if (this.methods.has(name_1))
                    continue;
                this.fields.set(name_1, new Field(name_1, null, false));
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
    };
    ClassDef.prototype.exportStatement = function () {
        return "export const ".concat(this.name, " = window['").concat(this.name, "'];");
    };
    ClassDef.prototype.toTS = function () {
        var e_6, _a, e_7, _b;
        if (this.functionProxy) {
            return "export function ".concat(this.functionProxy.toTS());
        }
        // let code = `export class ${this.name} extends ${this.uber ? this.uber : 'SnapType'}`;
        // TODO: Because Typescript seems not to allow function shadowing,
        // need to manually define all parent types and methods (that aren't shadowed) here
        var code = "export class ".concat(this.name, " extends SnapType");
        code += " {\n";
        try {
            for (var _c = __values(this.fields.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var field = _d.value;
                code += '    ' + field.toTS() + '\n';
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_6) throw e_6.error; }
        }
        code += '\n';
        try {
            for (var _e = __values(this.methods.values()), _f = _e.next(); !_f.done; _f = _e.next()) {
                var method = _f.value;
                code += '    ' + method.toTS() + '\n';
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_7) throw e_7.error; }
        }
        code += '}';
        return code;
    };
    return ClassDef;
}());
var Field = /** @class */ (function () {
    function Field(name, value, isStatic) {
        this.name = name;
        this.isStatic = isStatic;
        this.type = 'any';
        if (value !== null && value !== undefined) {
            this.type = typeof (value);
        }
    }
    Field.prototype.toTS = function () {
        return "".concat(this.isStatic ? 'static ' : '').concat(this.name, ": ").concat(this.type, ";");
    };
    return Field;
}());
var Method = /** @class */ (function () {
    function Method(name, func) {
        this.name = name;
        this.paramNames = this.getParamNames(func);
    }
    Method.prototype.getParamNames = function (func) {
        var fnStr = func.toString().replace(Method.STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(Method.ARGUMENT_NAMES);
        if (result === null)
            result = [];
        result = result.filter(function (param) { return param.match(/^[a-zA-Z_$][0-9a-zA-Z_$]*$/); });
        return result;
    };
    Method.prototype.toTS = function () {
        var e_8, _a;
        var override = this.checkOverride();
        if (override)
            return override;
        var code = "".concat(this.name, "(");
        var first = true;
        try {
            for (var _b = __values(this.paramNames), _c = _b.next(); !_c.done; _c = _b.next()) {
                var name_2 = _c.value;
                if (!first)
                    code += ', ';
                first = false;
                code += "".concat(name_2, "?: any");
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_8) throw e_8.error; }
        }
        code += ');';
        return code;
    };
    Method.prototype.checkOverride = function () {
        switch (this.name) {
            case 'childThatIsA': return "".concat(this.name, "(...args: any[]);");
        }
        return null;
    };
    Method.STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
    Method.ARGUMENT_NAMES = /([^\s,]+)/g;
    return Method;
}());


/***/ }),

/***/ "./src/snap/SnapHelper.ts":
/*!********************************!*\
  !*** ./src/snap/SnapHelper.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SnapHelper = void 0;
var SnapTypes_1 = __webpack_require__(/*! ./SnapTypes */ "./src/snap/SnapTypes.ts");
var SnapHelper = /** @class */ (function () {
    function SnapHelper() {
        this._snap = new SnapTypes_1.SnapTypes();
    }
    SnapHelper.prototype.snap = function () {
        return this._snap;
    };
    return SnapHelper;
}());
exports.SnapHelper = SnapHelper;


/***/ }),

/***/ "./src/snap/SnapTypes.ts":
/*!*******************************!*\
  !*** ./src/snap/SnapTypes.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SnapTypes = void 0;
// TODO: Make an interface with an implementation that fetches from window
var SnapTypes = /** @class */ (function () {
    function SnapTypes() {
    }
    SnapTypes.prototype.world = function () {
        return window["world"];
    };
    SnapTypes.prototype.IDE = function () {
        return this.world().childThatIsA(window['IDE_Morph']);
    };
    SnapTypes.prototype.stage = function () {
        return this.IDE().stage;
    };
    return SnapTypes;
}());
exports.SnapTypes = SnapTypes;


/***/ }),

/***/ "./src/snap/Snap.js":
/*!**************************!*\
  !*** ./src/snap/Snap.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AlignmentMorph": () => (/* binding */ AlignmentMorph),
/* harmony export */   "Animation": () => (/* binding */ Animation),
/* harmony export */   "ArgLabelMorph": () => (/* binding */ ArgLabelMorph),
/* harmony export */   "ArgMorph": () => (/* binding */ ArgMorph),
/* harmony export */   "ArrowMorph": () => (/* binding */ ArrowMorph),
/* harmony export */   "BlinkerMorph": () => (/* binding */ BlinkerMorph),
/* harmony export */   "BlockDialogMorph": () => (/* binding */ BlockDialogMorph),
/* harmony export */   "BlockEditorMorph": () => (/* binding */ BlockEditorMorph),
/* harmony export */   "BlockExportDialogMorph": () => (/* binding */ BlockExportDialogMorph),
/* harmony export */   "BlockHighlightMorph": () => (/* binding */ BlockHighlightMorph),
/* harmony export */   "BlockImportDialogMorph": () => (/* binding */ BlockImportDialogMorph),
/* harmony export */   "BlockInputFragmentMorph": () => (/* binding */ BlockInputFragmentMorph),
/* harmony export */   "BlockLabelFragment": () => (/* binding */ BlockLabelFragment),
/* harmony export */   "BlockLabelFragmentMorph": () => (/* binding */ BlockLabelFragmentMorph),
/* harmony export */   "BlockLabelMorph": () => (/* binding */ BlockLabelMorph),
/* harmony export */   "BlockLabelPlaceHolderMorph": () => (/* binding */ BlockLabelPlaceHolderMorph),
/* harmony export */   "BlockMorph": () => (/* binding */ BlockMorph),
/* harmony export */   "BlockRemovalDialogMorph": () => (/* binding */ BlockRemovalDialogMorph),
/* harmony export */   "BlockSymbolMorph": () => (/* binding */ BlockSymbolMorph),
/* harmony export */   "BlockVisibilityDialogMorph": () => (/* binding */ BlockVisibilityDialogMorph),
/* harmony export */   "BooleanSlotMorph": () => (/* binding */ BooleanSlotMorph),
/* harmony export */   "BouncerMorph": () => (/* binding */ BouncerMorph),
/* harmony export */   "BoxMorph": () => (/* binding */ BoxMorph),
/* harmony export */   "CSlotMorph": () => (/* binding */ CSlotMorph),
/* harmony export */   "CamSnapshotDialogMorph": () => (/* binding */ CamSnapshotDialogMorph),
/* harmony export */   "CellMorph": () => (/* binding */ CellMorph),
/* harmony export */   "CircleBoxMorph": () => (/* binding */ CircleBoxMorph),
/* harmony export */   "Cloud": () => (/* binding */ Cloud),
/* harmony export */   "Color": () => (/* binding */ Color),
/* harmony export */   "ColorPaletteMorph": () => (/* binding */ ColorPaletteMorph),
/* harmony export */   "ColorPickerMorph": () => (/* binding */ ColorPickerMorph),
/* harmony export */   "ColorSlotMorph": () => (/* binding */ ColorSlotMorph),
/* harmony export */   "CommandBlockMorph": () => (/* binding */ CommandBlockMorph),
/* harmony export */   "CommandSlotMorph": () => (/* binding */ CommandSlotMorph),
/* harmony export */   "CommentMorph": () => (/* binding */ CommentMorph),
/* harmony export */   "Context": () => (/* binding */ Context),
/* harmony export */   "Costume": () => (/* binding */ Costume),
/* harmony export */   "CostumeEditorMorph": () => (/* binding */ CostumeEditorMorph),
/* harmony export */   "CostumeIconMorph": () => (/* binding */ CostumeIconMorph),
/* harmony export */   "Crosshair": () => (/* binding */ Crosshair),
/* harmony export */   "CursorMorph": () => (/* binding */ CursorMorph),
/* harmony export */   "CustomBlockDefinition": () => (/* binding */ CustomBlockDefinition),
/* harmony export */   "CustomCommandBlockMorph": () => (/* binding */ CustomCommandBlockMorph),
/* harmony export */   "CustomReporterBlockMorph": () => (/* binding */ CustomReporterBlockMorph),
/* harmony export */   "DialMorph": () => (/* binding */ DialMorph),
/* harmony export */   "DialogBoxMorph": () => (/* binding */ DialogBoxMorph),
/* harmony export */   "FrameMorph": () => (/* binding */ FrameMorph),
/* harmony export */   "FunctionSlotMorph": () => (/* binding */ FunctionSlotMorph),
/* harmony export */   "GrayPaletteMorph": () => (/* binding */ GrayPaletteMorph),
/* harmony export */   "HandMorph": () => (/* binding */ HandMorph),
/* harmony export */   "HandleMorph": () => (/* binding */ HandleMorph),
/* harmony export */   "HatBlockMorph": () => (/* binding */ HatBlockMorph),
/* harmony export */   "IDE_Morph": () => (/* binding */ IDE_Morph),
/* harmony export */   "InputFieldMorph": () => (/* binding */ InputFieldMorph),
/* harmony export */   "InputSlotDialogMorph": () => (/* binding */ InputSlotDialogMorph),
/* harmony export */   "InputSlotMorph": () => (/* binding */ InputSlotMorph),
/* harmony export */   "InputSlotStringMorph": () => (/* binding */ InputSlotStringMorph),
/* harmony export */   "InputSlotTextMorph": () => (/* binding */ InputSlotTextMorph),
/* harmony export */   "InspectorMorph": () => (/* binding */ InspectorMorph),
/* harmony export */   "JSCompiler": () => (/* binding */ JSCompiler),
/* harmony export */   "JaggedBlockMorph": () => (/* binding */ JaggedBlockMorph),
/* harmony export */   "JukeboxMorph": () => (/* binding */ JukeboxMorph),
/* harmony export */   "LibraryImportDialogMorph": () => (/* binding */ LibraryImportDialogMorph),
/* harmony export */   "List": () => (/* binding */ List),
/* harmony export */   "ListMorph": () => (/* binding */ ListMorph),
/* harmony export */   "ListWatcherMorph": () => (/* binding */ ListWatcherMorph),
/* harmony export */   "Localizer": () => (/* binding */ Localizer),
/* harmony export */   "MenuItemMorph": () => (/* binding */ MenuItemMorph),
/* harmony export */   "MenuMorph": () => (/* binding */ MenuMorph),
/* harmony export */   "Microphone": () => (/* binding */ Microphone),
/* harmony export */   "Morph": () => (/* binding */ Morph),
/* harmony export */   "MouseSensorMorph": () => (/* binding */ MouseSensorMorph),
/* harmony export */   "MultiArgMorph": () => (/* binding */ MultiArgMorph),
/* harmony export */   "Node": () => (/* binding */ Node),
/* harmony export */   "Note": () => (/* binding */ Note),
/* harmony export */   "PaintCanvasMorph": () => (/* binding */ PaintCanvasMorph),
/* harmony export */   "PaintColorPickerMorph": () => (/* binding */ PaintColorPickerMorph),
/* harmony export */   "PaintEditorMorph": () => (/* binding */ PaintEditorMorph),
/* harmony export */   "PaletteHandleMorph": () => (/* binding */ PaletteHandleMorph),
/* harmony export */   "PenMorph": () => (/* binding */ PenMorph),
/* harmony export */   "PianoKeyMorph": () => (/* binding */ PianoKeyMorph),
/* harmony export */   "PianoMenuMorph": () => (/* binding */ PianoMenuMorph),
/* harmony export */   "Point": () => (/* binding */ Point),
/* harmony export */   "Process": () => (/* binding */ Process),
/* harmony export */   "Project": () => (/* binding */ Project),
/* harmony export */   "ProjectDialogMorph": () => (/* binding */ ProjectDialogMorph),
/* harmony export */   "ProjectRecoveryDialogMorph": () => (/* binding */ ProjectRecoveryDialogMorph),
/* harmony export */   "PrototypeHatBlockMorph": () => (/* binding */ PrototypeHatBlockMorph),
/* harmony export */   "PushButtonMorph": () => (/* binding */ PushButtonMorph),
/* harmony export */   "ReadStream": () => (/* binding */ ReadStream),
/* harmony export */   "Rectangle": () => (/* binding */ Rectangle),
/* harmony export */   "ReporterBlockMorph": () => (/* binding */ ReporterBlockMorph),
/* harmony export */   "ReporterSlotMorph": () => (/* binding */ ReporterSlotMorph),
/* harmony export */   "RingCommandSlotMorph": () => (/* binding */ RingCommandSlotMorph),
/* harmony export */   "RingMorph": () => (/* binding */ RingMorph),
/* harmony export */   "RingReporterSlotMorph": () => (/* binding */ RingReporterSlotMorph),
/* harmony export */   "SVG_Costume": () => (/* binding */ SVG_Costume),
/* harmony export */   "Scene": () => (/* binding */ Scene),
/* harmony export */   "SceneAlbumMorph": () => (/* binding */ SceneAlbumMorph),
/* harmony export */   "SceneIconMorph": () => (/* binding */ SceneIconMorph),
/* harmony export */   "ScriptFocusMorph": () => (/* binding */ ScriptFocusMorph),
/* harmony export */   "ScriptsMorph": () => (/* binding */ ScriptsMorph),
/* harmony export */   "ScrollFrameMorph": () => (/* binding */ ScrollFrameMorph),
/* harmony export */   "ShadowMorph": () => (/* binding */ ShadowMorph),
/* harmony export */   "SliderButtonMorph": () => (/* binding */ SliderButtonMorph),
/* harmony export */   "SliderMorph": () => (/* binding */ SliderMorph),
/* harmony export */   "SnapSerializer": () => (/* binding */ SnapSerializer),
/* harmony export */   "Sound": () => (/* binding */ Sound),
/* harmony export */   "SoundIconMorph": () => (/* binding */ SoundIconMorph),
/* harmony export */   "SoundRecorderDialogMorph": () => (/* binding */ SoundRecorderDialogMorph),
/* harmony export */   "SpeechBubbleMorph": () => (/* binding */ SpeechBubbleMorph),
/* harmony export */   "SpriteBubbleMorph": () => (/* binding */ SpriteBubbleMorph),
/* harmony export */   "SpriteHighlightMorph": () => (/* binding */ SpriteHighlightMorph),
/* harmony export */   "SpriteIconMorph": () => (/* binding */ SpriteIconMorph),
/* harmony export */   "SpriteMorph": () => (/* binding */ SpriteMorph),
/* harmony export */   "StageHandleMorph": () => (/* binding */ StageHandleMorph),
/* harmony export */   "StageMorph": () => (/* binding */ StageMorph),
/* harmony export */   "StagePickerItemMorph": () => (/* binding */ StagePickerItemMorph),
/* harmony export */   "StagePickerMorph": () => (/* binding */ StagePickerMorph),
/* harmony export */   "StagePrompterMorph": () => (/* binding */ StagePrompterMorph),
/* harmony export */   "StringFieldMorph": () => (/* binding */ StringFieldMorph),
/* harmony export */   "StringMorph": () => (/* binding */ StringMorph),
/* harmony export */   "SymbolMorph": () => (/* binding */ SymbolMorph),
/* harmony export */   "SyntaxElementMorph": () => (/* binding */ SyntaxElementMorph),
/* harmony export */   "TabMorph": () => (/* binding */ TabMorph),
/* harmony export */   "Table": () => (/* binding */ Table),
/* harmony export */   "TableCellMorph": () => (/* binding */ TableCellMorph),
/* harmony export */   "TableDialogMorph": () => (/* binding */ TableDialogMorph),
/* harmony export */   "TableFrameMorph": () => (/* binding */ TableFrameMorph),
/* harmony export */   "TableMorph": () => (/* binding */ TableMorph),
/* harmony export */   "TemplateSlotMorph": () => (/* binding */ TemplateSlotMorph),
/* harmony export */   "TextMorph": () => (/* binding */ TextMorph),
/* harmony export */   "TextSlotMorph": () => (/* binding */ TextSlotMorph),
/* harmony export */   "ThreadManager": () => (/* binding */ ThreadManager),
/* harmony export */   "ToggleButtonMorph": () => (/* binding */ ToggleButtonMorph),
/* harmony export */   "ToggleElementMorph": () => (/* binding */ ToggleElementMorph),
/* harmony export */   "ToggleMorph": () => (/* binding */ ToggleMorph),
/* harmony export */   "TriggerMorph": () => (/* binding */ TriggerMorph),
/* harmony export */   "TurtleIconMorph": () => (/* binding */ TurtleIconMorph),
/* harmony export */   "Variable": () => (/* binding */ Variable),
/* harmony export */   "VariableDialogMorph": () => (/* binding */ VariableDialogMorph),
/* harmony export */   "VariableFrame": () => (/* binding */ VariableFrame),
/* harmony export */   "VectorEllipse": () => (/* binding */ VectorEllipse),
/* harmony export */   "VectorLine": () => (/* binding */ VectorLine),
/* harmony export */   "VectorPaintCanvasMorph": () => (/* binding */ VectorPaintCanvasMorph),
/* harmony export */   "VectorPaintEditorMorph": () => (/* binding */ VectorPaintEditorMorph),
/* harmony export */   "VectorPolygon": () => (/* binding */ VectorPolygon),
/* harmony export */   "VectorRectangle": () => (/* binding */ VectorRectangle),
/* harmony export */   "VectorSelection": () => (/* binding */ VectorSelection),
/* harmony export */   "VectorShape": () => (/* binding */ VectorShape),
/* harmony export */   "VideoMotion": () => (/* binding */ VideoMotion),
/* harmony export */   "WardrobeMorph": () => (/* binding */ WardrobeMorph),
/* harmony export */   "WatcherMorph": () => (/* binding */ WatcherMorph),
/* harmony export */   "WorldMap": () => (/* binding */ WorldMap),
/* harmony export */   "WorldMorph": () => (/* binding */ WorldMorph),
/* harmony export */   "XML_Element": () => (/* binding */ XML_Element),
/* harmony export */   "XML_Serializer": () => (/* binding */ XML_Serializer),
/* harmony export */   "contains": () => (/* binding */ contains),
/* harmony export */   "copy": () => (/* binding */ copy),
/* harmony export */   "copyCanvas": () => (/* binding */ copyCanvas),
/* harmony export */   "degrees": () => (/* binding */ degrees),
/* harmony export */   "detect": () => (/* binding */ detect),
/* harmony export */   "disableRetinaSupport": () => (/* binding */ disableRetinaSupport),
/* harmony export */   "embedMetadataPNG": () => (/* binding */ embedMetadataPNG),
/* harmony export */   "enableRetinaSupport": () => (/* binding */ enableRetinaSupport),
/* harmony export */   "fontHeight": () => (/* binding */ fontHeight),
/* harmony export */   "getDocumentPositionOf": () => (/* binding */ getDocumentPositionOf),
/* harmony export */   "getMinimumFontHeight": () => (/* binding */ getMinimumFontHeight),
/* harmony export */   "invoke": () => (/* binding */ invoke),
/* harmony export */   "isNil": () => (/* binding */ isNil),
/* harmony export */   "isObject": () => (/* binding */ isObject),
/* harmony export */   "isRetinaEnabled": () => (/* binding */ isRetinaEnabled),
/* harmony export */   "isRetinaSupported": () => (/* binding */ isRetinaSupported),
/* harmony export */   "isSnapObject": () => (/* binding */ isSnapObject),
/* harmony export */   "isString": () => (/* binding */ isString),
/* harmony export */   "isURL": () => (/* binding */ isURL),
/* harmony export */   "isURLChar": () => (/* binding */ isURLChar),
/* harmony export */   "isWordChar": () => (/* binding */ isWordChar),
/* harmony export */   "localize": () => (/* binding */ localize),
/* harmony export */   "newCanvas": () => (/* binding */ newCanvas),
/* harmony export */   "nop": () => (/* binding */ nop),
/* harmony export */   "normalizeCanvas": () => (/* binding */ normalizeCanvas),
/* harmony export */   "radians": () => (/* binding */ radians),
/* harmony export */   "sizeOf": () => (/* binding */ sizeOf),
/* harmony export */   "snapEquals": () => (/* binding */ snapEquals)
/* harmony export */ });
const nop = window['nop'];
const localize = window['localize'];
const isNil = window['isNil'];
const contains = window['contains'];
const detect = window['detect'];
const sizeOf = window['sizeOf'];
const isString = window['isString'];
const isObject = window['isObject'];
const radians = window['radians'];
const degrees = window['degrees'];
const fontHeight = window['fontHeight'];
const isWordChar = window['isWordChar'];
const isURLChar = window['isURLChar'];
const isURL = window['isURL'];
const newCanvas = window['newCanvas'];
const copyCanvas = window['copyCanvas'];
const getMinimumFontHeight = window['getMinimumFontHeight'];
const getDocumentPositionOf = window['getDocumentPositionOf'];
const copy = window['copy'];
const embedMetadataPNG = window['embedMetadataPNG'];
const enableRetinaSupport = window['enableRetinaSupport'];
const isRetinaSupported = window['isRetinaSupported'];
const isRetinaEnabled = window['isRetinaEnabled'];
const disableRetinaSupport = window['disableRetinaSupport'];
const normalizeCanvas = window['normalizeCanvas'];
const Animation = window['Animation'];
const Color = window['Color'];
const Point = window['Point'];
const Rectangle = window['Rectangle'];
const Node = window['Node'];
const Morph = window['Morph'];
const WorldMorph = window['WorldMorph'];
const HandMorph = window['HandMorph'];
const ShadowMorph = window['ShadowMorph'];
const FrameMorph = window['FrameMorph'];
const MenuMorph = window['MenuMorph'];
const HandleMorph = window['HandleMorph'];
const StringFieldMorph = window['StringFieldMorph'];
const ColorPickerMorph = window['ColorPickerMorph'];
const SliderMorph = window['SliderMorph'];
const ScrollFrameMorph = window['ScrollFrameMorph'];
const InspectorMorph = window['InspectorMorph'];
const StringMorph = window['StringMorph'];
const TextMorph = window['TextMorph'];
const PenMorph = window['PenMorph'];
const ColorPaletteMorph = window['ColorPaletteMorph'];
const GrayPaletteMorph = window['GrayPaletteMorph'];
const BlinkerMorph = window['BlinkerMorph'];
const CursorMorph = window['CursorMorph'];
const BoxMorph = window['BoxMorph'];
const SpeechBubbleMorph = window['SpeechBubbleMorph'];
const DialMorph = window['DialMorph'];
const CircleBoxMorph = window['CircleBoxMorph'];
const SliderButtonMorph = window['SliderButtonMorph'];
const MouseSensorMorph = window['MouseSensorMorph'];
const ListMorph = window['ListMorph'];
const TriggerMorph = window['TriggerMorph'];
const MenuItemMorph = window['MenuItemMorph'];
const BouncerMorph = window['BouncerMorph'];
const SymbolMorph = window['SymbolMorph'];
const PushButtonMorph = window['PushButtonMorph'];
const ToggleButtonMorph = window['ToggleButtonMorph'];
const TabMorph = window['TabMorph'];
const ToggleMorph = window['ToggleMorph'];
const ToggleElementMorph = window['ToggleElementMorph'];
const DialogBoxMorph = window['DialogBoxMorph'];
const AlignmentMorph = window['AlignmentMorph'];
const InputFieldMorph = window['InputFieldMorph'];
const PianoMenuMorph = window['PianoMenuMorph'];
const PianoKeyMorph = window['PianoKeyMorph'];
const SyntaxElementMorph = window['SyntaxElementMorph'];
const BlockMorph = window['BlockMorph'];
const BlockLabelMorph = window['BlockLabelMorph'];
const BlockSymbolMorph = window['BlockSymbolMorph'];
const CommandBlockMorph = window['CommandBlockMorph'];
const ReporterBlockMorph = window['ReporterBlockMorph'];
const ScriptsMorph = window['ScriptsMorph'];
const ArgMorph = window['ArgMorph'];
const CommandSlotMorph = window['CommandSlotMorph'];
const CSlotMorph = window['CSlotMorph'];
const InputSlotMorph = window['InputSlotMorph'];
const InputSlotStringMorph = window['InputSlotStringMorph'];
const InputSlotTextMorph = window['InputSlotTextMorph'];
const BooleanSlotMorph = window['BooleanSlotMorph'];
const ArrowMorph = window['ArrowMorph'];
const ColorSlotMorph = window['ColorSlotMorph'];
const HatBlockMorph = window['HatBlockMorph'];
const BlockHighlightMorph = window['BlockHighlightMorph'];
const MultiArgMorph = window['MultiArgMorph'];
const TemplateSlotMorph = window['TemplateSlotMorph'];
const FunctionSlotMorph = window['FunctionSlotMorph'];
const ReporterSlotMorph = window['ReporterSlotMorph'];
const RingMorph = window['RingMorph'];
const RingCommandSlotMorph = window['RingCommandSlotMorph'];
const RingReporterSlotMorph = window['RingReporterSlotMorph'];
const CommentMorph = window['CommentMorph'];
const ArgLabelMorph = window['ArgLabelMorph'];
const TextSlotMorph = window['TextSlotMorph'];
const ScriptFocusMorph = window['ScriptFocusMorph'];
const ThreadManager = window['ThreadManager'];
const Process = window['Process'];
const Context = window['Context'];
const Variable = window['Variable'];
const VariableFrame = window['VariableFrame'];
const JSCompiler = window['JSCompiler'];
const snapEquals = window['snapEquals'];
const invoke = window['invoke'];
const SpriteMorph = window['SpriteMorph'];
const StageMorph = window['StageMorph'];
const SpriteBubbleMorph = window['SpriteBubbleMorph'];
const Costume = window['Costume'];
const SVG_Costume = window['SVG_Costume'];
const CostumeEditorMorph = window['CostumeEditorMorph'];
const Sound = window['Sound'];
const Note = window['Note'];
const Microphone = window['Microphone'];
const CellMorph = window['CellMorph'];
const WatcherMorph = window['WatcherMorph'];
const StagePrompterMorph = window['StagePrompterMorph'];
const SpriteHighlightMorph = window['SpriteHighlightMorph'];
const StagePickerMorph = window['StagePickerMorph'];
const StagePickerItemMorph = window['StagePickerItemMorph'];
const isSnapObject = window['isSnapObject'];
const Project = window['Project'];
const Scene = window['Scene'];
const IDE_Morph = window['IDE_Morph'];
const ProjectDialogMorph = window['ProjectDialogMorph'];
const LibraryImportDialogMorph = window['LibraryImportDialogMorph'];
const SpriteIconMorph = window['SpriteIconMorph'];
const CostumeIconMorph = window['CostumeIconMorph'];
const TurtleIconMorph = window['TurtleIconMorph'];
const WardrobeMorph = window['WardrobeMorph'];
const SoundIconMorph = window['SoundIconMorph'];
const JukeboxMorph = window['JukeboxMorph'];
const SceneIconMorph = window['SceneIconMorph'];
const SceneAlbumMorph = window['SceneAlbumMorph'];
const StageHandleMorph = window['StageHandleMorph'];
const PaletteHandleMorph = window['PaletteHandleMorph'];
const CamSnapshotDialogMorph = window['CamSnapshotDialogMorph'];
const SoundRecorderDialogMorph = window['SoundRecorderDialogMorph'];
const ProjectRecoveryDialogMorph = window['ProjectRecoveryDialogMorph'];
const PaintEditorMorph = window['PaintEditorMorph'];
const PaintCanvasMorph = window['PaintCanvasMorph'];
const PaintColorPickerMorph = window['PaintColorPickerMorph'];
const List = window['List'];
const ListWatcherMorph = window['ListWatcherMorph'];
const CustomBlockDefinition = window['CustomBlockDefinition'];
const CustomCommandBlockMorph = window['CustomCommandBlockMorph'];
const CustomReporterBlockMorph = window['CustomReporterBlockMorph'];
const BlockDialogMorph = window['BlockDialogMorph'];
const BlockEditorMorph = window['BlockEditorMorph'];
const PrototypeHatBlockMorph = window['PrototypeHatBlockMorph'];
const BlockLabelFragment = window['BlockLabelFragment'];
const BlockLabelFragmentMorph = window['BlockLabelFragmentMorph'];
const BlockInputFragmentMorph = window['BlockInputFragmentMorph'];
const BlockLabelPlaceHolderMorph = window['BlockLabelPlaceHolderMorph'];
const InputSlotDialogMorph = window['InputSlotDialogMorph'];
const VariableDialogMorph = window['VariableDialogMorph'];
const JaggedBlockMorph = window['JaggedBlockMorph'];
const BlockExportDialogMorph = window['BlockExportDialogMorph'];
const BlockImportDialogMorph = window['BlockImportDialogMorph'];
const BlockRemovalDialogMorph = window['BlockRemovalDialogMorph'];
const BlockVisibilityDialogMorph = window['BlockVisibilityDialogMorph'];
const Table = window['Table'];
const TableCellMorph = window['TableCellMorph'];
const TableMorph = window['TableMorph'];
const TableFrameMorph = window['TableFrameMorph'];
const TableDialogMorph = window['TableDialogMorph'];
const VectorShape = window['VectorShape'];
const VectorRectangle = window['VectorRectangle'];
const VectorLine = window['VectorLine'];
const VectorEllipse = window['VectorEllipse'];
const VectorPolygon = window['VectorPolygon'];
const VectorSelection = window['VectorSelection'];
const VectorPaintEditorMorph = window['VectorPaintEditorMorph'];
const VectorPaintCanvasMorph = window['VectorPaintCanvasMorph'];
const Crosshair = window['Crosshair'];
const VideoMotion = window['VideoMotion'];
const WorldMap = window['WorldMap'];
const ReadStream = window['ReadStream'];
const XML_Element = window['XML_Element'];
const XML_Serializer = window['XML_Serializer'];
const SnapSerializer = window['SnapSerializer'];
const Localizer = window['Localizer'];
const Cloud = window['Cloud'];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var BlockFactory_1 = __webpack_require__(/*! ./blocks/BlockFactory */ "./src/blocks/BlockFactory.ts");
var SnapEvent_1 = __webpack_require__(/*! ./events/SnapEvent */ "./src/events/SnapEvent.ts");
var DefGenerator_1 = __webpack_require__(/*! ./meta/DefGenerator */ "./src/meta/DefGenerator.ts");
var SnapHelper_1 = __webpack_require__(/*! ./snap/SnapHelper */ "./src/snap/SnapHelper.ts");
// Add object to window for debuggin
window['SEM'] = {
    events: new SnapEvent_1.EventManager(),
    blocks: new BlockFactory_1.BlockFactory(),
    helper: new SnapHelper_1.SnapHelper(),
    generator: new DefGenerator_1.DefGenerator(),
};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O1VDeExQO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTkEsc0dBQXFEO0FBQ3JELDZGQUFrRDtBQUNsRCxrR0FBbUQ7QUFDbkQsNEZBQStDO0FBRS9DLG9DQUFvQztBQUNwQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUc7SUFDWixNQUFNLEVBQUUsSUFBSSx3QkFBWSxFQUFFO0lBQzFCLE1BQU0sRUFBRSxJQUFJLDJCQUFZLEVBQUU7SUFDMUIsTUFBTSxFQUFFLElBQUksdUJBQVUsRUFBRTtJQUN4QixTQUFTLEVBQUUsSUFBSSwyQkFBWSxFQUFFO0NBQ2hDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zZWYvLi9zcmMvYmxvY2tzL0Jsb2NrRmFjdG9yeS50cyIsIndlYnBhY2s6Ly9zZWYvLi9zcmMvZXZlbnRzL1NuYXBFdmVudC50cyIsIndlYnBhY2s6Ly9zZWYvLi9zcmMvZXh0ZW5kL092ZXJyaWRlUmVnaXN0cnkudHMiLCJ3ZWJwYWNrOi8vc2VmLy4vc3JjL21ldGEvRGVmR2VuZXJhdG9yLnRzIiwid2VicGFjazovL3NlZi8uL3NyYy9zbmFwL1NuYXBIZWxwZXIudHMiLCJ3ZWJwYWNrOi8vc2VmLy4vc3JjL3NuYXAvU25hcFR5cGVzLnRzIiwid2VicGFjazovL3NlZi8uL3NyYy9zbmFwL1NuYXAuanMiLCJ3ZWJwYWNrOi8vc2VmL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NlZi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc2VmL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc2VmL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vc2VmLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE92ZXJyaWRlUmVnaXN0cnkgfSBmcm9tIFwiLi4vZXh0ZW5kL092ZXJyaWRlUmVnaXN0cnlcIjtcclxuaW1wb3J0IHsgbG9jYWxpemUsIFNwcml0ZU1vcnBoLCBTdGFnZU1vcnBoLCBUb2dnbGVNb3JwaCB9IGZyb20gXCIuLi9zbmFwL1NuYXBcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCbG9ja0ZhY3Rvcnkge1xyXG5cclxuICAgIGJsb2NrcyA9IFtdIGFzIEJsb2NrW107XHJcbiAgICBuZWVkc0luaXQgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmJsb2NrcyA9IFtdO1xyXG4gICAgICAgIHRoaXMubmVlZHNJbml0ID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IG15QmxvY2tzID0gdGhpcy5ibG9ja3M7XHJcblxyXG4gICAgICAgIGxldCBvdmVycmlkZSA9IGZ1bmN0aW9uKGJhc2UsIGNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgIGxldCBibG9ja3MgPSBiYXNlLmNhbGwodGhpcywgY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICBsZXQgY2hlY2tTcHJpdGUgPSB0aGlzIGluc3RhbmNlb2YgU3RhZ2VNb3JwaDtcclxuICAgICAgICAgICAgbGV0IGFkZGVkID0gMDtcclxuICAgICAgICAgICAgbXlCbG9ja3MuZm9yRWFjaChibG9jayA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2suY2F0ZWdvcnkgPT09IGNhdGVnb3J5ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICEoY2hlY2tTcHJpdGUgJiYgYmxvY2suc3ByaXRlT25seSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2sudG9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5zcGxpY2UoYWRkZWQsIDAsIGJsb2NrLnRvQmxvY2tNb3JwaCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnNwbGljZShhZGRlZCwgMCwgYmxvY2sudG9Ub2dnbGUodGhpcykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRlZCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrLnRvVG9nZ2xlKHRoaXMpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnB1c2goYmxvY2sudG9CbG9ja01vcnBoKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBibG9ja3M7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgT3ZlcnJpZGVSZWdpc3RyeS5leHRlbmQoU3ByaXRlTW9ycGgsICdpbml0QmxvY2tzJywgZnVuY3Rpb24oYmFzZSkge1xyXG4gICAgICAgICAgICBiYXNlLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgIG15QmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xyXG4gICAgICAgICAgICAgICAgYmxvY2suYWRkVG9NYXAoU3ByaXRlTW9ycGgucHJvdG90eXBlLmJsb2Nrcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBPdmVycmlkZVJlZ2lzdHJ5LmV4dGVuZChTcHJpdGVNb3JwaCwgJ2Jsb2NrVGVtcGxhdGVzJywgb3ZlcnJpZGUpO1xyXG4gICAgICAgIE92ZXJyaWRlUmVnaXN0cnkuZXh0ZW5kKFN0YWdlTW9ycGgsICdibG9ja1RlbXBsYXRlcycsIG92ZXJyaWRlKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVnaXN0ZXJCbG9jayhibG9jaykge1xyXG4gICAgICAgIHRoaXMuYmxvY2tzLnB1c2goYmxvY2spO1xyXG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZnJlc2goKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubmVlZHNJbml0KSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5uZWVkc0luaXQgPSB0cnVlO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBTcHJpdGVNb3JwaC5wcm90b3R5cGUuaW5pdEJsb2NrcygpO1xyXG4gICAgICAgICAgICB0aGlzLm5lZWRzSW5pdCA9IGZhbHNlO1xyXG4gICAgICAgIH0sIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZENhdGVnb3J5KG5hbWUsIGNvbG9yKSB7XHJcbiAgICAgICAgU3ByaXRlTW9ycGgucHJvdG90eXBlLmNhdGVnb3JpZXMucHVzaChuYW1lKTtcclxuICAgICAgICBTcHJpdGVNb3JwaC5wcm90b3R5cGUuYmxvY2tDb2xvcltuYW1lXSA9IGNvbG9yO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBCbG9jayB7XHJcblxyXG4gICAgc2VsZWN0b3I6IHN0cmluZztcclxuICAgIHNwZWM6IHN0cmluZztcclxuICAgIGRlZmF1bHRzOiBbXTtcclxuICAgIHR5cGU6IHN0cmluZztcclxuICAgIGNhdGVnb3J5OiBzdHJpbmc7XHJcbiAgICBzcHJpdGVPbmx5OiBib29sZWFuO1xyXG4gICAgdG9wOiBib29sZWFuO1xyXG4gICAgdG9nZ2xhYmxlOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHNlbGVjdG9yLCBzcGVjLCBkZWZhdWx0cywgdHlwZSwgY2F0ZWdvcnksIHNwcml0ZU9ubHksIHRvcCwgdG9nZ2xhYmxlXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3I7XHJcbiAgICAgICAgdGhpcy5zcGVjID0gc3BlYztcclxuICAgICAgICB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHM7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLmNhdGVnb3J5ID0gY2F0ZWdvcnk7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVPbmx5ID0gc3ByaXRlT25seTtcclxuICAgICAgICB0aGlzLnRvcCA9IHRvcCB8fCBmYWxzZTtcclxuICAgICAgICB0aGlzLnRvZ2dsYWJsZSA9IHRvZ2dsYWJsZSB8fCBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRUb01hcChtYXApIHtcclxuICAgICAgICBtYXBbdGhpcy5zZWxlY3Rvcl0gPSB7XHJcbiAgICAgICAgICAgIG9ubHk6IHRoaXMuc3ByaXRlT25seSA/IFNwcml0ZU1vcnBoIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXHJcbiAgICAgICAgICAgIGNhdGVnb3J5OiB0aGlzLmNhdGVnb3J5LFxyXG4gICAgICAgICAgICBzcGVjOiBsb2NhbGl6ZSh0aGlzLnNwZWMpLFxyXG4gICAgICAgICAgICBkZWZhdWx0czogdGhpcy5kZWZhdWx0cyxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHRvQmxvY2tNb3JwaCgpIHtcclxuICAgICAgICBpZiAoU3RhZ2VNb3JwaC5wcm90b3R5cGUuaGlkZGVuUHJpbWl0aXZlc1t0aGlzLnNlbGVjdG9yXSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG5ld0Jsb2NrID1cclxuICAgICAgICAgICAgU3RhZ2VNb3JwaC5wcm90b3R5cGUuYmxvY2tGb3JTZWxlY3Rvcih0aGlzLnNlbGVjdG9yLCB0cnVlKTtcclxuICAgICAgICBpZiAoIW5ld0Jsb2NrKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignQ2Fubm90IGluaXRpYWxpemUgYmxvY2snLCB0aGlzLnNlbGVjdG9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5ld0Jsb2NrLmlzVGVtcGxhdGUgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiBuZXdCbG9jaztcclxuICAgIH1cclxuXHJcbiAgICB0b1RvZ2dsZShzcHJpdGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMudG9nZ2xhYmxlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBsZXQgc2VsZWN0b3IgPSB0aGlzLnNlbGVjdG9yO1xyXG4gICAgICAgIGlmIChTdGFnZU1vcnBoLnByb3RvdHlwZS5oaWRkZW5QcmltaXRpdmVzW3NlbGVjdG9yXSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGluZm8gPSBTdGFnZU1vcnBoLnByb3RvdHlwZS5ibG9ja3Nbc2VsZWN0b3JdO1xyXG4gICAgICAgIHJldHVybiBuZXcgVG9nZ2xlTW9ycGgoXHJcbiAgICAgICAgICAgICdjaGVja2JveCcsXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNwcml0ZS50b2dnbGVXYXRjaGVyKFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsaXplKGluZm8uc3BlYyksXHJcbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlLmJsb2NrQ29sb3JbaW5mby5jYXRlZ29yeV1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzcHJpdGUuc2hvd2luZ1dhdGNoZXIoc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBudWxsXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRTcHJpdGVBY3Rpb24oYWN0aW9uKSB7XHJcbiAgICAgICAgU3ByaXRlTW9ycGgucHJvdG90eXBlW3RoaXMuc2VsZWN0b3JdID1cclxuICAgICAgICAgICAgU3RhZ2VNb3JwaC5wcm90b3R5cGVbdGhpcy5zZWxlY3Rvcl0gPSBhY3Rpb247XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGVudW0gU25hcEV2ZW50cyB7XHJcblxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNuYXBFdmVudCB7XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEV2ZW50TWFuYWdlciB7XHJcblxyXG4gICAgdHJpZ2dlcih0eXBlOiBTbmFwRXZlbnRzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2codHlwZSk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgT3ZlcnJpZGVSZWdpc3RyeSB7XHJcblxyXG4gICAgc3RhdGljIGV4dGVuZChjbGF6eiA6IEZ1bmN0aW9uLCBmdW5jdGlvbk5hbWUgOiBzdHJpbmcsIG5ld0Z1bmN0aW9uKSB7XHJcbiAgICAgICAgaWYgKCFjbGF6eiB8fCAhY2xhenoucHJvdG90eXBlKSB7XHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2V4dGVuZCByZXF1aXJlcyBhIGNsYXNzIGZvciBpdHMgZmlyc3QgYXJndW1lbnQnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gT3ZlcnJpZGVSZWdpc3RyeS5leHRlbmRPYmplY3QoY2xhenoucHJvdG90eXBlLCBmdW5jdGlvbk5hbWUsIG5ld0Z1bmN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZXh0ZW5kT2JqZWN0KG9iamVjdCA6IG9iamVjdCwgZnVuY3Rpb25OYW1lIDogc3RyaW5nLCBuZXdGdW5jdGlvbikge1xyXG4gICAgICAgIGlmICghb2JqZWN0W2Z1bmN0aW9uTmFtZV0pIHtcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcclxuICAgICAgICAgICAgY29uc29sZS50cmFjZSgpO1xyXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdDYW5ub3QgZXh0ZW5kIGZ1bmN0aW9uICcgKyBmdW5jdGlvbk5hbWUgK1xyXG4gICAgICAgICAgICAgICAgJyBiZWNhdXNlIGl0IGRvZXMgbm90IGV4aXN0LicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgb2xkRnVuY3Rpb24gPSBvYmplY3RbZnVuY3Rpb25OYW1lXTtcclxuXHJcbiAgICAgICAgaWYgKCFvbGRGdW5jdGlvbi5leHRlbmRlZCAmJiBvbGRGdW5jdGlvbi5sZW5ndGggIT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgICAgICBvbGRGdW5jdGlvbi5sZW5ndGggKyAxICE9PSBuZXdGdW5jdGlvbi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSAnRXh0ZW5kaW5nIGZ1bmN0aW9uIHdpdGggd3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50czogJyArXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbk5hbWUgKyAnICcgK1xyXG4gICAgICAgICAgICAgICAgb2xkRnVuY3Rpb24ubGVuZ3RoICsgJyB2cyAnICsgbmV3RnVuY3Rpb24ubGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb2JqZWN0W2Z1bmN0aW9uTmFtZV0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIGFyZ3MudW5zaGlmdChvbGRGdW5jdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdGdW5jdGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIG9iamVjdFtmdW5jdGlvbk5hbWVdLmV4dGVuZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG9sZEZ1bmN0aW9uO1xyXG4gICAgfVxyXG59XHJcblxyXG4iLCJleHBvcnQgY2xhc3MgRGVmR2VuZXJhdG9yIHtcclxuXHJcbiAgICBjbGFzc2VzID0gbmV3IE1hcDxzdHJpbmcsIENsYXNzRGVmPjtcclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyh3aW5kb3cpKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGtleSk7XHJcbiAgICAgICAgICAgIGlmICghd2luZG93Lmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB3aW5kb3dba2V5XTtcclxuICAgICAgICAgICAgaWYgKCEodmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbikpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlLnByb3RvdHlwZSkgY29udGludWU7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5uYW1lLmxlbmd0aCA9PSAwKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdGhpcy5jbGFzc2VzLnNldChrZXksIG5ldyBDbGFzc0RlZih2YWx1ZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNsYXNzZXMuZm9yRWFjaChjID0+IGMuYWRkUGFyZW50RGF0YSh0aGlzLmNsYXNzZXMpKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5vdXRwdXREZWZpbml0aW9ucygpKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvdXRwdXRFeHBvcnRzKCkge1xyXG4gICAgICAgIHJldHVybiBbLi4udGhpcy5jbGFzc2VzLnZhbHVlcygpXS5tYXAoYyA9PiBjLmV4cG9ydFN0YXRlbWVudCgpKS5qb2luKCdcXG4nKTtcclxuICAgIH1cclxuXHJcbiAgICBvdXRwdXREZWZpbml0aW9ucygpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG5leHBvcnQgY2xhc3MgU25hcFR5cGUge1xyXG4gICAgcHJvdG90eXBlOiBhbnk7XHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcbn1cXG5cXG5gICsgWy4uLnRoaXMuY2xhc3Nlcy52YWx1ZXMoKV0ubWFwKGMgPT4gYy50b1RTKCkpLmpvaW4oJ1xcblxcbicpO1xyXG4gICAgfVxyXG5cclxuICAgIGRvd25sb2FkQWxsKCkge1xyXG4gICAgICAgIHRoaXMuZG93bmxvYWRGaWxlKCdTbmFwLmpzJywgdGhpcy5vdXRwdXRFeHBvcnRzKCkpO1xyXG4gICAgICAgIHRoaXMuZG93bmxvYWRGaWxlKCdTbmFwLmQudHMnLCB0aGlzLm91dHB1dERlZmluaXRpb25zKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGRvd25sb2FkRmlsZShmaWxlbmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnaHJlZicsICdkYXRhOnRleHQvcGxhaW47Y2hhcnNldD11dGYtOCwnICsgZW5jb2RlVVJJQ29tcG9uZW50KHRleHQpKTtcclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBmaWxlbmFtZSk7XHJcblxyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG5cclxuICAgICAgICBlbGVtZW50LmNsaWNrKCk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5jbGFzcyBDbGFzc0RlZiB7XHJcbiAgICBiYXNlRnVuY3Rpb246IEZ1bmN0aW9uO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdWJlciA9IG51bGwgYXMgc3RyaW5nO1xyXG4gICAgZnVuY3Rpb25Qcm94eSA6IE1ldGhvZDtcclxuICAgIGZpZWxkcyA9IG5ldyBNYXA8c3RyaW5nLCBGaWVsZD47IC8vW10gYXMgRmllbGRbXTtcclxuICAgIG1ldGhvZHMgPSBuZXcgTWFwPHN0cmluZywgTWV0aG9kPjtcclxuICAgIGFkZGVkUGFyZW50RGF0YSA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZ1bmM6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5iYXNlRnVuY3Rpb24gPSBmdW5jO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IGZ1bmMubmFtZTtcclxuICAgICAgICBjb25zdCBwcm90byA9IGZ1bmMucHJvdG90eXBlO1xyXG4gICAgICAgIGlmICghcHJvdG8pIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKFsuLi5PYmplY3Qua2V5cyhwcm90byldLmxlbmd0aCA8PSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZnVuY3Rpb25Qcm94eSA9IG5ldyBNZXRob2QodGhpcy5uYW1lLCBmdW5jKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51YmVyID0gZnVuY1sndWJlciddPy5jb25zdHJ1Y3Rvcj8ubmFtZTtcclxuICAgICAgICB0aGlzLmluZmVyRmllbGRzKGZ1bmMpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMocHJvdG8pKSB7XHJcbiAgICAgICAgICAgIC8vIEkgdGhpbmsgdGhpcyBpcyByZWR1bmRhbnQuLi5cclxuICAgICAgICAgICAgaWYgKCFwcm90by5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gcHJvdG9ba2V5XTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWV0aG9kcy5zZXQoa2V5LCBuZXcgTWV0aG9kKGtleSwgdmFsdWUpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFRPRE86IGRpc3Rpbmd1aXNoIGJldHdlZW4gaW5oZXJpdGVkIGZpZWxkcyBhbmQgc3RhdGljIGZpZWxkc1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5maWVsZHMucHVzaChuZXcgRmllbGQoa2V5LCB2YWx1ZSwgdHJ1ZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5mZXJGaWVsZHMocHJvdG9bJ2luaXQnXSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGFyZW50RGF0YShjbGFzc2VzOiBNYXA8c3RyaW5nLCBDbGFzc0RlZj4pOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5hZGRlZFBhcmVudERhdGEpIHJldHVybjtcclxuICAgICAgICB0aGlzLmFkZGVkUGFyZW50RGF0YSA9IHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuZnVuY3Rpb25Qcm94eSkgcmV0dXJuO1xyXG4gICAgICAgIGlmICghdGhpcy51YmVyIHx8ICFjbGFzc2VzLmhhcyh0aGlzLnViZXIpKSByZXR1cm47XHJcbiAgICAgICAgY29uc3QgcGFyZW50ID0gY2xhc3Nlcy5nZXQodGhpcy51YmVyKTtcclxuICAgICAgICBpZiAoIXBhcmVudC5hZGRlZFBhcmVudERhdGEpIHBhcmVudC5hZGRQYXJlbnREYXRhKGNsYXNzZXMpO1xyXG4gICAgICAgIGZvciAobGV0IFttZXRob2ROYW1lLCBtZXRob2RdIG9mIHBhcmVudC5tZXRob2RzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1ldGhvZHMuaGFzKG1ldGhvZE5hbWUpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdGhpcy5tZXRob2RzLnNldChtZXRob2ROYW1lLCBtZXRob2QpO1xyXG4gICAgICAgICAgICAvLyBJZiBhIGZpZWxkIG92ZXJzaGFkb3dzIGEgcGFyZW50IG1ldGhvZCwgaXQgd2FzIHByb2JhYmx5XHJcbiAgICAgICAgICAgIC8vIGEgbWlzdGFrZSwgc28gZGVsZXRlIGl0LlxyXG4gICAgICAgICAgICAvLyBUT0RPOiBOb3Qgc3VyZSB0aGlzIGlzIHRoZSByaWdodCBjYWxsOyBjb3VsZCBpZ25vcmUgaW5oZXJpdGFuY2VcclxuICAgICAgICAgICAgdGhpcy5maWVsZHMuZGVsZXRlKG1ldGhvZE5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBbZmllbGROYW1lLCBmaWVsZF0gb2YgcGFyZW50LmZpZWxkcykge1xyXG4gICAgICAgICAgICAvLyBEb24ndCBjb3B5IGZpZWxkcyB0aGF0IGhhdmUgc2hhZG93aW5nIG1ldGhvZHNcclxuICAgICAgICAgICAgaWYgKHRoaXMubWV0aG9kcy5oYXMoZmllbGROYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZpZWxkcy5oYXMoZmllbGROYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmllbGRzLnNldChmaWVsZE5hbWUsIGZpZWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5mZXJGaWVsZHMoZnVuYzogRnVuY3Rpb24pIHtcclxuICAgICAgICBpZiAoIWZ1bmMpIHJldHVybjtcclxuICAgICAgICBjb25zdCBqcyA9IGZ1bmMudG9TdHJpbmcoKTtcclxuICAgICAgICBjb25zdCB2YXJEZWMgPSAvXlxccyp0aGlzXFxzKlxcLlxccyooW2EtekEtWl8kXVswLTlhLXpBLVpfJF0qKVxccyo9L2dtO1xyXG4gICAgICAgIGZvciAobGV0IG1hdGNoIG9mIGpzLm1hdGNoQWxsKHZhckRlYykpIHtcclxuICAgICAgICAgICAgbGV0IG5hbWUgPSBtYXRjaFsxXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZmllbGRzLmhhcyhuYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIC8vIEdpdmUgcHJlY2VkZW5jZSB0byBtZXRob2RzXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1ldGhvZHMuaGFzKG5hbWUpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdGhpcy5maWVsZHMuc2V0KG5hbWUsIG5ldyBGaWVsZChuYW1lLCBudWxsLCBmYWxzZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnRTdGF0ZW1lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBleHBvcnQgY29uc3QgJHt0aGlzLm5hbWV9ID0gd2luZG93Wycke3RoaXMubmFtZX0nXTtgO1xyXG4gICAgfVxyXG5cclxuICAgIHRvVFMoKSA6IHN0cmluZyAge1xyXG4gICAgICAgIGlmICh0aGlzLmZ1bmN0aW9uUHJveHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGBleHBvcnQgZnVuY3Rpb24gJHt0aGlzLmZ1bmN0aW9uUHJveHkudG9UUygpfWA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBsZXQgY29kZSA9IGBleHBvcnQgY2xhc3MgJHt0aGlzLm5hbWV9IGV4dGVuZHMgJHt0aGlzLnViZXIgPyB0aGlzLnViZXIgOiAnU25hcFR5cGUnfWA7XHJcbiAgICAgICAgLy8gVE9ETzogQmVjYXVzZSBUeXBlc2NyaXB0IHNlZW1zIG5vdCB0byBhbGxvdyBmdW5jdGlvbiBzaGFkb3dpbmcsXHJcbiAgICAgICAgLy8gbmVlZCB0byBtYW51YWxseSBkZWZpbmUgYWxsIHBhcmVudCB0eXBlcyBhbmQgbWV0aG9kcyAodGhhdCBhcmVuJ3Qgc2hhZG93ZWQpIGhlcmVcclxuICAgICAgICBsZXQgY29kZSA9IGBleHBvcnQgY2xhc3MgJHt0aGlzLm5hbWV9IGV4dGVuZHMgU25hcFR5cGVgO1xyXG4gICAgICAgIGNvZGUgKz0gYCB7XFxuYDtcclxuICAgICAgICBmb3IgKGxldCBmaWVsZCBvZiB0aGlzLmZpZWxkcy52YWx1ZXMoKSkge1xyXG4gICAgICAgICAgICBjb2RlICs9ICcgICAgJyArIGZpZWxkLnRvVFMoKSArICdcXG4nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb2RlICs9ICdcXG4nO1xyXG4gICAgICAgIGZvciAobGV0IG1ldGhvZCBvZiB0aGlzLm1ldGhvZHMudmFsdWVzKCkpIHtcclxuICAgICAgICAgICAgY29kZSArPSAnICAgICcgKyBtZXRob2QudG9UUygpICsgJ1xcbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvZGUgKz0gJ30nO1xyXG4gICAgICAgIHJldHVybiBjb2RlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBGaWVsZCB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICBpc1N0YXRpYzogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnksIGlzU3RhdGljOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmlzU3RhdGljID0gaXNTdGF0aWM7XHJcbiAgICAgICAgdGhpcy50eXBlID0gJ2FueSc7XHJcbiAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZW9mKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdG9UUygpIDogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYCR7dGhpcy5pc1N0YXRpYyA/ICdzdGF0aWMgJyA6ICcnfSR7dGhpcy5uYW1lfTogJHt0aGlzLnR5cGV9O2A7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIE1ldGhvZCB7XHJcblxyXG4gICAgc3RhdGljIHJlYWRvbmx5IFNUUklQX0NPTU1FTlRTID0gLyhcXC9cXC8uKiQpfChcXC9cXCpbXFxzXFxTXSo/XFwqXFwvKXwoXFxzKj1bXixcXCldKigoJyg/OlxcXFwnfFteJ1xcclxcbl0pKicpfChcIig/OlxcXFxcInxbXlwiXFxyXFxuXSkqXCIpKXwoXFxzKj1bXixcXCldKikpL21nO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IEFSR1VNRU5UX05BTUVTID0gLyhbXlxccyxdKykvZztcclxuXHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBwYXJhbU5hbWVzOiBzdHJpbmdbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGZ1bmM6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnBhcmFtTmFtZXMgPSB0aGlzLmdldFBhcmFtTmFtZXMoZnVuYyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGFyYW1OYW1lcyhmdW5jOiBGdW5jdGlvbikge1xyXG4gICAgICAgIHZhciBmblN0ciA9IGZ1bmMudG9TdHJpbmcoKS5yZXBsYWNlKE1ldGhvZC5TVFJJUF9DT01NRU5UUywgJycpO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBmblN0ci5zbGljZShmblN0ci5pbmRleE9mKCcoJykrMSwgZm5TdHIuaW5kZXhPZignKScpKS5tYXRjaChNZXRob2QuQVJHVU1FTlRfTkFNRVMpO1xyXG4gICAgICAgIGlmKHJlc3VsdCA9PT0gbnVsbClcclxuICAgICAgICAgICAgcmVzdWx0ID0gW107XHJcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmZpbHRlcihwYXJhbSA9PiBwYXJhbS5tYXRjaCgvXlthLXpBLVpfJF1bMC05YS16QS1aXyRdKiQvKSlcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvVFMoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3Qgb3ZlcnJpZGUgPSB0aGlzLmNoZWNrT3ZlcnJpZGUoKTtcclxuICAgICAgICBpZiAob3ZlcnJpZGUpIHJldHVybiBvdmVycmlkZTtcclxuICAgICAgICBsZXQgY29kZSA9IGAke3RoaXMubmFtZX0oYDtcclxuICAgICAgICBsZXQgZmlyc3QgPSB0cnVlO1xyXG4gICAgICAgIGZvciAobGV0IG5hbWUgb2YgdGhpcy5wYXJhbU5hbWVzKSB7XHJcbiAgICAgICAgICAgIGlmICghZmlyc3QpIGNvZGUgKz0gJywgJztcclxuICAgICAgICAgICAgZmlyc3QgPSBmYWxzZTtcclxuICAgICAgICAgICAgY29kZSArPSBgJHtuYW1lfT86IGFueWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvZGUgKz0gJyk7JztcclxuICAgICAgICByZXR1cm4gY29kZTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja092ZXJyaWRlKCkge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5uYW1lKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2NoaWxkVGhhdElzQSc6IHJldHVybiBgJHt0aGlzLm5hbWV9KC4uLmFyZ3M6IGFueVtdKTtgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgU25hcFR5cGVzIH0gZnJvbSBcIi4vU25hcFR5cGVzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU25hcEhlbHBlciB7XHJcblxyXG4gICAgcHJpdmF0ZSBfc25hcCA9IG5ldyBTbmFwVHlwZXMoKTtcclxuXHJcbiAgICBzbmFwKCkgOiBTbmFwVHlwZXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zbmFwO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBJREVfTW9ycGgsIFN0YWdlTW9ycGgsIFdvcmxkTW9ycGggfSBmcm9tIFwiLi9TbmFwXCI7XHJcblxyXG5cclxuLy8gVE9ETzogTWFrZSBhbiBpbnRlcmZhY2Ugd2l0aCBhbiBpbXBsZW1lbnRhdGlvbiB0aGF0IGZldGNoZXMgZnJvbSB3aW5kb3dcclxuZXhwb3J0IGNsYXNzIFNuYXBUeXBlcyB7XHJcbiAgICB3b3JsZCgpIDogV29ybGRNb3JwaCB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvd1tcIndvcmxkXCJdO1xyXG4gICAgfVxyXG5cclxuICAgIElERSgpIDogSURFX01vcnBoIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53b3JsZCgpLmNoaWxkVGhhdElzQSh3aW5kb3dbJ0lERV9Nb3JwaCddKSBhcyBJREVfTW9ycGg7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhZ2UoKSA6IFN0YWdlTW9ycGgge1xyXG4gICAgICAgIHJldHVybiB0aGlzLklERSgpLnN0YWdlO1xyXG4gICAgfVxyXG5cclxufSIsImV4cG9ydCBjb25zdCBub3AgPSB3aW5kb3dbJ25vcCddO1xuZXhwb3J0IGNvbnN0IGxvY2FsaXplID0gd2luZG93Wydsb2NhbGl6ZSddO1xuZXhwb3J0IGNvbnN0IGlzTmlsID0gd2luZG93Wydpc05pbCddO1xuZXhwb3J0IGNvbnN0IGNvbnRhaW5zID0gd2luZG93Wydjb250YWlucyddO1xuZXhwb3J0IGNvbnN0IGRldGVjdCA9IHdpbmRvd1snZGV0ZWN0J107XG5leHBvcnQgY29uc3Qgc2l6ZU9mID0gd2luZG93WydzaXplT2YnXTtcbmV4cG9ydCBjb25zdCBpc1N0cmluZyA9IHdpbmRvd1snaXNTdHJpbmcnXTtcbmV4cG9ydCBjb25zdCBpc09iamVjdCA9IHdpbmRvd1snaXNPYmplY3QnXTtcbmV4cG9ydCBjb25zdCByYWRpYW5zID0gd2luZG93WydyYWRpYW5zJ107XG5leHBvcnQgY29uc3QgZGVncmVlcyA9IHdpbmRvd1snZGVncmVlcyddO1xuZXhwb3J0IGNvbnN0IGZvbnRIZWlnaHQgPSB3aW5kb3dbJ2ZvbnRIZWlnaHQnXTtcbmV4cG9ydCBjb25zdCBpc1dvcmRDaGFyID0gd2luZG93Wydpc1dvcmRDaGFyJ107XG5leHBvcnQgY29uc3QgaXNVUkxDaGFyID0gd2luZG93Wydpc1VSTENoYXInXTtcbmV4cG9ydCBjb25zdCBpc1VSTCA9IHdpbmRvd1snaXNVUkwnXTtcbmV4cG9ydCBjb25zdCBuZXdDYW52YXMgPSB3aW5kb3dbJ25ld0NhbnZhcyddO1xuZXhwb3J0IGNvbnN0IGNvcHlDYW52YXMgPSB3aW5kb3dbJ2NvcHlDYW52YXMnXTtcbmV4cG9ydCBjb25zdCBnZXRNaW5pbXVtRm9udEhlaWdodCA9IHdpbmRvd1snZ2V0TWluaW11bUZvbnRIZWlnaHQnXTtcbmV4cG9ydCBjb25zdCBnZXREb2N1bWVudFBvc2l0aW9uT2YgPSB3aW5kb3dbJ2dldERvY3VtZW50UG9zaXRpb25PZiddO1xuZXhwb3J0IGNvbnN0IGNvcHkgPSB3aW5kb3dbJ2NvcHknXTtcbmV4cG9ydCBjb25zdCBlbWJlZE1ldGFkYXRhUE5HID0gd2luZG93WydlbWJlZE1ldGFkYXRhUE5HJ107XG5leHBvcnQgY29uc3QgZW5hYmxlUmV0aW5hU3VwcG9ydCA9IHdpbmRvd1snZW5hYmxlUmV0aW5hU3VwcG9ydCddO1xuZXhwb3J0IGNvbnN0IGlzUmV0aW5hU3VwcG9ydGVkID0gd2luZG93Wydpc1JldGluYVN1cHBvcnRlZCddO1xuZXhwb3J0IGNvbnN0IGlzUmV0aW5hRW5hYmxlZCA9IHdpbmRvd1snaXNSZXRpbmFFbmFibGVkJ107XG5leHBvcnQgY29uc3QgZGlzYWJsZVJldGluYVN1cHBvcnQgPSB3aW5kb3dbJ2Rpc2FibGVSZXRpbmFTdXBwb3J0J107XG5leHBvcnQgY29uc3Qgbm9ybWFsaXplQ2FudmFzID0gd2luZG93Wydub3JtYWxpemVDYW52YXMnXTtcbmV4cG9ydCBjb25zdCBBbmltYXRpb24gPSB3aW5kb3dbJ0FuaW1hdGlvbiddO1xuZXhwb3J0IGNvbnN0IENvbG9yID0gd2luZG93WydDb2xvciddO1xuZXhwb3J0IGNvbnN0IFBvaW50ID0gd2luZG93WydQb2ludCddO1xuZXhwb3J0IGNvbnN0IFJlY3RhbmdsZSA9IHdpbmRvd1snUmVjdGFuZ2xlJ107XG5leHBvcnQgY29uc3QgTm9kZSA9IHdpbmRvd1snTm9kZSddO1xuZXhwb3J0IGNvbnN0IE1vcnBoID0gd2luZG93WydNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFdvcmxkTW9ycGggPSB3aW5kb3dbJ1dvcmxkTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBIYW5kTW9ycGggPSB3aW5kb3dbJ0hhbmRNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFNoYWRvd01vcnBoID0gd2luZG93WydTaGFkb3dNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEZyYW1lTW9ycGggPSB3aW5kb3dbJ0ZyYW1lTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBNZW51TW9ycGggPSB3aW5kb3dbJ01lbnVNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEhhbmRsZU1vcnBoID0gd2luZG93WydIYW5kbGVNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFN0cmluZ0ZpZWxkTW9ycGggPSB3aW5kb3dbJ1N0cmluZ0ZpZWxkTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBDb2xvclBpY2tlck1vcnBoID0gd2luZG93WydDb2xvclBpY2tlck1vcnBoJ107XG5leHBvcnQgY29uc3QgU2xpZGVyTW9ycGggPSB3aW5kb3dbJ1NsaWRlck1vcnBoJ107XG5leHBvcnQgY29uc3QgU2Nyb2xsRnJhbWVNb3JwaCA9IHdpbmRvd1snU2Nyb2xsRnJhbWVNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEluc3BlY3Rvck1vcnBoID0gd2luZG93WydJbnNwZWN0b3JNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFN0cmluZ01vcnBoID0gd2luZG93WydTdHJpbmdNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFRleHRNb3JwaCA9IHdpbmRvd1snVGV4dE1vcnBoJ107XG5leHBvcnQgY29uc3QgUGVuTW9ycGggPSB3aW5kb3dbJ1Blbk1vcnBoJ107XG5leHBvcnQgY29uc3QgQ29sb3JQYWxldHRlTW9ycGggPSB3aW5kb3dbJ0NvbG9yUGFsZXR0ZU1vcnBoJ107XG5leHBvcnQgY29uc3QgR3JheVBhbGV0dGVNb3JwaCA9IHdpbmRvd1snR3JheVBhbGV0dGVNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEJsaW5rZXJNb3JwaCA9IHdpbmRvd1snQmxpbmtlck1vcnBoJ107XG5leHBvcnQgY29uc3QgQ3Vyc29yTW9ycGggPSB3aW5kb3dbJ0N1cnNvck1vcnBoJ107XG5leHBvcnQgY29uc3QgQm94TW9ycGggPSB3aW5kb3dbJ0JveE1vcnBoJ107XG5leHBvcnQgY29uc3QgU3BlZWNoQnViYmxlTW9ycGggPSB3aW5kb3dbJ1NwZWVjaEJ1YmJsZU1vcnBoJ107XG5leHBvcnQgY29uc3QgRGlhbE1vcnBoID0gd2luZG93WydEaWFsTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBDaXJjbGVCb3hNb3JwaCA9IHdpbmRvd1snQ2lyY2xlQm94TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBTbGlkZXJCdXR0b25Nb3JwaCA9IHdpbmRvd1snU2xpZGVyQnV0dG9uTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBNb3VzZVNlbnNvck1vcnBoID0gd2luZG93WydNb3VzZVNlbnNvck1vcnBoJ107XG5leHBvcnQgY29uc3QgTGlzdE1vcnBoID0gd2luZG93WydMaXN0TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBUcmlnZ2VyTW9ycGggPSB3aW5kb3dbJ1RyaWdnZXJNb3JwaCddO1xuZXhwb3J0IGNvbnN0IE1lbnVJdGVtTW9ycGggPSB3aW5kb3dbJ01lbnVJdGVtTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBCb3VuY2VyTW9ycGggPSB3aW5kb3dbJ0JvdW5jZXJNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFN5bWJvbE1vcnBoID0gd2luZG93WydTeW1ib2xNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFB1c2hCdXR0b25Nb3JwaCA9IHdpbmRvd1snUHVzaEJ1dHRvbk1vcnBoJ107XG5leHBvcnQgY29uc3QgVG9nZ2xlQnV0dG9uTW9ycGggPSB3aW5kb3dbJ1RvZ2dsZUJ1dHRvbk1vcnBoJ107XG5leHBvcnQgY29uc3QgVGFiTW9ycGggPSB3aW5kb3dbJ1RhYk1vcnBoJ107XG5leHBvcnQgY29uc3QgVG9nZ2xlTW9ycGggPSB3aW5kb3dbJ1RvZ2dsZU1vcnBoJ107XG5leHBvcnQgY29uc3QgVG9nZ2xlRWxlbWVudE1vcnBoID0gd2luZG93WydUb2dnbGVFbGVtZW50TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBEaWFsb2dCb3hNb3JwaCA9IHdpbmRvd1snRGlhbG9nQm94TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBBbGlnbm1lbnRNb3JwaCA9IHdpbmRvd1snQWxpZ25tZW50TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBJbnB1dEZpZWxkTW9ycGggPSB3aW5kb3dbJ0lucHV0RmllbGRNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFBpYW5vTWVudU1vcnBoID0gd2luZG93WydQaWFub01lbnVNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFBpYW5vS2V5TW9ycGggPSB3aW5kb3dbJ1BpYW5vS2V5TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBTeW50YXhFbGVtZW50TW9ycGggPSB3aW5kb3dbJ1N5bnRheEVsZW1lbnRNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEJsb2NrTW9ycGggPSB3aW5kb3dbJ0Jsb2NrTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBCbG9ja0xhYmVsTW9ycGggPSB3aW5kb3dbJ0Jsb2NrTGFiZWxNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEJsb2NrU3ltYm9sTW9ycGggPSB3aW5kb3dbJ0Jsb2NrU3ltYm9sTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBDb21tYW5kQmxvY2tNb3JwaCA9IHdpbmRvd1snQ29tbWFuZEJsb2NrTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBSZXBvcnRlckJsb2NrTW9ycGggPSB3aW5kb3dbJ1JlcG9ydGVyQmxvY2tNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFNjcmlwdHNNb3JwaCA9IHdpbmRvd1snU2NyaXB0c01vcnBoJ107XG5leHBvcnQgY29uc3QgQXJnTW9ycGggPSB3aW5kb3dbJ0FyZ01vcnBoJ107XG5leHBvcnQgY29uc3QgQ29tbWFuZFNsb3RNb3JwaCA9IHdpbmRvd1snQ29tbWFuZFNsb3RNb3JwaCddO1xuZXhwb3J0IGNvbnN0IENTbG90TW9ycGggPSB3aW5kb3dbJ0NTbG90TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBJbnB1dFNsb3RNb3JwaCA9IHdpbmRvd1snSW5wdXRTbG90TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBJbnB1dFNsb3RTdHJpbmdNb3JwaCA9IHdpbmRvd1snSW5wdXRTbG90U3RyaW5nTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBJbnB1dFNsb3RUZXh0TW9ycGggPSB3aW5kb3dbJ0lucHV0U2xvdFRleHRNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEJvb2xlYW5TbG90TW9ycGggPSB3aW5kb3dbJ0Jvb2xlYW5TbG90TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBBcnJvd01vcnBoID0gd2luZG93WydBcnJvd01vcnBoJ107XG5leHBvcnQgY29uc3QgQ29sb3JTbG90TW9ycGggPSB3aW5kb3dbJ0NvbG9yU2xvdE1vcnBoJ107XG5leHBvcnQgY29uc3QgSGF0QmxvY2tNb3JwaCA9IHdpbmRvd1snSGF0QmxvY2tNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEJsb2NrSGlnaGxpZ2h0TW9ycGggPSB3aW5kb3dbJ0Jsb2NrSGlnaGxpZ2h0TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBNdWx0aUFyZ01vcnBoID0gd2luZG93WydNdWx0aUFyZ01vcnBoJ107XG5leHBvcnQgY29uc3QgVGVtcGxhdGVTbG90TW9ycGggPSB3aW5kb3dbJ1RlbXBsYXRlU2xvdE1vcnBoJ107XG5leHBvcnQgY29uc3QgRnVuY3Rpb25TbG90TW9ycGggPSB3aW5kb3dbJ0Z1bmN0aW9uU2xvdE1vcnBoJ107XG5leHBvcnQgY29uc3QgUmVwb3J0ZXJTbG90TW9ycGggPSB3aW5kb3dbJ1JlcG9ydGVyU2xvdE1vcnBoJ107XG5leHBvcnQgY29uc3QgUmluZ01vcnBoID0gd2luZG93WydSaW5nTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBSaW5nQ29tbWFuZFNsb3RNb3JwaCA9IHdpbmRvd1snUmluZ0NvbW1hbmRTbG90TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBSaW5nUmVwb3J0ZXJTbG90TW9ycGggPSB3aW5kb3dbJ1JpbmdSZXBvcnRlclNsb3RNb3JwaCddO1xuZXhwb3J0IGNvbnN0IENvbW1lbnRNb3JwaCA9IHdpbmRvd1snQ29tbWVudE1vcnBoJ107XG5leHBvcnQgY29uc3QgQXJnTGFiZWxNb3JwaCA9IHdpbmRvd1snQXJnTGFiZWxNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFRleHRTbG90TW9ycGggPSB3aW5kb3dbJ1RleHRTbG90TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBTY3JpcHRGb2N1c01vcnBoID0gd2luZG93WydTY3JpcHRGb2N1c01vcnBoJ107XG5leHBvcnQgY29uc3QgVGhyZWFkTWFuYWdlciA9IHdpbmRvd1snVGhyZWFkTWFuYWdlciddO1xuZXhwb3J0IGNvbnN0IFByb2Nlc3MgPSB3aW5kb3dbJ1Byb2Nlc3MnXTtcbmV4cG9ydCBjb25zdCBDb250ZXh0ID0gd2luZG93WydDb250ZXh0J107XG5leHBvcnQgY29uc3QgVmFyaWFibGUgPSB3aW5kb3dbJ1ZhcmlhYmxlJ107XG5leHBvcnQgY29uc3QgVmFyaWFibGVGcmFtZSA9IHdpbmRvd1snVmFyaWFibGVGcmFtZSddO1xuZXhwb3J0IGNvbnN0IEpTQ29tcGlsZXIgPSB3aW5kb3dbJ0pTQ29tcGlsZXInXTtcbmV4cG9ydCBjb25zdCBzbmFwRXF1YWxzID0gd2luZG93WydzbmFwRXF1YWxzJ107XG5leHBvcnQgY29uc3QgaW52b2tlID0gd2luZG93WydpbnZva2UnXTtcbmV4cG9ydCBjb25zdCBTcHJpdGVNb3JwaCA9IHdpbmRvd1snU3ByaXRlTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBTdGFnZU1vcnBoID0gd2luZG93WydTdGFnZU1vcnBoJ107XG5leHBvcnQgY29uc3QgU3ByaXRlQnViYmxlTW9ycGggPSB3aW5kb3dbJ1Nwcml0ZUJ1YmJsZU1vcnBoJ107XG5leHBvcnQgY29uc3QgQ29zdHVtZSA9IHdpbmRvd1snQ29zdHVtZSddO1xuZXhwb3J0IGNvbnN0IFNWR19Db3N0dW1lID0gd2luZG93WydTVkdfQ29zdHVtZSddO1xuZXhwb3J0IGNvbnN0IENvc3R1bWVFZGl0b3JNb3JwaCA9IHdpbmRvd1snQ29zdHVtZUVkaXRvck1vcnBoJ107XG5leHBvcnQgY29uc3QgU291bmQgPSB3aW5kb3dbJ1NvdW5kJ107XG5leHBvcnQgY29uc3QgTm90ZSA9IHdpbmRvd1snTm90ZSddO1xuZXhwb3J0IGNvbnN0IE1pY3JvcGhvbmUgPSB3aW5kb3dbJ01pY3JvcGhvbmUnXTtcbmV4cG9ydCBjb25zdCBDZWxsTW9ycGggPSB3aW5kb3dbJ0NlbGxNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFdhdGNoZXJNb3JwaCA9IHdpbmRvd1snV2F0Y2hlck1vcnBoJ107XG5leHBvcnQgY29uc3QgU3RhZ2VQcm9tcHRlck1vcnBoID0gd2luZG93WydTdGFnZVByb21wdGVyTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBTcHJpdGVIaWdobGlnaHRNb3JwaCA9IHdpbmRvd1snU3ByaXRlSGlnaGxpZ2h0TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBTdGFnZVBpY2tlck1vcnBoID0gd2luZG93WydTdGFnZVBpY2tlck1vcnBoJ107XG5leHBvcnQgY29uc3QgU3RhZ2VQaWNrZXJJdGVtTW9ycGggPSB3aW5kb3dbJ1N0YWdlUGlja2VySXRlbU1vcnBoJ107XG5leHBvcnQgY29uc3QgaXNTbmFwT2JqZWN0ID0gd2luZG93Wydpc1NuYXBPYmplY3QnXTtcbmV4cG9ydCBjb25zdCBQcm9qZWN0ID0gd2luZG93WydQcm9qZWN0J107XG5leHBvcnQgY29uc3QgU2NlbmUgPSB3aW5kb3dbJ1NjZW5lJ107XG5leHBvcnQgY29uc3QgSURFX01vcnBoID0gd2luZG93WydJREVfTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBQcm9qZWN0RGlhbG9nTW9ycGggPSB3aW5kb3dbJ1Byb2plY3REaWFsb2dNb3JwaCddO1xuZXhwb3J0IGNvbnN0IExpYnJhcnlJbXBvcnREaWFsb2dNb3JwaCA9IHdpbmRvd1snTGlicmFyeUltcG9ydERpYWxvZ01vcnBoJ107XG5leHBvcnQgY29uc3QgU3ByaXRlSWNvbk1vcnBoID0gd2luZG93WydTcHJpdGVJY29uTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBDb3N0dW1lSWNvbk1vcnBoID0gd2luZG93WydDb3N0dW1lSWNvbk1vcnBoJ107XG5leHBvcnQgY29uc3QgVHVydGxlSWNvbk1vcnBoID0gd2luZG93WydUdXJ0bGVJY29uTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBXYXJkcm9iZU1vcnBoID0gd2luZG93WydXYXJkcm9iZU1vcnBoJ107XG5leHBvcnQgY29uc3QgU291bmRJY29uTW9ycGggPSB3aW5kb3dbJ1NvdW5kSWNvbk1vcnBoJ107XG5leHBvcnQgY29uc3QgSnVrZWJveE1vcnBoID0gd2luZG93WydKdWtlYm94TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBTY2VuZUljb25Nb3JwaCA9IHdpbmRvd1snU2NlbmVJY29uTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBTY2VuZUFsYnVtTW9ycGggPSB3aW5kb3dbJ1NjZW5lQWxidW1Nb3JwaCddO1xuZXhwb3J0IGNvbnN0IFN0YWdlSGFuZGxlTW9ycGggPSB3aW5kb3dbJ1N0YWdlSGFuZGxlTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBQYWxldHRlSGFuZGxlTW9ycGggPSB3aW5kb3dbJ1BhbGV0dGVIYW5kbGVNb3JwaCddO1xuZXhwb3J0IGNvbnN0IENhbVNuYXBzaG90RGlhbG9nTW9ycGggPSB3aW5kb3dbJ0NhbVNuYXBzaG90RGlhbG9nTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBTb3VuZFJlY29yZGVyRGlhbG9nTW9ycGggPSB3aW5kb3dbJ1NvdW5kUmVjb3JkZXJEaWFsb2dNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFByb2plY3RSZWNvdmVyeURpYWxvZ01vcnBoID0gd2luZG93WydQcm9qZWN0UmVjb3ZlcnlEaWFsb2dNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFBhaW50RWRpdG9yTW9ycGggPSB3aW5kb3dbJ1BhaW50RWRpdG9yTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBQYWludENhbnZhc01vcnBoID0gd2luZG93WydQYWludENhbnZhc01vcnBoJ107XG5leHBvcnQgY29uc3QgUGFpbnRDb2xvclBpY2tlck1vcnBoID0gd2luZG93WydQYWludENvbG9yUGlja2VyTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBMaXN0ID0gd2luZG93WydMaXN0J107XG5leHBvcnQgY29uc3QgTGlzdFdhdGNoZXJNb3JwaCA9IHdpbmRvd1snTGlzdFdhdGNoZXJNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEN1c3RvbUJsb2NrRGVmaW5pdGlvbiA9IHdpbmRvd1snQ3VzdG9tQmxvY2tEZWZpbml0aW9uJ107XG5leHBvcnQgY29uc3QgQ3VzdG9tQ29tbWFuZEJsb2NrTW9ycGggPSB3aW5kb3dbJ0N1c3RvbUNvbW1hbmRCbG9ja01vcnBoJ107XG5leHBvcnQgY29uc3QgQ3VzdG9tUmVwb3J0ZXJCbG9ja01vcnBoID0gd2luZG93WydDdXN0b21SZXBvcnRlckJsb2NrTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBCbG9ja0RpYWxvZ01vcnBoID0gd2luZG93WydCbG9ja0RpYWxvZ01vcnBoJ107XG5leHBvcnQgY29uc3QgQmxvY2tFZGl0b3JNb3JwaCA9IHdpbmRvd1snQmxvY2tFZGl0b3JNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFByb3RvdHlwZUhhdEJsb2NrTW9ycGggPSB3aW5kb3dbJ1Byb3RvdHlwZUhhdEJsb2NrTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBCbG9ja0xhYmVsRnJhZ21lbnQgPSB3aW5kb3dbJ0Jsb2NrTGFiZWxGcmFnbWVudCddO1xuZXhwb3J0IGNvbnN0IEJsb2NrTGFiZWxGcmFnbWVudE1vcnBoID0gd2luZG93WydCbG9ja0xhYmVsRnJhZ21lbnRNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEJsb2NrSW5wdXRGcmFnbWVudE1vcnBoID0gd2luZG93WydCbG9ja0lucHV0RnJhZ21lbnRNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEJsb2NrTGFiZWxQbGFjZUhvbGRlck1vcnBoID0gd2luZG93WydCbG9ja0xhYmVsUGxhY2VIb2xkZXJNb3JwaCddO1xuZXhwb3J0IGNvbnN0IElucHV0U2xvdERpYWxvZ01vcnBoID0gd2luZG93WydJbnB1dFNsb3REaWFsb2dNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFZhcmlhYmxlRGlhbG9nTW9ycGggPSB3aW5kb3dbJ1ZhcmlhYmxlRGlhbG9nTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBKYWdnZWRCbG9ja01vcnBoID0gd2luZG93WydKYWdnZWRCbG9ja01vcnBoJ107XG5leHBvcnQgY29uc3QgQmxvY2tFeHBvcnREaWFsb2dNb3JwaCA9IHdpbmRvd1snQmxvY2tFeHBvcnREaWFsb2dNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEJsb2NrSW1wb3J0RGlhbG9nTW9ycGggPSB3aW5kb3dbJ0Jsb2NrSW1wb3J0RGlhbG9nTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBCbG9ja1JlbW92YWxEaWFsb2dNb3JwaCA9IHdpbmRvd1snQmxvY2tSZW1vdmFsRGlhbG9nTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBCbG9ja1Zpc2liaWxpdHlEaWFsb2dNb3JwaCA9IHdpbmRvd1snQmxvY2tWaXNpYmlsaXR5RGlhbG9nTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBUYWJsZSA9IHdpbmRvd1snVGFibGUnXTtcbmV4cG9ydCBjb25zdCBUYWJsZUNlbGxNb3JwaCA9IHdpbmRvd1snVGFibGVDZWxsTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBUYWJsZU1vcnBoID0gd2luZG93WydUYWJsZU1vcnBoJ107XG5leHBvcnQgY29uc3QgVGFibGVGcmFtZU1vcnBoID0gd2luZG93WydUYWJsZUZyYW1lTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBUYWJsZURpYWxvZ01vcnBoID0gd2luZG93WydUYWJsZURpYWxvZ01vcnBoJ107XG5leHBvcnQgY29uc3QgVmVjdG9yU2hhcGUgPSB3aW5kb3dbJ1ZlY3RvclNoYXBlJ107XG5leHBvcnQgY29uc3QgVmVjdG9yUmVjdGFuZ2xlID0gd2luZG93WydWZWN0b3JSZWN0YW5nbGUnXTtcbmV4cG9ydCBjb25zdCBWZWN0b3JMaW5lID0gd2luZG93WydWZWN0b3JMaW5lJ107XG5leHBvcnQgY29uc3QgVmVjdG9yRWxsaXBzZSA9IHdpbmRvd1snVmVjdG9yRWxsaXBzZSddO1xuZXhwb3J0IGNvbnN0IFZlY3RvclBvbHlnb24gPSB3aW5kb3dbJ1ZlY3RvclBvbHlnb24nXTtcbmV4cG9ydCBjb25zdCBWZWN0b3JTZWxlY3Rpb24gPSB3aW5kb3dbJ1ZlY3RvclNlbGVjdGlvbiddO1xuZXhwb3J0IGNvbnN0IFZlY3RvclBhaW50RWRpdG9yTW9ycGggPSB3aW5kb3dbJ1ZlY3RvclBhaW50RWRpdG9yTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBWZWN0b3JQYWludENhbnZhc01vcnBoID0gd2luZG93WydWZWN0b3JQYWludENhbnZhc01vcnBoJ107XG5leHBvcnQgY29uc3QgQ3Jvc3NoYWlyID0gd2luZG93WydDcm9zc2hhaXInXTtcbmV4cG9ydCBjb25zdCBWaWRlb01vdGlvbiA9IHdpbmRvd1snVmlkZW9Nb3Rpb24nXTtcbmV4cG9ydCBjb25zdCBXb3JsZE1hcCA9IHdpbmRvd1snV29ybGRNYXAnXTtcbmV4cG9ydCBjb25zdCBSZWFkU3RyZWFtID0gd2luZG93WydSZWFkU3RyZWFtJ107XG5leHBvcnQgY29uc3QgWE1MX0VsZW1lbnQgPSB3aW5kb3dbJ1hNTF9FbGVtZW50J107XG5leHBvcnQgY29uc3QgWE1MX1NlcmlhbGl6ZXIgPSB3aW5kb3dbJ1hNTF9TZXJpYWxpemVyJ107XG5leHBvcnQgY29uc3QgU25hcFNlcmlhbGl6ZXIgPSB3aW5kb3dbJ1NuYXBTZXJpYWxpemVyJ107XG5leHBvcnQgY29uc3QgTG9jYWxpemVyID0gd2luZG93WydMb2NhbGl6ZXInXTtcbmV4cG9ydCBjb25zdCBDbG91ZCA9IHdpbmRvd1snQ2xvdWQnXTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IEJsb2NrRmFjdG9yeSB9IGZyb20gXCIuL2Jsb2Nrcy9CbG9ja0ZhY3RvcnlcIjtcclxuaW1wb3J0IHsgRXZlbnRNYW5hZ2VyIH0gZnJvbSBcIi4vZXZlbnRzL1NuYXBFdmVudFwiO1xyXG5pbXBvcnQgeyBEZWZHZW5lcmF0b3IgfSBmcm9tIFwiLi9tZXRhL0RlZkdlbmVyYXRvclwiO1xyXG5pbXBvcnQgeyBTbmFwSGVscGVyIH0gZnJvbSBcIi4vc25hcC9TbmFwSGVscGVyXCI7XHJcblxyXG4vLyBBZGQgb2JqZWN0IHRvIHdpbmRvdyBmb3IgZGVidWdnaW5cclxud2luZG93WydTRU0nXSA9IHtcclxuICAgIGV2ZW50czogbmV3IEV2ZW50TWFuYWdlcigpLFxyXG4gICAgYmxvY2tzOiBuZXcgQmxvY2tGYWN0b3J5KCksXHJcbiAgICBoZWxwZXI6IG5ldyBTbmFwSGVscGVyKCksXHJcbiAgICBnZW5lcmF0b3I6IG5ldyBEZWZHZW5lcmF0b3IoKSxcclxufTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9