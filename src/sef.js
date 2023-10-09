var SEF;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/BlockFactory.ts":
/*!************************************!*\
  !*** ./src/blocks/BlockFactory.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Blocks = void 0;
const OverrideRegistry_1 = __webpack_require__(/*! ../extend/OverrideRegistry */ "./src/extend/OverrideRegistry.ts");
const SnapUtils_1 = __webpack_require__(/*! ../snap/SnapUtils */ "./src/snap/SnapUtils.ts");
const Snap_1 = __webpack_require__(/*! ../snap/Snap */ "./src/snap/Snap.js");
var Blocks;
(function (Blocks) {
    class BlockFactory {
        constructor() {
            this.categories = [];
            this.needsInit = false;
            this.blocks = [];
            this.needsInit = false;
            const myBlocks = this.blocks;
            const myCategories = this.categories;
            const myself = this;
            const override = function (base, category, all) {
                let blocks = base.call(this, category);
                let checkSprite = this instanceof Snap_1.StageMorph;
                let added = 0;
                myBlocks.forEach(block => {
                    if (block.category === category &&
                        !(checkSprite && block.spriteOnly)) {
                        if (block.top) {
                            blocks.splice(added, 0, block.toBlockMorph());
                            blocks.splice(added, 0, block.toToggle(this));
                            added++;
                        }
                        else {
                            blocks.push(block.toToggle(this));
                            blocks.push(block.toBlockMorph());
                        }
                    }
                });
                return blocks;
            };
            OverrideRegistry_1.OverrideRegistry.extend(Snap_1.SpriteMorph, 'initBlocks', function (base) {
                base.call(this);
                myCategories.forEach(c => {
                    myself.addCategoryToPallette(c.name, c.color);
                });
                myBlocks.forEach(block => {
                    block.addToMap(Snap_1.SpriteMorph.prototype.blocks);
                });
            });
            OverrideRegistry_1.OverrideRegistry.extend(Snap_1.SpriteMorph, 'blockTemplates', override, false);
            OverrideRegistry_1.OverrideRegistry.extend(Snap_1.StageMorph, 'blockTemplates', override, false);
            OverrideRegistry_1.OverrideRegistry.before(Snap_1.IDE_Morph, 'createCategories', function (base) {
                myCategories.forEach(c => {
                    myself.addCategoryToPallette(c.name, c.color);
                });
            });
            this.queueRefresh();
        }
        registerBlock(block) {
            this.blocks.push(block);
            this.queueRefresh();
        }
        queueRefresh() {
            if (this.needsInit)
                return;
            this.needsInit = true;
            setTimeout(() => {
                if (!this.needsInit)
                    return;
                this.refresh();
            }, 1);
        }
        refresh() {
            if (!SnapUtils_1.Snap.IDE)
                return;
            Snap_1.SpriteMorph.prototype.initBlocks();
            SnapUtils_1.Snap.IDE.flushBlocksCache();
            SnapUtils_1.Snap.IDE.refreshPalette();
            SnapUtils_1.Snap.IDE.categories.refreshEmpty();
            this.needsInit = false;
        }
        addCategoryToPallette(name, color) {
            // TODO: Fix this so that the layout works
            // SpriteMorph.prototype.categories.push(name);
            // SpriteMorph.prototype.blockColor[name] = color;
            if (!Snap_1.SpriteMorph.prototype.customCategories.has(name)) {
                SnapUtils_1.Snap.IDE.addPaletteCategory(name, color);
            }
            ;
        }
        addCategory(name, color) {
            this.categories.push({ name, color });
            this.addCategoryToPallette(name, color);
        }
        addLabeledInput(name, options, ...tags) {
            if (Snap_1.SyntaxElementMorph.prototype.labelParts[name]) {
                throw new Error(`Input type with label ${name} already exists.`);
            }
            // Ensure that all string values are array-enclosed
            Object.keys(options).forEach(k => {
                if (typeof (options[k]) === 'string') {
                    options[k] = [options[k]];
                }
            });
            Snap_1.SyntaxElementMorph.prototype.labelParts[name] = {
                type: 'input',
                tags: tags.join(' '),
                menu: options,
            };
        }
    }
    Blocks.BlockFactory = BlockFactory;
    let InputTag;
    (function (InputTag) {
        /** Values will be interpreted as numeric. */
        InputTag["Numberic"] = "numeric";
        InputTag["ReadOnly"] = "read-only";
        InputTag["Unevaluated"] = "unevaluated";
        /** The input cannot be replaced with a reporter. */
        InputTag["Static"] = "static";
        InputTag["Landscape"] = "landscape";
        /** Monospace font. */
        InputTag["Monospace"] = "monospace";
        InputTag["Fading"] = "fading";
        InputTag["Protected"] = "protected";
        InputTag["Loop"] = "loop";
        /** The input is a lambda expression. */
        InputTag["Lambda"] = "lambda";
        /** The input is edited using a custom widget. */
        InputTag["Widget"] = "widget";
    })(InputTag = Blocks.InputTag || (Blocks.InputTag = {}));
    let BlockType;
    (function (BlockType) {
        BlockType["Command"] = "command";
        BlockType["Reporter"] = "reporter";
        BlockType["Predicate"] = "predicate";
    })(BlockType = Blocks.BlockType || (Blocks.BlockType = {}));
    class Block {
        constructor(selector, spec, defaults, type, category, spriteOnly = false, top = false, togglable = false) {
            this.selector = selector;
            this.spec = spec;
            this.defaults = defaults;
            this.type = type;
            this.category = category;
            this.spriteOnly = spriteOnly;
            this.top = top;
            this.togglable = togglable;
        }
        addToMap(map) {
            map[this.selector] = {
                only: this.spriteOnly ? Snap_1.SpriteMorph : undefined,
                type: this.type,
                category: this.category,
                spec: (0, Snap_1.localize)(this.spec),
                defaults: this.defaults,
            };
        }
        toBlockMorph() {
            if (Snap_1.StageMorph.prototype.hiddenPrimitives[this.selector]) {
                return null;
            }
            var newBlock = Snap_1.SpriteMorph.prototype.blockForSelector(this.selector, true);
            if (!newBlock) {
                console.warn('Cannot initialize block', this.selector);
                return null;
            }
            newBlock.isTemplate = true;
            return newBlock;
        }
        toToggle(sprite) {
            if (!this.togglable)
                return null;
            let selector = this.selector;
            if (Snap_1.StageMorph.prototype.hiddenPrimitives[selector]) {
                return null;
            }
            var info = Snap_1.SpriteMorph.prototype.blocks[selector];
            return new Snap_1.ToggleMorph('checkbox', this, function () {
                sprite.toggleWatcher(selector, (0, Snap_1.localize)(info.spec), sprite.blockColor[info.category]);
            }, null, function () {
                return sprite.showingWatcher(selector);
            }, null);
        }
        addSpriteAction(action) {
            Snap_1.SpriteMorph.prototype[this.selector] =
                Snap_1.StageMorph.prototype[this.selector] = action;
            return this;
        }
    }
    Blocks.Block = Block;
})(Blocks = exports.Blocks || (exports.Blocks = {}));


/***/ }),

/***/ "./src/dev/DevMode.ts":
/*!****************************!*\
  !*** ./src/dev/DevMode.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DevMode = void 0;
const ExtensionManager_1 = __webpack_require__(/*! ../extension/ExtensionManager */ "./src/extension/ExtensionManager.ts");
const SnapUtils_1 = __webpack_require__(/*! ../snap/SnapUtils */ "./src/snap/SnapUtils.ts");
const DEV_MODE_URLS = [
    "localhost",
    "127.0.0.1",
];
const DEV_MODE_URL_PARAM = "devMode";
const LAST_PROJECT_KEY = "lastProject";
class DevMode {
    constructor() {
        /**
         * If true, this means the user is running the editor locally or has
         * set the devMode URL parameter to true. When devMode is enabled,
         * the editor will automatically save the project to local storage
         * after every change and reload it on page load.
         */
        this.isDevMode = false;
        this.isDevMode = DEV_MODE_URLS.some(url => window.location.href.includes(url));
        let params = new URLSearchParams(window.location.search);
        if (params.has(DEV_MODE_URL_PARAM)) {
            this.isDevMode = params.get(DEV_MODE_URL_PARAM) == "true";
        }
    }
    init() {
        if (!this.isDevMode) {
            return;
        }
        let lastProject = localStorage.getItem(LAST_PROJECT_KEY);
        if (lastProject && lastProject.length > 0) {
            // TODO: Right now we set to 10ms to wait until after blocks are
            // loaded - should be a callback way to do it
            setTimeout(() => {
                SnapUtils_1.Snap.IDE.loadProjectXML(lastProject);
                console.log("Loading last project", SnapUtils_1.Snap.IDE.getProjectName());
            }, 500);
        }
        window.onbeforeunload = () => { };
        ExtensionManager_1.ExtensionManager.events.Trace.addGlobalListener((message) => {
            // Wait for next frame, since some edits occur after the log
            setTimeout(() => {
                let xml = SnapUtils_1.Snap.IDE.getProjectXML();
                if (xml != this.lastProjectXML) {
                    this.lastProjectXML = xml;
                    localStorage.setItem(LAST_PROJECT_KEY, xml);
                    // console.log("Saved project after: " + message);
                }
            }, 0);
        });
    }
}
exports.DevMode = DevMode;


/***/ }),

/***/ "./src/events/EventManager.ts":
/*!************************************!*\
  !*** ./src/events/EventManager.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventManager = void 0;
const SnapEvents_1 = __webpack_require__(/*! ./SnapEvents */ "./src/events/SnapEvents.ts");
const SnapUtils_1 = __webpack_require__(/*! ../snap/SnapUtils */ "./src/snap/SnapUtils.ts");
class EventManager {
    constructor() {
        this.Trace = window['Trace'];
        if (!this.Trace) {
            throw new Error('Cannot create Event Manager - Trace does not exist!');
        }
        this.listeners = new Map();
        this.Trace.addGlobalListener((message, data) => {
            this.handleEvent(message, data);
        });
        this.addListener(new SnapEvents_1.Events.Block.ClickRunListener((id) => {
            SnapUtils_1.Snap.lastRunBlock = SnapUtils_1.Snap.getBlock(id);
        }));
    }
    handleEvent(message, data) {
        let listeners = this.listeners.get(message);
        if (!listeners)
            return;
        listeners.forEach(l => {
            let args = l.convertArgs(data);
            l.callback(args);
        });
    }
    addListener(listener) {
        if (!listener)
            return;
        let type = listener.type;
        if (!this.listeners.has(type))
            this.listeners.set(type, []);
        let list = this.listeners.get(listener.type);
        list.push(listener);
    }
    test() {
        this.addListener(new SnapEvents_1.Events.Block.RenameListener(args => {
            console.log(args.id.selector);
        }));
        this.addListener(new SnapEvents_1.Events.InputSlot.MenuItemSelectedListener(args => {
            console.log(args.item);
        }));
        this.addListener(new SnapEvents_1.Events.Block.CreatedListener(args => {
            console.log(args.id);
        }));
        this.addListener(new SnapEvents_1.Events.IDE.AddSpriteListener(args => {
            console.log(args.name);
        }));
    }
}
exports.EventManager = EventManager;


/***/ }),

/***/ "./src/events/SnapEventListener.ts":
/*!*****************************************!*\
  !*** ./src/events/SnapEventListener.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SnapEventListener = void 0;
class SnapEventListener {
    constructor(type, callback) {
        this.type = type;
        this.callback = callback;
    }
    convertArgs(data) {
        if (data == null)
            return {};
        if (typeof data === 'object')
            return data;
        let obj = {};
        obj[this.getValueKey()] = data;
        return obj;
    }
    getValueKey() { return 'value'; }
}
exports.SnapEventListener = SnapEventListener;


/***/ }),

/***/ "./src/events/SnapEvents.ts":
/*!**********************************!*\
  !*** ./src/events/SnapEvents.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Events = void 0;
const SnapEventListener_1 = __webpack_require__(/*! ./SnapEventListener */ "./src/events/SnapEventListener.ts");
var Events;
(function (Events) {
    let Block;
    (function (Block) {
        class ClickRunListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ClickRunListener.type, args);
            }
        }
        ClickRunListener.type = 'Block.clickRun';
        Block.ClickRunListener = ClickRunListener;
        class ClickStopRunListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ClickStopRunListener.type, args);
            }
        }
        ClickStopRunListener.type = 'Block.clickStopRun';
        Block.ClickStopRunListener = ClickStopRunListener;
        class CreatedListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(CreatedListener.type, args);
            }
        }
        CreatedListener.type = 'Block.created';
        Block.CreatedListener = CreatedListener;
        class DragDestroyListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(DragDestroyListener.type, args);
            }
        }
        DragDestroyListener.type = 'Block.dragDestroy';
        Block.DragDestroyListener = DragDestroyListener;
        class GrabbedListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(GrabbedListener.type, args);
            }
        }
        GrabbedListener.type = 'Block.grabbed';
        Block.GrabbedListener = GrabbedListener;
        class RefactorVarListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(RefactorVarListener.type, args);
            }
        }
        RefactorVarListener.type = 'Block.refactorVar';
        Block.RefactorVarListener = RefactorVarListener;
        class RefactorVarErrorListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(RefactorVarErrorListener.type, args);
            }
        }
        RefactorVarErrorListener.type = 'Block.refactorVarError';
        Block.RefactorVarErrorListener = RefactorVarErrorListener;
        class RelabelListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(RelabelListener.type, args);
            }
        }
        RelabelListener.type = 'Block.relabel';
        Block.RelabelListener = RelabelListener;
        class RenameListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(RenameListener.type, args);
            }
        }
        RenameListener.type = 'Block.rename';
        Block.RenameListener = RenameListener;
        class RingifyListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(RingifyListener.type, args);
            }
        }
        RingifyListener.type = 'Block.ringify';
        Block.RingifyListener = RingifyListener;
        class ScriptPicListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ScriptPicListener.type, args);
            }
        }
        ScriptPicListener.type = 'Block.scriptPic';
        Block.ScriptPicListener = ScriptPicListener;
        class ShowHelpListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ShowHelpListener.type, args);
            }
        }
        ShowHelpListener.type = 'Block.showHelp';
        Block.ShowHelpListener = ShowHelpListener;
        class SnappedListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(SnappedListener.type, args);
            }
        }
        SnappedListener.type = 'Block.snapped';
        Block.SnappedListener = SnappedListener;
        class ToggleTransientVariableListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ToggleTransientVariableListener.type, args);
            }
        }
        ToggleTransientVariableListener.type = 'Block.toggleTransientVariable';
        Block.ToggleTransientVariableListener = ToggleTransientVariableListener;
        class UnringifyListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(UnringifyListener.type, args);
            }
        }
        UnringifyListener.type = 'Block.unringify';
        Block.UnringifyListener = UnringifyListener;
        class UserDestroyListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(UserDestroyListener.type, args);
            }
        }
        UserDestroyListener.type = 'Block.userDestroy';
        Block.UserDestroyListener = UserDestroyListener;
    })(Block = Events.Block || (Events.Block = {}));
    let BlockEditor;
    (function (BlockEditor) {
        class CancelListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(CancelListener.type, args);
            }
        }
        CancelListener.type = 'BlockEditor.cancel';
        BlockEditor.CancelListener = CancelListener;
        class ChangeTypeListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ChangeTypeListener.type, args);
            }
        }
        ChangeTypeListener.type = 'BlockEditor.changeType';
        BlockEditor.ChangeTypeListener = ChangeTypeListener;
        class OkListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(OkListener.type, args);
            }
        }
        OkListener.type = 'BlockEditor.ok';
        BlockEditor.OkListener = OkListener;
        class StartListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(StartListener.type, args);
            }
        }
        StartListener.type = 'BlockEditor.start';
        BlockEditor.StartListener = StartListener;
        class UpdateBlockLabelListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(UpdateBlockLabelListener.type, args);
            }
            getValueKey() { return 'newFragment'; }
        }
        UpdateBlockLabelListener.type = 'BlockEditor.updateBlockLabel';
        BlockEditor.UpdateBlockLabelListener = UpdateBlockLabelListener;
    })(BlockEditor = Events.BlockEditor || (Events.BlockEditor = {}));
    let BlockTypeDialog;
    (function (BlockTypeDialog) {
        class CancelListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(CancelListener.type, args);
            }
        }
        CancelListener.type = 'BlockTypeDialog.cancel';
        BlockTypeDialog.CancelListener = CancelListener;
        class ChangeBlockTypeListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ChangeBlockTypeListener.type, args);
            }
        }
        ChangeBlockTypeListener.type = 'BlockTypeDialog.changeBlockType';
        BlockTypeDialog.ChangeBlockTypeListener = ChangeBlockTypeListener;
        class NewBlockListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(NewBlockListener.type, args);
            }
        }
        NewBlockListener.type = 'BlockTypeDialog.newBlock';
        BlockTypeDialog.NewBlockListener = NewBlockListener;
        class OkListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(OkListener.type, args);
            }
        }
        OkListener.type = 'BlockTypeDialog.ok';
        BlockTypeDialog.OkListener = OkListener;
    })(BlockTypeDialog = Events.BlockTypeDialog || (Events.BlockTypeDialog = {}));
    let BooleanSlotMorph;
    (function (BooleanSlotMorph) {
        class ToggleValueListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ToggleValueListener.type, args);
            }
        }
        ToggleValueListener.type = 'BooleanSlotMorph.toggleValue';
        BooleanSlotMorph.ToggleValueListener = ToggleValueListener;
    })(BooleanSlotMorph = Events.BooleanSlotMorph || (Events.BooleanSlotMorph = {}));
    let ColorArg;
    (function (ColorArg) {
        class ChangeColorListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ChangeColorListener.type, args);
            }
        }
        ChangeColorListener.type = 'ColorArg.changeColor';
        ColorArg.ChangeColorListener = ChangeColorListener;
    })(ColorArg = Events.ColorArg || (Events.ColorArg = {}));
    let CommandBlock;
    (function (CommandBlock) {
        class WrapListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(WrapListener.type, args);
            }
        }
        WrapListener.type = 'CommandBlock.wrap';
        CommandBlock.WrapListener = WrapListener;
    })(CommandBlock = Events.CommandBlock || (Events.CommandBlock = {}));
    let IDE;
    (function (IDE) {
        class AddSpriteListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(AddSpriteListener.type, args);
            }
            getValueKey() { return 'name'; }
        }
        AddSpriteListener.type = 'IDE.addSprite';
        IDE.AddSpriteListener = AddSpriteListener;
        class ChangeCategoryListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ChangeCategoryListener.type, args);
            }
            getValueKey() { return 'category'; }
        }
        ChangeCategoryListener.type = 'IDE.changeCategory';
        IDE.ChangeCategoryListener = ChangeCategoryListener;
        class DeleteCustomBlockListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(DeleteCustomBlockListener.type, args);
            }
        }
        DeleteCustomBlockListener.type = 'IDE.deleteCustomBlock';
        IDE.DeleteCustomBlockListener = DeleteCustomBlockListener;
        class DuplicateSpriteListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(DuplicateSpriteListener.type, args);
            }
            getValueKey() { return 'name'; }
        }
        DuplicateSpriteListener.type = 'IDE.duplicateSprite';
        IDE.DuplicateSpriteListener = DuplicateSpriteListener;
        class ExportGlobalBlocksListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ExportGlobalBlocksListener.type, args);
            }
        }
        ExportGlobalBlocksListener.type = 'IDE.exportGlobalBlocks';
        IDE.ExportGlobalBlocksListener = ExportGlobalBlocksListener;
        class ExportProejctAsCloudDataListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ExportProejctAsCloudDataListener.type, args);
            }
            getValueKey() { return 'name'; }
        }
        ExportProejctAsCloudDataListener.type = 'IDE.exportProejctAsCloudData';
        IDE.ExportProejctAsCloudDataListener = ExportProejctAsCloudDataListener;
        class ExportProjectListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ExportProjectListener.type, args);
            }
            getValueKey() { return 'name'; }
        }
        ExportProjectListener.type = 'IDE.exportProject';
        IDE.ExportProjectListener = ExportProjectListener;
        class ExportProjectMediaListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ExportProjectMediaListener.type, args);
            }
            getValueKey() { return 'name'; }
        }
        ExportProjectMediaListener.type = 'IDE.exportProjectMedia';
        IDE.ExportProjectMediaListener = ExportProjectMediaListener;
        class ExportProjectNoMediaListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ExportProjectNoMediaListener.type, args);
            }
            getValueKey() { return 'name'; }
        }
        ExportProjectNoMediaListener.type = 'IDE.exportProjectNoMedia';
        IDE.ExportProjectNoMediaListener = ExportProjectNoMediaListener;
        class ExportScriptsPictureListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ExportScriptsPictureListener.type, args);
            }
        }
        ExportScriptsPictureListener.type = 'IDE.exportScriptsPicture';
        IDE.ExportScriptsPictureListener = ExportScriptsPictureListener;
        class ExportSpriteListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ExportSpriteListener.type, args);
            }
            getValueKey() { return 'name'; }
        }
        ExportSpriteListener.type = 'IDE.exportSprite';
        IDE.ExportSpriteListener = ExportSpriteListener;
        class GreenFlagListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(GreenFlagListener.type, args);
            }
        }
        GreenFlagListener.type = 'IDE.greenFlag';
        IDE.GreenFlagListener = GreenFlagListener;
        class LoadFailedListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(LoadFailedListener.type, args);
            }
            getValueKey() { return 'err'; }
        }
        LoadFailedListener.type = 'IDE.loadFailed';
        IDE.LoadFailedListener = LoadFailedListener;
        class NewProjectListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(NewProjectListener.type, args);
            }
        }
        NewProjectListener.type = 'IDE.newProject';
        IDE.NewProjectListener = NewProjectListener;
        class OpenBlocksStringListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(OpenBlocksStringListener.type, args);
            }
        }
        OpenBlocksStringListener.type = 'IDE.openBlocksString';
        IDE.OpenBlocksStringListener = OpenBlocksStringListener;
        class OpenCloudDataStringListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(OpenCloudDataStringListener.type, args);
            }
        }
        OpenCloudDataStringListener.type = 'IDE.openCloudDataString';
        IDE.OpenCloudDataStringListener = OpenCloudDataStringListener;
        class OpenMediaStringListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(OpenMediaStringListener.type, args);
            }
        }
        OpenMediaStringListener.type = 'IDE.openMediaString';
        IDE.OpenMediaStringListener = OpenMediaStringListener;
        class OpenProjectListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(OpenProjectListener.type, args);
            }
            getValueKey() { return 'name'; }
        }
        OpenProjectListener.type = 'IDE.openProject';
        IDE.OpenProjectListener = OpenProjectListener;
        class OpenProjectStringListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(OpenProjectStringListener.type, args);
            }
        }
        OpenProjectStringListener.type = 'IDE.openProjectString';
        IDE.OpenProjectStringListener = OpenProjectStringListener;
        class OpenSpritesStringListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(OpenSpritesStringListener.type, args);
            }
        }
        OpenSpritesStringListener.type = 'IDE.openSpritesString';
        IDE.OpenSpritesStringListener = OpenSpritesStringListener;
        class OpenedListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(OpenedListener.type, args);
            }
        }
        OpenedListener.type = 'IDE.opened';
        IDE.OpenedListener = OpenedListener;
        class PaintNewSpriteListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(PaintNewSpriteListener.type, args);
            }
            getValueKey() { return 'name'; }
        }
        PaintNewSpriteListener.type = 'IDE.paintNewSprite';
        IDE.PaintNewSpriteListener = PaintNewSpriteListener;
        class PauseListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(PauseListener.type, args);
            }
        }
        PauseListener.type = 'IDE.pause';
        IDE.PauseListener = PauseListener;
        class RotationStyleChangedListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(RotationStyleChangedListener.type, args);
            }
            getValueKey() { return 'rotationStyle'; }
        }
        RotationStyleChangedListener.type = 'IDE.rotationStyleChanged';
        IDE.RotationStyleChangedListener = RotationStyleChangedListener;
        class SaveProjectToCloudListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(SaveProjectToCloudListener.type, args);
            }
            getValueKey() { return 'name'; }
        }
        SaveProjectToCloudListener.type = 'IDE.saveProjectToCloud';
        IDE.SaveProjectToCloudListener = SaveProjectToCloudListener;
        class SelectSpriteListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(SelectSpriteListener.type, args);
            }
            getValueKey() { return 'name'; }
        }
        SelectSpriteListener.type = 'IDE.selectSprite';
        IDE.SelectSpriteListener = SelectSpriteListener;
        class SetLanguageListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(SetLanguageListener.type, args);
            }
            getValueKey() { return 'lang'; }
        }
        SetLanguageListener.type = 'IDE.setLanguage';
        IDE.SetLanguageListener = SetLanguageListener;
        class SetSpriteDraggableListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(SetSpriteDraggableListener.type, args);
            }
            getValueKey() { return 'isDraggable'; }
        }
        SetSpriteDraggableListener.type = 'IDE.setSpriteDraggable';
        IDE.SetSpriteDraggableListener = SetSpriteDraggableListener;
        class SetSpriteTabListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(SetSpriteTabListener.type, args);
            }
            getValueKey() { return 'tabString'; }
        }
        SetSpriteTabListener.type = 'IDE.setSpriteTab';
        IDE.SetSpriteTabListener = SetSpriteTabListener;
        class StopListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(StopListener.type, args);
            }
        }
        StopListener.type = 'IDE.stop';
        IDE.StopListener = StopListener;
        class ToggleAppModeListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ToggleAppModeListener.type, args);
            }
            getValueKey() { return 'isAppMode'; }
        }
        ToggleAppModeListener.type = 'IDE.toggleAppMode';
        IDE.ToggleAppModeListener = ToggleAppModeListener;
        class ToggleStageSizeListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ToggleStageSizeListener.type, args);
            }
            getValueKey() { return 'isSmallStage'; }
        }
        ToggleStageSizeListener.type = 'IDE.toggleStageSize';
        IDE.ToggleStageSizeListener = ToggleStageSizeListener;
        class UnpauseListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(UnpauseListener.type, args);
            }
        }
        UnpauseListener.type = 'IDE.unpause';
        IDE.UnpauseListener = UnpauseListener;
    })(IDE = Events.IDE || (Events.IDE = {}));
    let InputSlot;
    (function (InputSlot) {
        class EditedListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(EditedListener.type, args);
            }
        }
        EditedListener.type = 'InputSlot.edited';
        InputSlot.EditedListener = EditedListener;
        class MenuItemSelectedListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(MenuItemSelectedListener.type, args);
            }
        }
        MenuItemSelectedListener.type = 'InputSlot.menuItemSelected';
        InputSlot.MenuItemSelectedListener = MenuItemSelectedListener;
    })(InputSlot = Events.InputSlot || (Events.InputSlot = {}));
    let MultiArg;
    (function (MultiArg) {
        class AddInputListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(AddInputListener.type, args);
            }
        }
        AddInputListener.type = 'MultiArg.addInput';
        MultiArg.AddInputListener = AddInputListener;
        class RemoveInputListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(RemoveInputListener.type, args);
            }
        }
        RemoveInputListener.type = 'MultiArg.removeInput';
        MultiArg.RemoveInputListener = RemoveInputListener;
    })(MultiArg = Events.MultiArg || (Events.MultiArg = {}));
    let ProjectDialog;
    (function (ProjectDialog) {
        class SetSourceListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(SetSourceListener.type, args);
            }
            getValueKey() { return 'source'; }
        }
        SetSourceListener.type = 'ProjectDialog.setSource';
        ProjectDialog.SetSourceListener = SetSourceListener;
        class ShareProjectListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ShareProjectListener.type, args);
            }
        }
        ShareProjectListener.type = 'ProjectDialog.shareProject';
        ProjectDialog.ShareProjectListener = ShareProjectListener;
        class ShownListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ShownListener.type, args);
            }
        }
        ShownListener.type = 'ProjectDialog.shown';
        ProjectDialog.ShownListener = ShownListener;
        class UnshareProjectListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(UnshareProjectListener.type, args);
            }
            getValueKey() { return 'ProjectName'; }
        }
        UnshareProjectListener.type = 'ProjectDialog.unshareProject';
        ProjectDialog.UnshareProjectListener = UnshareProjectListener;
    })(ProjectDialog = Events.ProjectDialog || (Events.ProjectDialog = {}));
    let Scripts;
    (function (Scripts) {
        class CleanUpListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(CleanUpListener.type, args);
            }
        }
        CleanUpListener.type = 'Scripts.cleanUp';
        Scripts.CleanUpListener = CleanUpListener;
        class ExportPictureListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ExportPictureListener.type, args);
            }
        }
        ExportPictureListener.type = 'Scripts.exportPicture';
        Scripts.ExportPictureListener = ExportPictureListener;
        class RedropListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(RedropListener.type, args);
            }
            getValueKey() { return 'action'; }
        }
        RedropListener.type = 'Scripts.redrop';
        Scripts.RedropListener = RedropListener;
        class UndropListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(UndropListener.type, args);
            }
            getValueKey() { return 'action'; }
        }
        UndropListener.type = 'Scripts.undrop';
        Scripts.UndropListener = UndropListener;
    })(Scripts = Events.Scripts || (Events.Scripts = {}));
    let Sprite;
    (function (Sprite) {
        class AddVariableListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(AddVariableListener.type, args);
            }
            getValueKey() { return 'name'; }
        }
        AddVariableListener.type = 'Sprite.addVariable';
        Sprite.AddVariableListener = AddVariableListener;
        class DeleteVariableListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(DeleteVariableListener.type, args);
            }
            getValueKey() { return 'varName'; }
        }
        DeleteVariableListener.type = 'Sprite.deleteVariable';
        Sprite.DeleteVariableListener = DeleteVariableListener;
        class SetNameListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(SetNameListener.type, args);
            }
            getValueKey() { return 'string'; }
        }
        SetNameListener.type = 'Sprite.setName';
        Sprite.SetNameListener = SetNameListener;
    })(Sprite = Events.Sprite || (Events.Sprite = {}));
    let XML;
    (function (XML) {
        class ParseFailedListener extends SnapEventListener_1.SnapEventListener {
            constructor(args) {
                super(ParseFailedListener.type, args);
            }
            getValueKey() { return 'xmlString'; }
        }
        ParseFailedListener.type = 'XML.parseFailed';
        XML.ParseFailedListener = ParseFailedListener;
    })(XML = Events.XML || (Events.XML = {}));
})(Events = exports.Events || (exports.Events = {}));


