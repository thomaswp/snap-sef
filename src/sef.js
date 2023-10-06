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
            this.needsInit = false;
            this.blocks = [];
            this.needsInit = false;
            let myBlocks = this.blocks;
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
                myBlocks.forEach(block => {
                    block.addToMap(Snap_1.SpriteMorph.prototype.blocks);
                });
            });
            OverrideRegistry_1.OverrideRegistry.extend(Snap_1.SpriteMorph, 'blockTemplates', override, false);
            OverrideRegistry_1.OverrideRegistry.extend(Snap_1.StageMorph, 'blockTemplates', override, false);
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
        addCategory(name, color) {
            // TODO: Fix this so that the layout works
            // SpriteMorph.prototype.categories.push(name);
            // SpriteMorph.prototype.blockColor[name] = color;
            SnapUtils_1.Snap.IDE.addPaletteCategory(name, color);
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
        if (lastProject) {
            SnapUtils_1.Snap.IDE.loadProjectXML(lastProject);
            console.log("Loading last project", SnapUtils_1.Snap.IDE.getProjectName());
        }
        window.onbeforeunload = () => { };
        ExtensionManager_1.ExtensionManager.events.Trace.addGlobalListener((message) => {
            // Wait for next frame, since some edits occur after the log
            setTimeout(() => {
                let xml = SnapUtils_1.Snap.IDE.getProjectXML();
                if (xml != this.lastProjectXML) {
                    this.lastProjectXML = xml;
                    localStorage.setItem(LAST_PROJECT_KEY, xml);
                    console.log("Saved project after: " + message);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFRLENBQUMsRUFBZTtRQUMzQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFO2FBQzFCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxpQkFBVSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7Q0FFSjtBQXJDRCxvQkFxQ0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNDTTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O1VDN0xQO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ05BLHdHQUErQztBQXNCM0Msd0ZBdEJLLHFCQUFNLFFBc0JMO0FBckJWLHdHQUFxRDtBQXdCakQsOEZBeEJLLDJCQUFZLFFBd0JMO0FBdkJoQixxR0FBa0Q7QUF5QjlDLDJGQXpCSyxxQkFBUyxRQXlCTDtBQXhCYiwwSEFBZ0U7QUF5QjVELGtHQXpCSyxtQ0FBZ0IsUUF5Qkw7QUF4QnBCLG9HQUFtRDtBQW9CL0MsOEZBcEJLLDJCQUFZLFFBb0JMO0FBbkJoQiwyRkFBd0M7QUF5QnBDLHNGQXpCSyxnQkFBSSxRQXlCTDtBQXhCUixrR0FBNkM7QUFvQnpDLHdGQXBCSyxtQkFBTSxRQW9CTDtBQW5CVixvSEFBNkQ7QUFzQnpELGtHQXRCSyxtQ0FBZ0IsUUFzQkw7QUFyQnBCLDBGQUF3QztBQWVwQyx1RkFmSyxrQkFBSyxRQWVMO0FBYlQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDakMsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNaLGtDQUFrQztRQUNsQyxtQ0FBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM1QixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDVixDQUFDLENBQUM7QUFFRiwrQ0FBK0M7QUFDL0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLGdCQUFJLENBQUM7QUFDdEIsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsbUNBQWdCLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9TRUYvLi9zcmMvYmxvY2tzL0Jsb2NrRmFjdG9yeS50cyIsIndlYnBhY2s6Ly9TRUYvLi9zcmMvZGV2L0Rldk1vZGUudHMiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL2V2ZW50cy9FdmVudE1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL2V2ZW50cy9TbmFwRXZlbnRMaXN0ZW5lci50cyIsIndlYnBhY2s6Ly9TRUYvLi9zcmMvZXZlbnRzL1NuYXBFdmVudHMudHMiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL2V4dGVuZC9PdmVycmlkZVJlZ2lzdHJ5LnRzIiwid2VicGFjazovL1NFRi8uL3NyYy9leHRlbnNpb24vRXh0ZW5zaW9uLnRzIiwid2VicGFjazovL1NFRi8uL3NyYy9leHRlbnNpb24vRXh0ZW5zaW9uTWFuYWdlci50cyIsIndlYnBhY2s6Ly9TRUYvLi9zcmMvaW8vQ2xvdWRVdGlscy50cyIsIndlYnBhY2s6Ly9TRUYvLi9zcmMvbWV0YS9EZWZHZW5lcmF0b3IudHMiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL3NuYXAvU25hcFV0aWxzLnRzIiwid2VicGFjazovL1NFRi8uL3NyYy9zbmFwL1NuYXAuanMiLCJ3ZWJwYWNrOi8vU0VGL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1NFRi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vU0VGL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vU0VGL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE92ZXJyaWRlUmVnaXN0cnkgfSBmcm9tIFwiLi4vZXh0ZW5kL092ZXJyaWRlUmVnaXN0cnlcIjtcclxuaW1wb3J0IHsgU25hcCB9IGZyb20gXCIuLi9zbmFwL1NuYXBVdGlsc1wiO1xyXG5pbXBvcnQgeyBDb2xvciwgbG9jYWxpemUsIFNwcml0ZU1vcnBoLCBTdGFnZU1vcnBoLCBTeW50YXhFbGVtZW50TW9ycGgsIFRvZ2dsZU1vcnBoIH0gZnJvbSBcIi4uL3NuYXAvU25hcFwiO1xyXG5cclxuZXhwb3J0IG5hbWVzcGFjZSBCbG9ja3Mge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBCbG9ja0ZhY3Rvcnkge1xyXG5cclxuICAgICAgICBwcml2YXRlIGJsb2NrczogQmxvY2tbXTtcclxuICAgICAgICBwcml2YXRlIG5lZWRzSW5pdCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgdGhpcy5ibG9ja3MgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5uZWVkc0luaXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgbGV0IG15QmxvY2tzID0gdGhpcy5ibG9ja3M7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBvdmVycmlkZSA9IGZ1bmN0aW9uKGJhc2UsIGNhdGVnb3J5OiBzdHJpbmcsIGFsbDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrcyA9IGJhc2UuY2FsbCh0aGlzLCBjYXRlZ29yeSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hlY2tTcHJpdGUgPSB0aGlzIGluc3RhbmNlb2YgU3RhZ2VNb3JwaDtcclxuICAgICAgICAgICAgICAgIGxldCBhZGRlZCA9IDA7XHJcbiAgICAgICAgICAgICAgICBteUJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2suY2F0ZWdvcnkgPT09IGNhdGVnb3J5ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAhKGNoZWNrU3ByaXRlICYmIGJsb2NrLnNwcml0ZU9ubHkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChibG9jay50b3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5zcGxpY2UoYWRkZWQsIDAsIGJsb2NrLnRvQmxvY2tNb3JwaCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5zcGxpY2UoYWRkZWQsIDAsIGJsb2NrLnRvVG9nZ2xlKHRoaXMpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGVkKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja3MucHVzaChibG9jay50b1RvZ2dsZSh0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja3MucHVzaChibG9jay50b0Jsb2NrTW9ycGgoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBibG9ja3M7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBPdmVycmlkZVJlZ2lzdHJ5LmV4dGVuZChTcHJpdGVNb3JwaCwgJ2luaXRCbG9ja3MnLCBmdW5jdGlvbihiYXNlKSB7XHJcbiAgICAgICAgICAgICAgICBiYXNlLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBteUJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5hZGRUb01hcChTcHJpdGVNb3JwaC5wcm90b3R5cGUuYmxvY2tzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIE92ZXJyaWRlUmVnaXN0cnkuZXh0ZW5kKFNwcml0ZU1vcnBoLCAnYmxvY2tUZW1wbGF0ZXMnLCBvdmVycmlkZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBPdmVycmlkZVJlZ2lzdHJ5LmV4dGVuZChTdGFnZU1vcnBoLCAnYmxvY2tUZW1wbGF0ZXMnLCBvdmVycmlkZSwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5xdWV1ZVJlZnJlc2goKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlZ2lzdGVyQmxvY2soYmxvY2s6IEJsb2NrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYmxvY2tzLnB1c2goYmxvY2spO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXVlUmVmcmVzaCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcXVldWVSZWZyZXNoKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5uZWVkc0luaXQpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5uZWVkc0luaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5uZWVkc0luaXQpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICB9LCAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlZnJlc2goKSB7XHJcbiAgICAgICAgICAgIGlmICghU25hcC5JREUpIHJldHVybjtcclxuICAgICAgICAgICAgU3ByaXRlTW9ycGgucHJvdG90eXBlLmluaXRCbG9ja3MoKTtcclxuICAgICAgICAgICAgU25hcC5JREUuZmx1c2hCbG9ja3NDYWNoZSgpO1xyXG4gICAgICAgICAgICBTbmFwLklERS5yZWZyZXNoUGFsZXR0ZSgpO1xyXG4gICAgICAgICAgICBTbmFwLklERS5jYXRlZ29yaWVzLnJlZnJlc2hFbXB0eSgpO1xyXG4gICAgICAgICAgICB0aGlzLm5lZWRzSW5pdCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYWRkQ2F0ZWdvcnkobmFtZTogc3RyaW5nLCBjb2xvcjogQ29sb3IpIHtcclxuICAgICAgICAgICAgLy8gVE9ETzogRml4IHRoaXMgc28gdGhhdCB0aGUgbGF5b3V0IHdvcmtzXHJcbiAgICAgICAgICAgIC8vIFNwcml0ZU1vcnBoLnByb3RvdHlwZS5jYXRlZ29yaWVzLnB1c2gobmFtZSk7XHJcbiAgICAgICAgICAgIC8vIFNwcml0ZU1vcnBoLnByb3RvdHlwZS5ibG9ja0NvbG9yW25hbWVdID0gY29sb3I7XHJcbiAgICAgICAgICAgIFNuYXAuSURFLmFkZFBhbGV0dGVDYXRlZ29yeShuYW1lLCBjb2xvcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhZGRMYWJlbGVkSW5wdXQobmFtZTogc3RyaW5nLCBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCAuLi50YWdzOiBJbnB1dFRhZ1tdKSB7XHJcbiAgICAgICAgICAgIGlmIChTeW50YXhFbGVtZW50TW9ycGgucHJvdG90eXBlLmxhYmVsUGFydHNbbmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW5wdXQgdHlwZSB3aXRoIGxhYmVsICR7bmFtZX0gYWxyZWFkeSBleGlzdHMuYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gRW5zdXJlIHRoYXQgYWxsIHN0cmluZyB2YWx1ZXMgYXJlIGFycmF5LWVuY2xvc2VkXHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZvckVhY2goayA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKG9wdGlvbnNba10pID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNba10gPSBbb3B0aW9uc1trXV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIFN5bnRheEVsZW1lbnRNb3JwaC5wcm90b3R5cGUubGFiZWxQYXJ0c1tuYW1lXSA9IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdpbnB1dCcsXHJcbiAgICAgICAgICAgICAgICB0YWdzOiB0YWdzLmpvaW4oJyAnKSxcclxuICAgICAgICAgICAgICAgIG1lbnU6IG9wdGlvbnMsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBlbnVtIElucHV0VGFnIHtcclxuICAgICAgICAvKiogVmFsdWVzIHdpbGwgYmUgaW50ZXJwcmV0ZWQgYXMgbnVtZXJpYy4gKi9cclxuICAgICAgICBOdW1iZXJpYyA9ICdudW1lcmljJyxcclxuICAgICAgICBSZWFkT25seSA9ICdyZWFkLW9ubHknLFxyXG4gICAgICAgIFVuZXZhbHVhdGVkID0gJ3VuZXZhbHVhdGVkJyxcclxuICAgICAgICAvKiogVGhlIGlucHV0IGNhbm5vdCBiZSByZXBsYWNlZCB3aXRoIGEgcmVwb3J0ZXIuICovXHJcbiAgICAgICAgU3RhdGljID0gJ3N0YXRpYycsXHJcbiAgICAgICAgTGFuZHNjYXBlID0gJ2xhbmRzY2FwZScsXHJcbiAgICAgICAgLyoqIE1vbm9zcGFjZSBmb250LiAqL1xyXG4gICAgICAgIE1vbm9zcGFjZSA9ICdtb25vc3BhY2UnLFxyXG4gICAgICAgIEZhZGluZyA9ICdmYWRpbmcnLFxyXG4gICAgICAgIFByb3RlY3RlZCA9ICdwcm90ZWN0ZWQnLFxyXG4gICAgICAgIExvb3AgPSAnbG9vcCcsXHJcbiAgICAgICAgLyoqIFRoZSBpbnB1dCBpcyBhIGxhbWJkYSBleHByZXNzaW9uLiAqL1xyXG4gICAgICAgIExhbWJkYSA9ICdsYW1iZGEnLFxyXG4gICAgICAgIC8qKiBUaGUgaW5wdXQgaXMgZWRpdGVkIHVzaW5nIGEgY3VzdG9tIHdpZGdldC4gKi9cclxuICAgICAgICBXaWRnZXQgPSAnd2lkZ2V0J1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBlbnVtIEJsb2NrVHlwZSB7XHJcbiAgICAgICAgQ29tbWFuZCA9ICdjb21tYW5kJyxcclxuICAgICAgICBSZXBvcnRlciA9ICdyZXBvcnRlcicsXHJcbiAgICAgICAgUHJlZGljYXRlID0gJ3ByZWRpY2F0ZScsXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEJsb2NrIHtcclxuXHJcbiAgICAgICAgc2VsZWN0b3I6IHN0cmluZztcclxuICAgICAgICBzcGVjOiBzdHJpbmc7XHJcbiAgICAgICAgZGVmYXVsdHM6IGFueVtdO1xyXG4gICAgICAgIHR5cGU6IEJsb2NrVHlwZTtcclxuICAgICAgICBjYXRlZ29yeTogc3RyaW5nO1xyXG4gICAgICAgIHNwcml0ZU9ubHk6IGJvb2xlYW47XHJcbiAgICAgICAgdG9wOiBib29sZWFuO1xyXG4gICAgICAgIHRvZ2dsYWJsZTogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgICAgIHNlbGVjdG9yOiBzdHJpbmcsIHNwZWM6IHN0cmluZywgZGVmYXVsdHM6IGFueVtdLCB0eXBlOiBCbG9ja1R5cGUsXHJcbiAgICAgICAgICAgIGNhdGVnb3J5OiBzdHJpbmcsIHNwcml0ZU9ubHkgPSBmYWxzZSwgdG9wID0gZmFsc2UsIHRvZ2dsYWJsZSA9IGZhbHNlLFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3I7XHJcbiAgICAgICAgICAgIHRoaXMuc3BlYyA9IHNwZWM7XHJcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0cztcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICAgICAgdGhpcy5jYXRlZ29yeSA9IGNhdGVnb3J5O1xyXG4gICAgICAgICAgICB0aGlzLnNwcml0ZU9ubHkgPSBzcHJpdGVPbmx5O1xyXG4gICAgICAgICAgICB0aGlzLnRvcCA9IHRvcDtcclxuICAgICAgICAgICAgdGhpcy50b2dnbGFibGUgPSB0b2dnbGFibGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhZGRUb01hcChtYXApIHtcclxuICAgICAgICAgICAgbWFwW3RoaXMuc2VsZWN0b3JdID0ge1xyXG4gICAgICAgICAgICAgICAgb25seTogdGhpcy5zcHJpdGVPbmx5ID8gU3ByaXRlTW9ycGggOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogdGhpcy5jYXRlZ29yeSxcclxuICAgICAgICAgICAgICAgIHNwZWM6IGxvY2FsaXplKHRoaXMuc3BlYyksXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0czogdGhpcy5kZWZhdWx0cyxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRvQmxvY2tNb3JwaCgpIHtcclxuICAgICAgICAgICAgaWYgKFN0YWdlTW9ycGgucHJvdG90eXBlLmhpZGRlblByaW1pdGl2ZXNbdGhpcy5zZWxlY3Rvcl0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBuZXdCbG9jayA9XHJcbiAgICAgICAgICAgICAgICBTcHJpdGVNb3JwaC5wcm90b3R5cGUuYmxvY2tGb3JTZWxlY3Rvcih0aGlzLnNlbGVjdG9yLCB0cnVlKTtcclxuICAgICAgICAgICAgaWYgKCFuZXdCbG9jaykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdDYW5ub3QgaW5pdGlhbGl6ZSBibG9jaycsIHRoaXMuc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbmV3QmxvY2suaXNUZW1wbGF0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdCbG9jaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRvVG9nZ2xlKHNwcml0ZSA6IFNwcml0ZU1vcnBoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy50b2dnbGFibGUpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0b3IgPSB0aGlzLnNlbGVjdG9yO1xyXG4gICAgICAgICAgICBpZiAoU3RhZ2VNb3JwaC5wcm90b3R5cGUuaGlkZGVuUHJpbWl0aXZlc1tzZWxlY3Rvcl0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBpbmZvID0gU3ByaXRlTW9ycGgucHJvdG90eXBlLmJsb2Nrc1tzZWxlY3Rvcl07XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVG9nZ2xlTW9ycGgoXHJcbiAgICAgICAgICAgICAgICAnY2hlY2tib3gnLFxyXG4gICAgICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzcHJpdGUudG9nZ2xlV2F0Y2hlcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsaXplKGluZm8uc3BlYyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwcml0ZS5ibG9ja0NvbG9yW2luZm8uY2F0ZWdvcnldXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzcHJpdGUuc2hvd2luZ1dhdGNoZXIoc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG51bGxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFkZFNwcml0ZUFjdGlvbihhY3Rpb246ICguLi5hcmdzIDogYW55KSA9PiBhbnkpIDogQmxvY2sge1xyXG4gICAgICAgICAgICBTcHJpdGVNb3JwaC5wcm90b3R5cGVbdGhpcy5zZWxlY3Rvcl0gPVxyXG4gICAgICAgICAgICAgICAgU3RhZ2VNb3JwaC5wcm90b3R5cGVbdGhpcy5zZWxlY3Rvcl0gPSBhY3Rpb247XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBFeHRlbnNpb25NYW5hZ2VyIH0gZnJvbSBcIi4uL2V4dGVuc2lvbi9FeHRlbnNpb25NYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFNuYXAgfSBmcm9tIFwiLi4vc25hcC9TbmFwVXRpbHNcIjtcclxuXHJcbmNvbnN0IERFVl9NT0RFX1VSTFMgPSBbXHJcbiAgICBcImxvY2FsaG9zdFwiLFxyXG4gICAgXCIxMjcuMC4wLjFcIixcclxuXTtcclxuXHJcbmNvbnN0IERFVl9NT0RFX1VSTF9QQVJBTSA9IFwiZGV2TW9kZVwiO1xyXG5cclxuY29uc3QgTEFTVF9QUk9KRUNUX0tFWSA9IFwibGFzdFByb2plY3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBEZXZNb2RlIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIHRydWUsIHRoaXMgbWVhbnMgdGhlIHVzZXIgaXMgcnVubmluZyB0aGUgZWRpdG9yIGxvY2FsbHkgb3IgaGFzXHJcbiAgICAgKiBzZXQgdGhlIGRldk1vZGUgVVJMIHBhcmFtZXRlciB0byB0cnVlLiBXaGVuIGRldk1vZGUgaXMgZW5hYmxlZCxcclxuICAgICAqIHRoZSBlZGl0b3Igd2lsbCBhdXRvbWF0aWNhbGx5IHNhdmUgdGhlIHByb2plY3QgdG8gbG9jYWwgc3RvcmFnZVxyXG4gICAgICogYWZ0ZXIgZXZlcnkgY2hhbmdlIGFuZCByZWxvYWQgaXQgb24gcGFnZSBsb2FkLlxyXG4gICAgICovXHJcbiAgICByZWFkb25seSBpc0Rldk1vZGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgbGFzdFByb2plY3RYTUw6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmlzRGV2TW9kZSA9IERFVl9NT0RFX1VSTFMuc29tZSh1cmwgPT4gd2luZG93LmxvY2F0aW9uLmhyZWYuaW5jbHVkZXModXJsKSk7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XHJcbiAgICAgICAgaWYgKHBhcmFtcy5oYXMoREVWX01PREVfVVJMX1BBUkFNKSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzRGV2TW9kZSA9IHBhcmFtcy5nZXQoREVWX01PREVfVVJMX1BBUkFNKSA9PSBcInRydWVcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNEZXZNb2RlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBsYXN0UHJvamVjdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKExBU1RfUFJPSkVDVF9LRVkpO1xyXG4gICAgICAgIGlmIChsYXN0UHJvamVjdCkge1xyXG4gICAgICAgICAgICBTbmFwLklERS5sb2FkUHJvamVjdFhNTChsYXN0UHJvamVjdCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTG9hZGluZyBsYXN0IHByb2plY3RcIiwgU25hcC5JREUuZ2V0UHJvamVjdE5hbWUoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3aW5kb3cub25iZWZvcmV1bmxvYWQgPSAoKSA9PiB7fTtcclxuICAgICAgICBFeHRlbnNpb25NYW5hZ2VyLmV2ZW50cy5UcmFjZS5hZGRHbG9iYWxMaXN0ZW5lcigobWVzc2FnZSkgPT4ge1xyXG4gICAgICAgICAgICAvLyBXYWl0IGZvciBuZXh0IGZyYW1lLCBzaW5jZSBzb21lIGVkaXRzIG9jY3VyIGFmdGVyIHRoZSBsb2dcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgeG1sID0gU25hcC5JREUuZ2V0UHJvamVjdFhNTCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHhtbCAhPSB0aGlzLmxhc3RQcm9qZWN0WE1MKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0UHJvamVjdFhNTCA9IHhtbDtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShMQVNUX1BST0pFQ1RfS0VZLCB4bWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2F2ZWQgcHJvamVjdCBhZnRlcjogXCIgKyBtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn0iLCJcclxuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSBcIi4vU25hcEV2ZW50c1wiO1xyXG5pbXBvcnQgeyBTbmFwRXZlbnRMaXN0ZW5lciB9IGZyb20gXCIuL1NuYXBFdmVudExpc3RlbmVyXCI7XHJcbmltcG9ydCB7IFNuYXBFdmVudE1hbmFnZXIgfSBmcm9tIFwiLi4vc25hcC9TbmFwXCI7XHJcbmltcG9ydCB7IFNuYXAgfSBmcm9tIFwiLi4vc25hcC9TbmFwVXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFdmVudE1hbmFnZXIge1xyXG5cclxuICAgIFRyYWNlOiBTbmFwRXZlbnRNYW5hZ2VyO1xyXG4gICAgbGlzdGVuZXJzOiBNYXA8c3RyaW5nLCBTbmFwRXZlbnRMaXN0ZW5lcltdPjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLlRyYWNlID0gd2luZG93WydUcmFjZSddO1xyXG4gICAgICAgIGlmICghdGhpcy5UcmFjZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgRXZlbnQgTWFuYWdlciAtIFRyYWNlIGRvZXMgbm90IGV4aXN0IScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IG5ldyBNYXAoKTtcclxuICAgICAgICB0aGlzLlRyYWNlLmFkZEdsb2JhbExpc3RlbmVyKChtZXNzYWdlOiBzdHJpbmcsIGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUV2ZW50KG1lc3NhZ2UsIGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKG5ldyBFdmVudHMuQmxvY2suQ2xpY2tSdW5MaXN0ZW5lcigoaWQpID0+IHtcclxuICAgICAgICAgICAgU25hcC5sYXN0UnVuQmxvY2sgPSBTbmFwLmdldEJsb2NrKGlkKTtcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVFdmVudChtZXNzYWdlOiBzdHJpbmcsIGRhdGE6IGFueSkge1xyXG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycy5nZXQobWVzc2FnZSk7XHJcbiAgICAgICAgaWYgKCFsaXN0ZW5lcnMpIHJldHVybjtcclxuICAgICAgICBsaXN0ZW5lcnMuZm9yRWFjaChsID0+IHtcclxuICAgICAgICAgICAgbGV0IGFyZ3MgPSBsLmNvbnZlcnRBcmdzKGRhdGEpO1xyXG4gICAgICAgICAgICBsLmNhbGxiYWNrKGFyZ3MpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZExpc3RlbmVyKGxpc3RlbmVyOiBTbmFwRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgICAgIGlmICghbGlzdGVuZXIpIHJldHVybjtcclxuICAgICAgICBsZXQgdHlwZSA9IGxpc3RlbmVyLnR5cGU7XHJcbiAgICAgICAgaWYgKCF0aGlzLmxpc3RlbmVycy5oYXModHlwZSkpIHRoaXMubGlzdGVuZXJzLnNldCh0eXBlLCBbXSk7XHJcbiAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmxpc3RlbmVycy5nZXQobGlzdGVuZXIudHlwZSk7XHJcbiAgICAgICAgbGlzdC5wdXNoKGxpc3RlbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICB0ZXN0KCkge1xyXG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIobmV3IEV2ZW50cy5CbG9jay5SZW5hbWVMaXN0ZW5lcihhcmdzID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYXJncy5pZC5zZWxlY3Rvcik7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIobmV3IEV2ZW50cy5JbnB1dFNsb3QuTWVudUl0ZW1TZWxlY3RlZExpc3RlbmVyKGFyZ3MgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhcmdzLml0ZW0pO1xyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKG5ldyBFdmVudHMuQmxvY2suQ3JlYXRlZExpc3RlbmVyKGFyZ3MgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhcmdzLmlkKTtcclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcihuZXcgRXZlbnRzLklERS5BZGRTcHJpdGVMaXN0ZW5lcihhcmdzID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYXJncy5uYW1lKTtcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xyXG4gICAgcmVhZG9ubHkgY2FsbGJhY2s6IEZ1bmN0aW9uO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZywgY2FsbGJhY2s6IChhcmdzOiBTbmFwRXZlbnRBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICB9XHJcblxyXG4gICAgY29udmVydEFyZ3MoZGF0YTogYW55KSB7XHJcbiAgICAgICAgaWYgKGRhdGEgPT0gbnVsbCkgcmV0dXJuIHt9O1xyXG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHJldHVybiBkYXRhO1xyXG4gICAgICAgIGxldCBvYmogPSB7fTtcclxuICAgICAgICBvYmpbdGhpcy5nZXRWYWx1ZUtleSgpXSA9IGRhdGE7XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH1cclxuXHJcbiAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICd2YWx1ZSc7IH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTbmFwRXZlbnRBcmdzIHtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRW1wdHlBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcblxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFZhbHVlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgdmFsdWU6IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBCbG9ja0lEQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgaWQ6IG51bWJlcjtcclxuICAgIHNlbGVjdG9yOiBzdHJpbmc7XHJcbiAgICB0ZW1wbGF0ZTogYm9vbGVhbjtcclxuICAgIHNwZWM6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbnB1dElEQXJncyBleHRlbmRzIEJsb2NrSURBcmdzIHtcclxuICAgIGFyZ0luZGV4OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tQmxvY2tEZWZBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICBzcGVjOiBzdHJpbmc7XHJcbiAgICBjYXRlZ29yeTogc3RyaW5nO1xyXG4gICAgdHlwZTogc3RyaW5nO1xyXG4gICAgZ3VpZDogc3RyaW5nO1xyXG4gICAgaXNHbG9iYWw6IGJvb2xlYW47XHJcbn0iLCJpbXBvcnQgeyBCbG9ja0lEQXJncywgRW1wdHlBcmdzLCBJbnB1dElEQXJncywgQ3VzdG9tQmxvY2tEZWZBcmdzLCBTbmFwRXZlbnRBcmdzLCBTbmFwRXZlbnRMaXN0ZW5lciwgVmFsdWVBcmdzIH0gZnJvbSBcIi4vU25hcEV2ZW50TGlzdGVuZXJcIjtcclxuZXhwb3J0IG5hbWVzcGFjZSBFdmVudHMge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBCbG9jayB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBDbGlja1J1bkxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay5jbGlja1J1bic7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBCbG9ja0lEQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ2xpY2tSdW5MaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIENsaWNrU3RvcFJ1bkxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay5jbGlja1N0b3BSdW4nO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKENsaWNrU3RvcFJ1bkxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQ3JlYXRlZExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay5jcmVhdGVkJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEJsb2NrSURBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihDcmVhdGVkTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBEcmFnRGVzdHJveUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay5kcmFnRGVzdHJveSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBCbG9ja0lEQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoRHJhZ0Rlc3Ryb3lMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHcmFiYmVkQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpZDogQmxvY2tJREFyZ3M7XHJcbiAgICAgICAgICAgIG9yaWdpbjogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEdyYWJiZWRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2suZ3JhYmJlZCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBHcmFiYmVkQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoR3JhYmJlZExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlZmFjdG9yVmFyQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpZDogQmxvY2tJREFyZ3M7XHJcbiAgICAgICAgICAgIG9sZE5hbWU6IGFueTtcclxuICAgICAgICAgICAgbmV3TmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFJlZmFjdG9yVmFyTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLnJlZmFjdG9yVmFyJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFJlZmFjdG9yVmFyQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoUmVmYWN0b3JWYXJMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZWZhY3RvclZhckVycm9yQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpZDogQmxvY2tJREFyZ3M7XHJcbiAgICAgICAgICAgIHdoZXJlOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgUmVmYWN0b3JWYXJFcnJvckxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay5yZWZhY3RvclZhckVycm9yJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFJlZmFjdG9yVmFyRXJyb3JBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihSZWZhY3RvclZhckVycm9yTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVsYWJlbEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IEJsb2NrSURBcmdzO1xyXG4gICAgICAgICAgICBzZWxlY3RvcjogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFJlbGFiZWxMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2sucmVsYWJlbCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBSZWxhYmVsQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoUmVsYWJlbExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlbmFtZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IEJsb2NrSURBcmdzO1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgUmVuYW1lTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLnJlbmFtZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBSZW5hbWVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihSZW5hbWVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFJpbmdpZnlMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2sucmluZ2lmeSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBCbG9ja0lEQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoUmluZ2lmeUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU2NyaXB0UGljTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLnNjcmlwdFBpYyc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBCbG9ja0lEQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoU2NyaXB0UGljTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTaG93SGVscExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay5zaG93SGVscCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBCbG9ja0lEQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoU2hvd0hlbHBMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTbmFwcGVkQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpZDogQmxvY2tJREFyZ3M7XHJcbiAgICAgICAgICAgIG9yaWdpbjogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNuYXBwZWRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2suc25hcHBlZCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBTbmFwcGVkQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoU25hcHBlZExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgVG9nZ2xlVHJhbnNpZW50VmFyaWFibGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2sudG9nZ2xlVHJhbnNpZW50VmFyaWFibGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogVmFsdWVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihUb2dnbGVUcmFuc2llbnRWYXJpYWJsZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgVW5yaW5naWZ5TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLnVucmluZ2lmeSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBCbG9ja0lEQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVW5yaW5naWZ5TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBVc2VyRGVzdHJveUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay51c2VyRGVzdHJveSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBCbG9ja0lEQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVXNlckRlc3Ryb3lMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIEJsb2NrRWRpdG9yIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIENhbmNlbExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9ja0VkaXRvci5jYW5jZWwnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQ3VzdG9tQmxvY2tEZWZBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihDYW5jZWxMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIENoYW5nZVR5cGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2tFZGl0b3IuY2hhbmdlVHlwZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBDdXN0b21CbG9ja0RlZkFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKENoYW5nZVR5cGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE9rTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrRWRpdG9yLm9rJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEN1c3RvbUJsb2NrRGVmQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoT2tMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFN0YXJ0TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrRWRpdG9yLnN0YXJ0JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEN1c3RvbUJsb2NrRGVmQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoU3RhcnRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBVcGRhdGVCbG9ja0xhYmVsQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuZXdGcmFnbWVudDogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFVwZGF0ZUJsb2NrTGFiZWxMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2tFZGl0b3IudXBkYXRlQmxvY2tMYWJlbCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBVcGRhdGVCbG9ja0xhYmVsQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVXBkYXRlQmxvY2tMYWJlbExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25ld0ZyYWdtZW50JzsgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBCbG9ja1R5cGVEaWFsb2cge1xyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQ2FuY2VsTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrVHlwZURpYWxvZy5jYW5jZWwnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihDYW5jZWxMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIENoYW5nZUJsb2NrVHlwZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9ja1R5cGVEaWFsb2cuY2hhbmdlQmxvY2tUeXBlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ2hhbmdlQmxvY2tUeXBlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBOZXdCbG9ja0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9ja1R5cGVEaWFsb2cubmV3QmxvY2snO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihOZXdCbG9ja0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgT2tMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2tUeXBlRGlhbG9nLm9rJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoT2tMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIEJvb2xlYW5TbG90TW9ycGgge1xyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFRvZ2dsZVZhbHVlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpZDogSW5wdXRJREFyZ3M7XHJcbiAgICAgICAgICAgIHZhbHVlOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgVG9nZ2xlVmFsdWVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQm9vbGVhblNsb3RNb3JwaC50b2dnbGVWYWx1ZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBUb2dnbGVWYWx1ZUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFRvZ2dsZVZhbHVlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBDb2xvckFyZyB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQ2hhbmdlQ29sb3JBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlkOiBJbnB1dElEQXJncztcclxuICAgICAgICAgICAgY29sb3I6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBDaGFuZ2VDb2xvckxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdDb2xvckFyZy5jaGFuZ2VDb2xvcic7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBDaGFuZ2VDb2xvckFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKENoYW5nZUNvbG9yTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBDb21tYW5kQmxvY2sge1xyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFdyYXBBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlkOiBCbG9ja0lEQXJncztcclxuICAgICAgICAgICAgdGFyZ2V0OiBCbG9ja0lEQXJncztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBXcmFwTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0NvbW1hbmRCbG9jay53cmFwJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFdyYXBBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihXcmFwTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBJREUge1xyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFkZFNwcml0ZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgbmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEFkZFNwcml0ZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuYWRkU3ByaXRlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEFkZFNwcml0ZUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEFkZFNwcml0ZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VDYXRlZ29yeUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgY2F0ZWdvcnk6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBDaGFuZ2VDYXRlZ29yeUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuY2hhbmdlQ2F0ZWdvcnknO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQ2hhbmdlQ2F0ZWdvcnlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihDaGFuZ2VDYXRlZ29yeUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ2NhdGVnb3J5JzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBEZWxldGVDdXN0b21CbG9ja0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuZGVsZXRlQ3VzdG9tQmxvY2snO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQ3VzdG9tQmxvY2tEZWZBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihEZWxldGVDdXN0b21CbG9ja0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIER1cGxpY2F0ZVNwcml0ZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgbmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIER1cGxpY2F0ZVNwcml0ZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuZHVwbGljYXRlU3ByaXRlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IER1cGxpY2F0ZVNwcml0ZUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKER1cGxpY2F0ZVNwcml0ZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEV4cG9ydEdsb2JhbEJsb2Nrc0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuZXhwb3J0R2xvYmFsQmxvY2tzJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoRXhwb3J0R2xvYmFsQmxvY2tzTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0UHJvZWpjdEFzQ2xvdWREYXRhQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRXhwb3J0UHJvZWpjdEFzQ2xvdWREYXRhTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5leHBvcnRQcm9lamN0QXNDbG91ZERhdGEnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRXhwb3J0UHJvZWpjdEFzQ2xvdWREYXRhQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoRXhwb3J0UHJvZWpjdEFzQ2xvdWREYXRhTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnbmFtZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEV4cG9ydFByb2plY3RBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBFeHBvcnRQcm9qZWN0TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5leHBvcnRQcm9qZWN0JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEV4cG9ydFByb2plY3RBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihFeHBvcnRQcm9qZWN0TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnbmFtZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEV4cG9ydFByb2plY3RNZWRpYUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgbmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEV4cG9ydFByb2plY3RNZWRpYUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuZXhwb3J0UHJvamVjdE1lZGlhJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEV4cG9ydFByb2plY3RNZWRpYUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEV4cG9ydFByb2plY3RNZWRpYUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBvcnRQcm9qZWN0Tm9NZWRpYUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgbmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEV4cG9ydFByb2plY3ROb01lZGlhTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5leHBvcnRQcm9qZWN0Tm9NZWRpYSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFeHBvcnRQcm9qZWN0Tm9NZWRpYUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEV4cG9ydFByb2plY3ROb01lZGlhTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnbmFtZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRXhwb3J0U2NyaXB0c1BpY3R1cmVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmV4cG9ydFNjcmlwdHNQaWN0dXJlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoRXhwb3J0U2NyaXB0c1BpY3R1cmVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBvcnRTcHJpdGVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBFeHBvcnRTcHJpdGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmV4cG9ydFNwcml0ZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFeHBvcnRTcHJpdGVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihFeHBvcnRTcHJpdGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBHcmVlbkZsYWdMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmdyZWVuRmxhZyc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEdyZWVuRmxhZ0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIExvYWRGYWlsZWRBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGVycjogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIExvYWRGYWlsZWRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmxvYWRGYWlsZWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogTG9hZEZhaWxlZEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKExvYWRGYWlsZWRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICdlcnInOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE5ld1Byb2plY3RMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLm5ld1Byb2plY3QnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihOZXdQcm9qZWN0TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBPcGVuQmxvY2tzU3RyaW5nTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5vcGVuQmxvY2tzU3RyaW5nJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoT3BlbkJsb2Nrc1N0cmluZ0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgT3BlbkNsb3VkRGF0YVN0cmluZ0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUub3BlbkNsb3VkRGF0YVN0cmluZyc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE9wZW5DbG91ZERhdGFTdHJpbmdMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE9wZW5NZWRpYVN0cmluZ0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUub3Blbk1lZGlhU3RyaW5nJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoT3Blbk1lZGlhU3RyaW5nTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgT3BlblByb2plY3RBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBPcGVuUHJvamVjdExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUub3BlblByb2plY3QnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogT3BlblByb2plY3RBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihPcGVuUHJvamVjdExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE9wZW5Qcm9qZWN0U3RyaW5nTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5vcGVuUHJvamVjdFN0cmluZyc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE9wZW5Qcm9qZWN0U3RyaW5nTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBPcGVuU3ByaXRlc1N0cmluZ0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUub3BlblNwcml0ZXNTdHJpbmcnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihPcGVuU3ByaXRlc1N0cmluZ0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgT3BlbmVkTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5vcGVuZWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihPcGVuZWRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBQYWludE5ld1Nwcml0ZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgbmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFBhaW50TmV3U3ByaXRlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5wYWludE5ld1Nwcml0ZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBQYWludE5ld1Nwcml0ZUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFBhaW50TmV3U3ByaXRlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnbmFtZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgUGF1c2VMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnBhdXNlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoUGF1c2VMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSb3RhdGlvblN0eWxlQ2hhbmdlZEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgcm90YXRpb25TdHlsZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFJvdGF0aW9uU3R5bGVDaGFuZ2VkTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5yb3RhdGlvblN0eWxlQ2hhbmdlZCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBSb3RhdGlvblN0eWxlQ2hhbmdlZEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFJvdGF0aW9uU3R5bGVDaGFuZ2VkTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAncm90YXRpb25TdHlsZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVQcm9qZWN0VG9DbG91ZEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgbmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNhdmVQcm9qZWN0VG9DbG91ZExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuc2F2ZVByb2plY3RUb0Nsb3VkJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFNhdmVQcm9qZWN0VG9DbG91ZEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNhdmVQcm9qZWN0VG9DbG91ZExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZWxlY3RTcHJpdGVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTZWxlY3RTcHJpdGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnNlbGVjdFNwcml0ZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBTZWxlY3RTcHJpdGVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTZWxlY3RTcHJpdGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0TGFuZ3VhZ2VBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGxhbmc6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTZXRMYW5ndWFnZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuc2V0TGFuZ3VhZ2UnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogU2V0TGFuZ3VhZ2VBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTZXRMYW5ndWFnZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ2xhbmcnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXRTcHJpdGVEcmFnZ2FibGVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlzRHJhZ2dhYmxlOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU2V0U3ByaXRlRHJhZ2dhYmxlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5zZXRTcHJpdGVEcmFnZ2FibGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogU2V0U3ByaXRlRHJhZ2dhYmxlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoU2V0U3ByaXRlRHJhZ2dhYmxlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnaXNEcmFnZ2FibGUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXRTcHJpdGVUYWJBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIHRhYlN0cmluZzogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNldFNwcml0ZVRhYkxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuc2V0U3ByaXRlVGFiJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFNldFNwcml0ZVRhYkFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNldFNwcml0ZVRhYkxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ3RhYlN0cmluZyc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU3RvcExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuc3RvcCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFN0b3BMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBUb2dnbGVBcHBNb2RlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpc0FwcE1vZGU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBUb2dnbGVBcHBNb2RlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS50b2dnbGVBcHBNb2RlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFRvZ2dsZUFwcE1vZGVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihUb2dnbGVBcHBNb2RlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnaXNBcHBNb2RlJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgVG9nZ2xlU3RhZ2VTaXplQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpc1NtYWxsU3RhZ2U6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBUb2dnbGVTdGFnZVNpemVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnRvZ2dsZVN0YWdlU2l6ZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBUb2dnbGVTdGFnZVNpemVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihUb2dnbGVTdGFnZVNpemVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICdpc1NtYWxsU3RhZ2UnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFVucGF1c2VMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnVucGF1c2UnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihVbnBhdXNlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBJbnB1dFNsb3Qge1xyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEVkaXRlZEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IElucHV0SURBcmdzO1xyXG4gICAgICAgICAgICB0ZXh0OiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRWRpdGVkTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lucHV0U2xvdC5lZGl0ZWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRWRpdGVkQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoRWRpdGVkTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTWVudUl0ZW1TZWxlY3RlZEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IElucHV0SURBcmdzO1xyXG4gICAgICAgICAgICBpdGVtOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgTWVudUl0ZW1TZWxlY3RlZExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJbnB1dFNsb3QubWVudUl0ZW1TZWxlY3RlZCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBNZW51SXRlbVNlbGVjdGVkQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoTWVudUl0ZW1TZWxlY3RlZExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgTXVsdGlBcmcge1xyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQWRkSW5wdXRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnTXVsdGlBcmcuYWRkSW5wdXQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogSW5wdXRJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEFkZElucHV0TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBSZW1vdmVJbnB1dExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdNdWx0aUFyZy5yZW1vdmVJbnB1dCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBJbnB1dElEQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoUmVtb3ZlSW5wdXRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIFByb2plY3REaWFsb2cge1xyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNldFNvdXJjZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgc291cmNlOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU2V0U291cmNlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ1Byb2plY3REaWFsb2cuc2V0U291cmNlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFNldFNvdXJjZUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNldFNvdXJjZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ3NvdXJjZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNoYXJlUHJvamVjdEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgbmFtZTogYW55O1xyXG4gICAgICAgICAgICBpc1RoaXNQcm9qZWN0OiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU2hhcmVQcm9qZWN0TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ1Byb2plY3REaWFsb2cuc2hhcmVQcm9qZWN0JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFNoYXJlUHJvamVjdEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNoYXJlUHJvamVjdExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU2hvd25MaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnUHJvamVjdERpYWxvZy5zaG93bic7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNob3duTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgVW5zaGFyZVByb2plY3RBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIFByb2plY3ROYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgVW5zaGFyZVByb2plY3RMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnUHJvamVjdERpYWxvZy51bnNoYXJlUHJvamVjdCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBVbnNoYXJlUHJvamVjdEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFVuc2hhcmVQcm9qZWN0TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnUHJvamVjdE5hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIFNjcmlwdHMge1xyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQ2xlYW5VcExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdTY3JpcHRzLmNsZWFuVXAnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihDbGVhblVwTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBFeHBvcnRQaWN0dXJlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ1NjcmlwdHMuZXhwb3J0UGljdHVyZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEV4cG9ydFBpY3R1cmVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZWRyb3BBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGFjdGlvbjogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFJlZHJvcExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdTY3JpcHRzLnJlZHJvcCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBSZWRyb3BBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihSZWRyb3BMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICdhY3Rpb24nOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBVbmRyb3BBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGFjdGlvbjogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFVuZHJvcExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdTY3JpcHRzLnVuZHJvcCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBVbmRyb3BBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihVbmRyb3BMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICdhY3Rpb24nOyB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIFNwcml0ZSB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQWRkVmFyaWFibGVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBBZGRWYXJpYWJsZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdTcHJpdGUuYWRkVmFyaWFibGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQWRkVmFyaWFibGVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihBZGRWYXJpYWJsZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVWYXJpYWJsZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgdmFyTmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIERlbGV0ZVZhcmlhYmxlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ1Nwcml0ZS5kZWxldGVWYXJpYWJsZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBEZWxldGVWYXJpYWJsZUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKERlbGV0ZVZhcmlhYmxlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAndmFyTmFtZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNldE5hbWVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIHN0cmluZzogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNldE5hbWVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnU3ByaXRlLnNldE5hbWUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogU2V0TmFtZUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNldE5hbWVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICdzdHJpbmcnOyB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIFhNTCB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUGFyc2VGYWlsZWRBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIHhtbFN0cmluZzogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFBhcnNlRmFpbGVkTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ1hNTC5wYXJzZUZhaWxlZCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBQYXJzZUZhaWxlZEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFBhcnNlRmFpbGVkTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAneG1sU3RyaW5nJzsgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIE92ZXJyaWRlUmVnaXN0cnkge1xyXG5cclxuICAgIHN0YXRpYyBleHRlbmQoY2xhenogOiBGdW5jdGlvbiwgZnVuY3Rpb25OYW1lIDogc3RyaW5nLCBuZXdGdW5jdGlvbiwgY291bnRBcmdzID0gdHJ1ZSkge1xyXG4gICAgICAgIGlmICghY2xhenogfHwgIWNsYXp6LnByb3RvdHlwZSkge1xyXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdleHRlbmQgcmVxdWlyZXMgYSBjbGFzcyBmb3IgaXRzIGZpcnN0IGFyZ3VtZW50Jyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIE92ZXJyaWRlUmVnaXN0cnkuZXh0ZW5kT2JqZWN0KGNsYXp6LnByb3RvdHlwZSwgZnVuY3Rpb25OYW1lLCBuZXdGdW5jdGlvbiwgY291bnRBcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWZ0ZXIoY2xhenogOiBGdW5jdGlvbiwgZnVuY3Rpb25OYW1lIDogc3RyaW5nLCBkb0FmdGVyOiAoLi4uYXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgIE92ZXJyaWRlUmVnaXN0cnkud3JhcChjbGF6eiwgZnVuY3Rpb25OYW1lLCBudWxsLCBkb0FmdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYmVmb3JlKGNsYXp6IDogRnVuY3Rpb24sIGZ1bmN0aW9uTmFtZSA6IHN0cmluZywgZG9CZWZvcmU6ICguLi5hcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgT3ZlcnJpZGVSZWdpc3RyeS53cmFwKGNsYXp6LCBmdW5jdGlvbk5hbWUsIGRvQmVmb3JlLCBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgd3JhcChcclxuICAgICAgICBjbGF6eiA6IEZ1bmN0aW9uLCBmdW5jdGlvbk5hbWUgOiBzdHJpbmcsXHJcbiAgICAgICAgZG9CZWZvcmU/OiAoLi4uYXJncykgPT4gdm9pZCwgZG9BZnRlcj86ICguLi5hcmdzKSA9PiB2b2lkXHJcbiAgICApIHtcclxuICAgICAgICBmdW5jdGlvbiBvdmVycmlkZShiYXNlOiBGdW5jdGlvbikge1xyXG4gICAgICAgICAgICBsZXQgYXJncyA9IFsuLi5hcmd1bWVudHNdLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICBpZiAoZG9CZWZvcmUpIGRvQmVmb3JlLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgICAgICAgICBiYXNlLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgICAgICAgICBpZiAoZG9BZnRlcikgZG9BZnRlci5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgT3ZlcnJpZGVSZWdpc3RyeS5leHRlbmQoY2xhenosIGZ1bmN0aW9uTmFtZSwgb3ZlcnJpZGUsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZXh0ZW5kT2JqZWN0KG9iamVjdCA6IG9iamVjdCwgZnVuY3Rpb25OYW1lIDogc3RyaW5nLCBuZXdGdW5jdGlvbiwgY291bnRBcmdzID0gdHJ1ZSkge1xyXG4gICAgICAgIGlmICghb2JqZWN0W2Z1bmN0aW9uTmFtZV0pIHtcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcclxuICAgICAgICAgICAgY29uc29sZS50cmFjZSgpO1xyXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdDYW5ub3QgZXh0ZW5kIGZ1bmN0aW9uICcgKyBmdW5jdGlvbk5hbWUgK1xyXG4gICAgICAgICAgICAgICAgJyBiZWNhdXNlIGl0IGRvZXMgbm90IGV4aXN0LicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgb2xkRnVuY3Rpb24gPSBvYmplY3RbZnVuY3Rpb25OYW1lXTtcclxuXHJcbiAgICAgICAgaWYgKGNvdW50QXJncyAmJiAhb2xkRnVuY3Rpb24uZXh0ZW5kZWQgJiYgb2xkRnVuY3Rpb24ubGVuZ3RoICE9IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgb2xkRnVuY3Rpb24ubGVuZ3RoICsgMSAhPT0gbmV3RnVuY3Rpb24ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0gJ0V4dGVuZGluZyBmdW5jdGlvbiB3aXRoIHdyb25nIG51bWJlciBvZiBhcmd1bWVudHM6ICcgK1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lICsgJyAnICtcclxuICAgICAgICAgICAgICAgIG9sZEZ1bmN0aW9uLmxlbmd0aCArICcgdnMgJyArIG5ld0Z1bmN0aW9uLmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb2JqZWN0W2Z1bmN0aW9uTmFtZV0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIGFyZ3MudW5zaGlmdChvbGRGdW5jdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdGdW5jdGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIG9iamVjdFtmdW5jdGlvbk5hbWVdLmV4dGVuZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG9sZEZ1bmN0aW9uO1xyXG4gICAgfVxyXG59XHJcblxyXG4iLCJpbXBvcnQgeyBCbG9ja3MgfSBmcm9tIFwiLi4vYmxvY2tzL0Jsb2NrRmFjdG9yeVwiO1xyXG5pbXBvcnQgeyBFdmVudE1hbmFnZXIgfSBmcm9tIFwiLi4vZXZlbnRzL0V2ZW50TWFuYWdlclwiO1xyXG5pbXBvcnQgeyBFeHRlbnNpb25NYW5hZ2VyIH0gZnJvbSBcIi4vRXh0ZW5zaW9uTWFuYWdlclwiO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEV4dGVuc2lvbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGV2ZW50cygpIDogRXZlbnRNYW5hZ2VyIHtcclxuICAgICAgICByZXR1cm4gRXh0ZW5zaW9uTWFuYWdlci5ldmVudHM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGJsb2NrcygpIDogQmxvY2tzLkJsb2NrRmFjdG9yeSB7XHJcbiAgICAgICAgcmV0dXJuIEV4dGVuc2lvbk1hbmFnZXIuYmxvY2tzO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7fVxyXG5cclxuICAgIHJlZ2lzdGVyKCkge1xyXG4gICAgICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXIodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVwZW5kZW5jaWVzKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBCbG9ja3MgfSBmcm9tIFwiLi4vYmxvY2tzL0Jsb2NrRmFjdG9yeVwiO1xyXG5pbXBvcnQgeyBEZXZNb2RlIH0gZnJvbSBcIi4uL2Rldi9EZXZNb2RlXCI7XHJcbmltcG9ydCB7IEV2ZW50TWFuYWdlciB9IGZyb20gXCIuLi9ldmVudHMvRXZlbnRNYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEV4dGVuc2lvbiB9IGZyb20gXCIuL0V4dGVuc2lvblwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBFeHRlbnNpb25NYW5hZ2VyIHtcclxuXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZXh0ZW5zaW9ucyA9IFtdIGFzIEV4dGVuc2lvbltdO1xyXG5cclxuICAgIHN0YXRpYyByZWFkb25seSBibG9ja3MgPSBuZXcgQmxvY2tzLkJsb2NrRmFjdG9yeSgpO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGV2ZW50cyA9IG5ldyBFdmVudE1hbmFnZXIoKTtcclxuICAgIHN0YXRpYyByZWFkb25seSBkZXZNb2RlID0gbmV3IERldk1vZGUoKTtcclxuXHJcbiAgICBzdGF0aWMgcmVnaXN0ZXIoZXh0ZW5zaW9uIDogRXh0ZW5zaW9uKSB7XHJcbiAgICAgICAgdGhpcy5leHRlbnNpb25zLnB1c2goZXh0ZW5zaW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaW5pdCgpIHtcclxuXHJcbiAgICAgICAgY29uc3QgY29uZmlnRm4gPSAgICB3aW5kb3dbJ2dldFNFRkNvbmZpZyddO1xyXG4gICAgICAgIGlmICghY29uZmlnRm4pIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgICAgICAgICAgJ05vIFNFRiBjb25maWcgZmlsZTogTm8gZXh0ZW5zaW9ucyBsb2FkZWQuICcgK1xyXG4gICAgICAgICAgICAgICAgJ1BsZWFzZSBjcmVhdGUgbGlicmFyaWVzL3NlZi1jb25maWcuanMuJ1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjb25maWcgPSBjb25maWdGbigpO1xyXG4gICAgICAgIGlmICghY29uZmlnIHx8ICFBcnJheS5pc0FycmF5KGNvbmZpZy5leHRlbnNpb25zKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgICAgICAgICAnSW52YWxpZCBzZWYtY29uZmlnLmpzIGZpbGUgKG5vIGV4dGVuc2lvbnMgcHJvcGVydHkpLiAnICtcclxuICAgICAgICAgICAgICAgICdQbGVhc2Ugc2VlIGxpYnJhcmllcy9zZWYtY29uZmlnLmV4YW1wbGUuanMgZm9yIGFuIGV4YW1wbGUuJ1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxvYWRFeHRlbnNpb25zKGNvbmZpZy5leHRlbnNpb25zKTtcclxuXHJcbiAgICAgICAgdGhpcy5kZXZNb2RlLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbml0RXh0ZW5zaW9ucygpIHtcclxuICAgICAgICAvLyBUT0RPOiBPcmRlciBiYXNlZCBvbiBkZXBlbmRlbmNpZXNcclxuICAgICAgICAvLyBUT0RPOiBMb2FkIG9ubHkgd2hlbiBhc2tlZCBmb3IsIG5vdCBhbHdheXNcclxuICAgICAgICB0aGlzLmV4dGVuc2lvbnMuZm9yRWFjaChlID0+IHtcclxuICAgICAgICAgICAgZS5pbml0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbG9hZEV4dGVuc2lvbnMocGF0aHM6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgbGV0IHRvTG9hZCA9IDA7XHJcbiAgICAgICAgcGF0aHMuZm9yRWFjaChwYXRoID0+IHtcclxuICAgICAgICAgICAgdG9Mb2FkKys7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZEV4dGVuc2lvbihwYXRoLCBzdWNjZXNzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignRXh0ZW5zaW9uIG5vdCBmb3VuZDonLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRvTG9hZC0tO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRvTG9hZCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0RXh0ZW5zaW9ucygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBsb2FkRXh0ZW5zaW9uKFxyXG4gICAgICAgIHBhdGg6IHN0cmluZyxcclxuICAgICAgICBjYWxsYmFjazogKHN1Y2Nlc3M6IGJvb2xlYW4pID0+IHZvaWRcclxuICAgICkge1xyXG4gICAgICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICBzY3JpcHQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvamF2YXNjcmlwdCcpO1xyXG4gICAgICAgIHNjcmlwdC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHBhdGgpO1xyXG4gICAgICAgIC8vIFRPRE86IHJlbW92ZSBzaW11bGF0ZWQgbGFnXHJcbiAgICAgICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiBjYWxsYmFjayh0cnVlKSk7XHJcbiAgICAgICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4gY2FsbGJhY2soZmFsc2UpKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBTbmFwIH0gZnJvbSBcIi4uL3NuYXAvU25hcFV0aWxzXCI7XHJcblxyXG5leHBvcnQgbmFtZXNwYWNlIENsb3VkIHtcclxuXHJcbiAgICBleHBvcnQgdHlwZSBDbG91ZFByb2plY3QgPSB7XHJcbiAgICAgICAgY3JlYXRlZDogc3RyaW5nLFxyXG4gICAgICAgIGlkOiBudW1iZXIsXHJcbiAgICAgICAgaXNwdWJsaWM6IGJvb2xlYW4sXHJcbiAgICAgICAgaXNwdWJsaXNoZWQ6IGJvb2xlYW4sXHJcbiAgICAgICAgbGFzdHVwZGF0ZWQ6IHN0cmluZyxcclxuICAgICAgICBub3Rlczogc3RyaW5nLFxyXG4gICAgICAgIHByb2plY3RuYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgdXNlcm5hbWU6IHN0cmluZyxcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgdHlwZSBQcm9qZWN0U2F2ZUJvZHkgPSB7XHJcbiAgICAgICAgbm90ZXM6IHN0cmluZyxcclxuICAgICAgICB4bWw6IHN0cmluZyxcclxuICAgICAgICBtZWRpYTogc3RyaW5nLFxyXG4gICAgICAgIHRodW1ibmFpbDogc3RyaW5nLFxyXG4gICAgICAgIHJlbWl4SUQ6IHN0cmluZyxcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVXRpbHMge1xyXG5cclxuICAgICAgICBzdGF0aWMgYXN5bmMgZ2V0Q2xvdWRQcm9qZWN0cyh3aXRoVGh1bWJuYWlsOiBib29sZWFuKTogUHJvbWlzZTxDbG91ZFByb2plY3RbXT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgU25hcC5jbG91ZC5nZXRQcm9qZWN0TGlzdChkaWN0ID0+IHJlc29sdmUoZGljdC5wcm9qZWN0cyksIHJlamVjdCwgd2l0aFRodW1ibmFpbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGFzeW5jIHNhdmVQcm9qZWN0KHByb2plY3ROYW1lOiBzdHJpbmcsIGJvZHk6IFByb2plY3RTYXZlQm9keSkgOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIFNuYXAuY2xvdWQuc2F2ZVByb2plY3QocHJvamVjdE5hbWUsIGJvZHksIHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGFzeW5jIGdldFB1YmxpY1Byb2plY3QocHJvamVjdE5hbWU6IHN0cmluZywgdXNlck5hbWU6IHN0cmluZykgOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgU25hcC5jbG91ZC5nZXRQdWJsaWNQcm9qZWN0KHByb2plY3ROYW1lLCB1c2VyTmFtZSwgcmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZGVwcmVjYXRlZCBUaGUgY2xvdWQgYmFja2VuZCBubyBsb25nZXIgc3VwcG9ydHMgdGhpcyFcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgYXN5bmMgZ2V0UHJvamVjdE1ldGFkYXRhKHByb2plY3ROYW1lOiBzdHJpbmcsIHVzZXJOYW1lOiBzdHJpbmcpIDogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIFNuYXAuY2xvdWQuZ2V0UHJvamVjdE1ldGFkYXRhKHByb2plY3ROYW1lLCB1c2VyTmFtZSwgcmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgYXN5bmMgc2hhcmVQcm9qZWN0KHByb2plY3ROYW1lOiBzdHJpbmcpIDogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBTbmFwLmNsb3VkLnNoYXJlUHJvamVjdChwcm9qZWN0TmFtZSwgU25hcC5jbG91ZC51c2VyTmFtZSwgcmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUT0RPOiBQcm9qZWN0IHNob3VsZCBoYXZlIHNvbWUgc29ydCBvZiBwbHVnaW4gcGVybWlzc2lvbiBzeXN0ZW0uLi5cclxuICAgICAgICBzdGF0aWMgYXN5bmMgZGVsZXRlUHJvamVjdChwcm9qZWN0TmFtZTogc3RyaW5nKSA6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgU25hcC5jbG91ZC5kZWxldGVQcm9qZWN0KHByb2plY3ROYW1lLCBTbmFwLmNsb3VkLnVzZXJOYW1lLCByZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBnZXRDdXJyZW50UHJvamVjdERhdGEodmVyaWZ5OiBib29sZWFuKSA6IFByb2plY3RTYXZlQm9keSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0Qm9keSA9IFNuYXAuSURFLmJ1aWxkUHJvamVjdFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgaWYgKCFTbmFwLklERS52ZXJpZnlQcm9qZWN0KHByb2plY3RCb2R5KSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9qZWN0Qm9keTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBnZXRDdXJyZW50UHJvamVjdE5hbWUoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBTbmFwLklERS5nZXRQcm9qZWN0TmFtZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGlzTG9nZ2VkSW4oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBTbmFwLmNsb3VkLnVzZXJuYW1lICE9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgdXNlcm5hbWUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBTbmFwLmNsb3VkLnVzZXJuYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIHRlc3QoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2xvdWRQcm9qZWN0cyhmYWxzZSkudGhlbihwcm9qZWN0cyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwcm9qZWN0c1swXS5jcmVhdGVkKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIERlZkdlbmVyYXRvciB7XHJcblxyXG4gICAgY2xhc3NlcyA9IG5ldyBNYXA8c3RyaW5nLCBDbGFzc0RlZj47XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXMod2luZG93KSkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhrZXkpO1xyXG4gICAgICAgICAgICBpZiAoIXdpbmRvdy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gd2luZG93W2tleV07XHJcbiAgICAgICAgICAgIGlmICghKHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24pKSBjb250aW51ZTtcclxuICAgICAgICAgICAgaWYgKCF2YWx1ZS5wcm90b3R5cGUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUubmFtZS5sZW5ndGggPT0gMCkgY29udGludWU7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3Nlcy5zZXQoa2V5LCBuZXcgQ2xhc3NEZWYodmFsdWUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jbGFzc2VzLmZvckVhY2goYyA9PiBjLmFkZFBhcmVudERhdGEodGhpcy5jbGFzc2VzKSk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMub3V0cHV0RGVmaW5pdGlvbnMoKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb3V0cHV0RXhwb3J0cygpIHtcclxuICAgICAgICByZXR1cm4gWy4uLnRoaXMuY2xhc3Nlcy52YWx1ZXMoKV0ubWFwKGMgPT4gYy5leHBvcnRTdGF0ZW1lbnQoKSkuam9pbignXFxuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgb3V0cHV0RGVmaW5pdGlvbnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuZXhwb3J0IGNsYXNzIFNuYXBUeXBlIHtcclxuICAgIHByb3RvdHlwZTogYW55O1xyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG59XFxuXFxuYCArIFsuLi50aGlzLmNsYXNzZXMudmFsdWVzKCldLm1hcChjID0+IGMudG9UUygpKS5qb2luKCdcXG5cXG4nKTtcclxuICAgIH1cclxuXHJcbiAgICBkb3dubG9hZEFsbCgpIHtcclxuICAgICAgICB0aGlzLmRvd25sb2FkRmlsZSgnU25hcC5qcycsIHRoaXMub3V0cHV0RXhwb3J0cygpKTtcclxuICAgICAgICB0aGlzLmRvd25sb2FkRmlsZSgnU25hcC5kLnRzJywgdGhpcy5vdXRwdXREZWZpbml0aW9ucygpKTtcclxuICAgIH1cclxuXHJcbiAgICBkb3dubG9hZEZpbGUoZmlsZW5hbWU6IHN0cmluZywgdGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnZGF0YTp0ZXh0L3BsYWluO2NoYXJzZXQ9dXRmLTgsJyArIGVuY29kZVVSSUNvbXBvbmVudCh0ZXh0KSk7XHJcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZmlsZW5hbWUpO1xyXG5cclxuICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuXHJcbiAgICAgICAgZWxlbWVudC5jbGljaygpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuY2xhc3MgQ2xhc3NEZWYge1xyXG4gICAgYmFzZUZ1bmN0aW9uOiBGdW5jdGlvbjtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHViZXIgPSBudWxsIGFzIHN0cmluZztcclxuICAgIGZ1bmN0aW9uUHJveHkgOiBNZXRob2Q7XHJcbiAgICBmaWVsZHMgPSBuZXcgTWFwPHN0cmluZywgRmllbGQ+O1xyXG4gICAgbWV0aG9kcyA9IG5ldyBNYXA8c3RyaW5nLCBNZXRob2Q+O1xyXG4gICAgYWRkZWRQYXJlbnREYXRhID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZnVuYzogRnVuY3Rpb24pIHtcclxuICAgICAgICB0aGlzLmJhc2VGdW5jdGlvbiA9IGZ1bmM7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gZnVuYy5uYW1lO1xyXG4gICAgICAgIGNvbnN0IHByb3RvID0gZnVuYy5wcm90b3R5cGU7XHJcbiAgICAgICAgaWYgKCFwcm90bykgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAoWy4uLk9iamVjdC5rZXlzKHByb3RvKV0ubGVuZ3RoIDw9IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5mdW5jdGlvblByb3h5ID0gbmV3IE1ldGhvZCh0aGlzLm5hbWUsIGZ1bmMpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnViZXIgPSBmdW5jWyd1YmVyJ10/LmNvbnN0cnVjdG9yPy5uYW1lO1xyXG4gICAgICAgIHRoaXMuaW5mZXJGaWVsZHMoZnVuYyk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90bykpIHtcclxuICAgICAgICAgICAgLy8gSSB0aGluayB0aGlzIGlzIHJlZHVuZGFudC4uLlxyXG4gICAgICAgICAgICBpZiAoIXByb3RvLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBwcm90b1trZXldO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRob2RzLnNldChrZXksIG5ldyBNZXRob2Qoa2V5LCB2YWx1ZSkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogZGlzdGluZ3Vpc2ggYmV0d2VlbiBpbmhlcml0ZWQgZmllbGRzIGFuZCBzdGF0aWMgZmllbGRzXHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLmZpZWxkcy5wdXNoKG5ldyBGaWVsZChrZXksIHZhbHVlLCB0cnVlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbmZlckZpZWxkcyhwcm90b1snaW5pdCddKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQYXJlbnREYXRhKGNsYXNzZXM6IE1hcDxzdHJpbmcsIENsYXNzRGVmPik6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmFkZGVkUGFyZW50RGF0YSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuYWRkZWRQYXJlbnREYXRhID0gdHJ1ZTtcclxuICAgICAgICBpZiAodGhpcy5mdW5jdGlvblByb3h5KSByZXR1cm47XHJcbiAgICAgICAgaWYgKCF0aGlzLnViZXIgfHwgIWNsYXNzZXMuaGFzKHRoaXMudWJlcikpIHJldHVybjtcclxuICAgICAgICBjb25zdCBwYXJlbnQgPSBjbGFzc2VzLmdldCh0aGlzLnViZXIpO1xyXG4gICAgICAgIGlmICghcGFyZW50LmFkZGVkUGFyZW50RGF0YSkgcGFyZW50LmFkZFBhcmVudERhdGEoY2xhc3Nlcyk7XHJcbiAgICAgICAgZm9yIChsZXQgW21ldGhvZE5hbWUsIG1ldGhvZF0gb2YgcGFyZW50Lm1ldGhvZHMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWV0aG9kcy5oYXMobWV0aG9kTmFtZSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB0aGlzLm1ldGhvZHMuc2V0KG1ldGhvZE5hbWUsIG1ldGhvZCk7XHJcbiAgICAgICAgICAgIC8vIElmIGEgZmllbGQgb3ZlcnNoYWRvd3MgYSBwYXJlbnQgbWV0aG9kLCBpdCB3YXMgcHJvYmFibHlcclxuICAgICAgICAgICAgLy8gYSBtaXN0YWtlLCBzbyBkZWxldGUgaXQuXHJcbiAgICAgICAgICAgIC8vIFRPRE86IE5vdCBzdXJlIHRoaXMgaXMgdGhlIHJpZ2h0IGNhbGw7IGNvdWxkIGlnbm9yZSBpbmhlcml0YW5jZVxyXG4gICAgICAgICAgICB0aGlzLmZpZWxkcy5kZWxldGUobWV0aG9kTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IFtmaWVsZE5hbWUsIGZpZWxkXSBvZiBwYXJlbnQuZmllbGRzKSB7XHJcbiAgICAgICAgICAgIC8vIERvbid0IGNvcHkgZmllbGRzIHRoYXQgaGF2ZSBzaGFkb3dpbmcgbWV0aG9kc1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tZXRob2RzLmhhcyhmaWVsZE5hbWUpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZmllbGRzLmhhcyhmaWVsZE5hbWUpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdGhpcy5maWVsZHMuc2V0KGZpZWxkTmFtZSwgZmllbGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbmZlckZpZWxkcyhmdW5jOiBGdW5jdGlvbikge1xyXG4gICAgICAgIGlmICghZnVuYykgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IGpzID0gZnVuYy50b1N0cmluZygpO1xyXG4gICAgICAgIGNvbnN0IHZhckRlYyA9IC9eXFxzKnRoaXNcXHMqXFwuXFxzKihbYS16QS1aXyRdWzAtOWEtekEtWl8kXSopXFxzKj0vZ207XHJcbiAgICAgICAgZm9yIChsZXQgbWF0Y2ggb2YganMubWF0Y2hBbGwodmFyRGVjKSkge1xyXG4gICAgICAgICAgICBsZXQgbmFtZSA9IG1hdGNoWzFdO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5maWVsZHMuaGFzKG5hbWUpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgLy8gR2l2ZSBwcmVjZWRlbmNlIHRvIG1ldGhvZHNcclxuICAgICAgICAgICAgaWYgKHRoaXMubWV0aG9kcy5oYXMobmFtZSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB0aGlzLmZpZWxkcy5zZXQobmFtZSwgbmV3IEZpZWxkKG5hbWUsIG51bGwsIGZhbHNlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydFN0YXRlbWVudCgpIHtcclxuICAgICAgICByZXR1cm4gYGV4cG9ydCBjb25zdCAke3RoaXMubmFtZX0gPSB3aW5kb3dbJyR7dGhpcy5uYW1lfSddO2A7XHJcbiAgICB9XHJcblxyXG4gICAgdG9UUygpIDogc3RyaW5nICB7XHJcbiAgICAgICAgaWYgKHRoaXMuZnVuY3Rpb25Qcm94eSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYGV4cG9ydCBmdW5jdGlvbiAke3RoaXMuZnVuY3Rpb25Qcm94eS50b1RTKCl9YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGxldCBjb2RlID0gYGV4cG9ydCBjbGFzcyAke3RoaXMubmFtZX0gZXh0ZW5kcyAke3RoaXMudWJlciA/IHRoaXMudWJlciA6ICdTbmFwVHlwZSd9YDtcclxuICAgICAgICAvLyBUT0RPOiBCZWNhdXNlIFR5cGVzY3JpcHQgc2VlbXMgbm90IHRvIGFsbG93IGZ1bmN0aW9uIHNoYWRvd2luZyxcclxuICAgICAgICAvLyBuZWVkIHRvIG1hbnVhbGx5IGRlZmluZSBhbGwgcGFyZW50IHR5cGVzIGFuZCBtZXRob2RzICh0aGF0IGFyZW4ndCBzaGFkb3dlZCkgaGVyZVxyXG4gICAgICAgIGxldCBjb2RlID0gYGV4cG9ydCBjbGFzcyAke3RoaXMubmFtZX0gZXh0ZW5kcyBTbmFwVHlwZWA7XHJcbiAgICAgICAgY29kZSArPSBgIHtcXG5gO1xyXG4gICAgICAgIGxldCBmS2V5cyA9IFsuLi50aGlzLmZpZWxkcy5rZXlzKCldO1xyXG4gICAgICAgIGZLZXlzLnNvcnQoKTtcclxuICAgICAgICBmb3IgKGxldCBma2V5IG9mIGZLZXlzKSB7XHJcbiAgICAgICAgICAgIGNvZGUgKz0gJyAgICAnICsgdGhpcy5maWVsZHMuZ2V0KGZrZXkpLnRvVFMoKSArICdcXG4nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb2RlICs9ICdcXG4nO1xyXG4gICAgICAgIGxldCBtS2V5cyA9IFsuLi50aGlzLm1ldGhvZHMua2V5cygpXTtcclxuICAgICAgICBtS2V5cy5zb3J0KCk7XHJcbiAgICAgICAgZm9yIChsZXQgbUtleSBvZiBtS2V5cykge1xyXG4gICAgICAgICAgICBjb2RlICs9ICcgICAgJyArIHRoaXMubWV0aG9kcy5nZXQobUtleSkudG9UUygpICsgJ1xcbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvZGUgKz0gJ30nO1xyXG4gICAgICAgIHJldHVybiBjb2RlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBGaWVsZCB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICBpc1N0YXRpYzogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnksIGlzU3RhdGljOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmlzU3RhdGljID0gaXNTdGF0aWM7XHJcbiAgICAgICAgdGhpcy50eXBlID0gJ2FueSc7XHJcbiAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZW9mKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdG9UUygpIDogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYCR7dGhpcy5pc1N0YXRpYyA/ICdzdGF0aWMgJyA6ICcnfSR7dGhpcy5uYW1lfTogJHt0aGlzLnR5cGV9O2A7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIE1ldGhvZCB7XHJcblxyXG4gICAgc3RhdGljIHJlYWRvbmx5IFNUUklQX0NPTU1FTlRTID0gLyhcXC9cXC8uKiQpfChcXC9cXCpbXFxzXFxTXSo/XFwqXFwvKXwoXFxzKj1bXixcXCldKigoJyg/OlxcXFwnfFteJ1xcclxcbl0pKicpfChcIig/OlxcXFxcInxbXlwiXFxyXFxuXSkqXCIpKXwoXFxzKj1bXixcXCldKikpL21nO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IEFSR1VNRU5UX05BTUVTID0gLyhbXlxccyxdKykvZztcclxuXHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBwYXJhbU5hbWVzOiBzdHJpbmdbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGZ1bmM6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnBhcmFtTmFtZXMgPSB0aGlzLmdldFBhcmFtTmFtZXMoZnVuYyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGFyYW1OYW1lcyhmdW5jOiBGdW5jdGlvbikge1xyXG4gICAgICAgIHZhciBmblN0ciA9IGZ1bmMudG9TdHJpbmcoKS5yZXBsYWNlKE1ldGhvZC5TVFJJUF9DT01NRU5UUywgJycpO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBmblN0ci5zbGljZShmblN0ci5pbmRleE9mKCcoJykrMSwgZm5TdHIuaW5kZXhPZignKScpKS5tYXRjaChNZXRob2QuQVJHVU1FTlRfTkFNRVMpO1xyXG4gICAgICAgIGlmKHJlc3VsdCA9PT0gbnVsbClcclxuICAgICAgICAgICAgcmVzdWx0ID0gW107XHJcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmZpbHRlcihwYXJhbSA9PiBwYXJhbS5tYXRjaCgvXlthLXpBLVpfJF1bMC05YS16QS1aXyRdKiQvKSlcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHRvVFMoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3Qgb3ZlcnJpZGUgPSB0aGlzLmNoZWNrT3ZlcnJpZGUoKTtcclxuICAgICAgICBpZiAob3ZlcnJpZGUpIHJldHVybiBvdmVycmlkZTtcclxuICAgICAgICBsZXQgY29kZSA9IGAke3RoaXMubmFtZX0oYDtcclxuICAgICAgICBsZXQgZmlyc3QgPSB0cnVlO1xyXG4gICAgICAgIGZvciAobGV0IG5hbWUgb2YgdGhpcy5wYXJhbU5hbWVzKSB7XHJcbiAgICAgICAgICAgIGlmICghZmlyc3QpIGNvZGUgKz0gJywgJztcclxuICAgICAgICAgICAgZmlyc3QgPSBmYWxzZTtcclxuICAgICAgICAgICAgY29kZSArPSBgJHtuYW1lfT86IGFueWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvZGUgKz0gJyk7JztcclxuICAgICAgICByZXR1cm4gY29kZTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja092ZXJyaWRlKCkge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5uYW1lKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2NoaWxkVGhhdElzQSc6IHJldHVybiBgJHt0aGlzLm5hbWV9KC4uLmFyZ3M6IGFueVtdKTtgXHJcbiAgICAgICAgICAgIGNhc2UgJ3BhcmVudFRoYXRJc0EnOiByZXR1cm4gYCR7dGhpcy5uYW1lfSguLi5hcmdzOiBhbnlbXSk7YFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufSIsIi8vIGltcG9ydCB7IEV2ZW50cywgRXh0ZW5zaW9uTWFuYWdlciB9IGZyb20gXCJzZWZcIjtcclxuaW1wb3J0IHsgQmxvY2tNb3JwaCwgQ2xvdWQsIElERV9Nb3JwaCwgU3ByaXRlTW9ycGgsIFN0YWdlTW9ycGgsIFdvcmxkTW9ycGggfSBmcm9tIFwiLi9TbmFwXCI7XHJcbmltcG9ydCB7IEJsb2NrSURBcmdzIH0gZnJvbSBcIi4uL2V2ZW50cy9TbmFwRXZlbnRMaXN0ZW5lclwiO1xyXG5cclxuXHJcbi8vIFRPRE86IE1ha2UgYW4gaW50ZXJmYWNlIHdpdGggYW4gaW1wbGVtZW50YXRpb24gdGhhdCBmZXRjaGVzIGZyb20gd2luZG93XHJcbmV4cG9ydCBjbGFzcyBTbmFwIHtcclxuXHJcbiAgICBzdGF0aWMgbGFzdFJ1bkJsb2NrOiBCbG9ja01vcnBoO1xyXG5cclxuICAgIHN0YXRpYyBnZXQgd29ybGQoKSA6IFdvcmxkTW9ycGgge1xyXG4gICAgICAgIHJldHVybiB3aW5kb3dbXCJ3b3JsZFwiXTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IElERSgpIDogSURFX01vcnBoIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53b3JsZD8uY2hpbGRUaGF0SXNBKHdpbmRvd1snSURFX01vcnBoJ10pIGFzIElERV9Nb3JwaDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IHN0YWdlKCkgOiBTdGFnZU1vcnBoIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5JREU/LnN0YWdlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgY3VycmVudFNwcml0ZSgpIDogU3ByaXRlTW9ycGggfCBTdGFnZU1vcnBoe1xyXG4gICAgICAgIHJldHVybiB0aGlzLklERT8uY3VycmVudFNwcml0ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IHNwcml0ZXMoKSA6IFNwcml0ZU1vcnBoW10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLklERT8uc3ByaXRlcz8uY29udGVudHMgfHwgW107XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBjbG91ZCgpIDogQ2xvdWQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLklERT8uY2xvdWQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldFNwcml0ZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zcHJpdGVzLmZpbHRlcihzcHJpdGUgPT4gc3ByaXRlLm5hbWUgPT0gbmFtZSlbMF07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldEJsb2NrKGlkOiBCbG9ja0lEQXJncykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLndvcmxkLmFsbENoaWxkcmVuKClcclxuICAgICAgICAgICAgLmZpbHRlcihiID0+IGIgaW5zdGFuY2VvZiBCbG9ja01vcnBoICYmIGIuaWQgPT0gaWQuaWQpWzBdO1xyXG4gICAgfVxyXG5cclxufSIsImV4cG9ydCBjb25zdCBub3AgPSB3aW5kb3dbJ25vcCddO1xyXG5leHBvcnQgY29uc3QgbmV3R3VpZCA9IHdpbmRvd1snbmV3R3VpZCddO1xyXG5leHBvcnQgY29uc3QgbG9jYWxpemUgPSB3aW5kb3dbJ2xvY2FsaXplJ107XHJcbmV4cG9ydCBjb25zdCBpc05pbCA9IHdpbmRvd1snaXNOaWwnXTtcclxuZXhwb3J0IGNvbnN0IGNvbnRhaW5zID0gd2luZG93Wydjb250YWlucyddO1xyXG5leHBvcnQgY29uc3QgZGV0ZWN0ID0gd2luZG93WydkZXRlY3QnXTtcclxuZXhwb3J0IGNvbnN0IHNpemVPZiA9IHdpbmRvd1snc2l6ZU9mJ107XHJcbmV4cG9ydCBjb25zdCBpc1N0cmluZyA9IHdpbmRvd1snaXNTdHJpbmcnXTtcclxuZXhwb3J0IGNvbnN0IGlzT2JqZWN0ID0gd2luZG93Wydpc09iamVjdCddO1xyXG5leHBvcnQgY29uc3QgcmFkaWFucyA9IHdpbmRvd1sncmFkaWFucyddO1xyXG5leHBvcnQgY29uc3QgZGVncmVlcyA9IHdpbmRvd1snZGVncmVlcyddO1xyXG5leHBvcnQgY29uc3QgZm9udEhlaWdodCA9IHdpbmRvd1snZm9udEhlaWdodCddO1xyXG5leHBvcnQgY29uc3QgaXNXb3JkQ2hhciA9IHdpbmRvd1snaXNXb3JkQ2hhciddO1xyXG5leHBvcnQgY29uc3QgaXNVUkxDaGFyID0gd2luZG93Wydpc1VSTENoYXInXTtcclxuZXhwb3J0IGNvbnN0IGlzVVJMID0gd2luZG93Wydpc1VSTCddO1xyXG5leHBvcnQgY29uc3QgbmV3Q2FudmFzID0gd2luZG93WyduZXdDYW52YXMnXTtcclxuZXhwb3J0IGNvbnN0IGNvcHlDYW52YXMgPSB3aW5kb3dbJ2NvcHlDYW52YXMnXTtcclxuZXhwb3J0IGNvbnN0IGdldE1pbmltdW1Gb250SGVpZ2h0ID0gd2luZG93WydnZXRNaW5pbXVtRm9udEhlaWdodCddO1xyXG5leHBvcnQgY29uc3QgZ2V0RG9jdW1lbnRQb3NpdGlvbk9mID0gd2luZG93WydnZXREb2N1bWVudFBvc2l0aW9uT2YnXTtcclxuZXhwb3J0IGNvbnN0IGNvcHkgPSB3aW5kb3dbJ2NvcHknXTtcclxuZXhwb3J0IGNvbnN0IGVtYmVkTWV0YWRhdGFQTkcgPSB3aW5kb3dbJ2VtYmVkTWV0YWRhdGFQTkcnXTtcclxuZXhwb3J0IGNvbnN0IGVuYWJsZVJldGluYVN1cHBvcnQgPSB3aW5kb3dbJ2VuYWJsZVJldGluYVN1cHBvcnQnXTtcclxuZXhwb3J0IGNvbnN0IGlzUmV0aW5hU3VwcG9ydGVkID0gd2luZG93Wydpc1JldGluYVN1cHBvcnRlZCddO1xyXG5leHBvcnQgY29uc3QgaXNSZXRpbmFFbmFibGVkID0gd2luZG93Wydpc1JldGluYUVuYWJsZWQnXTtcclxuZXhwb3J0IGNvbnN0IGRpc2FibGVSZXRpbmFTdXBwb3J0ID0gd2luZG93WydkaXNhYmxlUmV0aW5hU3VwcG9ydCddO1xyXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplQ2FudmFzID0gd2luZG93Wydub3JtYWxpemVDYW52YXMnXTtcclxuZXhwb3J0IGNvbnN0IEFuaW1hdGlvbiA9IHdpbmRvd1snQW5pbWF0aW9uJ107XHJcbmV4cG9ydCBjb25zdCBDb2xvciA9IHdpbmRvd1snQ29sb3InXTtcclxuZXhwb3J0IGNvbnN0IFBvaW50ID0gd2luZG93WydQb2ludCddO1xyXG5leHBvcnQgY29uc3QgUmVjdGFuZ2xlID0gd2luZG93WydSZWN0YW5nbGUnXTtcclxuZXhwb3J0IGNvbnN0IE5vZGUgPSB3aW5kb3dbJ05vZGUnXTtcclxuZXhwb3J0IGNvbnN0IE1vcnBoID0gd2luZG93WydNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgV29ybGRNb3JwaCA9IHdpbmRvd1snV29ybGRNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgSGFuZE1vcnBoID0gd2luZG93WydIYW5kTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNoYWRvd01vcnBoID0gd2luZG93WydTaGFkb3dNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgRnJhbWVNb3JwaCA9IHdpbmRvd1snRnJhbWVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgTWVudU1vcnBoID0gd2luZG93WydNZW51TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEhhbmRsZU1vcnBoID0gd2luZG93WydIYW5kbGVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU3RyaW5nRmllbGRNb3JwaCA9IHdpbmRvd1snU3RyaW5nRmllbGRNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQ29sb3JQaWNrZXJNb3JwaCA9IHdpbmRvd1snQ29sb3JQaWNrZXJNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU2xpZGVyTW9ycGggPSB3aW5kb3dbJ1NsaWRlck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTY3JvbGxGcmFtZU1vcnBoID0gd2luZG93WydTY3JvbGxGcmFtZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBJbnNwZWN0b3JNb3JwaCA9IHdpbmRvd1snSW5zcGVjdG9yTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFN0cmluZ01vcnBoID0gd2luZG93WydTdHJpbmdNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVGV4dE1vcnBoID0gd2luZG93WydUZXh0TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFBlbk1vcnBoID0gd2luZG93WydQZW5Nb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQ29sb3JQYWxldHRlTW9ycGggPSB3aW5kb3dbJ0NvbG9yUGFsZXR0ZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBHcmF5UGFsZXR0ZU1vcnBoID0gd2luZG93WydHcmF5UGFsZXR0ZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbGlua2VyTW9ycGggPSB3aW5kb3dbJ0JsaW5rZXJNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQ3Vyc29yTW9ycGggPSB3aW5kb3dbJ0N1cnNvck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCb3hNb3JwaCA9IHdpbmRvd1snQm94TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNwZWVjaEJ1YmJsZU1vcnBoID0gd2luZG93WydTcGVlY2hCdWJibGVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgRGlhbE1vcnBoID0gd2luZG93WydEaWFsTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IENpcmNsZUJveE1vcnBoID0gd2luZG93WydDaXJjbGVCb3hNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU2xpZGVyQnV0dG9uTW9ycGggPSB3aW5kb3dbJ1NsaWRlckJ1dHRvbk1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBNb3VzZVNlbnNvck1vcnBoID0gd2luZG93WydNb3VzZVNlbnNvck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBMaXN0TW9ycGggPSB3aW5kb3dbJ0xpc3RNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVHJpZ2dlck1vcnBoID0gd2luZG93WydUcmlnZ2VyTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IE1lbnVJdGVtTW9ycGggPSB3aW5kb3dbJ01lbnVJdGVtTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJvdW5jZXJNb3JwaCA9IHdpbmRvd1snQm91bmNlck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTeW1ib2xNb3JwaCA9IHdpbmRvd1snU3ltYm9sTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFB1c2hCdXR0b25Nb3JwaCA9IHdpbmRvd1snUHVzaEJ1dHRvbk1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBUb2dnbGVCdXR0b25Nb3JwaCA9IHdpbmRvd1snVG9nZ2xlQnV0dG9uTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFRhYk1vcnBoID0gd2luZG93WydUYWJNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVG9nZ2xlTW9ycGggPSB3aW5kb3dbJ1RvZ2dsZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBUb2dnbGVFbGVtZW50TW9ycGggPSB3aW5kb3dbJ1RvZ2dsZUVsZW1lbnRNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgRGlhbG9nQm94TW9ycGggPSB3aW5kb3dbJ0RpYWxvZ0JveE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBBbGlnbm1lbnRNb3JwaCA9IHdpbmRvd1snQWxpZ25tZW50TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IElucHV0RmllbGRNb3JwaCA9IHdpbmRvd1snSW5wdXRGaWVsZE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBQaWFub01lbnVNb3JwaCA9IHdpbmRvd1snUGlhbm9NZW51TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFBpYW5vS2V5TW9ycGggPSB3aW5kb3dbJ1BpYW5vS2V5TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFN5bnRheEVsZW1lbnRNb3JwaCA9IHdpbmRvd1snU3ludGF4RWxlbWVudE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja01vcnBoID0gd2luZG93WydCbG9ja01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja0xhYmVsTW9ycGggPSB3aW5kb3dbJ0Jsb2NrTGFiZWxNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQmxvY2tTeW1ib2xNb3JwaCA9IHdpbmRvd1snQmxvY2tTeW1ib2xNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQ29tbWFuZEJsb2NrTW9ycGggPSB3aW5kb3dbJ0NvbW1hbmRCbG9ja01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBSZXBvcnRlckJsb2NrTW9ycGggPSB3aW5kb3dbJ1JlcG9ydGVyQmxvY2tNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU2NyaXB0c01vcnBoID0gd2luZG93WydTY3JpcHRzTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEFyZ01vcnBoID0gd2luZG93WydBcmdNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQ29tbWFuZFNsb3RNb3JwaCA9IHdpbmRvd1snQ29tbWFuZFNsb3RNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQ1Nsb3RNb3JwaCA9IHdpbmRvd1snQ1Nsb3RNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgSW5wdXRTbG90TW9ycGggPSB3aW5kb3dbJ0lucHV0U2xvdE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBJbnB1dFNsb3RTdHJpbmdNb3JwaCA9IHdpbmRvd1snSW5wdXRTbG90U3RyaW5nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IElucHV0U2xvdFRleHRNb3JwaCA9IHdpbmRvd1snSW5wdXRTbG90VGV4dE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCb29sZWFuU2xvdE1vcnBoID0gd2luZG93WydCb29sZWFuU2xvdE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBBcnJvd01vcnBoID0gd2luZG93WydBcnJvd01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDb2xvclNsb3RNb3JwaCA9IHdpbmRvd1snQ29sb3JTbG90TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEhhdEJsb2NrTW9ycGggPSB3aW5kb3dbJ0hhdEJsb2NrTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJsb2NrSGlnaGxpZ2h0TW9ycGggPSB3aW5kb3dbJ0Jsb2NrSGlnaGxpZ2h0TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IE11bHRpQXJnTW9ycGggPSB3aW5kb3dbJ011bHRpQXJnTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFRlbXBsYXRlU2xvdE1vcnBoID0gd2luZG93WydUZW1wbGF0ZVNsb3RNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgRnVuY3Rpb25TbG90TW9ycGggPSB3aW5kb3dbJ0Z1bmN0aW9uU2xvdE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBSZXBvcnRlclNsb3RNb3JwaCA9IHdpbmRvd1snUmVwb3J0ZXJTbG90TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFJpbmdNb3JwaCA9IHdpbmRvd1snUmluZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBSaW5nQ29tbWFuZFNsb3RNb3JwaCA9IHdpbmRvd1snUmluZ0NvbW1hbmRTbG90TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFJpbmdSZXBvcnRlclNsb3RNb3JwaCA9IHdpbmRvd1snUmluZ1JlcG9ydGVyU2xvdE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDb21tZW50TW9ycGggPSB3aW5kb3dbJ0NvbW1lbnRNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQXJnTGFiZWxNb3JwaCA9IHdpbmRvd1snQXJnTGFiZWxNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVGV4dFNsb3RNb3JwaCA9IHdpbmRvd1snVGV4dFNsb3RNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU2NyaXB0Rm9jdXNNb3JwaCA9IHdpbmRvd1snU2NyaXB0Rm9jdXNNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVGhyZWFkTWFuYWdlciA9IHdpbmRvd1snVGhyZWFkTWFuYWdlciddO1xyXG5leHBvcnQgY29uc3QgUHJvY2VzcyA9IHdpbmRvd1snUHJvY2VzcyddO1xyXG5leHBvcnQgY29uc3QgQ29udGV4dCA9IHdpbmRvd1snQ29udGV4dCddO1xyXG5leHBvcnQgY29uc3QgVmFyaWFibGUgPSB3aW5kb3dbJ1ZhcmlhYmxlJ107XHJcbmV4cG9ydCBjb25zdCBWYXJpYWJsZUZyYW1lID0gd2luZG93WydWYXJpYWJsZUZyYW1lJ107XHJcbmV4cG9ydCBjb25zdCBKU0NvbXBpbGVyID0gd2luZG93WydKU0NvbXBpbGVyJ107XHJcbmV4cG9ydCBjb25zdCBzbmFwRXF1YWxzID0gd2luZG93WydzbmFwRXF1YWxzJ107XHJcbmV4cG9ydCBjb25zdCBpbnZva2UgPSB3aW5kb3dbJ2ludm9rZSddO1xyXG5leHBvcnQgY29uc3QgU3ByaXRlTW9ycGggPSB3aW5kb3dbJ1Nwcml0ZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTdGFnZU1vcnBoID0gd2luZG93WydTdGFnZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTcHJpdGVCdWJibGVNb3JwaCA9IHdpbmRvd1snU3ByaXRlQnViYmxlTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IENvc3R1bWUgPSB3aW5kb3dbJ0Nvc3R1bWUnXTtcclxuZXhwb3J0IGNvbnN0IFNWR19Db3N0dW1lID0gd2luZG93WydTVkdfQ29zdHVtZSddO1xyXG5leHBvcnQgY29uc3QgQ29zdHVtZUVkaXRvck1vcnBoID0gd2luZG93WydDb3N0dW1lRWRpdG9yTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNvdW5kID0gd2luZG93WydTb3VuZCddO1xyXG5leHBvcnQgY29uc3QgTm90ZSA9IHdpbmRvd1snTm90ZSddO1xyXG5leHBvcnQgY29uc3QgTWljcm9waG9uZSA9IHdpbmRvd1snTWljcm9waG9uZSddO1xyXG5leHBvcnQgY29uc3QgQ2VsbE1vcnBoID0gd2luZG93WydDZWxsTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFdhdGNoZXJNb3JwaCA9IHdpbmRvd1snV2F0Y2hlck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTdGFnZVByb21wdGVyTW9ycGggPSB3aW5kb3dbJ1N0YWdlUHJvbXB0ZXJNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU3ByaXRlSGlnaGxpZ2h0TW9ycGggPSB3aW5kb3dbJ1Nwcml0ZUhpZ2hsaWdodE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTdGFnZVBpY2tlck1vcnBoID0gd2luZG93WydTdGFnZVBpY2tlck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTdGFnZVBpY2tlckl0ZW1Nb3JwaCA9IHdpbmRvd1snU3RhZ2VQaWNrZXJJdGVtTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IGlzU25hcE9iamVjdCA9IHdpbmRvd1snaXNTbmFwT2JqZWN0J107XHJcbmV4cG9ydCBjb25zdCBQcm9qZWN0ID0gd2luZG93WydQcm9qZWN0J107XHJcbmV4cG9ydCBjb25zdCBTY2VuZSA9IHdpbmRvd1snU2NlbmUnXTtcclxuZXhwb3J0IGNvbnN0IElERV9Nb3JwaCA9IHdpbmRvd1snSURFX01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBQcm9qZWN0RGlhbG9nTW9ycGggPSB3aW5kb3dbJ1Byb2plY3REaWFsb2dNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgTGlicmFyeUltcG9ydERpYWxvZ01vcnBoID0gd2luZG93WydMaWJyYXJ5SW1wb3J0RGlhbG9nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNwcml0ZUljb25Nb3JwaCA9IHdpbmRvd1snU3ByaXRlSWNvbk1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDb3N0dW1lSWNvbk1vcnBoID0gd2luZG93WydDb3N0dW1lSWNvbk1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBUdXJ0bGVJY29uTW9ycGggPSB3aW5kb3dbJ1R1cnRsZUljb25Nb3JwaCddO1xyXG5leHBvcnQgY29uc3QgV2FyZHJvYmVNb3JwaCA9IHdpbmRvd1snV2FyZHJvYmVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU291bmRJY29uTW9ycGggPSB3aW5kb3dbJ1NvdW5kSWNvbk1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBKdWtlYm94TW9ycGggPSB3aW5kb3dbJ0p1a2Vib3hNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU2NlbmVJY29uTW9ycGggPSB3aW5kb3dbJ1NjZW5lSWNvbk1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTY2VuZUFsYnVtTW9ycGggPSB3aW5kb3dbJ1NjZW5lQWxidW1Nb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU3RhZ2VIYW5kbGVNb3JwaCA9IHdpbmRvd1snU3RhZ2VIYW5kbGVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUGFsZXR0ZUhhbmRsZU1vcnBoID0gd2luZG93WydQYWxldHRlSGFuZGxlTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IENhbVNuYXBzaG90RGlhbG9nTW9ycGggPSB3aW5kb3dbJ0NhbVNuYXBzaG90RGlhbG9nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNvdW5kUmVjb3JkZXJEaWFsb2dNb3JwaCA9IHdpbmRvd1snU291bmRSZWNvcmRlckRpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBQcm9qZWN0UmVjb3ZlcnlEaWFsb2dNb3JwaCA9IHdpbmRvd1snUHJvamVjdFJlY292ZXJ5RGlhbG9nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFBhaW50RWRpdG9yTW9ycGggPSB3aW5kb3dbJ1BhaW50RWRpdG9yTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFBhaW50Q2FudmFzTW9ycGggPSB3aW5kb3dbJ1BhaW50Q2FudmFzTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFBhaW50Q29sb3JQaWNrZXJNb3JwaCA9IHdpbmRvd1snUGFpbnRDb2xvclBpY2tlck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBMaXN0ID0gd2luZG93WydMaXN0J107XHJcbmV4cG9ydCBjb25zdCBMaXN0V2F0Y2hlck1vcnBoID0gd2luZG93WydMaXN0V2F0Y2hlck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDdXN0b21CbG9ja0RlZmluaXRpb24gPSB3aW5kb3dbJ0N1c3RvbUJsb2NrRGVmaW5pdGlvbiddO1xyXG5leHBvcnQgY29uc3QgQ3VzdG9tQ29tbWFuZEJsb2NrTW9ycGggPSB3aW5kb3dbJ0N1c3RvbUNvbW1hbmRCbG9ja01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDdXN0b21SZXBvcnRlckJsb2NrTW9ycGggPSB3aW5kb3dbJ0N1c3RvbVJlcG9ydGVyQmxvY2tNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQmxvY2tEaWFsb2dNb3JwaCA9IHdpbmRvd1snQmxvY2tEaWFsb2dNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQmxvY2tFZGl0b3JNb3JwaCA9IHdpbmRvd1snQmxvY2tFZGl0b3JNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUHJvdG90eXBlSGF0QmxvY2tNb3JwaCA9IHdpbmRvd1snUHJvdG90eXBlSGF0QmxvY2tNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQmxvY2tMYWJlbEZyYWdtZW50ID0gd2luZG93WydCbG9ja0xhYmVsRnJhZ21lbnQnXTtcclxuZXhwb3J0IGNvbnN0IEJsb2NrTGFiZWxGcmFnbWVudE1vcnBoID0gd2luZG93WydCbG9ja0xhYmVsRnJhZ21lbnRNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQmxvY2tJbnB1dEZyYWdtZW50TW9ycGggPSB3aW5kb3dbJ0Jsb2NrSW5wdXRGcmFnbWVudE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja0xhYmVsUGxhY2VIb2xkZXJNb3JwaCA9IHdpbmRvd1snQmxvY2tMYWJlbFBsYWNlSG9sZGVyTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IElucHV0U2xvdERpYWxvZ01vcnBoID0gd2luZG93WydJbnB1dFNsb3REaWFsb2dNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVmFyaWFibGVEaWFsb2dNb3JwaCA9IHdpbmRvd1snVmFyaWFibGVEaWFsb2dNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgSmFnZ2VkQmxvY2tNb3JwaCA9IHdpbmRvd1snSmFnZ2VkQmxvY2tNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQmxvY2tFeHBvcnREaWFsb2dNb3JwaCA9IHdpbmRvd1snQmxvY2tFeHBvcnREaWFsb2dNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQmxvY2tJbXBvcnREaWFsb2dNb3JwaCA9IHdpbmRvd1snQmxvY2tJbXBvcnREaWFsb2dNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQmxvY2tSZW1vdmFsRGlhbG9nTW9ycGggPSB3aW5kb3dbJ0Jsb2NrUmVtb3ZhbERpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja1Zpc2liaWxpdHlEaWFsb2dNb3JwaCA9IHdpbmRvd1snQmxvY2tWaXNpYmlsaXR5RGlhbG9nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFRhYmxlID0gd2luZG93WydUYWJsZSddO1xyXG5leHBvcnQgY29uc3QgVGFibGVDZWxsTW9ycGggPSB3aW5kb3dbJ1RhYmxlQ2VsbE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBUYWJsZU1vcnBoID0gd2luZG93WydUYWJsZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBUYWJsZUZyYW1lTW9ycGggPSB3aW5kb3dbJ1RhYmxlRnJhbWVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVGFibGVEaWFsb2dNb3JwaCA9IHdpbmRvd1snVGFibGVEaWFsb2dNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVmVjdG9yU2hhcGUgPSB3aW5kb3dbJ1ZlY3RvclNoYXBlJ107XHJcbmV4cG9ydCBjb25zdCBWZWN0b3JSZWN0YW5nbGUgPSB3aW5kb3dbJ1ZlY3RvclJlY3RhbmdsZSddO1xyXG5leHBvcnQgY29uc3QgVmVjdG9yTGluZSA9IHdpbmRvd1snVmVjdG9yTGluZSddO1xyXG5leHBvcnQgY29uc3QgVmVjdG9yRWxsaXBzZSA9IHdpbmRvd1snVmVjdG9yRWxsaXBzZSddO1xyXG5leHBvcnQgY29uc3QgVmVjdG9yUG9seWdvbiA9IHdpbmRvd1snVmVjdG9yUG9seWdvbiddO1xyXG5leHBvcnQgY29uc3QgVmVjdG9yU2VsZWN0aW9uID0gd2luZG93WydWZWN0b3JTZWxlY3Rpb24nXTtcclxuZXhwb3J0IGNvbnN0IFZlY3RvclBhaW50RWRpdG9yTW9ycGggPSB3aW5kb3dbJ1ZlY3RvclBhaW50RWRpdG9yTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFZlY3RvclBhaW50Q2FudmFzTW9ycGggPSB3aW5kb3dbJ1ZlY3RvclBhaW50Q2FudmFzTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IENyb3NzaGFpciA9IHdpbmRvd1snQ3Jvc3NoYWlyJ107XHJcbmV4cG9ydCBjb25zdCBWaWRlb01vdGlvbiA9IHdpbmRvd1snVmlkZW9Nb3Rpb24nXTtcclxuZXhwb3J0IGNvbnN0IFdvcmxkTWFwID0gd2luZG93WydXb3JsZE1hcCddO1xyXG5leHBvcnQgY29uc3QgUmVhZFN0cmVhbSA9IHdpbmRvd1snUmVhZFN0cmVhbSddO1xyXG5leHBvcnQgY29uc3QgWE1MX0VsZW1lbnQgPSB3aW5kb3dbJ1hNTF9FbGVtZW50J107XHJcbmV4cG9ydCBjb25zdCBYTUxfU2VyaWFsaXplciA9IHdpbmRvd1snWE1MX1NlcmlhbGl6ZXInXTtcclxuZXhwb3J0IGNvbnN0IFNuYXBTZXJpYWxpemVyID0gd2luZG93WydTbmFwU2VyaWFsaXplciddO1xyXG5leHBvcnQgY29uc3QgTG9jYWxpemVyID0gd2luZG93WydMb2NhbGl6ZXInXTtcclxuZXhwb3J0IGNvbnN0IENsb3VkID0gd2luZG93WydDbG91ZCddO1xyXG5leHBvcnQgY29uc3QgU25hcEV2ZW50TWFuYWdlciA9IHdpbmRvd1snU25hcEV2ZW50TWFuYWdlciddO1xyXG5leHBvcnQgY29uc3QgaGV4X3NoYTUxMiA9IHdpbmRvd1snaGV4X3NoYTUxMiddO1xyXG5leHBvcnQgY29uc3QgbSA9IHdpbmRvd1snbSddO1xyXG5leHBvcnQgY29uc3QgbG9vcCA9IHdpbmRvd1snbG9vcCddOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgQmxvY2tzIH0gZnJvbSBcIi4vYmxvY2tzL0Jsb2NrRmFjdG9yeVwiO1xyXG5pbXBvcnQgeyBFdmVudE1hbmFnZXIgfSBmcm9tIFwiLi9ldmVudHMvRXZlbnRNYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEV4dGVuc2lvbiB9IGZyb20gXCIuL2V4dGVuc2lvbi9FeHRlbnNpb25cIjtcclxuaW1wb3J0IHsgRXh0ZW5zaW9uTWFuYWdlciB9IGZyb20gXCIuL2V4dGVuc2lvbi9FeHRlbnNpb25NYW5hZ2VyXCI7XHJcbmltcG9ydCB7IERlZkdlbmVyYXRvciB9IGZyb20gXCIuL21ldGEvRGVmR2VuZXJhdG9yXCI7XHJcbmltcG9ydCB7IFNuYXAgfSBmcm9tIFwiLi9zbmFwL1NuYXBVdGlsc1wiO1xyXG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tIFwiLi9ldmVudHMvU25hcEV2ZW50c1wiO1xyXG5pbXBvcnQgeyBPdmVycmlkZVJlZ2lzdHJ5IH0gZnJvbSBcIi4vZXh0ZW5kL092ZXJyaWRlUmVnaXN0cnlcIjtcclxuaW1wb3J0IHsgQ2xvdWQgfSBmcm9tIFwiLi9pby9DbG91ZFV0aWxzXCI7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIC8vIFNuYXAgaXMgbG9hZGVkIGFmdGVyIHRoZSB3aW5kb3dcclxuICAgICAgICBFeHRlbnNpb25NYW5hZ2VyLmluaXQoKTtcclxuICAgIH0sIDApO1xyXG59KVxyXG5cclxuLy8gRm9yIGNvbnZlbmllbmNlLCBtYWtlIHNuYXAgYW5kIHRoZSBFTSBnbG9iYWxcclxud2luZG93WydTbmFwJ10gPSBTbmFwO1xyXG53aW5kb3dbJ0V4dGVuc2lvbk1hbmFnZXInXSA9IEV4dGVuc2lvbk1hbmFnZXI7XHJcblxyXG5leHBvcnQge1xyXG4gICAgQmxvY2tzLFxyXG4gICAgQ2xvdWQsXHJcbiAgICBEZWZHZW5lcmF0b3IsXHJcbiAgICBFdmVudE1hbmFnZXIsXHJcbiAgICBFdmVudHMsXHJcbiAgICBFeHRlbnNpb24sXHJcbiAgICBFeHRlbnNpb25NYW5hZ2VyLFxyXG4gICAgT3ZlcnJpZGVSZWdpc3RyeSxcclxuICAgIFNuYXAsXHJcbn07XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==