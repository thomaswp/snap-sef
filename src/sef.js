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
            }, 200);
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
exports.OverrideRegistry = void 0;
class OverrideRegistry {
    static extend(clazz, functionName, newFunction, countArgs = true) {
        if (!clazz || !clazz.prototype) {
            // eslint-disable-next-line no-console
            console.error('extend requires a class for its first argument');
            return;
        }
        return OverrideRegistry.extendObject(clazz.prototype, functionName, newFunction, countArgs);
    }
    static after(clazz, functionName, doAfter) {
        OverrideRegistry.wrap(clazz, functionName, null, doAfter);
    }
    static before(clazz, functionName, doBefore) {
        OverrideRegistry.wrap(clazz, functionName, doBefore, null);
    }
    static wrap(clazz, functionName, doBefore, doAfter) {
        function override(base) {
            let args = [...arguments].slice(1);
            if (doBefore)
                doBefore.apply(this, args);
            base.apply(this, args);
            if (doAfter)
                doAfter.apply(this, args);
        }
        OverrideRegistry.extend(clazz, functionName, override, false);
    }
    static extendObject(object, functionName, newFunction, countArgs = true) {
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
    }
    outputExports() {
        return [...this.classes.values()].map(c => c.exportStatement()).join('\n');
    }
    outputDefinitions() {
        return `
export class SnapType {
    prototype: any;
    [key: string]: any;
}\n\n` + [...this.classes.values()].map(c => c.toTS()).join('\n\n');
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
        var fnStr = func.toString().replace(Method.STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(Method.ARGUMENT_NAMES);
        if (result === null)
            result = [];
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
/* harmony export */   loop: () => (/* binding */ loop),
/* harmony export */   m: () => (/* binding */ m),
/* harmony export */   newCanvas: () => (/* binding */ newCanvas),
/* harmony export */   newGuid: () => (/* binding */ newGuid),
/* harmony export */   nop: () => (/* binding */ nop),
/* harmony export */   normalizeCanvas: () => (/* binding */ normalizeCanvas),
/* harmony export */   radians: () => (/* binding */ radians),
/* harmony export */   sizeOf: () => (/* binding */ sizeOf),
/* harmony export */   snapEquals: () => (/* binding */ snapEquals)
/* harmony export */ });
const nop = window['nop'];
const newGuid = window['newGuid'];
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
const SnapEventManager = window['SnapEventManager'];
const hex_sha512 = window['hex_sha512'];
const m = window['m'];
const loop = window['loop'];

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
// For convenience, make snap and the EM global
window['Snap'] = SnapUtils_1.Snap;
window['ExtensionManager'] = ExtensionManager_1.ExtensionManager;

})();