/***/ }),

/***/ "./src/extend/OverrideRegistry.ts":
/*!****************************************!*\
  !*** ./src/extend/OverrideRegistry.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extend = exports.CallContext = exports.OverrideRegistry = void 0;
function getPrototypeFunctionName(prototype, func) {
    for (let key in prototype) {
        if (prototype[key] === func)
            return key;
    }
    return null;
}
class OverrideRegistry {
    static extend(clazz, func, newFunction, countArgs = true) {
        if (!clazz || !clazz.prototype) {
            // eslint-disable-next-line no-console
            console.error('extend requires a class for its first argument');
            return;
        }
        return OverrideRegistry.extendObject(clazz.prototype, func, newFunction, countArgs);
    }
    static after(clazz, func, doAfter) {
        OverrideRegistry.wrap(clazz, func, null, doAfter);
    }
    static before(clazz, func, doBefore) {
        OverrideRegistry.wrap(clazz, func, doBefore, null);
    }
    static wrap(clazz, func, doBefore, doAfter) {
        function override(base) {
            let args = [...arguments].slice(1);
            if (doBefore)
                doBefore.apply(this, args);
            base.apply(this, args);
            if (doAfter)
                doAfter.apply(this, args);
        }
        OverrideRegistry.extend(clazz, func, override, false);
    }
    static extendObject(object, func, newFunction, countArgs = true) {
        let functionName = typeof func === 'string' ? func : getPrototypeFunctionName(object, func);
        if (!object[functionName]) {
            // eslint-disable-next-line no-console
            console.trace();
            // eslint-disable-next-line no-console
            console.error('Cannot extend function ' + functionName +
                ' because it does not exist.');
            return;
        }
        var oldFunction = object[functionName];
        if (countArgs && !oldFunction.extended && oldFunction.length != undefined &&
            oldFunction.length + 1 !== newFunction.length) {
            var message = 'Extending function with wrong number of arguments: ' +
                functionName + ' ' +
                oldFunction.length + ' vs ' + newFunction.length;
            console.warn(message);
        }
        object[functionName] = function () {
            var args = [].slice.call(arguments);
            args.unshift(oldFunction);
            return newFunction.apply(this, args);
        };
        object[functionName].extended = true;
        return oldFunction;
    }
}
exports.OverrideRegistry = OverrideRegistry;
class CallContext {
    constructor(thisArg, originalFunction, originalArgs) {
        this.thisArg = thisArg;
        this.originalFunction = originalFunction;
        this.originalArgs = originalArgs;
    }
    apply(args = this.originalArgs) {
        return this.originalFunction.apply(this.thisArg, args);
    }
    callWithOriginalArgs() {
        return this.originalFunction.call(this.thisArg, ...this.originalArgs);
    }
    callWithNewArgs(...args) {
        return this.originalFunction.call(this.thisArg, ...args);
    }
}
exports.CallContext = CallContext;
class Extender {
    constructor(proto, func) {
        this.prototype = proto;
        this.originalFunction = func;
    }
    override(override) {
        OverrideRegistry.extendObject(this.prototype, this.originalFunction, function (base) {
            let originalArgs = [...arguments].slice(1);
            let info = new CallContext(this, base, originalArgs);
            return override.call(this, info, ...originalArgs);
        }, false);
    }
    after(doAfter) {
        this.wrap(null, doAfter);
    }
    before(doBefore) {
        this.wrap(doBefore, null);
    }
    wrap(doBefore, doAfter) {
        OverrideRegistry.extendObject(this.prototype, this.originalFunction, function override(base) {
            let originalArgs = [...arguments].slice(1);
            let info = new CallContext(this, base, originalArgs);
            if (doBefore)
                doBefore.call(this, info, ...originalArgs);
            base.apply(this, originalArgs);
            if (doAfter)
                doAfter.call(this, info, ...originalArgs);
        }, false);
    }
}
function extend(proto) {
    let ex = {};
    let count = 0;
    for (let k in proto) {
        let key = k;
        let f = proto[k];
        if (typeof f === 'function') {
            // console.log( k);
            ex[key] = new Extender(proto, f);
            count++;
        }
    }
    ;
    // console.log("created " + count + " extenders");
    return ex;
}
exports.extend = extend;
// export class ParameterizedOverride {
//     static override<ClassType extends Function, FunctionType extends (...args) => any>(
//         clazz: ClassType, 
//         functionDef: FunctionType,
//         override: BaseWithContext<ClassType, FunctionType>,
//     ) {
//         OverrideRegistry.extend(clazz, functionDef, function (base) {
//             let originalArgs = [...arguments].slice(1);
//             let info = new CallContext(this, base, originalArgs);
//             return override(info, ...originalArgs);
//         }, true);
//     }
//     static after<ClassType extends Function, FunctionType extends BaseFunction>(
//         clazz: ClassType, 
//         functionDef: FunctionType,
//         doAfter: BaseWithContext<ClassType, FunctionType>,
//     ) {
//         ParameterizedOverride.wrap(clazz, functionDef, null, doAfter);
//     }
//     static before<ClassType extends Function, FunctionType extends BaseFunction>(
//         clazz: ClassType, 
//         functionDef: FunctionType,
//         doBefore: BaseWithContext<ClassType, FunctionType>,
//     ) {
//         ParameterizedOverride.wrap(clazz, functionDef, doBefore, null);
//     }
//     static wrap<ClassType extends Function, FunctionType extends BaseFunction>(
//         clazz: ClassType, 
//         functionDef: FunctionType,
//         doBefore?: BaseWithContext<ClassType, FunctionType>,
//         doAfter?: BaseWithContext<ClassType, FunctionType>,
//     ) {
//         function override(base: BaseFunction) {
//             let originalArgs = [...arguments].slice(1);
//             let info = new CallContext(this, base, originalArgs);
//             if (doBefore) doBefore(info, ...originalArgs);
//             base.apply(this, originalArgs);
//             if (doAfter) doAfter(info, ...originalArgs);
//         }
//         OverrideRegistry.extend(clazz, functionDef, override, false);
//     }
// }


/***/ }),

/***/ "./src/extension/Extension.ts":
/*!************************************!*\
  !*** ./src/extension/Extension.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Extension = void 0;
const ExtensionManager_1 = __webpack_require__(/*! ./ExtensionManager */ "./src/extension/ExtensionManager.ts");
class Extension {
    constructor() {
    }
    get events() {
        return ExtensionManager_1.ExtensionManager.events;
    }
    get blocks() {
        return ExtensionManager_1.ExtensionManager.blocks;
    }
    init() { }
    register() {
        ExtensionManager_1.ExtensionManager.register(this);
    }
    dependencies() {
        return [];
    }
}
exports.Extension = Extension;


/***/ }),

/***/ "./src/extension/ExtensionManager.ts":
/*!*******************************************!*\
  !*** ./src/extension/ExtensionManager.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExtensionManager = void 0;
const BlockFactory_1 = __webpack_require__(/*! ../blocks/BlockFactory */ "./src/blocks/BlockFactory.ts");
const DevMode_1 = __webpack_require__(/*! ../dev/DevMode */ "./src/dev/DevMode.ts");
const EventManager_1 = __webpack_require__(/*! ../events/EventManager */ "./src/events/EventManager.ts");
class ExtensionManager {
    static register(extension) {
        this.extensions.push(extension);
    }
    static init() {
        const configFn = window['getSEFConfig'];
        if (!configFn) {
            console.warn('No SEF config file: No extensions loaded. ' +
                'Please create libraries/sef-config.js.');
            return;
        }
        const config = configFn();
        if (!config || !Array.isArray(config.extensions)) {
            console.warn('Invalid sef-config.js file (no extensions property). ' +
                'Please see libraries/sef-config.example.js for an example.');
            return;
        }
        this.loadExtensions(config.extensions);
        this.devMode.init();
    }
    static initExtensions() {
        // TODO: Order based on dependencies
        // TODO: Load only when asked for, not always
        this.extensions.forEach(e => {
            e.init();
        });
    }
    static loadExtensions(paths) {
        let toLoad = 0;
        paths.forEach(path => {
            toLoad++;
            this.loadExtension(path, success => {
                if (!success) {
                    console.warn('Extension not found:', path);
                }
                toLoad--;
                if (toLoad == 0) {
                    this.initExtensions();
                }
            });
        });
    }
    static loadExtension(path, callback) {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', path);
        // TODO: remove simulated lag
        script.addEventListener('load', () => callback(true));
        script.addEventListener('error', () => callback(false));
        document.getElementsByTagName('head')[0].appendChild(script);
    }
}
exports.ExtensionManager = ExtensionManager;
ExtensionManager.extensions = [];
ExtensionManager.blocks = new BlockFactory_1.Blocks.BlockFactory();
ExtensionManager.events = new EventManager_1.EventManager();
ExtensionManager.devMode = new DevMode_1.DevMode();


/***/ }),

/***/ "./src/io/CloudUtils.ts":
/*!******************************!*\
  !*** ./src/io/CloudUtils.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Cloud = void 0;
const SnapUtils_1 = __webpack_require__(/*! ../snap/SnapUtils */ "./src/snap/SnapUtils.ts");
var Cloud;
(function (Cloud) {
    class Utils {
        static async getCloudProjects(withThumbnail) {
            return new Promise((resolve, reject) => {
                SnapUtils_1.Snap.cloud.getProjectList(dict => resolve(dict.projects), reject, withThumbnail);
            });
        }
        static async saveProject(projectName, body) {
            return new Promise((resolve, reject) => {
                SnapUtils_1.Snap.cloud.saveProject(projectName, body, resolve, reject);
            });
        }
        static async getPublicProject(projectName, userName) {
            return new Promise((resolve, reject) => {
                SnapUtils_1.Snap.cloud.getPublicProject(projectName, userName, resolve, reject);
            });
        }
        /**
         * @deprecated The cloud backend no longer supports this!
         */
        static async getProjectMetadata(projectName, userName) {
            return new Promise((resolve, reject) => {
                SnapUtils_1.Snap.cloud.getProjectMetadata(projectName, userName, resolve, reject);
            });
        }
        static async shareProject(projectName) {
            return new Promise((resolve, reject) => {
                SnapUtils_1.Snap.cloud.shareProject(projectName, SnapUtils_1.Snap.cloud.userName, resolve, reject);
            });
        }
        // TODO: Project should have some sort of plugin permission system...
        static async deleteProject(projectName) {
            return new Promise((resolve, reject) => {
                SnapUtils_1.Snap.cloud.deleteProject(projectName, SnapUtils_1.Snap.cloud.userName, resolve, reject);
            });
        }
        static getCurrentProjectData(verify) {
            let projectBody = SnapUtils_1.Snap.IDE.buildProjectRequest();
            if (!SnapUtils_1.Snap.IDE.verifyProject(projectBody))
                return null;
            return projectBody;
        }
        static getCurrentProjectName() {
            return SnapUtils_1.Snap.IDE.getProjectName();
        }
        static isLoggedIn() {
            return SnapUtils_1.Snap.cloud.username != null;
        }
        static username() {
            return SnapUtils_1.Snap.cloud.username;
        }
        static test() {
            this.getCloudProjects(false).then(projects => {
                console.log(projects[0].created);
            });
        }
    }
    Cloud.Utils = Utils;
})(Cloud = exports.Cloud || (exports.Cloud = {}));


/***/ }),

/***/ "./src/meta/DefGenerator.ts":
/*!**********************************!*\
  !*** ./src/meta/DefGenerator.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefGenerator = void 0;
/**
 * This class automatically generates typescript definitions
 * from Snap's source code. To run, open Snap in a browser and
 * from the console run:
 * new SEF.DefGenerator().init().downloadAll()
 */
class DefGenerator {
    constructor() {
        this.classes = new Map;
    }
    init() {
        for (let key of Object.keys(window)) {
            // console.log(key);
            if (!window.hasOwnProperty(key))
                continue;
            let value = window[key];
            if (!(value instanceof Function))
                continue;
            if (!value.prototype)
                continue;
            if (value.name.length == 0)
                continue;
            this.classes.set(key, new ClassDef(value));
        }
        this.classes.forEach(c => c.addParentData(this.classes));
        console.log(this.outputDefinitions());
        console.log(this);
        return this;
    }
    getClasses() {
        return [...this.classes.values()]
            .sort((a, b) => a.compareTo(b));
    }
    outputExports() {
        return this.getClasses().map(c => c.exportStatement()).join('\n');
    }
    outputDefinitions() {
        return `
export class SnapType {
    prototype: any;
    [key: string]: any;
}\n\n` + this.getClasses().map(c => c.toTS()).join('\n\n');
    }
    downloadAll() {
        this.downloadFile('Snap.js', this.outputExports());
        this.downloadFile('Snap.d.ts', this.outputDefinitions());
    }
    downloadFile(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}
exports.DefGenerator = DefGenerator;
class ClassDef {
    constructor(func) {
        var _a, _b;
        this.uber = null;
        this.fields = new Map;
        this.methods = new Map;
        this.addedParentData = false;
        this.baseFunction = func;
        this.name = func.name;
        const proto = func.prototype;
        if (!proto)
            return;
        if ([...Object.keys(proto)].length <= 1) {
            this.functionProxy = new Method(this.name, func);
            return;
        }
        this.uber = (_b = (_a = func['uber']) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.name;
        this.inferFields(func);
        for (let key of Object.getOwnPropertyNames(proto)) {
            // I think this is redundant...
            if (!proto.hasOwnProperty(key))
                continue;
            let value = proto[key];
            if (value instanceof Function) {
                this.methods.set(key, new Method(key, value));
            }
            else {
                // TODO: distinguish between inherited fields and static fields
                // this.fields.push(new Field(key, value, true));
            }
        }
        this.inferFields(proto['init']);
    }
    get isPureFunction() {
        return this.functionProxy != null;
    }
    compareTo(other) {
        if (this.isPureFunction && !other.isPureFunction)
            return -1;
        if (!this.isPureFunction && other.isPureFunction)
            return 1;
        return this.name.localeCompare(other.name);
    }
    addParentData(classes) {
        if (this.addedParentData)
            return;
        this.addedParentData = true;
        if (this.functionProxy)
            return;
        if (!this.uber || !classes.has(this.uber))
            return;
        const parent = classes.get(this.uber);
        if (!parent.addedParentData)
            parent.addParentData(classes);
        for (let [methodName, method] of parent.methods) {
            if (this.methods.has(methodName))
                continue;
            this.methods.set(methodName, method);
            // If a field overshadows a parent method, it was probably
            // a mistake, so delete it.
            // TODO: Not sure this is the right call; could ignore inheritance
            this.fields.delete(methodName);
        }
        for (let [fieldName, field] of parent.fields) {
            // Don't copy fields that have shadowing methods
            if (this.methods.has(fieldName))
                continue;
            if (this.fields.has(fieldName))
                continue;
            this.fields.set(fieldName, field);
        }
    }
    inferFields(func) {
        if (!func)
            return;
        const js = func.toString();
        const varDec = /^\s*this\s*\.\s*([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=/gm;
        for (let match of js.matchAll(varDec)) {
            let name = match[1];
            if (this.fields.has(name))
                continue;
            // Give precedence to methods
            if (this.methods.has(name))
                continue;
            this.fields.set(name, new Field(name, null, false));
        }
    }
    exportStatement() {
        return `export const ${this.name} = window['${this.name}'];`;
    }
    toTS() {
        if (this.functionProxy) {
            return `export function ${this.functionProxy.toTS()}`;
        }
        // let code = `export class ${this.name} extends ${this.uber ? this.uber : 'SnapType'}`;
        // TODO: Because Typescript seems not to allow function shadowing,
        // need to manually define all parent types and methods (that aren't shadowed) here
        let code = `export class ${this.name} extends SnapType`;
        code += ` {\n`;
        let fKeys = [...this.fields.keys()];
        fKeys.sort();
        for (let fkey of fKeys) {
            code += '    ' + this.fields.get(fkey).toTS() + '\n';
        }
        code += '\n';
        let mKeys = [...this.methods.keys()];
        mKeys.sort();
        for (let mKey of mKeys) {
            code += '    ' + this.methods.get(mKey).toTS() + '\n';
        }
        code += '}';
        return code;
    }
}
class Field {
    constructor(name, value, isStatic) {
        this.name = name;
        this.isStatic = isStatic;
        this.type = 'any';
        if (value !== null && value !== undefined) {
            this.type = typeof (value);
        }
    }
    toTS() {
        return `${this.isStatic ? 'static ' : ''}${this.name}: ${this.type};`;
    }
}
class Method {
    constructor(name, func) {
        this.name = name;
        this.paramNames = this.getParamNames(func);
    }
    getParamNames(func) {
        let fnStr = func.toString().replace(Method.STRIP_COMMENTS, '');
        let resultRegex = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(Method.ARGUMENT_NAMES);
        let result = resultRegex ? [...resultRegex] : [];
        result = result.filter(param => param.match(/^[a-zA-Z_$][0-9a-zA-Z_$]*$/));
        return result;
    }
    toTS() {
        const override = this.checkOverride();
        if (override)
            return override;
        let code = `${this.name}(`;
        let first = true;
        for (let name of this.paramNames) {
            if (!first)
                code += ', ';
            first = false;
            code += `${name}?: any`;
        }
        code += ');';
        return code;
    }
    checkOverride() {
        switch (this.name) {
            case 'childThatIsA': return `${this.name}(...args: any[]);`;
            case 'parentThatIsA': return `${this.name}(...args: any[]);`;
        }
        return null;
    }
}
Method.STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
Method.ARGUMENT_NAMES = /([^\s,]+)/g;


/***/ }),

/***/ "./src/snap/SnapUtils.ts":
/*!*******************************!*\
  !*** ./src/snap/SnapUtils.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Snap = void 0;
// import { Events, ExtensionManager } from "sef";
const Snap_1 = __webpack_require__(/*! ./Snap */ "./src/snap/Snap.js");
// TODO: Make an interface with an implementation that fetches from window
class Snap {
    static get world() {
        return window["world"];
    }
    static get IDE() {
        var _a;
        return (_a = this.world) === null || _a === void 0 ? void 0 : _a.childThatIsA(window['IDE_Morph']);
    }
    static get stage() {
        var _a;
        return (_a = this.IDE) === null || _a === void 0 ? void 0 : _a.stage;
    }
    static get currentSprite() {
        var _a;
        return (_a = this.IDE) === null || _a === void 0 ? void 0 : _a.currentSprite;
    }
    static get sprites() {
        var _a, _b;
        return ((_b = (_a = this.IDE) === null || _a === void 0 ? void 0 : _a.sprites) === null || _b === void 0 ? void 0 : _b.contents) || [];
    }
    static get cloud() {
        var _a;
        return (_a = this.IDE) === null || _a === void 0 ? void 0 : _a.cloud;
    }
    static getSprite(name) {
        return this.sprites.filter(sprite => sprite.name == name)[0];
    }
    static getBlock(id) {
        return this.world.allChildren()
            .filter(b => b instanceof Snap_1.BlockMorph && b.id == id.id)[0];
    }
}
exports.Snap = Snap;


/***/ }),

/***/ "./src/snap/Snap.js":
/*!**************************!*\
  !*** ./src/snap/Snap.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AlignmentMorph: () => (/* binding */ AlignmentMorph),
