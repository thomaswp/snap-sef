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
            return block;
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
            this.needsInit = false;
            if (!SnapUtils_1.Snap.IDE)
                return;
            Snap_1.SpriteMorph.prototype.initBlocks();
            SnapUtils_1.Snap.IDE.flushBlocksCache();
            SnapUtils_1.Snap.IDE.refreshPalette();
            SnapUtils_1.Snap.IDE.categories.refreshEmpty();
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
        addProcessAction(action) {
            Snap_1.Process.prototype[this.selector] = action;
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
            let value = base.apply(this, args);
            if (doAfter)
                doAfter.apply(this, args);
            return value;
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
            let value = base.apply(this, originalArgs);
            if (doAfter)
                doAfter.call(this, info, ...originalArgs);
            return value;
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefGenerator = void 0;
const OverrideRegistry_1 = __webpack_require__(/*! ../extend/OverrideRegistry */ "./src/extend/OverrideRegistry.ts");
const Snap_1 = __webpack_require__(/*! ../snap/Snap */ "./src/snap/Snap.js");
const SnapUtils_1 = __webpack_require__(/*! ../snap/SnapUtils */ "./src/snap/SnapUtils.ts");
class TreeNode {
    constructor(name) {
        this.children = [];
        this.parent = null;
        this.name = name;
    }
    static findLCA(a, b) {
        let aPath = a.rootPath();
        let bPath = b.rootPath();
        let i = 0;
        while (i < aPath.length && i < bPath.length) {
            if (aPath[i] !== bPath[i])
                break;
            i++;
        }
        return aPath[i - 1];
    }
    rootPath() {
        let path = [];
        path.push(this);
        let node = this.parent;
        while (node) {
            path.push(node);
            node = node.parent;
        }
        return path.reverse();
    }
}
/**
 * This class automatically generates typescript definitions
 * from Snap's source code. To run, open Snap in a browser and
 * from the console run:
 * new SEF.DefGenerator().init().downloadAll()
 */
class DefGenerator {
    constructor() {
        this.classes = new Map;
        this.instrumenters = new Map();
        this.walkedThisFrame = false;
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
        // this.classes.forEach(c => c.addParentData(this.classes));
        // console.log(this.outputDefinitions());
        // console.log(this);
        // let limit = 100;
        for (let clazz of this.classes.values()) {
            if (clazz.isPureFunction)
                continue;
            let inst = new Instrumenter(clazz);
            this.instrumenters.set(inst.name, inst);
            // if (limit-- <= 0) break;
        }
        this.instrumenters.set(Snap_1.BlockMorph.name, new Instrumenter(this.classes.get(Snap_1.BlockMorph.name)));
        this.instrumenters.forEach(i => i.onProgressCallback = () => {
            if (this.walkedThisFrame)
                return;
            this.walkedThisFrame = true;
            this.walkObjects();
            this.saveInstrumenters();
            setTimeout(() => {
                this.walkedThisFrame = false;
            }, 1);
        });
        this.loadInstrumenters();
        this.walkObjects();
        this.hierarchy = this.createHierarchy();
        return this;
    }
    walkObjects(root = SnapUtils_1.Snap.world) {
        this.inspectObject(root);
        if (!root.children)
            return;
        for (let child of root.children) {
            this.walkObjects(child);
        }
    }
    inspectObject(obj) {
        if (!(obj instanceof Object && obj.constructor))
            return;
        let type = obj.constructor.name;
        for (let inst of this.instrumenters.values()) {
            if (obj instanceof inst.class) {
                inst.addObject(obj);
            }
        }
    }
    createHierarchy() {
        let hierarchy = new Map();
        this.classes.forEach(c => {
            let node = new TreeNode(c.name);
            hierarchy.set(c.name, node);
        });
        hierarchy.set('SnapType', new TreeNode('SnapType'));
        this.classes.forEach(c => {
            let node = hierarchy.get(c.name);
            let parent = c.uber;
            let parentNode = hierarchy.get(parent);
            if (parentNode == null)
                parentNode = hierarchy.get('SnapType');
            parentNode.children.push(node);
            node.parent = parentNode;
        });
        return hierarchy;
    }
    typesToTS(types, isField) {
        if (types == null || types.size == 0)
            return 'any';
        let typesArray = [...types];
        typesArray = typesArray.map(t => {
            if (t == "Map")
                return "Map<any, any>";
            if (t == "Array")
                return "any[]";
            if (t == "MouseScrollEvent")
                return "WheelEvent";
            return t;
        });
        if (types.size == 1)
            return typesArray[0];
        // If this can be a function, it might be defined as such in a parent class, so use any type
        if (isField && typesArray.includes('Function'))
            return 'any';
        let morphTypes = typesArray.filter(t => t.endsWith('Morph'));
        if (morphTypes.length > 1) {
            typesArray = typesArray.filter(t => !morphTypes.includes(t));
            let lca = morphTypes.map(t => this.hierarchy.get(t)).filter(t => t != null).reduce((a, b) => {
                return TreeNode.findLCA(a, b);
            });
            if (lca != null) {
                // console.log("Collapsed", morphTypes, "to", lca.name);
                typesArray.push(lca.name);
            }
        }
        return typesArray.join(' | ');
    }
    startLogging() {
        this.instrumenters.forEach(i => i.startLogging());
    }
    getInstrumentersJSON() {
        let json = {};
        [...this.instrumenters.values()]
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach((inst) => {
            json[inst.name] = inst.serialize();
        });
        return json;
    }
    saveInstrumenters() {
        let json = this.getInstrumentersJSON();
        localStorage['instrumenters'] = JSON.stringify(json);
    }
    loadInstrumenters() {
        let json = localStorage['instrumenters'];
        if (!json)
            return;
        json = JSON.parse(json);
        this.instrumenters.forEach((inst, name) => {
            if (!json[name])
                return;
            inst.deserialize(json[name]);
        });
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
}\n\n` + this.getClasses().map(c => c.toTS(this, this.instrumenters.get(c.name))).join('\n\n');
    }
    downloadAll() {
        this.downloadFile('Snap.js', this.outputExports());
        this.downloadFile('Snap.d.ts', this.outputDefinitions());
        this.downloadFile('types.json', JSON.stringify(this.getInstrumentersJSON(), null, 2));
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
function serializeMap(map) {
    return [...map.keys()]
        .sort((a, b) => a.localeCompare(b))
        .map(key => {
        let value = map.get(key);
        if (value instanceof Set)
            return [key, serializeSet(value)];
        return [key, serializeSetArray(value)];
    });
}
function serializeSetArray(arr) {
    return arr.map(a => serializeSet(a));
}
function serializeSet(set) {
    return [...set].sort((a, b) => a.localeCompare(b));
}
class Instrumenter {
    constructor(def) {
        this.fieldTypes = new Map();
        this.argTypes = new Map();
        this.called = new Set();
        this.assigned = new Set();
        this.def = def;
        this.class = window[this.name];
        this.proto = def.baseFunction.prototype;
        def.methods.forEach(m => {
            if (m.name === 'constructor')
                return;
            this.argTypes.set(m.name, []);
        });
        def.fields.forEach(f => {
            this.fieldTypes.set(f.name, new Set());
        });
    }
    get name() { return this.def.name; }
    get nFields() { return this.fieldTypes.size; }
    get nFuncs() { return this.argTypes.size; }
    startLogging() {
        for (let key of this.argTypes.keys()) {
            let myself = this;
            let fKey = key;
            // TODO: pass class for use here!!
            OverrideRegistry_1.OverrideRegistry.before(window[this.name], key, function () {
                let args = [...arguments];
                myself.updateArgMap(fKey, args);
            });
        }
    }
    serialize() {
        return {
            called: [...this.called],
            assigned: [...this.assigned],
            fieldTypes: serializeMap(this.fieldTypes),
            argTypes: serializeMap(this.argTypes),
        };
    }
    deserialize(json) {
        this.called = new Set(json.called);
        this.assigned = new Set(json.assigned);
        this.fieldTypes = new Map(json.fieldTypes.map(([key, value]) => {
            return [key, new Set(value)];
        }));
        this.argTypes = new Map(json.argTypes.map(([key, value]) => {
            return [key, value.map(a => new Set(a))];
        }));
    }
    getTypeOf(object) {
        let type = typeof (object);
        if (object instanceof Object && object.constructor)
            type = object.constructor.name;
        return type;
    }
    addObject(obj) {
        for (let key of this.fieldTypes.keys()) {
            let value = obj[key];
            if (value == null)
                continue;
            this.assigned.add(key);
            this.fieldTypes.get(key).add(this.getTypeOf(value));
        }
    }
    updateArgMap(key, args) {
        let types = this.argTypes.get(key);
        for (let i = 0; i < args.length; i++) {
            let arg = args[i];
            if (arg == null)
                continue;
            let type = this.getTypeOf(arg);
            while (types.length <= i) {
                types.push(new Set());
            }
            types[i].add(type);
        }
        if (!this.called.has(key)) {
            this.called.add(key);
            console.log(this.name, `${this.assigned.size} / ${this.nFields} fields; ` +
                `${this.called.size} / ${this.nFuncs} functions`, key, types);
            if (this.onProgressCallback) {
                this.onProgressCallback();
            }
        }
    }
}
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
    // No longer needed as newer TS version allows for function overloading/shadowing
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
            if (this.ignoreField(name))
                continue;
            this.fields.set(name, new Field(name, null, false));
        }
    }
    ignoreField(name) {
        if (this.name === 'ToggleButtonMorph') {
            return name === 'query';
        }
        else if (this.name === 'PaintCanvasMorph') {
            return name === 'isShiftPressed';
        }
    }
    exportStatement() {
        return `export const ${this.name} = window['${this.name}'];`;
    }
    doesParentHaveMethod(name, gen) {
        var _a, _b;
        let parent = (_a = gen.hierarchy.get(this.name)) === null || _a === void 0 ? void 0 : _a.parent;
        while (parent) {
            if ((_b = gen.classes.get(parent.name)) === null || _b === void 0 ? void 0 : _b.methods.has(name)) {
                console.log(this.name, "has field", name, "which overshadows parent method", parent.name + '.' + name);
                return true;
            }
            parent = parent.parent;
        }
        return false;
    }
    toTS(gen, instrumenter) {
        var _a, _b;
        if (this.functionProxy) {
            return `export function ${this.functionProxy.toTS(gen)}`;
        }
        let code = `export class ${this.name} extends ${this.uber ? this.uber : 'SnapType'}`;
        code += ` {\n`;
        let fKeys = [...this.fields.keys()];
        fKeys.sort();
        for (let fkey of fKeys) {
            if (this.doesParentHaveMethod(fkey, gen)) {
                // If the parent has a method with the same name as a field, ignore it
                continue;
            }
            let types = (_a = instrumenter === null || instrumenter === void 0 ? void 0 : instrumenter.fieldTypes) === null || _a === void 0 ? void 0 : _a.get(fkey);
            let typesString = gen.typesToTS(types, true);
            code += '    ' + this.fields.get(fkey).toTS(typesString) + '\n';
        }
        code += '\n';
        let mKeys = [...this.methods.keys()];
        mKeys.sort();
        for (let mKey of mKeys) {
            code += '    ' + this.methods.get(mKey).toTS(gen, (_b = instrumenter === null || instrumenter === void 0 ? void 0 : instrumenter.argTypes) === null || _b === void 0 ? void 0 : _b.get(mKey)) + '\n';
        }
        code += '}';
        return code;
    }
}
class Field {
    constructor(name, value, isStatic) {
        this.name = name;
        this.isStatic = isStatic;
        // if (value !== null && value !== undefined) {
        //     this.type = typeof(value);
        // }
    }
    toTS(types) {
        return `${this.isStatic ? 'static ' : ''}${this.name}: ${types};`;
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
    toTS(gen, argTypes) {
        const override = this.checkOverride();
        if (override)
            return override;
        let code = `${this.name}(`;
        let first = true;
        let index = 0;
        for (let name of this.paramNames) {
            if (!first)
                code += ', ';
            first = false;
            let type = gen.typesToTS(argTypes === null || argTypes === void 0 ? void 0 : argTypes[index], false);
            if (this.shouldIgnoreType(name))
                type = 'any';
            // if (argTypes) console.log(name, argTypes[index], type);
            code += `${name}?: ${type}`;
            index++;
        }
        code += ');';
        return code;
    }
    shouldIgnoreType(name) {
        // Init gets shaddowed consistently, so ignore types
        return this.name === 'init';
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
    static get globalVariables() {
        var _a;
        return (_a = this.stage) === null || _a === void 0 ? void 0 : _a.globalVariables();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O1VDOUxQO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ05BLHdHQUErQztBQXVCM0Msd0ZBdkJLLHFCQUFNLFFBdUJMO0FBdEJWLHdHQUFxRDtBQXlCakQsOEZBekJLLDJCQUFZLFFBeUJMO0FBeEJoQixxR0FBa0Q7QUEwQjlDLDJGQTFCSyxxQkFBUyxRQTBCTDtBQXpCYiwwSEFBZ0U7QUEwQjVELGtHQTFCSyxtQ0FBZ0IsUUEwQkw7QUF6QnBCLG9HQUFtRDtBQXFCL0MsOEZBckJLLDJCQUFZLFFBcUJMO0FBcEJoQiwyRkFBd0M7QUEwQnBDLHNGQTFCSyxnQkFBSSxRQTBCTDtBQXpCUixrR0FBNkM7QUFxQnpDLHdGQXJCSyxtQkFBTSxRQXFCTDtBQXBCVixvSEFBNkQ7QUF1QnpELGtHQXZCSyxtQ0FBZ0IsUUF1Qkw7QUF0QnBCLDBGQUF3QztBQWdCcEMsdUZBaEJLLGtCQUFLLFFBZ0JMO0FBZFQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDakMsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNaLGtDQUFrQztRQUNsQyxtQ0FBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM1QixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDVixDQUFDLENBQUM7QUFFRixvQ0FBb0M7QUFDcEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLGdCQUFJLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9TRUYvLi9zcmMvYmxvY2tzL0Jsb2NrRmFjdG9yeS50cyIsIndlYnBhY2s6Ly9TRUYvLi9zcmMvZGV2L0Rldk1vZGUudHMiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL2V2ZW50cy9FdmVudE1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL2V2ZW50cy9TbmFwRXZlbnRMaXN0ZW5lci50cyIsIndlYnBhY2s6Ly9TRUYvLi9zcmMvZXZlbnRzL1NuYXBFdmVudHMudHMiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL2V4dGVuZC9PdmVycmlkZVJlZ2lzdHJ5LnRzIiwid2VicGFjazovL1NFRi8uL3NyYy9leHRlbnNpb24vRXh0ZW5zaW9uLnRzIiwid2VicGFjazovL1NFRi8uL3NyYy9leHRlbnNpb24vRXh0ZW5zaW9uTWFuYWdlci50cyIsIndlYnBhY2s6Ly9TRUYvLi9zcmMvaW8vQ2xvdWRVdGlscy50cyIsIndlYnBhY2s6Ly9TRUYvLi9zcmMvbWV0YS9EZWZHZW5lcmF0b3IudHMiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL3NuYXAvU25hcFV0aWxzLnRzIiwid2VicGFjazovL1NFRi8uL3NyYy9zbmFwL1NuYXAuanMiLCJ3ZWJwYWNrOi8vU0VGL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1NFRi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vU0VGL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vU0VGL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE92ZXJyaWRlUmVnaXN0cnkgfSBmcm9tIFwiLi4vZXh0ZW5kL092ZXJyaWRlUmVnaXN0cnlcIjtcclxuaW1wb3J0IHsgU25hcCB9IGZyb20gXCIuLi9zbmFwL1NuYXBVdGlsc1wiO1xyXG5pbXBvcnQgeyBDb2xvciwgSURFX01vcnBoLCBsb2NhbGl6ZSwgUHJvY2VzcywgU3ByaXRlTW9ycGgsIFN0YWdlTW9ycGgsIFN5bnRheEVsZW1lbnRNb3JwaCwgVGhyZWFkTWFuYWdlciwgVG9nZ2xlTW9ycGggfSBmcm9tIFwiLi4vc25hcC9TbmFwXCI7XHJcblxyXG5leHBvcnQgbmFtZXNwYWNlIEJsb2NrcyB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEJsb2NrRmFjdG9yeSB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgYmxvY2tzOiBCbG9ja1tdO1xyXG4gICAgICAgIHByaXZhdGUgY2F0ZWdvcmllcyA9IFtdIGFzIHsgbmFtZTogc3RyaW5nLCBjb2xvcjogQ29sb3IgfVtdO1xyXG4gICAgICAgIHByaXZhdGUgbmVlZHNJbml0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLmJsb2NrcyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLm5lZWRzSW5pdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjb25zdCBteUJsb2NrcyA9IHRoaXMuYmxvY2tzO1xyXG4gICAgICAgICAgICBjb25zdCBteUNhdGVnb3JpZXMgPSB0aGlzLmNhdGVnb3JpZXM7XHJcbiAgICAgICAgICAgIGNvbnN0IG15c2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBvdmVycmlkZSA9IGZ1bmN0aW9uKGJhc2UsIGNhdGVnb3J5OiBzdHJpbmcsIGFsbDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrcyA9IGJhc2UuY2FsbCh0aGlzLCBjYXRlZ29yeSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hlY2tTcHJpdGUgPSB0aGlzIGluc3RhbmNlb2YgU3RhZ2VNb3JwaDtcclxuICAgICAgICAgICAgICAgIGxldCBhZGRlZCA9IDA7XHJcbiAgICAgICAgICAgICAgICBteUJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2suY2F0ZWdvcnkgPT09IGNhdGVnb3J5ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAhKGNoZWNrU3ByaXRlICYmIGJsb2NrLnNwcml0ZU9ubHkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChibG9jay50b3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5zcGxpY2UoYWRkZWQsIDAsIGJsb2NrLnRvQmxvY2tNb3JwaCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5zcGxpY2UoYWRkZWQsIDAsIGJsb2NrLnRvVG9nZ2xlKHRoaXMpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGVkKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja3MucHVzaChibG9jay50b1RvZ2dsZSh0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja3MucHVzaChibG9jay50b0Jsb2NrTW9ycGgoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBibG9ja3M7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBPdmVycmlkZVJlZ2lzdHJ5LmV4dGVuZChTcHJpdGVNb3JwaCwgJ2luaXRCbG9ja3MnLCBmdW5jdGlvbihiYXNlKSB7XHJcbiAgICAgICAgICAgICAgICBiYXNlLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBteUNhdGVnb3JpZXMuZm9yRWFjaChjID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBteXNlbGYuYWRkQ2F0ZWdvcnlUb1BhbGxldHRlKGMubmFtZSwgYy5jb2xvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIG15QmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmFkZFRvTWFwKFNwcml0ZU1vcnBoLnByb3RvdHlwZS5ibG9ja3MpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgT3ZlcnJpZGVSZWdpc3RyeS5leHRlbmQoU3ByaXRlTW9ycGgsICdibG9ja1RlbXBsYXRlcycsIG92ZXJyaWRlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIE92ZXJyaWRlUmVnaXN0cnkuZXh0ZW5kKFN0YWdlTW9ycGgsICdibG9ja1RlbXBsYXRlcycsIG92ZXJyaWRlLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICBPdmVycmlkZVJlZ2lzdHJ5LmJlZm9yZShJREVfTW9ycGgsICdjcmVhdGVDYXRlZ29yaWVzJywgZnVuY3Rpb24oYmFzZSkge1xyXG4gICAgICAgICAgICAgICAgbXlDYXRlZ29yaWVzLmZvckVhY2goYyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbXlzZWxmLmFkZENhdGVnb3J5VG9QYWxsZXR0ZShjLm5hbWUsIGMuY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHRoaXMucXVldWVSZWZyZXNoKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWdpc3RlckJsb2NrKGJsb2NrOiBCbG9jaykge1xyXG4gICAgICAgICAgICB0aGlzLmJsb2Nrcy5wdXNoKGJsb2NrKTtcclxuICAgICAgICAgICAgdGhpcy5xdWV1ZVJlZnJlc2goKTtcclxuICAgICAgICAgICAgcmV0dXJuIGJsb2NrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcXVldWVSZWZyZXNoKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5uZWVkc0luaXQpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5uZWVkc0luaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5uZWVkc0luaXQpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICB9LCAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlZnJlc2goKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmVlZHNJbml0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICghU25hcC5JREUpIHJldHVybjtcclxuICAgICAgICAgICAgU3ByaXRlTW9ycGgucHJvdG90eXBlLmluaXRCbG9ja3MoKTtcclxuICAgICAgICAgICAgU25hcC5JREUuZmx1c2hCbG9ja3NDYWNoZSgpO1xyXG4gICAgICAgICAgICBTbmFwLklERS5yZWZyZXNoUGFsZXR0ZSgpO1xyXG4gICAgICAgICAgICBTbmFwLklERS5jYXRlZ29yaWVzLnJlZnJlc2hFbXB0eSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBhZGRDYXRlZ29yeVRvUGFsbGV0dGUobmFtZTogc3RyaW5nLCBjb2xvcjogQ29sb3IpIHtcclxuICAgICAgICAgICAgLy8gVE9ETzogRml4IHRoaXMgc28gdGhhdCB0aGUgbGF5b3V0IHdvcmtzXHJcbiAgICAgICAgICAgIC8vIFNwcml0ZU1vcnBoLnByb3RvdHlwZS5jYXRlZ29yaWVzLnB1c2gobmFtZSk7XHJcbiAgICAgICAgICAgIC8vIFNwcml0ZU1vcnBoLnByb3RvdHlwZS5ibG9ja0NvbG9yW25hbWVdID0gY29sb3I7XHJcbiAgICAgICAgICAgIGlmICghU3ByaXRlTW9ycGgucHJvdG90eXBlLmN1c3RvbUNhdGVnb3JpZXMuaGFzKG5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICBTbmFwLklERS5hZGRQYWxldHRlQ2F0ZWdvcnkobmFtZSwgY29sb3IpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYWRkQ2F0ZWdvcnkobmFtZTogc3RyaW5nLCBjb2xvcjogQ29sb3IpIHtcclxuICAgICAgICAgICAgdGhpcy5jYXRlZ29yaWVzLnB1c2goeyBuYW1lLCBjb2xvciB9KTtcclxuICAgICAgICAgICAgdGhpcy5hZGRDYXRlZ29yeVRvUGFsbGV0dGUobmFtZSwgY29sb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYWRkTGFiZWxlZElucHV0KG5hbWU6IHN0cmluZywgb3B0aW9uczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSwgLi4udGFnczogSW5wdXRUYWdbXSkge1xyXG4gICAgICAgICAgICBpZiAoU3ludGF4RWxlbWVudE1vcnBoLnByb3RvdHlwZS5sYWJlbFBhcnRzW25hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYElucHV0IHR5cGUgd2l0aCBsYWJlbCAke25hbWV9IGFscmVhZHkgZXhpc3RzLmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEVuc3VyZSB0aGF0IGFsbCBzdHJpbmcgdmFsdWVzIGFyZSBhcnJheS1lbmNsb3NlZFxyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKGsgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZihvcHRpb25zW2tdKSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW2tdID0gW29wdGlvbnNba11dO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBTeW50YXhFbGVtZW50TW9ycGgucHJvdG90eXBlLmxhYmVsUGFydHNbbmFtZV0gPSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnaW5wdXQnLFxyXG4gICAgICAgICAgICAgICAgdGFnczogdGFncy5qb2luKCcgJyksXHJcbiAgICAgICAgICAgICAgICBtZW51OiBvcHRpb25zLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZW51bSBJbnB1dFRhZyB7XHJcbiAgICAgICAgLyoqIFZhbHVlcyB3aWxsIGJlIGludGVycHJldGVkIGFzIG51bWVyaWMuICovXHJcbiAgICAgICAgTnVtYmVyaWMgPSAnbnVtZXJpYycsXHJcbiAgICAgICAgUmVhZE9ubHkgPSAncmVhZC1vbmx5JyxcclxuICAgICAgICBVbmV2YWx1YXRlZCA9ICd1bmV2YWx1YXRlZCcsXHJcbiAgICAgICAgLyoqIFRoZSBpbnB1dCBjYW5ub3QgYmUgcmVwbGFjZWQgd2l0aCBhIHJlcG9ydGVyLiAqL1xyXG4gICAgICAgIFN0YXRpYyA9ICdzdGF0aWMnLFxyXG4gICAgICAgIExhbmRzY2FwZSA9ICdsYW5kc2NhcGUnLFxyXG4gICAgICAgIC8qKiBNb25vc3BhY2UgZm9udC4gKi9cclxuICAgICAgICBNb25vc3BhY2UgPSAnbW9ub3NwYWNlJyxcclxuICAgICAgICBGYWRpbmcgPSAnZmFkaW5nJyxcclxuICAgICAgICBQcm90ZWN0ZWQgPSAncHJvdGVjdGVkJyxcclxuICAgICAgICBMb29wID0gJ2xvb3AnLFxyXG4gICAgICAgIC8qKiBUaGUgaW5wdXQgaXMgYSBsYW1iZGEgZXhwcmVzc2lvbi4gKi9cclxuICAgICAgICBMYW1iZGEgPSAnbGFtYmRhJyxcclxuICAgICAgICAvKiogVGhlIGlucHV0IGlzIGVkaXRlZCB1c2luZyBhIGN1c3RvbSB3aWRnZXQuICovXHJcbiAgICAgICAgV2lkZ2V0ID0gJ3dpZGdldCdcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZW51bSBCbG9ja1R5cGUge1xyXG4gICAgICAgIENvbW1hbmQgPSAnY29tbWFuZCcsXHJcbiAgICAgICAgUmVwb3J0ZXIgPSAncmVwb3J0ZXInLFxyXG4gICAgICAgIFByZWRpY2F0ZSA9ICdwcmVkaWNhdGUnLFxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBCbG9jayB7XHJcblxyXG4gICAgICAgIHNlbGVjdG9yOiBzdHJpbmc7XHJcbiAgICAgICAgc3BlYzogc3RyaW5nO1xyXG4gICAgICAgIGRlZmF1bHRzOiBhbnlbXTtcclxuICAgICAgICB0eXBlOiBCbG9ja1R5cGU7XHJcbiAgICAgICAgY2F0ZWdvcnk6IHN0cmluZztcclxuICAgICAgICBzcHJpdGVPbmx5OiBib29sZWFuO1xyXG4gICAgICAgIHRvcDogYm9vbGVhbjtcclxuICAgICAgICB0b2dnbGFibGU6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBzZWxlY3Rvcjogc3RyaW5nLCBzcGVjOiBzdHJpbmcsIGRlZmF1bHRzOiBhbnlbXSwgdHlwZTogQmxvY2tUeXBlLFxyXG4gICAgICAgICAgICBjYXRlZ29yeTogc3RyaW5nLCBzcHJpdGVPbmx5ID0gZmFsc2UsIHRvcCA9IGZhbHNlLCB0b2dnbGFibGUgPSBmYWxzZSxcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yO1xyXG4gICAgICAgICAgICB0aGlzLnNwZWMgPSBzcGVjO1xyXG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHM7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgICAgIHRoaXMuY2F0ZWdvcnkgPSBjYXRlZ29yeTtcclxuICAgICAgICAgICAgdGhpcy5zcHJpdGVPbmx5ID0gc3ByaXRlT25seTtcclxuICAgICAgICAgICAgdGhpcy50b3AgPSB0b3A7XHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xhYmxlID0gdG9nZ2xhYmxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYWRkVG9NYXAobWFwKSB7XHJcbiAgICAgICAgICAgIG1hcFt0aGlzLnNlbGVjdG9yXSA9IHtcclxuICAgICAgICAgICAgICAgIG9ubHk6IHRoaXMuc3ByaXRlT25seSA/IFNwcml0ZU1vcnBoIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlLFxyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IHRoaXMuY2F0ZWdvcnksXHJcbiAgICAgICAgICAgICAgICBzcGVjOiBsb2NhbGl6ZSh0aGlzLnNwZWMpLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdHM6IHRoaXMuZGVmYXVsdHMsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b0Jsb2NrTW9ycGgoKSB7XHJcbiAgICAgICAgICAgIGlmIChTdGFnZU1vcnBoLnByb3RvdHlwZS5oaWRkZW5QcmltaXRpdmVzW3RoaXMuc2VsZWN0b3JdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbmV3QmxvY2sgPVxyXG4gICAgICAgICAgICAgICAgU3ByaXRlTW9ycGgucHJvdG90eXBlLmJsb2NrRm9yU2VsZWN0b3IodGhpcy5zZWxlY3RvciwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGlmICghbmV3QmxvY2spIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQ2Fubm90IGluaXRpYWxpemUgYmxvY2snLCB0aGlzLnNlbGVjdG9yKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5ld0Jsb2NrLmlzVGVtcGxhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3QmxvY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b1RvZ2dsZShzcHJpdGUgOiBTcHJpdGVNb3JwaCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudG9nZ2xhYmxlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdG9yID0gdGhpcy5zZWxlY3RvcjtcclxuICAgICAgICAgICAgaWYgKFN0YWdlTW9ycGgucHJvdG90eXBlLmhpZGRlblByaW1pdGl2ZXNbc2VsZWN0b3JdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgaW5mbyA9IFNwcml0ZU1vcnBoLnByb3RvdHlwZS5ibG9ja3Nbc2VsZWN0b3JdO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFRvZ2dsZU1vcnBoKFxyXG4gICAgICAgICAgICAgICAgJ2NoZWNrYm94JyxcclxuICAgICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlLnRvZ2dsZVdhdGNoZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGl6ZShpbmZvLnNwZWMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcHJpdGUuYmxvY2tDb2xvcltpbmZvLmNhdGVnb3J5XVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbnVsbCxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3ByaXRlLnNob3dpbmdXYXRjaGVyKHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBudWxsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhZGRTcHJpdGVBY3Rpb24oYWN0aW9uOiAodGhpczogU3ByaXRlTW9ycGgsIC4uLmFyZ3MgOiBhbnkpID0+IGFueSkgOiBCbG9jayB7XHJcbiAgICAgICAgICAgIFNwcml0ZU1vcnBoLnByb3RvdHlwZVt0aGlzLnNlbGVjdG9yXSA9XHJcbiAgICAgICAgICAgICAgICBTdGFnZU1vcnBoLnByb3RvdHlwZVt0aGlzLnNlbGVjdG9yXSA9IGFjdGlvbjtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhZGRQcm9jZXNzQWN0aW9uKGFjdGlvbjogKHRoaXM6IFByb2Nlc3MsIC4uLmFyZ3MgOiBhbnkpID0+IGFueSkgOiBCbG9jayB7XHJcbiAgICAgICAgICAgIFByb2Nlc3MucHJvdG90eXBlW3RoaXMuc2VsZWN0b3JdID0gYWN0aW9uO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgRXh0ZW5zaW9uTWFuYWdlciB9IGZyb20gXCIuLi9leHRlbnNpb24vRXh0ZW5zaW9uTWFuYWdlclwiO1xyXG5pbXBvcnQgeyBTbmFwIH0gZnJvbSBcIi4uL3NuYXAvU25hcFV0aWxzXCI7XHJcblxyXG5jb25zdCBERVZfTU9ERV9VUkxTID0gW1xyXG4gICAgXCJsb2NhbGhvc3RcIixcclxuICAgIFwiMTI3LjAuMC4xXCIsXHJcbl07XHJcblxyXG5jb25zdCBERVZfTU9ERV9VUkxfUEFSQU0gPSBcImRldk1vZGVcIjtcclxuXHJcbmNvbnN0IExBU1RfUFJPSkVDVF9LRVkgPSBcImxhc3RQcm9qZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRGV2TW9kZSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiB0cnVlLCB0aGlzIG1lYW5zIHRoZSB1c2VyIGlzIHJ1bm5pbmcgdGhlIGVkaXRvciBsb2NhbGx5IG9yIGhhc1xyXG4gICAgICogc2V0IHRoZSBkZXZNb2RlIFVSTCBwYXJhbWV0ZXIgdG8gdHJ1ZS4gV2hlbiBkZXZNb2RlIGlzIGVuYWJsZWQsXHJcbiAgICAgKiB0aGUgZWRpdG9yIHdpbGwgYXV0b21hdGljYWxseSBzYXZlIHRoZSBwcm9qZWN0IHRvIGxvY2FsIHN0b3JhZ2VcclxuICAgICAqIGFmdGVyIGV2ZXJ5IGNoYW5nZSBhbmQgcmVsb2FkIGl0IG9uIHBhZ2UgbG9hZC5cclxuICAgICAqL1xyXG4gICAgcmVhZG9ubHkgaXNEZXZNb2RlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIGxhc3RQcm9qZWN0WE1MOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pc0Rldk1vZGUgPSBERVZfTU9ERV9VUkxTLnNvbWUodXJsID0+IHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzKHVybCkpO1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xyXG4gICAgICAgIGlmIChwYXJhbXMuaGFzKERFVl9NT0RFX1VSTF9QQVJBTSkpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0Rldk1vZGUgPSBwYXJhbXMuZ2V0KERFVl9NT0RFX1VSTF9QQVJBTSkgPT0gXCJ0cnVlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzRGV2TW9kZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbGFzdFByb2plY3QgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShMQVNUX1BST0pFQ1RfS0VZKTtcclxuICAgICAgICBpZiAobGFzdFByb2plY3QgJiYgbGFzdFByb2plY3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAvLyBUT0RPOiBSaWdodCBub3cgd2Ugc2V0IHRvIDEwbXMgdG8gd2FpdCB1bnRpbCBhZnRlciBibG9ja3MgYXJlXHJcbiAgICAgICAgICAgIC8vIGxvYWRlZCAtIHNob3VsZCBiZSBhIGNhbGxiYWNrIHdheSB0byBkbyBpdFxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIFNuYXAuSURFLmxvYWRQcm9qZWN0WE1MKGxhc3RQcm9qZWN0KTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTG9hZGluZyBsYXN0IHByb2plY3RcIiwgU25hcC5JREUuZ2V0UHJvamVjdE5hbWUoKSk7XHJcbiAgICAgICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3aW5kb3cub25iZWZvcmV1bmxvYWQgPSAoKSA9PiB7fTtcclxuICAgICAgICBFeHRlbnNpb25NYW5hZ2VyLmV2ZW50cy5UcmFjZS5hZGRHbG9iYWxMaXN0ZW5lcigobWVzc2FnZSkgPT4ge1xyXG4gICAgICAgICAgICAvLyBXYWl0IGZvciBuZXh0IGZyYW1lLCBzaW5jZSBzb21lIGVkaXRzIG9jY3VyIGFmdGVyIHRoZSBsb2dcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgeG1sID0gU25hcC5JREUuZ2V0UHJvamVjdFhNTCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHhtbCAhPSB0aGlzLmxhc3RQcm9qZWN0WE1MKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0UHJvamVjdFhNTCA9IHhtbDtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShMQVNUX1BST0pFQ1RfS0VZLCB4bWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2F2ZWQgcHJvamVjdCBhZnRlcjogXCIgKyBtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuL1NuYXBFdmVudHNcIjtcclxuaW1wb3J0IHsgU25hcEV2ZW50TGlzdGVuZXIgfSBmcm9tIFwiLi9TbmFwRXZlbnRMaXN0ZW5lclwiO1xyXG5pbXBvcnQgeyBTbmFwRXZlbnRNYW5hZ2VyIH0gZnJvbSBcIi4uL3NuYXAvU25hcFwiO1xyXG5pbXBvcnQgeyBTbmFwIH0gZnJvbSBcIi4uL3NuYXAvU25hcFV0aWxzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRXZlbnRNYW5hZ2VyIHtcclxuXHJcbiAgICBUcmFjZTogU25hcEV2ZW50TWFuYWdlcjtcclxuICAgIGxpc3RlbmVyczogTWFwPHN0cmluZywgU25hcEV2ZW50TGlzdGVuZXJbXT47XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5UcmFjZSA9IHdpbmRvd1snVHJhY2UnXTtcclxuICAgICAgICBpZiAoIXRoaXMuVHJhY2UpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIEV2ZW50IE1hbmFnZXIgLSBUcmFjZSBkb2VzIG5vdCBleGlzdCEnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5UcmFjZS5hZGRHbG9iYWxMaXN0ZW5lcigobWVzc2FnZTogc3RyaW5nLCBkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVFdmVudChtZXNzYWdlLCBkYXRhKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcihuZXcgRXZlbnRzLkJsb2NrLkNsaWNrUnVuTGlzdGVuZXIoKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIFNuYXAubGFzdFJ1bkJsb2NrID0gU25hcC5nZXRCbG9jayhpZCk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlRXZlbnQobWVzc2FnZTogc3RyaW5nLCBkYXRhOiBhbnkpIHtcclxuICAgICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnMuZ2V0KG1lc3NhZ2UpO1xyXG4gICAgICAgIGlmICghbGlzdGVuZXJzKSByZXR1cm47XHJcbiAgICAgICAgbGlzdGVuZXJzLmZvckVhY2gobCA9PiB7XHJcbiAgICAgICAgICAgIGxldCBhcmdzID0gbC5jb252ZXJ0QXJncyhkYXRhKTtcclxuICAgICAgICAgICAgbC5jYWxsYmFjayhhcmdzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRMaXN0ZW5lcihsaXN0ZW5lcjogU25hcEV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgICBpZiAoIWxpc3RlbmVyKSByZXR1cm47XHJcbiAgICAgICAgbGV0IHR5cGUgPSBsaXN0ZW5lci50eXBlO1xyXG4gICAgICAgIGlmICghdGhpcy5saXN0ZW5lcnMuaGFzKHR5cGUpKSB0aGlzLmxpc3RlbmVycy5zZXQodHlwZSwgW10pO1xyXG4gICAgICAgIGxldCBsaXN0ID0gdGhpcy5saXN0ZW5lcnMuZ2V0KGxpc3RlbmVyLnR5cGUpO1xyXG4gICAgICAgIGxpc3QucHVzaChsaXN0ZW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgdGVzdCgpIHtcclxuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKG5ldyBFdmVudHMuQmxvY2suUmVuYW1lTGlzdGVuZXIoYXJncyA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFyZ3MuaWQuc2VsZWN0b3IpO1xyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKG5ldyBFdmVudHMuSW5wdXRTbG90Lk1lbnVJdGVtU2VsZWN0ZWRMaXN0ZW5lcihhcmdzID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYXJncy5pdGVtKTtcclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcihuZXcgRXZlbnRzLkJsb2NrLkNyZWF0ZWRMaXN0ZW5lcihhcmdzID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYXJncy5pZCk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIobmV3IEV2ZW50cy5JREUuQWRkU3ByaXRlTGlzdGVuZXIoYXJncyA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFyZ3MubmFtZSk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcclxuICAgIHJlYWRvbmx5IGNhbGxiYWNrOiBGdW5jdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlOiBzdHJpbmcsIGNhbGxiYWNrOiAoYXJnczogU25hcEV2ZW50QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnZlcnRBcmdzKGRhdGE6IGFueSkge1xyXG4gICAgICAgIGlmIChkYXRhID09IG51bGwpIHJldHVybiB7fTtcclxuICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSByZXR1cm4gZGF0YTtcclxuICAgICAgICBsZXQgb2JqID0ge307XHJcbiAgICAgICAgb2JqW3RoaXMuZ2V0VmFsdWVLZXkoKV0gPSBkYXRhO1xyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAndmFsdWUnOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU25hcEV2ZW50QXJncyB7XHJcblxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEVtcHR5QXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG5cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBWYWx1ZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgIHZhbHVlOiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQmxvY2tJREFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgIGlkOiBudW1iZXI7XHJcbiAgICBzZWxlY3Rvcjogc3RyaW5nO1xyXG4gICAgdGVtcGxhdGU6IGJvb2xlYW47XHJcbiAgICBzcGVjOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSW5wdXRJREFyZ3MgZXh0ZW5kcyBCbG9ja0lEQXJncyB7XHJcbiAgICBhcmdJbmRleDogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbUJsb2NrRGVmQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgc3BlYzogc3RyaW5nO1xyXG4gICAgY2F0ZWdvcnk6IHN0cmluZztcclxuICAgIHR5cGU6IHN0cmluZztcclxuICAgIGd1aWQ6IHN0cmluZztcclxuICAgIGlzR2xvYmFsOiBib29sZWFuO1xyXG59IiwiaW1wb3J0IHsgQmxvY2tJREFyZ3MsIEVtcHR5QXJncywgSW5wdXRJREFyZ3MsIEN1c3RvbUJsb2NrRGVmQXJncywgU25hcEV2ZW50QXJncywgU25hcEV2ZW50TGlzdGVuZXIsIFZhbHVlQXJncyB9IGZyb20gXCIuL1NuYXBFdmVudExpc3RlbmVyXCI7XHJcbmV4cG9ydCBuYW1lc3BhY2UgRXZlbnRzIHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgQmxvY2sge1xyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQ2xpY2tSdW5MaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2suY2xpY2tSdW4nO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKENsaWNrUnVuTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBDbGlja1N0b3BSdW5MaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2suY2xpY2tTdG9wUnVuJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEJsb2NrSURBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihDbGlja1N0b3BSdW5MaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIENyZWF0ZWRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2suY3JlYXRlZCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBCbG9ja0lEQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ3JlYXRlZExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRHJhZ0Rlc3Ryb3lMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2suZHJhZ0Rlc3Ryb3knO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKERyYWdEZXN0cm95TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR3JhYmJlZEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IEJsb2NrSURBcmdzO1xyXG4gICAgICAgICAgICBvcmlnaW46IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBHcmFiYmVkTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLmdyYWJiZWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogR3JhYmJlZEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEdyYWJiZWRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZWZhY3RvclZhckFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IEJsb2NrSURBcmdzO1xyXG4gICAgICAgICAgICBvbGROYW1lOiBhbnk7XHJcbiAgICAgICAgICAgIG5ld05hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBSZWZhY3RvclZhckxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay5yZWZhY3RvclZhcic7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBSZWZhY3RvclZhckFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFJlZmFjdG9yVmFyTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVmYWN0b3JWYXJFcnJvckFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IEJsb2NrSURBcmdzO1xyXG4gICAgICAgICAgICB3aGVyZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFJlZmFjdG9yVmFyRXJyb3JMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2sucmVmYWN0b3JWYXJFcnJvcic7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBSZWZhY3RvclZhckVycm9yQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoUmVmYWN0b3JWYXJFcnJvckxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlbGFiZWxBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlkOiBCbG9ja0lEQXJncztcclxuICAgICAgICAgICAgc2VsZWN0b3I6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBSZWxhYmVsTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLnJlbGFiZWwnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUmVsYWJlbEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFJlbGFiZWxMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZW5hbWVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlkOiBCbG9ja0lEQXJncztcclxuICAgICAgICAgICAgbmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFJlbmFtZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay5yZW5hbWUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUmVuYW1lQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoUmVuYW1lTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBSaW5naWZ5TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLnJpbmdpZnknO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFJpbmdpZnlMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNjcmlwdFBpY0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay5zY3JpcHRQaWMnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNjcmlwdFBpY0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU2hvd0hlbHBMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2suc2hvd0hlbHAnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNob3dIZWxwTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU25hcHBlZEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IEJsb2NrSURBcmdzO1xyXG4gICAgICAgICAgICBvcmlnaW46IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTbmFwcGVkTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLnNuYXBwZWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogU25hcHBlZEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNuYXBwZWRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFRvZ2dsZVRyYW5zaWVudFZhcmlhYmxlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLnRvZ2dsZVRyYW5zaWVudFZhcmlhYmxlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFZhbHVlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVG9nZ2xlVHJhbnNpZW50VmFyaWFibGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFVucmluZ2lmeUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay51bnJpbmdpZnknO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFVucmluZ2lmeUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgVXNlckRlc3Ryb3lMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2sudXNlckRlc3Ryb3knO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFVzZXJEZXN0cm95TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBCbG9ja0VkaXRvciB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBDYW5jZWxMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2tFZGl0b3IuY2FuY2VsJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEN1c3RvbUJsb2NrRGVmQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ2FuY2VsTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBDaGFuZ2VUeXBlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrRWRpdG9yLmNoYW5nZVR5cGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQ3VzdG9tQmxvY2tEZWZBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihDaGFuZ2VUeXBlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBPa0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9ja0VkaXRvci5vayc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBDdXN0b21CbG9ja0RlZkFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE9rTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTdGFydExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9ja0VkaXRvci5zdGFydCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBDdXN0b21CbG9ja0RlZkFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFN0YXJ0TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgVXBkYXRlQmxvY2tMYWJlbEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgbmV3RnJhZ21lbnQ6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBVcGRhdGVCbG9ja0xhYmVsTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrRWRpdG9yLnVwZGF0ZUJsb2NrTGFiZWwnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogVXBkYXRlQmxvY2tMYWJlbEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFVwZGF0ZUJsb2NrTGFiZWxMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduZXdGcmFnbWVudCc7IH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgQmxvY2tUeXBlRGlhbG9nIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIENhbmNlbExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9ja1R5cGVEaWFsb2cuY2FuY2VsJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ2FuY2VsTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBDaGFuZ2VCbG9ja1R5cGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2tUeXBlRGlhbG9nLmNoYW5nZUJsb2NrVHlwZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKENoYW5nZUJsb2NrVHlwZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgTmV3QmxvY2tMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2tUeXBlRGlhbG9nLm5ld0Jsb2NrJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoTmV3QmxvY2tMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE9rTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrVHlwZURpYWxvZy5vayc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE9rTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBCb29sZWFuU2xvdE1vcnBoIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBUb2dnbGVWYWx1ZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IElucHV0SURBcmdzO1xyXG4gICAgICAgICAgICB2YWx1ZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFRvZ2dsZVZhbHVlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jvb2xlYW5TbG90TW9ycGgudG9nZ2xlVmFsdWUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogVG9nZ2xlVmFsdWVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihUb2dnbGVWYWx1ZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgQ29sb3JBcmcge1xyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIENoYW5nZUNvbG9yQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpZDogSW5wdXRJREFyZ3M7XHJcbiAgICAgICAgICAgIGNvbG9yOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQ2hhbmdlQ29sb3JMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQ29sb3JBcmcuY2hhbmdlQ29sb3InO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQ2hhbmdlQ29sb3JBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihDaGFuZ2VDb2xvckxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgQ29tbWFuZEJsb2NrIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBXcmFwQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpZDogQmxvY2tJREFyZ3M7XHJcbiAgICAgICAgICAgIHRhcmdldDogQmxvY2tJREFyZ3M7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgV3JhcExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdDb21tYW5kQmxvY2sud3JhcCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBXcmFwQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoV3JhcExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgSURFIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBBZGRTcHJpdGVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBBZGRTcHJpdGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmFkZFNwcml0ZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBBZGRTcHJpdGVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihBZGRTcHJpdGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQ2hhbmdlQ2F0ZWdvcnlBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGNhdGVnb3J5OiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQ2hhbmdlQ2F0ZWdvcnlMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmNoYW5nZUNhdGVnb3J5JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IENoYW5nZUNhdGVnb3J5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ2hhbmdlQ2F0ZWdvcnlMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICdjYXRlZ29yeSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRGVsZXRlQ3VzdG9tQmxvY2tMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmRlbGV0ZUN1c3RvbUJsb2NrJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEN1c3RvbUJsb2NrRGVmQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoRGVsZXRlQ3VzdG9tQmxvY2tMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEdXBsaWNhdGVTcHJpdGVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBEdXBsaWNhdGVTcHJpdGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmR1cGxpY2F0ZVNwcml0ZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBEdXBsaWNhdGVTcHJpdGVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihEdXBsaWNhdGVTcHJpdGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBFeHBvcnRHbG9iYWxCbG9ja3NMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmV4cG9ydEdsb2JhbEJsb2Nrcyc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEV4cG9ydEdsb2JhbEJsb2Nrc0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEV4cG9ydFByb2VqY3RBc0Nsb3VkRGF0YUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgbmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEV4cG9ydFByb2VqY3RBc0Nsb3VkRGF0YUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuZXhwb3J0UHJvZWpjdEFzQ2xvdWREYXRhJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEV4cG9ydFByb2VqY3RBc0Nsb3VkRGF0YUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEV4cG9ydFByb2VqY3RBc0Nsb3VkRGF0YUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBvcnRQcm9qZWN0QXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRXhwb3J0UHJvamVjdExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuZXhwb3J0UHJvamVjdCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFeHBvcnRQcm9qZWN0QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoRXhwb3J0UHJvamVjdExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBvcnRQcm9qZWN0TWVkaWFBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBFeHBvcnRQcm9qZWN0TWVkaWFMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmV4cG9ydFByb2plY3RNZWRpYSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFeHBvcnRQcm9qZWN0TWVkaWFBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihFeHBvcnRQcm9qZWN0TWVkaWFMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0UHJvamVjdE5vTWVkaWFBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBFeHBvcnRQcm9qZWN0Tm9NZWRpYUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuZXhwb3J0UHJvamVjdE5vTWVkaWEnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRXhwb3J0UHJvamVjdE5vTWVkaWFBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihFeHBvcnRQcm9qZWN0Tm9NZWRpYUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEV4cG9ydFNjcmlwdHNQaWN0dXJlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5leHBvcnRTY3JpcHRzUGljdHVyZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEV4cG9ydFNjcmlwdHNQaWN0dXJlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0U3ByaXRlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRXhwb3J0U3ByaXRlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5leHBvcnRTcHJpdGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRXhwb3J0U3ByaXRlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoRXhwb3J0U3ByaXRlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnbmFtZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgR3JlZW5GbGFnTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5ncmVlbkZsYWcnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihHcmVlbkZsYWdMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBMb2FkRmFpbGVkQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBlcnI6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBMb2FkRmFpbGVkTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5sb2FkRmFpbGVkJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IExvYWRGYWlsZWRBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihMb2FkRmFpbGVkTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnZXJyJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBOZXdQcm9qZWN0TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5uZXdQcm9qZWN0JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoTmV3UHJvamVjdExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgT3BlbkJsb2Nrc1N0cmluZ0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUub3BlbkJsb2Nrc1N0cmluZyc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE9wZW5CbG9ja3NTdHJpbmdMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE9wZW5DbG91ZERhdGFTdHJpbmdMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLm9wZW5DbG91ZERhdGFTdHJpbmcnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihPcGVuQ2xvdWREYXRhU3RyaW5nTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBPcGVuTWVkaWFTdHJpbmdMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLm9wZW5NZWRpYVN0cmluZyc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE9wZW5NZWRpYVN0cmluZ0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE9wZW5Qcm9qZWN0QXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgT3BlblByb2plY3RMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLm9wZW5Qcm9qZWN0JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IE9wZW5Qcm9qZWN0QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoT3BlblByb2plY3RMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBPcGVuUHJvamVjdFN0cmluZ0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUub3BlblByb2plY3RTdHJpbmcnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihPcGVuUHJvamVjdFN0cmluZ0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgT3BlblNwcml0ZXNTdHJpbmdMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLm9wZW5TcHJpdGVzU3RyaW5nJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoT3BlblNwcml0ZXNTdHJpbmdMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE9wZW5lZExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUub3BlbmVkJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoT3BlbmVkTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUGFpbnROZXdTcHJpdGVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBQYWludE5ld1Nwcml0ZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUucGFpbnROZXdTcHJpdGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUGFpbnROZXdTcHJpdGVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihQYWludE5ld1Nwcml0ZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFBhdXNlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5wYXVzZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFBhdXNlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUm90YXRpb25TdHlsZUNoYW5nZWRBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIHJvdGF0aW9uU3R5bGU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBSb3RhdGlvblN0eWxlQ2hhbmdlZExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUucm90YXRpb25TdHlsZUNoYW5nZWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUm90YXRpb25TdHlsZUNoYW5nZWRBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihSb3RhdGlvblN0eWxlQ2hhbmdlZExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ3JvdGF0aW9uU3R5bGUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTYXZlUHJvamVjdFRvQ2xvdWRBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTYXZlUHJvamVjdFRvQ2xvdWRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnNhdmVQcm9qZWN0VG9DbG91ZCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBTYXZlUHJvamVjdFRvQ2xvdWRBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTYXZlUHJvamVjdFRvQ2xvdWRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2VsZWN0U3ByaXRlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU2VsZWN0U3ByaXRlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5zZWxlY3RTcHJpdGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogU2VsZWN0U3ByaXRlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoU2VsZWN0U3ByaXRlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnbmFtZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNldExhbmd1YWdlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBsYW5nOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU2V0TGFuZ3VhZ2VMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnNldExhbmd1YWdlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFNldExhbmd1YWdlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoU2V0TGFuZ3VhZ2VMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICdsYW5nJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0U3ByaXRlRHJhZ2dhYmxlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpc0RyYWdnYWJsZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNldFNwcml0ZURyYWdnYWJsZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuc2V0U3ByaXRlRHJhZ2dhYmxlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFNldFNwcml0ZURyYWdnYWJsZUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNldFNwcml0ZURyYWdnYWJsZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ2lzRHJhZ2dhYmxlJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0U3ByaXRlVGFiQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICB0YWJTdHJpbmc6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTZXRTcHJpdGVUYWJMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnNldFNwcml0ZVRhYic7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBTZXRTcHJpdGVUYWJBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTZXRTcHJpdGVUYWJMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICd0YWJTdHJpbmcnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFN0b3BMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnN0b3AnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTdG9wTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgVG9nZ2xlQXBwTW9kZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaXNBcHBNb2RlOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgVG9nZ2xlQXBwTW9kZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUudG9nZ2xlQXBwTW9kZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBUb2dnbGVBcHBNb2RlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVG9nZ2xlQXBwTW9kZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ2lzQXBwTW9kZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFRvZ2dsZVN0YWdlU2l6ZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaXNTbWFsbFN0YWdlOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgVG9nZ2xlU3RhZ2VTaXplTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS50b2dnbGVTdGFnZVNpemUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogVG9nZ2xlU3RhZ2VTaXplQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVG9nZ2xlU3RhZ2VTaXplTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnaXNTbWFsbFN0YWdlJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBVbnBhdXNlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS51bnBhdXNlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVW5wYXVzZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgSW5wdXRTbG90IHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFZGl0ZWRBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlkOiBJbnB1dElEQXJncztcclxuICAgICAgICAgICAgdGV4dDogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEVkaXRlZExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJbnB1dFNsb3QuZWRpdGVkJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVkaXRlZEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEVkaXRlZExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE1lbnVJdGVtU2VsZWN0ZWRBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlkOiBJbnB1dElEQXJncztcclxuICAgICAgICAgICAgaXRlbTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE1lbnVJdGVtU2VsZWN0ZWRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSW5wdXRTbG90Lm1lbnVJdGVtU2VsZWN0ZWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogTWVudUl0ZW1TZWxlY3RlZEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE1lbnVJdGVtU2VsZWN0ZWRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIE11bHRpQXJnIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEFkZElucHV0TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ011bHRpQXJnLmFkZElucHV0JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IElucHV0SURBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihBZGRJbnB1dExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgUmVtb3ZlSW5wdXRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnTXVsdGlBcmcucmVtb3ZlSW5wdXQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogSW5wdXRJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFJlbW92ZUlucHV0TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBQcm9qZWN0RGlhbG9nIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXRTb3VyY2VBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIHNvdXJjZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNldFNvdXJjZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdQcm9qZWN0RGlhbG9nLnNldFNvdXJjZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBTZXRTb3VyY2VBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTZXRTb3VyY2VMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICdzb3VyY2UnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTaGFyZVByb2plY3RBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICAgICAgaXNUaGlzUHJvamVjdDogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNoYXJlUHJvamVjdExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdQcm9qZWN0RGlhbG9nLnNoYXJlUHJvamVjdCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBTaGFyZVByb2plY3RBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTaGFyZVByb2plY3RMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNob3duTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ1Byb2plY3REaWFsb2cuc2hvd24nO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTaG93bkxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFVuc2hhcmVQcm9qZWN0QXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBQcm9qZWN0TmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFVuc2hhcmVQcm9qZWN0TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ1Byb2plY3REaWFsb2cudW5zaGFyZVByb2plY3QnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogVW5zaGFyZVByb2plY3RBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihVbnNoYXJlUHJvamVjdExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ1Byb2plY3ROYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBTY3JpcHRzIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIENsZWFuVXBMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnU2NyaXB0cy5jbGVhblVwJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ2xlYW5VcExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRXhwb3J0UGljdHVyZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdTY3JpcHRzLmV4cG9ydFBpY3R1cmUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihFeHBvcnRQaWN0dXJlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVkcm9wQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBhY3Rpb246IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBSZWRyb3BMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnU2NyaXB0cy5yZWRyb3AnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUmVkcm9wQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoUmVkcm9wTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnYWN0aW9uJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgVW5kcm9wQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBhY3Rpb246IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBVbmRyb3BMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnU2NyaXB0cy51bmRyb3AnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogVW5kcm9wQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVW5kcm9wTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnYWN0aW9uJzsgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBTcHJpdGUge1xyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFkZFZhcmlhYmxlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQWRkVmFyaWFibGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnU3ByaXRlLmFkZFZhcmlhYmxlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEFkZFZhcmlhYmxlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQWRkVmFyaWFibGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlVmFyaWFibGVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIHZhck5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBEZWxldGVWYXJpYWJsZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdTcHJpdGUuZGVsZXRlVmFyaWFibGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRGVsZXRlVmFyaWFibGVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihEZWxldGVWYXJpYWJsZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ3Zhck5hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXROYW1lQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBzdHJpbmc6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTZXROYW1lTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ1Nwcml0ZS5zZXROYW1lJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFNldE5hbWVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTZXROYW1lTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnc3RyaW5nJzsgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBYTUwge1xyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFBhcnNlRmFpbGVkQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICB4bWxTdHJpbmc6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBQYXJzZUZhaWxlZExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdYTUwucGFyc2VGYWlsZWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUGFyc2VGYWlsZWRBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihQYXJzZUZhaWxlZExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ3htbFN0cmluZyc7IH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInR5cGUgRnVuY3Rpb25JRCA9IEZ1bmN0aW9uIHwgc3RyaW5nO1xyXG5cclxuZnVuY3Rpb24gZ2V0UHJvdG90eXBlRnVuY3Rpb25OYW1lKHByb3RvdHlwZTogT2JqZWN0LCBmdW5jOiBGdW5jdGlvbikge1xyXG4gICAgZm9yIChsZXQga2V5IGluIHByb3RvdHlwZSkge1xyXG4gICAgICAgIGlmIChwcm90b3R5cGVba2V5XSA9PT0gZnVuYykgcmV0dXJuIGtleTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgT3ZlcnJpZGVSZWdpc3RyeSB7XHJcblxyXG4gICAgc3RhdGljIGV4dGVuZChjbGF6eiA6IEZ1bmN0aW9uLCBmdW5jIDogRnVuY3Rpb25JRCwgbmV3RnVuY3Rpb24sIGNvdW50QXJncyA9IHRydWUpIHtcclxuICAgICAgICBpZiAoIWNsYXp6IHx8ICFjbGF6ei5wcm90b3R5cGUpIHtcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignZXh0ZW5kIHJlcXVpcmVzIGEgY2xhc3MgZm9yIGl0cyBmaXJzdCBhcmd1bWVudCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBPdmVycmlkZVJlZ2lzdHJ5LmV4dGVuZE9iamVjdChjbGF6ei5wcm90b3R5cGUsIGZ1bmMsIG5ld0Z1bmN0aW9uLCBjb3VudEFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhZnRlcihjbGF6eiA6IEZ1bmN0aW9uLCBmdW5jIDogRnVuY3Rpb25JRCwgZG9BZnRlcjogKC4uLmFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICBPdmVycmlkZVJlZ2lzdHJ5LndyYXAoY2xhenosIGZ1bmMsIG51bGwsIGRvQWZ0ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBiZWZvcmUoY2xhenogOiBGdW5jdGlvbiwgZnVuYyA6IEZ1bmN0aW9uSUQsIGRvQmVmb3JlOiAoLi4uYXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgIE92ZXJyaWRlUmVnaXN0cnkud3JhcChjbGF6eiwgZnVuYywgZG9CZWZvcmUsIG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB3cmFwKFxyXG4gICAgICAgIGNsYXp6IDogRnVuY3Rpb24sIGZ1bmMgOiBGdW5jdGlvbklELFxyXG4gICAgICAgIGRvQmVmb3JlPzogKC4uLmFyZ3MpID0+IHZvaWQsIGRvQWZ0ZXI/OiAoLi4uYXJncykgPT4gdm9pZFxyXG4gICAgKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gb3ZlcnJpZGUoYmFzZTogRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgbGV0IGFyZ3MgPSBbLi4uYXJndW1lbnRzXS5zbGljZSgxKTtcclxuICAgICAgICAgICAgaWYgKGRvQmVmb3JlKSBkb0JlZm9yZS5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gYmFzZS5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgICAgICAgICAgaWYgKGRvQWZ0ZXIpIGRvQWZ0ZXIuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgT3ZlcnJpZGVSZWdpc3RyeS5leHRlbmQoY2xhenosIGZ1bmMsIG92ZXJyaWRlLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGV4dGVuZE9iamVjdChvYmplY3QgOiBvYmplY3QsIGZ1bmMgOiBGdW5jdGlvbklELCBuZXdGdW5jdGlvbiwgY291bnRBcmdzID0gdHJ1ZSkge1xyXG4gICAgICAgIGxldCBmdW5jdGlvbk5hbWUgPSB0eXBlb2YgZnVuYyA9PT0gJ3N0cmluZycgPyBmdW5jIDogZ2V0UHJvdG90eXBlRnVuY3Rpb25OYW1lKG9iamVjdCwgZnVuYyk7XHJcblxyXG4gICAgICAgIGlmICghb2JqZWN0W2Z1bmN0aW9uTmFtZV0pIHtcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcclxuICAgICAgICAgICAgY29uc29sZS50cmFjZSgpO1xyXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdDYW5ub3QgZXh0ZW5kIGZ1bmN0aW9uICcgKyBmdW5jdGlvbk5hbWUgK1xyXG4gICAgICAgICAgICAgICAgJyBiZWNhdXNlIGl0IGRvZXMgbm90IGV4aXN0LicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgb2xkRnVuY3Rpb24gPSBvYmplY3RbZnVuY3Rpb25OYW1lXTtcclxuXHJcbiAgICAgICAgaWYgKGNvdW50QXJncyAmJiAhb2xkRnVuY3Rpb24uZXh0ZW5kZWQgJiYgb2xkRnVuY3Rpb24ubGVuZ3RoICE9IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgb2xkRnVuY3Rpb24ubGVuZ3RoICsgMSAhPT0gbmV3RnVuY3Rpb24ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0gJ0V4dGVuZGluZyBmdW5jdGlvbiB3aXRoIHdyb25nIG51bWJlciBvZiBhcmd1bWVudHM6ICcgK1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lICsgJyAnICtcclxuICAgICAgICAgICAgICAgIG9sZEZ1bmN0aW9uLmxlbmd0aCArICcgdnMgJyArIG5ld0Z1bmN0aW9uLmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb2JqZWN0W2Z1bmN0aW9uTmFtZV0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIGFyZ3MudW5zaGlmdChvbGRGdW5jdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdGdW5jdGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIG9iamVjdFtmdW5jdGlvbk5hbWVdLmV4dGVuZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG9sZEZ1bmN0aW9uO1xyXG4gICAgfVxyXG59XHJcblxyXG50eXBlIEJhc2VGdW5jdGlvbiA9ICguLi5hcmdzKSA9PiBhbnk7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2FsbENvbnRleHQ8Q2xhc3NUeXBlLCBGdW5jdGlvblR5cGUgZXh0ZW5kcyBCYXNlRnVuY3Rpb24+IHtcclxuXHJcbiAgICByZWFkb25seSB0aGlzQXJnOiBDbGFzc1R5cGU7XHJcbiAgICByZWFkb25seSBvcmlnaW5hbEZ1bmN0aW9uOiBGdW5jdGlvblR5cGU7XHJcbiAgICByZWFkb25seSBvcmlnaW5hbEFyZ3M6IFBhcmFtZXRlcnM8RnVuY3Rpb25UeXBlPjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0aGlzQXJnOiBDbGFzc1R5cGUsIG9yaWdpbmFsRnVuY3Rpb246IEZ1bmN0aW9uVHlwZSwgb3JpZ2luYWxBcmdzOiBQYXJhbWV0ZXJzPEZ1bmN0aW9uVHlwZT4pIHtcclxuICAgICAgICB0aGlzLnRoaXNBcmcgPSB0aGlzQXJnO1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxGdW5jdGlvbiA9IG9yaWdpbmFsRnVuY3Rpb247XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbEFyZ3MgPSBvcmlnaW5hbEFyZ3M7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHkoYXJncyA9IHRoaXMub3JpZ2luYWxBcmdzKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luYWxGdW5jdGlvbi5hcHBseSh0aGlzLnRoaXNBcmcsIGFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbGxXaXRoT3JpZ2luYWxBcmdzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9yaWdpbmFsRnVuY3Rpb24uY2FsbCh0aGlzLnRoaXNBcmcsIC4uLnRoaXMub3JpZ2luYWxBcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBjYWxsV2l0aE5ld0FyZ3MoLi4uYXJncykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9yaWdpbmFsRnVuY3Rpb24uY2FsbCh0aGlzLnRoaXNBcmcsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG50eXBlIEJhc2VXaXRoQ29udGV4dDxDbGFzc1R5cGUsIEZ1bmN0aW9uVHlwZT4gPSBcclxuICAgIEZ1bmN0aW9uVHlwZSBleHRlbmRzICguLi5hOiBpbmZlciBVKSA9PiBpbmZlciBSID8gXHJcbiAgICAgICAgKHRoaXM6IENsYXNzVHlwZSwgaW5mbzogQ2FsbENvbnRleHQ8Q2xhc3NUeXBlLCBGdW5jdGlvblR5cGU+LCAuLi5hOlUpID0+IFI6IFxyXG4gICAgICAgIG5ldmVyO1xyXG5cclxuY2xhc3MgRXh0ZW5kZXI8UHJvdG8gZXh0ZW5kcyBvYmplY3QsIEZ1bmN0aW9uVHlwZSBleHRlbmRzIEZ1bmN0aW9uPiB7XHJcblxyXG4gICAgcmVhZG9ubHkgcHJvdG90eXBlOiBQcm90bztcclxuICAgIHJlYWRvbmx5IG9yaWdpbmFsRnVuY3Rpb246IEZ1bmN0aW9uVHlwZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAocHJvdG86IFByb3RvLCBmdW5jOiBGdW5jdGlvblR5cGUpIHtcclxuICAgICAgICB0aGlzLnByb3RvdHlwZSA9IHByb3RvO1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxGdW5jdGlvbiA9IGZ1bmM7XHJcbiAgICB9XHJcbiAgICBvdmVycmlkZShvdmVycmlkZTogQmFzZVdpdGhDb250ZXh0PFByb3RvLCBGdW5jdGlvblR5cGU+KSB7XHJcbiAgICAgICAgT3ZlcnJpZGVSZWdpc3RyeS5leHRlbmRPYmplY3QodGhpcy5wcm90b3R5cGUsIHRoaXMub3JpZ2luYWxGdW5jdGlvbiwgZnVuY3Rpb24gKGJhc2UpIHtcclxuICAgICAgICAgICAgbGV0IG9yaWdpbmFsQXJncyA9IFsuLi5hcmd1bWVudHNdLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICBsZXQgaW5mbyA9IG5ldyBDYWxsQ29udGV4dCh0aGlzLCBiYXNlLCBvcmlnaW5hbEFyZ3MpO1xyXG4gICAgICAgICAgICByZXR1cm4gb3ZlcnJpZGUuY2FsbCh0aGlzLCBpbmZvLCAuLi5vcmlnaW5hbEFyZ3MpO1xyXG4gICAgICAgIH0sIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBhZnRlcihcclxuICAgICAgICBkb0FmdGVyOiBCYXNlV2l0aENvbnRleHQ8UHJvdG8sIEZ1bmN0aW9uVHlwZT4sXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLndyYXAobnVsbCwgZG9BZnRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgYmVmb3JlKGRvQmVmb3JlOiBCYXNlV2l0aENvbnRleHQ8UHJvdG8sIEZ1bmN0aW9uVHlwZT4sKSB7XHJcbiAgICAgICAgdGhpcy53cmFwKGRvQmVmb3JlLCBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICB3cmFwKFxyXG4gICAgICAgIGRvQmVmb3JlPzogQmFzZVdpdGhDb250ZXh0PFByb3RvLCBGdW5jdGlvblR5cGU+LFxyXG4gICAgICAgIGRvQWZ0ZXI/OiBCYXNlV2l0aENvbnRleHQ8UHJvdG8sIEZ1bmN0aW9uVHlwZT4sXHJcbiAgICApIHtcclxuICAgICAgICBPdmVycmlkZVJlZ2lzdHJ5LmV4dGVuZE9iamVjdCh0aGlzLnByb3RvdHlwZSwgdGhpcy5vcmlnaW5hbEZ1bmN0aW9uLCBmdW5jdGlvbiBvdmVycmlkZShiYXNlKSB7XHJcbiAgICAgICAgICAgIGxldCBvcmlnaW5hbEFyZ3MgPSBbLi4uYXJndW1lbnRzXS5zbGljZSgxKTtcclxuICAgICAgICAgICAgbGV0IGluZm8gPSBuZXcgQ2FsbENvbnRleHQodGhpcywgYmFzZSwgb3JpZ2luYWxBcmdzKTtcclxuICAgICAgICAgICAgaWYgKGRvQmVmb3JlKSBkb0JlZm9yZS5jYWxsKHRoaXMsIGluZm8sIC4uLm9yaWdpbmFsQXJncyk7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IGJhc2UuYXBwbHkodGhpcywgb3JpZ2luYWxBcmdzKTtcclxuICAgICAgICAgICAgaWYgKGRvQWZ0ZXIpIGRvQWZ0ZXIuY2FsbCh0aGlzLCBpbmZvLCAuLi5vcmlnaW5hbEFyZ3MpO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG50eXBlIFJlbW92ZUluZGV4PFQ+ID0ge1xyXG4gICAgWyBLIGluIGtleW9mIFQgYXNcclxuICAgICAgc3RyaW5nIGV4dGVuZHMgS1xyXG4gICAgICAgID8gbmV2ZXJcclxuICAgICAgICA6IG51bWJlciBleHRlbmRzIEtcclxuICAgICAgICAgID8gbmV2ZXJcclxuICAgICAgICAgIDogc3ltYm9sIGV4dGVuZHMgS1xyXG4gICAgICAgICAgICA/IG5ldmVyXHJcbiAgICAgICAgICAgIDogS1xyXG4gICAgXTogVFtLXTtcclxufTtcclxuXHJcbnR5cGUgRXh0ZW5zaW9uT2Y8UHJvdG8gZXh0ZW5kcyBvYmplY3Q+ID0ge1xyXG4gICAgW1AgaW4ga2V5b2YgUmVtb3ZlSW5kZXg8UHJvdG8+XTogUHJvdG9bUF0gZXh0ZW5kcyBCYXNlRnVuY3Rpb25cclxuICAgICAgICA/IEV4dGVuZGVyPFByb3RvLCBQcm90b1tQXT5cclxuICAgICAgICA6IG5ldmVyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kPFByb3RvIGV4dGVuZHMgb2JqZWN0Pihwcm90bzogUHJvdG8pIHtcclxuICAgIGxldCBleCA9IHt9IGFzIEV4dGVuc2lvbk9mPFByb3RvPjtcclxuICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICBmb3IgKGxldCBrIGluIHByb3RvKSB7XHJcbiAgICAgICAgbGV0IGtleSA9IGsgYXMgc3RyaW5nO1xyXG4gICAgICAgIGxldCBmID0gcHJvdG9ba107XHJcbiAgICAgICAgaWYgKHR5cGVvZiBmID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCBrKTtcclxuICAgICAgICAgICAgZXhba2V5XSA9IG5ldyBFeHRlbmRlcihwcm90bywgZik7XHJcbiAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8vIGNvbnNvbGUubG9nKFwiY3JlYXRlZCBcIiArIGNvdW50ICsgXCIgZXh0ZW5kZXJzXCIpO1xyXG4gICAgcmV0dXJuIGV4O1xyXG59XHJcbiIsImltcG9ydCB7IEJsb2NrcyB9IGZyb20gXCIuLi9ibG9ja3MvQmxvY2tGYWN0b3J5XCI7XHJcbmltcG9ydCB7IEV2ZW50TWFuYWdlciB9IGZyb20gXCIuLi9ldmVudHMvRXZlbnRNYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEV4dGVuc2lvbk1hbmFnZXIgfSBmcm9tIFwiLi9FeHRlbnNpb25NYW5hZ2VyXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRXh0ZW5zaW9uIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZXZlbnRzKCkgOiBFdmVudE1hbmFnZXIge1xyXG4gICAgICAgIHJldHVybiBFeHRlbnNpb25NYW5hZ2VyLmV2ZW50cztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgYmxvY2tzKCkgOiBCbG9ja3MuQmxvY2tGYWN0b3J5IHtcclxuICAgICAgICByZXR1cm4gRXh0ZW5zaW9uTWFuYWdlci5ibG9ja3M7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHt9XHJcblxyXG4gICAgcmVnaXN0ZXIoKSB7XHJcbiAgICAgICAgRXh0ZW5zaW9uTWFuYWdlci5yZWdpc3Rlcih0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXBlbmRlbmNpZXMoKTogc3RyaW5nW10ge1xyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEJsb2NrcyB9IGZyb20gXCIuLi9ibG9ja3MvQmxvY2tGYWN0b3J5XCI7XHJcbmltcG9ydCB7IERldk1vZGUgfSBmcm9tIFwiLi4vZGV2L0Rldk1vZGVcIjtcclxuaW1wb3J0IHsgRXZlbnRNYW5hZ2VyIH0gZnJvbSBcIi4uL2V2ZW50cy9FdmVudE1hbmFnZXJcIjtcclxuaW1wb3J0IHsgRXh0ZW5zaW9uIH0gZnJvbSBcIi4vRXh0ZW5zaW9uXCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEV4dGVuc2lvbk1hbmFnZXIge1xyXG5cclxuICAgIHN0YXRpYyByZWFkb25seSBleHRlbnNpb25zID0gW10gYXMgRXh0ZW5zaW9uW107XHJcblxyXG4gICAgc3RhdGljIHJlYWRvbmx5IGJsb2NrcyA9IG5ldyBCbG9ja3MuQmxvY2tGYWN0b3J5KCk7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZXZlbnRzID0gbmV3IEV2ZW50TWFuYWdlcigpO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGRldk1vZGUgPSBuZXcgRGV2TW9kZSgpO1xyXG5cclxuICAgIHN0YXRpYyByZWdpc3RlcihleHRlbnNpb24gOiBFeHRlbnNpb24pIHtcclxuICAgICAgICB0aGlzLmV4dGVuc2lvbnMucHVzaChleHRlbnNpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpbml0KCkge1xyXG5cclxuICAgICAgICBjb25zdCBjb25maWdGbiA9ICAgIHdpbmRvd1snZ2V0U0VGQ29uZmlnJ107XHJcbiAgICAgICAgaWYgKCFjb25maWdGbikge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgICAgICAgICAnTm8gU0VGIGNvbmZpZyBmaWxlOiBObyBleHRlbnNpb25zIGxvYWRlZC4gJyArXHJcbiAgICAgICAgICAgICAgICAnUGxlYXNlIGNyZWF0ZSBsaWJyYXJpZXMvc2VmLWNvbmZpZy5qcy4nXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IGNvbmZpZ0ZuKCk7XHJcbiAgICAgICAgaWYgKCFjb25maWcgfHwgIUFycmF5LmlzQXJyYXkoY29uZmlnLmV4dGVuc2lvbnMpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcclxuICAgICAgICAgICAgICAgICdJbnZhbGlkIHNlZi1jb25maWcuanMgZmlsZSAobm8gZXh0ZW5zaW9ucyBwcm9wZXJ0eSkuICcgK1xyXG4gICAgICAgICAgICAgICAgJ1BsZWFzZSBzZWUgbGlicmFyaWVzL3NlZi1jb25maWcuZXhhbXBsZS5qcyBmb3IgYW4gZXhhbXBsZS4nXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubG9hZEV4dGVuc2lvbnMoY29uZmlnLmV4dGVuc2lvbnMpO1xyXG5cclxuICAgICAgICB0aGlzLmRldk1vZGUuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGluaXRFeHRlbnNpb25zKCkge1xyXG4gICAgICAgIC8vIFRPRE86IE9yZGVyIGJhc2VkIG9uIGRlcGVuZGVuY2llc1xyXG4gICAgICAgIC8vIFRPRE86IExvYWQgb25seSB3aGVuIGFza2VkIGZvciwgbm90IGFsd2F5c1xyXG4gICAgICAgIHRoaXMuZXh0ZW5zaW9ucy5mb3JFYWNoKGUgPT4ge1xyXG4gICAgICAgICAgICBlLmluaXQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBsb2FkRXh0ZW5zaW9ucyhwYXRoczogc3RyaW5nW10pIHtcclxuICAgICAgICBsZXQgdG9Mb2FkID0gMDtcclxuICAgICAgICBwYXRocy5mb3JFYWNoKHBhdGggPT4ge1xyXG4gICAgICAgICAgICB0b0xvYWQrKztcclxuICAgICAgICAgICAgdGhpcy5sb2FkRXh0ZW5zaW9uKHBhdGgsIHN1Y2Nlc3MgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFzdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdFeHRlbnNpb24gbm90IGZvdW5kOicsIHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdG9Mb2FkLS07XHJcbiAgICAgICAgICAgICAgICBpZiAodG9Mb2FkID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRFeHRlbnNpb25zKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGxvYWRFeHRlbnNpb24oXHJcbiAgICAgICAgcGF0aDogc3RyaW5nLFxyXG4gICAgICAgIGNhbGxiYWNrOiAoc3VjY2VzczogYm9vbGVhbikgPT4gdm9pZFxyXG4gICAgKSB7XHJcbiAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgIHNjcmlwdC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9qYXZhc2NyaXB0Jyk7XHJcbiAgICAgICAgc2NyaXB0LnNldEF0dHJpYnV0ZSgnc3JjJywgcGF0aCk7XHJcbiAgICAgICAgLy8gVE9ETzogcmVtb3ZlIHNpbXVsYXRlZCBsYWdcclxuICAgICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IGNhbGxiYWNrKHRydWUpKTtcclxuICAgICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiBjYWxsYmFjayhmYWxzZSkpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFNuYXAgfSBmcm9tIFwiLi4vc25hcC9TbmFwVXRpbHNcIjtcclxuXHJcbmV4cG9ydCBuYW1lc3BhY2UgQ2xvdWQge1xyXG5cclxuICAgIGV4cG9ydCB0eXBlIENsb3VkUHJvamVjdCA9IHtcclxuICAgICAgICBjcmVhdGVkOiBzdHJpbmcsXHJcbiAgICAgICAgaWQ6IG51bWJlcixcclxuICAgICAgICBpc3B1YmxpYzogYm9vbGVhbixcclxuICAgICAgICBpc3B1Ymxpc2hlZDogYm9vbGVhbixcclxuICAgICAgICBsYXN0dXBkYXRlZDogc3RyaW5nLFxyXG4gICAgICAgIG5vdGVzOiBzdHJpbmcsXHJcbiAgICAgICAgcHJvamVjdG5hbWU6IHN0cmluZyxcclxuICAgICAgICB1c2VybmFtZTogc3RyaW5nLFxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCB0eXBlIFByb2plY3RTYXZlQm9keSA9IHtcclxuICAgICAgICBub3Rlczogc3RyaW5nLFxyXG4gICAgICAgIHhtbDogc3RyaW5nLFxyXG4gICAgICAgIG1lZGlhOiBzdHJpbmcsXHJcbiAgICAgICAgdGh1bWJuYWlsOiBzdHJpbmcsXHJcbiAgICAgICAgcmVtaXhJRDogc3RyaW5nLFxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBVdGlscyB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBhc3luYyBnZXRDbG91ZFByb2plY3RzKHdpdGhUaHVtYm5haWw6IGJvb2xlYW4pOiBQcm9taXNlPENsb3VkUHJvamVjdFtdPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBTbmFwLmNsb3VkLmdldFByb2plY3RMaXN0KGRpY3QgPT4gcmVzb2x2ZShkaWN0LnByb2plY3RzKSwgcmVqZWN0LCB3aXRoVGh1bWJuYWlsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgYXN5bmMgc2F2ZVByb2plY3QocHJvamVjdE5hbWU6IHN0cmluZywgYm9keTogUHJvamVjdFNhdmVCb2R5KSA6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgU25hcC5jbG91ZC5zYXZlUHJvamVjdChwcm9qZWN0TmFtZSwgYm9keSwgcmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgYXN5bmMgZ2V0UHVibGljUHJvamVjdChwcm9qZWN0TmFtZTogc3RyaW5nLCB1c2VyTmFtZTogc3RyaW5nKSA6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBTbmFwLmNsb3VkLmdldFB1YmxpY1Byb2plY3QocHJvamVjdE5hbWUsIHVzZXJOYW1lLCByZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBkZXByZWNhdGVkIFRoZSBjbG91ZCBiYWNrZW5kIG5vIGxvbmdlciBzdXBwb3J0cyB0aGlzIVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXRpYyBhc3luYyBnZXRQcm9qZWN0TWV0YWRhdGEocHJvamVjdE5hbWU6IHN0cmluZywgdXNlck5hbWU6IHN0cmluZykgOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgU25hcC5jbG91ZC5nZXRQcm9qZWN0TWV0YWRhdGEocHJvamVjdE5hbWUsIHVzZXJOYW1lLCByZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBhc3luYyBzaGFyZVByb2plY3QocHJvamVjdE5hbWU6IHN0cmluZykgOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIFNuYXAuY2xvdWQuc2hhcmVQcm9qZWN0KHByb2plY3ROYW1lLCBTbmFwLmNsb3VkLnVzZXJOYW1lLCByZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRPRE86IFByb2plY3Qgc2hvdWxkIGhhdmUgc29tZSBzb3J0IG9mIHBsdWdpbiBwZXJtaXNzaW9uIHN5c3RlbS4uLlxyXG4gICAgICAgIHN0YXRpYyBhc3luYyBkZWxldGVQcm9qZWN0KHByb2plY3ROYW1lOiBzdHJpbmcpIDogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBTbmFwLmNsb3VkLmRlbGV0ZVByb2plY3QocHJvamVjdE5hbWUsIFNuYXAuY2xvdWQudXNlck5hbWUsIHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGdldEN1cnJlbnRQcm9qZWN0RGF0YSh2ZXJpZnk6IGJvb2xlYW4pIDogUHJvamVjdFNhdmVCb2R5IHtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RCb2R5ID0gU25hcC5JREUuYnVpbGRQcm9qZWN0UmVxdWVzdCgpO1xyXG4gICAgICAgICAgICBpZiAoIVNuYXAuSURFLnZlcmlmeVByb2plY3QocHJvamVjdEJvZHkpKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIHByb2plY3RCb2R5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGdldEN1cnJlbnRQcm9qZWN0TmFtZSgpIDogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFNuYXAuSURFLmdldFByb2plY3ROYW1lKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgaXNMb2dnZWRJbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFNuYXAuY2xvdWQudXNlcm5hbWUgIT0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyB1c2VybmFtZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFNuYXAuY2xvdWQudXNlcm5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgdGVzdCgpIHtcclxuICAgICAgICAgICAgdGhpcy5nZXRDbG91ZFByb2plY3RzKGZhbHNlKS50aGVuKHByb2plY3RzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByb2plY3RzWzBdLmNyZWF0ZWQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBPdmVycmlkZVJlZ2lzdHJ5LCBleHRlbmQgfSBmcm9tIFwiLi4vZXh0ZW5kL092ZXJyaWRlUmVnaXN0cnlcIjtcclxuaW1wb3J0IHsgQmxvY2tNb3JwaCB9IGZyb20gXCIuLi9zbmFwL1NuYXBcIjtcclxuaW1wb3J0IHsgU25hcCB9IGZyb20gXCIuLi9zbmFwL1NuYXBVdGlsc1wiO1xyXG5cclxuY2xhc3MgVHJlZU5vZGUge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgY2hpbGRyZW46IFRyZWVOb2RlW10gPSBbXTtcclxuICAgIHBhcmVudDogVHJlZU5vZGUgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZpbmRMQ0EoYTogVHJlZU5vZGUsIGI6IFRyZWVOb2RlKSB7XHJcbiAgICAgICAgbGV0IGFQYXRoID0gYS5yb290UGF0aCgpO1xyXG4gICAgICAgIGxldCBiUGF0aCA9IGIucm9vdFBhdGgoKTtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgd2hpbGUgKGkgPCBhUGF0aC5sZW5ndGggJiYgaSA8IGJQYXRoLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBpZiAoYVBhdGhbaV0gIT09IGJQYXRoW2ldKSBicmVhaztcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYVBhdGhbaS0xXTtcclxuICAgIH1cclxuXHJcbiAgICByb290UGF0aCgpIHtcclxuICAgICAgICBsZXQgcGF0aCA9IFtdIGFzIFRyZWVOb2RlW107XHJcbiAgICAgICAgcGF0aC5wdXNoKHRoaXMpO1xyXG4gICAgICAgIGxldCBub2RlID0gdGhpcy5wYXJlbnQ7XHJcbiAgICAgICAgd2hpbGUgKG5vZGUpIHtcclxuICAgICAgICAgICAgcGF0aC5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICBub2RlID0gbm9kZS5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXRoLnJldmVyc2UoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBUaGlzIGNsYXNzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVzIHR5cGVzY3JpcHQgZGVmaW5pdGlvbnNcclxuICogZnJvbSBTbmFwJ3Mgc291cmNlIGNvZGUuIFRvIHJ1biwgb3BlbiBTbmFwIGluIGEgYnJvd3NlciBhbmRcclxuICogZnJvbSB0aGUgY29uc29sZSBydW46XHJcbiAqIG5ldyBTRUYuRGVmR2VuZXJhdG9yKCkuaW5pdCgpLmRvd25sb2FkQWxsKClcclxuICovXHJcbmV4cG9ydCBjbGFzcyBEZWZHZW5lcmF0b3Ige1xyXG5cclxuICAgIGNsYXNzZXMgPSBuZXcgTWFwPHN0cmluZywgQ2xhc3NEZWY+O1xyXG4gICAgaW5zdHJ1bWVudGVycyA9IG5ldyBNYXA8c3RyaW5nLCBJbnN0cnVtZW50ZXI+KCk7XHJcbiAgICBoaWVyYXJjaHk6IE1hcDxzdHJpbmcsIFRyZWVOb2RlPjtcclxuXHJcbiAgICB3YWxrZWRUaGlzRnJhbWUgPSBmYWxzZTtcclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyh3aW5kb3cpKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGtleSk7XHJcbiAgICAgICAgICAgIGlmICghd2luZG93Lmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB3aW5kb3dba2V5XTtcclxuICAgICAgICAgICAgaWYgKCEodmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbikpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlLnByb3RvdHlwZSkgY29udGludWU7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5uYW1lLmxlbmd0aCA9PSAwKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdGhpcy5jbGFzc2VzLnNldChrZXksIG5ldyBDbGFzc0RlZih2YWx1ZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB0aGlzLmNsYXNzZXMuZm9yRWFjaChjID0+IGMuYWRkUGFyZW50RGF0YSh0aGlzLmNsYXNzZXMpKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5vdXRwdXREZWZpbml0aW9ucygpKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzKTtcclxuXHJcbiAgICAgICAgLy8gbGV0IGxpbWl0ID0gMTAwO1xyXG4gICAgICAgIGZvciAobGV0IGNsYXp6IG9mIHRoaXMuY2xhc3Nlcy52YWx1ZXMoKSkge1xyXG4gICAgICAgICAgICBpZiAoY2xhenouaXNQdXJlRnVuY3Rpb24pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBsZXQgaW5zdCA9IG5ldyBJbnN0cnVtZW50ZXIoY2xhenopO1xyXG4gICAgICAgICAgICB0aGlzLmluc3RydW1lbnRlcnMuc2V0KGluc3QubmFtZSwgaW5zdCk7XHJcbiAgICAgICAgICAgIC8vIGlmIChsaW1pdC0tIDw9IDApIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmluc3RydW1lbnRlcnMuc2V0KEJsb2NrTW9ycGgubmFtZSwgbmV3IEluc3RydW1lbnRlcih0aGlzLmNsYXNzZXMuZ2V0KEJsb2NrTW9ycGgubmFtZSkpKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmluc3RydW1lbnRlcnMuZm9yRWFjaChpID0+IGkub25Qcm9ncmVzc0NhbGxiYWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy53YWxrZWRUaGlzRnJhbWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy53YWxrZWRUaGlzRnJhbWUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLndhbGtPYmplY3RzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2F2ZUluc3RydW1lbnRlcnMoKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhbGtlZFRoaXNGcmFtZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9LCAxKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkSW5zdHJ1bWVudGVycygpO1xyXG4gICAgICAgIHRoaXMud2Fsa09iamVjdHMoKTtcclxuICAgICAgICB0aGlzLmhpZXJhcmNoeSA9IHRoaXMuY3JlYXRlSGllcmFyY2h5KCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHdhbGtPYmplY3RzKHJvb3QgPSBTbmFwLndvcmxkKSB7XHJcbiAgICAgICAgdGhpcy5pbnNwZWN0T2JqZWN0KHJvb3QpO1xyXG4gICAgICAgIGlmICghcm9vdC5jaGlsZHJlbikgcmV0dXJuO1xyXG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIHJvb3QuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgdGhpcy53YWxrT2JqZWN0cyhjaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluc3BlY3RPYmplY3Qob2JqOiBvYmplY3QpIHtcclxuICAgICAgICBpZiAoIShvYmogaW5zdGFuY2VvZiBPYmplY3QgJiYgb2JqLmNvbnN0cnVjdG9yKSkgcmV0dXJuO1xyXG4gICAgICAgIGxldCB0eXBlID0gb2JqLmNvbnN0cnVjdG9yLm5hbWU7XHJcbiAgICAgICAgZm9yIChsZXQgaW5zdCBvZiB0aGlzLmluc3RydW1lbnRlcnMudmFsdWVzKCkpIHtcclxuICAgICAgICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIGluc3QuY2xhc3MpIHtcclxuICAgICAgICAgICAgICAgIGluc3QuYWRkT2JqZWN0KG9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSGllcmFyY2h5KCkge1xyXG4gICAgICAgIGxldCBoaWVyYXJjaHkgPSBuZXcgTWFwPHN0cmluZywgVHJlZU5vZGU+KCk7XHJcbiAgICAgICAgdGhpcy5jbGFzc2VzLmZvckVhY2goYyA9PiB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gbmV3IFRyZWVOb2RlKGMubmFtZSk7XHJcbiAgICAgICAgICAgIGhpZXJhcmNoeS5zZXQoYy5uYW1lLCBub2RlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBoaWVyYXJjaHkuc2V0KCdTbmFwVHlwZScsIG5ldyBUcmVlTm9kZSgnU25hcFR5cGUnKSk7XHJcbiAgICAgICAgdGhpcy5jbGFzc2VzLmZvckVhY2goYyA9PiB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gaGllcmFyY2h5LmdldChjLm5hbWUpO1xyXG4gICAgICAgICAgICBsZXQgcGFyZW50ID0gYy51YmVyO1xyXG4gICAgICAgICAgICBsZXQgcGFyZW50Tm9kZSA9IGhpZXJhcmNoeS5nZXQocGFyZW50KTtcclxuICAgICAgICAgICAgaWYgKHBhcmVudE5vZGUgPT0gbnVsbCkgcGFyZW50Tm9kZSA9IGhpZXJhcmNoeS5nZXQoJ1NuYXBUeXBlJyk7XHJcbiAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRyZW4ucHVzaChub2RlKTtcclxuICAgICAgICAgICAgbm9kZS5wYXJlbnQgPSBwYXJlbnROb2RlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBoaWVyYXJjaHk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICB0eXBlc1RvVFModHlwZXM6IEZpZWxkVHlwZXMsIGlzRmllbGQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodHlwZXMgPT0gbnVsbCB8fCB0eXBlcy5zaXplID09IDApIHJldHVybiAnYW55JztcclxuICAgICAgICBsZXQgdHlwZXNBcnJheSA9IFsuLi50eXBlc107XHJcbiAgICAgICAgdHlwZXNBcnJheSA9IHR5cGVzQXJyYXkubWFwKHQgPT4ge1xyXG4gICAgICAgICAgICBpZiAodCA9PSBcIk1hcFwiKSByZXR1cm4gXCJNYXA8YW55LCBhbnk+XCI7XHJcbiAgICAgICAgICAgIGlmICh0ID09IFwiQXJyYXlcIikgcmV0dXJuIFwiYW55W11cIjtcclxuICAgICAgICAgICAgaWYgKHQgPT0gXCJNb3VzZVNjcm9sbEV2ZW50XCIpIHJldHVybiBcIldoZWVsRXZlbnRcIjtcclxuICAgICAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHR5cGVzLnNpemUgPT0gMSkgcmV0dXJuIHR5cGVzQXJyYXlbMF07XHJcbiAgICAgICAgLy8gSWYgdGhpcyBjYW4gYmUgYSBmdW5jdGlvbiwgaXQgbWlnaHQgYmUgZGVmaW5lZCBhcyBzdWNoIGluIGEgcGFyZW50IGNsYXNzLCBzbyB1c2UgYW55IHR5cGVcclxuICAgICAgICBpZiAoaXNGaWVsZCAmJiB0eXBlc0FycmF5LmluY2x1ZGVzKCdGdW5jdGlvbicpKSByZXR1cm4gJ2FueSc7XHJcbiAgICAgICAgbGV0IG1vcnBoVHlwZXMgPSB0eXBlc0FycmF5LmZpbHRlcih0ID0+IHQuZW5kc1dpdGgoJ01vcnBoJykpO1xyXG4gICAgICAgIGlmIChtb3JwaFR5cGVzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgdHlwZXNBcnJheSA9IHR5cGVzQXJyYXkuZmlsdGVyKHQgPT4gIW1vcnBoVHlwZXMuaW5jbHVkZXModCkpO1xyXG4gICAgICAgICAgICBsZXQgbGNhID0gbW9ycGhUeXBlcy5tYXAodCA9PiB0aGlzLmhpZXJhcmNoeS5nZXQodCkpLmZpbHRlcih0ID0+IHQgIT0gbnVsbCkucmVkdWNlKChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVHJlZU5vZGUuZmluZExDQShhLCBiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChsY2EgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJDb2xsYXBzZWRcIiwgbW9ycGhUeXBlcywgXCJ0b1wiLCBsY2EubmFtZSk7XHJcbiAgICAgICAgICAgICAgICB0eXBlc0FycmF5LnB1c2gobGNhLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0eXBlc0FycmF5LmpvaW4oJyB8ICcpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0TG9nZ2luZygpIHtcclxuICAgICAgICB0aGlzLmluc3RydW1lbnRlcnMuZm9yRWFjaChpID0+IGkuc3RhcnRMb2dnaW5nKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEluc3RydW1lbnRlcnNKU09OKCkge1xyXG4gICAgICAgIGxldCBqc29uID0ge307XHJcbiAgICAgICAgWy4uLnRoaXMuaW5zdHJ1bWVudGVycy52YWx1ZXMoKV1cclxuICAgICAgICAuc29ydCgoYSwgYikgPT4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lKSlcclxuICAgICAgICAuZm9yRWFjaCgoaW5zdCkgPT4ge1xyXG4gICAgICAgICAgICBqc29uW2luc3QubmFtZV0gPSBpbnN0LnNlcmlhbGl6ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBqc29uO1xyXG4gICAgfVxyXG5cclxuICAgIHNhdmVJbnN0cnVtZW50ZXJzKCkge1xyXG4gICAgICAgIGxldCBqc29uID0gdGhpcy5nZXRJbnN0cnVtZW50ZXJzSlNPTigpO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZVsnaW5zdHJ1bWVudGVycyddID0gSlNPTi5zdHJpbmdpZnkoanNvbik7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEluc3RydW1lbnRlcnMoKSB7XHJcbiAgICAgICAgbGV0IGpzb24gPSBsb2NhbFN0b3JhZ2VbJ2luc3RydW1lbnRlcnMnXTtcclxuICAgICAgICBpZiAoIWpzb24pIHJldHVybjtcclxuICAgICAgICBqc29uID0gSlNPTi5wYXJzZShqc29uKTtcclxuICAgICAgICB0aGlzLmluc3RydW1lbnRlcnMuZm9yRWFjaCgoaW5zdCwgbmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWpzb25bbmFtZV0pIHJldHVybjtcclxuICAgICAgICAgICAgaW5zdC5kZXNlcmlhbGl6ZShqc29uW25hbWVdKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDbGFzc2VzKCkge1xyXG4gICAgICAgIHJldHVybiBbLi4udGhpcy5jbGFzc2VzLnZhbHVlcygpXVxyXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiBhLmNvbXBhcmVUbyhiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgb3V0cHV0RXhwb3J0cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRDbGFzc2VzKCkubWFwKGMgPT4gYy5leHBvcnRTdGF0ZW1lbnQoKSkuam9pbignXFxuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgb3V0cHV0RGVmaW5pdGlvbnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuZXhwb3J0IGNsYXNzIFNuYXBUeXBlIHtcclxuICAgIHByb3RvdHlwZTogYW55O1xyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG59XFxuXFxuYCArIHRoaXMuZ2V0Q2xhc3NlcygpLm1hcChjID0+IGMudG9UUyh0aGlzLCB0aGlzLmluc3RydW1lbnRlcnMuZ2V0KGMubmFtZSkpKS5qb2luKCdcXG5cXG4nKTtcclxuICAgIH1cclxuXHJcbiAgICBkb3dubG9hZEFsbCgpIHtcclxuICAgICAgICB0aGlzLmRvd25sb2FkRmlsZSgnU25hcC5qcycsIHRoaXMub3V0cHV0RXhwb3J0cygpKTtcclxuICAgICAgICB0aGlzLmRvd25sb2FkRmlsZSgnU25hcC5kLnRzJywgdGhpcy5vdXRwdXREZWZpbml0aW9ucygpKTtcclxuICAgICAgICB0aGlzLmRvd25sb2FkRmlsZSgndHlwZXMuanNvbicsIEpTT04uc3RyaW5naWZ5KHRoaXMuZ2V0SW5zdHJ1bWVudGVyc0pTT04oKSwgbnVsbCwgMikpO1xyXG4gICAgfVxyXG5cclxuICAgIGRvd25sb2FkRmlsZShmaWxlbmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnaHJlZicsICdkYXRhOnRleHQvcGxhaW47Y2hhcnNldD11dGYtOCwnICsgZW5jb2RlVVJJQ29tcG9uZW50KHRleHQpKTtcclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBmaWxlbmFtZSk7XHJcblxyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG5cclxuICAgICAgICBlbGVtZW50LmNsaWNrKCk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG50eXBlIEZpZWxkVHlwZXMgPSBTZXQ8c3RyaW5nPjtcclxudHlwZSBBcmdUeXBlcyA9IEZpZWxkVHlwZXNbXTtcclxuXHJcbmZ1bmN0aW9uIHNlcmlhbGl6ZU1hcChtYXA6IE1hcDxzdHJpbmcsIEZpZWxkVHlwZXMgfCBBcmdUeXBlcz4pIHtcclxuICAgIHJldHVybiBbLi4ubWFwLmtleXMoKV1cclxuICAgIC5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpXHJcbiAgICAubWFwKGtleSA9PiB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gbWFwLmdldChrZXkpO1xyXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFNldCkgcmV0dXJuIFtrZXksIHNlcmlhbGl6ZVNldCh2YWx1ZSldO1xyXG4gICAgICAgIHJldHVybiBba2V5LCBzZXJpYWxpemVTZXRBcnJheSh2YWx1ZSldO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNlcmlhbGl6ZVNldEFycmF5KGFycjogQXJnVHlwZXMpIHtcclxuICAgIHJldHVybiBhcnIubWFwKGEgPT4gc2VyaWFsaXplU2V0KGEpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2VyaWFsaXplU2V0KHNldDogRmllbGRUeXBlcykge1xyXG4gICAgcmV0dXJuIFsuLi5zZXRdLnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSk7XHJcbn1cclxuXHJcbmNsYXNzIEluc3RydW1lbnRlciB7XHJcblxyXG4gICAgZGVmOiBDbGFzc0RlZlxyXG4gICAgY2xhc3M6IEZ1bmN0aW9uO1xyXG4gICAgcHJvdG86IG9iamVjdDtcclxuICAgIGZpZWxkVHlwZXMgPSBuZXcgTWFwPHN0cmluZywgRmllbGRUeXBlcz4oKTtcclxuICAgIGFyZ1R5cGVzID0gbmV3IE1hcDxzdHJpbmcsIEFyZ1R5cGVzPigpO1xyXG4gICAgY2FsbGVkID0gbmV3IFNldDxzdHJpbmc+KCk7XHJcbiAgICBhc3NpZ25lZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xyXG4gICAgb25Qcm9ncmVzc0NhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG5cclxuICAgIGdldCBuYW1lKCkgeyByZXR1cm4gdGhpcy5kZWYubmFtZTsgfVxyXG4gICAgZ2V0IG5GaWVsZHMoKSB7IHJldHVybiB0aGlzLmZpZWxkVHlwZXMuc2l6ZTsgfVxyXG4gICAgZ2V0IG5GdW5jcygpIHsgcmV0dXJuIHRoaXMuYXJnVHlwZXMuc2l6ZTsgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRlZjogQ2xhc3NEZWYpIHtcclxuICAgICAgICB0aGlzLmRlZiA9IGRlZjtcclxuICAgICAgICB0aGlzLmNsYXNzID0gd2luZG93W3RoaXMubmFtZV07XHJcbiAgICAgICAgdGhpcy5wcm90byA9IGRlZi5iYXNlRnVuY3Rpb24ucHJvdG90eXBlO1xyXG5cclxuICAgICAgICBkZWYubWV0aG9kcy5mb3JFYWNoKG0gPT4ge1xyXG4gICAgICAgICAgICBpZiAobS5uYW1lID09PSAnY29uc3RydWN0b3InKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuYXJnVHlwZXMuc2V0KG0ubmFtZSwgW10pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZWYuZmllbGRzLmZvckVhY2goZiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZmllbGRUeXBlcy5zZXQoZi5uYW1lLCBuZXcgU2V0PHN0cmluZz4oKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnRMb2dnaW5nKCkge1xyXG4gICAgICAgIGZvciAobGV0IGtleSBvZiB0aGlzLmFyZ1R5cGVzLmtleXMoKSkge1xyXG4gICAgICAgICAgICBsZXQgbXlzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgbGV0IGZLZXkgPSBrZXk7XHJcbiAgICAgICAgICAgIC8vIFRPRE86IHBhc3MgY2xhc3MgZm9yIHVzZSBoZXJlISFcclxuICAgICAgICAgICAgT3ZlcnJpZGVSZWdpc3RyeS5iZWZvcmUod2luZG93W3RoaXMubmFtZV0sIGtleSwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYXJncyA9IFsuLi5hcmd1bWVudHNdO1xyXG4gICAgICAgICAgICAgICAgbXlzZWxmLnVwZGF0ZUFyZ01hcChmS2V5LCBhcmdzKTtcclxuICAgICAgICAgICAgfSk7ICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNlcmlhbGl6ZSgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjYWxsZWQ6IFsuLi50aGlzLmNhbGxlZF0sXHJcbiAgICAgICAgICAgIGFzc2lnbmVkOiBbLi4udGhpcy5hc3NpZ25lZF0sXHJcbiAgICAgICAgICAgIGZpZWxkVHlwZXM6IHNlcmlhbGl6ZU1hcCh0aGlzLmZpZWxkVHlwZXMpLFxyXG4gICAgICAgICAgICBhcmdUeXBlczogc2VyaWFsaXplTWFwKHRoaXMuYXJnVHlwZXMpLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZGVzZXJpYWxpemUoanNvbikge1xyXG4gICAgICAgIHRoaXMuY2FsbGVkID0gbmV3IFNldChqc29uLmNhbGxlZCk7XHJcbiAgICAgICAgdGhpcy5hc3NpZ25lZCA9IG5ldyBTZXQoanNvbi5hc3NpZ25lZCk7XHJcbiAgICAgICAgdGhpcy5maWVsZFR5cGVzID0gbmV3IE1hcChqc29uLmZpZWxkVHlwZXMubWFwKChba2V5LCB2YWx1ZV0pID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFtrZXksIG5ldyBTZXQodmFsdWUpXTtcclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy5hcmdUeXBlcyA9IG5ldyBNYXAoanNvbi5hcmdUeXBlcy5tYXAoKFtrZXksIHZhbHVlXSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gW2tleSwgdmFsdWUubWFwKGEgPT4gbmV3IFNldChhKSldO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUeXBlT2Yob2JqZWN0OiBvYmplY3QpIHtcclxuICAgICAgICBsZXQgdHlwZSA9IHR5cGVvZihvYmplY3QpIGFzIHN0cmluZztcclxuICAgICAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgT2JqZWN0ICYmIG9iamVjdC5jb25zdHJ1Y3RvcikgdHlwZSA9IG9iamVjdC5jb25zdHJ1Y3Rvci5uYW1lO1xyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZE9iamVjdChvYmo6IG9iamVjdCkge1xyXG4gICAgICAgIGZvciAobGV0IGtleSBvZiB0aGlzLmZpZWxkVHlwZXMua2V5cygpKSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IG9ialtrZXldO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkgY29udGludWU7XHJcbiAgICAgICAgICAgIHRoaXMuYXNzaWduZWQuYWRkKGtleSk7XHJcbiAgICAgICAgICAgIHRoaXMuZmllbGRUeXBlcy5nZXQoa2V5KS5hZGQodGhpcy5nZXRUeXBlT2YodmFsdWUpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQXJnTWFwKGtleTogc3RyaW5nLCBhcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIGxldCB0eXBlcyA9IHRoaXMuYXJnVHlwZXMuZ2V0KGtleSk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBhcmcgPSBhcmdzW2ldO1xyXG4gICAgICAgICAgICBpZiAoYXJnID09IG51bGwpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBsZXQgdHlwZSA9IHRoaXMuZ2V0VHlwZU9mKGFyZyk7XHJcbiAgICAgICAgICAgIHdoaWxlICh0eXBlcy5sZW5ndGggPD0gaSkge1xyXG4gICAgICAgICAgICAgICAgdHlwZXMucHVzaChuZXcgU2V0PHN0cmluZz4oKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdHlwZXNbaV0uYWRkKHR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuY2FsbGVkLmhhcyhrZXkpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsbGVkLmFkZChrZXkpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsIGAke3RoaXMuYXNzaWduZWQuc2l6ZX0gLyAke3RoaXMubkZpZWxkc30gZmllbGRzOyBgICtcclxuICAgICAgICAgICAgICAgIGAke3RoaXMuY2FsbGVkLnNpemV9IC8gJHt0aGlzLm5GdW5jc30gZnVuY3Rpb25zYCwga2V5LCB0eXBlcyk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uUHJvZ3Jlc3NDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblByb2dyZXNzQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQ2xhc3NEZWYge1xyXG4gICAgYmFzZUZ1bmN0aW9uOiBGdW5jdGlvbjtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHViZXIgPSBudWxsIGFzIHN0cmluZztcclxuICAgIGZ1bmN0aW9uUHJveHkgOiBNZXRob2Q7XHJcbiAgICBmaWVsZHMgPSBuZXcgTWFwPHN0cmluZywgRmllbGQ+O1xyXG4gICAgbWV0aG9kcyA9IG5ldyBNYXA8c3RyaW5nLCBNZXRob2Q+O1xyXG4gICAgYWRkZWRQYXJlbnREYXRhID0gZmFsc2U7XHJcblxyXG4gICAgZ2V0IGlzUHVyZUZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZ1bmN0aW9uUHJveHkgIT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihmdW5jOiBGdW5jdGlvbikge1xyXG4gICAgICAgIHRoaXMuYmFzZUZ1bmN0aW9uID0gZnVuYztcclxuICAgICAgICB0aGlzLm5hbWUgPSBmdW5jLm5hbWU7XHJcbiAgICAgICAgY29uc3QgcHJvdG8gPSBmdW5jLnByb3RvdHlwZTtcclxuICAgICAgICBpZiAoIXByb3RvKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmIChbLi4uT2JqZWN0LmtleXMocHJvdG8pXS5sZW5ndGggPD0gMSkge1xyXG4gICAgICAgICAgICB0aGlzLmZ1bmN0aW9uUHJveHkgPSBuZXcgTWV0aG9kKHRoaXMubmFtZSwgZnVuYyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudWJlciA9IGZ1bmNbJ3ViZXInXT8uY29uc3RydWN0b3I/Lm5hbWU7XHJcbiAgICAgICAgdGhpcy5pbmZlckZpZWxkcyhmdW5jKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvKSkge1xyXG4gICAgICAgICAgICAvLyBJIHRoaW5rIHRoaXMgaXMgcmVkdW5kYW50Li4uXHJcbiAgICAgICAgICAgIGlmICghcHJvdG8uaGFzT3duUHJvcGVydHkoa2V5KSkgY29udGludWU7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IHByb3RvW2tleV07XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGhvZHMuc2V0KGtleSwgbmV3IE1ldGhvZChrZXksIHZhbHVlKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBkaXN0aW5ndWlzaCBiZXR3ZWVuIGluaGVyaXRlZCBmaWVsZHMgYW5kIHN0YXRpYyBmaWVsZHNcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMuZmllbGRzLnB1c2gobmV3IEZpZWxkKGtleSwgdmFsdWUsIHRydWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmluZmVyRmllbGRzKHByb3RvWydpbml0J10pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBhcmVUbyhvdGhlcjogQ2xhc3NEZWYpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1B1cmVGdW5jdGlvbiAmJiAhb3RoZXIuaXNQdXJlRnVuY3Rpb24pIHJldHVybiAtMTtcclxuICAgICAgICBpZiAoIXRoaXMuaXNQdXJlRnVuY3Rpb24gJiYgb3RoZXIuaXNQdXJlRnVuY3Rpb24pIHJldHVybiAxO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUubG9jYWxlQ29tcGFyZShvdGhlci5uYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBObyBsb25nZXIgbmVlZGVkIGFzIG5ld2VyIFRTIHZlcnNpb24gYWxsb3dzIGZvciBmdW5jdGlvbiBvdmVybG9hZGluZy9zaGFkb3dpbmdcclxuICAgIGFkZFBhcmVudERhdGEoY2xhc3NlczogTWFwPHN0cmluZywgQ2xhc3NEZWY+KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuYWRkZWRQYXJlbnREYXRhKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5hZGRlZFBhcmVudERhdGEgPSB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLmZ1bmN0aW9uUHJveHkpIHJldHVybjtcclxuICAgICAgICBpZiAoIXRoaXMudWJlciB8fCAhY2xhc3Nlcy5oYXModGhpcy51YmVyKSkgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IGNsYXNzZXMuZ2V0KHRoaXMudWJlcik7XHJcbiAgICAgICAgaWYgKCFwYXJlbnQuYWRkZWRQYXJlbnREYXRhKSBwYXJlbnQuYWRkUGFyZW50RGF0YShjbGFzc2VzKTtcclxuICAgICAgICBmb3IgKGxldCBbbWV0aG9kTmFtZSwgbWV0aG9kXSBvZiBwYXJlbnQubWV0aG9kcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tZXRob2RzLmhhcyhtZXRob2ROYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIHRoaXMubWV0aG9kcy5zZXQobWV0aG9kTmFtZSwgbWV0aG9kKTtcclxuICAgICAgICAgICAgLy8gSWYgYSBmaWVsZCBvdmVyc2hhZG93cyBhIHBhcmVudCBtZXRob2QsIGl0IHdhcyBwcm9iYWJseVxyXG4gICAgICAgICAgICAvLyBhIG1pc3Rha2UsIHNvIGRlbGV0ZSBpdC5cclxuICAgICAgICAgICAgdGhpcy5maWVsZHMuZGVsZXRlKG1ldGhvZE5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBbZmllbGROYW1lLCBmaWVsZF0gb2YgcGFyZW50LmZpZWxkcykge1xyXG4gICAgICAgICAgICAvLyBEb24ndCBjb3B5IGZpZWxkcyB0aGF0IGhhdmUgc2hhZG93aW5nIG1ldGhvZHNcclxuICAgICAgICAgICAgaWYgKHRoaXMubWV0aG9kcy5oYXMoZmllbGROYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZpZWxkcy5oYXMoZmllbGROYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmllbGRzLnNldChmaWVsZE5hbWUsIGZpZWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5mZXJGaWVsZHMoZnVuYzogRnVuY3Rpb24pIHtcclxuICAgICAgICBpZiAoIWZ1bmMpIHJldHVybjtcclxuICAgICAgICBjb25zdCBqcyA9IGZ1bmMudG9TdHJpbmcoKTtcclxuICAgICAgICBjb25zdCB2YXJEZWMgPSAvXlxccyp0aGlzXFxzKlxcLlxccyooW2EtekEtWl8kXVswLTlhLXpBLVpfJF0qKVxccyo9L2dtO1xyXG4gICAgICAgIGZvciAobGV0IG1hdGNoIG9mIGpzLm1hdGNoQWxsKHZhckRlYykpIHtcclxuICAgICAgICAgICAgbGV0IG5hbWUgPSBtYXRjaFsxXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZmllbGRzLmhhcyhuYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIC8vIEdpdmUgcHJlY2VkZW5jZSB0byBtZXRob2RzXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1ldGhvZHMuaGFzKG5hbWUpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaWdub3JlRmllbGQobmFtZSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB0aGlzLmZpZWxkcy5zZXQobmFtZSwgbmV3IEZpZWxkKG5hbWUsIG51bGwsIGZhbHNlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlnbm9yZUZpZWxkKG5hbWU6IHN0cmluZykgOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5uYW1lID09PSAnVG9nZ2xlQnV0dG9uTW9ycGgnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lID09PSAncXVlcnknO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5uYW1lID09PSAnUGFpbnRDYW52YXNNb3JwaCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWUgPT09ICdpc1NoaWZ0UHJlc3NlZCc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydFN0YXRlbWVudCgpIHtcclxuICAgICAgICByZXR1cm4gYGV4cG9ydCBjb25zdCAke3RoaXMubmFtZX0gPSB3aW5kb3dbJyR7dGhpcy5uYW1lfSddO2A7XHJcbiAgICB9XHJcblxyXG4gICAgZG9lc1BhcmVudEhhdmVNZXRob2QobmFtZTogc3RyaW5nLCBnZW46IERlZkdlbmVyYXRvcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBwYXJlbnQgPSBnZW4uaGllcmFyY2h5LmdldCh0aGlzLm5hbWUpPy5wYXJlbnQ7XHJcbiAgICAgICAgd2hpbGUgKHBhcmVudCkge1xyXG4gICAgICAgICAgICBpZiAoZ2VuLmNsYXNzZXMuZ2V0KHBhcmVudC5uYW1lKT8ubWV0aG9kcy5oYXMobmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgXCJoYXMgZmllbGRcIiwgbmFtZSwgXCJ3aGljaCBvdmVyc2hhZG93cyBwYXJlbnQgbWV0aG9kXCIsIHBhcmVudC5uYW1lICsgJy4nICsgbmFtZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdG9UUyhnZW46IERlZkdlbmVyYXRvciwgaW5zdHJ1bWVudGVyOiBJbnN0cnVtZW50ZXIpIDogc3RyaW5nICB7XHJcbiAgICAgICAgaWYgKHRoaXMuZnVuY3Rpb25Qcm94eSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYGV4cG9ydCBmdW5jdGlvbiAke3RoaXMuZnVuY3Rpb25Qcm94eS50b1RTKGdlbil9YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBjb2RlID0gYGV4cG9ydCBjbGFzcyAke3RoaXMubmFtZX0gZXh0ZW5kcyAke3RoaXMudWJlciA/IHRoaXMudWJlciA6ICdTbmFwVHlwZSd9YDtcclxuICAgICAgICBjb2RlICs9IGAge1xcbmA7XHJcbiAgICAgICAgbGV0IGZLZXlzID0gWy4uLnRoaXMuZmllbGRzLmtleXMoKV07XHJcbiAgICAgICAgZktleXMuc29ydCgpO1xyXG4gICAgICAgIGZvciAobGV0IGZrZXkgb2YgZktleXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZG9lc1BhcmVudEhhdmVNZXRob2QoZmtleSwgZ2VuKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHBhcmVudCBoYXMgYSBtZXRob2Qgd2l0aCB0aGUgc2FtZSBuYW1lIGFzIGEgZmllbGQsIGlnbm9yZSBpdFxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHR5cGVzID0gaW5zdHJ1bWVudGVyPy5maWVsZFR5cGVzPy5nZXQoZmtleSk7XHJcbiAgICAgICAgICAgIGxldCB0eXBlc1N0cmluZyA9IGdlbi50eXBlc1RvVFModHlwZXMsIHRydWUpO1xyXG4gICAgICAgICAgICBjb2RlICs9ICcgICAgJyArIHRoaXMuZmllbGRzLmdldChma2V5KS50b1RTKHR5cGVzU3RyaW5nKSArICdcXG4nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb2RlICs9ICdcXG4nO1xyXG4gICAgICAgIGxldCBtS2V5cyA9IFsuLi50aGlzLm1ldGhvZHMua2V5cygpXTtcclxuICAgICAgICBtS2V5cy5zb3J0KCk7XHJcbiAgICAgICAgZm9yIChsZXQgbUtleSBvZiBtS2V5cykge1xyXG4gICAgICAgICAgICBjb2RlICs9ICcgICAgJyArIHRoaXMubWV0aG9kcy5nZXQobUtleSkudG9UUyhnZW4sIGluc3RydW1lbnRlcj8uYXJnVHlwZXM/LmdldChtS2V5KSkgKyAnXFxuJztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29kZSArPSAnfSc7XHJcbiAgICAgICAgcmV0dXJuIGNvZGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEZpZWxkIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGlzU3RhdGljOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSwgaXNTdGF0aWM6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuaXNTdGF0aWMgPSBpc1N0YXRpYztcclxuICAgICAgICAvLyBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIC8vICAgICB0aGlzLnR5cGUgPSB0eXBlb2YodmFsdWUpO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuXHJcbiAgICB0b1RTKHR5cGVzOiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYCR7dGhpcy5pc1N0YXRpYyA/ICdzdGF0aWMgJyA6ICcnfSR7dGhpcy5uYW1lfTogJHt0eXBlc307YDtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgTWV0aG9kIHtcclxuXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgU1RSSVBfQ09NTUVOVFMgPSAvKFxcL1xcLy4qJCl8KFxcL1xcKltcXHNcXFNdKj9cXCpcXC8pfChcXHMqPVteLFxcKV0qKCgnKD86XFxcXCd8W14nXFxyXFxuXSkqJyl8KFwiKD86XFxcXFwifFteXCJcXHJcXG5dKSpcIikpfChcXHMqPVteLFxcKV0qKSkvbWc7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgQVJHVU1FTlRfTkFNRVMgPSAvKFteXFxzLF0rKS9nO1xyXG5cclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHBhcmFtTmFtZXM6IHN0cmluZ1tdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgZnVuYzogRnVuY3Rpb24pIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMucGFyYW1OYW1lcyA9IHRoaXMuZ2V0UGFyYW1OYW1lcyhmdW5jKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQYXJhbU5hbWVzKGZ1bmM6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgbGV0IGZuU3RyID0gZnVuYy50b1N0cmluZygpLnJlcGxhY2UoTWV0aG9kLlNUUklQX0NPTU1FTlRTLCAnJyk7XHJcbiAgICAgICAgbGV0IHJlc3VsdFJlZ2V4ID0gZm5TdHIuc2xpY2UoZm5TdHIuaW5kZXhPZignKCcpKzEsIGZuU3RyLmluZGV4T2YoJyknKSkubWF0Y2goTWV0aG9kLkFSR1VNRU5UX05BTUVTKTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gcmVzdWx0UmVnZXggPyBbLi4ucmVzdWx0UmVnZXhdIDogW107XHJcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmZpbHRlcihwYXJhbSA9PiBwYXJhbS5tYXRjaCgvXlthLXpBLVpfJF1bMC05YS16QS1aXyRdKiQvKSlcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvVFMoZ2VuOiBEZWZHZW5lcmF0b3IsIGFyZ1R5cGVzPzogQXJnVHlwZXMpIDogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBvdmVycmlkZSA9IHRoaXMuY2hlY2tPdmVycmlkZSgpO1xyXG4gICAgICAgIGlmIChvdmVycmlkZSkgcmV0dXJuIG92ZXJyaWRlO1xyXG4gICAgICAgIGxldCBjb2RlID0gYCR7dGhpcy5uYW1lfShgO1xyXG4gICAgICAgIGxldCBmaXJzdCA9IHRydWU7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBuYW1lIG9mIHRoaXMucGFyYW1OYW1lcykge1xyXG4gICAgICAgICAgICBpZiAoIWZpcnN0KSBjb2RlICs9ICcsICc7XHJcbiAgICAgICAgICAgIGZpcnN0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCB0eXBlID0gZ2VuLnR5cGVzVG9UUyhhcmdUeXBlcz8uW2luZGV4XSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zaG91bGRJZ25vcmVUeXBlKG5hbWUpKSB0eXBlID0gJ2FueSc7XHJcbiAgICAgICAgICAgIC8vIGlmIChhcmdUeXBlcykgY29uc29sZS5sb2cobmFtZSwgYXJnVHlwZXNbaW5kZXhdLCB0eXBlKTtcclxuICAgICAgICAgICAgY29kZSArPSBgJHtuYW1lfT86ICR7dHlwZX1gO1xyXG4gICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb2RlICs9ICcpOyc7XHJcbiAgICAgICAgcmV0dXJuIGNvZGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvdWxkSWdub3JlVHlwZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAvLyBJbml0IGdldHMgc2hhZGRvd2VkIGNvbnNpc3RlbnRseSwgc28gaWdub3JlIHR5cGVzXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZSA9PT0gJ2luaXQnO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrT3ZlcnJpZGUoKSB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLm5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSAnY2hpbGRUaGF0SXNBJzogcmV0dXJuIGAke3RoaXMubmFtZX0oLi4uYXJnczogYW55W10pO2BcclxuICAgICAgICAgICAgY2FzZSAncGFyZW50VGhhdElzQSc6IHJldHVybiBgJHt0aGlzLm5hbWV9KC4uLmFyZ3M6IGFueVtdKTtgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIGltcG9ydCB7IEV2ZW50cywgRXh0ZW5zaW9uTWFuYWdlciB9IGZyb20gXCJzZWZcIjtcclxuaW1wb3J0IHsgQmxvY2tNb3JwaCwgQ2xvdWQsIElERV9Nb3JwaCwgU3ByaXRlTW9ycGgsIFN0YWdlTW9ycGgsIFZhcmlhYmxlRnJhbWUsIFdvcmxkTW9ycGggfSBmcm9tIFwiLi9TbmFwXCI7XHJcbmltcG9ydCB7IEJsb2NrSURBcmdzIH0gZnJvbSBcIi4uL2V2ZW50cy9TbmFwRXZlbnRMaXN0ZW5lclwiO1xyXG5cclxuXHJcbi8vIFRPRE86IE1ha2UgYW4gaW50ZXJmYWNlIHdpdGggYW4gaW1wbGVtZW50YXRpb24gdGhhdCBmZXRjaGVzIGZyb20gd2luZG93XHJcbmV4cG9ydCBjbGFzcyBTbmFwIHtcclxuXHJcbiAgICBzdGF0aWMgbGFzdFJ1bkJsb2NrOiBCbG9ja01vcnBoO1xyXG5cclxuICAgIHN0YXRpYyBnZXQgd29ybGQoKSA6IFdvcmxkTW9ycGgge1xyXG4gICAgICAgIHJldHVybiB3aW5kb3dbXCJ3b3JsZFwiXTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IElERSgpIDogSURFX01vcnBoIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53b3JsZD8uY2hpbGRUaGF0SXNBKHdpbmRvd1snSURFX01vcnBoJ10pIGFzIElERV9Nb3JwaDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IHN0YWdlKCkgOiBTdGFnZU1vcnBoIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5JREU/LnN0YWdlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgY3VycmVudFNwcml0ZSgpIDogU3ByaXRlTW9ycGggfCBTdGFnZU1vcnBoIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5JREU/LmN1cnJlbnRTcHJpdGUgYXMgU3ByaXRlTW9ycGggfCBTdGFnZU1vcnBoO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgc3ByaXRlcygpIDogU3ByaXRlTW9ycGhbXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuSURFPy5zcHJpdGVzPy5jb250ZW50cyB8fCBbXTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGNsb3VkKCkgOiBDbG91ZCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuSURFPy5jbG91ZDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdsb2JhbFZhcmlhYmxlcygpIDogVmFyaWFibGVGcmFtZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhZ2U/Lmdsb2JhbFZhcmlhYmxlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRTcHJpdGUobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ByaXRlcy5maWx0ZXIoc3ByaXRlID0+IHNwcml0ZS5uYW1lID09IG5hbWUpWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRCbG9jayhpZDogQmxvY2tJREFyZ3MpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53b3JsZC5hbGxDaGlsZHJlbigpXHJcbiAgICAgICAgICAgIC5maWx0ZXIoYiA9PiBiIGluc3RhbmNlb2YgQmxvY2tNb3JwaCAmJiBiLmlkID09IGlkLmlkKVswXTtcclxuICAgIH1cclxuXHJcbn0iLCJleHBvcnQgY29uc3QgY29udGFpbnMgPSB3aW5kb3dbJ2NvbnRhaW5zJ107XHJcbmV4cG9ydCBjb25zdCBjb3B5ID0gd2luZG93Wydjb3B5J107XHJcbmV4cG9ydCBjb25zdCBjb3B5Q2FudmFzID0gd2luZG93Wydjb3B5Q2FudmFzJ107XHJcbmV4cG9ydCBjb25zdCBkZWdyZWVzID0gd2luZG93WydkZWdyZWVzJ107XHJcbmV4cG9ydCBjb25zdCBkZXRlY3QgPSB3aW5kb3dbJ2RldGVjdCddO1xyXG5leHBvcnQgY29uc3QgZGlzYWJsZVJldGluYVN1cHBvcnQgPSB3aW5kb3dbJ2Rpc2FibGVSZXRpbmFTdXBwb3J0J107XHJcbmV4cG9ydCBjb25zdCBlbWJlZE1ldGFkYXRhUE5HID0gd2luZG93WydlbWJlZE1ldGFkYXRhUE5HJ107XHJcbmV4cG9ydCBjb25zdCBlbmFibGVSZXRpbmFTdXBwb3J0ID0gd2luZG93WydlbmFibGVSZXRpbmFTdXBwb3J0J107XHJcbmV4cG9ydCBjb25zdCBmb250SGVpZ2h0ID0gd2luZG93Wydmb250SGVpZ2h0J107XHJcbmV4cG9ydCBjb25zdCBnZXREb2N1bWVudFBvc2l0aW9uT2YgPSB3aW5kb3dbJ2dldERvY3VtZW50UG9zaXRpb25PZiddO1xyXG5leHBvcnQgY29uc3QgZ2V0TWluaW11bUZvbnRIZWlnaHQgPSB3aW5kb3dbJ2dldE1pbmltdW1Gb250SGVpZ2h0J107XHJcbmV4cG9ydCBjb25zdCBnZXRTRUZDb25maWcgPSB3aW5kb3dbJ2dldFNFRkNvbmZpZyddO1xyXG5leHBvcnQgY29uc3QgaGV4X3NoYTUxMiA9IHdpbmRvd1snaGV4X3NoYTUxMiddO1xyXG5leHBvcnQgY29uc3QgaW52b2tlID0gd2luZG93WydpbnZva2UnXTtcclxuZXhwb3J0IGNvbnN0IGlzTmlsID0gd2luZG93Wydpc05pbCddO1xyXG5leHBvcnQgY29uc3QgaXNPYmplY3QgPSB3aW5kb3dbJ2lzT2JqZWN0J107XHJcbmV4cG9ydCBjb25zdCBpc1JldGluYUVuYWJsZWQgPSB3aW5kb3dbJ2lzUmV0aW5hRW5hYmxlZCddO1xyXG5leHBvcnQgY29uc3QgaXNSZXRpbmFTdXBwb3J0ZWQgPSB3aW5kb3dbJ2lzUmV0aW5hU3VwcG9ydGVkJ107XHJcbmV4cG9ydCBjb25zdCBpc1NuYXBPYmplY3QgPSB3aW5kb3dbJ2lzU25hcE9iamVjdCddO1xyXG5leHBvcnQgY29uc3QgaXNTdHJpbmcgPSB3aW5kb3dbJ2lzU3RyaW5nJ107XHJcbmV4cG9ydCBjb25zdCBpc1VSTCA9IHdpbmRvd1snaXNVUkwnXTtcclxuZXhwb3J0IGNvbnN0IGlzVVJMQ2hhciA9IHdpbmRvd1snaXNVUkxDaGFyJ107XHJcbmV4cG9ydCBjb25zdCBpc1dvcmRDaGFyID0gd2luZG93Wydpc1dvcmRDaGFyJ107XHJcbmV4cG9ydCBjb25zdCBsb2NhbGl6ZSA9IHdpbmRvd1snbG9jYWxpemUnXTtcclxuZXhwb3J0IGNvbnN0IG0gPSB3aW5kb3dbJ20nXTtcclxuZXhwb3J0IGNvbnN0IG5ld0NhbnZhcyA9IHdpbmRvd1snbmV3Q2FudmFzJ107XHJcbmV4cG9ydCBjb25zdCBuZXdHdWlkID0gd2luZG93WyduZXdHdWlkJ107XHJcbmV4cG9ydCBjb25zdCBub3AgPSB3aW5kb3dbJ25vcCddO1xyXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplQ2FudmFzID0gd2luZG93Wydub3JtYWxpemVDYW52YXMnXTtcclxuZXhwb3J0IGNvbnN0IHJhZGlhbnMgPSB3aW5kb3dbJ3JhZGlhbnMnXTtcclxuZXhwb3J0IGNvbnN0IHNpemVPZiA9IHdpbmRvd1snc2l6ZU9mJ107XHJcbmV4cG9ydCBjb25zdCBTbmFwID0gd2luZG93WydTbmFwJ107XHJcbmV4cG9ydCBjb25zdCBzbmFwRXF1YWxzID0gd2luZG93WydzbmFwRXF1YWxzJ107XHJcbmV4cG9ydCBjb25zdCBBbGlnbm1lbnRNb3JwaCA9IHdpbmRvd1snQWxpZ25tZW50TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEFuaW1hdGlvbiA9IHdpbmRvd1snQW5pbWF0aW9uJ107XHJcbmV4cG9ydCBjb25zdCBBcmdMYWJlbE1vcnBoID0gd2luZG93WydBcmdMYWJlbE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBBcmdNb3JwaCA9IHdpbmRvd1snQXJnTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEFycm93TW9ycGggPSB3aW5kb3dbJ0Fycm93TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJsaW5rZXJNb3JwaCA9IHdpbmRvd1snQmxpbmtlck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja0RpYWxvZ01vcnBoID0gd2luZG93WydCbG9ja0RpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja0VkaXRvck1vcnBoID0gd2luZG93WydCbG9ja0VkaXRvck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja0V4cG9ydERpYWxvZ01vcnBoID0gd2luZG93WydCbG9ja0V4cG9ydERpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja0hpZ2hsaWdodE1vcnBoID0gd2luZG93WydCbG9ja0hpZ2hsaWdodE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja0ltcG9ydERpYWxvZ01vcnBoID0gd2luZG93WydCbG9ja0ltcG9ydERpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja0lucHV0RnJhZ21lbnRNb3JwaCA9IHdpbmRvd1snQmxvY2tJbnB1dEZyYWdtZW50TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJsb2NrTGFiZWxGcmFnbWVudCA9IHdpbmRvd1snQmxvY2tMYWJlbEZyYWdtZW50J107XHJcbmV4cG9ydCBjb25zdCBCbG9ja0xhYmVsRnJhZ21lbnRNb3JwaCA9IHdpbmRvd1snQmxvY2tMYWJlbEZyYWdtZW50TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJsb2NrTGFiZWxNb3JwaCA9IHdpbmRvd1snQmxvY2tMYWJlbE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja0xhYmVsUGxhY2VIb2xkZXJNb3JwaCA9IHdpbmRvd1snQmxvY2tMYWJlbFBsYWNlSG9sZGVyTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJsb2NrTW9ycGggPSB3aW5kb3dbJ0Jsb2NrTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJsb2NrUmVtb3ZhbERpYWxvZ01vcnBoID0gd2luZG93WydCbG9ja1JlbW92YWxEaWFsb2dNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQmxvY2tTeW1ib2xNb3JwaCA9IHdpbmRvd1snQmxvY2tTeW1ib2xNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQmxvY2tWaXNpYmlsaXR5RGlhbG9nTW9ycGggPSB3aW5kb3dbJ0Jsb2NrVmlzaWJpbGl0eURpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCb29sZWFuU2xvdE1vcnBoID0gd2luZG93WydCb29sZWFuU2xvdE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCb3VuY2VyTW9ycGggPSB3aW5kb3dbJ0JvdW5jZXJNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQm94TW9ycGggPSB3aW5kb3dbJ0JveE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDYW1TbmFwc2hvdERpYWxvZ01vcnBoID0gd2luZG93WydDYW1TbmFwc2hvdERpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDZWxsTW9ycGggPSB3aW5kb3dbJ0NlbGxNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQ2lyY2xlQm94TW9ycGggPSB3aW5kb3dbJ0NpcmNsZUJveE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDbG91ZCA9IHdpbmRvd1snQ2xvdWQnXTtcclxuZXhwb3J0IGNvbnN0IENvbG9yID0gd2luZG93WydDb2xvciddO1xyXG5leHBvcnQgY29uc3QgQ29sb3JQYWxldHRlTW9ycGggPSB3aW5kb3dbJ0NvbG9yUGFsZXR0ZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDb2xvclBpY2tlck1vcnBoID0gd2luZG93WydDb2xvclBpY2tlck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDb2xvclNsb3RNb3JwaCA9IHdpbmRvd1snQ29sb3JTbG90TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IENvbW1hbmRCbG9ja01vcnBoID0gd2luZG93WydDb21tYW5kQmxvY2tNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQ29tbWFuZFNsb3RNb3JwaCA9IHdpbmRvd1snQ29tbWFuZFNsb3RNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQ29tbWVudE1vcnBoID0gd2luZG93WydDb21tZW50TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IENvbnRleHQgPSB3aW5kb3dbJ0NvbnRleHQnXTtcclxuZXhwb3J0IGNvbnN0IENvc3R1bWUgPSB3aW5kb3dbJ0Nvc3R1bWUnXTtcclxuZXhwb3J0IGNvbnN0IENvc3R1bWVFZGl0b3JNb3JwaCA9IHdpbmRvd1snQ29zdHVtZUVkaXRvck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDb3N0dW1lSWNvbk1vcnBoID0gd2luZG93WydDb3N0dW1lSWNvbk1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDcm9zc2hhaXIgPSB3aW5kb3dbJ0Nyb3NzaGFpciddO1xyXG5leHBvcnQgY29uc3QgQ1Nsb3RNb3JwaCA9IHdpbmRvd1snQ1Nsb3RNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQ3Vyc29yTW9ycGggPSB3aW5kb3dbJ0N1cnNvck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDdXN0b21CbG9ja0RlZmluaXRpb24gPSB3aW5kb3dbJ0N1c3RvbUJsb2NrRGVmaW5pdGlvbiddO1xyXG5leHBvcnQgY29uc3QgQ3VzdG9tQ29tbWFuZEJsb2NrTW9ycGggPSB3aW5kb3dbJ0N1c3RvbUNvbW1hbmRCbG9ja01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDdXN0b21SZXBvcnRlckJsb2NrTW9ycGggPSB3aW5kb3dbJ0N1c3RvbVJlcG9ydGVyQmxvY2tNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgRGlhbE1vcnBoID0gd2luZG93WydEaWFsTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IERpYWxvZ0JveE1vcnBoID0gd2luZG93WydEaWFsb2dCb3hNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgRnJhbWVNb3JwaCA9IHdpbmRvd1snRnJhbWVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgRnVuY3Rpb25TbG90TW9ycGggPSB3aW5kb3dbJ0Z1bmN0aW9uU2xvdE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBHcmF5UGFsZXR0ZU1vcnBoID0gd2luZG93WydHcmF5UGFsZXR0ZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBIYW5kbGVNb3JwaCA9IHdpbmRvd1snSGFuZGxlTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEhhbmRNb3JwaCA9IHdpbmRvd1snSGFuZE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBIYXRCbG9ja01vcnBoID0gd2luZG93WydIYXRCbG9ja01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBJREVfTW9ycGggPSB3aW5kb3dbJ0lERV9Nb3JwaCddO1xyXG5leHBvcnQgY29uc3QgSW5wdXRGaWVsZE1vcnBoID0gd2luZG93WydJbnB1dEZpZWxkTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IElucHV0U2xvdERpYWxvZ01vcnBoID0gd2luZG93WydJbnB1dFNsb3REaWFsb2dNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgSW5wdXRTbG90TW9ycGggPSB3aW5kb3dbJ0lucHV0U2xvdE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBJbnB1dFNsb3RTdHJpbmdNb3JwaCA9IHdpbmRvd1snSW5wdXRTbG90U3RyaW5nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IElucHV0U2xvdFRleHRNb3JwaCA9IHdpbmRvd1snSW5wdXRTbG90VGV4dE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBJbnNwZWN0b3JNb3JwaCA9IHdpbmRvd1snSW5zcGVjdG9yTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEphZ2dlZEJsb2NrTW9ycGggPSB3aW5kb3dbJ0phZ2dlZEJsb2NrTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEpTQ29tcGlsZXIgPSB3aW5kb3dbJ0pTQ29tcGlsZXInXTtcclxuZXhwb3J0IGNvbnN0IEp1a2Vib3hNb3JwaCA9IHdpbmRvd1snSnVrZWJveE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBMaWJyYXJ5SW1wb3J0RGlhbG9nTW9ycGggPSB3aW5kb3dbJ0xpYnJhcnlJbXBvcnREaWFsb2dNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgTGlzdCA9IHdpbmRvd1snTGlzdCddO1xyXG5leHBvcnQgY29uc3QgTGlzdE1vcnBoID0gd2luZG93WydMaXN0TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IExpc3RXYXRjaGVyTW9ycGggPSB3aW5kb3dbJ0xpc3RXYXRjaGVyTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IExvY2FsaXplciA9IHdpbmRvd1snTG9jYWxpemVyJ107XHJcbmV4cG9ydCBjb25zdCBNZW51SXRlbU1vcnBoID0gd2luZG93WydNZW51SXRlbU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBNZW51TW9ycGggPSB3aW5kb3dbJ01lbnVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgTWljcm9waG9uZSA9IHdpbmRvd1snTWljcm9waG9uZSddO1xyXG5leHBvcnQgY29uc3QgTW9ycGggPSB3aW5kb3dbJ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBNb3VzZVNlbnNvck1vcnBoID0gd2luZG93WydNb3VzZVNlbnNvck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBNdWx0aUFyZ01vcnBoID0gd2luZG93WydNdWx0aUFyZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBOb2RlID0gd2luZG93WydOb2RlJ107XHJcbmV4cG9ydCBjb25zdCBOb3RlID0gd2luZG93WydOb3RlJ107XHJcbmV4cG9ydCBjb25zdCBQYWludENhbnZhc01vcnBoID0gd2luZG93WydQYWludENhbnZhc01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBQYWludENvbG9yUGlja2VyTW9ycGggPSB3aW5kb3dbJ1BhaW50Q29sb3JQaWNrZXJNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUGFpbnRFZGl0b3JNb3JwaCA9IHdpbmRvd1snUGFpbnRFZGl0b3JNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUGFsZXR0ZUhhbmRsZU1vcnBoID0gd2luZG93WydQYWxldHRlSGFuZGxlTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFBlbk1vcnBoID0gd2luZG93WydQZW5Nb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUGlhbm9LZXlNb3JwaCA9IHdpbmRvd1snUGlhbm9LZXlNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUGlhbm9NZW51TW9ycGggPSB3aW5kb3dbJ1BpYW5vTWVudU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBQb2ludCA9IHdpbmRvd1snUG9pbnQnXTtcclxuZXhwb3J0IGNvbnN0IFByb2Nlc3MgPSB3aW5kb3dbJ1Byb2Nlc3MnXTtcclxuZXhwb3J0IGNvbnN0IFByb2plY3QgPSB3aW5kb3dbJ1Byb2plY3QnXTtcclxuZXhwb3J0IGNvbnN0IFByb2plY3REaWFsb2dNb3JwaCA9IHdpbmRvd1snUHJvamVjdERpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBQcm9qZWN0UmVjb3ZlcnlEaWFsb2dNb3JwaCA9IHdpbmRvd1snUHJvamVjdFJlY292ZXJ5RGlhbG9nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFByb3RvdHlwZUhhdEJsb2NrTW9ycGggPSB3aW5kb3dbJ1Byb3RvdHlwZUhhdEJsb2NrTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFB1c2hCdXR0b25Nb3JwaCA9IHdpbmRvd1snUHVzaEJ1dHRvbk1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBSZWFkU3RyZWFtID0gd2luZG93WydSZWFkU3RyZWFtJ107XHJcbmV4cG9ydCBjb25zdCBSZWN0YW5nbGUgPSB3aW5kb3dbJ1JlY3RhbmdsZSddO1xyXG5leHBvcnQgY29uc3QgUmVwb3J0ZXJCbG9ja01vcnBoID0gd2luZG93WydSZXBvcnRlckJsb2NrTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFJlcG9ydGVyU2xvdE1vcnBoID0gd2luZG93WydSZXBvcnRlclNsb3RNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUmluZ0NvbW1hbmRTbG90TW9ycGggPSB3aW5kb3dbJ1JpbmdDb21tYW5kU2xvdE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBSaW5nTW9ycGggPSB3aW5kb3dbJ1JpbmdNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUmluZ1JlcG9ydGVyU2xvdE1vcnBoID0gd2luZG93WydSaW5nUmVwb3J0ZXJTbG90TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNjZW5lID0gd2luZG93WydTY2VuZSddO1xyXG5leHBvcnQgY29uc3QgU2NlbmVBbGJ1bU1vcnBoID0gd2luZG93WydTY2VuZUFsYnVtTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNjZW5lSWNvbk1vcnBoID0gd2luZG93WydTY2VuZUljb25Nb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU2NyaXB0Rm9jdXNNb3JwaCA9IHdpbmRvd1snU2NyaXB0Rm9jdXNNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU2NyaXB0c01vcnBoID0gd2luZG93WydTY3JpcHRzTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNjcm9sbEZyYW1lTW9ycGggPSB3aW5kb3dbJ1Njcm9sbEZyYW1lTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNoYWRvd01vcnBoID0gd2luZG93WydTaGFkb3dNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU2xpZGVyQnV0dG9uTW9ycGggPSB3aW5kb3dbJ1NsaWRlckJ1dHRvbk1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTbGlkZXJNb3JwaCA9IHdpbmRvd1snU2xpZGVyTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNuYXBFdmVudE1hbmFnZXIgPSB3aW5kb3dbJ1NuYXBFdmVudE1hbmFnZXInXTtcclxuZXhwb3J0IGNvbnN0IFNuYXBTZXJpYWxpemVyID0gd2luZG93WydTbmFwU2VyaWFsaXplciddO1xyXG5leHBvcnQgY29uc3QgU291bmQgPSB3aW5kb3dbJ1NvdW5kJ107XHJcbmV4cG9ydCBjb25zdCBTb3VuZEljb25Nb3JwaCA9IHdpbmRvd1snU291bmRJY29uTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNvdW5kUmVjb3JkZXJEaWFsb2dNb3JwaCA9IHdpbmRvd1snU291bmRSZWNvcmRlckRpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTcGVlY2hCdWJibGVNb3JwaCA9IHdpbmRvd1snU3BlZWNoQnViYmxlTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNwcml0ZUJ1YmJsZU1vcnBoID0gd2luZG93WydTcHJpdGVCdWJibGVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU3ByaXRlSGlnaGxpZ2h0TW9ycGggPSB3aW5kb3dbJ1Nwcml0ZUhpZ2hsaWdodE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTcHJpdGVJY29uTW9ycGggPSB3aW5kb3dbJ1Nwcml0ZUljb25Nb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU3ByaXRlTW9ycGggPSB3aW5kb3dbJ1Nwcml0ZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTdGFnZUhhbmRsZU1vcnBoID0gd2luZG93WydTdGFnZUhhbmRsZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTdGFnZU1vcnBoID0gd2luZG93WydTdGFnZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTdGFnZVBpY2tlckl0ZW1Nb3JwaCA9IHdpbmRvd1snU3RhZ2VQaWNrZXJJdGVtTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFN0YWdlUGlja2VyTW9ycGggPSB3aW5kb3dbJ1N0YWdlUGlja2VyTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFN0YWdlUHJvbXB0ZXJNb3JwaCA9IHdpbmRvd1snU3RhZ2VQcm9tcHRlck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTdHJpbmdGaWVsZE1vcnBoID0gd2luZG93WydTdHJpbmdGaWVsZE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTdHJpbmdNb3JwaCA9IHdpbmRvd1snU3RyaW5nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNWR19Db3N0dW1lID0gd2luZG93WydTVkdfQ29zdHVtZSddO1xyXG5leHBvcnQgY29uc3QgU3ltYm9sTW9ycGggPSB3aW5kb3dbJ1N5bWJvbE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTeW50YXhFbGVtZW50TW9ycGggPSB3aW5kb3dbJ1N5bnRheEVsZW1lbnRNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVGFibGUgPSB3aW5kb3dbJ1RhYmxlJ107XHJcbmV4cG9ydCBjb25zdCBUYWJsZUNlbGxNb3JwaCA9IHdpbmRvd1snVGFibGVDZWxsTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFRhYmxlRGlhbG9nTW9ycGggPSB3aW5kb3dbJ1RhYmxlRGlhbG9nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFRhYmxlRnJhbWVNb3JwaCA9IHdpbmRvd1snVGFibGVGcmFtZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBUYWJsZU1vcnBoID0gd2luZG93WydUYWJsZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBUYWJNb3JwaCA9IHdpbmRvd1snVGFiTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFRlbXBsYXRlU2xvdE1vcnBoID0gd2luZG93WydUZW1wbGF0ZVNsb3RNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVGV4dE1vcnBoID0gd2luZG93WydUZXh0TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFRleHRTbG90TW9ycGggPSB3aW5kb3dbJ1RleHRTbG90TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFRocmVhZE1hbmFnZXIgPSB3aW5kb3dbJ1RocmVhZE1hbmFnZXInXTtcclxuZXhwb3J0IGNvbnN0IFRvZ2dsZUJ1dHRvbk1vcnBoID0gd2luZG93WydUb2dnbGVCdXR0b25Nb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVG9nZ2xlRWxlbWVudE1vcnBoID0gd2luZG93WydUb2dnbGVFbGVtZW50TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFRvZ2dsZU1vcnBoID0gd2luZG93WydUb2dnbGVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVHJpZ2dlck1vcnBoID0gd2luZG93WydUcmlnZ2VyTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFR1cnRsZUljb25Nb3JwaCA9IHdpbmRvd1snVHVydGxlSWNvbk1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBWYXJpYWJsZSA9IHdpbmRvd1snVmFyaWFibGUnXTtcclxuZXhwb3J0IGNvbnN0IFZhcmlhYmxlRGlhbG9nTW9ycGggPSB3aW5kb3dbJ1ZhcmlhYmxlRGlhbG9nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFZhcmlhYmxlRnJhbWUgPSB3aW5kb3dbJ1ZhcmlhYmxlRnJhbWUnXTtcclxuZXhwb3J0IGNvbnN0IFZlY3RvckVsbGlwc2UgPSB3aW5kb3dbJ1ZlY3RvckVsbGlwc2UnXTtcclxuZXhwb3J0IGNvbnN0IFZlY3RvckxpbmUgPSB3aW5kb3dbJ1ZlY3RvckxpbmUnXTtcclxuZXhwb3J0IGNvbnN0IFZlY3RvclBhaW50Q2FudmFzTW9ycGggPSB3aW5kb3dbJ1ZlY3RvclBhaW50Q2FudmFzTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFZlY3RvclBhaW50RWRpdG9yTW9ycGggPSB3aW5kb3dbJ1ZlY3RvclBhaW50RWRpdG9yTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFZlY3RvclBvbHlnb24gPSB3aW5kb3dbJ1ZlY3RvclBvbHlnb24nXTtcclxuZXhwb3J0IGNvbnN0IFZlY3RvclJlY3RhbmdsZSA9IHdpbmRvd1snVmVjdG9yUmVjdGFuZ2xlJ107XHJcbmV4cG9ydCBjb25zdCBWZWN0b3JTZWxlY3Rpb24gPSB3aW5kb3dbJ1ZlY3RvclNlbGVjdGlvbiddO1xyXG5leHBvcnQgY29uc3QgVmVjdG9yU2hhcGUgPSB3aW5kb3dbJ1ZlY3RvclNoYXBlJ107XHJcbmV4cG9ydCBjb25zdCBWaWRlb01vdGlvbiA9IHdpbmRvd1snVmlkZW9Nb3Rpb24nXTtcclxuZXhwb3J0IGNvbnN0IFdhcmRyb2JlTW9ycGggPSB3aW5kb3dbJ1dhcmRyb2JlTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFdhdGNoZXJNb3JwaCA9IHdpbmRvd1snV2F0Y2hlck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBXb3JsZE1hcCA9IHdpbmRvd1snV29ybGRNYXAnXTtcclxuZXhwb3J0IGNvbnN0IFdvcmxkTW9ycGggPSB3aW5kb3dbJ1dvcmxkTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFhNTF9FbGVtZW50ID0gd2luZG93WydYTUxfRWxlbWVudCddO1xyXG5leHBvcnQgY29uc3QgWE1MX1NlcmlhbGl6ZXIgPSB3aW5kb3dbJ1hNTF9TZXJpYWxpemVyJ107IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBCbG9ja3MgfSBmcm9tIFwiLi9ibG9ja3MvQmxvY2tGYWN0b3J5XCI7XHJcbmltcG9ydCB7IEV2ZW50TWFuYWdlciB9IGZyb20gXCIuL2V2ZW50cy9FdmVudE1hbmFnZXJcIjtcclxuaW1wb3J0IHsgRXh0ZW5zaW9uIH0gZnJvbSBcIi4vZXh0ZW5zaW9uL0V4dGVuc2lvblwiO1xyXG5pbXBvcnQgeyBFeHRlbnNpb25NYW5hZ2VyIH0gZnJvbSBcIi4vZXh0ZW5zaW9uL0V4dGVuc2lvbk1hbmFnZXJcIjtcclxuaW1wb3J0IHsgRGVmR2VuZXJhdG9yIH0gZnJvbSBcIi4vbWV0YS9EZWZHZW5lcmF0b3JcIjtcclxuaW1wb3J0IHsgU25hcCB9IGZyb20gXCIuL3NuYXAvU25hcFV0aWxzXCI7XHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuL2V2ZW50cy9TbmFwRXZlbnRzXCI7XHJcbmltcG9ydCB7IE92ZXJyaWRlUmVnaXN0cnkgfSBmcm9tIFwiLi9leHRlbmQvT3ZlcnJpZGVSZWdpc3RyeVwiO1xyXG5pbXBvcnQgeyBDbG91ZCB9IGZyb20gXCIuL2lvL0Nsb3VkVXRpbHNcIjtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgLy8gU25hcCBpcyBsb2FkZWQgYWZ0ZXIgdGhlIHdpbmRvd1xyXG4gICAgICAgIEV4dGVuc2lvbk1hbmFnZXIuaW5pdCgpO1xyXG4gICAgfSwgMCk7XHJcbn0pXHJcblxyXG4vLyBGb3IgY29udmVuaWVuY2UsIG1ha2Ugc25hcCBnbG9iYWxcclxud2luZG93WydTbmFwJ10gPSBTbmFwO1xyXG5cclxuLy8gRXZlcnl0aGluZyBlbHNlIGNhbiBiZSBhY2Nlc3NlZCB2aWEgbGlicmFyeSB3aXRoXHJcbi8vIFNFRi5YWFhcclxuZXhwb3J0IHtcclxuICAgIEJsb2NrcyxcclxuICAgIENsb3VkLFxyXG4gICAgRGVmR2VuZXJhdG9yLFxyXG4gICAgRXZlbnRNYW5hZ2VyLFxyXG4gICAgRXZlbnRzLFxyXG4gICAgRXh0ZW5zaW9uLFxyXG4gICAgRXh0ZW5zaW9uTWFuYWdlcixcclxuICAgIE92ZXJyaWRlUmVnaXN0cnksXHJcbiAgICBTbmFwLFxyXG59O1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=