SEF = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEUsQ0FBQztDQUVKO0FBckNELG9CQXFDQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0NNO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7VUM3TFA7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7O0FDTkEsd0dBQStDO0FBc0IzQyx3RkF0QksscUJBQU0sUUFzQkw7QUFyQlYsd0dBQXFEO0FBd0JqRCw4RkF4QkssMkJBQVksUUF3Qkw7QUF2QmhCLHFHQUFrRDtBQXlCOUMsMkZBekJLLHFCQUFTLFFBeUJMO0FBeEJiLDBIQUFnRTtBQXlCNUQsa0dBekJLLG1DQUFnQixRQXlCTDtBQXhCcEIsb0dBQW1EO0FBb0IvQyw4RkFwQkssMkJBQVksUUFvQkw7QUFuQmhCLDJGQUF3QztBQXlCcEMsc0ZBekJLLGdCQUFJLFFBeUJMO0FBeEJSLGtHQUE2QztBQW9CekMsd0ZBcEJLLG1CQUFNLFFBb0JMO0FBbkJWLG9IQUE2RDtBQXNCekQsa0dBdEJLLG1DQUFnQixRQXNCTDtBQXJCcEIsMEZBQXdDO0FBZXBDLHVGQWZLLGtCQUFLLFFBZUw7QUFiVCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtJQUNqQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ1osa0NBQWtDO1FBQ2xDLG1DQUFnQixDQUFDLElBQUksRUFBRSxDQUFDO0lBQzVCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNWLENBQUMsQ0FBQztBQUVGLCtDQUErQztBQUMvQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsZ0JBQUksQ0FBQztBQUN0QixNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBRyxtQ0FBZ0IsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1NFRi8uL3NyYy9ibG9ja3MvQmxvY2tGYWN0b3J5LnRzIiwid2VicGFjazovL1NFRi8uL3NyYy9kZXYvRGV2TW9kZS50cyIsIndlYnBhY2s6Ly9TRUYvLi9zcmMvZXZlbnRzL0V2ZW50TWFuYWdlci50cyIsIndlYnBhY2s6Ly9TRUYvLi9zcmMvZXZlbnRzL1NuYXBFdmVudExpc3RlbmVyLnRzIiwid2VicGFjazovL1NFRi8uL3NyYy9ldmVudHMvU25hcEV2ZW50cy50cyIsIndlYnBhY2s6Ly9TRUYvLi9zcmMvZXh0ZW5kL092ZXJyaWRlUmVnaXN0cnkudHMiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL2V4dGVuc2lvbi9FeHRlbnNpb24udHMiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL2V4dGVuc2lvbi9FeHRlbnNpb25NYW5hZ2VyLnRzIiwid2VicGFjazovL1NFRi8uL3NyYy9pby9DbG91ZFV0aWxzLnRzIiwid2VicGFjazovL1NFRi8uL3NyYy9tZXRhL0RlZkdlbmVyYXRvci50cyIsIndlYnBhY2s6Ly9TRUYvLi9zcmMvc25hcC9TbmFwVXRpbHMudHMiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL3NuYXAvU25hcC5qcyIsIndlYnBhY2s6Ly9TRUYvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vU0VGL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9TRUYvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9TRUYvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9TRUYvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3ZlcnJpZGVSZWdpc3RyeSB9IGZyb20gXCIuLi9leHRlbmQvT3ZlcnJpZGVSZWdpc3RyeVwiO1xyXG5pbXBvcnQgeyBTbmFwIH0gZnJvbSBcIi4uL3NuYXAvU25hcFV0aWxzXCI7XHJcbmltcG9ydCB7IENvbG9yLCBJREVfTW9ycGgsIGxvY2FsaXplLCBTcHJpdGVNb3JwaCwgU3RhZ2VNb3JwaCwgU3ludGF4RWxlbWVudE1vcnBoLCBUb2dnbGVNb3JwaCB9IGZyb20gXCIuLi9zbmFwL1NuYXBcIjtcclxuXHJcbmV4cG9ydCBuYW1lc3BhY2UgQmxvY2tzIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQmxvY2tGYWN0b3J5IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBibG9ja3M6IEJsb2NrW107XHJcbiAgICAgICAgcHJpdmF0ZSBjYXRlZ29yaWVzID0gW10gYXMgeyBuYW1lOiBzdHJpbmcsIGNvbG9yOiBDb2xvciB9W107XHJcbiAgICAgICAgcHJpdmF0ZSBuZWVkc0luaXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYmxvY2tzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMubmVlZHNJbml0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNvbnN0IG15QmxvY2tzID0gdGhpcy5ibG9ja3M7XHJcbiAgICAgICAgICAgIGNvbnN0IG15Q2F0ZWdvcmllcyA9IHRoaXMuY2F0ZWdvcmllcztcclxuICAgICAgICAgICAgY29uc3QgbXlzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG92ZXJyaWRlID0gZnVuY3Rpb24oYmFzZSwgY2F0ZWdvcnk6IHN0cmluZywgYWxsOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2tzID0gYmFzZS5jYWxsKHRoaXMsIGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgICAgIGxldCBjaGVja1Nwcml0ZSA9IHRoaXMgaW5zdGFuY2VvZiBTdGFnZU1vcnBoO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFkZGVkID0gMDtcclxuICAgICAgICAgICAgICAgIG15QmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jay5jYXRlZ29yeSA9PT0gY2F0ZWdvcnkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICEoY2hlY2tTcHJpdGUgJiYgYmxvY2suc3ByaXRlT25seSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrLnRvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnNwbGljZShhZGRlZCwgMCwgYmxvY2sudG9CbG9ja01vcnBoKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnNwbGljZShhZGRlZCwgMCwgYmxvY2sudG9Ub2dnbGUodGhpcykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrLnRvVG9nZ2xlKHRoaXMpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrLnRvQmxvY2tNb3JwaCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJsb2NrcztcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIE92ZXJyaWRlUmVnaXN0cnkuZXh0ZW5kKFNwcml0ZU1vcnBoLCAnaW5pdEJsb2NrcycsIGZ1bmN0aW9uKGJhc2UpIHtcclxuICAgICAgICAgICAgICAgIGJhc2UuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIG15Q2F0ZWdvcmllcy5mb3JFYWNoKGMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG15c2VsZi5hZGRDYXRlZ29yeVRvUGFsbGV0dGUoYy5uYW1lLCBjLmNvbG9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgbXlCbG9ja3MuZm9yRWFjaChibG9jayA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suYWRkVG9NYXAoU3ByaXRlTW9ycGgucHJvdG90eXBlLmJsb2Nrcyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBPdmVycmlkZVJlZ2lzdHJ5LmV4dGVuZChTcHJpdGVNb3JwaCwgJ2Jsb2NrVGVtcGxhdGVzJywgb3ZlcnJpZGUsIGZhbHNlKTtcclxuICAgICAgICAgICAgT3ZlcnJpZGVSZWdpc3RyeS5leHRlbmQoU3RhZ2VNb3JwaCwgJ2Jsb2NrVGVtcGxhdGVzJywgb3ZlcnJpZGUsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIE92ZXJyaWRlUmVnaXN0cnkuYmVmb3JlKElERV9Nb3JwaCwgJ2NyZWF0ZUNhdGVnb3JpZXMnLCBmdW5jdGlvbihiYXNlKSB7XHJcbiAgICAgICAgICAgICAgICBteUNhdGVnb3JpZXMuZm9yRWFjaChjID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBteXNlbGYuYWRkQ2F0ZWdvcnlUb1BhbGxldHRlKGMubmFtZSwgYy5jb2xvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgdGhpcy5xdWV1ZVJlZnJlc2goKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlZ2lzdGVyQmxvY2soYmxvY2s6IEJsb2NrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYmxvY2tzLnB1c2goYmxvY2spO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXVlUmVmcmVzaCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcXVldWVSZWZyZXNoKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5uZWVkc0luaXQpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5uZWVkc0luaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5uZWVkc0luaXQpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICB9LCAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlZnJlc2goKSB7XHJcbiAgICAgICAgICAgIGlmICghU25hcC5JREUpIHJldHVybjtcclxuICAgICAgICAgICAgU3ByaXRlTW9ycGgucHJvdG90eXBlLmluaXRCbG9ja3MoKTtcclxuICAgICAgICAgICAgU25hcC5JREUuZmx1c2hCbG9ja3NDYWNoZSgpO1xyXG4gICAgICAgICAgICBTbmFwLklERS5yZWZyZXNoUGFsZXR0ZSgpO1xyXG4gICAgICAgICAgICBTbmFwLklERS5jYXRlZ29yaWVzLnJlZnJlc2hFbXB0eSgpO1xyXG4gICAgICAgICAgICB0aGlzLm5lZWRzSW5pdCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBhZGRDYXRlZ29yeVRvUGFsbGV0dGUobmFtZTogc3RyaW5nLCBjb2xvcjogQ29sb3IpIHtcclxuICAgICAgICAgICAgLy8gVE9ETzogRml4IHRoaXMgc28gdGhhdCB0aGUgbGF5b3V0IHdvcmtzXHJcbiAgICAgICAgICAgIC8vIFNwcml0ZU1vcnBoLnByb3RvdHlwZS5jYXRlZ29yaWVzLnB1c2gobmFtZSk7XHJcbiAgICAgICAgICAgIC8vIFNwcml0ZU1vcnBoLnByb3RvdHlwZS5ibG9ja0NvbG9yW25hbWVdID0gY29sb3I7XHJcbiAgICAgICAgICAgIGlmICghU3ByaXRlTW9ycGgucHJvdG90eXBlLmN1c3RvbUNhdGVnb3JpZXMuaGFzKG5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICBTbmFwLklERS5hZGRQYWxldHRlQ2F0ZWdvcnkobmFtZSwgY29sb3IpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYWRkQ2F0ZWdvcnkobmFtZTogc3RyaW5nLCBjb2xvcjogQ29sb3IpIHtcclxuICAgICAgICAgICAgdGhpcy5jYXRlZ29yaWVzLnB1c2goeyBuYW1lLCBjb2xvciB9KTtcclxuICAgICAgICAgICAgdGhpcy5hZGRDYXRlZ29yeVRvUGFsbGV0dGUobmFtZSwgY29sb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYWRkTGFiZWxlZElucHV0KG5hbWU6IHN0cmluZywgb3B0aW9uczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgLi4udGFnczogSW5wdXRUYWdbXSkge1xyXG4gICAgICAgICAgICBpZiAoU3ludGF4RWxlbWVudE1vcnBoLnByb3RvdHlwZS5sYWJlbFBhcnRzW25hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYElucHV0IHR5cGUgd2l0aCBsYWJlbCAke25hbWV9IGFscmVhZHkgZXhpc3RzLmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEVuc3VyZSB0aGF0IGFsbCBzdHJpbmcgdmFsdWVzIGFyZSBhcnJheS1lbmNsb3NlZFxyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKGsgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZihvcHRpb25zW2tdKSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW2tdID0gW29wdGlvbnNba11dO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBTeW50YXhFbGVtZW50TW9ycGgucHJvdG90eXBlLmxhYmVsUGFydHNbbmFtZV0gPSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnaW5wdXQnLFxyXG4gICAgICAgICAgICAgICAgdGFnczogdGFncy5qb2luKCcgJyksXHJcbiAgICAgICAgICAgICAgICBtZW51OiBvcHRpb25zLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZW51bSBJbnB1dFRhZyB7XHJcbiAgICAgICAgLyoqIFZhbHVlcyB3aWxsIGJlIGludGVycHJldGVkIGFzIG51bWVyaWMuICovXHJcbiAgICAgICAgTnVtYmVyaWMgPSAnbnVtZXJpYycsXHJcbiAgICAgICAgUmVhZE9ubHkgPSAncmVhZC1vbmx5JyxcclxuICAgICAgICBVbmV2YWx1YXRlZCA9ICd1bmV2YWx1YXRlZCcsXHJcbiAgICAgICAgLyoqIFRoZSBpbnB1dCBjYW5ub3QgYmUgcmVwbGFjZWQgd2l0aCBhIHJlcG9ydGVyLiAqL1xyXG4gICAgICAgIFN0YXRpYyA9ICdzdGF0aWMnLFxyXG4gICAgICAgIExhbmRzY2FwZSA9ICdsYW5kc2NhcGUnLFxyXG4gICAgICAgIC8qKiBNb25vc3BhY2UgZm9udC4gKi9cclxuICAgICAgICBNb25vc3BhY2UgPSAnbW9ub3NwYWNlJyxcclxuICAgICAgICBGYWRpbmcgPSAnZmFkaW5nJyxcclxuICAgICAgICBQcm90ZWN0ZWQgPSAncHJvdGVjdGVkJyxcclxuICAgICAgICBMb29wID0gJ2xvb3AnLFxyXG4gICAgICAgIC8qKiBUaGUgaW5wdXQgaXMgYSBsYW1iZGEgZXhwcmVzc2lvbi4gKi9cclxuICAgICAgICBMYW1iZGEgPSAnbGFtYmRhJyxcclxuICAgICAgICAvKiogVGhlIGlucHV0IGlzIGVkaXRlZCB1c2luZyBhIGN1c3RvbSB3aWRnZXQuICovXHJcbiAgICAgICAgV2lkZ2V0ID0gJ3dpZGdldCdcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZW51bSBCbG9ja1R5cGUge1xyXG4gICAgICAgIENvbW1hbmQgPSAnY29tbWFuZCcsXHJcbiAgICAgICAgUmVwb3J0ZXIgPSAncmVwb3J0ZXInLFxyXG4gICAgICAgIFByZWRpY2F0ZSA9ICdwcmVkaWNhdGUnLFxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBCbG9jayB7XHJcblxyXG4gICAgICAgIHNlbGVjdG9yOiBzdHJpbmc7XHJcbiAgICAgICAgc3BlYzogc3RyaW5nO1xyXG4gICAgICAgIGRlZmF1bHRzOiBhbnlbXTtcclxuICAgICAgICB0eXBlOiBCbG9ja1R5cGU7XHJcbiAgICAgICAgY2F0ZWdvcnk6IHN0cmluZztcclxuICAgICAgICBzcHJpdGVPbmx5OiBib29sZWFuO1xyXG4gICAgICAgIHRvcDogYm9vbGVhbjtcclxuICAgICAgICB0b2dnbGFibGU6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBzZWxlY3Rvcjogc3RyaW5nLCBzcGVjOiBzdHJpbmcsIGRlZmF1bHRzOiBhbnlbXSwgdHlwZTogQmxvY2tUeXBlLFxyXG4gICAgICAgICAgICBjYXRlZ29yeTogc3RyaW5nLCBzcHJpdGVPbmx5ID0gZmFsc2UsIHRvcCA9IGZhbHNlLCB0b2dnbGFibGUgPSBmYWxzZSxcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yO1xyXG4gICAgICAgICAgICB0aGlzLnNwZWMgPSBzcGVjO1xyXG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHM7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgICAgIHRoaXMuY2F0ZWdvcnkgPSBjYXRlZ29yeTtcclxuICAgICAgICAgICAgdGhpcy5zcHJpdGVPbmx5ID0gc3ByaXRlT25seTtcclxuICAgICAgICAgICAgdGhpcy50b3AgPSB0b3A7XHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xhYmxlID0gdG9nZ2xhYmxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYWRkVG9NYXAobWFwKSB7XHJcbiAgICAgICAgICAgIG1hcFt0aGlzLnNlbGVjdG9yXSA9IHtcclxuICAgICAgICAgICAgICAgIG9ubHk6IHRoaXMuc3ByaXRlT25seSA/IFNwcml0ZU1vcnBoIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlLFxyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IHRoaXMuY2F0ZWdvcnksXHJcbiAgICAgICAgICAgICAgICBzcGVjOiBsb2NhbGl6ZSh0aGlzLnNwZWMpLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdHM6IHRoaXMuZGVmYXVsdHMsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b0Jsb2NrTW9ycGgoKSB7XHJcbiAgICAgICAgICAgIGlmIChTdGFnZU1vcnBoLnByb3RvdHlwZS5oaWRkZW5QcmltaXRpdmVzW3RoaXMuc2VsZWN0b3JdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbmV3QmxvY2sgPVxyXG4gICAgICAgICAgICAgICAgU3ByaXRlTW9ycGgucHJvdG90eXBlLmJsb2NrRm9yU2VsZWN0b3IodGhpcy5zZWxlY3RvciwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGlmICghbmV3QmxvY2spIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQ2Fubm90IGluaXRpYWxpemUgYmxvY2snLCB0aGlzLnNlbGVjdG9yKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5ld0Jsb2NrLmlzVGVtcGxhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3QmxvY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b1RvZ2dsZShzcHJpdGUgOiBTcHJpdGVNb3JwaCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudG9nZ2xhYmxlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdG9yID0gdGhpcy5zZWxlY3RvcjtcclxuICAgICAgICAgICAgaWYgKFN0YWdlTW9ycGgucHJvdG90eXBlLmhpZGRlblByaW1pdGl2ZXNbc2VsZWN0b3JdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgaW5mbyA9IFNwcml0ZU1vcnBoLnByb3RvdHlwZS5ibG9ja3Nbc2VsZWN0b3JdO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFRvZ2dsZU1vcnBoKFxyXG4gICAgICAgICAgICAgICAgJ2NoZWNrYm94JyxcclxuICAgICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlLnRvZ2dsZVdhdGNoZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGl6ZShpbmZvLnNwZWMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcHJpdGUuYmxvY2tDb2xvcltpbmZvLmNhdGVnb3J5XVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbnVsbCxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3ByaXRlLnNob3dpbmdXYXRjaGVyKHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBudWxsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhZGRTcHJpdGVBY3Rpb24oYWN0aW9uOiAoLi4uYXJncyA6IGFueSkgPT4gYW55KSA6IEJsb2NrIHtcclxuICAgICAgICAgICAgU3ByaXRlTW9ycGgucHJvdG90eXBlW3RoaXMuc2VsZWN0b3JdID1cclxuICAgICAgICAgICAgICAgIFN0YWdlTW9ycGgucHJvdG90eXBlW3RoaXMuc2VsZWN0b3JdID0gYWN0aW9uO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgRXh0ZW5zaW9uTWFuYWdlciB9IGZyb20gXCIuLi9leHRlbnNpb24vRXh0ZW5zaW9uTWFuYWdlclwiO1xyXG5pbXBvcnQgeyBTbmFwIH0gZnJvbSBcIi4uL3NuYXAvU25hcFV0aWxzXCI7XHJcblxyXG5jb25zdCBERVZfTU9ERV9VUkxTID0gW1xyXG4gICAgXCJsb2NhbGhvc3RcIixcclxuICAgIFwiMTI3LjAuMC4xXCIsXHJcbl07XHJcblxyXG5jb25zdCBERVZfTU9ERV9VUkxfUEFSQU0gPSBcImRldk1vZGVcIjtcclxuXHJcbmNvbnN0IExBU1RfUFJPSkVDVF9LRVkgPSBcImxhc3RQcm9qZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRGV2TW9kZSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiB0cnVlLCB0aGlzIG1lYW5zIHRoZSB1c2VyIGlzIHJ1bm5pbmcgdGhlIGVkaXRvciBsb2NhbGx5IG9yIGhhc1xyXG4gICAgICogc2V0IHRoZSBkZXZNb2RlIFVSTCBwYXJhbWV0ZXIgdG8gdHJ1ZS4gV2hlbiBkZXZNb2RlIGlzIGVuYWJsZWQsXHJcbiAgICAgKiB0aGUgZWRpdG9yIHdpbGwgYXV0b21hdGljYWxseSBzYXZlIHRoZSBwcm9qZWN0IHRvIGxvY2FsIHN0b3JhZ2VcclxuICAgICAqIGFmdGVyIGV2ZXJ5IGNoYW5nZSBhbmQgcmVsb2FkIGl0IG9uIHBhZ2UgbG9hZC5cclxuICAgICAqL1xyXG4gICAgcmVhZG9ubHkgaXNEZXZNb2RlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIGxhc3RQcm9qZWN0WE1MOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pc0Rldk1vZGUgPSBERVZfTU9ERV9VUkxTLnNvbWUodXJsID0+IHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzKHVybCkpO1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xyXG4gICAgICAgIGlmIChwYXJhbXMuaGFzKERFVl9NT0RFX1VSTF9QQVJBTSkpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0Rldk1vZGUgPSBwYXJhbXMuZ2V0KERFVl9NT0RFX1VSTF9QQVJBTSkgPT0gXCJ0cnVlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzRGV2TW9kZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbGFzdFByb2plY3QgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShMQVNUX1BST0pFQ1RfS0VZKTtcclxuICAgICAgICBpZiAobGFzdFByb2plY3QgJiYgbGFzdFByb2plY3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAvLyBUT0RPOiBSaWdodCBub3cgd2Ugc2V0IHRvIDEwbXMgdG8gd2FpdCB1bnRpbCBhZnRlciBibG9ja3MgYXJlXHJcbiAgICAgICAgICAgIC8vIGxvYWRlZCAtIHNob3VsZCBiZSBhIGNhbGxiYWNrIHdheSB0byBkbyBpdFxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIFNuYXAuSURFLmxvYWRQcm9qZWN0WE1MKGxhc3RQcm9qZWN0KTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTG9hZGluZyBsYXN0IHByb2plY3RcIiwgU25hcC5JREUuZ2V0UHJvamVjdE5hbWUoKSk7XHJcbiAgICAgICAgICAgIH0sIDIwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3aW5kb3cub25iZWZvcmV1bmxvYWQgPSAoKSA9PiB7fTtcclxuICAgICAgICBFeHRlbnNpb25NYW5hZ2VyLmV2ZW50cy5UcmFjZS5hZGRHbG9iYWxMaXN0ZW5lcigobWVzc2FnZSkgPT4ge1xyXG4gICAgICAgICAgICAvLyBXYWl0IGZvciBuZXh0IGZyYW1lLCBzaW5jZSBzb21lIGVkaXRzIG9jY3VyIGFmdGVyIHRoZSBsb2dcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgeG1sID0gU25hcC5JREUuZ2V0UHJvamVjdFhNTCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHhtbCAhPSB0aGlzLmxhc3RQcm9qZWN0WE1MKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0UHJvamVjdFhNTCA9IHhtbDtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShMQVNUX1BST0pFQ1RfS0VZLCB4bWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2F2ZWQgcHJvamVjdCBhZnRlcjogXCIgKyBtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuL1NuYXBFdmVudHNcIjtcclxuaW1wb3J0IHsgU25hcEV2ZW50TGlzdGVuZXIgfSBmcm9tIFwiLi9TbmFwRXZlbnRMaXN0ZW5lclwiO1xyXG5pbXBvcnQgeyBTbmFwRXZlbnRNYW5hZ2VyIH0gZnJvbSBcIi4uL3NuYXAvU25hcFwiO1xyXG5pbXBvcnQgeyBTbmFwIH0gZnJvbSBcIi4uL3NuYXAvU25hcFV0aWxzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRXZlbnRNYW5hZ2VyIHtcclxuXHJcbiAgICBUcmFjZTogU25hcEV2ZW50TWFuYWdlcjtcclxuICAgIGxpc3RlbmVyczogTWFwPHN0cmluZywgU25hcEV2ZW50TGlzdGVuZXJbXT47XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5UcmFjZSA9IHdpbmRvd1snVHJhY2UnXTtcclxuICAgICAgICBpZiAoIXRoaXMuVHJhY2UpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIEV2ZW50IE1hbmFnZXIgLSBUcmFjZSBkb2VzIG5vdCBleGlzdCEnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5UcmFjZS5hZGRHbG9iYWxMaXN0ZW5lcigobWVzc2FnZTogc3RyaW5nLCBkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVFdmVudChtZXNzYWdlLCBkYXRhKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcihuZXcgRXZlbnRzLkJsb2NrLkNsaWNrUnVuTGlzdGVuZXIoKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIFNuYXAubGFzdFJ1bkJsb2NrID0gU25hcC5nZXRCbG9jayhpZCk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlRXZlbnQobWVzc2FnZTogc3RyaW5nLCBkYXRhOiBhbnkpIHtcclxuICAgICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnMuZ2V0KG1lc3NhZ2UpO1xyXG4gICAgICAgIGlmICghbGlzdGVuZXJzKSByZXR1cm47XHJcbiAgICAgICAgbGlzdGVuZXJzLmZvckVhY2gobCA9PiB7XHJcbiAgICAgICAgICAgIGxldCBhcmdzID0gbC5jb252ZXJ0QXJncyhkYXRhKTtcclxuICAgICAgICAgICAgbC5jYWxsYmFjayhhcmdzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRMaXN0ZW5lcihsaXN0ZW5lcjogU25hcEV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgICBpZiAoIWxpc3RlbmVyKSByZXR1cm47XHJcbiAgICAgICAgbGV0IHR5cGUgPSBsaXN0ZW5lci50eXBlO1xyXG4gICAgICAgIGlmICghdGhpcy5saXN0ZW5lcnMuaGFzKHR5cGUpKSB0aGlzLmxpc3RlbmVycy5zZXQodHlwZSwgW10pO1xyXG4gICAgICAgIGxldCBsaXN0ID0gdGhpcy5saXN0ZW5lcnMuZ2V0KGxpc3RlbmVyLnR5cGUpO1xyXG4gICAgICAgIGxpc3QucHVzaChsaXN0ZW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgdGVzdCgpIHtcclxuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKG5ldyBFdmVudHMuQmxvY2suUmVuYW1lTGlzdGVuZXIoYXJncyA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFyZ3MuaWQuc2VsZWN0b3IpO1xyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKG5ldyBFdmVudHMuSW5wdXRTbG90Lk1lbnVJdGVtU2VsZWN0ZWRMaXN0ZW5lcihhcmdzID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYXJncy5pdGVtKTtcclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcihuZXcgRXZlbnRzLkJsb2NrLkNyZWF0ZWRMaXN0ZW5lcihhcmdzID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYXJncy5pZCk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIobmV3IEV2ZW50cy5JREUuQWRkU3ByaXRlTGlzdGVuZXIoYXJncyA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFyZ3MubmFtZSk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcclxuICAgIHJlYWRvbmx5IGNhbGxiYWNrOiBGdW5jdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlOiBzdHJpbmcsIGNhbGxiYWNrOiAoYXJnczogU25hcEV2ZW50QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnZlcnRBcmdzKGRhdGE6IGFueSkge1xyXG4gICAgICAgIGlmIChkYXRhID09IG51bGwpIHJldHVybiB7fTtcclxuICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSByZXR1cm4gZGF0YTtcclxuICAgICAgICBsZXQgb2JqID0ge307XHJcbiAgICAgICAgb2JqW3RoaXMuZ2V0VmFsdWVLZXkoKV0gPSBkYXRhO1xyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAndmFsdWUnOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU25hcEV2ZW50QXJncyB7XHJcblxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEVtcHR5QXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG5cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBWYWx1ZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgIHZhbHVlOiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQmxvY2tJREFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgIGlkOiBudW1iZXI7XHJcbiAgICBzZWxlY3Rvcjogc3RyaW5nO1xyXG4gICAgdGVtcGxhdGU6IGJvb2xlYW47XHJcbiAgICBzcGVjOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSW5wdXRJREFyZ3MgZXh0ZW5kcyBCbG9ja0lEQXJncyB7XHJcbiAgICBhcmdJbmRleDogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbUJsb2NrRGVmQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgc3BlYzogc3RyaW5nO1xyXG4gICAgY2F0ZWdvcnk6IHN0cmluZztcclxuICAgIHR5cGU6IHN0cmluZztcclxuICAgIGd1aWQ6IHN0cmluZztcclxuICAgIGlzR2xvYmFsOiBib29sZWFuO1xyXG59IiwiaW1wb3J0IHsgQmxvY2tJREFyZ3MsIEVtcHR5QXJncywgSW5wdXRJREFyZ3MsIEN1c3RvbUJsb2NrRGVmQXJncywgU25hcEV2ZW50QXJncywgU25hcEV2ZW50TGlzdGVuZXIsIFZhbHVlQXJncyB9IGZyb20gXCIuL1NuYXBFdmVudExpc3RlbmVyXCI7XHJcbmV4cG9ydCBuYW1lc3BhY2UgRXZlbnRzIHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgQmxvY2sge1xyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQ2xpY2tSdW5MaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2suY2xpY2tSdW4nO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKENsaWNrUnVuTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBDbGlja1N0b3BSdW5MaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2suY2xpY2tTdG9wUnVuJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEJsb2NrSURBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihDbGlja1N0b3BSdW5MaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIENyZWF0ZWRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2suY3JlYXRlZCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBCbG9ja0lEQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ3JlYXRlZExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRHJhZ0Rlc3Ryb3lMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2suZHJhZ0Rlc3Ryb3knO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKERyYWdEZXN0cm95TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR3JhYmJlZEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IEJsb2NrSURBcmdzO1xyXG4gICAgICAgICAgICBvcmlnaW46IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBHcmFiYmVkTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLmdyYWJiZWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogR3JhYmJlZEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEdyYWJiZWRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZWZhY3RvclZhckFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IEJsb2NrSURBcmdzO1xyXG4gICAgICAgICAgICBvbGROYW1lOiBhbnk7XHJcbiAgICAgICAgICAgIG5ld05hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBSZWZhY3RvclZhckxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay5yZWZhY3RvclZhcic7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBSZWZhY3RvclZhckFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFJlZmFjdG9yVmFyTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVmYWN0b3JWYXJFcnJvckFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IEJsb2NrSURBcmdzO1xyXG4gICAgICAgICAgICB3aGVyZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFJlZmFjdG9yVmFyRXJyb3JMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2sucmVmYWN0b3JWYXJFcnJvcic7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBSZWZhY3RvclZhckVycm9yQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoUmVmYWN0b3JWYXJFcnJvckxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlbGFiZWxBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlkOiBCbG9ja0lEQXJncztcclxuICAgICAgICAgICAgc2VsZWN0b3I6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBSZWxhYmVsTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLnJlbGFiZWwnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUmVsYWJlbEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFJlbGFiZWxMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZW5hbWVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlkOiBCbG9ja0lEQXJncztcclxuICAgICAgICAgICAgbmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFJlbmFtZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay5yZW5hbWUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUmVuYW1lQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoUmVuYW1lTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBSaW5naWZ5TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLnJpbmdpZnknO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFJpbmdpZnlMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNjcmlwdFBpY0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay5zY3JpcHRQaWMnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNjcmlwdFBpY0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU2hvd0hlbHBMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2suc2hvd0hlbHAnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNob3dIZWxwTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU25hcHBlZEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IEJsb2NrSURBcmdzO1xyXG4gICAgICAgICAgICBvcmlnaW46IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTbmFwcGVkTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLnNuYXBwZWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogU25hcHBlZEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNuYXBwZWRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFRvZ2dsZVRyYW5zaWVudFZhcmlhYmxlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLnRvZ2dsZVRyYW5zaWVudFZhcmlhYmxlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFZhbHVlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVG9nZ2xlVHJhbnNpZW50VmFyaWFibGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFVucmluZ2lmeUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay51bnJpbmdpZnknO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFVucmluZ2lmeUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgVXNlckRlc3Ryb3lMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2sudXNlckRlc3Ryb3knO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFVzZXJEZXN0cm95TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBCbG9ja0VkaXRvciB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBDYW5jZWxMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2tFZGl0b3IuY2FuY2VsJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEN1c3RvbUJsb2NrRGVmQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ2FuY2VsTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBDaGFuZ2VUeXBlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrRWRpdG9yLmNoYW5nZVR5cGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQ3VzdG9tQmxvY2tEZWZBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihDaGFuZ2VUeXBlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBPa0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9ja0VkaXRvci5vayc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBDdXN0b21CbG9ja0RlZkFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE9rTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTdGFydExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9ja0VkaXRvci5zdGFydCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBDdXN0b21CbG9ja0RlZkFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFN0YXJ0TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgVXBkYXRlQmxvY2tMYWJlbEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgbmV3RnJhZ21lbnQ6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBVcGRhdGVCbG9ja0xhYmVsTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrRWRpdG9yLnVwZGF0ZUJsb2NrTGFiZWwnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogVXBkYXRlQmxvY2tMYWJlbEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFVwZGF0ZUJsb2NrTGFiZWxMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduZXdGcmFnbWVudCc7IH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgQmxvY2tUeXBlRGlhbG9nIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIENhbmNlbExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9ja1R5cGVEaWFsb2cuY2FuY2VsJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ2FuY2VsTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBDaGFuZ2VCbG9ja1R5cGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2tUeXBlRGlhbG9nLmNoYW5nZUJsb2NrVHlwZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKENoYW5nZUJsb2NrVHlwZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgTmV3QmxvY2tMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2tUeXBlRGlhbG9nLm5ld0Jsb2NrJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoTmV3QmxvY2tMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE9rTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrVHlwZURpYWxvZy5vayc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE9rTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBCb29sZWFuU2xvdE1vcnBoIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBUb2dnbGVWYWx1ZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IElucHV0SURBcmdzO1xyXG4gICAgICAgICAgICB2YWx1ZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFRvZ2dsZVZhbHVlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jvb2xlYW5TbG90TW9ycGgudG9nZ2xlVmFsdWUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogVG9nZ2xlVmFsdWVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihUb2dnbGVWYWx1ZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgQ29sb3JBcmcge1xyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIENoYW5nZUNvbG9yQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpZDogSW5wdXRJREFyZ3M7XHJcbiAgICAgICAgICAgIGNvbG9yOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQ2hhbmdlQ29sb3JMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQ29sb3JBcmcuY2hhbmdlQ29sb3InO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQ2hhbmdlQ29sb3JBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihDaGFuZ2VDb2xvckxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgQ29tbWFuZEJsb2NrIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBXcmFwQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpZDogQmxvY2tJREFyZ3M7XHJcbiAgICAgICAgICAgIHRhcmdldDogQmxvY2tJREFyZ3M7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgV3JhcExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdDb21tYW5kQmxvY2sud3JhcCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBXcmFwQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoV3JhcExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgSURFIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBBZGRTcHJpdGVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBBZGRTcHJpdGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmFkZFNwcml0ZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBBZGRTcHJpdGVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihBZGRTcHJpdGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQ2hhbmdlQ2F0ZWdvcnlBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGNhdGVnb3J5OiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQ2hhbmdlQ2F0ZWdvcnlMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmNoYW5nZUNhdGVnb3J5JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IENoYW5nZUNhdGVnb3J5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ2hhbmdlQ2F0ZWdvcnlMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICdjYXRlZ29yeSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRGVsZXRlQ3VzdG9tQmxvY2tMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmRlbGV0ZUN1c3RvbUJsb2NrJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEN1c3RvbUJsb2NrRGVmQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoRGVsZXRlQ3VzdG9tQmxvY2tMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEdXBsaWNhdGVTcHJpdGVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBEdXBsaWNhdGVTcHJpdGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmR1cGxpY2F0ZVNwcml0ZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBEdXBsaWNhdGVTcHJpdGVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihEdXBsaWNhdGVTcHJpdGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBFeHBvcnRHbG9iYWxCbG9ja3NMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmV4cG9ydEdsb2JhbEJsb2Nrcyc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEV4cG9ydEdsb2JhbEJsb2Nrc0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEV4cG9ydFByb2VqY3RBc0Nsb3VkRGF0YUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgbmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEV4cG9ydFByb2VqY3RBc0Nsb3VkRGF0YUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuZXhwb3J0UHJvZWpjdEFzQ2xvdWREYXRhJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEV4cG9ydFByb2VqY3RBc0Nsb3VkRGF0YUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEV4cG9ydFByb2VqY3RBc0Nsb3VkRGF0YUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBvcnRQcm9qZWN0QXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRXhwb3J0UHJvamVjdExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuZXhwb3J0UHJvamVjdCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFeHBvcnRQcm9qZWN0QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoRXhwb3J0UHJvamVjdExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBvcnRQcm9qZWN0TWVkaWFBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBFeHBvcnRQcm9qZWN0TWVkaWFMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmV4cG9ydFByb2plY3RNZWRpYSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFeHBvcnRQcm9qZWN0TWVkaWFBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihFeHBvcnRQcm9qZWN0TWVkaWFMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0UHJvamVjdE5vTWVkaWFBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBFeHBvcnRQcm9qZWN0Tm9NZWRpYUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuZXhwb3J0UHJvamVjdE5vTWVkaWEnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRXhwb3J0UHJvamVjdE5vTWVkaWFBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihFeHBvcnRQcm9qZWN0Tm9NZWRpYUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEV4cG9ydFNjcmlwdHNQaWN0dXJlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5leHBvcnRTY3JpcHRzUGljdHVyZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEV4cG9ydFNjcmlwdHNQaWN0dXJlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0U3ByaXRlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRXhwb3J0U3ByaXRlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5leHBvcnRTcHJpdGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRXhwb3J0U3ByaXRlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoRXhwb3J0U3ByaXRlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnbmFtZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgR3JlZW5GbGFnTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5ncmVlbkZsYWcnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihHcmVlbkZsYWdMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBMb2FkRmFpbGVkQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBlcnI6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBMb2FkRmFpbGVkTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5sb2FkRmFpbGVkJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IExvYWRGYWlsZWRBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihMb2FkRmFpbGVkTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnZXJyJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBOZXdQcm9qZWN0TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5uZXdQcm9qZWN0JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoTmV3UHJvamVjdExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgT3BlbkJsb2Nrc1N0cmluZ0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUub3BlbkJsb2Nrc1N0cmluZyc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE9wZW5CbG9ja3NTdHJpbmdMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE9wZW5DbG91ZERhdGFTdHJpbmdMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLm9wZW5DbG91ZERhdGFTdHJpbmcnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihPcGVuQ2xvdWREYXRhU3RyaW5nTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBPcGVuTWVkaWFTdHJpbmdMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLm9wZW5NZWRpYVN0cmluZyc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE9wZW5NZWRpYVN0cmluZ0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE9wZW5Qcm9qZWN0QXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgT3BlblByb2plY3RMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLm9wZW5Qcm9qZWN0JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IE9wZW5Qcm9qZWN0QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoT3BlblByb2plY3RMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBPcGVuUHJvamVjdFN0cmluZ0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUub3BlblByb2plY3RTdHJpbmcnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihPcGVuUHJvamVjdFN0cmluZ0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgT3BlblNwcml0ZXNTdHJpbmdMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLm9wZW5TcHJpdGVzU3RyaW5nJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoT3BlblNwcml0ZXNTdHJpbmdMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE9wZW5lZExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUub3BlbmVkJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoT3BlbmVkTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUGFpbnROZXdTcHJpdGVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBQYWludE5ld1Nwcml0ZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUucGFpbnROZXdTcHJpdGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUGFpbnROZXdTcHJpdGVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihQYWludE5ld1Nwcml0ZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFBhdXNlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5wYXVzZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFBhdXNlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUm90YXRpb25TdHlsZUNoYW5nZWRBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIHJvdGF0aW9uU3R5bGU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBSb3RhdGlvblN0eWxlQ2hhbmdlZExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUucm90YXRpb25TdHlsZUNoYW5nZWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUm90YXRpb25TdHlsZUNoYW5nZWRBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihSb3RhdGlvblN0eWxlQ2hhbmdlZExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ3JvdGF0aW9uU3R5bGUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTYXZlUHJvamVjdFRvQ2xvdWRBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTYXZlUHJvamVjdFRvQ2xvdWRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnNhdmVQcm9qZWN0VG9DbG91ZCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBTYXZlUHJvamVjdFRvQ2xvdWRBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTYXZlUHJvamVjdFRvQ2xvdWRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2VsZWN0U3ByaXRlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU2VsZWN0U3ByaXRlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5zZWxlY3RTcHJpdGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogU2VsZWN0U3ByaXRlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoU2VsZWN0U3ByaXRlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnbmFtZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNldExhbmd1YWdlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBsYW5nOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU2V0TGFuZ3VhZ2VMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnNldExhbmd1YWdlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFNldExhbmd1YWdlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoU2V0TGFuZ3VhZ2VMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICdsYW5nJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0U3ByaXRlRHJhZ2dhYmxlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpc0RyYWdnYWJsZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNldFNwcml0ZURyYWdnYWJsZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuc2V0U3ByaXRlRHJhZ2dhYmxlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFNldFNwcml0ZURyYWdnYWJsZUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNldFNwcml0ZURyYWdnYWJsZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ2lzRHJhZ2dhYmxlJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0U3ByaXRlVGFiQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICB0YWJTdHJpbmc6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTZXRTcHJpdGVUYWJMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnNldFNwcml0ZVRhYic7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBTZXRTcHJpdGVUYWJBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTZXRTcHJpdGVUYWJMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICd0YWJTdHJpbmcnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFN0b3BMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnN0b3AnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTdG9wTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgVG9nZ2xlQXBwTW9kZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaXNBcHBNb2RlOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgVG9nZ2xlQXBwTW9kZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUudG9nZ2xlQXBwTW9kZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBUb2dnbGVBcHBNb2RlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVG9nZ2xlQXBwTW9kZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ2lzQXBwTW9kZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFRvZ2dsZVN0YWdlU2l6ZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaXNTbWFsbFN0YWdlOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgVG9nZ2xlU3RhZ2VTaXplTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS50b2dnbGVTdGFnZVNpemUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogVG9nZ2xlU3RhZ2VTaXplQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVG9nZ2xlU3RhZ2VTaXplTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnaXNTbWFsbFN0YWdlJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBVbnBhdXNlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS51bnBhdXNlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVW5wYXVzZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgSW5wdXRTbG90IHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFZGl0ZWRBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlkOiBJbnB1dElEQXJncztcclxuICAgICAgICAgICAgdGV4dDogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEVkaXRlZExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJbnB1dFNsb3QuZWRpdGVkJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVkaXRlZEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEVkaXRlZExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE1lbnVJdGVtU2VsZWN0ZWRBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlkOiBJbnB1dElEQXJncztcclxuICAgICAgICAgICAgaXRlbTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE1lbnVJdGVtU2VsZWN0ZWRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSW5wdXRTbG90Lm1lbnVJdGVtU2VsZWN0ZWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogTWVudUl0ZW1TZWxlY3RlZEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE1lbnVJdGVtU2VsZWN0ZWRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIE11bHRpQXJnIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEFkZElucHV0TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ011bHRpQXJnLmFkZElucHV0JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IElucHV0SURBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihBZGRJbnB1dExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgUmVtb3ZlSW5wdXRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnTXVsdGlBcmcucmVtb3ZlSW5wdXQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogSW5wdXRJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFJlbW92ZUlucHV0TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBQcm9qZWN0RGlhbG9nIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXRTb3VyY2VBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIHNvdXJjZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNldFNvdXJjZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdQcm9qZWN0RGlhbG9nLnNldFNvdXJjZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBTZXRTb3VyY2VBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTZXRTb3VyY2VMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICdzb3VyY2UnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTaGFyZVByb2plY3RBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICAgICAgaXNUaGlzUHJvamVjdDogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNoYXJlUHJvamVjdExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdQcm9qZWN0RGlhbG9nLnNoYXJlUHJvamVjdCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBTaGFyZVByb2plY3RBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTaGFyZVByb2plY3RMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNob3duTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ1Byb2plY3REaWFsb2cuc2hvd24nO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTaG93bkxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFVuc2hhcmVQcm9qZWN0QXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBQcm9qZWN0TmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFVuc2hhcmVQcm9qZWN0TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ1Byb2plY3REaWFsb2cudW5zaGFyZVByb2plY3QnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogVW5zaGFyZVByb2plY3RBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihVbnNoYXJlUHJvamVjdExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ1Byb2plY3ROYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBTY3JpcHRzIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIENsZWFuVXBMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnU2NyaXB0cy5jbGVhblVwJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ2xlYW5VcExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRXhwb3J0UGljdHVyZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdTY3JpcHRzLmV4cG9ydFBpY3R1cmUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihFeHBvcnRQaWN0dXJlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVkcm9wQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBhY3Rpb246IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBSZWRyb3BMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnU2NyaXB0cy5yZWRyb3AnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUmVkcm9wQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoUmVkcm9wTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnYWN0aW9uJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgVW5kcm9wQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBhY3Rpb246IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBVbmRyb3BMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnU2NyaXB0cy51bmRyb3AnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogVW5kcm9wQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVW5kcm9wTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnYWN0aW9uJzsgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBTcHJpdGUge1xyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFkZFZhcmlhYmxlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQWRkVmFyaWFibGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnU3ByaXRlLmFkZFZhcmlhYmxlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEFkZFZhcmlhYmxlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQWRkVmFyaWFibGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlVmFyaWFibGVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIHZhck5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBEZWxldGVWYXJpYWJsZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdTcHJpdGUuZGVsZXRlVmFyaWFibGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRGVsZXRlVmFyaWFibGVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihEZWxldGVWYXJpYWJsZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ3Zhck5hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXROYW1lQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBzdHJpbmc6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTZXROYW1lTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ1Nwcml0ZS5zZXROYW1lJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFNldE5hbWVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTZXROYW1lTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnc3RyaW5nJzsgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBYTUwge1xyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFBhcnNlRmFpbGVkQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICB4bWxTdHJpbmc6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBQYXJzZUZhaWxlZExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdYTUwucGFyc2VGYWlsZWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUGFyc2VGYWlsZWRBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihQYXJzZUZhaWxlZExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ3htbFN0cmluZyc7IH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBPdmVycmlkZVJlZ2lzdHJ5IHtcclxuXHJcbiAgICBzdGF0aWMgZXh0ZW5kKGNsYXp6IDogRnVuY3Rpb24sIGZ1bmN0aW9uTmFtZSA6IHN0cmluZywgbmV3RnVuY3Rpb24sIGNvdW50QXJncyA9IHRydWUpIHtcclxuICAgICAgICBpZiAoIWNsYXp6IHx8ICFjbGF6ei5wcm90b3R5cGUpIHtcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignZXh0ZW5kIHJlcXVpcmVzIGEgY2xhc3MgZm9yIGl0cyBmaXJzdCBhcmd1bWVudCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBPdmVycmlkZVJlZ2lzdHJ5LmV4dGVuZE9iamVjdChjbGF6ei5wcm90b3R5cGUsIGZ1bmN0aW9uTmFtZSwgbmV3RnVuY3Rpb24sIGNvdW50QXJncyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFmdGVyKGNsYXp6IDogRnVuY3Rpb24sIGZ1bmN0aW9uTmFtZSA6IHN0cmluZywgZG9BZnRlcjogKC4uLmFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICBPdmVycmlkZVJlZ2lzdHJ5LndyYXAoY2xhenosIGZ1bmN0aW9uTmFtZSwgbnVsbCwgZG9BZnRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGJlZm9yZShjbGF6eiA6IEZ1bmN0aW9uLCBmdW5jdGlvbk5hbWUgOiBzdHJpbmcsIGRvQmVmb3JlOiAoLi4uYXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgIE92ZXJyaWRlUmVnaXN0cnkud3JhcChjbGF6eiwgZnVuY3Rpb25OYW1lLCBkb0JlZm9yZSwgbnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHdyYXAoXHJcbiAgICAgICAgY2xhenogOiBGdW5jdGlvbiwgZnVuY3Rpb25OYW1lIDogc3RyaW5nLFxyXG4gICAgICAgIGRvQmVmb3JlPzogKC4uLmFyZ3MpID0+IHZvaWQsIGRvQWZ0ZXI/OiAoLi4uYXJncykgPT4gdm9pZFxyXG4gICAgKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gb3ZlcnJpZGUoYmFzZTogRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgbGV0IGFyZ3MgPSBbLi4uYXJndW1lbnRzXS5zbGljZSgxKTtcclxuICAgICAgICAgICAgaWYgKGRvQmVmb3JlKSBkb0JlZm9yZS5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgICAgICAgICAgYmFzZS5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgICAgICAgICAgaWYgKGRvQWZ0ZXIpIGRvQWZ0ZXIuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE92ZXJyaWRlUmVnaXN0cnkuZXh0ZW5kKGNsYXp6LCBmdW5jdGlvbk5hbWUsIG92ZXJyaWRlLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGV4dGVuZE9iamVjdChvYmplY3QgOiBvYmplY3QsIGZ1bmN0aW9uTmFtZSA6IHN0cmluZywgbmV3RnVuY3Rpb24sIGNvdW50QXJncyA9IHRydWUpIHtcclxuICAgICAgICBpZiAoIW9iamVjdFtmdW5jdGlvbk5hbWVdKSB7XHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXHJcbiAgICAgICAgICAgIGNvbnNvbGUudHJhY2UoKTtcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ2Fubm90IGV4dGVuZCBmdW5jdGlvbiAnICsgZnVuY3Rpb25OYW1lICtcclxuICAgICAgICAgICAgICAgICcgYmVjYXVzZSBpdCBkb2VzIG5vdCBleGlzdC4nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG9sZEZ1bmN0aW9uID0gb2JqZWN0W2Z1bmN0aW9uTmFtZV07XHJcblxyXG4gICAgICAgIGlmIChjb3VudEFyZ3MgJiYgIW9sZEZ1bmN0aW9uLmV4dGVuZGVkICYmIG9sZEZ1bmN0aW9uLmxlbmd0aCAhPSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgIG9sZEZ1bmN0aW9uLmxlbmd0aCArIDEgIT09IG5ld0Z1bmN0aW9uLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9ICdFeHRlbmRpbmcgZnVuY3Rpb24gd2l0aCB3cm9uZyBudW1iZXIgb2YgYXJndW1lbnRzOiAnICtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZSArICcgJyArXHJcbiAgICAgICAgICAgICAgICBvbGRGdW5jdGlvbi5sZW5ndGggKyAnIHZzICcgKyBuZXdGdW5jdGlvbi5sZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihtZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9iamVjdFtmdW5jdGlvbk5hbWVdID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICBhcmdzLnVuc2hpZnQob2xkRnVuY3Rpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3RnVuY3Rpb24uYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBvYmplY3RbZnVuY3Rpb25OYW1lXS5leHRlbmRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIHJldHVybiBvbGRGdW5jdGlvbjtcclxuICAgIH1cclxufVxyXG5cclxuIiwiaW1wb3J0IHsgQmxvY2tzIH0gZnJvbSBcIi4uL2Jsb2Nrcy9CbG9ja0ZhY3RvcnlcIjtcclxuaW1wb3J0IHsgRXZlbnRNYW5hZ2VyIH0gZnJvbSBcIi4uL2V2ZW50cy9FdmVudE1hbmFnZXJcIjtcclxuaW1wb3J0IHsgRXh0ZW5zaW9uTWFuYWdlciB9IGZyb20gXCIuL0V4dGVuc2lvbk1hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFeHRlbnNpb24ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBldmVudHMoKSA6IEV2ZW50TWFuYWdlciB7XHJcbiAgICAgICAgcmV0dXJuIEV4dGVuc2lvbk1hbmFnZXIuZXZlbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBibG9ja3MoKSA6IEJsb2Nrcy5CbG9ja0ZhY3Rvcnkge1xyXG4gICAgICAgIHJldHVybiBFeHRlbnNpb25NYW5hZ2VyLmJsb2NrcztcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge31cclxuXHJcbiAgICByZWdpc3RlcigpIHtcclxuICAgICAgICBFeHRlbnNpb25NYW5hZ2VyLnJlZ2lzdGVyKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlcGVuZGVuY2llcygpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQmxvY2tzIH0gZnJvbSBcIi4uL2Jsb2Nrcy9CbG9ja0ZhY3RvcnlcIjtcclxuaW1wb3J0IHsgRGV2TW9kZSB9IGZyb20gXCIuLi9kZXYvRGV2TW9kZVwiO1xyXG5pbXBvcnQgeyBFdmVudE1hbmFnZXIgfSBmcm9tIFwiLi4vZXZlbnRzL0V2ZW50TWFuYWdlclwiO1xyXG5pbXBvcnQgeyBFeHRlbnNpb24gfSBmcm9tIFwiLi9FeHRlbnNpb25cIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgRXh0ZW5zaW9uTWFuYWdlciB7XHJcblxyXG4gICAgc3RhdGljIHJlYWRvbmx5IGV4dGVuc2lvbnMgPSBbXSBhcyBFeHRlbnNpb25bXTtcclxuXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYmxvY2tzID0gbmV3IEJsb2Nrcy5CbG9ja0ZhY3RvcnkoKTtcclxuICAgIHN0YXRpYyByZWFkb25seSBldmVudHMgPSBuZXcgRXZlbnRNYW5hZ2VyKCk7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZGV2TW9kZSA9IG5ldyBEZXZNb2RlKCk7XHJcblxyXG4gICAgc3RhdGljIHJlZ2lzdGVyKGV4dGVuc2lvbiA6IEV4dGVuc2lvbikge1xyXG4gICAgICAgIHRoaXMuZXh0ZW5zaW9ucy5wdXNoKGV4dGVuc2lvbik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGluaXQoKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmZpZ0ZuID0gICAgd2luZG93WydnZXRTRUZDb25maWcnXTtcclxuICAgICAgICBpZiAoIWNvbmZpZ0ZuKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcclxuICAgICAgICAgICAgICAgICdObyBTRUYgY29uZmlnIGZpbGU6IE5vIGV4dGVuc2lvbnMgbG9hZGVkLiAnICtcclxuICAgICAgICAgICAgICAgICdQbGVhc2UgY3JlYXRlIGxpYnJhcmllcy9zZWYtY29uZmlnLmpzLidcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gY29uZmlnRm4oKTtcclxuICAgICAgICBpZiAoIWNvbmZpZyB8fCAhQXJyYXkuaXNBcnJheShjb25maWcuZXh0ZW5zaW9ucykpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgICAgICAgICAgJ0ludmFsaWQgc2VmLWNvbmZpZy5qcyBmaWxlIChubyBleHRlbnNpb25zIHByb3BlcnR5KS4gJyArXHJcbiAgICAgICAgICAgICAgICAnUGxlYXNlIHNlZSBsaWJyYXJpZXMvc2VmLWNvbmZpZy5leGFtcGxlLmpzIGZvciBhbiBleGFtcGxlLidcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5sb2FkRXh0ZW5zaW9ucyhjb25maWcuZXh0ZW5zaW9ucyk7XHJcblxyXG4gICAgICAgIHRoaXMuZGV2TW9kZS5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5pdEV4dGVuc2lvbnMoKSB7XHJcbiAgICAgICAgLy8gVE9ETzogT3JkZXIgYmFzZWQgb24gZGVwZW5kZW5jaWVzXHJcbiAgICAgICAgLy8gVE9ETzogTG9hZCBvbmx5IHdoZW4gYXNrZWQgZm9yLCBub3QgYWx3YXlzXHJcbiAgICAgICAgdGhpcy5leHRlbnNpb25zLmZvckVhY2goZSA9PiB7XHJcbiAgICAgICAgICAgIGUuaW5pdCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGxvYWRFeHRlbnNpb25zKHBhdGhzOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIGxldCB0b0xvYWQgPSAwO1xyXG4gICAgICAgIHBhdGhzLmZvckVhY2gocGF0aCA9PiB7XHJcbiAgICAgICAgICAgIHRvTG9hZCsrO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRFeHRlbnNpb24ocGF0aCwgc3VjY2VzcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0V4dGVuc2lvbiBub3QgZm91bmQ6JywgcGF0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0b0xvYWQtLTtcclxuICAgICAgICAgICAgICAgIGlmICh0b0xvYWQgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdEV4dGVuc2lvbnMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbG9hZEV4dGVuc2lvbihcclxuICAgICAgICBwYXRoOiBzdHJpbmcsXHJcbiAgICAgICAgY2FsbGJhY2s6IChzdWNjZXNzOiBib29sZWFuKSA9PiB2b2lkXHJcbiAgICApIHtcclxuICAgICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgc2NyaXB0LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2phdmFzY3JpcHQnKTtcclxuICAgICAgICBzY3JpcHQuc2V0QXR0cmlidXRlKCdzcmMnLCBwYXRoKTtcclxuICAgICAgICAvLyBUT0RPOiByZW1vdmUgc2ltdWxhdGVkIGxhZ1xyXG4gICAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4gY2FsbGJhY2sodHJ1ZSkpO1xyXG4gICAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsICgpID0+IGNhbGxiYWNrKGZhbHNlKSk7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgU25hcCB9IGZyb20gXCIuLi9zbmFwL1NuYXBVdGlsc1wiO1xyXG5cclxuZXhwb3J0IG5hbWVzcGFjZSBDbG91ZCB7XHJcblxyXG4gICAgZXhwb3J0IHR5cGUgQ2xvdWRQcm9qZWN0ID0ge1xyXG4gICAgICAgIGNyZWF0ZWQ6IHN0cmluZyxcclxuICAgICAgICBpZDogbnVtYmVyLFxyXG4gICAgICAgIGlzcHVibGljOiBib29sZWFuLFxyXG4gICAgICAgIGlzcHVibGlzaGVkOiBib29sZWFuLFxyXG4gICAgICAgIGxhc3R1cGRhdGVkOiBzdHJpbmcsXHJcbiAgICAgICAgbm90ZXM6IHN0cmluZyxcclxuICAgICAgICBwcm9qZWN0bmFtZTogc3RyaW5nLFxyXG4gICAgICAgIHVzZXJuYW1lOiBzdHJpbmcsXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IHR5cGUgUHJvamVjdFNhdmVCb2R5ID0ge1xyXG4gICAgICAgIG5vdGVzOiBzdHJpbmcsXHJcbiAgICAgICAgeG1sOiBzdHJpbmcsXHJcbiAgICAgICAgbWVkaWE6IHN0cmluZyxcclxuICAgICAgICB0aHVtYm5haWw6IHN0cmluZyxcclxuICAgICAgICByZW1peElEOiBzdHJpbmcsXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFV0aWxzIHtcclxuXHJcbiAgICAgICAgc3RhdGljIGFzeW5jIGdldENsb3VkUHJvamVjdHMod2l0aFRodW1ibmFpbDogYm9vbGVhbik6IFByb21pc2U8Q2xvdWRQcm9qZWN0W10+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIFNuYXAuY2xvdWQuZ2V0UHJvamVjdExpc3QoZGljdCA9PiByZXNvbHZlKGRpY3QucHJvamVjdHMpLCByZWplY3QsIHdpdGhUaHVtYm5haWwpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBhc3luYyBzYXZlUHJvamVjdChwcm9qZWN0TmFtZTogc3RyaW5nLCBib2R5OiBQcm9qZWN0U2F2ZUJvZHkpIDogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBTbmFwLmNsb3VkLnNhdmVQcm9qZWN0KHByb2plY3ROYW1lLCBib2R5LCByZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBhc3luYyBnZXRQdWJsaWNQcm9qZWN0KHByb2plY3ROYW1lOiBzdHJpbmcsIHVzZXJOYW1lOiBzdHJpbmcpIDogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIFNuYXAuY2xvdWQuZ2V0UHVibGljUHJvamVjdChwcm9qZWN0TmFtZSwgdXNlck5hbWUsIHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGRlcHJlY2F0ZWQgVGhlIGNsb3VkIGJhY2tlbmQgbm8gbG9uZ2VyIHN1cHBvcnRzIHRoaXMhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdGljIGFzeW5jIGdldFByb2plY3RNZXRhZGF0YShwcm9qZWN0TmFtZTogc3RyaW5nLCB1c2VyTmFtZTogc3RyaW5nKSA6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBTbmFwLmNsb3VkLmdldFByb2plY3RNZXRhZGF0YShwcm9qZWN0TmFtZSwgdXNlck5hbWUsIHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGFzeW5jIHNoYXJlUHJvamVjdChwcm9qZWN0TmFtZTogc3RyaW5nKSA6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgU25hcC5jbG91ZC5zaGFyZVByb2plY3QocHJvamVjdE5hbWUsIFNuYXAuY2xvdWQudXNlck5hbWUsIHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVE9ETzogUHJvamVjdCBzaG91bGQgaGF2ZSBzb21lIHNvcnQgb2YgcGx1Z2luIHBlcm1pc3Npb24gc3lzdGVtLi4uXHJcbiAgICAgICAgc3RhdGljIGFzeW5jIGRlbGV0ZVByb2plY3QocHJvamVjdE5hbWU6IHN0cmluZykgOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIFNuYXAuY2xvdWQuZGVsZXRlUHJvamVjdChwcm9qZWN0TmFtZSwgU25hcC5jbG91ZC51c2VyTmFtZSwgcmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgZ2V0Q3VycmVudFByb2plY3REYXRhKHZlcmlmeTogYm9vbGVhbikgOiBQcm9qZWN0U2F2ZUJvZHkge1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdEJvZHkgPSBTbmFwLklERS5idWlsZFByb2plY3RSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIGlmICghU25hcC5JREUudmVyaWZ5UHJvamVjdChwcm9qZWN0Qm9keSkpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdEJvZHk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgZ2V0Q3VycmVudFByb2plY3ROYW1lKCkgOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gU25hcC5JREUuZ2V0UHJvamVjdE5hbWUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBpc0xvZ2dlZEluKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gU25hcC5jbG91ZC51c2VybmFtZSAhPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIHVzZXJuYW1lKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gU25hcC5jbG91ZC51c2VybmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyB0ZXN0KCkge1xyXG4gICAgICAgICAgICB0aGlzLmdldENsb3VkUHJvamVjdHMoZmFsc2UpLnRoZW4ocHJvamVjdHMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJvamVjdHNbMF0uY3JlYXRlZCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBEZWZHZW5lcmF0b3Ige1xyXG5cclxuICAgIGNsYXNzZXMgPSBuZXcgTWFwPHN0cmluZywgQ2xhc3NEZWY+O1xyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKHdpbmRvdykpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coa2V5KTtcclxuICAgICAgICAgICAgaWYgKCF3aW5kb3cuaGFzT3duUHJvcGVydHkoa2V5KSkgY29udGludWU7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IHdpbmRvd1trZXldO1xyXG4gICAgICAgICAgICBpZiAoISh2YWx1ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIGlmICghdmFsdWUucHJvdG90eXBlKSBjb250aW51ZTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlLm5hbWUubGVuZ3RoID09IDApIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzZXMuc2V0KGtleSwgbmV3IENsYXNzRGVmKHZhbHVlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2xhc3Nlcy5mb3JFYWNoKGMgPT4gYy5hZGRQYXJlbnREYXRhKHRoaXMuY2xhc3NlcykpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm91dHB1dERlZmluaXRpb25zKCkpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG91dHB1dEV4cG9ydHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIFsuLi50aGlzLmNsYXNzZXMudmFsdWVzKCldLm1hcChjID0+IGMuZXhwb3J0U3RhdGVtZW50KCkpLmpvaW4oJ1xcbicpO1xyXG4gICAgfVxyXG5cclxuICAgIG91dHB1dERlZmluaXRpb25zKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbmV4cG9ydCBjbGFzcyBTbmFwVHlwZSB7XHJcbiAgICBwcm90b3R5cGU6IGFueTtcclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxufVxcblxcbmAgKyBbLi4udGhpcy5jbGFzc2VzLnZhbHVlcygpXS5tYXAoYyA9PiBjLnRvVFMoKSkuam9pbignXFxuXFxuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZG93bmxvYWRBbGwoKSB7XHJcbiAgICAgICAgdGhpcy5kb3dubG9hZEZpbGUoJ1NuYXAuanMnLCB0aGlzLm91dHB1dEV4cG9ydHMoKSk7XHJcbiAgICAgICAgdGhpcy5kb3dubG9hZEZpbGUoJ1NuYXAuZC50cycsIHRoaXMub3V0cHV0RGVmaW5pdGlvbnMoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZG93bmxvYWRGaWxlKGZpbGVuYW1lOiBzdHJpbmcsIHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgJ2RhdGE6dGV4dC9wbGFpbjtjaGFyc2V0PXV0Zi04LCcgKyBlbmNvZGVVUklDb21wb25lbnQodGV4dCkpO1xyXG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIGZpbGVuYW1lKTtcclxuXHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcblxyXG4gICAgICAgIGVsZW1lbnQuY2xpY2soKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChlbGVtZW50KTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmNsYXNzIENsYXNzRGVmIHtcclxuICAgIGJhc2VGdW5jdGlvbjogRnVuY3Rpb247XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICB1YmVyID0gbnVsbCBhcyBzdHJpbmc7XHJcbiAgICBmdW5jdGlvblByb3h5IDogTWV0aG9kO1xyXG4gICAgZmllbGRzID0gbmV3IE1hcDxzdHJpbmcsIEZpZWxkPjtcclxuICAgIG1ldGhvZHMgPSBuZXcgTWFwPHN0cmluZywgTWV0aG9kPjtcclxuICAgIGFkZGVkUGFyZW50RGF0YSA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZ1bmM6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5iYXNlRnVuY3Rpb24gPSBmdW5jO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IGZ1bmMubmFtZTtcclxuICAgICAgICBjb25zdCBwcm90byA9IGZ1bmMucHJvdG90eXBlO1xyXG4gICAgICAgIGlmICghcHJvdG8pIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKFsuLi5PYmplY3Qua2V5cyhwcm90byldLmxlbmd0aCA8PSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZnVuY3Rpb25Qcm94eSA9IG5ldyBNZXRob2QodGhpcy5uYW1lLCBmdW5jKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51YmVyID0gZnVuY1sndWJlciddPy5jb25zdHJ1Y3Rvcj8ubmFtZTtcclxuICAgICAgICB0aGlzLmluZmVyRmllbGRzKGZ1bmMpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMocHJvdG8pKSB7XHJcbiAgICAgICAgICAgIC8vIEkgdGhpbmsgdGhpcyBpcyByZWR1bmRhbnQuLi5cclxuICAgICAgICAgICAgaWYgKCFwcm90by5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gcHJvdG9ba2V5XTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWV0aG9kcy5zZXQoa2V5LCBuZXcgTWV0aG9kKGtleSwgdmFsdWUpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFRPRE86IGRpc3Rpbmd1aXNoIGJldHdlZW4gaW5oZXJpdGVkIGZpZWxkcyBhbmQgc3RhdGljIGZpZWxkc1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5maWVsZHMucHVzaChuZXcgRmllbGQoa2V5LCB2YWx1ZSwgdHJ1ZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5mZXJGaWVsZHMocHJvdG9bJ2luaXQnXSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGFyZW50RGF0YShjbGFzc2VzOiBNYXA8c3RyaW5nLCBDbGFzc0RlZj4pOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5hZGRlZFBhcmVudERhdGEpIHJldHVybjtcclxuICAgICAgICB0aGlzLmFkZGVkUGFyZW50RGF0YSA9IHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuZnVuY3Rpb25Qcm94eSkgcmV0dXJuO1xyXG4gICAgICAgIGlmICghdGhpcy51YmVyIHx8ICFjbGFzc2VzLmhhcyh0aGlzLnViZXIpKSByZXR1cm47XHJcbiAgICAgICAgY29uc3QgcGFyZW50ID0gY2xhc3Nlcy5nZXQodGhpcy51YmVyKTtcclxuICAgICAgICBpZiAoIXBhcmVudC5hZGRlZFBhcmVudERhdGEpIHBhcmVudC5hZGRQYXJlbnREYXRhKGNsYXNzZXMpO1xyXG4gICAgICAgIGZvciAobGV0IFttZXRob2ROYW1lLCBtZXRob2RdIG9mIHBhcmVudC5tZXRob2RzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1ldGhvZHMuaGFzKG1ldGhvZE5hbWUpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdGhpcy5tZXRob2RzLnNldChtZXRob2ROYW1lLCBtZXRob2QpO1xyXG4gICAgICAgICAgICAvLyBJZiBhIGZpZWxkIG92ZXJzaGFkb3dzIGEgcGFyZW50IG1ldGhvZCwgaXQgd2FzIHByb2JhYmx5XHJcbiAgICAgICAgICAgIC8vIGEgbWlzdGFrZSwgc28gZGVsZXRlIGl0LlxyXG4gICAgICAgICAgICAvLyBUT0RPOiBOb3Qgc3VyZSB0aGlzIGlzIHRoZSByaWdodCBjYWxsOyBjb3VsZCBpZ25vcmUgaW5oZXJpdGFuY2VcclxuICAgICAgICAgICAgdGhpcy5maWVsZHMuZGVsZXRlKG1ldGhvZE5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBbZmllbGROYW1lLCBmaWVsZF0gb2YgcGFyZW50LmZpZWxkcykge1xyXG4gICAgICAgICAgICAvLyBEb24ndCBjb3B5IGZpZWxkcyB0aGF0IGhhdmUgc2hhZG93aW5nIG1ldGhvZHNcclxuICAgICAgICAgICAgaWYgKHRoaXMubWV0aG9kcy5oYXMoZmllbGROYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZpZWxkcy5oYXMoZmllbGROYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmllbGRzLnNldChmaWVsZE5hbWUsIGZpZWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5mZXJGaWVsZHMoZnVuYzogRnVuY3Rpb24pIHtcclxuICAgICAgICBpZiAoIWZ1bmMpIHJldHVybjtcclxuICAgICAgICBjb25zdCBqcyA9IGZ1bmMudG9TdHJpbmcoKTtcclxuICAgICAgICBjb25zdCB2YXJEZWMgPSAvXlxccyp0aGlzXFxzKlxcLlxccyooW2EtekEtWl8kXVswLTlhLXpBLVpfJF0qKVxccyo9L2dtO1xyXG4gICAgICAgIGZvciAobGV0IG1hdGNoIG9mIGpzLm1hdGNoQWxsKHZhckRlYykpIHtcclxuICAgICAgICAgICAgbGV0IG5hbWUgPSBtYXRjaFsxXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZmllbGRzLmhhcyhuYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIC8vIEdpdmUgcHJlY2VkZW5jZSB0byBtZXRob2RzXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1ldGhvZHMuaGFzKG5hbWUpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdGhpcy5maWVsZHMuc2V0KG5hbWUsIG5ldyBGaWVsZChuYW1lLCBudWxsLCBmYWxzZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnRTdGF0ZW1lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBleHBvcnQgY29uc3QgJHt0aGlzLm5hbWV9ID0gd2luZG93Wycke3RoaXMubmFtZX0nXTtgO1xyXG4gICAgfVxyXG5cclxuICAgIHRvVFMoKSA6IHN0cmluZyAge1xyXG4gICAgICAgIGlmICh0aGlzLmZ1bmN0aW9uUHJveHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGBleHBvcnQgZnVuY3Rpb24gJHt0aGlzLmZ1bmN0aW9uUHJveHkudG9UUygpfWA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBsZXQgY29kZSA9IGBleHBvcnQgY2xhc3MgJHt0aGlzLm5hbWV9IGV4dGVuZHMgJHt0aGlzLnViZXIgPyB0aGlzLnViZXIgOiAnU25hcFR5cGUnfWA7XHJcbiAgICAgICAgLy8gVE9ETzogQmVjYXVzZSBUeXBlc2NyaXB0IHNlZW1zIG5vdCB0byBhbGxvdyBmdW5jdGlvbiBzaGFkb3dpbmcsXHJcbiAgICAgICAgLy8gbmVlZCB0byBtYW51YWxseSBkZWZpbmUgYWxsIHBhcmVudCB0eXBlcyBhbmQgbWV0aG9kcyAodGhhdCBhcmVuJ3Qgc2hhZG93ZWQpIGhlcmVcclxuICAgICAgICBsZXQgY29kZSA9IGBleHBvcnQgY2xhc3MgJHt0aGlzLm5hbWV9IGV4dGVuZHMgU25hcFR5cGVgO1xyXG4gICAgICAgIGNvZGUgKz0gYCB7XFxuYDtcclxuICAgICAgICBsZXQgZktleXMgPSBbLi4udGhpcy5maWVsZHMua2V5cygpXTtcclxuICAgICAgICBmS2V5cy5zb3J0KCk7XHJcbiAgICAgICAgZm9yIChsZXQgZmtleSBvZiBmS2V5cykge1xyXG4gICAgICAgICAgICBjb2RlICs9ICcgICAgJyArIHRoaXMuZmllbGRzLmdldChma2V5KS50b1RTKCkgKyAnXFxuJztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29kZSArPSAnXFxuJztcclxuICAgICAgICBsZXQgbUtleXMgPSBbLi4udGhpcy5tZXRob2RzLmtleXMoKV07XHJcbiAgICAgICAgbUtleXMuc29ydCgpO1xyXG4gICAgICAgIGZvciAobGV0IG1LZXkgb2YgbUtleXMpIHtcclxuICAgICAgICAgICAgY29kZSArPSAnICAgICcgKyB0aGlzLm1ldGhvZHMuZ2V0KG1LZXkpLnRvVFMoKSArICdcXG4nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb2RlICs9ICd9JztcclxuICAgICAgICByZXR1cm4gY29kZTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgRmllbGQge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdHlwZTogc3RyaW5nO1xyXG4gICAgaXNTdGF0aWM6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55LCBpc1N0YXRpYzogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5pc1N0YXRpYyA9IGlzU3RhdGljO1xyXG4gICAgICAgIHRoaXMudHlwZSA9ICdhbnknO1xyXG4gICAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGVvZih2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRvVFMoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuaXNTdGF0aWMgPyAnc3RhdGljICcgOiAnJ30ke3RoaXMubmFtZX06ICR7dGhpcy50eXBlfTtgO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBNZXRob2Qge1xyXG5cclxuICAgIHN0YXRpYyByZWFkb25seSBTVFJJUF9DT01NRU5UUyA9IC8oXFwvXFwvLiokKXwoXFwvXFwqW1xcc1xcU10qP1xcKlxcLyl8KFxccyo9W14sXFwpXSooKCcoPzpcXFxcJ3xbXidcXHJcXG5dKSonKXwoXCIoPzpcXFxcXCJ8W15cIlxcclxcbl0pKlwiKSl8KFxccyo9W14sXFwpXSopKS9tZztcclxuICAgIHN0YXRpYyByZWFkb25seSBBUkdVTUVOVF9OQU1FUyA9IC8oW15cXHMsXSspL2c7XHJcblxyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgcGFyYW1OYW1lczogc3RyaW5nW107XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBmdW5jOiBGdW5jdGlvbikge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5wYXJhbU5hbWVzID0gdGhpcy5nZXRQYXJhbU5hbWVzKGZ1bmMpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBhcmFtTmFtZXMoZnVuYzogRnVuY3Rpb24pIHtcclxuICAgICAgICB2YXIgZm5TdHIgPSBmdW5jLnRvU3RyaW5nKCkucmVwbGFjZShNZXRob2QuU1RSSVBfQ09NTUVOVFMsICcnKTtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gZm5TdHIuc2xpY2UoZm5TdHIuaW5kZXhPZignKCcpKzEsIGZuU3RyLmluZGV4T2YoJyknKSkubWF0Y2goTWV0aG9kLkFSR1VNRU5UX05BTUVTKTtcclxuICAgICAgICBpZihyZXN1bHQgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdC5maWx0ZXIocGFyYW0gPT4gcGFyYW0ubWF0Y2goL15bYS16QS1aXyRdWzAtOWEtekEtWl8kXSokLykpXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB0b1RTKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IG92ZXJyaWRlID0gdGhpcy5jaGVja092ZXJyaWRlKCk7XHJcbiAgICAgICAgaWYgKG92ZXJyaWRlKSByZXR1cm4gb3ZlcnJpZGU7XHJcbiAgICAgICAgbGV0IGNvZGUgPSBgJHt0aGlzLm5hbWV9KGA7XHJcbiAgICAgICAgbGV0IGZpcnN0ID0gdHJ1ZTtcclxuICAgICAgICBmb3IgKGxldCBuYW1lIG9mIHRoaXMucGFyYW1OYW1lcykge1xyXG4gICAgICAgICAgICBpZiAoIWZpcnN0KSBjb2RlICs9ICcsICc7XHJcbiAgICAgICAgICAgIGZpcnN0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNvZGUgKz0gYCR7bmFtZX0/OiBhbnlgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb2RlICs9ICcpOyc7XHJcbiAgICAgICAgcmV0dXJuIGNvZGU7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tPdmVycmlkZSgpIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMubmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlICdjaGlsZFRoYXRJc0EnOiByZXR1cm4gYCR7dGhpcy5uYW1lfSguLi5hcmdzOiBhbnlbXSk7YFxyXG4gICAgICAgICAgICBjYXNlICdwYXJlbnRUaGF0SXNBJzogcmV0dXJuIGAke3RoaXMubmFtZX0oLi4uYXJnczogYW55W10pO2BcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn0iLCIvLyBpbXBvcnQgeyBFdmVudHMsIEV4dGVuc2lvbk1hbmFnZXIgfSBmcm9tIFwic2VmXCI7XHJcbmltcG9ydCB7IEJsb2NrTW9ycGgsIENsb3VkLCBJREVfTW9ycGgsIFNwcml0ZU1vcnBoLCBTdGFnZU1vcnBoLCBXb3JsZE1vcnBoIH0gZnJvbSBcIi4vU25hcFwiO1xyXG5pbXBvcnQgeyBCbG9ja0lEQXJncyB9IGZyb20gXCIuLi9ldmVudHMvU25hcEV2ZW50TGlzdGVuZXJcIjtcclxuXHJcblxyXG4vLyBUT0RPOiBNYWtlIGFuIGludGVyZmFjZSB3aXRoIGFuIGltcGxlbWVudGF0aW9uIHRoYXQgZmV0Y2hlcyBmcm9tIHdpbmRvd1xyXG5leHBvcnQgY2xhc3MgU25hcCB7XHJcblxyXG4gICAgc3RhdGljIGxhc3RSdW5CbG9jazogQmxvY2tNb3JwaDtcclxuXHJcbiAgICBzdGF0aWMgZ2V0IHdvcmxkKCkgOiBXb3JsZE1vcnBoIHtcclxuICAgICAgICByZXR1cm4gd2luZG93W1wid29ybGRcIl07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBJREUoKSA6IElERV9Nb3JwaCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMud29ybGQ/LmNoaWxkVGhhdElzQSh3aW5kb3dbJ0lERV9Nb3JwaCddKSBhcyBJREVfTW9ycGg7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBzdGFnZSgpIDogU3RhZ2VNb3JwaCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuSURFPy5zdGFnZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGN1cnJlbnRTcHJpdGUoKSA6IFNwcml0ZU1vcnBoIHwgU3RhZ2VNb3JwaHtcclxuICAgICAgICByZXR1cm4gdGhpcy5JREU/LmN1cnJlbnRTcHJpdGU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBzcHJpdGVzKCkgOiBTcHJpdGVNb3JwaFtdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5JREU/LnNwcml0ZXM/LmNvbnRlbnRzIHx8IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgY2xvdWQoKSA6IENsb3VkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5JREU/LmNsb3VkO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRTcHJpdGUobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ByaXRlcy5maWx0ZXIoc3ByaXRlID0+IHNwcml0ZS5uYW1lID09IG5hbWUpWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRCbG9jayhpZDogQmxvY2tJREFyZ3MpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53b3JsZC5hbGxDaGlsZHJlbigpXHJcbiAgICAgICAgICAgIC5maWx0ZXIoYiA9PiBiIGluc3RhbmNlb2YgQmxvY2tNb3JwaCAmJiBiLmlkID09IGlkLmlkKVswXTtcclxuICAgIH1cclxuXHJcbn0iLCJleHBvcnQgY29uc3Qgbm9wID0gd2luZG93Wydub3AnXTtcclxuZXhwb3J0IGNvbnN0IG5ld0d1aWQgPSB3aW5kb3dbJ25ld0d1aWQnXTtcclxuZXhwb3J0IGNvbnN0IGxvY2FsaXplID0gd2luZG93Wydsb2NhbGl6ZSddO1xyXG5leHBvcnQgY29uc3QgaXNOaWwgPSB3aW5kb3dbJ2lzTmlsJ107XHJcbmV4cG9ydCBjb25zdCBjb250YWlucyA9IHdpbmRvd1snY29udGFpbnMnXTtcclxuZXhwb3J0IGNvbnN0IGRldGVjdCA9IHdpbmRvd1snZGV0ZWN0J107XHJcbmV4cG9ydCBjb25zdCBzaXplT2YgPSB3aW5kb3dbJ3NpemVPZiddO1xyXG5leHBvcnQgY29uc3QgaXNTdHJpbmcgPSB3aW5kb3dbJ2lzU3RyaW5nJ107XHJcbmV4cG9ydCBjb25zdCBpc09iamVjdCA9IHdpbmRvd1snaXNPYmplY3QnXTtcclxuZXhwb3J0IGNvbnN0IHJhZGlhbnMgPSB3aW5kb3dbJ3JhZGlhbnMnXTtcclxuZXhwb3J0IGNvbnN0IGRlZ3JlZXMgPSB3aW5kb3dbJ2RlZ3JlZXMnXTtcclxuZXhwb3J0IGNvbnN0IGZvbnRIZWlnaHQgPSB3aW5kb3dbJ2ZvbnRIZWlnaHQnXTtcclxuZXhwb3J0IGNvbnN0IGlzV29yZENoYXIgPSB3aW5kb3dbJ2lzV29yZENoYXInXTtcclxuZXhwb3J0IGNvbnN0IGlzVVJMQ2hhciA9IHdpbmRvd1snaXNVUkxDaGFyJ107XHJcbmV4cG9ydCBjb25zdCBpc1VSTCA9IHdpbmRvd1snaXNVUkwnXTtcclxuZXhwb3J0IGNvbnN0IG5ld0NhbnZhcyA9IHdpbmRvd1snbmV3Q2FudmFzJ107XHJcbmV4cG9ydCBjb25zdCBjb3B5Q2FudmFzID0gd2luZG93Wydjb3B5Q2FudmFzJ107XHJcbmV4cG9ydCBjb25zdCBnZXRNaW5pbXVtRm9udEhlaWdodCA9IHdpbmRvd1snZ2V0TWluaW11bUZvbnRIZWlnaHQnXTtcclxuZXhwb3J0IGNvbnN0IGdldERvY3VtZW50UG9zaXRpb25PZiA9IHdpbmRvd1snZ2V0RG9jdW1lbnRQb3NpdGlvbk9mJ107XHJcbmV4cG9ydCBjb25zdCBjb3B5ID0gd2luZG93Wydjb3B5J107XHJcbmV4cG9ydCBjb25zdCBlbWJlZE1ldGFkYXRhUE5HID0gd2luZG93WydlbWJlZE1ldGFkYXRhUE5HJ107XHJcbmV4cG9ydCBjb25zdCBlbmFibGVSZXRpbmFTdXBwb3J0ID0gd2luZG93WydlbmFibGVSZXRpbmFTdXBwb3J0J107XHJcbmV4cG9ydCBjb25zdCBpc1JldGluYVN1cHBvcnRlZCA9IHdpbmRvd1snaXNSZXRpbmFTdXBwb3J0ZWQnXTtcclxuZXhwb3J0IGNvbnN0IGlzUmV0aW5hRW5hYmxlZCA9IHdpbmRvd1snaXNSZXRpbmFFbmFibGVkJ107XHJcbmV4cG9ydCBjb25zdCBkaXNhYmxlUmV0aW5hU3VwcG9ydCA9IHdpbmRvd1snZGlzYWJsZVJldGluYVN1cHBvcnQnXTtcclxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUNhbnZhcyA9IHdpbmRvd1snbm9ybWFsaXplQ2FudmFzJ107XHJcbmV4cG9ydCBjb25zdCBBbmltYXRpb24gPSB3aW5kb3dbJ0FuaW1hdGlvbiddO1xyXG5leHBvcnQgY29uc3QgQ29sb3IgPSB3aW5kb3dbJ0NvbG9yJ107XHJcbmV4cG9ydCBjb25zdCBQb2ludCA9IHdpbmRvd1snUG9pbnQnXTtcclxuZXhwb3J0IGNvbnN0IFJlY3RhbmdsZSA9IHdpbmRvd1snUmVjdGFuZ2xlJ107XHJcbmV4cG9ydCBjb25zdCBOb2RlID0gd2luZG93WydOb2RlJ107XHJcbmV4cG9ydCBjb25zdCBNb3JwaCA9IHdpbmRvd1snTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFdvcmxkTW9ycGggPSB3aW5kb3dbJ1dvcmxkTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEhhbmRNb3JwaCA9IHdpbmRvd1snSGFuZE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTaGFkb3dNb3JwaCA9IHdpbmRvd1snU2hhZG93TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEZyYW1lTW9ycGggPSB3aW5kb3dbJ0ZyYW1lTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IE1lbnVNb3JwaCA9IHdpbmRvd1snTWVudU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBIYW5kbGVNb3JwaCA9IHdpbmRvd1snSGFuZGxlTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFN0cmluZ0ZpZWxkTW9ycGggPSB3aW5kb3dbJ1N0cmluZ0ZpZWxkTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IENvbG9yUGlja2VyTW9ycGggPSB3aW5kb3dbJ0NvbG9yUGlja2VyTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNsaWRlck1vcnBoID0gd2luZG93WydTbGlkZXJNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU2Nyb2xsRnJhbWVNb3JwaCA9IHdpbmRvd1snU2Nyb2xsRnJhbWVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgSW5zcGVjdG9yTW9ycGggPSB3aW5kb3dbJ0luc3BlY3Rvck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTdHJpbmdNb3JwaCA9IHdpbmRvd1snU3RyaW5nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFRleHRNb3JwaCA9IHdpbmRvd1snVGV4dE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBQZW5Nb3JwaCA9IHdpbmRvd1snUGVuTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IENvbG9yUGFsZXR0ZU1vcnBoID0gd2luZG93WydDb2xvclBhbGV0dGVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgR3JheVBhbGV0dGVNb3JwaCA9IHdpbmRvd1snR3JheVBhbGV0dGVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQmxpbmtlck1vcnBoID0gd2luZG93WydCbGlua2VyTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEN1cnNvck1vcnBoID0gd2luZG93WydDdXJzb3JNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQm94TW9ycGggPSB3aW5kb3dbJ0JveE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTcGVlY2hCdWJibGVNb3JwaCA9IHdpbmRvd1snU3BlZWNoQnViYmxlTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IERpYWxNb3JwaCA9IHdpbmRvd1snRGlhbE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDaXJjbGVCb3hNb3JwaCA9IHdpbmRvd1snQ2lyY2xlQm94TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNsaWRlckJ1dHRvbk1vcnBoID0gd2luZG93WydTbGlkZXJCdXR0b25Nb3JwaCddO1xyXG5leHBvcnQgY29uc3QgTW91c2VTZW5zb3JNb3JwaCA9IHdpbmRvd1snTW91c2VTZW5zb3JNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgTGlzdE1vcnBoID0gd2luZG93WydMaXN0TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFRyaWdnZXJNb3JwaCA9IHdpbmRvd1snVHJpZ2dlck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBNZW51SXRlbU1vcnBoID0gd2luZG93WydNZW51SXRlbU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCb3VuY2VyTW9ycGggPSB3aW5kb3dbJ0JvdW5jZXJNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU3ltYm9sTW9ycGggPSB3aW5kb3dbJ1N5bWJvbE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBQdXNoQnV0dG9uTW9ycGggPSB3aW5kb3dbJ1B1c2hCdXR0b25Nb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVG9nZ2xlQnV0dG9uTW9ycGggPSB3aW5kb3dbJ1RvZ2dsZUJ1dHRvbk1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBUYWJNb3JwaCA9IHdpbmRvd1snVGFiTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFRvZ2dsZU1vcnBoID0gd2luZG93WydUb2dnbGVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVG9nZ2xlRWxlbWVudE1vcnBoID0gd2luZG93WydUb2dnbGVFbGVtZW50TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IERpYWxvZ0JveE1vcnBoID0gd2luZG93WydEaWFsb2dCb3hNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQWxpZ25tZW50TW9ycGggPSB3aW5kb3dbJ0FsaWdubWVudE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBJbnB1dEZpZWxkTW9ycGggPSB3aW5kb3dbJ0lucHV0RmllbGRNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUGlhbm9NZW51TW9ycGggPSB3aW5kb3dbJ1BpYW5vTWVudU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBQaWFub0tleU1vcnBoID0gd2luZG93WydQaWFub0tleU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTeW50YXhFbGVtZW50TW9ycGggPSB3aW5kb3dbJ1N5bnRheEVsZW1lbnRNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQmxvY2tNb3JwaCA9IHdpbmRvd1snQmxvY2tNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQmxvY2tMYWJlbE1vcnBoID0gd2luZG93WydCbG9ja0xhYmVsTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJsb2NrU3ltYm9sTW9ycGggPSB3aW5kb3dbJ0Jsb2NrU3ltYm9sTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IENvbW1hbmRCbG9ja01vcnBoID0gd2luZG93WydDb21tYW5kQmxvY2tNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUmVwb3J0ZXJCbG9ja01vcnBoID0gd2luZG93WydSZXBvcnRlckJsb2NrTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNjcmlwdHNNb3JwaCA9IHdpbmRvd1snU2NyaXB0c01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBBcmdNb3JwaCA9IHdpbmRvd1snQXJnTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IENvbW1hbmRTbG90TW9ycGggPSB3aW5kb3dbJ0NvbW1hbmRTbG90TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IENTbG90TW9ycGggPSB3aW5kb3dbJ0NTbG90TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IElucHV0U2xvdE1vcnBoID0gd2luZG93WydJbnB1dFNsb3RNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgSW5wdXRTbG90U3RyaW5nTW9ycGggPSB3aW5kb3dbJ0lucHV0U2xvdFN0cmluZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBJbnB1dFNsb3RUZXh0TW9ycGggPSB3aW5kb3dbJ0lucHV0U2xvdFRleHRNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQm9vbGVhblNsb3RNb3JwaCA9IHdpbmRvd1snQm9vbGVhblNsb3RNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQXJyb3dNb3JwaCA9IHdpbmRvd1snQXJyb3dNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQ29sb3JTbG90TW9ycGggPSB3aW5kb3dbJ0NvbG9yU2xvdE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBIYXRCbG9ja01vcnBoID0gd2luZG93WydIYXRCbG9ja01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja0hpZ2hsaWdodE1vcnBoID0gd2luZG93WydCbG9ja0hpZ2hsaWdodE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBNdWx0aUFyZ01vcnBoID0gd2luZG93WydNdWx0aUFyZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBUZW1wbGF0ZVNsb3RNb3JwaCA9IHdpbmRvd1snVGVtcGxhdGVTbG90TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEZ1bmN0aW9uU2xvdE1vcnBoID0gd2luZG93WydGdW5jdGlvblNsb3RNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUmVwb3J0ZXJTbG90TW9ycGggPSB3aW5kb3dbJ1JlcG9ydGVyU2xvdE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBSaW5nTW9ycGggPSB3aW5kb3dbJ1JpbmdNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUmluZ0NvbW1hbmRTbG90TW9ycGggPSB3aW5kb3dbJ1JpbmdDb21tYW5kU2xvdE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBSaW5nUmVwb3J0ZXJTbG90TW9ycGggPSB3aW5kb3dbJ1JpbmdSZXBvcnRlclNsb3RNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQ29tbWVudE1vcnBoID0gd2luZG93WydDb21tZW50TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEFyZ0xhYmVsTW9ycGggPSB3aW5kb3dbJ0FyZ0xhYmVsTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFRleHRTbG90TW9ycGggPSB3aW5kb3dbJ1RleHRTbG90TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNjcmlwdEZvY3VzTW9ycGggPSB3aW5kb3dbJ1NjcmlwdEZvY3VzTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFRocmVhZE1hbmFnZXIgPSB3aW5kb3dbJ1RocmVhZE1hbmFnZXInXTtcclxuZXhwb3J0IGNvbnN0IFByb2Nlc3MgPSB3aW5kb3dbJ1Byb2Nlc3MnXTtcclxuZXhwb3J0IGNvbnN0IENvbnRleHQgPSB3aW5kb3dbJ0NvbnRleHQnXTtcclxuZXhwb3J0IGNvbnN0IFZhcmlhYmxlID0gd2luZG93WydWYXJpYWJsZSddO1xyXG5leHBvcnQgY29uc3QgVmFyaWFibGVGcmFtZSA9IHdpbmRvd1snVmFyaWFibGVGcmFtZSddO1xyXG5leHBvcnQgY29uc3QgSlNDb21waWxlciA9IHdpbmRvd1snSlNDb21waWxlciddO1xyXG5leHBvcnQgY29uc3Qgc25hcEVxdWFscyA9IHdpbmRvd1snc25hcEVxdWFscyddO1xyXG5leHBvcnQgY29uc3QgaW52b2tlID0gd2luZG93WydpbnZva2UnXTtcclxuZXhwb3J0IGNvbnN0IFNwcml0ZU1vcnBoID0gd2luZG93WydTcHJpdGVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU3RhZ2VNb3JwaCA9IHdpbmRvd1snU3RhZ2VNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU3ByaXRlQnViYmxlTW9ycGggPSB3aW5kb3dbJ1Nwcml0ZUJ1YmJsZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDb3N0dW1lID0gd2luZG93WydDb3N0dW1lJ107XHJcbmV4cG9ydCBjb25zdCBTVkdfQ29zdHVtZSA9IHdpbmRvd1snU1ZHX0Nvc3R1bWUnXTtcclxuZXhwb3J0IGNvbnN0IENvc3R1bWVFZGl0b3JNb3JwaCA9IHdpbmRvd1snQ29zdHVtZUVkaXRvck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTb3VuZCA9IHdpbmRvd1snU291bmQnXTtcclxuZXhwb3J0IGNvbnN0IE5vdGUgPSB3aW5kb3dbJ05vdGUnXTtcclxuZXhwb3J0IGNvbnN0IE1pY3JvcGhvbmUgPSB3aW5kb3dbJ01pY3JvcGhvbmUnXTtcclxuZXhwb3J0IGNvbnN0IENlbGxNb3JwaCA9IHdpbmRvd1snQ2VsbE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBXYXRjaGVyTW9ycGggPSB3aW5kb3dbJ1dhdGNoZXJNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU3RhZ2VQcm9tcHRlck1vcnBoID0gd2luZG93WydTdGFnZVByb21wdGVyTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNwcml0ZUhpZ2hsaWdodE1vcnBoID0gd2luZG93WydTcHJpdGVIaWdobGlnaHRNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU3RhZ2VQaWNrZXJNb3JwaCA9IHdpbmRvd1snU3RhZ2VQaWNrZXJNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU3RhZ2VQaWNrZXJJdGVtTW9ycGggPSB3aW5kb3dbJ1N0YWdlUGlja2VySXRlbU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBpc1NuYXBPYmplY3QgPSB3aW5kb3dbJ2lzU25hcE9iamVjdCddO1xyXG5leHBvcnQgY29uc3QgUHJvamVjdCA9IHdpbmRvd1snUHJvamVjdCddO1xyXG5leHBvcnQgY29uc3QgU2NlbmUgPSB3aW5kb3dbJ1NjZW5lJ107XHJcbmV4cG9ydCBjb25zdCBJREVfTW9ycGggPSB3aW5kb3dbJ0lERV9Nb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUHJvamVjdERpYWxvZ01vcnBoID0gd2luZG93WydQcm9qZWN0RGlhbG9nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IExpYnJhcnlJbXBvcnREaWFsb2dNb3JwaCA9IHdpbmRvd1snTGlicmFyeUltcG9ydERpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTcHJpdGVJY29uTW9ycGggPSB3aW5kb3dbJ1Nwcml0ZUljb25Nb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQ29zdHVtZUljb25Nb3JwaCA9IHdpbmRvd1snQ29zdHVtZUljb25Nb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVHVydGxlSWNvbk1vcnBoID0gd2luZG93WydUdXJ0bGVJY29uTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFdhcmRyb2JlTW9ycGggPSB3aW5kb3dbJ1dhcmRyb2JlTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNvdW5kSWNvbk1vcnBoID0gd2luZG93WydTb3VuZEljb25Nb3JwaCddO1xyXG5leHBvcnQgY29uc3QgSnVrZWJveE1vcnBoID0gd2luZG93WydKdWtlYm94TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNjZW5lSWNvbk1vcnBoID0gd2luZG93WydTY2VuZUljb25Nb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU2NlbmVBbGJ1bU1vcnBoID0gd2luZG93WydTY2VuZUFsYnVtTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFN0YWdlSGFuZGxlTW9ycGggPSB3aW5kb3dbJ1N0YWdlSGFuZGxlTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFBhbGV0dGVIYW5kbGVNb3JwaCA9IHdpbmRvd1snUGFsZXR0ZUhhbmRsZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDYW1TbmFwc2hvdERpYWxvZ01vcnBoID0gd2luZG93WydDYW1TbmFwc2hvdERpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTb3VuZFJlY29yZGVyRGlhbG9nTW9ycGggPSB3aW5kb3dbJ1NvdW5kUmVjb3JkZXJEaWFsb2dNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUHJvamVjdFJlY292ZXJ5RGlhbG9nTW9ycGggPSB3aW5kb3dbJ1Byb2plY3RSZWNvdmVyeURpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBQYWludEVkaXRvck1vcnBoID0gd2luZG93WydQYWludEVkaXRvck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBQYWludENhbnZhc01vcnBoID0gd2luZG93WydQYWludENhbnZhc01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBQYWludENvbG9yUGlja2VyTW9ycGggPSB3aW5kb3dbJ1BhaW50Q29sb3JQaWNrZXJNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgTGlzdCA9IHdpbmRvd1snTGlzdCddO1xyXG5leHBvcnQgY29uc3QgTGlzdFdhdGNoZXJNb3JwaCA9IHdpbmRvd1snTGlzdFdhdGNoZXJNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQ3VzdG9tQmxvY2tEZWZpbml0aW9uID0gd2luZG93WydDdXN0b21CbG9ja0RlZmluaXRpb24nXTtcclxuZXhwb3J0IGNvbnN0IEN1c3RvbUNvbW1hbmRCbG9ja01vcnBoID0gd2luZG93WydDdXN0b21Db21tYW5kQmxvY2tNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQ3VzdG9tUmVwb3J0ZXJCbG9ja01vcnBoID0gd2luZG93WydDdXN0b21SZXBvcnRlckJsb2NrTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJsb2NrRGlhbG9nTW9ycGggPSB3aW5kb3dbJ0Jsb2NrRGlhbG9nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJsb2NrRWRpdG9yTW9ycGggPSB3aW5kb3dbJ0Jsb2NrRWRpdG9yTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFByb3RvdHlwZUhhdEJsb2NrTW9ycGggPSB3aW5kb3dbJ1Byb3RvdHlwZUhhdEJsb2NrTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJsb2NrTGFiZWxGcmFnbWVudCA9IHdpbmRvd1snQmxvY2tMYWJlbEZyYWdtZW50J107XHJcbmV4cG9ydCBjb25zdCBCbG9ja0xhYmVsRnJhZ21lbnRNb3JwaCA9IHdpbmRvd1snQmxvY2tMYWJlbEZyYWdtZW50TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJsb2NrSW5wdXRGcmFnbWVudE1vcnBoID0gd2luZG93WydCbG9ja0lucHV0RnJhZ21lbnRNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQmxvY2tMYWJlbFBsYWNlSG9sZGVyTW9ycGggPSB3aW5kb3dbJ0Jsb2NrTGFiZWxQbGFjZUhvbGRlck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBJbnB1dFNsb3REaWFsb2dNb3JwaCA9IHdpbmRvd1snSW5wdXRTbG90RGlhbG9nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFZhcmlhYmxlRGlhbG9nTW9ycGggPSB3aW5kb3dbJ1ZhcmlhYmxlRGlhbG9nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEphZ2dlZEJsb2NrTW9ycGggPSB3aW5kb3dbJ0phZ2dlZEJsb2NrTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJsb2NrRXhwb3J0RGlhbG9nTW9ycGggPSB3aW5kb3dbJ0Jsb2NrRXhwb3J0RGlhbG9nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJsb2NrSW1wb3J0RGlhbG9nTW9ycGggPSB3aW5kb3dbJ0Jsb2NrSW1wb3J0RGlhbG9nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJsb2NrUmVtb3ZhbERpYWxvZ01vcnBoID0gd2luZG93WydCbG9ja1JlbW92YWxEaWFsb2dNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQmxvY2tWaXNpYmlsaXR5RGlhbG9nTW9ycGggPSB3aW5kb3dbJ0Jsb2NrVmlzaWJpbGl0eURpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBUYWJsZSA9IHdpbmRvd1snVGFibGUnXTtcclxuZXhwb3J0IGNvbnN0IFRhYmxlQ2VsbE1vcnBoID0gd2luZG93WydUYWJsZUNlbGxNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVGFibGVNb3JwaCA9IHdpbmRvd1snVGFibGVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVGFibGVGcmFtZU1vcnBoID0gd2luZG93WydUYWJsZUZyYW1lTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFRhYmxlRGlhbG9nTW9ycGggPSB3aW5kb3dbJ1RhYmxlRGlhbG9nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFZlY3RvclNoYXBlID0gd2luZG93WydWZWN0b3JTaGFwZSddO1xyXG5leHBvcnQgY29uc3QgVmVjdG9yUmVjdGFuZ2xlID0gd2luZG93WydWZWN0b3JSZWN0YW5nbGUnXTtcclxuZXhwb3J0IGNvbnN0IFZlY3RvckxpbmUgPSB3aW5kb3dbJ1ZlY3RvckxpbmUnXTtcclxuZXhwb3J0IGNvbnN0IFZlY3RvckVsbGlwc2UgPSB3aW5kb3dbJ1ZlY3RvckVsbGlwc2UnXTtcclxuZXhwb3J0IGNvbnN0IFZlY3RvclBvbHlnb24gPSB3aW5kb3dbJ1ZlY3RvclBvbHlnb24nXTtcclxuZXhwb3J0IGNvbnN0IFZlY3RvclNlbGVjdGlvbiA9IHdpbmRvd1snVmVjdG9yU2VsZWN0aW9uJ107XHJcbmV4cG9ydCBjb25zdCBWZWN0b3JQYWludEVkaXRvck1vcnBoID0gd2luZG93WydWZWN0b3JQYWludEVkaXRvck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBWZWN0b3JQYWludENhbnZhc01vcnBoID0gd2luZG93WydWZWN0b3JQYWludENhbnZhc01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDcm9zc2hhaXIgPSB3aW5kb3dbJ0Nyb3NzaGFpciddO1xyXG5leHBvcnQgY29uc3QgVmlkZW9Nb3Rpb24gPSB3aW5kb3dbJ1ZpZGVvTW90aW9uJ107XHJcbmV4cG9ydCBjb25zdCBXb3JsZE1hcCA9IHdpbmRvd1snV29ybGRNYXAnXTtcclxuZXhwb3J0IGNvbnN0IFJlYWRTdHJlYW0gPSB3aW5kb3dbJ1JlYWRTdHJlYW0nXTtcclxuZXhwb3J0IGNvbnN0IFhNTF9FbGVtZW50ID0gd2luZG93WydYTUxfRWxlbWVudCddO1xyXG5leHBvcnQgY29uc3QgWE1MX1NlcmlhbGl6ZXIgPSB3aW5kb3dbJ1hNTF9TZXJpYWxpemVyJ107XHJcbmV4cG9ydCBjb25zdCBTbmFwU2VyaWFsaXplciA9IHdpbmRvd1snU25hcFNlcmlhbGl6ZXInXTtcclxuZXhwb3J0IGNvbnN0IExvY2FsaXplciA9IHdpbmRvd1snTG9jYWxpemVyJ107XHJcbmV4cG9ydCBjb25zdCBDbG91ZCA9IHdpbmRvd1snQ2xvdWQnXTtcclxuZXhwb3J0IGNvbnN0IFNuYXBFdmVudE1hbmFnZXIgPSB3aW5kb3dbJ1NuYXBFdmVudE1hbmFnZXInXTtcclxuZXhwb3J0IGNvbnN0IGhleF9zaGE1MTIgPSB3aW5kb3dbJ2hleF9zaGE1MTInXTtcclxuZXhwb3J0IGNvbnN0IG0gPSB3aW5kb3dbJ20nXTtcclxuZXhwb3J0IGNvbnN0IGxvb3AgPSB3aW5kb3dbJ2xvb3AnXTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IEJsb2NrcyB9IGZyb20gXCIuL2Jsb2Nrcy9CbG9ja0ZhY3RvcnlcIjtcclxuaW1wb3J0IHsgRXZlbnRNYW5hZ2VyIH0gZnJvbSBcIi4vZXZlbnRzL0V2ZW50TWFuYWdlclwiO1xyXG5pbXBvcnQgeyBFeHRlbnNpb24gfSBmcm9tIFwiLi9leHRlbnNpb24vRXh0ZW5zaW9uXCI7XHJcbmltcG9ydCB7IEV4dGVuc2lvbk1hbmFnZXIgfSBmcm9tIFwiLi9leHRlbnNpb24vRXh0ZW5zaW9uTWFuYWdlclwiO1xyXG5pbXBvcnQgeyBEZWZHZW5lcmF0b3IgfSBmcm9tIFwiLi9tZXRhL0RlZkdlbmVyYXRvclwiO1xyXG5pbXBvcnQgeyBTbmFwIH0gZnJvbSBcIi4vc25hcC9TbmFwVXRpbHNcIjtcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4vZXZlbnRzL1NuYXBFdmVudHNcIjtcclxuaW1wb3J0IHsgT3ZlcnJpZGVSZWdpc3RyeSB9IGZyb20gXCIuL2V4dGVuZC9PdmVycmlkZVJlZ2lzdHJ5XCI7XHJcbmltcG9ydCB7IENsb3VkIH0gZnJvbSBcIi4vaW8vQ2xvdWRVdGlsc1wiO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAvLyBTbmFwIGlzIGxvYWRlZCBhZnRlciB0aGUgd2luZG93XHJcbiAgICAgICAgRXh0ZW5zaW9uTWFuYWdlci5pbml0KCk7XHJcbiAgICB9LCAwKTtcclxufSlcclxuXHJcbi8vIEZvciBjb252ZW5pZW5jZSwgbWFrZSBzbmFwIGFuZCB0aGUgRU0gZ2xvYmFsXHJcbndpbmRvd1snU25hcCddID0gU25hcDtcclxud2luZG93WydFeHRlbnNpb25NYW5hZ2VyJ10gPSBFeHRlbnNpb25NYW5hZ2VyO1xyXG5cclxuZXhwb3J0IHtcclxuICAgIEJsb2NrcyxcclxuICAgIENsb3VkLFxyXG4gICAgRGVmR2VuZXJhdG9yLFxyXG4gICAgRXZlbnRNYW5hZ2VyLFxyXG4gICAgRXZlbnRzLFxyXG4gICAgRXh0ZW5zaW9uLFxyXG4gICAgRXh0ZW5zaW9uTWFuYWdlcixcclxuICAgIE92ZXJyaWRlUmVnaXN0cnksXHJcbiAgICBTbmFwLFxyXG59O1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=