/* harmony export */   Animation: () => (/* binding */ Animation),
/* harmony export */   ArgLabelMorph: () => (/* binding */ ArgLabelMorph),
/* harmony export */   ArgMorph: () => (/* binding */ ArgMorph),
/* harmony export */   ArrowMorph: () => (/* binding */ ArrowMorph),
/* harmony export */   BlinkerMorph: () => (/* binding */ BlinkerMorph),
/* harmony export */   BlockDialogMorph: () => (/* binding */ BlockDialogMorph),
/* harmony export */   BlockEditorMorph: () => (/* binding */ BlockEditorMorph),
/* harmony export */   BlockExportDialogMorph: () => (/* binding */ BlockExportDialogMorph),
/* harmony export */   BlockHighlightMorph: () => (/* binding */ BlockHighlightMorph),
/* harmony export */   BlockImportDialogMorph: () => (/* binding */ BlockImportDialogMorph),
/* harmony export */   BlockInputFragmentMorph: () => (/* binding */ BlockInputFragmentMorph),
/* harmony export */   BlockLabelFragment: () => (/* binding */ BlockLabelFragment),
/* harmony export */   BlockLabelFragmentMorph: () => (/* binding */ BlockLabelFragmentMorph),
/* harmony export */   BlockLabelMorph: () => (/* binding */ BlockLabelMorph),
/* harmony export */   BlockLabelPlaceHolderMorph: () => (/* binding */ BlockLabelPlaceHolderMorph),
/* harmony export */   BlockMorph: () => (/* binding */ BlockMorph),
/* harmony export */   BlockRemovalDialogMorph: () => (/* binding */ BlockRemovalDialogMorph),
/* harmony export */   BlockSymbolMorph: () => (/* binding */ BlockSymbolMorph),
/* harmony export */   BlockVisibilityDialogMorph: () => (/* binding */ BlockVisibilityDialogMorph),
/* harmony export */   BooleanSlotMorph: () => (/* binding */ BooleanSlotMorph),
/* harmony export */   BouncerMorph: () => (/* binding */ BouncerMorph),
/* harmony export */   BoxMorph: () => (/* binding */ BoxMorph),
/* harmony export */   CSlotMorph: () => (/* binding */ CSlotMorph),
/* harmony export */   CamSnapshotDialogMorph: () => (/* binding */ CamSnapshotDialogMorph),
/* harmony export */   CellMorph: () => (/* binding */ CellMorph),
/* harmony export */   CircleBoxMorph: () => (/* binding */ CircleBoxMorph),
/* harmony export */   Cloud: () => (/* binding */ Cloud),
/* harmony export */   Color: () => (/* binding */ Color),
/* harmony export */   ColorPaletteMorph: () => (/* binding */ ColorPaletteMorph),
/* harmony export */   ColorPickerMorph: () => (/* binding */ ColorPickerMorph),
/* harmony export */   ColorSlotMorph: () => (/* binding */ ColorSlotMorph),
/* harmony export */   CommandBlockMorph: () => (/* binding */ CommandBlockMorph),
/* harmony export */   CommandSlotMorph: () => (/* binding */ CommandSlotMorph),
/* harmony export */   CommentMorph: () => (/* binding */ CommentMorph),
/* harmony export */   Context: () => (/* binding */ Context),
/* harmony export */   Costume: () => (/* binding */ Costume),
/* harmony export */   CostumeEditorMorph: () => (/* binding */ CostumeEditorMorph),
/* harmony export */   CostumeIconMorph: () => (/* binding */ CostumeIconMorph),
/* harmony export */   Crosshair: () => (/* binding */ Crosshair),
/* harmony export */   CursorMorph: () => (/* binding */ CursorMorph),
/* harmony export */   CustomBlockDefinition: () => (/* binding */ CustomBlockDefinition),
/* harmony export */   CustomCommandBlockMorph: () => (/* binding */ CustomCommandBlockMorph),
/* harmony export */   CustomReporterBlockMorph: () => (/* binding */ CustomReporterBlockMorph),
/* harmony export */   DialMorph: () => (/* binding */ DialMorph),
/* harmony export */   DialogBoxMorph: () => (/* binding */ DialogBoxMorph),
/* harmony export */   FrameMorph: () => (/* binding */ FrameMorph),
/* harmony export */   FunctionSlotMorph: () => (/* binding */ FunctionSlotMorph),
/* harmony export */   GrayPaletteMorph: () => (/* binding */ GrayPaletteMorph),
/* harmony export */   HandMorph: () => (/* binding */ HandMorph),
/* harmony export */   HandleMorph: () => (/* binding */ HandleMorph),
/* harmony export */   HatBlockMorph: () => (/* binding */ HatBlockMorph),
/* harmony export */   IDE_Morph: () => (/* binding */ IDE_Morph),
/* harmony export */   InputFieldMorph: () => (/* binding */ InputFieldMorph),
/* harmony export */   InputSlotDialogMorph: () => (/* binding */ InputSlotDialogMorph),
/* harmony export */   InputSlotMorph: () => (/* binding */ InputSlotMorph),
/* harmony export */   InputSlotStringMorph: () => (/* binding */ InputSlotStringMorph),
/* harmony export */   InputSlotTextMorph: () => (/* binding */ InputSlotTextMorph),
/* harmony export */   InspectorMorph: () => (/* binding */ InspectorMorph),
/* harmony export */   JSCompiler: () => (/* binding */ JSCompiler),
/* harmony export */   JaggedBlockMorph: () => (/* binding */ JaggedBlockMorph),
/* harmony export */   JukeboxMorph: () => (/* binding */ JukeboxMorph),
/* harmony export */   LibraryImportDialogMorph: () => (/* binding */ LibraryImportDialogMorph),
/* harmony export */   List: () => (/* binding */ List),
/* harmony export */   ListMorph: () => (/* binding */ ListMorph),
/* harmony export */   ListWatcherMorph: () => (/* binding */ ListWatcherMorph),
/* harmony export */   Localizer: () => (/* binding */ Localizer),
/* harmony export */   MenuItemMorph: () => (/* binding */ MenuItemMorph),
/* harmony export */   MenuMorph: () => (/* binding */ MenuMorph),
/* harmony export */   Microphone: () => (/* binding */ Microphone),
/* harmony export */   Morph: () => (/* binding */ Morph),
/* harmony export */   MouseSensorMorph: () => (/* binding */ MouseSensorMorph),
/* harmony export */   MultiArgMorph: () => (/* binding */ MultiArgMorph),
/* harmony export */   Node: () => (/* binding */ Node),
/* harmony export */   Note: () => (/* binding */ Note),
/* harmony export */   PaintCanvasMorph: () => (/* binding */ PaintCanvasMorph),
/* harmony export */   PaintColorPickerMorph: () => (/* binding */ PaintColorPickerMorph),
/* harmony export */   PaintEditorMorph: () => (/* binding */ PaintEditorMorph),
/* harmony export */   PaletteHandleMorph: () => (/* binding */ PaletteHandleMorph),
/* harmony export */   PenMorph: () => (/* binding */ PenMorph),
/* harmony export */   PianoKeyMorph: () => (/* binding */ PianoKeyMorph),
/* harmony export */   PianoMenuMorph: () => (/* binding */ PianoMenuMorph),
/* harmony export */   Point: () => (/* binding */ Point),
/* harmony export */   Process: () => (/* binding */ Process),
/* harmony export */   Project: () => (/* binding */ Project),
/* harmony export */   ProjectDialogMorph: () => (/* binding */ ProjectDialogMorph),
/* harmony export */   ProjectRecoveryDialogMorph: () => (/* binding */ ProjectRecoveryDialogMorph),
/* harmony export */   PrototypeHatBlockMorph: () => (/* binding */ PrototypeHatBlockMorph),
/* harmony export */   PushButtonMorph: () => (/* binding */ PushButtonMorph),
/* harmony export */   ReadStream: () => (/* binding */ ReadStream),
/* harmony export */   Rectangle: () => (/* binding */ Rectangle),
/* harmony export */   ReporterBlockMorph: () => (/* binding */ ReporterBlockMorph),
/* harmony export */   ReporterSlotMorph: () => (/* binding */ ReporterSlotMorph),
/* harmony export */   RingCommandSlotMorph: () => (/* binding */ RingCommandSlotMorph),
/* harmony export */   RingMorph: () => (/* binding */ RingMorph),
/* harmony export */   RingReporterSlotMorph: () => (/* binding */ RingReporterSlotMorph),
/* harmony export */   SVG_Costume: () => (/* binding */ SVG_Costume),
/* harmony export */   Scene: () => (/* binding */ Scene),
/* harmony export */   SceneAlbumMorph: () => (/* binding */ SceneAlbumMorph),
/* harmony export */   SceneIconMorph: () => (/* binding */ SceneIconMorph),
/* harmony export */   ScriptFocusMorph: () => (/* binding */ ScriptFocusMorph),
/* harmony export */   ScriptsMorph: () => (/* binding */ ScriptsMorph),
/* harmony export */   ScrollFrameMorph: () => (/* binding */ ScrollFrameMorph),
/* harmony export */   ShadowMorph: () => (/* binding */ ShadowMorph),
/* harmony export */   SliderButtonMorph: () => (/* binding */ SliderButtonMorph),
/* harmony export */   SliderMorph: () => (/* binding */ SliderMorph),
/* harmony export */   Snap: () => (/* binding */ Snap),
/* harmony export */   SnapEventManager: () => (/* binding */ SnapEventManager),
/* harmony export */   SnapSerializer: () => (/* binding */ SnapSerializer),
/* harmony export */   Sound: () => (/* binding */ Sound),
/* harmony export */   SoundIconMorph: () => (/* binding */ SoundIconMorph),
/* harmony export */   SoundRecorderDialogMorph: () => (/* binding */ SoundRecorderDialogMorph),
/* harmony export */   SpeechBubbleMorph: () => (/* binding */ SpeechBubbleMorph),
/* harmony export */   SpriteBubbleMorph: () => (/* binding */ SpriteBubbleMorph),
/* harmony export */   SpriteHighlightMorph: () => (/* binding */ SpriteHighlightMorph),
/* harmony export */   SpriteIconMorph: () => (/* binding */ SpriteIconMorph),
/* harmony export */   SpriteMorph: () => (/* binding */ SpriteMorph),
/* harmony export */   StageHandleMorph: () => (/* binding */ StageHandleMorph),
/* harmony export */   StageMorph: () => (/* binding */ StageMorph),
/* harmony export */   StagePickerItemMorph: () => (/* binding */ StagePickerItemMorph),
/* harmony export */   StagePickerMorph: () => (/* binding */ StagePickerMorph),
/* harmony export */   StagePrompterMorph: () => (/* binding */ StagePrompterMorph),
/* harmony export */   StringFieldMorph: () => (/* binding */ StringFieldMorph),
/* harmony export */   StringMorph: () => (/* binding */ StringMorph),
/* harmony export */   SymbolMorph: () => (/* binding */ SymbolMorph),
/* harmony export */   SyntaxElementMorph: () => (/* binding */ SyntaxElementMorph),
/* harmony export */   TabMorph: () => (/* binding */ TabMorph),
/* harmony export */   Table: () => (/* binding */ Table),
/* harmony export */   TableCellMorph: () => (/* binding */ TableCellMorph),
/* harmony export */   TableDialogMorph: () => (/* binding */ TableDialogMorph),
/* harmony export */   TableFrameMorph: () => (/* binding */ TableFrameMorph),
/* harmony export */   TableMorph: () => (/* binding */ TableMorph),
/* harmony export */   TemplateSlotMorph: () => (/* binding */ TemplateSlotMorph),
/* harmony export */   TextMorph: () => (/* binding */ TextMorph),
/* harmony export */   TextSlotMorph: () => (/* binding */ TextSlotMorph),
/* harmony export */   ThreadManager: () => (/* binding */ ThreadManager),
/* harmony export */   ToggleButtonMorph: () => (/* binding */ ToggleButtonMorph),
/* harmony export */   ToggleElementMorph: () => (/* binding */ ToggleElementMorph),
/* harmony export */   ToggleMorph: () => (/* binding */ ToggleMorph),
/* harmony export */   TriggerMorph: () => (/* binding */ TriggerMorph),
/* harmony export */   TurtleIconMorph: () => (/* binding */ TurtleIconMorph),
/* harmony export */   Variable: () => (/* binding */ Variable),
/* harmony export */   VariableDialogMorph: () => (/* binding */ VariableDialogMorph),
/* harmony export */   VariableFrame: () => (/* binding */ VariableFrame),
/* harmony export */   VectorEllipse: () => (/* binding */ VectorEllipse),
/* harmony export */   VectorLine: () => (/* binding */ VectorLine),
/* harmony export */   VectorPaintCanvasMorph: () => (/* binding */ VectorPaintCanvasMorph),
/* harmony export */   VectorPaintEditorMorph: () => (/* binding */ VectorPaintEditorMorph),
/* harmony export */   VectorPolygon: () => (/* binding */ VectorPolygon),
/* harmony export */   VectorRectangle: () => (/* binding */ VectorRectangle),
/* harmony export */   VectorSelection: () => (/* binding */ VectorSelection),
/* harmony export */   VectorShape: () => (/* binding */ VectorShape),
/* harmony export */   VideoMotion: () => (/* binding */ VideoMotion),
/* harmony export */   WardrobeMorph: () => (/* binding */ WardrobeMorph),
/* harmony export */   WatcherMorph: () => (/* binding */ WatcherMorph),
/* harmony export */   WorldMap: () => (/* binding */ WorldMap),
/* harmony export */   WorldMorph: () => (/* binding */ WorldMorph),
/* harmony export */   XML_Element: () => (/* binding */ XML_Element),
/* harmony export */   XML_Serializer: () => (/* binding */ XML_Serializer),
/* harmony export */   contains: () => (/* binding */ contains),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   copyCanvas: () => (/* binding */ copyCanvas),
/* harmony export */   degrees: () => (/* binding */ degrees),
/* harmony export */   detect: () => (/* binding */ detect),
/* harmony export */   disableRetinaSupport: () => (/* binding */ disableRetinaSupport),
/* harmony export */   embedMetadataPNG: () => (/* binding */ embedMetadataPNG),
/* harmony export */   enableRetinaSupport: () => (/* binding */ enableRetinaSupport),
/* harmony export */   fontHeight: () => (/* binding */ fontHeight),
/* harmony export */   getDocumentPositionOf: () => (/* binding */ getDocumentPositionOf),
/* harmony export */   getMinimumFontHeight: () => (/* binding */ getMinimumFontHeight),
/* harmony export */   getSEFConfig: () => (/* binding */ getSEFConfig),
/* harmony export */   hex_sha512: () => (/* binding */ hex_sha512),
/* harmony export */   invoke: () => (/* binding */ invoke),
/* harmony export */   isNil: () => (/* binding */ isNil),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   isRetinaEnabled: () => (/* binding */ isRetinaEnabled),
/* harmony export */   isRetinaSupported: () => (/* binding */ isRetinaSupported),
/* harmony export */   isSnapObject: () => (/* binding */ isSnapObject),
/* harmony export */   isString: () => (/* binding */ isString),
/* harmony export */   isURL: () => (/* binding */ isURL),
/* harmony export */   isURLChar: () => (/* binding */ isURLChar),
/* harmony export */   isWordChar: () => (/* binding */ isWordChar),
/* harmony export */   localize: () => (/* binding */ localize),
/* harmony export */   m: () => (/* binding */ m),
/* harmony export */   newCanvas: () => (/* binding */ newCanvas),
/* harmony export */   newGuid: () => (/* binding */ newGuid),
/* harmony export */   nop: () => (/* binding */ nop),
/* harmony export */   normalizeCanvas: () => (/* binding */ normalizeCanvas),
/* harmony export */   radians: () => (/* binding */ radians),
/* harmony export */   sizeOf: () => (/* binding */ sizeOf),
/* harmony export */   snapEquals: () => (/* binding */ snapEquals)
/* harmony export */ });
const contains = window['contains'];
const copy = window['copy'];
const copyCanvas = window['copyCanvas'];
const degrees = window['degrees'];
const detect = window['detect'];
const disableRetinaSupport = window['disableRetinaSupport'];
const embedMetadataPNG = window['embedMetadataPNG'];
const enableRetinaSupport = window['enableRetinaSupport'];
const fontHeight = window['fontHeight'];
const getDocumentPositionOf = window['getDocumentPositionOf'];
const getMinimumFontHeight = window['getMinimumFontHeight'];
const getSEFConfig = window['getSEFConfig'];
const hex_sha512 = window['hex_sha512'];
const invoke = window['invoke'];
const isNil = window['isNil'];
const isObject = window['isObject'];
const isRetinaEnabled = window['isRetinaEnabled'];
const isRetinaSupported = window['isRetinaSupported'];
const isSnapObject = window['isSnapObject'];
const isString = window['isString'];
const isURL = window['isURL'];
const isURLChar = window['isURLChar'];
const isWordChar = window['isWordChar'];
const localize = window['localize'];
const m = window['m'];
const newCanvas = window['newCanvas'];
const newGuid = window['newGuid'];
const nop = window['nop'];
const normalizeCanvas = window['normalizeCanvas'];
const radians = window['radians'];
const sizeOf = window['sizeOf'];
const Snap = window['Snap'];
const snapEquals = window['snapEquals'];
const AlignmentMorph = window['AlignmentMorph'];
const Animation = window['Animation'];
const ArgLabelMorph = window['ArgLabelMorph'];
const ArgMorph = window['ArgMorph'];
const ArrowMorph = window['ArrowMorph'];
const BlinkerMorph = window['BlinkerMorph'];
const BlockDialogMorph = window['BlockDialogMorph'];
const BlockEditorMorph = window['BlockEditorMorph'];
const BlockExportDialogMorph = window['BlockExportDialogMorph'];
const BlockHighlightMorph = window['BlockHighlightMorph'];
const BlockImportDialogMorph = window['BlockImportDialogMorph'];
const BlockInputFragmentMorph = window['BlockInputFragmentMorph'];
const BlockLabelFragment = window['BlockLabelFragment'];
const BlockLabelFragmentMorph = window['BlockLabelFragmentMorph'];
const BlockLabelMorph = window['BlockLabelMorph'];
const BlockLabelPlaceHolderMorph = window['BlockLabelPlaceHolderMorph'];
const BlockMorph = window['BlockMorph'];
const BlockRemovalDialogMorph = window['BlockRemovalDialogMorph'];
const BlockSymbolMorph = window['BlockSymbolMorph'];
const BlockVisibilityDialogMorph = window['BlockVisibilityDialogMorph'];
const BooleanSlotMorph = window['BooleanSlotMorph'];
const BouncerMorph = window['BouncerMorph'];
const BoxMorph = window['BoxMorph'];
const CamSnapshotDialogMorph = window['CamSnapshotDialogMorph'];
const CellMorph = window['CellMorph'];
const CircleBoxMorph = window['CircleBoxMorph'];
const Cloud = window['Cloud'];
const Color = window['Color'];
const ColorPaletteMorph = window['ColorPaletteMorph'];
const ColorPickerMorph = window['ColorPickerMorph'];
const ColorSlotMorph = window['ColorSlotMorph'];
const CommandBlockMorph = window['CommandBlockMorph'];
const CommandSlotMorph = window['CommandSlotMorph'];
const CommentMorph = window['CommentMorph'];
const Context = window['Context'];
const Costume = window['Costume'];
const CostumeEditorMorph = window['CostumeEditorMorph'];
const CostumeIconMorph = window['CostumeIconMorph'];
const Crosshair = window['Crosshair'];
const CSlotMorph = window['CSlotMorph'];
const CursorMorph = window['CursorMorph'];
const CustomBlockDefinition = window['CustomBlockDefinition'];
const CustomCommandBlockMorph = window['CustomCommandBlockMorph'];
const CustomReporterBlockMorph = window['CustomReporterBlockMorph'];
const DialMorph = window['DialMorph'];
const DialogBoxMorph = window['DialogBoxMorph'];
const FrameMorph = window['FrameMorph'];
const FunctionSlotMorph = window['FunctionSlotMorph'];
const GrayPaletteMorph = window['GrayPaletteMorph'];
const HandleMorph = window['HandleMorph'];
const HandMorph = window['HandMorph'];
const HatBlockMorph = window['HatBlockMorph'];
const IDE_Morph = window['IDE_Morph'];
const InputFieldMorph = window['InputFieldMorph'];
const InputSlotDialogMorph = window['InputSlotDialogMorph'];
const InputSlotMorph = window['InputSlotMorph'];
const InputSlotStringMorph = window['InputSlotStringMorph'];
const InputSlotTextMorph = window['InputSlotTextMorph'];
const InspectorMorph = window['InspectorMorph'];
const JaggedBlockMorph = window['JaggedBlockMorph'];
const JSCompiler = window['JSCompiler'];
const JukeboxMorph = window['JukeboxMorph'];
const LibraryImportDialogMorph = window['LibraryImportDialogMorph'];
const List = window['List'];
const ListMorph = window['ListMorph'];
const ListWatcherMorph = window['ListWatcherMorph'];
const Localizer = window['Localizer'];
const MenuItemMorph = window['MenuItemMorph'];
const MenuMorph = window['MenuMorph'];
const Microphone = window['Microphone'];
const Morph = window['Morph'];
const MouseSensorMorph = window['MouseSensorMorph'];
const MultiArgMorph = window['MultiArgMorph'];
const Node = window['Node'];
const Note = window['Note'];
const PaintCanvasMorph = window['PaintCanvasMorph'];
const PaintColorPickerMorph = window['PaintColorPickerMorph'];
const PaintEditorMorph = window['PaintEditorMorph'];
const PaletteHandleMorph = window['PaletteHandleMorph'];
const PenMorph = window['PenMorph'];
const PianoKeyMorph = window['PianoKeyMorph'];
const PianoMenuMorph = window['PianoMenuMorph'];
const Point = window['Point'];
const Process = window['Process'];
const Project = window['Project'];
const ProjectDialogMorph = window['ProjectDialogMorph'];
const ProjectRecoveryDialogMorph = window['ProjectRecoveryDialogMorph'];
const PrototypeHatBlockMorph = window['PrototypeHatBlockMorph'];
const PushButtonMorph = window['PushButtonMorph'];
const ReadStream = window['ReadStream'];
const Rectangle = window['Rectangle'];
const ReporterBlockMorph = window['ReporterBlockMorph'];
const ReporterSlotMorph = window['ReporterSlotMorph'];
const RingCommandSlotMorph = window['RingCommandSlotMorph'];
const RingMorph = window['RingMorph'];
const RingReporterSlotMorph = window['RingReporterSlotMorph'];
const Scene = window['Scene'];
const SceneAlbumMorph = window['SceneAlbumMorph'];
const SceneIconMorph = window['SceneIconMorph'];
const ScriptFocusMorph = window['ScriptFocusMorph'];
const ScriptsMorph = window['ScriptsMorph'];
const ScrollFrameMorph = window['ScrollFrameMorph'];
const ShadowMorph = window['ShadowMorph'];
const SliderButtonMorph = window['SliderButtonMorph'];
const SliderMorph = window['SliderMorph'];
const SnapEventManager = window['SnapEventManager'];
const SnapSerializer = window['SnapSerializer'];
const Sound = window['Sound'];
const SoundIconMorph = window['SoundIconMorph'];
const SoundRecorderDialogMorph = window['SoundRecorderDialogMorph'];
const SpeechBubbleMorph = window['SpeechBubbleMorph'];
const SpriteBubbleMorph = window['SpriteBubbleMorph'];
const SpriteHighlightMorph = window['SpriteHighlightMorph'];
const SpriteIconMorph = window['SpriteIconMorph'];
const SpriteMorph = window['SpriteMorph'];
const StageHandleMorph = window['StageHandleMorph'];
const StageMorph = window['StageMorph'];
const StagePickerItemMorph = window['StagePickerItemMorph'];
const StagePickerMorph = window['StagePickerMorph'];
const StagePrompterMorph = window['StagePrompterMorph'];
const StringFieldMorph = window['StringFieldMorph'];
const StringMorph = window['StringMorph'];
const SVG_Costume = window['SVG_Costume'];
const SymbolMorph = window['SymbolMorph'];
const SyntaxElementMorph = window['SyntaxElementMorph'];
const Table = window['Table'];
const TableCellMorph = window['TableCellMorph'];
const TableDialogMorph = window['TableDialogMorph'];
const TableFrameMorph = window['TableFrameMorph'];
const TableMorph = window['TableMorph'];
const TabMorph = window['TabMorph'];
const TemplateSlotMorph = window['TemplateSlotMorph'];
const TextMorph = window['TextMorph'];
const TextSlotMorph = window['TextSlotMorph'];
const ThreadManager = window['ThreadManager'];
const ToggleButtonMorph = window['ToggleButtonMorph'];
const ToggleElementMorph = window['ToggleElementMorph'];
const ToggleMorph = window['ToggleMorph'];
const TriggerMorph = window['TriggerMorph'];
const TurtleIconMorph = window['TurtleIconMorph'];
const Variable = window['Variable'];
const VariableDialogMorph = window['VariableDialogMorph'];
const VariableFrame = window['VariableFrame'];
const VectorEllipse = window['VectorEllipse'];
const VectorLine = window['VectorLine'];
const VectorPaintCanvasMorph = window['VectorPaintCanvasMorph'];
const VectorPaintEditorMorph = window['VectorPaintEditorMorph'];
const VectorPolygon = window['VectorPolygon'];
const VectorRectangle = window['VectorRectangle'];
const VectorSelection = window['VectorSelection'];
const VectorShape = window['VectorShape'];
const VideoMotion = window['VideoMotion'];
const WardrobeMorph = window['WardrobeMorph'];
const WatcherMorph = window['WatcherMorph'];
const WorldMap = window['WorldMap'];
const WorldMorph = window['WorldMorph'];
const XML_Element = window['XML_Element'];
const XML_Serializer = window['XML_Serializer'];

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
exports.Snap = exports.OverrideRegistry = exports.ExtensionManager = exports.Extension = exports.Events = exports.EventManager = exports.DefGenerator = exports.Cloud = exports.Blocks = void 0;
const BlockFactory_1 = __webpack_require__(/*! ./blocks/BlockFactory */ "./src/blocks/BlockFactory.ts");
Object.defineProperty(exports, "Blocks", ({ enumerable: true, get: function () { return BlockFactory_1.Blocks; } }));
const EventManager_1 = __webpack_require__(/*! ./events/EventManager */ "./src/events/EventManager.ts");
Object.defineProperty(exports, "EventManager", ({ enumerable: true, get: function () { return EventManager_1.EventManager; } }));
const Extension_1 = __webpack_require__(/*! ./extension/Extension */ "./src/extension/Extension.ts");
Object.defineProperty(exports, "Extension", ({ enumerable: true, get: function () { return Extension_1.Extension; } }));
const ExtensionManager_1 = __webpack_require__(/*! ./extension/ExtensionManager */ "./src/extension/ExtensionManager.ts");
Object.defineProperty(exports, "ExtensionManager", ({ enumerable: true, get: function () { return ExtensionManager_1.ExtensionManager; } }));
const DefGenerator_1 = __webpack_require__(/*! ./meta/DefGenerator */ "./src/meta/DefGenerator.ts");
Object.defineProperty(exports, "DefGenerator", ({ enumerable: true, get: function () { return DefGenerator_1.DefGenerator; } }));
const SnapUtils_1 = __webpack_require__(/*! ./snap/SnapUtils */ "./src/snap/SnapUtils.ts");
Object.defineProperty(exports, "Snap", ({ enumerable: true, get: function () { return SnapUtils_1.Snap; } }));
const SnapEvents_1 = __webpack_require__(/*! ./events/SnapEvents */ "./src/events/SnapEvents.ts");
Object.defineProperty(exports, "Events", ({ enumerable: true, get: function () { return SnapEvents_1.Events; } }));
const OverrideRegistry_1 = __webpack_require__(/*! ./extend/OverrideRegistry */ "./src/extend/OverrideRegistry.ts");
Object.defineProperty(exports, "OverrideRegistry", ({ enumerable: true, get: function () { return OverrideRegistry_1.OverrideRegistry; } }));
const CloudUtils_1 = __webpack_require__(/*! ./io/CloudUtils */ "./src/io/CloudUtils.ts");
Object.defineProperty(exports, "Cloud", ({ enumerable: true, get: function () { return CloudUtils_1.Cloud; } }));
window.addEventListener('load', () => {
    setTimeout(() => {
        // Snap is loaded after the window
        ExtensionManager_1.ExtensionManager.init();
    }, 0);
});
// For convenience, make snap global
window['Snap'] = SnapUtils_1.Snap;

})();

SEF = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzQ007QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O1VDOUxQO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ05BLHdHQUErQztBQXVCM0Msd0ZBdkJLLHFCQUFNLFFBdUJMO0FBdEJWLHdHQUFxRDtBQXlCakQsOEZBekJLLDJCQUFZLFFBeUJMO0FBeEJoQixxR0FBa0Q7QUEwQjlDLDJGQTFCSyxxQkFBUyxRQTBCTDtBQXpCYiwwSEFBZ0U7QUEwQjVELGtHQTFCSyxtQ0FBZ0IsUUEwQkw7QUF6QnBCLG9HQUFtRDtBQXFCL0MsOEZBckJLLDJCQUFZLFFBcUJMO0FBcEJoQiwyRkFBd0M7QUEwQnBDLHNGQTFCSyxnQkFBSSxRQTBCTDtBQXpCUixrR0FBNkM7QUFxQnpDLHdGQXJCSyxtQkFBTSxRQXFCTDtBQXBCVixvSEFBNkQ7QUF1QnpELGtHQXZCSyxtQ0FBZ0IsUUF1Qkw7QUF0QnBCLDBGQUF3QztBQWdCcEMsdUZBaEJLLGtCQUFLLFFBZ0JMO0FBZFQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDakMsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNaLGtDQUFrQztRQUNsQyxtQ0FBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM1QixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDVixDQUFDLENBQUM7QUFFRixvQ0FBb0M7QUFDcEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLGdCQUFJLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9TRUYvLi9zcmMvYmxvY2tzL0Jsb2NrRmFjdG9yeS50cyIsIndlYnBhY2s6Ly9TRUYvLi9zcmMvZGV2L0Rldk1vZGUudHMiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL2V2ZW50cy9FdmVudE1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL2V2ZW50cy9TbmFwRXZlbnRMaXN0ZW5lci50cyIsIndlYnBhY2s6Ly9TRUYvLi9zcmMvZXZlbnRzL1NuYXBFdmVudHMudHMiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL2V4dGVuZC9PdmVycmlkZVJlZ2lzdHJ5LnRzIiwid2VicGFjazovL1NFRi8uL3NyYy9leHRlbnNpb24vRXh0ZW5zaW9uLnRzIiwid2VicGFjazovL1NFRi8uL3NyYy9leHRlbnNpb24vRXh0ZW5zaW9uTWFuYWdlci50cyIsIndlYnBhY2s6Ly9TRUYvLi9zcmMvaW8vQ2xvdWRVdGlscy50cyIsIndlYnBhY2s6Ly9TRUYvLi9zcmMvbWV0YS9EZWZHZW5lcmF0b3IudHMiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL3NuYXAvU25hcFV0aWxzLnRzIiwid2VicGFjazovL1NFRi8uL3NyYy9zbmFwL1NuYXAuanMiLCJ3ZWJwYWNrOi8vU0VGL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1NFRi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vU0VGL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vU0VGL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE92ZXJyaWRlUmVnaXN0cnkgfSBmcm9tIFwiLi4vZXh0ZW5kL092ZXJyaWRlUmVnaXN0cnlcIjtcclxuaW1wb3J0IHsgU25hcCB9IGZyb20gXCIuLi9zbmFwL1NuYXBVdGlsc1wiO1xyXG5pbXBvcnQgeyBDb2xvciwgSURFX01vcnBoLCBsb2NhbGl6ZSwgU3ByaXRlTW9ycGgsIFN0YWdlTW9ycGgsIFN5bnRheEVsZW1lbnRNb3JwaCwgVG9nZ2xlTW9ycGggfSBmcm9tIFwiLi4vc25hcC9TbmFwXCI7XHJcblxyXG5leHBvcnQgbmFtZXNwYWNlIEJsb2NrcyB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEJsb2NrRmFjdG9yeSB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgYmxvY2tzOiBCbG9ja1tdO1xyXG4gICAgICAgIHByaXZhdGUgY2F0ZWdvcmllcyA9IFtdIGFzIHsgbmFtZTogc3RyaW5nLCBjb2xvcjogQ29sb3IgfVtdO1xyXG4gICAgICAgIHByaXZhdGUgbmVlZHNJbml0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLmJsb2NrcyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLm5lZWRzSW5pdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjb25zdCBteUJsb2NrcyA9IHRoaXMuYmxvY2tzO1xyXG4gICAgICAgICAgICBjb25zdCBteUNhdGVnb3JpZXMgPSB0aGlzLmNhdGVnb3JpZXM7XHJcbiAgICAgICAgICAgIGNvbnN0IG15c2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBvdmVycmlkZSA9IGZ1bmN0aW9uKGJhc2UsIGNhdGVnb3J5OiBzdHJpbmcsIGFsbDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrcyA9IGJhc2UuY2FsbCh0aGlzLCBjYXRlZ29yeSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hlY2tTcHJpdGUgPSB0aGlzIGluc3RhbmNlb2YgU3RhZ2VNb3JwaDtcclxuICAgICAgICAgICAgICAgIGxldCBhZGRlZCA9IDA7XHJcbiAgICAgICAgICAgICAgICBteUJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2suY2F0ZWdvcnkgPT09IGNhdGVnb3J5ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAhKGNoZWNrU3ByaXRlICYmIGJsb2NrLnNwcml0ZU9ubHkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChibG9jay50b3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5zcGxpY2UoYWRkZWQsIDAsIGJsb2NrLnRvQmxvY2tNb3JwaCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5zcGxpY2UoYWRkZWQsIDAsIGJsb2NrLnRvVG9nZ2xlKHRoaXMpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGVkKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja3MucHVzaChibG9jay50b1RvZ2dsZSh0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja3MucHVzaChibG9jay50b0Jsb2NrTW9ycGgoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBibG9ja3M7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBPdmVycmlkZVJlZ2lzdHJ5LmV4dGVuZChTcHJpdGVNb3JwaCwgJ2luaXRCbG9ja3MnLCBmdW5jdGlvbihiYXNlKSB7XHJcbiAgICAgICAgICAgICAgICBiYXNlLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBteUNhdGVnb3JpZXMuZm9yRWFjaChjID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBteXNlbGYuYWRkQ2F0ZWdvcnlUb1BhbGxldHRlKGMubmFtZSwgYy5jb2xvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIG15QmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmFkZFRvTWFwKFNwcml0ZU1vcnBoLnByb3RvdHlwZS5ibG9ja3MpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgT3ZlcnJpZGVSZWdpc3RyeS5leHRlbmQoU3ByaXRlTW9ycGgsICdibG9ja1RlbXBsYXRlcycsIG92ZXJyaWRlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIE92ZXJyaWRlUmVnaXN0cnkuZXh0ZW5kKFN0YWdlTW9ycGgsICdibG9ja1RlbXBsYXRlcycsIG92ZXJyaWRlLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICBPdmVycmlkZVJlZ2lzdHJ5LmJlZm9yZShJREVfTW9ycGgsICdjcmVhdGVDYXRlZ29yaWVzJywgZnVuY3Rpb24oYmFzZSkge1xyXG4gICAgICAgICAgICAgICAgbXlDYXRlZ29yaWVzLmZvckVhY2goYyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbXlzZWxmLmFkZENhdGVnb3J5VG9QYWxsZXR0ZShjLm5hbWUsIGMuY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHRoaXMucXVldWVSZWZyZXNoKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWdpc3RlckJsb2NrKGJsb2NrOiBCbG9jaykge1xyXG4gICAgICAgICAgICB0aGlzLmJsb2Nrcy5wdXNoKGJsb2NrKTtcclxuICAgICAgICAgICAgdGhpcy5xdWV1ZVJlZnJlc2goKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHF1ZXVlUmVmcmVzaCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubmVlZHNJbml0KSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMubmVlZHNJbml0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMubmVlZHNJbml0KSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgfSwgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWZyZXNoKCkge1xyXG4gICAgICAgICAgICBpZiAoIVNuYXAuSURFKSByZXR1cm47XHJcbiAgICAgICAgICAgIFNwcml0ZU1vcnBoLnByb3RvdHlwZS5pbml0QmxvY2tzKCk7XHJcbiAgICAgICAgICAgIFNuYXAuSURFLmZsdXNoQmxvY2tzQ2FjaGUoKTtcclxuICAgICAgICAgICAgU25hcC5JREUucmVmcmVzaFBhbGV0dGUoKTtcclxuICAgICAgICAgICAgU25hcC5JREUuY2F0ZWdvcmllcy5yZWZyZXNoRW1wdHkoKTtcclxuICAgICAgICAgICAgdGhpcy5uZWVkc0luaXQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgYWRkQ2F0ZWdvcnlUb1BhbGxldHRlKG5hbWU6IHN0cmluZywgY29sb3I6IENvbG9yKSB7XHJcbiAgICAgICAgICAgIC8vIFRPRE86IEZpeCB0aGlzIHNvIHRoYXQgdGhlIGxheW91dCB3b3Jrc1xyXG4gICAgICAgICAgICAvLyBTcHJpdGVNb3JwaC5wcm90b3R5cGUuY2F0ZWdvcmllcy5wdXNoKG5hbWUpO1xyXG4gICAgICAgICAgICAvLyBTcHJpdGVNb3JwaC5wcm90b3R5cGUuYmxvY2tDb2xvcltuYW1lXSA9IGNvbG9yO1xyXG4gICAgICAgICAgICBpZiAoIVNwcml0ZU1vcnBoLnByb3RvdHlwZS5jdXN0b21DYXRlZ29yaWVzLmhhcyhuYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgU25hcC5JREUuYWRkUGFsZXR0ZUNhdGVnb3J5KG5hbWUsIGNvbG9yKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFkZENhdGVnb3J5KG5hbWU6IHN0cmluZywgY29sb3I6IENvbG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2F0ZWdvcmllcy5wdXNoKHsgbmFtZSwgY29sb3IgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2F0ZWdvcnlUb1BhbGxldHRlKG5hbWUsIGNvbG9yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFkZExhYmVsZWRJbnB1dChuYW1lOiBzdHJpbmcsIG9wdGlvbnM6IHsgW2tleTogc3RyaW5nXTogYW55IH0sIC4uLnRhZ3M6IElucHV0VGFnW10pIHtcclxuICAgICAgICAgICAgaWYgKFN5bnRheEVsZW1lbnRNb3JwaC5wcm90b3R5cGUubGFiZWxQYXJ0c1tuYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnB1dCB0eXBlIHdpdGggbGFiZWwgJHtuYW1lfSBhbHJlYWR5IGV4aXN0cy5gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBFbnN1cmUgdGhhdCBhbGwgc3RyaW5nIHZhbHVlcyBhcmUgYXJyYXktZW5jbG9zZWRcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaChrID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Yob3B0aW9uc1trXSkgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1trXSA9IFtvcHRpb25zW2tdXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgU3ludGF4RWxlbWVudE1vcnBoLnByb3RvdHlwZS5sYWJlbFBhcnRzW25hbWVdID0ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2lucHV0JyxcclxuICAgICAgICAgICAgICAgIHRhZ3M6IHRhZ3Muam9pbignICcpLFxyXG4gICAgICAgICAgICAgICAgbWVudTogb3B0aW9ucyxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGVudW0gSW5wdXRUYWcge1xyXG4gICAgICAgIC8qKiBWYWx1ZXMgd2lsbCBiZSBpbnRlcnByZXRlZCBhcyBudW1lcmljLiAqL1xyXG4gICAgICAgIE51bWJlcmljID0gJ251bWVyaWMnLFxyXG4gICAgICAgIFJlYWRPbmx5ID0gJ3JlYWQtb25seScsXHJcbiAgICAgICAgVW5ldmFsdWF0ZWQgPSAndW5ldmFsdWF0ZWQnLFxyXG4gICAgICAgIC8qKiBUaGUgaW5wdXQgY2Fubm90IGJlIHJlcGxhY2VkIHdpdGggYSByZXBvcnRlci4gKi9cclxuICAgICAgICBTdGF0aWMgPSAnc3RhdGljJyxcclxuICAgICAgICBMYW5kc2NhcGUgPSAnbGFuZHNjYXBlJyxcclxuICAgICAgICAvKiogTW9ub3NwYWNlIGZvbnQuICovXHJcbiAgICAgICAgTW9ub3NwYWNlID0gJ21vbm9zcGFjZScsXHJcbiAgICAgICAgRmFkaW5nID0gJ2ZhZGluZycsXHJcbiAgICAgICAgUHJvdGVjdGVkID0gJ3Byb3RlY3RlZCcsXHJcbiAgICAgICAgTG9vcCA9ICdsb29wJyxcclxuICAgICAgICAvKiogVGhlIGlucHV0IGlzIGEgbGFtYmRhIGV4cHJlc3Npb24uICovXHJcbiAgICAgICAgTGFtYmRhID0gJ2xhbWJkYScsXHJcbiAgICAgICAgLyoqIFRoZSBpbnB1dCBpcyBlZGl0ZWQgdXNpbmcgYSBjdXN0b20gd2lkZ2V0LiAqL1xyXG4gICAgICAgIFdpZGdldCA9ICd3aWRnZXQnXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGVudW0gQmxvY2tUeXBlIHtcclxuICAgICAgICBDb21tYW5kID0gJ2NvbW1hbmQnLFxyXG4gICAgICAgIFJlcG9ydGVyID0gJ3JlcG9ydGVyJyxcclxuICAgICAgICBQcmVkaWNhdGUgPSAncHJlZGljYXRlJyxcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQmxvY2sge1xyXG5cclxuICAgICAgICBzZWxlY3Rvcjogc3RyaW5nO1xyXG4gICAgICAgIHNwZWM6IHN0cmluZztcclxuICAgICAgICBkZWZhdWx0czogYW55W107XHJcbiAgICAgICAgdHlwZTogQmxvY2tUeXBlO1xyXG4gICAgICAgIGNhdGVnb3J5OiBzdHJpbmc7XHJcbiAgICAgICAgc3ByaXRlT25seTogYm9vbGVhbjtcclxuICAgICAgICB0b3A6IGJvb2xlYW47XHJcbiAgICAgICAgdG9nZ2xhYmxlOiBib29sZWFuO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgc2VsZWN0b3I6IHN0cmluZywgc3BlYzogc3RyaW5nLCBkZWZhdWx0czogYW55W10sIHR5cGU6IEJsb2NrVHlwZSxcclxuICAgICAgICAgICAgY2F0ZWdvcnk6IHN0cmluZywgc3ByaXRlT25seSA9IGZhbHNlLCB0b3AgPSBmYWxzZSwgdG9nZ2xhYmxlID0gZmFsc2UsXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0b3IgPSBzZWxlY3RvcjtcclxuICAgICAgICAgICAgdGhpcy5zcGVjID0gc3BlYztcclxuICAgICAgICAgICAgdGhpcy5kZWZhdWx0cyA9IGRlZmF1bHRzO1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgICAgICB0aGlzLmNhdGVnb3J5ID0gY2F0ZWdvcnk7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlT25seSA9IHNwcml0ZU9ubHk7XHJcbiAgICAgICAgICAgIHRoaXMudG9wID0gdG9wO1xyXG4gICAgICAgICAgICB0aGlzLnRvZ2dsYWJsZSA9IHRvZ2dsYWJsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFkZFRvTWFwKG1hcCkge1xyXG4gICAgICAgICAgICBtYXBbdGhpcy5zZWxlY3Rvcl0gPSB7XHJcbiAgICAgICAgICAgICAgICBvbmx5OiB0aGlzLnNwcml0ZU9ubHkgPyBTcHJpdGVNb3JwaCA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZSxcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5OiB0aGlzLmNhdGVnb3J5LFxyXG4gICAgICAgICAgICAgICAgc3BlYzogbG9jYWxpemUodGhpcy5zcGVjKSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHRzOiB0aGlzLmRlZmF1bHRzLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdG9CbG9ja01vcnBoKCkge1xyXG4gICAgICAgICAgICBpZiAoU3RhZ2VNb3JwaC5wcm90b3R5cGUuaGlkZGVuUHJpbWl0aXZlc1t0aGlzLnNlbGVjdG9yXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIG5ld0Jsb2NrID1cclxuICAgICAgICAgICAgICAgIFNwcml0ZU1vcnBoLnByb3RvdHlwZS5ibG9ja0ZvclNlbGVjdG9yKHRoaXMuc2VsZWN0b3IsIHRydWUpO1xyXG4gICAgICAgICAgICBpZiAoIW5ld0Jsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0Nhbm5vdCBpbml0aWFsaXplIGJsb2NrJywgdGhpcy5zZWxlY3Rvcik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZXdCbG9jay5pc1RlbXBsYXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld0Jsb2NrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdG9Ub2dnbGUoc3ByaXRlIDogU3ByaXRlTW9ycGgpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnRvZ2dsYWJsZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RvciA9IHRoaXMuc2VsZWN0b3I7XHJcbiAgICAgICAgICAgIGlmIChTdGFnZU1vcnBoLnByb3RvdHlwZS5oaWRkZW5QcmltaXRpdmVzW3NlbGVjdG9yXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGluZm8gPSBTcHJpdGVNb3JwaC5wcm90b3R5cGUuYmxvY2tzW3NlbGVjdG9yXTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBUb2dnbGVNb3JwaChcclxuICAgICAgICAgICAgICAgICdjaGVja2JveCcsXHJcbiAgICAgICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNwcml0ZS50b2dnbGVXYXRjaGVyKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxpemUoaW5mby5zcGVjKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3ByaXRlLmJsb2NrQ29sb3JbaW5mby5jYXRlZ29yeV1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNwcml0ZS5zaG93aW5nV2F0Y2hlcihzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbnVsbFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYWRkU3ByaXRlQWN0aW9uKGFjdGlvbjogKC4uLmFyZ3MgOiBhbnkpID0+IGFueSkgOiBCbG9jayB7XHJcbiAgICAgICAgICAgIFNwcml0ZU1vcnBoLnByb3RvdHlwZVt0aGlzLnNlbGVjdG9yXSA9XHJcbiAgICAgICAgICAgICAgICBTdGFnZU1vcnBoLnByb3RvdHlwZVt0aGlzLnNlbGVjdG9yXSA9IGFjdGlvbjtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IEV4dGVuc2lvbk1hbmFnZXIgfSBmcm9tIFwiLi4vZXh0ZW5zaW9uL0V4dGVuc2lvbk1hbmFnZXJcIjtcclxuaW1wb3J0IHsgU25hcCB9IGZyb20gXCIuLi9zbmFwL1NuYXBVdGlsc1wiO1xyXG5cclxuY29uc3QgREVWX01PREVfVVJMUyA9IFtcclxuICAgIFwibG9jYWxob3N0XCIsXHJcbiAgICBcIjEyNy4wLjAuMVwiLFxyXG5dO1xyXG5cclxuY29uc3QgREVWX01PREVfVVJMX1BBUkFNID0gXCJkZXZNb2RlXCI7XHJcblxyXG5jb25zdCBMQVNUX1BST0pFQ1RfS0VZID0gXCJsYXN0UHJvamVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERldk1vZGUge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgdHJ1ZSwgdGhpcyBtZWFucyB0aGUgdXNlciBpcyBydW5uaW5nIHRoZSBlZGl0b3IgbG9jYWxseSBvciBoYXNcclxuICAgICAqIHNldCB0aGUgZGV2TW9kZSBVUkwgcGFyYW1ldGVyIHRvIHRydWUuIFdoZW4gZGV2TW9kZSBpcyBlbmFibGVkLFxyXG4gICAgICogdGhlIGVkaXRvciB3aWxsIGF1dG9tYXRpY2FsbHkgc2F2ZSB0aGUgcHJvamVjdCB0byBsb2NhbCBzdG9yYWdlXHJcbiAgICAgKiBhZnRlciBldmVyeSBjaGFuZ2UgYW5kIHJlbG9hZCBpdCBvbiBwYWdlIGxvYWQuXHJcbiAgICAgKi9cclxuICAgIHJlYWRvbmx5IGlzRGV2TW9kZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBsYXN0UHJvamVjdFhNTDogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaXNEZXZNb2RlID0gREVWX01PREVfVVJMUy5zb21lKHVybCA9PiB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcyh1cmwpKTtcclxuICAgICAgICBsZXQgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcclxuICAgICAgICBpZiAocGFyYW1zLmhhcyhERVZfTU9ERV9VUkxfUEFSQU0pKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNEZXZNb2RlID0gcGFyYW1zLmdldChERVZfTU9ERV9VUkxfUEFSQU0pID09IFwidHJ1ZVwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc0Rldk1vZGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGxhc3RQcm9qZWN0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oTEFTVF9QUk9KRUNUX0tFWSk7XHJcbiAgICAgICAgaWYgKGxhc3RQcm9qZWN0ICYmIGxhc3RQcm9qZWN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgLy8gVE9ETzogUmlnaHQgbm93IHdlIHNldCB0byAxMG1zIHRvIHdhaXQgdW50aWwgYWZ0ZXIgYmxvY2tzIGFyZVxyXG4gICAgICAgICAgICAvLyBsb2FkZWQgLSBzaG91bGQgYmUgYSBjYWxsYmFjayB3YXkgdG8gZG8gaXRcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBTbmFwLklERS5sb2FkUHJvamVjdFhNTChsYXN0UHJvamVjdCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkxvYWRpbmcgbGFzdCBwcm9qZWN0XCIsIFNuYXAuSURFLmdldFByb2plY3ROYW1lKCkpO1xyXG4gICAgICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd2luZG93Lm9uYmVmb3JldW5sb2FkID0gKCkgPT4ge307XHJcbiAgICAgICAgRXh0ZW5zaW9uTWFuYWdlci5ldmVudHMuVHJhY2UuYWRkR2xvYmFsTGlzdGVuZXIoKG1lc3NhZ2UpID0+IHtcclxuICAgICAgICAgICAgLy8gV2FpdCBmb3IgbmV4dCBmcmFtZSwgc2luY2Ugc29tZSBlZGl0cyBvY2N1ciBhZnRlciB0aGUgbG9nXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHhtbCA9IFNuYXAuSURFLmdldFByb2plY3RYTUwoKTtcclxuICAgICAgICAgICAgICAgIGlmICh4bWwgIT0gdGhpcy5sYXN0UHJvamVjdFhNTCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFByb2plY3RYTUwgPSB4bWw7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oTEFTVF9QUk9KRUNUX0tFWSwgeG1sKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNhdmVkIHByb2plY3QgYWZ0ZXI6IFwiICsgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi9TbmFwRXZlbnRzXCI7XHJcbmltcG9ydCB7IFNuYXBFdmVudExpc3RlbmVyIH0gZnJvbSBcIi4vU25hcEV2ZW50TGlzdGVuZXJcIjtcclxuaW1wb3J0IHsgU25hcEV2ZW50TWFuYWdlciB9IGZyb20gXCIuLi9zbmFwL1NuYXBcIjtcclxuaW1wb3J0IHsgU25hcCB9IGZyb20gXCIuLi9zbmFwL1NuYXBVdGlsc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEV2ZW50TWFuYWdlciB7XHJcblxyXG4gICAgVHJhY2U6IFNuYXBFdmVudE1hbmFnZXI7XHJcbiAgICBsaXN0ZW5lcnM6IE1hcDxzdHJpbmcsIFNuYXBFdmVudExpc3RlbmVyW10+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuVHJhY2UgPSB3aW5kb3dbJ1RyYWNlJ107XHJcbiAgICAgICAgaWYgKCF0aGlzLlRyYWNlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBFdmVudCBNYW5hZ2VyIC0gVHJhY2UgZG9lcyBub3QgZXhpc3QhJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIHRoaXMuVHJhY2UuYWRkR2xvYmFsTGlzdGVuZXIoKG1lc3NhZ2U6IHN0cmluZywgZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRXZlbnQobWVzc2FnZSwgZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIobmV3IEV2ZW50cy5CbG9jay5DbGlja1J1bkxpc3RlbmVyKChpZCkgPT4ge1xyXG4gICAgICAgICAgICBTbmFwLmxhc3RSdW5CbG9jayA9IFNuYXAuZ2V0QmxvY2soaWQpO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhhbmRsZUV2ZW50KG1lc3NhZ2U6IHN0cmluZywgZGF0YTogYW55KSB7XHJcbiAgICAgICAgbGV0IGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzLmdldChtZXNzYWdlKTtcclxuICAgICAgICBpZiAoIWxpc3RlbmVycykgcmV0dXJuO1xyXG4gICAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGwgPT4ge1xyXG4gICAgICAgICAgICBsZXQgYXJncyA9IGwuY29udmVydEFyZ3MoZGF0YSk7XHJcbiAgICAgICAgICAgIGwuY2FsbGJhY2soYXJncyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTGlzdGVuZXIobGlzdGVuZXI6IFNuYXBFdmVudExpc3RlbmVyKSB7XHJcbiAgICAgICAgaWYgKCFsaXN0ZW5lcikgcmV0dXJuO1xyXG4gICAgICAgIGxldCB0eXBlID0gbGlzdGVuZXIudHlwZTtcclxuICAgICAgICBpZiAoIXRoaXMubGlzdGVuZXJzLmhhcyh0eXBlKSkgdGhpcy5saXN0ZW5lcnMuc2V0KHR5cGUsIFtdKTtcclxuICAgICAgICBsZXQgbGlzdCA9IHRoaXMubGlzdGVuZXJzLmdldChsaXN0ZW5lci50eXBlKTtcclxuICAgICAgICBsaXN0LnB1c2gobGlzdGVuZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRlc3QoKSB7XHJcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcihuZXcgRXZlbnRzLkJsb2NrLlJlbmFtZUxpc3RlbmVyKGFyZ3MgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhcmdzLmlkLnNlbGVjdG9yKTtcclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcihuZXcgRXZlbnRzLklucHV0U2xvdC5NZW51SXRlbVNlbGVjdGVkTGlzdGVuZXIoYXJncyA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFyZ3MuaXRlbSk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIobmV3IEV2ZW50cy5CbG9jay5DcmVhdGVkTGlzdGVuZXIoYXJncyA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFyZ3MuaWQpO1xyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKG5ldyBFdmVudHMuSURFLkFkZFNwcml0ZUxpc3RlbmVyKGFyZ3MgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhcmdzLm5hbWUpO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICByZWFkb25seSB0eXBlOiBzdHJpbmc7XHJcbiAgICByZWFkb25seSBjYWxsYmFjazogRnVuY3Rpb247XHJcblxyXG4gICAgY29uc3RydWN0b3IodHlwZTogc3RyaW5nLCBjYWxsYmFjazogKGFyZ3M6IFNuYXBFdmVudEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgIH1cclxuXHJcbiAgICBjb252ZXJ0QXJncyhkYXRhOiBhbnkpIHtcclxuICAgICAgICBpZiAoZGF0YSA9PSBudWxsKSByZXR1cm4ge307XHJcbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JykgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgbGV0IG9iaiA9IHt9O1xyXG4gICAgICAgIG9ialt0aGlzLmdldFZhbHVlS2V5KCldID0gZGF0YTtcclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ3ZhbHVlJzsgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNuYXBFdmVudEFyZ3Mge1xyXG5cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFbXB0eUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmFsdWVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICB2YWx1ZTogYW55O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrSURBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICBpZDogbnVtYmVyO1xyXG4gICAgc2VsZWN0b3I6IHN0cmluZztcclxuICAgIHRlbXBsYXRlOiBib29sZWFuO1xyXG4gICAgc3BlYzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElucHV0SURBcmdzIGV4dGVuZHMgQmxvY2tJREFyZ3Mge1xyXG4gICAgYXJnSW5kZXg6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDdXN0b21CbG9ja0RlZkFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgIHNwZWM6IHN0cmluZztcclxuICAgIGNhdGVnb3J5OiBzdHJpbmc7XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICBndWlkOiBzdHJpbmc7XHJcbiAgICBpc0dsb2JhbDogYm9vbGVhbjtcclxufSIsImltcG9ydCB7IEJsb2NrSURBcmdzLCBFbXB0eUFyZ3MsIElucHV0SURBcmdzLCBDdXN0b21CbG9ja0RlZkFyZ3MsIFNuYXBFdmVudEFyZ3MsIFNuYXBFdmVudExpc3RlbmVyLCBWYWx1ZUFyZ3MgfSBmcm9tIFwiLi9TbmFwRXZlbnRMaXN0ZW5lclwiO1xyXG5leHBvcnQgbmFtZXNwYWNlIEV2ZW50cyB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIEJsb2NrIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIENsaWNrUnVuTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLmNsaWNrUnVuJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEJsb2NrSURBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihDbGlja1J1bkxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQ2xpY2tTdG9wUnVuTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLmNsaWNrU3RvcFJ1bic7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBCbG9ja0lEQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ2xpY2tTdG9wUnVuTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBDcmVhdGVkTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLmNyZWF0ZWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKENyZWF0ZWRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIERyYWdEZXN0cm95TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLmRyYWdEZXN0cm95JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEJsb2NrSURBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihEcmFnRGVzdHJveUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdyYWJiZWRBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlkOiBCbG9ja0lEQXJncztcclxuICAgICAgICAgICAgb3JpZ2luOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgR3JhYmJlZExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay5ncmFiYmVkJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEdyYWJiZWRBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihHcmFiYmVkTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVmYWN0b3JWYXJBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlkOiBCbG9ja0lEQXJncztcclxuICAgICAgICAgICAgb2xkTmFtZTogYW55O1xyXG4gICAgICAgICAgICBuZXdOYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgUmVmYWN0b3JWYXJMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2sucmVmYWN0b3JWYXInO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUmVmYWN0b3JWYXJBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihSZWZhY3RvclZhckxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlZmFjdG9yVmFyRXJyb3JBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlkOiBCbG9ja0lEQXJncztcclxuICAgICAgICAgICAgd2hlcmU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBSZWZhY3RvclZhckVycm9yTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLnJlZmFjdG9yVmFyRXJyb3InO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUmVmYWN0b3JWYXJFcnJvckFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFJlZmFjdG9yVmFyRXJyb3JMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZWxhYmVsQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpZDogQmxvY2tJREFyZ3M7XHJcbiAgICAgICAgICAgIHNlbGVjdG9yOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgUmVsYWJlbExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay5yZWxhYmVsJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFJlbGFiZWxBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihSZWxhYmVsTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuYW1lQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpZDogQmxvY2tJREFyZ3M7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBSZW5hbWVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2sucmVuYW1lJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFJlbmFtZUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFJlbmFtZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgUmluZ2lmeUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay5yaW5naWZ5JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEJsb2NrSURBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihSaW5naWZ5TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTY3JpcHRQaWNMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2suc2NyaXB0UGljJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEJsb2NrSURBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTY3JpcHRQaWNMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNob3dIZWxwTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLnNob3dIZWxwJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEJsb2NrSURBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTaG93SGVscExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNuYXBwZWRBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlkOiBCbG9ja0lEQXJncztcclxuICAgICAgICAgICAgb3JpZ2luOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU25hcHBlZExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay5zbmFwcGVkJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFNuYXBwZWRBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTbmFwcGVkTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBUb2dnbGVUcmFuc2llbnRWYXJpYWJsZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay50b2dnbGVUcmFuc2llbnRWYXJpYWJsZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBWYWx1ZUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFRvZ2dsZVRyYW5zaWVudFZhcmlhYmxlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBVbnJpbmdpZnlMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2sudW5yaW5naWZ5JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEJsb2NrSURBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihVbnJpbmdpZnlMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFVzZXJEZXN0cm95TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLnVzZXJEZXN0cm95JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEJsb2NrSURBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihVc2VyRGVzdHJveUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgQmxvY2tFZGl0b3Ige1xyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQ2FuY2VsTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrRWRpdG9yLmNhbmNlbCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBDdXN0b21CbG9ja0RlZkFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKENhbmNlbExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQ2hhbmdlVHlwZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9ja0VkaXRvci5jaGFuZ2VUeXBlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEN1c3RvbUJsb2NrRGVmQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ2hhbmdlVHlwZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgT2tMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2tFZGl0b3Iub2snO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQ3VzdG9tQmxvY2tEZWZBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihPa0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU3RhcnRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2tFZGl0b3Iuc3RhcnQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQ3VzdG9tQmxvY2tEZWZBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTdGFydExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFVwZGF0ZUJsb2NrTGFiZWxBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5ld0ZyYWdtZW50OiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgVXBkYXRlQmxvY2tMYWJlbExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9ja0VkaXRvci51cGRhdGVCbG9ja0xhYmVsJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFVwZGF0ZUJsb2NrTGFiZWxBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihVcGRhdGVCbG9ja0xhYmVsTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnbmV3RnJhZ21lbnQnOyB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIEJsb2NrVHlwZURpYWxvZyB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBDYW5jZWxMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2tUeXBlRGlhbG9nLmNhbmNlbCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKENhbmNlbExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQ2hhbmdlQmxvY2tUeXBlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrVHlwZURpYWxvZy5jaGFuZ2VCbG9ja1R5cGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihDaGFuZ2VCbG9ja1R5cGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE5ld0Jsb2NrTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrVHlwZURpYWxvZy5uZXdCbG9jayc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE5ld0Jsb2NrTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBPa0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9ja1R5cGVEaWFsb2cub2snO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihPa0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgQm9vbGVhblNsb3RNb3JwaCB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgVG9nZ2xlVmFsdWVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlkOiBJbnB1dElEQXJncztcclxuICAgICAgICAgICAgdmFsdWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBUb2dnbGVWYWx1ZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCb29sZWFuU2xvdE1vcnBoLnRvZ2dsZVZhbHVlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFRvZ2dsZVZhbHVlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVG9nZ2xlVmFsdWVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIENvbG9yQXJnIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VDb2xvckFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IElucHV0SURBcmdzO1xyXG4gICAgICAgICAgICBjb2xvcjogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIENoYW5nZUNvbG9yTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0NvbG9yQXJnLmNoYW5nZUNvbG9yJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IENoYW5nZUNvbG9yQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ2hhbmdlQ29sb3JMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIENvbW1hbmRCbG9jayB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgV3JhcEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IEJsb2NrSURBcmdzO1xyXG4gICAgICAgICAgICB0YXJnZXQ6IEJsb2NrSURBcmdzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFdyYXBMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQ29tbWFuZEJsb2NrLndyYXAnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogV3JhcEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFdyYXBMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIElERSB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQWRkU3ByaXRlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQWRkU3ByaXRlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5hZGRTcHJpdGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQWRkU3ByaXRlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQWRkU3ByaXRlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnbmFtZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIENoYW5nZUNhdGVnb3J5QXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBjYXRlZ29yeTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIENoYW5nZUNhdGVnb3J5TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5jaGFuZ2VDYXRlZ29yeSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBDaGFuZ2VDYXRlZ29yeUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKENoYW5nZUNhdGVnb3J5TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnY2F0ZWdvcnknOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIERlbGV0ZUN1c3RvbUJsb2NrTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5kZWxldGVDdXN0b21CbG9jayc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBDdXN0b21CbG9ja0RlZkFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKERlbGV0ZUN1c3RvbUJsb2NrTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRHVwbGljYXRlU3ByaXRlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRHVwbGljYXRlU3ByaXRlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5kdXBsaWNhdGVTcHJpdGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRHVwbGljYXRlU3ByaXRlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoRHVwbGljYXRlU3ByaXRlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnbmFtZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRXhwb3J0R2xvYmFsQmxvY2tzTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5leHBvcnRHbG9iYWxCbG9ja3MnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihFeHBvcnRHbG9iYWxCbG9ja3NMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBvcnRQcm9lamN0QXNDbG91ZERhdGFBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBFeHBvcnRQcm9lamN0QXNDbG91ZERhdGFMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmV4cG9ydFByb2VqY3RBc0Nsb3VkRGF0YSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFeHBvcnRQcm9lamN0QXNDbG91ZERhdGFBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihFeHBvcnRQcm9lamN0QXNDbG91ZERhdGFMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0UHJvamVjdEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgbmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEV4cG9ydFByb2plY3RMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmV4cG9ydFByb2plY3QnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRXhwb3J0UHJvamVjdEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEV4cG9ydFByb2plY3RMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0UHJvamVjdE1lZGlhQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRXhwb3J0UHJvamVjdE1lZGlhTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5leHBvcnRQcm9qZWN0TWVkaWEnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRXhwb3J0UHJvamVjdE1lZGlhQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoRXhwb3J0UHJvamVjdE1lZGlhTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnbmFtZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEV4cG9ydFByb2plY3ROb01lZGlhQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRXhwb3J0UHJvamVjdE5vTWVkaWFMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmV4cG9ydFByb2plY3ROb01lZGlhJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEV4cG9ydFByb2plY3ROb01lZGlhQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoRXhwb3J0UHJvamVjdE5vTWVkaWFMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBFeHBvcnRTY3JpcHRzUGljdHVyZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuZXhwb3J0U2NyaXB0c1BpY3R1cmUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihFeHBvcnRTY3JpcHRzUGljdHVyZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEV4cG9ydFNwcml0ZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgbmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEV4cG9ydFNwcml0ZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuZXhwb3J0U3ByaXRlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEV4cG9ydFNwcml0ZUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEV4cG9ydFNwcml0ZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEdyZWVuRmxhZ0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuZ3JlZW5GbGFnJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoR3JlZW5GbGFnTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTG9hZEZhaWxlZEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgZXJyOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgTG9hZEZhaWxlZExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUubG9hZEZhaWxlZCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBMb2FkRmFpbGVkQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoTG9hZEZhaWxlZExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ2Vycic7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgTmV3UHJvamVjdExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUubmV3UHJvamVjdCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE5ld1Byb2plY3RMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE9wZW5CbG9ja3NTdHJpbmdMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLm9wZW5CbG9ja3NTdHJpbmcnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihPcGVuQmxvY2tzU3RyaW5nTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBPcGVuQ2xvdWREYXRhU3RyaW5nTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5vcGVuQ2xvdWREYXRhU3RyaW5nJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoT3BlbkNsb3VkRGF0YVN0cmluZ0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgT3Blbk1lZGlhU3RyaW5nTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5vcGVuTWVkaWFTdHJpbmcnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihPcGVuTWVkaWFTdHJpbmdMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBPcGVuUHJvamVjdEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgbmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE9wZW5Qcm9qZWN0TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5vcGVuUHJvamVjdCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBPcGVuUHJvamVjdEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE9wZW5Qcm9qZWN0TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnbmFtZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgT3BlblByb2plY3RTdHJpbmdMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLm9wZW5Qcm9qZWN0U3RyaW5nJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoT3BlblByb2plY3RTdHJpbmdMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE9wZW5TcHJpdGVzU3RyaW5nTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5vcGVuU3ByaXRlc1N0cmluZyc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE9wZW5TcHJpdGVzU3RyaW5nTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBPcGVuZWRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLm9wZW5lZCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE9wZW5lZExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFBhaW50TmV3U3ByaXRlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgUGFpbnROZXdTcHJpdGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnBhaW50TmV3U3ByaXRlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFBhaW50TmV3U3ByaXRlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoUGFpbnROZXdTcHJpdGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBQYXVzZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUucGF1c2UnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihQYXVzZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJvdGF0aW9uU3R5bGVDaGFuZ2VkQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICByb3RhdGlvblN0eWxlOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgUm90YXRpb25TdHlsZUNoYW5nZWRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnJvdGF0aW9uU3R5bGVDaGFuZ2VkJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFJvdGF0aW9uU3R5bGVDaGFuZ2VkQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoUm90YXRpb25TdHlsZUNoYW5nZWRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICdyb3RhdGlvblN0eWxlJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2F2ZVByb2plY3RUb0Nsb3VkQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU2F2ZVByb2plY3RUb0Nsb3VkTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5zYXZlUHJvamVjdFRvQ2xvdWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogU2F2ZVByb2plY3RUb0Nsb3VkQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoU2F2ZVByb2plY3RUb0Nsb3VkTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnbmFtZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNlbGVjdFNwcml0ZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgbmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNlbGVjdFNwcml0ZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuc2VsZWN0U3ByaXRlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFNlbGVjdFNwcml0ZUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNlbGVjdFNwcml0ZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXRMYW5ndWFnZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgbGFuZzogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNldExhbmd1YWdlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5zZXRMYW5ndWFnZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBTZXRMYW5ndWFnZUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNldExhbmd1YWdlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnbGFuZyc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNldFNwcml0ZURyYWdnYWJsZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaXNEcmFnZ2FibGU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTZXRTcHJpdGVEcmFnZ2FibGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnNldFNwcml0ZURyYWdnYWJsZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBTZXRTcHJpdGVEcmFnZ2FibGVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTZXRTcHJpdGVEcmFnZ2FibGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICdpc0RyYWdnYWJsZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNldFNwcml0ZVRhYkFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgdGFiU3RyaW5nOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU2V0U3ByaXRlVGFiTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5zZXRTcHJpdGVUYWInO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogU2V0U3ByaXRlVGFiQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoU2V0U3ByaXRlVGFiTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAndGFiU3RyaW5nJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTdG9wTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5zdG9wJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoU3RvcExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFRvZ2dsZUFwcE1vZGVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlzQXBwTW9kZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFRvZ2dsZUFwcE1vZGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnRvZ2dsZUFwcE1vZGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogVG9nZ2xlQXBwTW9kZUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFRvZ2dsZUFwcE1vZGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICdpc0FwcE1vZGUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBUb2dnbGVTdGFnZVNpemVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlzU21hbGxTdGFnZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFRvZ2dsZVN0YWdlU2l6ZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUudG9nZ2xlU3RhZ2VTaXplJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFRvZ2dsZVN0YWdlU2l6ZUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFRvZ2dsZVN0YWdlU2l6ZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ2lzU21hbGxTdGFnZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgVW5wYXVzZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUudW5wYXVzZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFVucGF1c2VMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIElucHV0U2xvdCB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRWRpdGVkQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpZDogSW5wdXRJREFyZ3M7XHJcbiAgICAgICAgICAgIHRleHQ6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBFZGl0ZWRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSW5wdXRTbG90LmVkaXRlZCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFZGl0ZWRBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihFZGl0ZWRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBNZW51SXRlbVNlbGVjdGVkQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpZDogSW5wdXRJREFyZ3M7XHJcbiAgICAgICAgICAgIGl0ZW06IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBNZW51SXRlbVNlbGVjdGVkTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lucHV0U2xvdC5tZW51SXRlbVNlbGVjdGVkJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IE1lbnVJdGVtU2VsZWN0ZWRBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihNZW51SXRlbVNlbGVjdGVkTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBNdWx0aUFyZyB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBBZGRJbnB1dExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdNdWx0aUFyZy5hZGRJbnB1dCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBJbnB1dElEQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQWRkSW5wdXRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFJlbW92ZUlucHV0TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ011bHRpQXJnLnJlbW92ZUlucHV0JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IElucHV0SURBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihSZW1vdmVJbnB1dExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgUHJvamVjdERpYWxvZyB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0U291cmNlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBzb3VyY2U6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTZXRTb3VyY2VMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnUHJvamVjdERpYWxvZy5zZXRTb3VyY2UnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogU2V0U291cmNlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoU2V0U291cmNlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnc291cmNlJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2hhcmVQcm9qZWN0QXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgICAgIGlzVGhpc1Byb2plY3Q6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTaGFyZVByb2plY3RMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnUHJvamVjdERpYWxvZy5zaGFyZVByb2plY3QnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogU2hhcmVQcm9qZWN0QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoU2hhcmVQcm9qZWN0TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTaG93bkxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdQcm9qZWN0RGlhbG9nLnNob3duJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoU2hvd25MaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBVbnNoYXJlUHJvamVjdEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgUHJvamVjdE5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBVbnNoYXJlUHJvamVjdExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdQcm9qZWN0RGlhbG9nLnVuc2hhcmVQcm9qZWN0JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFVuc2hhcmVQcm9qZWN0QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVW5zaGFyZVByb2plY3RMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICdQcm9qZWN0TmFtZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgU2NyaXB0cyB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBDbGVhblVwTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ1NjcmlwdHMuY2xlYW5VcCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKENsZWFuVXBMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEV4cG9ydFBpY3R1cmVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnU2NyaXB0cy5leHBvcnRQaWN0dXJlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoRXhwb3J0UGljdHVyZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlZHJvcEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgYWN0aW9uOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgUmVkcm9wTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ1NjcmlwdHMucmVkcm9wJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFJlZHJvcEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFJlZHJvcExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ2FjdGlvbic7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFVuZHJvcEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgYWN0aW9uOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgVW5kcm9wTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ1NjcmlwdHMudW5kcm9wJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFVuZHJvcEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFVuZHJvcExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ2FjdGlvbic7IH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgU3ByaXRlIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBBZGRWYXJpYWJsZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgbmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEFkZFZhcmlhYmxlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ1Nwcml0ZS5hZGRWYXJpYWJsZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBBZGRWYXJpYWJsZUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEFkZFZhcmlhYmxlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnbmFtZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZVZhcmlhYmxlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICB2YXJOYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRGVsZXRlVmFyaWFibGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnU3ByaXRlLmRlbGV0ZVZhcmlhYmxlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IERlbGV0ZVZhcmlhYmxlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoRGVsZXRlVmFyaWFibGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICd2YXJOYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0TmFtZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgc3RyaW5nOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU2V0TmFtZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdTcHJpdGUuc2V0TmFtZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBTZXROYW1lQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoU2V0TmFtZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ3N0cmluZyc7IH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgWE1MIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBQYXJzZUZhaWxlZEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgeG1sU3RyaW5nOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgUGFyc2VGYWlsZWRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnWE1MLnBhcnNlRmFpbGVkJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFBhcnNlRmFpbGVkQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoUGFyc2VGYWlsZWRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICd4bWxTdHJpbmcnOyB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ0eXBlIEZ1bmN0aW9uSUQgPSBGdW5jdGlvbiB8IHN0cmluZztcclxuXHJcbmZ1bmN0aW9uIGdldFByb3RvdHlwZUZ1bmN0aW9uTmFtZShwcm90b3R5cGU6IE9iamVjdCwgZnVuYzogRnVuY3Rpb24pIHtcclxuICAgIGZvciAobGV0IGtleSBpbiBwcm90b3R5cGUpIHtcclxuICAgICAgICBpZiAocHJvdG90eXBlW2tleV0gPT09IGZ1bmMpIHJldHVybiBrZXk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE92ZXJyaWRlUmVnaXN0cnkge1xyXG5cclxuICAgIHN0YXRpYyBleHRlbmQoY2xhenogOiBGdW5jdGlvbiwgZnVuYyA6IEZ1bmN0aW9uSUQsIG5ld0Z1bmN0aW9uLCBjb3VudEFyZ3MgPSB0cnVlKSB7XHJcbiAgICAgICAgaWYgKCFjbGF6eiB8fCAhY2xhenoucHJvdG90eXBlKSB7XHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2V4dGVuZCByZXF1aXJlcyBhIGNsYXNzIGZvciBpdHMgZmlyc3QgYXJndW1lbnQnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gT3ZlcnJpZGVSZWdpc3RyeS5leHRlbmRPYmplY3QoY2xhenoucHJvdG90eXBlLCBmdW5jLCBuZXdGdW5jdGlvbiwgY291bnRBcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWZ0ZXIoY2xhenogOiBGdW5jdGlvbiwgZnVuYyA6IEZ1bmN0aW9uSUQsIGRvQWZ0ZXI6ICguLi5hcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgT3ZlcnJpZGVSZWdpc3RyeS53cmFwKGNsYXp6LCBmdW5jLCBudWxsLCBkb0FmdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYmVmb3JlKGNsYXp6IDogRnVuY3Rpb24sIGZ1bmMgOiBGdW5jdGlvbklELCBkb0JlZm9yZTogKC4uLmFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICBPdmVycmlkZVJlZ2lzdHJ5LndyYXAoY2xhenosIGZ1bmMsIGRvQmVmb3JlLCBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgd3JhcChcclxuICAgICAgICBjbGF6eiA6IEZ1bmN0aW9uLCBmdW5jIDogRnVuY3Rpb25JRCxcclxuICAgICAgICBkb0JlZm9yZT86ICguLi5hcmdzKSA9PiB2b2lkLCBkb0FmdGVyPzogKC4uLmFyZ3MpID0+IHZvaWRcclxuICAgICkge1xyXG4gICAgICAgIGZ1bmN0aW9uIG92ZXJyaWRlKGJhc2U6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgIGxldCBhcmdzID0gWy4uLmFyZ3VtZW50c10uc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIGlmIChkb0JlZm9yZSkgZG9CZWZvcmUuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgICAgICAgIGJhc2UuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgICAgICAgIGlmIChkb0FmdGVyKSBkb0FmdGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPdmVycmlkZVJlZ2lzdHJ5LmV4dGVuZChjbGF6eiwgZnVuYywgb3ZlcnJpZGUsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZXh0ZW5kT2JqZWN0KG9iamVjdCA6IG9iamVjdCwgZnVuYyA6IEZ1bmN0aW9uSUQsIG5ld0Z1bmN0aW9uLCBjb3VudEFyZ3MgPSB0cnVlKSB7XHJcbiAgICAgICAgbGV0IGZ1bmN0aW9uTmFtZSA9IHR5cGVvZiBmdW5jID09PSAnc3RyaW5nJyA/IGZ1bmMgOiBnZXRQcm90b3R5cGVGdW5jdGlvbk5hbWUob2JqZWN0LCBmdW5jKTtcclxuXHJcbiAgICAgICAgaWYgKCFvYmplY3RbZnVuY3Rpb25OYW1lXSkge1xyXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxyXG4gICAgICAgICAgICBjb25zb2xlLnRyYWNlKCk7XHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Nhbm5vdCBleHRlbmQgZnVuY3Rpb24gJyArIGZ1bmN0aW9uTmFtZSArXHJcbiAgICAgICAgICAgICAgICAnIGJlY2F1c2UgaXQgZG9lcyBub3QgZXhpc3QuJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBvbGRGdW5jdGlvbiA9IG9iamVjdFtmdW5jdGlvbk5hbWVdO1xyXG5cclxuICAgICAgICBpZiAoY291bnRBcmdzICYmICFvbGRGdW5jdGlvbi5leHRlbmRlZCAmJiBvbGRGdW5jdGlvbi5sZW5ndGggIT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgICAgICBvbGRGdW5jdGlvbi5sZW5ndGggKyAxICE9PSBuZXdGdW5jdGlvbi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSAnRXh0ZW5kaW5nIGZ1bmN0aW9uIHdpdGggd3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50czogJyArXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbk5hbWUgKyAnICcgK1xyXG4gICAgICAgICAgICAgICAgb2xkRnVuY3Rpb24ubGVuZ3RoICsgJyB2cyAnICsgbmV3RnVuY3Rpb24ubGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4obWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvYmplY3RbZnVuY3Rpb25OYW1lXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgYXJncy51bnNoaWZ0KG9sZEZ1bmN0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld0Z1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgb2JqZWN0W2Z1bmN0aW9uTmFtZV0uZXh0ZW5kZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICByZXR1cm4gb2xkRnVuY3Rpb247XHJcbiAgICB9XHJcbn1cclxuXHJcbnR5cGUgQmFzZUZ1bmN0aW9uID0gKC4uLmFyZ3MpID0+IGFueTtcclxuXHJcbmV4cG9ydCBjbGFzcyBDYWxsQ29udGV4dDxDbGFzc1R5cGUsIEZ1bmN0aW9uVHlwZSBleHRlbmRzIEJhc2VGdW5jdGlvbj4ge1xyXG5cclxuICAgIHJlYWRvbmx5IHRoaXNBcmc6IENsYXNzVHlwZTtcclxuICAgIHJlYWRvbmx5IG9yaWdpbmFsRnVuY3Rpb246IEZ1bmN0aW9uVHlwZTtcclxuICAgIHJlYWRvbmx5IG9yaWdpbmFsQXJnczogUGFyYW1ldGVyczxGdW5jdGlvblR5cGU+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRoaXNBcmc6IENsYXNzVHlwZSwgb3JpZ2luYWxGdW5jdGlvbjogRnVuY3Rpb25UeXBlLCBvcmlnaW5hbEFyZ3M6IFBhcmFtZXRlcnM8RnVuY3Rpb25UeXBlPikge1xyXG4gICAgICAgIHRoaXMudGhpc0FyZyA9IHRoaXNBcmc7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbEZ1bmN0aW9uID0gb3JpZ2luYWxGdW5jdGlvbjtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsQXJncyA9IG9yaWdpbmFsQXJncztcclxuICAgIH1cclxuXHJcbiAgICBhcHBseShhcmdzID0gdGhpcy5vcmlnaW5hbEFyZ3MpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcmlnaW5hbEZ1bmN0aW9uLmFwcGx5KHRoaXMudGhpc0FyZywgYXJncyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2FsbFdpdGhPcmlnaW5hbEFyZ3MoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luYWxGdW5jdGlvbi5jYWxsKHRoaXMudGhpc0FyZywgLi4udGhpcy5vcmlnaW5hbEFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbGxXaXRoTmV3QXJncyguLi5hcmdzKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luYWxGdW5jdGlvbi5jYWxsKHRoaXMudGhpc0FyZywgLi4uYXJncyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbnR5cGUgQmFzZVdpdGhDb250ZXh0PENsYXNzVHlwZSwgRnVuY3Rpb25UeXBlPiA9IFxyXG4gICAgRnVuY3Rpb25UeXBlIGV4dGVuZHMgKC4uLmE6IGluZmVyIFUpID0+IGluZmVyIFIgPyBcclxuICAgICAgICAodGhpczogQ2xhc3NUeXBlLCBpbmZvOiBDYWxsQ29udGV4dDxDbGFzc1R5cGUsIEZ1bmN0aW9uVHlwZT4sIC4uLmE6VSkgPT4gUjogXHJcbiAgICAgICAgbmV2ZXI7XHJcblxyXG5jbGFzcyBFeHRlbmRlcjxQcm90byBleHRlbmRzIG9iamVjdCwgRnVuY3Rpb25UeXBlIGV4dGVuZHMgRnVuY3Rpb24+IHtcclxuXHJcbiAgICByZWFkb25seSBwcm90b3R5cGU6IFByb3RvO1xyXG4gICAgcmVhZG9ubHkgb3JpZ2luYWxGdW5jdGlvbjogRnVuY3Rpb25UeXBlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChwcm90bzogUHJvdG8sIGZ1bmM6IEZ1bmN0aW9uVHlwZSkge1xyXG4gICAgICAgIHRoaXMucHJvdG90eXBlID0gcHJvdG87XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbEZ1bmN0aW9uID0gZnVuYztcclxuICAgIH1cclxuICAgIG92ZXJyaWRlKG92ZXJyaWRlOiBCYXNlV2l0aENvbnRleHQ8UHJvdG8sIEZ1bmN0aW9uVHlwZT4pIHtcclxuICAgICAgICBPdmVycmlkZVJlZ2lzdHJ5LmV4dGVuZE9iamVjdCh0aGlzLnByb3RvdHlwZSwgdGhpcy5vcmlnaW5hbEZ1bmN0aW9uLCBmdW5jdGlvbiAoYmFzZSkge1xyXG4gICAgICAgICAgICBsZXQgb3JpZ2luYWxBcmdzID0gWy4uLmFyZ3VtZW50c10uc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIGxldCBpbmZvID0gbmV3IENhbGxDb250ZXh0KHRoaXMsIGJhc2UsIG9yaWdpbmFsQXJncyk7XHJcbiAgICAgICAgICAgIHJldHVybiBvdmVycmlkZS5jYWxsKHRoaXMsIGluZm8sIC4uLm9yaWdpbmFsQXJncyk7XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGFmdGVyKFxyXG4gICAgICAgIGRvQWZ0ZXI6IEJhc2VXaXRoQ29udGV4dDxQcm90bywgRnVuY3Rpb25UeXBlPixcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMud3JhcChudWxsLCBkb0FmdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBiZWZvcmUoZG9CZWZvcmU6IEJhc2VXaXRoQ29udGV4dDxQcm90bywgRnVuY3Rpb25UeXBlPiwpIHtcclxuICAgICAgICB0aGlzLndyYXAoZG9CZWZvcmUsIG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHdyYXAoXHJcbiAgICAgICAgZG9CZWZvcmU/OiBCYXNlV2l0aENvbnRleHQ8UHJvdG8sIEZ1bmN0aW9uVHlwZT4sXHJcbiAgICAgICAgZG9BZnRlcj86IEJhc2VXaXRoQ29udGV4dDxQcm90bywgRnVuY3Rpb25UeXBlPixcclxuICAgICkge1xyXG4gICAgICAgIE92ZXJyaWRlUmVnaXN0cnkuZXh0ZW5kT2JqZWN0KHRoaXMucHJvdG90eXBlLCB0aGlzLm9yaWdpbmFsRnVuY3Rpb24sIGZ1bmN0aW9uIG92ZXJyaWRlKGJhc2UpIHtcclxuICAgICAgICAgICAgbGV0IG9yaWdpbmFsQXJncyA9IFsuLi5hcmd1bWVudHNdLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICBsZXQgaW5mbyA9IG5ldyBDYWxsQ29udGV4dCh0aGlzLCBiYXNlLCBvcmlnaW5hbEFyZ3MpO1xyXG4gICAgICAgICAgICBpZiAoZG9CZWZvcmUpIGRvQmVmb3JlLmNhbGwodGhpcywgaW5mbywgLi4ub3JpZ2luYWxBcmdzKTtcclxuICAgICAgICAgICAgYmFzZS5hcHBseSh0aGlzLCBvcmlnaW5hbEFyZ3MpO1xyXG4gICAgICAgICAgICBpZiAoZG9BZnRlcikgZG9BZnRlci5jYWxsKHRoaXMsIGluZm8sIC4uLm9yaWdpbmFsQXJncyk7XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG50eXBlIFJlbW92ZUluZGV4PFQ+ID0ge1xyXG4gICAgWyBLIGluIGtleW9mIFQgYXNcclxuICAgICAgc3RyaW5nIGV4dGVuZHMgS1xyXG4gICAgICAgID8gbmV2ZXJcclxuICAgICAgICA6IG51bWJlciBleHRlbmRzIEtcclxuICAgICAgICAgID8gbmV2ZXJcclxuICAgICAgICAgIDogc3ltYm9sIGV4dGVuZHMgS1xyXG4gICAgICAgICAgICA/IG5ldmVyXHJcbiAgICAgICAgICAgIDogS1xyXG4gICAgXTogVFtLXTtcclxufTtcclxuXHJcbnR5cGUgRXh0ZW5zaW9uT2Y8UHJvdG8gZXh0ZW5kcyBvYmplY3Q+ID0ge1xyXG4gICAgW1AgaW4ga2V5b2YgUmVtb3ZlSW5kZXg8UHJvdG8+XTogUHJvdG9bUF0gZXh0ZW5kcyBCYXNlRnVuY3Rpb25cclxuICAgICAgICA/IEV4dGVuZGVyPFByb3RvLCBQcm90b1tQXT5cclxuICAgICAgICA6IG5ldmVyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kPFByb3RvIGV4dGVuZHMgb2JqZWN0Pihwcm90bzogUHJvdG8pIHtcclxuICAgIGxldCBleCA9IHt9IGFzIEV4dGVuc2lvbk9mPFByb3RvPjtcclxuICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICBmb3IgKGxldCBrIGluIHByb3RvKSB7XHJcbiAgICAgICAgbGV0IGtleSA9IGsgYXMgc3RyaW5nO1xyXG4gICAgICAgIGxldCBmID0gcHJvdG9ba107XHJcbiAgICAgICAgaWYgKHR5cGVvZiBmID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCBrKTtcclxuICAgICAgICAgICAgZXhba2V5XSA9IG5ldyBFeHRlbmRlcihwcm90bywgZik7XHJcbiAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8vIGNvbnNvbGUubG9nKFwiY3JlYXRlZCBcIiArIGNvdW50ICsgXCIgZXh0ZW5kZXJzXCIpO1xyXG4gICAgcmV0dXJuIGV4O1xyXG59XHJcblxyXG4vLyBleHBvcnQgY2xhc3MgUGFyYW1ldGVyaXplZE92ZXJyaWRlIHtcclxuLy8gICAgIHN0YXRpYyBvdmVycmlkZTxDbGFzc1R5cGUgZXh0ZW5kcyBGdW5jdGlvbiwgRnVuY3Rpb25UeXBlIGV4dGVuZHMgKC4uLmFyZ3MpID0+IGFueT4oXHJcbi8vICAgICAgICAgY2xheno6IENsYXNzVHlwZSwgXHJcbi8vICAgICAgICAgZnVuY3Rpb25EZWY6IEZ1bmN0aW9uVHlwZSxcclxuLy8gICAgICAgICBvdmVycmlkZTogQmFzZVdpdGhDb250ZXh0PENsYXNzVHlwZSwgRnVuY3Rpb25UeXBlPixcclxuLy8gICAgICkge1xyXG4vLyAgICAgICAgIE92ZXJyaWRlUmVnaXN0cnkuZXh0ZW5kKGNsYXp6LCBmdW5jdGlvbkRlZiwgZnVuY3Rpb24gKGJhc2UpIHtcclxuLy8gICAgICAgICAgICAgbGV0IG9yaWdpbmFsQXJncyA9IFsuLi5hcmd1bWVudHNdLnNsaWNlKDEpO1xyXG4vLyAgICAgICAgICAgICBsZXQgaW5mbyA9IG5ldyBDYWxsQ29udGV4dCh0aGlzLCBiYXNlLCBvcmlnaW5hbEFyZ3MpO1xyXG4vLyAgICAgICAgICAgICByZXR1cm4gb3ZlcnJpZGUoaW5mbywgLi4ub3JpZ2luYWxBcmdzKTtcclxuLy8gICAgICAgICB9LCB0cnVlKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBzdGF0aWMgYWZ0ZXI8Q2xhc3NUeXBlIGV4dGVuZHMgRnVuY3Rpb24sIEZ1bmN0aW9uVHlwZSBleHRlbmRzIEJhc2VGdW5jdGlvbj4oXHJcbi8vICAgICAgICAgY2xheno6IENsYXNzVHlwZSwgXHJcbi8vICAgICAgICAgZnVuY3Rpb25EZWY6IEZ1bmN0aW9uVHlwZSxcclxuLy8gICAgICAgICBkb0FmdGVyOiBCYXNlV2l0aENvbnRleHQ8Q2xhc3NUeXBlLCBGdW5jdGlvblR5cGU+LFxyXG4vLyAgICAgKSB7XHJcbi8vICAgICAgICAgUGFyYW1ldGVyaXplZE92ZXJyaWRlLndyYXAoY2xhenosIGZ1bmN0aW9uRGVmLCBudWxsLCBkb0FmdGVyKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBzdGF0aWMgYmVmb3JlPENsYXNzVHlwZSBleHRlbmRzIEZ1bmN0aW9uLCBGdW5jdGlvblR5cGUgZXh0ZW5kcyBCYXNlRnVuY3Rpb24+KFxyXG4vLyAgICAgICAgIGNsYXp6OiBDbGFzc1R5cGUsIFxyXG4vLyAgICAgICAgIGZ1bmN0aW9uRGVmOiBGdW5jdGlvblR5cGUsXHJcbi8vICAgICAgICAgZG9CZWZvcmU6IEJhc2VXaXRoQ29udGV4dDxDbGFzc1R5cGUsIEZ1bmN0aW9uVHlwZT4sXHJcbi8vICAgICApIHtcclxuLy8gICAgICAgICBQYXJhbWV0ZXJpemVkT3ZlcnJpZGUud3JhcChjbGF6eiwgZnVuY3Rpb25EZWYsIGRvQmVmb3JlLCBudWxsKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBzdGF0aWMgd3JhcDxDbGFzc1R5cGUgZXh0ZW5kcyBGdW5jdGlvbiwgRnVuY3Rpb25UeXBlIGV4dGVuZHMgQmFzZUZ1bmN0aW9uPihcclxuLy8gICAgICAgICBjbGF6ejogQ2xhc3NUeXBlLCBcclxuLy8gICAgICAgICBmdW5jdGlvbkRlZjogRnVuY3Rpb25UeXBlLFxyXG4vLyAgICAgICAgIGRvQmVmb3JlPzogQmFzZVdpdGhDb250ZXh0PENsYXNzVHlwZSwgRnVuY3Rpb25UeXBlPixcclxuLy8gICAgICAgICBkb0FmdGVyPzogQmFzZVdpdGhDb250ZXh0PENsYXNzVHlwZSwgRnVuY3Rpb25UeXBlPixcclxuLy8gICAgICkge1xyXG4vLyAgICAgICAgIGZ1bmN0aW9uIG92ZXJyaWRlKGJhc2U6IEJhc2VGdW5jdGlvbikge1xyXG4vLyAgICAgICAgICAgICBsZXQgb3JpZ2luYWxBcmdzID0gWy4uLmFyZ3VtZW50c10uc2xpY2UoMSk7XHJcbi8vICAgICAgICAgICAgIGxldCBpbmZvID0gbmV3IENhbGxDb250ZXh0KHRoaXMsIGJhc2UsIG9yaWdpbmFsQXJncyk7XHJcbi8vICAgICAgICAgICAgIGlmIChkb0JlZm9yZSkgZG9CZWZvcmUoaW5mbywgLi4ub3JpZ2luYWxBcmdzKTtcclxuLy8gICAgICAgICAgICAgYmFzZS5hcHBseSh0aGlzLCBvcmlnaW5hbEFyZ3MpO1xyXG4vLyAgICAgICAgICAgICBpZiAoZG9BZnRlcikgZG9BZnRlcihpbmZvLCAuLi5vcmlnaW5hbEFyZ3MpO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICBPdmVycmlkZVJlZ2lzdHJ5LmV4dGVuZChjbGF6eiwgZnVuY3Rpb25EZWYsIG92ZXJyaWRlLCBmYWxzZSk7XHJcbi8vICAgICB9XHJcblxyXG4vLyB9XHJcblxyXG4iLCJpbXBvcnQgeyBCbG9ja3MgfSBmcm9tIFwiLi4vYmxvY2tzL0Jsb2NrRmFjdG9yeVwiO1xyXG5pbXBvcnQgeyBFdmVudE1hbmFnZXIgfSBmcm9tIFwiLi4vZXZlbnRzL0V2ZW50TWFuYWdlclwiO1xyXG5pbXBvcnQgeyBFeHRlbnNpb25NYW5hZ2VyIH0gZnJvbSBcIi4vRXh0ZW5zaW9uTWFuYWdlclwiO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEV4dGVuc2lvbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGV2ZW50cygpIDogRXZlbnRNYW5hZ2VyIHtcclxuICAgICAgICByZXR1cm4gRXh0ZW5zaW9uTWFuYWdlci5ldmVudHM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGJsb2NrcygpIDogQmxvY2tzLkJsb2NrRmFjdG9yeSB7XHJcbiAgICAgICAgcmV0dXJuIEV4dGVuc2lvbk1hbmFnZXIuYmxvY2tzO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7fVxyXG5cclxuICAgIHJlZ2lzdGVyKCkge1xyXG4gICAgICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXIodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVwZW5kZW5jaWVzKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBCbG9ja3MgfSBmcm9tIFwiLi4vYmxvY2tzL0Jsb2NrRmFjdG9yeVwiO1xyXG5pbXBvcnQgeyBEZXZNb2RlIH0gZnJvbSBcIi4uL2Rldi9EZXZNb2RlXCI7XHJcbmltcG9ydCB7IEV2ZW50TWFuYWdlciB9IGZyb20gXCIuLi9ldmVudHMvRXZlbnRNYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEV4dGVuc2lvbiB9IGZyb20gXCIuL0V4dGVuc2lvblwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBFeHRlbnNpb25NYW5hZ2VyIHtcclxuXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZXh0ZW5zaW9ucyA9IFtdIGFzIEV4dGVuc2lvbltdO1xyXG5cclxuICAgIHN0YXRpYyByZWFkb25seSBibG9ja3MgPSBuZXcgQmxvY2tzLkJsb2NrRmFjdG9yeSgpO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGV2ZW50cyA9IG5ldyBFdmVudE1hbmFnZXIoKTtcclxuICAgIHN0YXRpYyByZWFkb25seSBkZXZNb2RlID0gbmV3IERldk1vZGUoKTtcclxuXHJcbiAgICBzdGF0aWMgcmVnaXN0ZXIoZXh0ZW5zaW9uIDogRXh0ZW5zaW9uKSB7XHJcbiAgICAgICAgdGhpcy5leHRlbnNpb25zLnB1c2goZXh0ZW5zaW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaW5pdCgpIHtcclxuXHJcbiAgICAgICAgY29uc3QgY29uZmlnRm4gPSAgICB3aW5kb3dbJ2dldFNFRkNvbmZpZyddO1xyXG4gICAgICAgIGlmICghY29uZmlnRm4pIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgICAgICAgICAgJ05vIFNFRiBjb25maWcgZmlsZTogTm8gZXh0ZW5zaW9ucyBsb2FkZWQuICcgK1xyXG4gICAgICAgICAgICAgICAgJ1BsZWFzZSBjcmVhdGUgbGlicmFyaWVzL3NlZi1jb25maWcuanMuJ1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjb25maWcgPSBjb25maWdGbigpO1xyXG4gICAgICAgIGlmICghY29uZmlnIHx8ICFBcnJheS5pc0FycmF5KGNvbmZpZy5leHRlbnNpb25zKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgICAgICAgICAnSW52YWxpZCBzZWYtY29uZmlnLmpzIGZpbGUgKG5vIGV4dGVuc2lvbnMgcHJvcGVydHkpLiAnICtcclxuICAgICAgICAgICAgICAgICdQbGVhc2Ugc2VlIGxpYnJhcmllcy9zZWYtY29uZmlnLmV4YW1wbGUuanMgZm9yIGFuIGV4YW1wbGUuJ1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxvYWRFeHRlbnNpb25zKGNvbmZpZy5leHRlbnNpb25zKTtcclxuXHJcbiAgICAgICAgdGhpcy5kZXZNb2RlLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbml0RXh0ZW5zaW9ucygpIHtcclxuICAgICAgICAvLyBUT0RPOiBPcmRlciBiYXNlZCBvbiBkZXBlbmRlbmNpZXNcclxuICAgICAgICAvLyBUT0RPOiBMb2FkIG9ubHkgd2hlbiBhc2tlZCBmb3IsIG5vdCBhbHdheXNcclxuICAgICAgICB0aGlzLmV4dGVuc2lvbnMuZm9yRWFjaChlID0+IHtcclxuICAgICAgICAgICAgZS5pbml0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbG9hZEV4dGVuc2lvbnMocGF0aHM6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgbGV0IHRvTG9hZCA9IDA7XHJcbiAgICAgICAgcGF0aHMuZm9yRWFjaChwYXRoID0+IHtcclxuICAgICAgICAgICAgdG9Mb2FkKys7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZEV4dGVuc2lvbihwYXRoLCBzdWNjZXNzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignRXh0ZW5zaW9uIG5vdCBmb3VuZDonLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRvTG9hZC0tO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRvTG9hZCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0RXh0ZW5zaW9ucygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBsb2FkRXh0ZW5zaW9uKFxyXG4gICAgICAgIHBhdGg6IHN0cmluZyxcclxuICAgICAgICBjYWxsYmFjazogKHN1Y2Nlc3M6IGJvb2xlYW4pID0+IHZvaWRcclxuICAgICkge1xyXG4gICAgICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICBzY3JpcHQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvamF2YXNjcmlwdCcpO1xyXG4gICAgICAgIHNjcmlwdC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHBhdGgpO1xyXG4gICAgICAgIC8vIFRPRE86IHJlbW92ZSBzaW11bGF0ZWQgbGFnXHJcbiAgICAgICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiBjYWxsYmFjayh0cnVlKSk7XHJcbiAgICAgICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4gY2FsbGJhY2soZmFsc2UpKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBTbmFwIH0gZnJvbSBcIi4uL3NuYXAvU25hcFV0aWxzXCI7XHJcblxyXG5leHBvcnQgbmFtZXNwYWNlIENsb3VkIHtcclxuXHJcbiAgICBleHBvcnQgdHlwZSBDbG91ZFByb2plY3QgPSB7XHJcbiAgICAgICAgY3JlYXRlZDogc3RyaW5nLFxyXG4gICAgICAgIGlkOiBudW1iZXIsXHJcbiAgICAgICAgaXNwdWJsaWM6IGJvb2xlYW4sXHJcbiAgICAgICAgaXNwdWJsaXNoZWQ6IGJvb2xlYW4sXHJcbiAgICAgICAgbGFzdHVwZGF0ZWQ6IHN0cmluZyxcclxuICAgICAgICBub3Rlczogc3RyaW5nLFxyXG4gICAgICAgIHByb2plY3RuYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgdXNlcm5hbWU6IHN0cmluZyxcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgdHlwZSBQcm9qZWN0U2F2ZUJvZHkgPSB7XHJcbiAgICAgICAgbm90ZXM6IHN0cmluZyxcclxuICAgICAgICB4bWw6IHN0cmluZyxcclxuICAgICAgICBtZWRpYTogc3RyaW5nLFxyXG4gICAgICAgIHRodW1ibmFpbDogc3RyaW5nLFxyXG4gICAgICAgIHJlbWl4SUQ6IHN0cmluZyxcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVXRpbHMge1xyXG5cclxuICAgICAgICBzdGF0aWMgYXN5bmMgZ2V0Q2xvdWRQcm9qZWN0cyh3aXRoVGh1bWJuYWlsOiBib29sZWFuKTogUHJvbWlzZTxDbG91ZFByb2plY3RbXT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgU25hcC5jbG91ZC5nZXRQcm9qZWN0TGlzdChkaWN0ID0+IHJlc29sdmUoZGljdC5wcm9qZWN0cyksIHJlamVjdCwgd2l0aFRodW1ibmFpbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGFzeW5jIHNhdmVQcm9qZWN0KHByb2plY3ROYW1lOiBzdHJpbmcsIGJvZHk6IFByb2plY3RTYXZlQm9keSkgOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIFNuYXAuY2xvdWQuc2F2ZVByb2plY3QocHJvamVjdE5hbWUsIGJvZHksIHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGFzeW5jIGdldFB1YmxpY1Byb2plY3QocHJvamVjdE5hbWU6IHN0cmluZywgdXNlck5hbWU6IHN0cmluZykgOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgU25hcC5jbG91ZC5nZXRQdWJsaWNQcm9qZWN0KHByb2plY3ROYW1lLCB1c2VyTmFtZSwgcmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZGVwcmVjYXRlZCBUaGUgY2xvdWQgYmFja2VuZCBubyBsb25nZXIgc3VwcG9ydHMgdGhpcyFcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgYXN5bmMgZ2V0UHJvamVjdE1ldGFkYXRhKHByb2plY3ROYW1lOiBzdHJpbmcsIHVzZXJOYW1lOiBzdHJpbmcpIDogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIFNuYXAuY2xvdWQuZ2V0UHJvamVjdE1ldGFkYXRhKHByb2plY3ROYW1lLCB1c2VyTmFtZSwgcmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgYXN5bmMgc2hhcmVQcm9qZWN0KHByb2plY3ROYW1lOiBzdHJpbmcpIDogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBTbmFwLmNsb3VkLnNoYXJlUHJvamVjdChwcm9qZWN0TmFtZSwgU25hcC5jbG91ZC51c2VyTmFtZSwgcmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUT0RPOiBQcm9qZWN0IHNob3VsZCBoYXZlIHNvbWUgc29ydCBvZiBwbHVnaW4gcGVybWlzc2lvbiBzeXN0ZW0uLi5cclxuICAgICAgICBzdGF0aWMgYXN5bmMgZGVsZXRlUHJvamVjdChwcm9qZWN0TmFtZTogc3RyaW5nKSA6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgU25hcC5jbG91ZC5kZWxldGVQcm9qZWN0KHByb2plY3ROYW1lLCBTbmFwLmNsb3VkLnVzZXJOYW1lLCByZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBnZXRDdXJyZW50UHJvamVjdERhdGEodmVyaWZ5OiBib29sZWFuKSA6IFByb2plY3RTYXZlQm9keSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0Qm9keSA9IFNuYXAuSURFLmJ1aWxkUHJvamVjdFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgaWYgKCFTbmFwLklERS52ZXJpZnlQcm9qZWN0KHByb2plY3RCb2R5KSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9qZWN0Qm9keTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBnZXRDdXJyZW50UHJvamVjdE5hbWUoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBTbmFwLklERS5nZXRQcm9qZWN0TmFtZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGlzTG9nZ2VkSW4oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBTbmFwLmNsb3VkLnVzZXJuYW1lICE9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgdXNlcm5hbWUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBTbmFwLmNsb3VkLnVzZXJuYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIHRlc3QoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2xvdWRQcm9qZWN0cyhmYWxzZSkudGhlbihwcm9qZWN0cyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwcm9qZWN0c1swXS5jcmVhdGVkKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIFRoaXMgY2xhc3MgYXV0b21hdGljYWxseSBnZW5lcmF0ZXMgdHlwZXNjcmlwdCBkZWZpbml0aW9uc1xyXG4gKiBmcm9tIFNuYXAncyBzb3VyY2UgY29kZS4gVG8gcnVuLCBvcGVuIFNuYXAgaW4gYSBicm93c2VyIGFuZFxyXG4gKiBmcm9tIHRoZSBjb25zb2xlIHJ1bjpcclxuICogbmV3IFNFRi5EZWZHZW5lcmF0b3IoKS5pbml0KCkuZG93bmxvYWRBbGwoKVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIERlZkdlbmVyYXRvciB7XHJcblxyXG4gICAgY2xhc3NlcyA9IG5ldyBNYXA8c3RyaW5nLCBDbGFzc0RlZj47XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXMod2luZG93KSkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhrZXkpO1xyXG4gICAgICAgICAgICBpZiAoIXdpbmRvdy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gd2luZG93W2tleV07XHJcbiAgICAgICAgICAgIGlmICghKHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24pKSBjb250aW51ZTtcclxuICAgICAgICAgICAgaWYgKCF2YWx1ZS5wcm90b3R5cGUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUubmFtZS5sZW5ndGggPT0gMCkgY29udGludWU7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3Nlcy5zZXQoa2V5LCBuZXcgQ2xhc3NEZWYodmFsdWUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jbGFzc2VzLmZvckVhY2goYyA9PiBjLmFkZFBhcmVudERhdGEodGhpcy5jbGFzc2VzKSk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMub3V0cHV0RGVmaW5pdGlvbnMoKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcyk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENsYXNzZXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIFsuLi50aGlzLmNsYXNzZXMudmFsdWVzKCldXHJcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IGEuY29tcGFyZVRvKGIpKTtcclxuICAgIH1cclxuXHJcbiAgICBvdXRwdXRFeHBvcnRzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldENsYXNzZXMoKS5tYXAoYyA9PiBjLmV4cG9ydFN0YXRlbWVudCgpKS5qb2luKCdcXG4nKTtcclxuICAgIH1cclxuXHJcbiAgICBvdXRwdXREZWZpbml0aW9ucygpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG5leHBvcnQgY2xhc3MgU25hcFR5cGUge1xyXG4gICAgcHJvdG90eXBlOiBhbnk7XHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcbn1cXG5cXG5gICsgdGhpcy5nZXRDbGFzc2VzKCkubWFwKGMgPT4gYy50b1RTKCkpLmpvaW4oJ1xcblxcbicpO1xyXG4gICAgfVxyXG5cclxuICAgIGRvd25sb2FkQWxsKCkge1xyXG4gICAgICAgIHRoaXMuZG93bmxvYWRGaWxlKCdTbmFwLmpzJywgdGhpcy5vdXRwdXRFeHBvcnRzKCkpO1xyXG4gICAgICAgIHRoaXMuZG93bmxvYWRGaWxlKCdTbmFwLmQudHMnLCB0aGlzLm91dHB1dERlZmluaXRpb25zKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGRvd25sb2FkRmlsZShmaWxlbmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnaHJlZicsICdkYXRhOnRleHQvcGxhaW47Y2hhcnNldD11dGYtOCwnICsgZW5jb2RlVVJJQ29tcG9uZW50KHRleHQpKTtcclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBmaWxlbmFtZSk7XHJcblxyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG5cclxuICAgICAgICBlbGVtZW50LmNsaWNrKCk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5jbGFzcyBDbGFzc0RlZiB7XHJcbiAgICBiYXNlRnVuY3Rpb246IEZ1bmN0aW9uO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdWJlciA9IG51bGwgYXMgc3RyaW5nO1xyXG4gICAgZnVuY3Rpb25Qcm94eSA6IE1ldGhvZDtcclxuICAgIGZpZWxkcyA9IG5ldyBNYXA8c3RyaW5nLCBGaWVsZD47XHJcbiAgICBtZXRob2RzID0gbmV3IE1hcDxzdHJpbmcsIE1ldGhvZD47XHJcbiAgICBhZGRlZFBhcmVudERhdGEgPSBmYWxzZTtcclxuXHJcbiAgICBnZXQgaXNQdXJlRnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZnVuY3Rpb25Qcm94eSAhPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZ1bmM6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5iYXNlRnVuY3Rpb24gPSBmdW5jO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IGZ1bmMubmFtZTtcclxuICAgICAgICBjb25zdCBwcm90byA9IGZ1bmMucHJvdG90eXBlO1xyXG4gICAgICAgIGlmICghcHJvdG8pIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKFsuLi5PYmplY3Qua2V5cyhwcm90byldLmxlbmd0aCA8PSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZnVuY3Rpb25Qcm94eSA9IG5ldyBNZXRob2QodGhpcy5uYW1lLCBmdW5jKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51YmVyID0gZnVuY1sndWJlciddPy5jb25zdHJ1Y3Rvcj8ubmFtZTtcclxuICAgICAgICB0aGlzLmluZmVyRmllbGRzKGZ1bmMpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMocHJvdG8pKSB7XHJcbiAgICAgICAgICAgIC8vIEkgdGhpbmsgdGhpcyBpcyByZWR1bmRhbnQuLi5cclxuICAgICAgICAgICAgaWYgKCFwcm90by5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gcHJvdG9ba2V5XTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWV0aG9kcy5zZXQoa2V5LCBuZXcgTWV0aG9kKGtleSwgdmFsdWUpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFRPRE86IGRpc3Rpbmd1aXNoIGJldHdlZW4gaW5oZXJpdGVkIGZpZWxkcyBhbmQgc3RhdGljIGZpZWxkc1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5maWVsZHMucHVzaChuZXcgRmllbGQoa2V5LCB2YWx1ZSwgdHJ1ZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5mZXJGaWVsZHMocHJvdG9bJ2luaXQnXSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcGFyZVRvKG90aGVyOiBDbGFzc0RlZikge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUHVyZUZ1bmN0aW9uICYmICFvdGhlci5pc1B1cmVGdW5jdGlvbikgcmV0dXJuIC0xO1xyXG4gICAgICAgIGlmICghdGhpcy5pc1B1cmVGdW5jdGlvbiAmJiBvdGhlci5pc1B1cmVGdW5jdGlvbikgcmV0dXJuIDE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZS5sb2NhbGVDb21wYXJlKG90aGVyLm5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFBhcmVudERhdGEoY2xhc3NlczogTWFwPHN0cmluZywgQ2xhc3NEZWY+KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuYWRkZWRQYXJlbnREYXRhKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5hZGRlZFBhcmVudERhdGEgPSB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLmZ1bmN0aW9uUHJveHkpIHJldHVybjtcclxuICAgICAgICBpZiAoIXRoaXMudWJlciB8fCAhY2xhc3Nlcy5oYXModGhpcy51YmVyKSkgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IGNsYXNzZXMuZ2V0KHRoaXMudWJlcik7XHJcbiAgICAgICAgaWYgKCFwYXJlbnQuYWRkZWRQYXJlbnREYXRhKSBwYXJlbnQuYWRkUGFyZW50RGF0YShjbGFzc2VzKTtcclxuICAgICAgICBmb3IgKGxldCBbbWV0aG9kTmFtZSwgbWV0aG9kXSBvZiBwYXJlbnQubWV0aG9kcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tZXRob2RzLmhhcyhtZXRob2ROYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIHRoaXMubWV0aG9kcy5zZXQobWV0aG9kTmFtZSwgbWV0aG9kKTtcclxuICAgICAgICAgICAgLy8gSWYgYSBmaWVsZCBvdmVyc2hhZG93cyBhIHBhcmVudCBtZXRob2QsIGl0IHdhcyBwcm9iYWJseVxyXG4gICAgICAgICAgICAvLyBhIG1pc3Rha2UsIHNvIGRlbGV0ZSBpdC5cclxuICAgICAgICAgICAgLy8gVE9ETzogTm90IHN1cmUgdGhpcyBpcyB0aGUgcmlnaHQgY2FsbDsgY291bGQgaWdub3JlIGluaGVyaXRhbmNlXHJcbiAgICAgICAgICAgIHRoaXMuZmllbGRzLmRlbGV0ZShtZXRob2ROYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgW2ZpZWxkTmFtZSwgZmllbGRdIG9mIHBhcmVudC5maWVsZHMpIHtcclxuICAgICAgICAgICAgLy8gRG9uJ3QgY29weSBmaWVsZHMgdGhhdCBoYXZlIHNoYWRvd2luZyBtZXRob2RzXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1ldGhvZHMuaGFzKGZpZWxkTmFtZSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5maWVsZHMuaGFzKGZpZWxkTmFtZSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB0aGlzLmZpZWxkcy5zZXQoZmllbGROYW1lLCBmaWVsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluZmVyRmllbGRzKGZ1bmM6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgaWYgKCFmdW5jKSByZXR1cm47XHJcbiAgICAgICAgY29uc3QganMgPSBmdW5jLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgY29uc3QgdmFyRGVjID0gL15cXHMqdGhpc1xccypcXC5cXHMqKFthLXpBLVpfJF1bMC05YS16QS1aXyRdKilcXHMqPS9nbTtcclxuICAgICAgICBmb3IgKGxldCBtYXRjaCBvZiBqcy5tYXRjaEFsbCh2YXJEZWMpKSB7XHJcbiAgICAgICAgICAgIGxldCBuYW1lID0gbWF0Y2hbMV07XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZpZWxkcy5oYXMobmFtZSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAvLyBHaXZlIHByZWNlZGVuY2UgdG8gbWV0aG9kc1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tZXRob2RzLmhhcyhuYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmllbGRzLnNldChuYW1lLCBuZXcgRmllbGQobmFtZSwgbnVsbCwgZmFsc2UpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0U3RhdGVtZW50KCkge1xyXG4gICAgICAgIHJldHVybiBgZXhwb3J0IGNvbnN0ICR7dGhpcy5uYW1lfSA9IHdpbmRvd1snJHt0aGlzLm5hbWV9J107YDtcclxuICAgIH1cclxuXHJcbiAgICB0b1RTKCkgOiBzdHJpbmcgIHtcclxuICAgICAgICBpZiAodGhpcy5mdW5jdGlvblByb3h5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgZXhwb3J0IGZ1bmN0aW9uICR7dGhpcy5mdW5jdGlvblByb3h5LnRvVFMoKX1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbGV0IGNvZGUgPSBgZXhwb3J0IGNsYXNzICR7dGhpcy5uYW1lfSBleHRlbmRzICR7dGhpcy51YmVyID8gdGhpcy51YmVyIDogJ1NuYXBUeXBlJ31gO1xyXG4gICAgICAgIC8vIFRPRE86IEJlY2F1c2UgVHlwZXNjcmlwdCBzZWVtcyBub3QgdG8gYWxsb3cgZnVuY3Rpb24gc2hhZG93aW5nLFxyXG4gICAgICAgIC8vIG5lZWQgdG8gbWFudWFsbHkgZGVmaW5lIGFsbCBwYXJlbnQgdHlwZXMgYW5kIG1ldGhvZHMgKHRoYXQgYXJlbid0IHNoYWRvd2VkKSBoZXJlXHJcbiAgICAgICAgbGV0IGNvZGUgPSBgZXhwb3J0IGNsYXNzICR7dGhpcy5uYW1lfSBleHRlbmRzIFNuYXBUeXBlYDtcclxuICAgICAgICBjb2RlICs9IGAge1xcbmA7XHJcbiAgICAgICAgbGV0IGZLZXlzID0gWy4uLnRoaXMuZmllbGRzLmtleXMoKV07XHJcbiAgICAgICAgZktleXMuc29ydCgpO1xyXG4gICAgICAgIGZvciAobGV0IGZrZXkgb2YgZktleXMpIHtcclxuICAgICAgICAgICAgY29kZSArPSAnICAgICcgKyB0aGlzLmZpZWxkcy5nZXQoZmtleSkudG9UUygpICsgJ1xcbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvZGUgKz0gJ1xcbic7XHJcbiAgICAgICAgbGV0IG1LZXlzID0gWy4uLnRoaXMubWV0aG9kcy5rZXlzKCldO1xyXG4gICAgICAgIG1LZXlzLnNvcnQoKTtcclxuICAgICAgICBmb3IgKGxldCBtS2V5IG9mIG1LZXlzKSB7XHJcbiAgICAgICAgICAgIGNvZGUgKz0gJyAgICAnICsgdGhpcy5tZXRob2RzLmdldChtS2V5KS50b1RTKCkgKyAnXFxuJztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29kZSArPSAnfSc7XHJcbiAgICAgICAgcmV0dXJuIGNvZGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEZpZWxkIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHR5cGU6IHN0cmluZztcclxuICAgIGlzU3RhdGljOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSwgaXNTdGF0aWM6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuaXNTdGF0aWMgPSBpc1N0YXRpYztcclxuICAgICAgICB0aGlzLnR5cGUgPSAnYW55JztcclxuICAgICAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSB0eXBlb2YodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0b1RTKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgJHt0aGlzLmlzU3RhdGljID8gJ3N0YXRpYyAnIDogJyd9JHt0aGlzLm5hbWV9OiAke3RoaXMudHlwZX07YDtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgTWV0aG9kIHtcclxuXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgU1RSSVBfQ09NTUVOVFMgPSAvKFxcL1xcLy4qJCl8KFxcL1xcKltcXHNcXFNdKj9cXCpcXC8pfChcXHMqPVteLFxcKV0qKCgnKD86XFxcXCd8W14nXFxyXFxuXSkqJyl8KFwiKD86XFxcXFwifFteXCJcXHJcXG5dKSpcIikpfChcXHMqPVteLFxcKV0qKSkvbWc7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgQVJHVU1FTlRfTkFNRVMgPSAvKFteXFxzLF0rKS9nO1xyXG5cclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHBhcmFtTmFtZXM6IHN0cmluZ1tdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgZnVuYzogRnVuY3Rpb24pIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMucGFyYW1OYW1lcyA9IHRoaXMuZ2V0UGFyYW1OYW1lcyhmdW5jKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQYXJhbU5hbWVzKGZ1bmM6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgbGV0IGZuU3RyID0gZnVuYy50b1N0cmluZygpLnJlcGxhY2UoTWV0aG9kLlNUUklQX0NPTU1FTlRTLCAnJyk7XHJcbiAgICAgICAgbGV0IHJlc3VsdFJlZ2V4ID0gZm5TdHIuc2xpY2UoZm5TdHIuaW5kZXhPZignKCcpKzEsIGZuU3RyLmluZGV4T2YoJyknKSkubWF0Y2goTWV0aG9kLkFSR1VNRU5UX05BTUVTKTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gcmVzdWx0UmVnZXggPyBbLi4ucmVzdWx0UmVnZXhdIDogW107XHJcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmZpbHRlcihwYXJhbSA9PiBwYXJhbS5tYXRjaCgvXlthLXpBLVpfJF1bMC05YS16QS1aXyRdKiQvKSlcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvVFMoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3Qgb3ZlcnJpZGUgPSB0aGlzLmNoZWNrT3ZlcnJpZGUoKTtcclxuICAgICAgICBpZiAob3ZlcnJpZGUpIHJldHVybiBvdmVycmlkZTtcclxuICAgICAgICBsZXQgY29kZSA9IGAke3RoaXMubmFtZX0oYDtcclxuICAgICAgICBsZXQgZmlyc3QgPSB0cnVlO1xyXG4gICAgICAgIGZvciAobGV0IG5hbWUgb2YgdGhpcy5wYXJhbU5hbWVzKSB7XHJcbiAgICAgICAgICAgIGlmICghZmlyc3QpIGNvZGUgKz0gJywgJztcclxuICAgICAgICAgICAgZmlyc3QgPSBmYWxzZTtcclxuICAgICAgICAgICAgY29kZSArPSBgJHtuYW1lfT86IGFueWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvZGUgKz0gJyk7JztcclxuICAgICAgICByZXR1cm4gY29kZTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja092ZXJyaWRlKCkge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5uYW1lKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2NoaWxkVGhhdElzQSc6IHJldHVybiBgJHt0aGlzLm5hbWV9KC4uLmFyZ3M6IGFueVtdKTtgXHJcbiAgICAgICAgICAgIGNhc2UgJ3BhcmVudFRoYXRJc0EnOiByZXR1cm4gYCR7dGhpcy5uYW1lfSguLi5hcmdzOiBhbnlbXSk7YFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufSIsIi8vIGltcG9ydCB7IEV2ZW50cywgRXh0ZW5zaW9uTWFuYWdlciB9IGZyb20gXCJzZWZcIjtcclxuaW1wb3J0IHsgQmxvY2tNb3JwaCwgQ2xvdWQsIElERV9Nb3JwaCwgU3ByaXRlTW9ycGgsIFN0YWdlTW9ycGgsIFdvcmxkTW9ycGggfSBmcm9tIFwiLi9TbmFwXCI7XHJcbmltcG9ydCB7IEJsb2NrSURBcmdzIH0gZnJvbSBcIi4uL2V2ZW50cy9TbmFwRXZlbnRMaXN0ZW5lclwiO1xyXG5cclxuXHJcbi8vIFRPRE86IE1ha2UgYW4gaW50ZXJmYWNlIHdpdGggYW4gaW1wbGVtZW50YXRpb24gdGhhdCBmZXRjaGVzIGZyb20gd2luZG93XHJcbmV4cG9ydCBjbGFzcyBTbmFwIHtcclxuXHJcbiAgICBzdGF0aWMgbGFzdFJ1bkJsb2NrOiBCbG9ja01vcnBoO1xyXG5cclxuICAgIHN0YXRpYyBnZXQgd29ybGQoKSA6IFdvcmxkTW9ycGgge1xyXG4gICAgICAgIHJldHVybiB3aW5kb3dbXCJ3b3JsZFwiXTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IElERSgpIDogSURFX01vcnBoIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53b3JsZD8uY2hpbGRUaGF0SXNBKHdpbmRvd1snSURFX01vcnBoJ10pIGFzIElERV9Nb3JwaDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IHN0YWdlKCkgOiBTdGFnZU1vcnBoIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5JREU/LnN0YWdlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgY3VycmVudFNwcml0ZSgpIDogU3ByaXRlTW9ycGggfCBTdGFnZU1vcnBoe1xyXG4gICAgICAgIHJldHVybiB0aGlzLklERT8uY3VycmVudFNwcml0ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IHNwcml0ZXMoKSA6IFNwcml0ZU1vcnBoW10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLklERT8uc3ByaXRlcz8uY29udGVudHMgfHwgW107XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBjbG91ZCgpIDogQ2xvdWQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLklERT8uY2xvdWQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldFNwcml0ZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zcHJpdGVzLmZpbHRlcihzcHJpdGUgPT4gc3ByaXRlLm5hbWUgPT0gbmFtZSlbMF07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldEJsb2NrKGlkOiBCbG9ja0lEQXJncykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLndvcmxkLmFsbENoaWxkcmVuKClcclxuICAgICAgICAgICAgLmZpbHRlcihiID0+IGIgaW5zdGFuY2VvZiBCbG9ja01vcnBoICYmIGIuaWQgPT0gaWQuaWQpWzBdO1xyXG4gICAgfVxyXG5cclxufSIsImV4cG9ydCBjb25zdCBjb250YWlucyA9IHdpbmRvd1snY29udGFpbnMnXTtcbmV4cG9ydCBjb25zdCBjb3B5ID0gd2luZG93Wydjb3B5J107XG5leHBvcnQgY29uc3QgY29weUNhbnZhcyA9IHdpbmRvd1snY29weUNhbnZhcyddO1xuZXhwb3J0IGNvbnN0IGRlZ3JlZXMgPSB3aW5kb3dbJ2RlZ3JlZXMnXTtcbmV4cG9ydCBjb25zdCBkZXRlY3QgPSB3aW5kb3dbJ2RldGVjdCddO1xuZXhwb3J0IGNvbnN0IGRpc2FibGVSZXRpbmFTdXBwb3J0ID0gd2luZG93WydkaXNhYmxlUmV0aW5hU3VwcG9ydCddO1xuZXhwb3J0IGNvbnN0IGVtYmVkTWV0YWRhdGFQTkcgPSB3aW5kb3dbJ2VtYmVkTWV0YWRhdGFQTkcnXTtcbmV4cG9ydCBjb25zdCBlbmFibGVSZXRpbmFTdXBwb3J0ID0gd2luZG93WydlbmFibGVSZXRpbmFTdXBwb3J0J107XG5leHBvcnQgY29uc3QgZm9udEhlaWdodCA9IHdpbmRvd1snZm9udEhlaWdodCddO1xuZXhwb3J0IGNvbnN0IGdldERvY3VtZW50UG9zaXRpb25PZiA9IHdpbmRvd1snZ2V0RG9jdW1lbnRQb3NpdGlvbk9mJ107XG5leHBvcnQgY29uc3QgZ2V0TWluaW11bUZvbnRIZWlnaHQgPSB3aW5kb3dbJ2dldE1pbmltdW1Gb250SGVpZ2h0J107XG5leHBvcnQgY29uc3QgZ2V0U0VGQ29uZmlnID0gd2luZG93WydnZXRTRUZDb25maWcnXTtcbmV4cG9ydCBjb25zdCBoZXhfc2hhNTEyID0gd2luZG93WydoZXhfc2hhNTEyJ107XG5leHBvcnQgY29uc3QgaW52b2tlID0gd2luZG93WydpbnZva2UnXTtcbmV4cG9ydCBjb25zdCBpc05pbCA9IHdpbmRvd1snaXNOaWwnXTtcbmV4cG9ydCBjb25zdCBpc09iamVjdCA9IHdpbmRvd1snaXNPYmplY3QnXTtcbmV4cG9ydCBjb25zdCBpc1JldGluYUVuYWJsZWQgPSB3aW5kb3dbJ2lzUmV0aW5hRW5hYmxlZCddO1xuZXhwb3J0IGNvbnN0IGlzUmV0aW5hU3VwcG9ydGVkID0gd2luZG93Wydpc1JldGluYVN1cHBvcnRlZCddO1xuZXhwb3J0IGNvbnN0IGlzU25hcE9iamVjdCA9IHdpbmRvd1snaXNTbmFwT2JqZWN0J107XG5leHBvcnQgY29uc3QgaXNTdHJpbmcgPSB3aW5kb3dbJ2lzU3RyaW5nJ107XG5leHBvcnQgY29uc3QgaXNVUkwgPSB3aW5kb3dbJ2lzVVJMJ107XG5leHBvcnQgY29uc3QgaXNVUkxDaGFyID0gd2luZG93Wydpc1VSTENoYXInXTtcbmV4cG9ydCBjb25zdCBpc1dvcmRDaGFyID0gd2luZG93Wydpc1dvcmRDaGFyJ107XG5leHBvcnQgY29uc3QgbG9jYWxpemUgPSB3aW5kb3dbJ2xvY2FsaXplJ107XG5leHBvcnQgY29uc3QgbSA9IHdpbmRvd1snbSddO1xuZXhwb3J0IGNvbnN0IG5ld0NhbnZhcyA9IHdpbmRvd1snbmV3Q2FudmFzJ107XG5leHBvcnQgY29uc3QgbmV3R3VpZCA9IHdpbmRvd1snbmV3R3VpZCddO1xuZXhwb3J0IGNvbnN0IG5vcCA9IHdpbmRvd1snbm9wJ107XG5leHBvcnQgY29uc3Qgbm9ybWFsaXplQ2FudmFzID0gd2luZG93Wydub3JtYWxpemVDYW52YXMnXTtcbmV4cG9ydCBjb25zdCByYWRpYW5zID0gd2luZG93WydyYWRpYW5zJ107XG5leHBvcnQgY29uc3Qgc2l6ZU9mID0gd2luZG93WydzaXplT2YnXTtcbmV4cG9ydCBjb25zdCBTbmFwID0gd2luZG93WydTbmFwJ107XG5leHBvcnQgY29uc3Qgc25hcEVxdWFscyA9IHdpbmRvd1snc25hcEVxdWFscyddO1xuZXhwb3J0IGNvbnN0IEFsaWdubWVudE1vcnBoID0gd2luZG93WydBbGlnbm1lbnRNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEFuaW1hdGlvbiA9IHdpbmRvd1snQW5pbWF0aW9uJ107XG5leHBvcnQgY29uc3QgQXJnTGFiZWxNb3JwaCA9IHdpbmRvd1snQXJnTGFiZWxNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEFyZ01vcnBoID0gd2luZG93WydBcmdNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEFycm93TW9ycGggPSB3aW5kb3dbJ0Fycm93TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBCbGlua2VyTW9ycGggPSB3aW5kb3dbJ0JsaW5rZXJNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEJsb2NrRGlhbG9nTW9ycGggPSB3aW5kb3dbJ0Jsb2NrRGlhbG9nTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBCbG9ja0VkaXRvck1vcnBoID0gd2luZG93WydCbG9ja0VkaXRvck1vcnBoJ107XG5leHBvcnQgY29uc3QgQmxvY2tFeHBvcnREaWFsb2dNb3JwaCA9IHdpbmRvd1snQmxvY2tFeHBvcnREaWFsb2dNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEJsb2NrSGlnaGxpZ2h0TW9ycGggPSB3aW5kb3dbJ0Jsb2NrSGlnaGxpZ2h0TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBCbG9ja0ltcG9ydERpYWxvZ01vcnBoID0gd2luZG93WydCbG9ja0ltcG9ydERpYWxvZ01vcnBoJ107XG5leHBvcnQgY29uc3QgQmxvY2tJbnB1dEZyYWdtZW50TW9ycGggPSB3aW5kb3dbJ0Jsb2NrSW5wdXRGcmFnbWVudE1vcnBoJ107XG5leHBvcnQgY29uc3QgQmxvY2tMYWJlbEZyYWdtZW50ID0gd2luZG93WydCbG9ja0xhYmVsRnJhZ21lbnQnXTtcbmV4cG9ydCBjb25zdCBCbG9ja0xhYmVsRnJhZ21lbnRNb3JwaCA9IHdpbmRvd1snQmxvY2tMYWJlbEZyYWdtZW50TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBCbG9ja0xhYmVsTW9ycGggPSB3aW5kb3dbJ0Jsb2NrTGFiZWxNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEJsb2NrTGFiZWxQbGFjZUhvbGRlck1vcnBoID0gd2luZG93WydCbG9ja0xhYmVsUGxhY2VIb2xkZXJNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEJsb2NrTW9ycGggPSB3aW5kb3dbJ0Jsb2NrTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBCbG9ja1JlbW92YWxEaWFsb2dNb3JwaCA9IHdpbmRvd1snQmxvY2tSZW1vdmFsRGlhbG9nTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBCbG9ja1N5bWJvbE1vcnBoID0gd2luZG93WydCbG9ja1N5bWJvbE1vcnBoJ107XG5leHBvcnQgY29uc3QgQmxvY2tWaXNpYmlsaXR5RGlhbG9nTW9ycGggPSB3aW5kb3dbJ0Jsb2NrVmlzaWJpbGl0eURpYWxvZ01vcnBoJ107XG5leHBvcnQgY29uc3QgQm9vbGVhblNsb3RNb3JwaCA9IHdpbmRvd1snQm9vbGVhblNsb3RNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEJvdW5jZXJNb3JwaCA9IHdpbmRvd1snQm91bmNlck1vcnBoJ107XG5leHBvcnQgY29uc3QgQm94TW9ycGggPSB3aW5kb3dbJ0JveE1vcnBoJ107XG5leHBvcnQgY29uc3QgQ2FtU25hcHNob3REaWFsb2dNb3JwaCA9IHdpbmRvd1snQ2FtU25hcHNob3REaWFsb2dNb3JwaCddO1xuZXhwb3J0IGNvbnN0IENlbGxNb3JwaCA9IHdpbmRvd1snQ2VsbE1vcnBoJ107XG5leHBvcnQgY29uc3QgQ2lyY2xlQm94TW9ycGggPSB3aW5kb3dbJ0NpcmNsZUJveE1vcnBoJ107XG5leHBvcnQgY29uc3QgQ2xvdWQgPSB3aW5kb3dbJ0Nsb3VkJ107XG5leHBvcnQgY29uc3QgQ29sb3IgPSB3aW5kb3dbJ0NvbG9yJ107XG5leHBvcnQgY29uc3QgQ29sb3JQYWxldHRlTW9ycGggPSB3aW5kb3dbJ0NvbG9yUGFsZXR0ZU1vcnBoJ107XG5leHBvcnQgY29uc3QgQ29sb3JQaWNrZXJNb3JwaCA9IHdpbmRvd1snQ29sb3JQaWNrZXJNb3JwaCddO1xuZXhwb3J0IGNvbnN0IENvbG9yU2xvdE1vcnBoID0gd2luZG93WydDb2xvclNsb3RNb3JwaCddO1xuZXhwb3J0IGNvbnN0IENvbW1hbmRCbG9ja01vcnBoID0gd2luZG93WydDb21tYW5kQmxvY2tNb3JwaCddO1xuZXhwb3J0IGNvbnN0IENvbW1hbmRTbG90TW9ycGggPSB3aW5kb3dbJ0NvbW1hbmRTbG90TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBDb21tZW50TW9ycGggPSB3aW5kb3dbJ0NvbW1lbnRNb3JwaCddO1xuZXhwb3J0IGNvbnN0IENvbnRleHQgPSB3aW5kb3dbJ0NvbnRleHQnXTtcbmV4cG9ydCBjb25zdCBDb3N0dW1lID0gd2luZG93WydDb3N0dW1lJ107XG5leHBvcnQgY29uc3QgQ29zdHVtZUVkaXRvck1vcnBoID0gd2luZG93WydDb3N0dW1lRWRpdG9yTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBDb3N0dW1lSWNvbk1vcnBoID0gd2luZG93WydDb3N0dW1lSWNvbk1vcnBoJ107XG5leHBvcnQgY29uc3QgQ3Jvc3NoYWlyID0gd2luZG93WydDcm9zc2hhaXInXTtcbmV4cG9ydCBjb25zdCBDU2xvdE1vcnBoID0gd2luZG93WydDU2xvdE1vcnBoJ107XG5leHBvcnQgY29uc3QgQ3Vyc29yTW9ycGggPSB3aW5kb3dbJ0N1cnNvck1vcnBoJ107XG5leHBvcnQgY29uc3QgQ3VzdG9tQmxvY2tEZWZpbml0aW9uID0gd2luZG93WydDdXN0b21CbG9ja0RlZmluaXRpb24nXTtcbmV4cG9ydCBjb25zdCBDdXN0b21Db21tYW5kQmxvY2tNb3JwaCA9IHdpbmRvd1snQ3VzdG9tQ29tbWFuZEJsb2NrTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBDdXN0b21SZXBvcnRlckJsb2NrTW9ycGggPSB3aW5kb3dbJ0N1c3RvbVJlcG9ydGVyQmxvY2tNb3JwaCddO1xuZXhwb3J0IGNvbnN0IERpYWxNb3JwaCA9IHdpbmRvd1snRGlhbE1vcnBoJ107XG5leHBvcnQgY29uc3QgRGlhbG9nQm94TW9ycGggPSB3aW5kb3dbJ0RpYWxvZ0JveE1vcnBoJ107XG5leHBvcnQgY29uc3QgRnJhbWVNb3JwaCA9IHdpbmRvd1snRnJhbWVNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEZ1bmN0aW9uU2xvdE1vcnBoID0gd2luZG93WydGdW5jdGlvblNsb3RNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEdyYXlQYWxldHRlTW9ycGggPSB3aW5kb3dbJ0dyYXlQYWxldHRlTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBIYW5kbGVNb3JwaCA9IHdpbmRvd1snSGFuZGxlTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBIYW5kTW9ycGggPSB3aW5kb3dbJ0hhbmRNb3JwaCddO1xuZXhwb3J0IGNvbnN0IEhhdEJsb2NrTW9ycGggPSB3aW5kb3dbJ0hhdEJsb2NrTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBJREVfTW9ycGggPSB3aW5kb3dbJ0lERV9Nb3JwaCddO1xuZXhwb3J0IGNvbnN0IElucHV0RmllbGRNb3JwaCA9IHdpbmRvd1snSW5wdXRGaWVsZE1vcnBoJ107XG5leHBvcnQgY29uc3QgSW5wdXRTbG90RGlhbG9nTW9ycGggPSB3aW5kb3dbJ0lucHV0U2xvdERpYWxvZ01vcnBoJ107XG5leHBvcnQgY29uc3QgSW5wdXRTbG90TW9ycGggPSB3aW5kb3dbJ0lucHV0U2xvdE1vcnBoJ107XG5leHBvcnQgY29uc3QgSW5wdXRTbG90U3RyaW5nTW9ycGggPSB3aW5kb3dbJ0lucHV0U2xvdFN0cmluZ01vcnBoJ107XG5leHBvcnQgY29uc3QgSW5wdXRTbG90VGV4dE1vcnBoID0gd2luZG93WydJbnB1dFNsb3RUZXh0TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBJbnNwZWN0b3JNb3JwaCA9IHdpbmRvd1snSW5zcGVjdG9yTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBKYWdnZWRCbG9ja01vcnBoID0gd2luZG93WydKYWdnZWRCbG9ja01vcnBoJ107XG5leHBvcnQgY29uc3QgSlNDb21waWxlciA9IHdpbmRvd1snSlNDb21waWxlciddO1xuZXhwb3J0IGNvbnN0IEp1a2Vib3hNb3JwaCA9IHdpbmRvd1snSnVrZWJveE1vcnBoJ107XG5leHBvcnQgY29uc3QgTGlicmFyeUltcG9ydERpYWxvZ01vcnBoID0gd2luZG93WydMaWJyYXJ5SW1wb3J0RGlhbG9nTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBMaXN0ID0gd2luZG93WydMaXN0J107XG5leHBvcnQgY29uc3QgTGlzdE1vcnBoID0gd2luZG93WydMaXN0TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBMaXN0V2F0Y2hlck1vcnBoID0gd2luZG93WydMaXN0V2F0Y2hlck1vcnBoJ107XG5leHBvcnQgY29uc3QgTG9jYWxpemVyID0gd2luZG93WydMb2NhbGl6ZXInXTtcbmV4cG9ydCBjb25zdCBNZW51SXRlbU1vcnBoID0gd2luZG93WydNZW51SXRlbU1vcnBoJ107XG5leHBvcnQgY29uc3QgTWVudU1vcnBoID0gd2luZG93WydNZW51TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBNaWNyb3Bob25lID0gd2luZG93WydNaWNyb3Bob25lJ107XG5leHBvcnQgY29uc3QgTW9ycGggPSB3aW5kb3dbJ01vcnBoJ107XG5leHBvcnQgY29uc3QgTW91c2VTZW5zb3JNb3JwaCA9IHdpbmRvd1snTW91c2VTZW5zb3JNb3JwaCddO1xuZXhwb3J0IGNvbnN0IE11bHRpQXJnTW9ycGggPSB3aW5kb3dbJ011bHRpQXJnTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBOb2RlID0gd2luZG93WydOb2RlJ107XG5leHBvcnQgY29uc3QgTm90ZSA9IHdpbmRvd1snTm90ZSddO1xuZXhwb3J0IGNvbnN0IFBhaW50Q2FudmFzTW9ycGggPSB3aW5kb3dbJ1BhaW50Q2FudmFzTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBQYWludENvbG9yUGlja2VyTW9ycGggPSB3aW5kb3dbJ1BhaW50Q29sb3JQaWNrZXJNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFBhaW50RWRpdG9yTW9ycGggPSB3aW5kb3dbJ1BhaW50RWRpdG9yTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBQYWxldHRlSGFuZGxlTW9ycGggPSB3aW5kb3dbJ1BhbGV0dGVIYW5kbGVNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFBlbk1vcnBoID0gd2luZG93WydQZW5Nb3JwaCddO1xuZXhwb3J0IGNvbnN0IFBpYW5vS2V5TW9ycGggPSB3aW5kb3dbJ1BpYW5vS2V5TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBQaWFub01lbnVNb3JwaCA9IHdpbmRvd1snUGlhbm9NZW51TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBQb2ludCA9IHdpbmRvd1snUG9pbnQnXTtcbmV4cG9ydCBjb25zdCBQcm9jZXNzID0gd2luZG93WydQcm9jZXNzJ107XG5leHBvcnQgY29uc3QgUHJvamVjdCA9IHdpbmRvd1snUHJvamVjdCddO1xuZXhwb3J0IGNvbnN0IFByb2plY3REaWFsb2dNb3JwaCA9IHdpbmRvd1snUHJvamVjdERpYWxvZ01vcnBoJ107XG5leHBvcnQgY29uc3QgUHJvamVjdFJlY292ZXJ5RGlhbG9nTW9ycGggPSB3aW5kb3dbJ1Byb2plY3RSZWNvdmVyeURpYWxvZ01vcnBoJ107XG5leHBvcnQgY29uc3QgUHJvdG90eXBlSGF0QmxvY2tNb3JwaCA9IHdpbmRvd1snUHJvdG90eXBlSGF0QmxvY2tNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFB1c2hCdXR0b25Nb3JwaCA9IHdpbmRvd1snUHVzaEJ1dHRvbk1vcnBoJ107XG5leHBvcnQgY29uc3QgUmVhZFN0cmVhbSA9IHdpbmRvd1snUmVhZFN0cmVhbSddO1xuZXhwb3J0IGNvbnN0IFJlY3RhbmdsZSA9IHdpbmRvd1snUmVjdGFuZ2xlJ107XG5leHBvcnQgY29uc3QgUmVwb3J0ZXJCbG9ja01vcnBoID0gd2luZG93WydSZXBvcnRlckJsb2NrTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBSZXBvcnRlclNsb3RNb3JwaCA9IHdpbmRvd1snUmVwb3J0ZXJTbG90TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBSaW5nQ29tbWFuZFNsb3RNb3JwaCA9IHdpbmRvd1snUmluZ0NvbW1hbmRTbG90TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBSaW5nTW9ycGggPSB3aW5kb3dbJ1JpbmdNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFJpbmdSZXBvcnRlclNsb3RNb3JwaCA9IHdpbmRvd1snUmluZ1JlcG9ydGVyU2xvdE1vcnBoJ107XG5leHBvcnQgY29uc3QgU2NlbmUgPSB3aW5kb3dbJ1NjZW5lJ107XG5leHBvcnQgY29uc3QgU2NlbmVBbGJ1bU1vcnBoID0gd2luZG93WydTY2VuZUFsYnVtTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBTY2VuZUljb25Nb3JwaCA9IHdpbmRvd1snU2NlbmVJY29uTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBTY3JpcHRGb2N1c01vcnBoID0gd2luZG93WydTY3JpcHRGb2N1c01vcnBoJ107XG5leHBvcnQgY29uc3QgU2NyaXB0c01vcnBoID0gd2luZG93WydTY3JpcHRzTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBTY3JvbGxGcmFtZU1vcnBoID0gd2luZG93WydTY3JvbGxGcmFtZU1vcnBoJ107XG5leHBvcnQgY29uc3QgU2hhZG93TW9ycGggPSB3aW5kb3dbJ1NoYWRvd01vcnBoJ107XG5leHBvcnQgY29uc3QgU2xpZGVyQnV0dG9uTW9ycGggPSB3aW5kb3dbJ1NsaWRlckJ1dHRvbk1vcnBoJ107XG5leHBvcnQgY29uc3QgU2xpZGVyTW9ycGggPSB3aW5kb3dbJ1NsaWRlck1vcnBoJ107XG5leHBvcnQgY29uc3QgU25hcEV2ZW50TWFuYWdlciA9IHdpbmRvd1snU25hcEV2ZW50TWFuYWdlciddO1xuZXhwb3J0IGNvbnN0IFNuYXBTZXJpYWxpemVyID0gd2luZG93WydTbmFwU2VyaWFsaXplciddO1xuZXhwb3J0IGNvbnN0IFNvdW5kID0gd2luZG93WydTb3VuZCddO1xuZXhwb3J0IGNvbnN0IFNvdW5kSWNvbk1vcnBoID0gd2luZG93WydTb3VuZEljb25Nb3JwaCddO1xuZXhwb3J0IGNvbnN0IFNvdW5kUmVjb3JkZXJEaWFsb2dNb3JwaCA9IHdpbmRvd1snU291bmRSZWNvcmRlckRpYWxvZ01vcnBoJ107XG5leHBvcnQgY29uc3QgU3BlZWNoQnViYmxlTW9ycGggPSB3aW5kb3dbJ1NwZWVjaEJ1YmJsZU1vcnBoJ107XG5leHBvcnQgY29uc3QgU3ByaXRlQnViYmxlTW9ycGggPSB3aW5kb3dbJ1Nwcml0ZUJ1YmJsZU1vcnBoJ107XG5leHBvcnQgY29uc3QgU3ByaXRlSGlnaGxpZ2h0TW9ycGggPSB3aW5kb3dbJ1Nwcml0ZUhpZ2hsaWdodE1vcnBoJ107XG5leHBvcnQgY29uc3QgU3ByaXRlSWNvbk1vcnBoID0gd2luZG93WydTcHJpdGVJY29uTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBTcHJpdGVNb3JwaCA9IHdpbmRvd1snU3ByaXRlTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBTdGFnZUhhbmRsZU1vcnBoID0gd2luZG93WydTdGFnZUhhbmRsZU1vcnBoJ107XG5leHBvcnQgY29uc3QgU3RhZ2VNb3JwaCA9IHdpbmRvd1snU3RhZ2VNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFN0YWdlUGlja2VySXRlbU1vcnBoID0gd2luZG93WydTdGFnZVBpY2tlckl0ZW1Nb3JwaCddO1xuZXhwb3J0IGNvbnN0IFN0YWdlUGlja2VyTW9ycGggPSB3aW5kb3dbJ1N0YWdlUGlja2VyTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBTdGFnZVByb21wdGVyTW9ycGggPSB3aW5kb3dbJ1N0YWdlUHJvbXB0ZXJNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFN0cmluZ0ZpZWxkTW9ycGggPSB3aW5kb3dbJ1N0cmluZ0ZpZWxkTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBTdHJpbmdNb3JwaCA9IHdpbmRvd1snU3RyaW5nTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBTVkdfQ29zdHVtZSA9IHdpbmRvd1snU1ZHX0Nvc3R1bWUnXTtcbmV4cG9ydCBjb25zdCBTeW1ib2xNb3JwaCA9IHdpbmRvd1snU3ltYm9sTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBTeW50YXhFbGVtZW50TW9ycGggPSB3aW5kb3dbJ1N5bnRheEVsZW1lbnRNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFRhYmxlID0gd2luZG93WydUYWJsZSddO1xuZXhwb3J0IGNvbnN0IFRhYmxlQ2VsbE1vcnBoID0gd2luZG93WydUYWJsZUNlbGxNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFRhYmxlRGlhbG9nTW9ycGggPSB3aW5kb3dbJ1RhYmxlRGlhbG9nTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBUYWJsZUZyYW1lTW9ycGggPSB3aW5kb3dbJ1RhYmxlRnJhbWVNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFRhYmxlTW9ycGggPSB3aW5kb3dbJ1RhYmxlTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBUYWJNb3JwaCA9IHdpbmRvd1snVGFiTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBUZW1wbGF0ZVNsb3RNb3JwaCA9IHdpbmRvd1snVGVtcGxhdGVTbG90TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBUZXh0TW9ycGggPSB3aW5kb3dbJ1RleHRNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFRleHRTbG90TW9ycGggPSB3aW5kb3dbJ1RleHRTbG90TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBUaHJlYWRNYW5hZ2VyID0gd2luZG93WydUaHJlYWRNYW5hZ2VyJ107XG5leHBvcnQgY29uc3QgVG9nZ2xlQnV0dG9uTW9ycGggPSB3aW5kb3dbJ1RvZ2dsZUJ1dHRvbk1vcnBoJ107XG5leHBvcnQgY29uc3QgVG9nZ2xlRWxlbWVudE1vcnBoID0gd2luZG93WydUb2dnbGVFbGVtZW50TW9ycGgnXTtcbmV4cG9ydCBjb25zdCBUb2dnbGVNb3JwaCA9IHdpbmRvd1snVG9nZ2xlTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBUcmlnZ2VyTW9ycGggPSB3aW5kb3dbJ1RyaWdnZXJNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFR1cnRsZUljb25Nb3JwaCA9IHdpbmRvd1snVHVydGxlSWNvbk1vcnBoJ107XG5leHBvcnQgY29uc3QgVmFyaWFibGUgPSB3aW5kb3dbJ1ZhcmlhYmxlJ107XG5leHBvcnQgY29uc3QgVmFyaWFibGVEaWFsb2dNb3JwaCA9IHdpbmRvd1snVmFyaWFibGVEaWFsb2dNb3JwaCddO1xuZXhwb3J0IGNvbnN0IFZhcmlhYmxlRnJhbWUgPSB3aW5kb3dbJ1ZhcmlhYmxlRnJhbWUnXTtcbmV4cG9ydCBjb25zdCBWZWN0b3JFbGxpcHNlID0gd2luZG93WydWZWN0b3JFbGxpcHNlJ107XG5leHBvcnQgY29uc3QgVmVjdG9yTGluZSA9IHdpbmRvd1snVmVjdG9yTGluZSddO1xuZXhwb3J0IGNvbnN0IFZlY3RvclBhaW50Q2FudmFzTW9ycGggPSB3aW5kb3dbJ1ZlY3RvclBhaW50Q2FudmFzTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBWZWN0b3JQYWludEVkaXRvck1vcnBoID0gd2luZG93WydWZWN0b3JQYWludEVkaXRvck1vcnBoJ107XG5leHBvcnQgY29uc3QgVmVjdG9yUG9seWdvbiA9IHdpbmRvd1snVmVjdG9yUG9seWdvbiddO1xuZXhwb3J0IGNvbnN0IFZlY3RvclJlY3RhbmdsZSA9IHdpbmRvd1snVmVjdG9yUmVjdGFuZ2xlJ107XG5leHBvcnQgY29uc3QgVmVjdG9yU2VsZWN0aW9uID0gd2luZG93WydWZWN0b3JTZWxlY3Rpb24nXTtcbmV4cG9ydCBjb25zdCBWZWN0b3JTaGFwZSA9IHdpbmRvd1snVmVjdG9yU2hhcGUnXTtcbmV4cG9ydCBjb25zdCBWaWRlb01vdGlvbiA9IHdpbmRvd1snVmlkZW9Nb3Rpb24nXTtcbmV4cG9ydCBjb25zdCBXYXJkcm9iZU1vcnBoID0gd2luZG93WydXYXJkcm9iZU1vcnBoJ107XG5leHBvcnQgY29uc3QgV2F0Y2hlck1vcnBoID0gd2luZG93WydXYXRjaGVyTW9ycGgnXTtcbmV4cG9ydCBjb25zdCBXb3JsZE1hcCA9IHdpbmRvd1snV29ybGRNYXAnXTtcbmV4cG9ydCBjb25zdCBXb3JsZE1vcnBoID0gd2luZG93WydXb3JsZE1vcnBoJ107XG5leHBvcnQgY29uc3QgWE1MX0VsZW1lbnQgPSB3aW5kb3dbJ1hNTF9FbGVtZW50J107XG5leHBvcnQgY29uc3QgWE1MX1NlcmlhbGl6ZXIgPSB3aW5kb3dbJ1hNTF9TZXJpYWxpemVyJ107IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBCbG9ja3MgfSBmcm9tIFwiLi9ibG9ja3MvQmxvY2tGYWN0b3J5XCI7XHJcbmltcG9ydCB7IEV2ZW50TWFuYWdlciB9IGZyb20gXCIuL2V2ZW50cy9FdmVudE1hbmFnZXJcIjtcclxuaW1wb3J0IHsgRXh0ZW5zaW9uIH0gZnJvbSBcIi4vZXh0ZW5zaW9uL0V4dGVuc2lvblwiO1xyXG5pbXBvcnQgeyBFeHRlbnNpb25NYW5hZ2VyIH0gZnJvbSBcIi4vZXh0ZW5zaW9uL0V4dGVuc2lvbk1hbmFnZXJcIjtcclxuaW1wb3J0IHsgRGVmR2VuZXJhdG9yIH0gZnJvbSBcIi4vbWV0YS9EZWZHZW5lcmF0b3JcIjtcclxuaW1wb3J0IHsgU25hcCB9IGZyb20gXCIuL3NuYXAvU25hcFV0aWxzXCI7XHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuL2V2ZW50cy9TbmFwRXZlbnRzXCI7XHJcbmltcG9ydCB7IE92ZXJyaWRlUmVnaXN0cnkgfSBmcm9tIFwiLi9leHRlbmQvT3ZlcnJpZGVSZWdpc3RyeVwiO1xyXG5pbXBvcnQgeyBDbG91ZCB9IGZyb20gXCIuL2lvL0Nsb3VkVXRpbHNcIjtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgLy8gU25hcCBpcyBsb2FkZWQgYWZ0ZXIgdGhlIHdpbmRvd1xyXG4gICAgICAgIEV4dGVuc2lvbk1hbmFnZXIuaW5pdCgpO1xyXG4gICAgfSwgMCk7XHJcbn0pXHJcblxyXG4vLyBGb3IgY29udmVuaWVuY2UsIG1ha2Ugc25hcCBnbG9iYWxcclxud2luZG93WydTbmFwJ10gPSBTbmFwO1xyXG5cclxuLy8gRXZlcnl0aGluZyBlbHNlIGNhbiBiZSBhY2Nlc3NlZCB2aWEgbGlicmFyeSB3aXRoXHJcbi8vIFNFRi5YWFhcclxuZXhwb3J0IHtcclxuICAgIEJsb2NrcyxcclxuICAgIENsb3VkLFxyXG4gICAgRGVmR2VuZXJhdG9yLFxyXG4gICAgRXZlbnRNYW5hZ2VyLFxyXG4gICAgRXZlbnRzLFxyXG4gICAgRXh0ZW5zaW9uLFxyXG4gICAgRXh0ZW5zaW9uTWFuYWdlcixcclxuICAgIE92ZXJyaWRlUmVnaXN0cnksXHJcbiAgICBTbmFwLFxyXG59O1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=