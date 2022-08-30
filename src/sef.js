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

/***/ "./src/events/EventManager.ts":
/*!************************************!*\
  !*** ./src/events/EventManager.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventManager = void 0;
var SnapEvents_1 = __webpack_require__(/*! ./SnapEvents */ "./src/events/SnapEvents.ts");
var EventManager = /** @class */ (function () {
    function EventManager() {
        var _this = this;
        this.Trace = window['Trace'];
        if (!this.Trace) {
            throw new Error('Cannot create Event Manager - Trace does not exist!');
        }
        this.listeners = new Map();
        this.Trace.addGlobalListener(function (message, data) {
            _this.handleEvent(message, data);
        });
    }
    EventManager.prototype.handleEvent = function (message, data) {
        var listeners = this.listeners.get(message);
        if (!listeners)
            return;
        listeners.forEach(function (l) {
            var args = l.convertArgs(data);
            l.callback(args);
        });
    };
    // trigger(type: SnapEvents) {
    //     console.log(type);
    // }
    EventManager.prototype.addListener = function (listener) {
    };
    EventManager.prototype.test = function () {
        this.addListener(new SnapEvents_1.Events.Block.RenameListener(function (args) {
            console.log(args.id.selector);
        }));
        this.addListener(new SnapEvents_1.Events.InputSlot.MenuItemSelectedListener(function (args) {
            console.log(args.item);
        }));
        this.addListener(new SnapEvents_1.Events.Block.CreatedListener(function (args) {
            console.log(args.id);
        }));
        this.addListener(new SnapEvents_1.Events.IDE.AddSpriteListener(function (args) {
            console.log(args.name);
        }));
    };
    return EventManager;
}());
exports.EventManager = EventManager;


/***/ }),

/***/ "./src/events/SnapEventListener.ts":
/*!*****************************************!*\
  !*** ./src/events/SnapEventListener.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SnapEventListener = void 0;
var SnapEventListener = /** @class */ (function () {
    function SnapEventListener(type, callback) {
        this.type = type;
        this.callback = callback;
    }
    SnapEventListener.prototype.convertArgs = function (data) {
        if (data == null)
            return {};
        if (typeof data === 'object')
            return data;
        var obj = {};
        obj[this.getValueKey()] = data;
        return obj;
    };
    SnapEventListener.prototype.getValueKey = function () { return 'value'; };
    return SnapEventListener;
}());
exports.SnapEventListener = SnapEventListener;


/***/ }),

/***/ "./src/events/SnapEvents.ts":
/*!**********************************!*\
  !*** ./src/events/SnapEvents.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Events = void 0;
var SnapEventListener_1 = __webpack_require__(/*! ./SnapEventListener */ "./src/events/SnapEventListener.ts");
var Events;
(function (Events) {
    var Block;
    (function (Block) {
        var ClickRunListener = /** @class */ (function (_super) {
            __extends(ClickRunListener, _super);
            function ClickRunListener(args) {
                return _super.call(this, ClickRunListener.type, args) || this;
            }
            ClickRunListener.type = 'Block.clickRun';
            return ClickRunListener;
        }(SnapEventListener_1.SnapEventListener));
        Block.ClickRunListener = ClickRunListener;
        var ClickStopRunListener = /** @class */ (function (_super) {
            __extends(ClickStopRunListener, _super);
            function ClickStopRunListener(args) {
                return _super.call(this, ClickStopRunListener.type, args) || this;
            }
            ClickStopRunListener.type = 'Block.clickStopRun';
            return ClickStopRunListener;
        }(SnapEventListener_1.SnapEventListener));
        Block.ClickStopRunListener = ClickStopRunListener;
        var CreatedListener = /** @class */ (function (_super) {
            __extends(CreatedListener, _super);
            function CreatedListener(args) {
                return _super.call(this, CreatedListener.type, args) || this;
            }
            CreatedListener.type = 'Block.created';
            return CreatedListener;
        }(SnapEventListener_1.SnapEventListener));
        Block.CreatedListener = CreatedListener;
        var DragDestroyListener = /** @class */ (function (_super) {
            __extends(DragDestroyListener, _super);
            function DragDestroyListener(args) {
                return _super.call(this, DragDestroyListener.type, args) || this;
            }
            DragDestroyListener.type = 'Block.dragDestroy';
            return DragDestroyListener;
        }(SnapEventListener_1.SnapEventListener));
        Block.DragDestroyListener = DragDestroyListener;
        var GrabbedListener = /** @class */ (function (_super) {
            __extends(GrabbedListener, _super);
            function GrabbedListener(args) {
                return _super.call(this, GrabbedListener.type, args) || this;
            }
            GrabbedListener.type = 'Block.grabbed';
            return GrabbedListener;
        }(SnapEventListener_1.SnapEventListener));
        Block.GrabbedListener = GrabbedListener;
        var RefactorVarListener = /** @class */ (function (_super) {
            __extends(RefactorVarListener, _super);
            function RefactorVarListener(args) {
                return _super.call(this, RefactorVarListener.type, args) || this;
            }
            RefactorVarListener.type = 'Block.refactorVar';
            return RefactorVarListener;
        }(SnapEventListener_1.SnapEventListener));
        Block.RefactorVarListener = RefactorVarListener;
        var RefactorVarErrorListener = /** @class */ (function (_super) {
            __extends(RefactorVarErrorListener, _super);
            function RefactorVarErrorListener(args) {
                return _super.call(this, RefactorVarErrorListener.type, args) || this;
            }
            RefactorVarErrorListener.type = 'Block.refactorVarError';
            return RefactorVarErrorListener;
        }(SnapEventListener_1.SnapEventListener));
        Block.RefactorVarErrorListener = RefactorVarErrorListener;
        var RelabelListener = /** @class */ (function (_super) {
            __extends(RelabelListener, _super);
            function RelabelListener(args) {
                return _super.call(this, RelabelListener.type, args) || this;
            }
            RelabelListener.type = 'Block.relabel';
            return RelabelListener;
        }(SnapEventListener_1.SnapEventListener));
        Block.RelabelListener = RelabelListener;
        var RenameListener = /** @class */ (function (_super) {
            __extends(RenameListener, _super);
            function RenameListener(args) {
                return _super.call(this, RenameListener.type, args) || this;
            }
            RenameListener.type = 'Block.rename';
            return RenameListener;
        }(SnapEventListener_1.SnapEventListener));
        Block.RenameListener = RenameListener;
        var RingifyListener = /** @class */ (function (_super) {
            __extends(RingifyListener, _super);
            function RingifyListener(args) {
                return _super.call(this, RingifyListener.type, args) || this;
            }
            RingifyListener.type = 'Block.ringify';
            return RingifyListener;
        }(SnapEventListener_1.SnapEventListener));
        Block.RingifyListener = RingifyListener;
        var ScriptPicListener = /** @class */ (function (_super) {
            __extends(ScriptPicListener, _super);
            function ScriptPicListener(args) {
                return _super.call(this, ScriptPicListener.type, args) || this;
            }
            ScriptPicListener.type = 'Block.scriptPic';
            return ScriptPicListener;
        }(SnapEventListener_1.SnapEventListener));
        Block.ScriptPicListener = ScriptPicListener;
        var ShowHelpListener = /** @class */ (function (_super) {
            __extends(ShowHelpListener, _super);
            function ShowHelpListener(args) {
                return _super.call(this, ShowHelpListener.type, args) || this;
            }
            ShowHelpListener.type = 'Block.showHelp';
            return ShowHelpListener;
        }(SnapEventListener_1.SnapEventListener));
        Block.ShowHelpListener = ShowHelpListener;
        var SnappedListener = /** @class */ (function (_super) {
            __extends(SnappedListener, _super);
            function SnappedListener(args) {
                return _super.call(this, SnappedListener.type, args) || this;
            }
            SnappedListener.type = 'Block.snapped';
            return SnappedListener;
        }(SnapEventListener_1.SnapEventListener));
        Block.SnappedListener = SnappedListener;
        var ToggleTransientVariableListener = /** @class */ (function (_super) {
            __extends(ToggleTransientVariableListener, _super);
            function ToggleTransientVariableListener(args) {
                return _super.call(this, ToggleTransientVariableListener.type, args) || this;
            }
            ToggleTransientVariableListener.type = 'Block.toggleTransientVariable';
            return ToggleTransientVariableListener;
        }(SnapEventListener_1.SnapEventListener));
        Block.ToggleTransientVariableListener = ToggleTransientVariableListener;
        var UnringifyListener = /** @class */ (function (_super) {
            __extends(UnringifyListener, _super);
            function UnringifyListener(args) {
                return _super.call(this, UnringifyListener.type, args) || this;
            }
            UnringifyListener.type = 'Block.unringify';
            return UnringifyListener;
        }(SnapEventListener_1.SnapEventListener));
        Block.UnringifyListener = UnringifyListener;
        var UserDestroyListener = /** @class */ (function (_super) {
            __extends(UserDestroyListener, _super);
            function UserDestroyListener(args) {
                return _super.call(this, UserDestroyListener.type, args) || this;
            }
            UserDestroyListener.type = 'Block.userDestroy';
            return UserDestroyListener;
        }(SnapEventListener_1.SnapEventListener));
        Block.UserDestroyListener = UserDestroyListener;
    })(Block = Events.Block || (Events.Block = {}));
    var BlockEditor;
    (function (BlockEditor) {
        var CancelListener = /** @class */ (function (_super) {
            __extends(CancelListener, _super);
            function CancelListener(args) {
                return _super.call(this, CancelListener.type, args) || this;
            }
            CancelListener.type = 'BlockEditor.cancel';
            return CancelListener;
        }(SnapEventListener_1.SnapEventListener));
        BlockEditor.CancelListener = CancelListener;
        var ChangeTypeListener = /** @class */ (function (_super) {
            __extends(ChangeTypeListener, _super);
            function ChangeTypeListener(args) {
                return _super.call(this, ChangeTypeListener.type, args) || this;
            }
            ChangeTypeListener.type = 'BlockEditor.changeType';
            return ChangeTypeListener;
        }(SnapEventListener_1.SnapEventListener));
        BlockEditor.ChangeTypeListener = ChangeTypeListener;
        var OkListener = /** @class */ (function (_super) {
            __extends(OkListener, _super);
            function OkListener(args) {
                return _super.call(this, OkListener.type, args) || this;
            }
            OkListener.type = 'BlockEditor.ok';
            return OkListener;
        }(SnapEventListener_1.SnapEventListener));
        BlockEditor.OkListener = OkListener;
        var StartListener = /** @class */ (function (_super) {
            __extends(StartListener, _super);
            function StartListener(args) {
                return _super.call(this, StartListener.type, args) || this;
            }
            StartListener.type = 'BlockEditor.start';
            return StartListener;
        }(SnapEventListener_1.SnapEventListener));
        BlockEditor.StartListener = StartListener;
        var UpdateBlockLabelListener = /** @class */ (function (_super) {
            __extends(UpdateBlockLabelListener, _super);
            function UpdateBlockLabelListener(args) {
                return _super.call(this, UpdateBlockLabelListener.type, args) || this;
            }
            UpdateBlockLabelListener.prototype.getValueKey = function () { return 'newFragment'; };
            UpdateBlockLabelListener.type = 'BlockEditor.updateBlockLabel';
            return UpdateBlockLabelListener;
        }(SnapEventListener_1.SnapEventListener));
        BlockEditor.UpdateBlockLabelListener = UpdateBlockLabelListener;
    })(BlockEditor = Events.BlockEditor || (Events.BlockEditor = {}));
    var BlockTypeDialog;
    (function (BlockTypeDialog) {
        var CancelListener = /** @class */ (function (_super) {
            __extends(CancelListener, _super);
            function CancelListener(args) {
                return _super.call(this, CancelListener.type, args) || this;
            }
            CancelListener.type = 'BlockTypeDialog.cancel';
            return CancelListener;
        }(SnapEventListener_1.SnapEventListener));
        BlockTypeDialog.CancelListener = CancelListener;
        var ChangeBlockTypeListener = /** @class */ (function (_super) {
            __extends(ChangeBlockTypeListener, _super);
            function ChangeBlockTypeListener(args) {
                return _super.call(this, ChangeBlockTypeListener.type, args) || this;
            }
            ChangeBlockTypeListener.type = 'BlockTypeDialog.changeBlockType';
            return ChangeBlockTypeListener;
        }(SnapEventListener_1.SnapEventListener));
        BlockTypeDialog.ChangeBlockTypeListener = ChangeBlockTypeListener;
        var NewBlockListener = /** @class */ (function (_super) {
            __extends(NewBlockListener, _super);
            function NewBlockListener(args) {
                return _super.call(this, NewBlockListener.type, args) || this;
            }
            NewBlockListener.type = 'BlockTypeDialog.newBlock';
            return NewBlockListener;
        }(SnapEventListener_1.SnapEventListener));
        BlockTypeDialog.NewBlockListener = NewBlockListener;
        var OkListener = /** @class */ (function (_super) {
            __extends(OkListener, _super);
            function OkListener(args) {
                return _super.call(this, OkListener.type, args) || this;
            }
            OkListener.type = 'BlockTypeDialog.ok';
            return OkListener;
        }(SnapEventListener_1.SnapEventListener));
        BlockTypeDialog.OkListener = OkListener;
    })(BlockTypeDialog = Events.BlockTypeDialog || (Events.BlockTypeDialog = {}));
    var BooleanSlotMorph;
    (function (BooleanSlotMorph) {
        var ToggleValueListener = /** @class */ (function (_super) {
            __extends(ToggleValueListener, _super);
            function ToggleValueListener(args) {
                return _super.call(this, ToggleValueListener.type, args) || this;
            }
            ToggleValueListener.type = 'BooleanSlotMorph.toggleValue';
            return ToggleValueListener;
        }(SnapEventListener_1.SnapEventListener));
        BooleanSlotMorph.ToggleValueListener = ToggleValueListener;
    })(BooleanSlotMorph = Events.BooleanSlotMorph || (Events.BooleanSlotMorph = {}));
    var ColorArg;
    (function (ColorArg) {
        var ChangeColorListener = /** @class */ (function (_super) {
            __extends(ChangeColorListener, _super);
            function ChangeColorListener(args) {
                return _super.call(this, ChangeColorListener.type, args) || this;
            }
            ChangeColorListener.type = 'ColorArg.changeColor';
            return ChangeColorListener;
        }(SnapEventListener_1.SnapEventListener));
        ColorArg.ChangeColorListener = ChangeColorListener;
    })(ColorArg = Events.ColorArg || (Events.ColorArg = {}));
    var CommandBlock;
    (function (CommandBlock) {
        var WrapListener = /** @class */ (function (_super) {
            __extends(WrapListener, _super);
            function WrapListener(args) {
                return _super.call(this, WrapListener.type, args) || this;
            }
            WrapListener.type = 'CommandBlock.wrap';
            return WrapListener;
        }(SnapEventListener_1.SnapEventListener));
        CommandBlock.WrapListener = WrapListener;
    })(CommandBlock = Events.CommandBlock || (Events.CommandBlock = {}));
    var IDE;
    (function (IDE) {
        var AddSpriteListener = /** @class */ (function (_super) {
            __extends(AddSpriteListener, _super);
            function AddSpriteListener(args) {
                return _super.call(this, AddSpriteListener.type, args) || this;
            }
            AddSpriteListener.prototype.getValueKey = function () { return 'name'; };
            AddSpriteListener.type = 'IDE.addSprite';
            return AddSpriteListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.AddSpriteListener = AddSpriteListener;
        var ChangeCategoryListener = /** @class */ (function (_super) {
            __extends(ChangeCategoryListener, _super);
            function ChangeCategoryListener(args) {
                return _super.call(this, ChangeCategoryListener.type, args) || this;
            }
            ChangeCategoryListener.prototype.getValueKey = function () { return 'category'; };
            ChangeCategoryListener.type = 'IDE.changeCategory';
            return ChangeCategoryListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.ChangeCategoryListener = ChangeCategoryListener;
        var DeleteCustomBlockListener = /** @class */ (function (_super) {
            __extends(DeleteCustomBlockListener, _super);
            function DeleteCustomBlockListener(args) {
                return _super.call(this, DeleteCustomBlockListener.type, args) || this;
            }
            DeleteCustomBlockListener.type = 'IDE.deleteCustomBlock';
            return DeleteCustomBlockListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.DeleteCustomBlockListener = DeleteCustomBlockListener;
        var DuplicateSpriteListener = /** @class */ (function (_super) {
            __extends(DuplicateSpriteListener, _super);
            function DuplicateSpriteListener(args) {
                return _super.call(this, DuplicateSpriteListener.type, args) || this;
            }
            DuplicateSpriteListener.prototype.getValueKey = function () { return 'name'; };
            DuplicateSpriteListener.type = 'IDE.duplicateSprite';
            return DuplicateSpriteListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.DuplicateSpriteListener = DuplicateSpriteListener;
        var ExportGlobalBlocksListener = /** @class */ (function (_super) {
            __extends(ExportGlobalBlocksListener, _super);
            function ExportGlobalBlocksListener(args) {
                return _super.call(this, ExportGlobalBlocksListener.type, args) || this;
            }
            ExportGlobalBlocksListener.type = 'IDE.exportGlobalBlocks';
            return ExportGlobalBlocksListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.ExportGlobalBlocksListener = ExportGlobalBlocksListener;
        var ExportProejctAsCloudDataListener = /** @class */ (function (_super) {
            __extends(ExportProejctAsCloudDataListener, _super);
            function ExportProejctAsCloudDataListener(args) {
                return _super.call(this, ExportProejctAsCloudDataListener.type, args) || this;
            }
            ExportProejctAsCloudDataListener.prototype.getValueKey = function () { return 'name'; };
            ExportProejctAsCloudDataListener.type = 'IDE.exportProejctAsCloudData';
            return ExportProejctAsCloudDataListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.ExportProejctAsCloudDataListener = ExportProejctAsCloudDataListener;
        var ExportProjectListener = /** @class */ (function (_super) {
            __extends(ExportProjectListener, _super);
            function ExportProjectListener(args) {
                return _super.call(this, ExportProjectListener.type, args) || this;
            }
            ExportProjectListener.prototype.getValueKey = function () { return 'name'; };
            ExportProjectListener.type = 'IDE.exportProject';
            return ExportProjectListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.ExportProjectListener = ExportProjectListener;
        var ExportProjectMediaListener = /** @class */ (function (_super) {
            __extends(ExportProjectMediaListener, _super);
            function ExportProjectMediaListener(args) {
                return _super.call(this, ExportProjectMediaListener.type, args) || this;
            }
            ExportProjectMediaListener.prototype.getValueKey = function () { return 'name'; };
            ExportProjectMediaListener.type = 'IDE.exportProjectMedia';
            return ExportProjectMediaListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.ExportProjectMediaListener = ExportProjectMediaListener;
        var ExportProjectNoMediaListener = /** @class */ (function (_super) {
            __extends(ExportProjectNoMediaListener, _super);
            function ExportProjectNoMediaListener(args) {
                return _super.call(this, ExportProjectNoMediaListener.type, args) || this;
            }
            ExportProjectNoMediaListener.prototype.getValueKey = function () { return 'name'; };
            ExportProjectNoMediaListener.type = 'IDE.exportProjectNoMedia';
            return ExportProjectNoMediaListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.ExportProjectNoMediaListener = ExportProjectNoMediaListener;
        var ExportScriptsPictureListener = /** @class */ (function (_super) {
            __extends(ExportScriptsPictureListener, _super);
            function ExportScriptsPictureListener(args) {
                return _super.call(this, ExportScriptsPictureListener.type, args) || this;
            }
            ExportScriptsPictureListener.type = 'IDE.exportScriptsPicture';
            return ExportScriptsPictureListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.ExportScriptsPictureListener = ExportScriptsPictureListener;
        var ExportSpriteListener = /** @class */ (function (_super) {
            __extends(ExportSpriteListener, _super);
            function ExportSpriteListener(args) {
                return _super.call(this, ExportSpriteListener.type, args) || this;
            }
            ExportSpriteListener.prototype.getValueKey = function () { return 'name'; };
            ExportSpriteListener.type = 'IDE.exportSprite';
            return ExportSpriteListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.ExportSpriteListener = ExportSpriteListener;
        var GreenFlagListener = /** @class */ (function (_super) {
            __extends(GreenFlagListener, _super);
            function GreenFlagListener(args) {
                return _super.call(this, GreenFlagListener.type, args) || this;
            }
            GreenFlagListener.type = 'IDE.greenFlag';
            return GreenFlagListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.GreenFlagListener = GreenFlagListener;
        var LoadFailedListener = /** @class */ (function (_super) {
            __extends(LoadFailedListener, _super);
            function LoadFailedListener(args) {
                return _super.call(this, LoadFailedListener.type, args) || this;
            }
            LoadFailedListener.prototype.getValueKey = function () { return 'err'; };
            LoadFailedListener.type = 'IDE.loadFailed';
            return LoadFailedListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.LoadFailedListener = LoadFailedListener;
        var NewProjectListener = /** @class */ (function (_super) {
            __extends(NewProjectListener, _super);
            function NewProjectListener(args) {
                return _super.call(this, NewProjectListener.type, args) || this;
            }
            NewProjectListener.type = 'IDE.newProject';
            return NewProjectListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.NewProjectListener = NewProjectListener;
        var OpenBlocksStringListener = /** @class */ (function (_super) {
            __extends(OpenBlocksStringListener, _super);
            function OpenBlocksStringListener(args) {
                return _super.call(this, OpenBlocksStringListener.type, args) || this;
            }
            OpenBlocksStringListener.type = 'IDE.openBlocksString';
            return OpenBlocksStringListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.OpenBlocksStringListener = OpenBlocksStringListener;
        var OpenCloudDataStringListener = /** @class */ (function (_super) {
            __extends(OpenCloudDataStringListener, _super);
            function OpenCloudDataStringListener(args) {
                return _super.call(this, OpenCloudDataStringListener.type, args) || this;
            }
            OpenCloudDataStringListener.type = 'IDE.openCloudDataString';
            return OpenCloudDataStringListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.OpenCloudDataStringListener = OpenCloudDataStringListener;
        var OpenMediaStringListener = /** @class */ (function (_super) {
            __extends(OpenMediaStringListener, _super);
            function OpenMediaStringListener(args) {
                return _super.call(this, OpenMediaStringListener.type, args) || this;
            }
            OpenMediaStringListener.type = 'IDE.openMediaString';
            return OpenMediaStringListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.OpenMediaStringListener = OpenMediaStringListener;
        var OpenProjectListener = /** @class */ (function (_super) {
            __extends(OpenProjectListener, _super);
            function OpenProjectListener(args) {
                return _super.call(this, OpenProjectListener.type, args) || this;
            }
            OpenProjectListener.prototype.getValueKey = function () { return 'name'; };
            OpenProjectListener.type = 'IDE.openProject';
            return OpenProjectListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.OpenProjectListener = OpenProjectListener;
        var OpenProjectStringListener = /** @class */ (function (_super) {
            __extends(OpenProjectStringListener, _super);
            function OpenProjectStringListener(args) {
                return _super.call(this, OpenProjectStringListener.type, args) || this;
            }
            OpenProjectStringListener.type = 'IDE.openProjectString';
            return OpenProjectStringListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.OpenProjectStringListener = OpenProjectStringListener;
        var OpenSpritesStringListener = /** @class */ (function (_super) {
            __extends(OpenSpritesStringListener, _super);
            function OpenSpritesStringListener(args) {
                return _super.call(this, OpenSpritesStringListener.type, args) || this;
            }
            OpenSpritesStringListener.type = 'IDE.openSpritesString';
            return OpenSpritesStringListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.OpenSpritesStringListener = OpenSpritesStringListener;
        var OpenedListener = /** @class */ (function (_super) {
            __extends(OpenedListener, _super);
            function OpenedListener(args) {
                return _super.call(this, OpenedListener.type, args) || this;
            }
            OpenedListener.type = 'IDE.opened';
            return OpenedListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.OpenedListener = OpenedListener;
        var PaintNewSpriteListener = /** @class */ (function (_super) {
            __extends(PaintNewSpriteListener, _super);
            function PaintNewSpriteListener(args) {
                return _super.call(this, PaintNewSpriteListener.type, args) || this;
            }
            PaintNewSpriteListener.prototype.getValueKey = function () { return 'name'; };
            PaintNewSpriteListener.type = 'IDE.paintNewSprite';
            return PaintNewSpriteListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.PaintNewSpriteListener = PaintNewSpriteListener;
        var PauseListener = /** @class */ (function (_super) {
            __extends(PauseListener, _super);
            function PauseListener(args) {
                return _super.call(this, PauseListener.type, args) || this;
            }
            PauseListener.type = 'IDE.pause';
            return PauseListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.PauseListener = PauseListener;
        var RotationStyleChangedListener = /** @class */ (function (_super) {
            __extends(RotationStyleChangedListener, _super);
            function RotationStyleChangedListener(args) {
                return _super.call(this, RotationStyleChangedListener.type, args) || this;
            }
            RotationStyleChangedListener.prototype.getValueKey = function () { return 'rotationStyle'; };
            RotationStyleChangedListener.type = 'IDE.rotationStyleChanged';
            return RotationStyleChangedListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.RotationStyleChangedListener = RotationStyleChangedListener;
        var SaveProjectToCloudListener = /** @class */ (function (_super) {
            __extends(SaveProjectToCloudListener, _super);
            function SaveProjectToCloudListener(args) {
                return _super.call(this, SaveProjectToCloudListener.type, args) || this;
            }
            SaveProjectToCloudListener.prototype.getValueKey = function () { return 'name'; };
            SaveProjectToCloudListener.type = 'IDE.saveProjectToCloud';
            return SaveProjectToCloudListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.SaveProjectToCloudListener = SaveProjectToCloudListener;
        var SelectSpriteListener = /** @class */ (function (_super) {
            __extends(SelectSpriteListener, _super);
            function SelectSpriteListener(args) {
                return _super.call(this, SelectSpriteListener.type, args) || this;
            }
            SelectSpriteListener.prototype.getValueKey = function () { return 'name'; };
            SelectSpriteListener.type = 'IDE.selectSprite';
            return SelectSpriteListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.SelectSpriteListener = SelectSpriteListener;
        var SetLanguageListener = /** @class */ (function (_super) {
            __extends(SetLanguageListener, _super);
            function SetLanguageListener(args) {
                return _super.call(this, SetLanguageListener.type, args) || this;
            }
            SetLanguageListener.prototype.getValueKey = function () { return 'lang'; };
            SetLanguageListener.type = 'IDE.setLanguage';
            return SetLanguageListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.SetLanguageListener = SetLanguageListener;
        var SetSpriteDraggableListener = /** @class */ (function (_super) {
            __extends(SetSpriteDraggableListener, _super);
            function SetSpriteDraggableListener(args) {
                return _super.call(this, SetSpriteDraggableListener.type, args) || this;
            }
            SetSpriteDraggableListener.prototype.getValueKey = function () { return 'isDraggable'; };
            SetSpriteDraggableListener.type = 'IDE.setSpriteDraggable';
            return SetSpriteDraggableListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.SetSpriteDraggableListener = SetSpriteDraggableListener;
        var SetSpriteTabListener = /** @class */ (function (_super) {
            __extends(SetSpriteTabListener, _super);
            function SetSpriteTabListener(args) {
                return _super.call(this, SetSpriteTabListener.type, args) || this;
            }
            SetSpriteTabListener.prototype.getValueKey = function () { return 'tabString'; };
            SetSpriteTabListener.type = 'IDE.setSpriteTab';
            return SetSpriteTabListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.SetSpriteTabListener = SetSpriteTabListener;
        var StopListener = /** @class */ (function (_super) {
            __extends(StopListener, _super);
            function StopListener(args) {
                return _super.call(this, StopListener.type, args) || this;
            }
            StopListener.type = 'IDE.stop';
            return StopListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.StopListener = StopListener;
        var ToggleAppModeListener = /** @class */ (function (_super) {
            __extends(ToggleAppModeListener, _super);
            function ToggleAppModeListener(args) {
                return _super.call(this, ToggleAppModeListener.type, args) || this;
            }
            ToggleAppModeListener.prototype.getValueKey = function () { return 'isAppMode'; };
            ToggleAppModeListener.type = 'IDE.toggleAppMode';
            return ToggleAppModeListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.ToggleAppModeListener = ToggleAppModeListener;
        var ToggleStageSizeListener = /** @class */ (function (_super) {
            __extends(ToggleStageSizeListener, _super);
            function ToggleStageSizeListener(args) {
                return _super.call(this, ToggleStageSizeListener.type, args) || this;
            }
            ToggleStageSizeListener.prototype.getValueKey = function () { return 'isSmallStage'; };
            ToggleStageSizeListener.type = 'IDE.toggleStageSize';
            return ToggleStageSizeListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.ToggleStageSizeListener = ToggleStageSizeListener;
        var UnpauseListener = /** @class */ (function (_super) {
            __extends(UnpauseListener, _super);
            function UnpauseListener(args) {
                return _super.call(this, UnpauseListener.type, args) || this;
            }
            UnpauseListener.type = 'IDE.unpause';
            return UnpauseListener;
        }(SnapEventListener_1.SnapEventListener));
        IDE.UnpauseListener = UnpauseListener;
    })(IDE = Events.IDE || (Events.IDE = {}));
    var InputSlot;
    (function (InputSlot) {
        var EditedListener = /** @class */ (function (_super) {
            __extends(EditedListener, _super);
            function EditedListener(args) {
                return _super.call(this, EditedListener.type, args) || this;
            }
            EditedListener.type = 'InputSlot.edited';
            return EditedListener;
        }(SnapEventListener_1.SnapEventListener));
        InputSlot.EditedListener = EditedListener;
        var MenuItemSelectedListener = /** @class */ (function (_super) {
            __extends(MenuItemSelectedListener, _super);
            function MenuItemSelectedListener(args) {
                return _super.call(this, MenuItemSelectedListener.type, args) || this;
            }
            MenuItemSelectedListener.type = 'InputSlot.menuItemSelected';
            return MenuItemSelectedListener;
        }(SnapEventListener_1.SnapEventListener));
        InputSlot.MenuItemSelectedListener = MenuItemSelectedListener;
    })(InputSlot = Events.InputSlot || (Events.InputSlot = {}));
    var MultiArg;
    (function (MultiArg) {
        var AddInputListener = /** @class */ (function (_super) {
            __extends(AddInputListener, _super);
            function AddInputListener(args) {
                return _super.call(this, AddInputListener.type, args) || this;
            }
            AddInputListener.type = 'MultiArg.addInput';
            return AddInputListener;
        }(SnapEventListener_1.SnapEventListener));
        MultiArg.AddInputListener = AddInputListener;
        var RemoveInputListener = /** @class */ (function (_super) {
            __extends(RemoveInputListener, _super);
            function RemoveInputListener(args) {
                return _super.call(this, RemoveInputListener.type, args) || this;
            }
            RemoveInputListener.type = 'MultiArg.removeInput';
            return RemoveInputListener;
        }(SnapEventListener_1.SnapEventListener));
        MultiArg.RemoveInputListener = RemoveInputListener;
    })(MultiArg = Events.MultiArg || (Events.MultiArg = {}));
    var ProjectDialog;
    (function (ProjectDialog) {
        var SetSourceListener = /** @class */ (function (_super) {
            __extends(SetSourceListener, _super);
            function SetSourceListener(args) {
                return _super.call(this, SetSourceListener.type, args) || this;
            }
            SetSourceListener.prototype.getValueKey = function () { return 'source'; };
            SetSourceListener.type = 'ProjectDialog.setSource';
            return SetSourceListener;
        }(SnapEventListener_1.SnapEventListener));
        ProjectDialog.SetSourceListener = SetSourceListener;
        var ShareProjectListener = /** @class */ (function (_super) {
            __extends(ShareProjectListener, _super);
            function ShareProjectListener(args) {
                return _super.call(this, ShareProjectListener.type, args) || this;
            }
            ShareProjectListener.type = 'ProjectDialog.shareProject';
            return ShareProjectListener;
        }(SnapEventListener_1.SnapEventListener));
        ProjectDialog.ShareProjectListener = ShareProjectListener;
        var ShownListener = /** @class */ (function (_super) {
            __extends(ShownListener, _super);
            function ShownListener(args) {
                return _super.call(this, ShownListener.type, args) || this;
            }
            ShownListener.type = 'ProjectDialog.shown';
            return ShownListener;
        }(SnapEventListener_1.SnapEventListener));
        ProjectDialog.ShownListener = ShownListener;
        var UnshareProjectListener = /** @class */ (function (_super) {
            __extends(UnshareProjectListener, _super);
            function UnshareProjectListener(args) {
                return _super.call(this, UnshareProjectListener.type, args) || this;
            }
            UnshareProjectListener.prototype.getValueKey = function () { return 'ProjectName'; };
            UnshareProjectListener.type = 'ProjectDialog.unshareProject';
            return UnshareProjectListener;
        }(SnapEventListener_1.SnapEventListener));
        ProjectDialog.UnshareProjectListener = UnshareProjectListener;
    })(ProjectDialog = Events.ProjectDialog || (Events.ProjectDialog = {}));
    var Scripts;
    (function (Scripts) {
        var CleanUpListener = /** @class */ (function (_super) {
            __extends(CleanUpListener, _super);
            function CleanUpListener(args) {
                return _super.call(this, CleanUpListener.type, args) || this;
            }
            CleanUpListener.type = 'Scripts.cleanUp';
            return CleanUpListener;
        }(SnapEventListener_1.SnapEventListener));
        Scripts.CleanUpListener = CleanUpListener;
        var ExportPictureListener = /** @class */ (function (_super) {
            __extends(ExportPictureListener, _super);
            function ExportPictureListener(args) {
                return _super.call(this, ExportPictureListener.type, args) || this;
            }
            ExportPictureListener.type = 'Scripts.exportPicture';
            return ExportPictureListener;
        }(SnapEventListener_1.SnapEventListener));
        Scripts.ExportPictureListener = ExportPictureListener;
        var RedropListener = /** @class */ (function (_super) {
            __extends(RedropListener, _super);
            function RedropListener(args) {
                return _super.call(this, RedropListener.type, args) || this;
            }
            RedropListener.prototype.getValueKey = function () { return 'action'; };
            RedropListener.type = 'Scripts.redrop';
            return RedropListener;
        }(SnapEventListener_1.SnapEventListener));
        Scripts.RedropListener = RedropListener;
        var UndropListener = /** @class */ (function (_super) {
            __extends(UndropListener, _super);
            function UndropListener(args) {
                return _super.call(this, UndropListener.type, args) || this;
            }
            UndropListener.prototype.getValueKey = function () { return 'action'; };
            UndropListener.type = 'Scripts.undrop';
            return UndropListener;
        }(SnapEventListener_1.SnapEventListener));
        Scripts.UndropListener = UndropListener;
    })(Scripts = Events.Scripts || (Events.Scripts = {}));
    var Sprite;
    (function (Sprite) {
        var AddVariableListener = /** @class */ (function (_super) {
            __extends(AddVariableListener, _super);
            function AddVariableListener(args) {
                return _super.call(this, AddVariableListener.type, args) || this;
            }
            AddVariableListener.prototype.getValueKey = function () { return 'name'; };
            AddVariableListener.type = 'Sprite.addVariable';
            return AddVariableListener;
        }(SnapEventListener_1.SnapEventListener));
        Sprite.AddVariableListener = AddVariableListener;
        var DeleteVariableListener = /** @class */ (function (_super) {
            __extends(DeleteVariableListener, _super);
            function DeleteVariableListener(args) {
                return _super.call(this, DeleteVariableListener.type, args) || this;
            }
            DeleteVariableListener.prototype.getValueKey = function () { return 'varName'; };
            DeleteVariableListener.type = 'Sprite.deleteVariable';
            return DeleteVariableListener;
        }(SnapEventListener_1.SnapEventListener));
        Sprite.DeleteVariableListener = DeleteVariableListener;
        var SetNameListener = /** @class */ (function (_super) {
            __extends(SetNameListener, _super);
            function SetNameListener(args) {
                return _super.call(this, SetNameListener.type, args) || this;
            }
            SetNameListener.prototype.getValueKey = function () { return 'string'; };
            SetNameListener.type = 'Sprite.setName';
            return SetNameListener;
        }(SnapEventListener_1.SnapEventListener));
        Sprite.SetNameListener = SetNameListener;
    })(Sprite = Events.Sprite || (Events.Sprite = {}));
    var XML;
    (function (XML) {
        var ParseFailedListener = /** @class */ (function (_super) {
            __extends(ParseFailedListener, _super);
            function ParseFailedListener(args) {
                return _super.call(this, ParseFailedListener.type, args) || this;
            }
            ParseFailedListener.prototype.getValueKey = function () { return 'xmlString'; };
            ParseFailedListener.type = 'XML.parseFailed';
            return ParseFailedListener;
        }(SnapEventListener_1.SnapEventListener));
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

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SnapTypes = exports.SnapHelper = exports.EventManager = exports.DefGenerator = exports.BlockFactory = void 0;
var BlockFactory_1 = __webpack_require__(/*! ./blocks/BlockFactory */ "./src/blocks/BlockFactory.ts");
Object.defineProperty(exports, "BlockFactory", ({ enumerable: true, get: function () { return BlockFactory_1.BlockFactory; } }));
var EventManager_1 = __webpack_require__(/*! ./events/EventManager */ "./src/events/EventManager.ts");
Object.defineProperty(exports, "EventManager", ({ enumerable: true, get: function () { return EventManager_1.EventManager; } }));
var DefGenerator_1 = __webpack_require__(/*! ./meta/DefGenerator */ "./src/meta/DefGenerator.ts");
Object.defineProperty(exports, "DefGenerator", ({ enumerable: true, get: function () { return DefGenerator_1.DefGenerator; } }));
var SnapHelper_1 = __webpack_require__(/*! ./snap/SnapHelper */ "./src/snap/SnapHelper.ts");
Object.defineProperty(exports, "SnapHelper", ({ enumerable: true, get: function () { return SnapHelper_1.SnapHelper; } }));
var SnapTypes_1 = __webpack_require__(/*! ./snap/SnapTypes */ "./src/snap/SnapTypes.ts");
Object.defineProperty(exports, "SnapTypes", ({ enumerable: true, get: function () { return SnapTypes_1.SnapTypes; } }));
module.exports = {
    BlockFactory: BlockFactory_1.BlockFactory,
    DefGenerator: DefGenerator_1.DefGenerator,
    EventManager: EventManager_1.EventManager,
    SnapHelper: SnapHelper_1.SnapHelper,
    SnapTypes: SnapTypes_1.SnapTypes,
};


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
        this.fields = new Map;
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
        var fKeys = __spreadArray([], __read(this.fields.keys()), false);
        fKeys.sort();
        try {
            for (var fKeys_1 = __values(fKeys), fKeys_1_1 = fKeys_1.next(); !fKeys_1_1.done; fKeys_1_1 = fKeys_1.next()) {
                var fkey = fKeys_1_1.value;
                code += '    ' + this.fields.get(fkey).toTS() + '\n';
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (fKeys_1_1 && !fKeys_1_1.done && (_a = fKeys_1.return)) _a.call(fKeys_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        code += '\n';
        var mKeys = __spreadArray([], __read(this.methods.keys()), false);
        mKeys.sort();
        try {
            for (var mKeys_1 = __values(mKeys), mKeys_1_1 = mKeys_1.next(); !mKeys_1_1.done; mKeys_1_1 = mKeys_1.next()) {
                var mKey = mKeys_1_1.value;
                code += '    ' + this.methods.get(mKey).toTS() + '\n';
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (mKeys_1_1 && !mKeys_1_1.done && (_b = mKeys_1.return)) _b.call(mKeys_1);
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
/* harmony export */   "SnapEventManager": () => (/* binding */ SnapEventManager),
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
/* harmony export */   "hex_sha512": () => (/* binding */ hex_sha512),
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
/* harmony export */   "loop": () => (/* binding */ loop),
/* harmony export */   "m": () => (/* binding */ m),
/* harmony export */   "newCanvas": () => (/* binding */ newCanvas),
/* harmony export */   "newGuid": () => (/* binding */ newGuid),
/* harmony export */   "nop": () => (/* binding */ nop),
/* harmony export */   "normalizeCanvas": () => (/* binding */ normalizeCanvas),
/* harmony export */   "radians": () => (/* binding */ radians),
/* harmony export */   "sizeOf": () => (/* binding */ sizeOf),
/* harmony export */   "snapEquals": () => (/* binding */ snapEquals)
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	SEF = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztVQzdMUDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL1NFRi8uL3NyYy9ibG9ja3MvQmxvY2tGYWN0b3J5LnRzIiwid2VicGFjazovL1NFRi8uL3NyYy9ldmVudHMvRXZlbnRNYW5hZ2VyLnRzIiwid2VicGFjazovL1NFRi8uL3NyYy9ldmVudHMvU25hcEV2ZW50TGlzdGVuZXIudHMiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL2V2ZW50cy9TbmFwRXZlbnRzLnRzIiwid2VicGFjazovL1NFRi8uL3NyYy9leHRlbmQvT3ZlcnJpZGVSZWdpc3RyeS50cyIsIndlYnBhY2s6Ly9TRUYvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL21ldGEvRGVmR2VuZXJhdG9yLnRzIiwid2VicGFjazovL1NFRi8uL3NyYy9zbmFwL1NuYXBIZWxwZXIudHMiLCJ3ZWJwYWNrOi8vU0VGLy4vc3JjL3NuYXAvU25hcFR5cGVzLnRzIiwid2VicGFjazovL1NFRi8uL3NyYy9zbmFwL1NuYXAuanMiLCJ3ZWJwYWNrOi8vU0VGL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1NFRi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vU0VGL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vU0VGL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vU0VGL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vU0VGL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9TRUYvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE92ZXJyaWRlUmVnaXN0cnkgfSBmcm9tIFwiLi4vZXh0ZW5kL092ZXJyaWRlUmVnaXN0cnlcIjtcclxuaW1wb3J0IHsgbG9jYWxpemUsIFNwcml0ZU1vcnBoLCBTdGFnZU1vcnBoLCBUb2dnbGVNb3JwaCB9IGZyb20gXCIuLi9zbmFwL1NuYXBcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCbG9ja0ZhY3Rvcnkge1xyXG5cclxuICAgIGJsb2NrcyA9IFtdIGFzIEJsb2NrW107XHJcbiAgICBuZWVkc0luaXQgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmJsb2NrcyA9IFtdO1xyXG4gICAgICAgIHRoaXMubmVlZHNJbml0ID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IG15QmxvY2tzID0gdGhpcy5ibG9ja3M7XHJcblxyXG4gICAgICAgIGxldCBvdmVycmlkZSA9IGZ1bmN0aW9uKGJhc2UsIGNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgIGxldCBibG9ja3MgPSBiYXNlLmNhbGwodGhpcywgY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICBsZXQgY2hlY2tTcHJpdGUgPSB0aGlzIGluc3RhbmNlb2YgU3RhZ2VNb3JwaDtcclxuICAgICAgICAgICAgbGV0IGFkZGVkID0gMDtcclxuICAgICAgICAgICAgbXlCbG9ja3MuZm9yRWFjaChibG9jayA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2suY2F0ZWdvcnkgPT09IGNhdGVnb3J5ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICEoY2hlY2tTcHJpdGUgJiYgYmxvY2suc3ByaXRlT25seSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2sudG9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5zcGxpY2UoYWRkZWQsIDAsIGJsb2NrLnRvQmxvY2tNb3JwaCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnNwbGljZShhZGRlZCwgMCwgYmxvY2sudG9Ub2dnbGUodGhpcykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRlZCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrLnRvVG9nZ2xlKHRoaXMpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnB1c2goYmxvY2sudG9CbG9ja01vcnBoKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBibG9ja3M7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgT3ZlcnJpZGVSZWdpc3RyeS5leHRlbmQoU3ByaXRlTW9ycGgsICdpbml0QmxvY2tzJywgZnVuY3Rpb24oYmFzZSkge1xyXG4gICAgICAgICAgICBiYXNlLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgIG15QmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xyXG4gICAgICAgICAgICAgICAgYmxvY2suYWRkVG9NYXAoU3ByaXRlTW9ycGgucHJvdG90eXBlLmJsb2Nrcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBPdmVycmlkZVJlZ2lzdHJ5LmV4dGVuZChTcHJpdGVNb3JwaCwgJ2Jsb2NrVGVtcGxhdGVzJywgb3ZlcnJpZGUpO1xyXG4gICAgICAgIE92ZXJyaWRlUmVnaXN0cnkuZXh0ZW5kKFN0YWdlTW9ycGgsICdibG9ja1RlbXBsYXRlcycsIG92ZXJyaWRlKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVnaXN0ZXJCbG9jayhibG9jaykge1xyXG4gICAgICAgIHRoaXMuYmxvY2tzLnB1c2goYmxvY2spO1xyXG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZnJlc2goKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubmVlZHNJbml0KSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5uZWVkc0luaXQgPSB0cnVlO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBTcHJpdGVNb3JwaC5wcm90b3R5cGUuaW5pdEJsb2NrcygpO1xyXG4gICAgICAgICAgICB0aGlzLm5lZWRzSW5pdCA9IGZhbHNlO1xyXG4gICAgICAgIH0sIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZENhdGVnb3J5KG5hbWUsIGNvbG9yKSB7XHJcbiAgICAgICAgU3ByaXRlTW9ycGgucHJvdG90eXBlLmNhdGVnb3JpZXMucHVzaChuYW1lKTtcclxuICAgICAgICBTcHJpdGVNb3JwaC5wcm90b3R5cGUuYmxvY2tDb2xvcltuYW1lXSA9IGNvbG9yO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBCbG9jayB7XHJcblxyXG4gICAgc2VsZWN0b3I6IHN0cmluZztcclxuICAgIHNwZWM6IHN0cmluZztcclxuICAgIGRlZmF1bHRzOiBbXTtcclxuICAgIHR5cGU6IHN0cmluZztcclxuICAgIGNhdGVnb3J5OiBzdHJpbmc7XHJcbiAgICBzcHJpdGVPbmx5OiBib29sZWFuO1xyXG4gICAgdG9wOiBib29sZWFuO1xyXG4gICAgdG9nZ2xhYmxlOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHNlbGVjdG9yLCBzcGVjLCBkZWZhdWx0cywgdHlwZSwgY2F0ZWdvcnksIHNwcml0ZU9ubHksIHRvcCwgdG9nZ2xhYmxlXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3I7XHJcbiAgICAgICAgdGhpcy5zcGVjID0gc3BlYztcclxuICAgICAgICB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHM7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLmNhdGVnb3J5ID0gY2F0ZWdvcnk7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVPbmx5ID0gc3ByaXRlT25seTtcclxuICAgICAgICB0aGlzLnRvcCA9IHRvcCB8fCBmYWxzZTtcclxuICAgICAgICB0aGlzLnRvZ2dsYWJsZSA9IHRvZ2dsYWJsZSB8fCBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRUb01hcChtYXApIHtcclxuICAgICAgICBtYXBbdGhpcy5zZWxlY3Rvcl0gPSB7XHJcbiAgICAgICAgICAgIG9ubHk6IHRoaXMuc3ByaXRlT25seSA/IFNwcml0ZU1vcnBoIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXHJcbiAgICAgICAgICAgIGNhdGVnb3J5OiB0aGlzLmNhdGVnb3J5LFxyXG4gICAgICAgICAgICBzcGVjOiBsb2NhbGl6ZSh0aGlzLnNwZWMpLFxyXG4gICAgICAgICAgICBkZWZhdWx0czogdGhpcy5kZWZhdWx0cyxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHRvQmxvY2tNb3JwaCgpIHtcclxuICAgICAgICBpZiAoU3RhZ2VNb3JwaC5wcm90b3R5cGUuaGlkZGVuUHJpbWl0aXZlc1t0aGlzLnNlbGVjdG9yXSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG5ld0Jsb2NrID1cclxuICAgICAgICAgICAgU3RhZ2VNb3JwaC5wcm90b3R5cGUuYmxvY2tGb3JTZWxlY3Rvcih0aGlzLnNlbGVjdG9yLCB0cnVlKTtcclxuICAgICAgICBpZiAoIW5ld0Jsb2NrKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignQ2Fubm90IGluaXRpYWxpemUgYmxvY2snLCB0aGlzLnNlbGVjdG9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5ld0Jsb2NrLmlzVGVtcGxhdGUgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiBuZXdCbG9jaztcclxuICAgIH1cclxuXHJcbiAgICB0b1RvZ2dsZShzcHJpdGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMudG9nZ2xhYmxlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBsZXQgc2VsZWN0b3IgPSB0aGlzLnNlbGVjdG9yO1xyXG4gICAgICAgIGlmIChTdGFnZU1vcnBoLnByb3RvdHlwZS5oaWRkZW5QcmltaXRpdmVzW3NlbGVjdG9yXSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGluZm8gPSBTdGFnZU1vcnBoLnByb3RvdHlwZS5ibG9ja3Nbc2VsZWN0b3JdO1xyXG4gICAgICAgIHJldHVybiBuZXcgVG9nZ2xlTW9ycGgoXHJcbiAgICAgICAgICAgICdjaGVja2JveCcsXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNwcml0ZS50b2dnbGVXYXRjaGVyKFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsaXplKGluZm8uc3BlYyksXHJcbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlLmJsb2NrQ29sb3JbaW5mby5jYXRlZ29yeV1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzcHJpdGUuc2hvd2luZ1dhdGNoZXIoc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBudWxsXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRTcHJpdGVBY3Rpb24oYWN0aW9uKSB7XHJcbiAgICAgICAgU3ByaXRlTW9ycGgucHJvdG90eXBlW3RoaXMuc2VsZWN0b3JdID1cclxuICAgICAgICAgICAgU3RhZ2VNb3JwaC5wcm90b3R5cGVbdGhpcy5zZWxlY3Rvcl0gPSBhY3Rpb247XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gXCIuL1NuYXBFdmVudHNcIjtcclxuaW1wb3J0IHsgU25hcEV2ZW50TGlzdGVuZXIgfSBmcm9tIFwiLi9TbmFwRXZlbnRMaXN0ZW5lclwiO1xyXG5pbXBvcnQgeyBTbmFwRXZlbnRNYW5hZ2VyIH0gZnJvbSBcIi4uL3NuYXAvU25hcFwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBFdmVudE1hbmFnZXIge1xyXG5cclxuICAgIFRyYWNlOiBTbmFwRXZlbnRNYW5hZ2VyO1xyXG4gICAgbGlzdGVuZXJzOiBNYXA8c3RyaW5nLCBTbmFwRXZlbnRMaXN0ZW5lcltdPjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLlRyYWNlID0gd2luZG93WydUcmFjZSddO1xyXG4gICAgICAgIGlmICghdGhpcy5UcmFjZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgRXZlbnQgTWFuYWdlciAtIFRyYWNlIGRvZXMgbm90IGV4aXN0IScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IG5ldyBNYXAoKTtcclxuICAgICAgICB0aGlzLlRyYWNlLmFkZEdsb2JhbExpc3RlbmVyKChtZXNzYWdlOiBzdHJpbmcsIGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUV2ZW50KG1lc3NhZ2UsIGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlRXZlbnQobWVzc2FnZTogc3RyaW5nLCBkYXRhOiBhbnkpIHtcclxuICAgICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnMuZ2V0KG1lc3NhZ2UpO1xyXG4gICAgICAgIGlmICghbGlzdGVuZXJzKSByZXR1cm47XHJcbiAgICAgICAgbGlzdGVuZXJzLmZvckVhY2gobCA9PiB7XHJcbiAgICAgICAgICAgIGxldCBhcmdzID0gbC5jb252ZXJ0QXJncyhkYXRhKTtcclxuICAgICAgICAgICAgbC5jYWxsYmFjayhhcmdzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB0cmlnZ2VyKHR5cGU6IFNuYXBFdmVudHMpIHtcclxuICAgIC8vICAgICBjb25zb2xlLmxvZyh0eXBlKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBhZGRMaXN0ZW5lcihsaXN0ZW5lcjogU25hcEV2ZW50TGlzdGVuZXIpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdGVzdCgpIHtcclxuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKG5ldyBFdmVudHMuQmxvY2suUmVuYW1lTGlzdGVuZXIoYXJncyA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFyZ3MuaWQuc2VsZWN0b3IpO1xyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKG5ldyBFdmVudHMuSW5wdXRTbG90Lk1lbnVJdGVtU2VsZWN0ZWRMaXN0ZW5lcihhcmdzID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYXJncy5pdGVtKTtcclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcihuZXcgRXZlbnRzLkJsb2NrLkNyZWF0ZWRMaXN0ZW5lcihhcmdzID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYXJncy5pZCk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIobmV3IEV2ZW50cy5JREUuQWRkU3ByaXRlTGlzdGVuZXIoYXJncyA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFyZ3MubmFtZSk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcclxuICAgIHJlYWRvbmx5IGNhbGxiYWNrOiBGdW5jdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlOiBzdHJpbmcsIGNhbGxiYWNrOiAoYXJnczogU25hcEV2ZW50QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnZlcnRBcmdzKGRhdGE6IGFueSkge1xyXG4gICAgICAgIGlmIChkYXRhID09IG51bGwpIHJldHVybiB7fTtcclxuICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSByZXR1cm4gZGF0YTtcclxuICAgICAgICBsZXQgb2JqID0ge307XHJcbiAgICAgICAgb2JqW3RoaXMuZ2V0VmFsdWVLZXkoKV0gPSBkYXRhO1xyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAndmFsdWUnOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU25hcEV2ZW50QXJncyB7XHJcblxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEVtcHR5QXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG5cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBWYWx1ZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgIHZhbHVlOiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQmxvY2tJREFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgIGlkOiBudW1iZXI7XHJcbiAgICBzZWxlY3Rvcjogc3RyaW5nO1xyXG4gICAgdGVtcGxhdGU6IGJvb2xlYW47XHJcbiAgICBzcGVjOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSW5wdXRJREFyZ3MgZXh0ZW5kcyBCbG9ja0lEQXJncyB7XHJcbiAgICBhcmdJbmRleDogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbUJsb2NrRGVmQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgc3BlYzogc3RyaW5nO1xyXG4gICAgY2F0ZWdvcnk6IHN0cmluZztcclxuICAgIHR5cGU6IHN0cmluZztcclxuICAgIGd1aWQ6IHN0cmluZztcclxuICAgIGlzR2xvYmFsOiBib29sZWFuO1xyXG59IiwiaW1wb3J0IHsgQmxvY2tJREFyZ3MsIEVtcHR5QXJncywgSW5wdXRJREFyZ3MsIEN1c3RvbUJsb2NrRGVmQXJncywgU25hcEV2ZW50QXJncywgU25hcEV2ZW50TGlzdGVuZXIsIFZhbHVlQXJncyB9IGZyb20gXCIuL1NuYXBFdmVudExpc3RlbmVyXCI7XHJcbmV4cG9ydCBuYW1lc3BhY2UgRXZlbnRzIHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgQmxvY2sge1xyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQ2xpY2tSdW5MaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2suY2xpY2tSdW4nO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKENsaWNrUnVuTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBDbGlja1N0b3BSdW5MaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2suY2xpY2tTdG9wUnVuJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEJsb2NrSURBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihDbGlja1N0b3BSdW5MaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIENyZWF0ZWRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2suY3JlYXRlZCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBCbG9ja0lEQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ3JlYXRlZExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRHJhZ0Rlc3Ryb3lMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2suZHJhZ0Rlc3Ryb3knO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKERyYWdEZXN0cm95TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR3JhYmJlZEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IEJsb2NrSURBcmdzO1xyXG4gICAgICAgICAgICBvcmlnaW46IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBHcmFiYmVkTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLmdyYWJiZWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogR3JhYmJlZEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEdyYWJiZWRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZWZhY3RvclZhckFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IEJsb2NrSURBcmdzO1xyXG4gICAgICAgICAgICBvbGROYW1lOiBhbnk7XHJcbiAgICAgICAgICAgIG5ld05hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBSZWZhY3RvclZhckxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay5yZWZhY3RvclZhcic7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBSZWZhY3RvclZhckFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFJlZmFjdG9yVmFyTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVmYWN0b3JWYXJFcnJvckFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IEJsb2NrSURBcmdzO1xyXG4gICAgICAgICAgICB3aGVyZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFJlZmFjdG9yVmFyRXJyb3JMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2sucmVmYWN0b3JWYXJFcnJvcic7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBSZWZhY3RvclZhckVycm9yQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoUmVmYWN0b3JWYXJFcnJvckxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlbGFiZWxBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlkOiBCbG9ja0lEQXJncztcclxuICAgICAgICAgICAgc2VsZWN0b3I6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBSZWxhYmVsTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLnJlbGFiZWwnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUmVsYWJlbEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFJlbGFiZWxMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZW5hbWVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlkOiBCbG9ja0lEQXJncztcclxuICAgICAgICAgICAgbmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFJlbmFtZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay5yZW5hbWUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUmVuYW1lQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoUmVuYW1lTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBSaW5naWZ5TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLnJpbmdpZnknO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFJpbmdpZnlMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNjcmlwdFBpY0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay5zY3JpcHRQaWMnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNjcmlwdFBpY0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU2hvd0hlbHBMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2suc2hvd0hlbHAnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNob3dIZWxwTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU25hcHBlZEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IEJsb2NrSURBcmdzO1xyXG4gICAgICAgICAgICBvcmlnaW46IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTbmFwcGVkTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLnNuYXBwZWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogU25hcHBlZEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNuYXBwZWRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFRvZ2dsZVRyYW5zaWVudFZhcmlhYmxlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrLnRvZ2dsZVRyYW5zaWVudFZhcmlhYmxlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFZhbHVlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVG9nZ2xlVHJhbnNpZW50VmFyaWFibGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFVucmluZ2lmeUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9jay51bnJpbmdpZnknO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFVucmluZ2lmeUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgVXNlckRlc3Ryb3lMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2sudXNlckRlc3Ryb3knO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQmxvY2tJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFVzZXJEZXN0cm95TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBCbG9ja0VkaXRvciB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBDYW5jZWxMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2tFZGl0b3IuY2FuY2VsJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEN1c3RvbUJsb2NrRGVmQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ2FuY2VsTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBDaGFuZ2VUeXBlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrRWRpdG9yLmNoYW5nZVR5cGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQ3VzdG9tQmxvY2tEZWZBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihDaGFuZ2VUeXBlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBPa0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9ja0VkaXRvci5vayc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBDdXN0b21CbG9ja0RlZkFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE9rTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTdGFydExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9ja0VkaXRvci5zdGFydCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBDdXN0b21CbG9ja0RlZkFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFN0YXJ0TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgVXBkYXRlQmxvY2tMYWJlbEFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgbmV3RnJhZ21lbnQ6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBVcGRhdGVCbG9ja0xhYmVsTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrRWRpdG9yLnVwZGF0ZUJsb2NrTGFiZWwnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogVXBkYXRlQmxvY2tMYWJlbEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFVwZGF0ZUJsb2NrTGFiZWxMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduZXdGcmFnbWVudCc7IH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgQmxvY2tUeXBlRGlhbG9nIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIENhbmNlbExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdCbG9ja1R5cGVEaWFsb2cuY2FuY2VsJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ2FuY2VsTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBDaGFuZ2VCbG9ja1R5cGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2tUeXBlRGlhbG9nLmNoYW5nZUJsb2NrVHlwZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKENoYW5nZUJsb2NrVHlwZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgTmV3QmxvY2tMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQmxvY2tUeXBlRGlhbG9nLm5ld0Jsb2NrJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoTmV3QmxvY2tMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE9rTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jsb2NrVHlwZURpYWxvZy5vayc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE9rTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBCb29sZWFuU2xvdE1vcnBoIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBUb2dnbGVWYWx1ZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaWQ6IElucHV0SURBcmdzO1xyXG4gICAgICAgICAgICB2YWx1ZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFRvZ2dsZVZhbHVlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0Jvb2xlYW5TbG90TW9ycGgudG9nZ2xlVmFsdWUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogVG9nZ2xlVmFsdWVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihUb2dnbGVWYWx1ZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgQ29sb3JBcmcge1xyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIENoYW5nZUNvbG9yQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpZDogSW5wdXRJREFyZ3M7XHJcbiAgICAgICAgICAgIGNvbG9yOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQ2hhbmdlQ29sb3JMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnQ29sb3JBcmcuY2hhbmdlQ29sb3InO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogQ2hhbmdlQ29sb3JBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihDaGFuZ2VDb2xvckxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgQ29tbWFuZEJsb2NrIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBXcmFwQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpZDogQmxvY2tJREFyZ3M7XHJcbiAgICAgICAgICAgIHRhcmdldDogQmxvY2tJREFyZ3M7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgV3JhcExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdDb21tYW5kQmxvY2sud3JhcCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBXcmFwQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoV3JhcExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgSURFIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBBZGRTcHJpdGVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBBZGRTcHJpdGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmFkZFNwcml0ZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBBZGRTcHJpdGVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihBZGRTcHJpdGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQ2hhbmdlQ2F0ZWdvcnlBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGNhdGVnb3J5OiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQ2hhbmdlQ2F0ZWdvcnlMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmNoYW5nZUNhdGVnb3J5JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IENoYW5nZUNhdGVnb3J5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ2hhbmdlQ2F0ZWdvcnlMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICdjYXRlZ29yeSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRGVsZXRlQ3VzdG9tQmxvY2tMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmRlbGV0ZUN1c3RvbUJsb2NrJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEN1c3RvbUJsb2NrRGVmQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoRGVsZXRlQ3VzdG9tQmxvY2tMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEdXBsaWNhdGVTcHJpdGVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBEdXBsaWNhdGVTcHJpdGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmR1cGxpY2F0ZVNwcml0ZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBEdXBsaWNhdGVTcHJpdGVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihEdXBsaWNhdGVTcHJpdGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBFeHBvcnRHbG9iYWxCbG9ja3NMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmV4cG9ydEdsb2JhbEJsb2Nrcyc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEV4cG9ydEdsb2JhbEJsb2Nrc0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEV4cG9ydFByb2VqY3RBc0Nsb3VkRGF0YUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgbmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEV4cG9ydFByb2VqY3RBc0Nsb3VkRGF0YUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuZXhwb3J0UHJvZWpjdEFzQ2xvdWREYXRhJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEV4cG9ydFByb2VqY3RBc0Nsb3VkRGF0YUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEV4cG9ydFByb2VqY3RBc0Nsb3VkRGF0YUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBvcnRQcm9qZWN0QXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRXhwb3J0UHJvamVjdExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuZXhwb3J0UHJvamVjdCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFeHBvcnRQcm9qZWN0QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoRXhwb3J0UHJvamVjdExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBvcnRQcm9qZWN0TWVkaWFBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBFeHBvcnRQcm9qZWN0TWVkaWFMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLmV4cG9ydFByb2plY3RNZWRpYSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFeHBvcnRQcm9qZWN0TWVkaWFBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihFeHBvcnRQcm9qZWN0TWVkaWFMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0UHJvamVjdE5vTWVkaWFBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBFeHBvcnRQcm9qZWN0Tm9NZWRpYUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuZXhwb3J0UHJvamVjdE5vTWVkaWEnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRXhwb3J0UHJvamVjdE5vTWVkaWFBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihFeHBvcnRQcm9qZWN0Tm9NZWRpYUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEV4cG9ydFNjcmlwdHNQaWN0dXJlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5leHBvcnRTY3JpcHRzUGljdHVyZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEV4cG9ydFNjcmlwdHNQaWN0dXJlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0U3ByaXRlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRXhwb3J0U3ByaXRlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5leHBvcnRTcHJpdGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRXhwb3J0U3ByaXRlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoRXhwb3J0U3ByaXRlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnbmFtZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgR3JlZW5GbGFnTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5ncmVlbkZsYWcnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihHcmVlbkZsYWdMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBMb2FkRmFpbGVkQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBlcnI6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBMb2FkRmFpbGVkTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5sb2FkRmFpbGVkJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IExvYWRGYWlsZWRBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihMb2FkRmFpbGVkTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnZXJyJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBOZXdQcm9qZWN0TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5uZXdQcm9qZWN0JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoTmV3UHJvamVjdExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgT3BlbkJsb2Nrc1N0cmluZ0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUub3BlbkJsb2Nrc1N0cmluZyc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE9wZW5CbG9ja3NTdHJpbmdMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE9wZW5DbG91ZERhdGFTdHJpbmdMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLm9wZW5DbG91ZERhdGFTdHJpbmcnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihPcGVuQ2xvdWREYXRhU3RyaW5nTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBPcGVuTWVkaWFTdHJpbmdMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLm9wZW5NZWRpYVN0cmluZyc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE9wZW5NZWRpYVN0cmluZ0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE9wZW5Qcm9qZWN0QXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgT3BlblByb2plY3RMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLm9wZW5Qcm9qZWN0JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IE9wZW5Qcm9qZWN0QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoT3BlblByb2plY3RMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBPcGVuUHJvamVjdFN0cmluZ0xpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUub3BlblByb2plY3RTdHJpbmcnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihPcGVuUHJvamVjdFN0cmluZ0xpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgT3BlblNwcml0ZXNTdHJpbmdMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLm9wZW5TcHJpdGVzU3RyaW5nJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoT3BlblNwcml0ZXNTdHJpbmdMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE9wZW5lZExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUub3BlbmVkJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoT3BlbmVkTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUGFpbnROZXdTcHJpdGVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBQYWludE5ld1Nwcml0ZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUucGFpbnROZXdTcHJpdGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUGFpbnROZXdTcHJpdGVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihQYWludE5ld1Nwcml0ZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ25hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFBhdXNlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5wYXVzZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBFbXB0eUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFBhdXNlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUm90YXRpb25TdHlsZUNoYW5nZWRBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIHJvdGF0aW9uU3R5bGU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBSb3RhdGlvblN0eWxlQ2hhbmdlZExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUucm90YXRpb25TdHlsZUNoYW5nZWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUm90YXRpb25TdHlsZUNoYW5nZWRBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihSb3RhdGlvblN0eWxlQ2hhbmdlZExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ3JvdGF0aW9uU3R5bGUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTYXZlUHJvamVjdFRvQ2xvdWRBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTYXZlUHJvamVjdFRvQ2xvdWRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnNhdmVQcm9qZWN0VG9DbG91ZCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBTYXZlUHJvamVjdFRvQ2xvdWRBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTYXZlUHJvamVjdFRvQ2xvdWRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2VsZWN0U3ByaXRlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU2VsZWN0U3ByaXRlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS5zZWxlY3RTcHJpdGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogU2VsZWN0U3ByaXRlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoU2VsZWN0U3ByaXRlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnbmFtZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNldExhbmd1YWdlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBsYW5nOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgU2V0TGFuZ3VhZ2VMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnNldExhbmd1YWdlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFNldExhbmd1YWdlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoU2V0TGFuZ3VhZ2VMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICdsYW5nJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0U3ByaXRlRHJhZ2dhYmxlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBpc0RyYWdnYWJsZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNldFNwcml0ZURyYWdnYWJsZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUuc2V0U3ByaXRlRHJhZ2dhYmxlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFNldFNwcml0ZURyYWdnYWJsZUFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFNldFNwcml0ZURyYWdnYWJsZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ2lzRHJhZ2dhYmxlJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0U3ByaXRlVGFiQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICB0YWJTdHJpbmc6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTZXRTcHJpdGVUYWJMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnNldFNwcml0ZVRhYic7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBTZXRTcHJpdGVUYWJBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTZXRTcHJpdGVUYWJMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICd0YWJTdHJpbmcnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFN0b3BMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSURFLnN0b3AnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTdG9wTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgVG9nZ2xlQXBwTW9kZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaXNBcHBNb2RlOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgVG9nZ2xlQXBwTW9kZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJREUudG9nZ2xlQXBwTW9kZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBUb2dnbGVBcHBNb2RlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVG9nZ2xlQXBwTW9kZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ2lzQXBwTW9kZSc7IH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFRvZ2dsZVN0YWdlU2l6ZUFyZ3MgZXh0ZW5kcyBTbmFwRXZlbnRBcmdzIHtcclxuICAgICAgICAgICAgaXNTbWFsbFN0YWdlOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgVG9nZ2xlU3RhZ2VTaXplTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS50b2dnbGVTdGFnZVNpemUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogVG9nZ2xlU3RhZ2VTaXplQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVG9nZ2xlU3RhZ2VTaXplTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnaXNTbWFsbFN0YWdlJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBVbnBhdXNlTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ0lERS51bnBhdXNlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVW5wYXVzZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgSW5wdXRTbG90IHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFZGl0ZWRBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlkOiBJbnB1dElEQXJncztcclxuICAgICAgICAgICAgdGV4dDogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEVkaXRlZExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdJbnB1dFNsb3QuZWRpdGVkJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVkaXRlZEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKEVkaXRlZExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE1lbnVJdGVtU2VsZWN0ZWRBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIGlkOiBJbnB1dElEQXJncztcclxuICAgICAgICAgICAgaXRlbTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIE1lbnVJdGVtU2VsZWN0ZWRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnSW5wdXRTbG90Lm1lbnVJdGVtU2VsZWN0ZWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogTWVudUl0ZW1TZWxlY3RlZEFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKE1lbnVJdGVtU2VsZWN0ZWRMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIE11bHRpQXJnIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIEFkZElucHV0TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ011bHRpQXJnLmFkZElucHV0JztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IElucHV0SURBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihBZGRJbnB1dExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgUmVtb3ZlSW5wdXRMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnTXVsdGlBcmcucmVtb3ZlSW5wdXQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogSW5wdXRJREFyZ3MpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyKFJlbW92ZUlucHV0TGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBQcm9qZWN0RGlhbG9nIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXRTb3VyY2VBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIHNvdXJjZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNldFNvdXJjZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdQcm9qZWN0RGlhbG9nLnNldFNvdXJjZSc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBTZXRTb3VyY2VBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTZXRTb3VyY2VMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICdzb3VyY2UnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTaGFyZVByb2plY3RBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIG5hbWU6IGFueTtcclxuICAgICAgICAgICAgaXNUaGlzUHJvamVjdDogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNoYXJlUHJvamVjdExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdQcm9qZWN0RGlhbG9nLnNoYXJlUHJvamVjdCc7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGFyZ3M6IChhcmdzOiBTaGFyZVByb2plY3RBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTaGFyZVByb2plY3RMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFNob3duTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ1Byb2plY3REaWFsb2cuc2hvd24nO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTaG93bkxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFVuc2hhcmVQcm9qZWN0QXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBQcm9qZWN0TmFtZTogYW55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFVuc2hhcmVQcm9qZWN0TGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ1Byb2plY3REaWFsb2cudW5zaGFyZVByb2plY3QnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogVW5zaGFyZVByb2plY3RBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihVbnNoYXJlUHJvamVjdExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ1Byb2plY3ROYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBTY3JpcHRzIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIENsZWFuVXBMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnU2NyaXB0cy5jbGVhblVwJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEVtcHR5QXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQ2xlYW5VcExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgRXhwb3J0UGljdHVyZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdTY3JpcHRzLmV4cG9ydFBpY3R1cmUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRW1wdHlBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihFeHBvcnRQaWN0dXJlTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVkcm9wQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBhY3Rpb246IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBSZWRyb3BMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnU2NyaXB0cy5yZWRyb3AnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUmVkcm9wQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoUmVkcm9wTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnYWN0aW9uJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgVW5kcm9wQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBhY3Rpb246IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBVbmRyb3BMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnU2NyaXB0cy51bmRyb3AnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogVW5kcm9wQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoVW5kcm9wTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnYWN0aW9uJzsgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBTcHJpdGUge1xyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFkZFZhcmlhYmxlQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBuYW1lOiBhbnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgY2xhc3MgQWRkVmFyaWFibGVMaXN0ZW5lciBleHRlbmRzIFNuYXBFdmVudExpc3RlbmVyIHtcclxuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IHR5cGUgPSAnU3ByaXRlLmFkZFZhcmlhYmxlJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IEFkZFZhcmlhYmxlQXJncykgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICAgICAgc3VwZXIoQWRkVmFyaWFibGVMaXN0ZW5lci50eXBlLCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZXRWYWx1ZUtleSgpIHsgcmV0dXJuICduYW1lJzsgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlVmFyaWFibGVBcmdzIGV4dGVuZHMgU25hcEV2ZW50QXJncyB7XHJcbiAgICAgICAgICAgIHZhck5hbWU6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBEZWxldGVWYXJpYWJsZUxpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdTcHJpdGUuZGVsZXRlVmFyaWFibGUnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogRGVsZXRlVmFyaWFibGVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihEZWxldGVWYXJpYWJsZUxpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ3Zhck5hbWUnOyB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXROYW1lQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICBzdHJpbmc6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTZXROYW1lTGlzdGVuZXIgZXh0ZW5kcyBTbmFwRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSB0eXBlID0gJ1Nwcml0ZS5zZXROYW1lJztcclxuICAgICAgICAgICAgY29uc3RydWN0b3IoYXJnczogKGFyZ3M6IFNldE5hbWVBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihTZXROYW1lTGlzdGVuZXIudHlwZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2V0VmFsdWVLZXkoKSB7IHJldHVybiAnc3RyaW5nJzsgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBYTUwge1xyXG5cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFBhcnNlRmFpbGVkQXJncyBleHRlbmRzIFNuYXBFdmVudEFyZ3Mge1xyXG4gICAgICAgICAgICB4bWxTdHJpbmc6IGFueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBQYXJzZUZhaWxlZExpc3RlbmVyIGV4dGVuZHMgU25hcEV2ZW50TGlzdGVuZXIge1xyXG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZSA9ICdYTUwucGFyc2VGYWlsZWQnO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihhcmdzOiAoYXJnczogUGFyc2VGYWlsZWRBcmdzKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgICAgICBzdXBlcihQYXJzZUZhaWxlZExpc3RlbmVyLnR5cGUsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdldFZhbHVlS2V5KCkgeyByZXR1cm4gJ3htbFN0cmluZyc7IH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBPdmVycmlkZVJlZ2lzdHJ5IHtcclxuXHJcbiAgICBzdGF0aWMgZXh0ZW5kKGNsYXp6IDogRnVuY3Rpb24sIGZ1bmN0aW9uTmFtZSA6IHN0cmluZywgbmV3RnVuY3Rpb24pIHtcclxuICAgICAgICBpZiAoIWNsYXp6IHx8ICFjbGF6ei5wcm90b3R5cGUpIHtcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignZXh0ZW5kIHJlcXVpcmVzIGEgY2xhc3MgZm9yIGl0cyBmaXJzdCBhcmd1bWVudCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBPdmVycmlkZVJlZ2lzdHJ5LmV4dGVuZE9iamVjdChjbGF6ei5wcm90b3R5cGUsIGZ1bmN0aW9uTmFtZSwgbmV3RnVuY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBleHRlbmRPYmplY3Qob2JqZWN0IDogb2JqZWN0LCBmdW5jdGlvbk5hbWUgOiBzdHJpbmcsIG5ld0Z1bmN0aW9uKSB7XHJcbiAgICAgICAgaWYgKCFvYmplY3RbZnVuY3Rpb25OYW1lXSkge1xyXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxyXG4gICAgICAgICAgICBjb25zb2xlLnRyYWNlKCk7XHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Nhbm5vdCBleHRlbmQgZnVuY3Rpb24gJyArIGZ1bmN0aW9uTmFtZSArXHJcbiAgICAgICAgICAgICAgICAnIGJlY2F1c2UgaXQgZG9lcyBub3QgZXhpc3QuJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBvbGRGdW5jdGlvbiA9IG9iamVjdFtmdW5jdGlvbk5hbWVdO1xyXG5cclxuICAgICAgICBpZiAoIW9sZEZ1bmN0aW9uLmV4dGVuZGVkICYmIG9sZEZ1bmN0aW9uLmxlbmd0aCAhPSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgIG9sZEZ1bmN0aW9uLmxlbmd0aCArIDEgIT09IG5ld0Z1bmN0aW9uLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9ICdFeHRlbmRpbmcgZnVuY3Rpb24gd2l0aCB3cm9uZyBudW1iZXIgb2YgYXJndW1lbnRzOiAnICtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZSArICcgJyArXHJcbiAgICAgICAgICAgICAgICBvbGRGdW5jdGlvbi5sZW5ndGggKyAnIHZzICcgKyBuZXdGdW5jdGlvbi5sZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvYmplY3RbZnVuY3Rpb25OYW1lXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgYXJncy51bnNoaWZ0KG9sZEZ1bmN0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld0Z1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgb2JqZWN0W2Z1bmN0aW9uTmFtZV0uZXh0ZW5kZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICByZXR1cm4gb2xkRnVuY3Rpb247XHJcbiAgICB9XHJcbn1cclxuXHJcbiIsImltcG9ydCB7IEJsb2NrRmFjdG9yeSB9IGZyb20gXCIuL2Jsb2Nrcy9CbG9ja0ZhY3RvcnlcIjtcclxuaW1wb3J0IHsgRXZlbnRNYW5hZ2VyIH0gZnJvbSBcIi4vZXZlbnRzL0V2ZW50TWFuYWdlclwiO1xyXG5pbXBvcnQgeyBEZWZHZW5lcmF0b3IgfSBmcm9tIFwiLi9tZXRhL0RlZkdlbmVyYXRvclwiO1xyXG5pbXBvcnQgeyBTbmFwSGVscGVyIH0gZnJvbSBcIi4vc25hcC9TbmFwSGVscGVyXCI7XHJcbmltcG9ydCB7IFNuYXBUeXBlcyB9IGZyb20gXCIuL3NuYXAvU25hcFR5cGVzXCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIEJsb2NrRmFjdG9yeSxcclxuICAgIERlZkdlbmVyYXRvcixcclxuICAgIEV2ZW50TWFuYWdlcixcclxuICAgIFNuYXBIZWxwZXIsXHJcbiAgICBTbmFwVHlwZXMsXHJcbn07XHJcblxyXG5leHBvcnQge1xyXG4gICAgQmxvY2tGYWN0b3J5LFxyXG4gICAgRGVmR2VuZXJhdG9yLFxyXG4gICAgRXZlbnRNYW5hZ2VyLFxyXG4gICAgU25hcEhlbHBlcixcclxuICAgIFNuYXBUeXBlcyxcclxufTtcclxuXHJcblxyXG4iLCJleHBvcnQgY2xhc3MgRGVmR2VuZXJhdG9yIHtcclxuXHJcbiAgICBjbGFzc2VzID0gbmV3IE1hcDxzdHJpbmcsIENsYXNzRGVmPjtcclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyh3aW5kb3cpKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGtleSk7XHJcbiAgICAgICAgICAgIGlmICghd2luZG93Lmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB3aW5kb3dba2V5XTtcclxuICAgICAgICAgICAgaWYgKCEodmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbikpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlLnByb3RvdHlwZSkgY29udGludWU7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5uYW1lLmxlbmd0aCA9PSAwKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdGhpcy5jbGFzc2VzLnNldChrZXksIG5ldyBDbGFzc0RlZih2YWx1ZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNsYXNzZXMuZm9yRWFjaChjID0+IGMuYWRkUGFyZW50RGF0YSh0aGlzLmNsYXNzZXMpKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5vdXRwdXREZWZpbml0aW9ucygpKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvdXRwdXRFeHBvcnRzKCkge1xyXG4gICAgICAgIHJldHVybiBbLi4udGhpcy5jbGFzc2VzLnZhbHVlcygpXS5tYXAoYyA9PiBjLmV4cG9ydFN0YXRlbWVudCgpKS5qb2luKCdcXG4nKTtcclxuICAgIH1cclxuXHJcbiAgICBvdXRwdXREZWZpbml0aW9ucygpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG5leHBvcnQgY2xhc3MgU25hcFR5cGUge1xyXG4gICAgcHJvdG90eXBlOiBhbnk7XHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcbn1cXG5cXG5gICsgWy4uLnRoaXMuY2xhc3Nlcy52YWx1ZXMoKV0ubWFwKGMgPT4gYy50b1RTKCkpLmpvaW4oJ1xcblxcbicpO1xyXG4gICAgfVxyXG5cclxuICAgIGRvd25sb2FkQWxsKCkge1xyXG4gICAgICAgIHRoaXMuZG93bmxvYWRGaWxlKCdTbmFwLmpzJywgdGhpcy5vdXRwdXRFeHBvcnRzKCkpO1xyXG4gICAgICAgIHRoaXMuZG93bmxvYWRGaWxlKCdTbmFwLmQudHMnLCB0aGlzLm91dHB1dERlZmluaXRpb25zKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGRvd25sb2FkRmlsZShmaWxlbmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnaHJlZicsICdkYXRhOnRleHQvcGxhaW47Y2hhcnNldD11dGYtOCwnICsgZW5jb2RlVVJJQ29tcG9uZW50KHRleHQpKTtcclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBmaWxlbmFtZSk7XHJcblxyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG5cclxuICAgICAgICBlbGVtZW50LmNsaWNrKCk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5jbGFzcyBDbGFzc0RlZiB7XHJcbiAgICBiYXNlRnVuY3Rpb246IEZ1bmN0aW9uO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdWJlciA9IG51bGwgYXMgc3RyaW5nO1xyXG4gICAgZnVuY3Rpb25Qcm94eSA6IE1ldGhvZDtcclxuICAgIGZpZWxkcyA9IG5ldyBNYXA8c3RyaW5nLCBGaWVsZD47XHJcbiAgICBtZXRob2RzID0gbmV3IE1hcDxzdHJpbmcsIE1ldGhvZD47XHJcbiAgICBhZGRlZFBhcmVudERhdGEgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihmdW5jOiBGdW5jdGlvbikge1xyXG4gICAgICAgIHRoaXMuYmFzZUZ1bmN0aW9uID0gZnVuYztcclxuICAgICAgICB0aGlzLm5hbWUgPSBmdW5jLm5hbWU7XHJcbiAgICAgICAgY29uc3QgcHJvdG8gPSBmdW5jLnByb3RvdHlwZTtcclxuICAgICAgICBpZiAoIXByb3RvKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmIChbLi4uT2JqZWN0LmtleXMocHJvdG8pXS5sZW5ndGggPD0gMSkge1xyXG4gICAgICAgICAgICB0aGlzLmZ1bmN0aW9uUHJveHkgPSBuZXcgTWV0aG9kKHRoaXMubmFtZSwgZnVuYyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudWJlciA9IGZ1bmNbJ3ViZXInXT8uY29uc3RydWN0b3I/Lm5hbWU7XHJcbiAgICAgICAgdGhpcy5pbmZlckZpZWxkcyhmdW5jKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvKSkge1xyXG4gICAgICAgICAgICAvLyBJIHRoaW5rIHRoaXMgaXMgcmVkdW5kYW50Li4uXHJcbiAgICAgICAgICAgIGlmICghcHJvdG8uaGFzT3duUHJvcGVydHkoa2V5KSkgY29udGludWU7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IHByb3RvW2tleV07XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGhvZHMuc2V0KGtleSwgbmV3IE1ldGhvZChrZXksIHZhbHVlKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBkaXN0aW5ndWlzaCBiZXR3ZWVuIGluaGVyaXRlZCBmaWVsZHMgYW5kIHN0YXRpYyBmaWVsZHNcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMuZmllbGRzLnB1c2gobmV3IEZpZWxkKGtleSwgdmFsdWUsIHRydWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmluZmVyRmllbGRzKHByb3RvWydpbml0J10pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFBhcmVudERhdGEoY2xhc3NlczogTWFwPHN0cmluZywgQ2xhc3NEZWY+KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuYWRkZWRQYXJlbnREYXRhKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5hZGRlZFBhcmVudERhdGEgPSB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLmZ1bmN0aW9uUHJveHkpIHJldHVybjtcclxuICAgICAgICBpZiAoIXRoaXMudWJlciB8fCAhY2xhc3Nlcy5oYXModGhpcy51YmVyKSkgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IGNsYXNzZXMuZ2V0KHRoaXMudWJlcik7XHJcbiAgICAgICAgaWYgKCFwYXJlbnQuYWRkZWRQYXJlbnREYXRhKSBwYXJlbnQuYWRkUGFyZW50RGF0YShjbGFzc2VzKTtcclxuICAgICAgICBmb3IgKGxldCBbbWV0aG9kTmFtZSwgbWV0aG9kXSBvZiBwYXJlbnQubWV0aG9kcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tZXRob2RzLmhhcyhtZXRob2ROYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIHRoaXMubWV0aG9kcy5zZXQobWV0aG9kTmFtZSwgbWV0aG9kKTtcclxuICAgICAgICAgICAgLy8gSWYgYSBmaWVsZCBvdmVyc2hhZG93cyBhIHBhcmVudCBtZXRob2QsIGl0IHdhcyBwcm9iYWJseVxyXG4gICAgICAgICAgICAvLyBhIG1pc3Rha2UsIHNvIGRlbGV0ZSBpdC5cclxuICAgICAgICAgICAgLy8gVE9ETzogTm90IHN1cmUgdGhpcyBpcyB0aGUgcmlnaHQgY2FsbDsgY291bGQgaWdub3JlIGluaGVyaXRhbmNlXHJcbiAgICAgICAgICAgIHRoaXMuZmllbGRzLmRlbGV0ZShtZXRob2ROYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgW2ZpZWxkTmFtZSwgZmllbGRdIG9mIHBhcmVudC5maWVsZHMpIHtcclxuICAgICAgICAgICAgLy8gRG9uJ3QgY29weSBmaWVsZHMgdGhhdCBoYXZlIHNoYWRvd2luZyBtZXRob2RzXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1ldGhvZHMuaGFzKGZpZWxkTmFtZSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5maWVsZHMuaGFzKGZpZWxkTmFtZSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB0aGlzLmZpZWxkcy5zZXQoZmllbGROYW1lLCBmaWVsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluZmVyRmllbGRzKGZ1bmM6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgaWYgKCFmdW5jKSByZXR1cm47XHJcbiAgICAgICAgY29uc3QganMgPSBmdW5jLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgY29uc3QgdmFyRGVjID0gL15cXHMqdGhpc1xccypcXC5cXHMqKFthLXpBLVpfJF1bMC05YS16QS1aXyRdKilcXHMqPS9nbTtcclxuICAgICAgICBmb3IgKGxldCBtYXRjaCBvZiBqcy5tYXRjaEFsbCh2YXJEZWMpKSB7XHJcbiAgICAgICAgICAgIGxldCBuYW1lID0gbWF0Y2hbMV07XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZpZWxkcy5oYXMobmFtZSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAvLyBHaXZlIHByZWNlZGVuY2UgdG8gbWV0aG9kc1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tZXRob2RzLmhhcyhuYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmllbGRzLnNldChuYW1lLCBuZXcgRmllbGQobmFtZSwgbnVsbCwgZmFsc2UpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0U3RhdGVtZW50KCkge1xyXG4gICAgICAgIHJldHVybiBgZXhwb3J0IGNvbnN0ICR7dGhpcy5uYW1lfSA9IHdpbmRvd1snJHt0aGlzLm5hbWV9J107YDtcclxuICAgIH1cclxuXHJcbiAgICB0b1RTKCkgOiBzdHJpbmcgIHtcclxuICAgICAgICBpZiAodGhpcy5mdW5jdGlvblByb3h5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgZXhwb3J0IGZ1bmN0aW9uICR7dGhpcy5mdW5jdGlvblByb3h5LnRvVFMoKX1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbGV0IGNvZGUgPSBgZXhwb3J0IGNsYXNzICR7dGhpcy5uYW1lfSBleHRlbmRzICR7dGhpcy51YmVyID8gdGhpcy51YmVyIDogJ1NuYXBUeXBlJ31gO1xyXG4gICAgICAgIC8vIFRPRE86IEJlY2F1c2UgVHlwZXNjcmlwdCBzZWVtcyBub3QgdG8gYWxsb3cgZnVuY3Rpb24gc2hhZG93aW5nLFxyXG4gICAgICAgIC8vIG5lZWQgdG8gbWFudWFsbHkgZGVmaW5lIGFsbCBwYXJlbnQgdHlwZXMgYW5kIG1ldGhvZHMgKHRoYXQgYXJlbid0IHNoYWRvd2VkKSBoZXJlXHJcbiAgICAgICAgbGV0IGNvZGUgPSBgZXhwb3J0IGNsYXNzICR7dGhpcy5uYW1lfSBleHRlbmRzIFNuYXBUeXBlYDtcclxuICAgICAgICBjb2RlICs9IGAge1xcbmA7XHJcbiAgICAgICAgbGV0IGZLZXlzID0gWy4uLnRoaXMuZmllbGRzLmtleXMoKV07XHJcbiAgICAgICAgZktleXMuc29ydCgpO1xyXG4gICAgICAgIGZvciAobGV0IGZrZXkgb2YgZktleXMpIHtcclxuICAgICAgICAgICAgY29kZSArPSAnICAgICcgKyB0aGlzLmZpZWxkcy5nZXQoZmtleSkudG9UUygpICsgJ1xcbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvZGUgKz0gJ1xcbic7XHJcbiAgICAgICAgbGV0IG1LZXlzID0gWy4uLnRoaXMubWV0aG9kcy5rZXlzKCldO1xyXG4gICAgICAgIG1LZXlzLnNvcnQoKTtcclxuICAgICAgICBmb3IgKGxldCBtS2V5IG9mIG1LZXlzKSB7XHJcbiAgICAgICAgICAgIGNvZGUgKz0gJyAgICAnICsgdGhpcy5tZXRob2RzLmdldChtS2V5KS50b1RTKCkgKyAnXFxuJztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29kZSArPSAnfSc7XHJcbiAgICAgICAgcmV0dXJuIGNvZGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEZpZWxkIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHR5cGU6IHN0cmluZztcclxuICAgIGlzU3RhdGljOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSwgaXNTdGF0aWM6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuaXNTdGF0aWMgPSBpc1N0YXRpYztcclxuICAgICAgICB0aGlzLnR5cGUgPSAnYW55JztcclxuICAgICAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSB0eXBlb2YodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0b1RTKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgJHt0aGlzLmlzU3RhdGljID8gJ3N0YXRpYyAnIDogJyd9JHt0aGlzLm5hbWV9OiAke3RoaXMudHlwZX07YDtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgTWV0aG9kIHtcclxuXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgU1RSSVBfQ09NTUVOVFMgPSAvKFxcL1xcLy4qJCl8KFxcL1xcKltcXHNcXFNdKj9cXCpcXC8pfChcXHMqPVteLFxcKV0qKCgnKD86XFxcXCd8W14nXFxyXFxuXSkqJyl8KFwiKD86XFxcXFwifFteXCJcXHJcXG5dKSpcIikpfChcXHMqPVteLFxcKV0qKSkvbWc7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgQVJHVU1FTlRfTkFNRVMgPSAvKFteXFxzLF0rKS9nO1xyXG5cclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHBhcmFtTmFtZXM6IHN0cmluZ1tdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgZnVuYzogRnVuY3Rpb24pIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMucGFyYW1OYW1lcyA9IHRoaXMuZ2V0UGFyYW1OYW1lcyhmdW5jKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQYXJhbU5hbWVzKGZ1bmM6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdmFyIGZuU3RyID0gZnVuYy50b1N0cmluZygpLnJlcGxhY2UoTWV0aG9kLlNUUklQX0NPTU1FTlRTLCAnJyk7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZuU3RyLnNsaWNlKGZuU3RyLmluZGV4T2YoJygnKSsxLCBmblN0ci5pbmRleE9mKCcpJykpLm1hdGNoKE1ldGhvZC5BUkdVTUVOVF9OQU1FUyk7XHJcbiAgICAgICAgaWYocmVzdWx0ID09PSBudWxsKVxyXG4gICAgICAgICAgICByZXN1bHQgPSBbXTtcclxuICAgICAgICByZXN1bHQgPSByZXN1bHQuZmlsdGVyKHBhcmFtID0+IHBhcmFtLm1hdGNoKC9eW2EtekEtWl8kXVswLTlhLXpBLVpfJF0qJC8pKVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdG9UUygpIDogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBvdmVycmlkZSA9IHRoaXMuY2hlY2tPdmVycmlkZSgpO1xyXG4gICAgICAgIGlmIChvdmVycmlkZSkgcmV0dXJuIG92ZXJyaWRlO1xyXG4gICAgICAgIGxldCBjb2RlID0gYCR7dGhpcy5uYW1lfShgO1xyXG4gICAgICAgIGxldCBmaXJzdCA9IHRydWU7XHJcbiAgICAgICAgZm9yIChsZXQgbmFtZSBvZiB0aGlzLnBhcmFtTmFtZXMpIHtcclxuICAgICAgICAgICAgaWYgKCFmaXJzdCkgY29kZSArPSAnLCAnO1xyXG4gICAgICAgICAgICBmaXJzdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjb2RlICs9IGAke25hbWV9PzogYW55YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29kZSArPSAnKTsnO1xyXG4gICAgICAgIHJldHVybiBjb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrT3ZlcnJpZGUoKSB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLm5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSAnY2hpbGRUaGF0SXNBJzogcmV0dXJuIGAke3RoaXMubmFtZX0oLi4uYXJnczogYW55W10pO2BcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBTbmFwVHlwZXMgfSBmcm9tIFwiLi9TbmFwVHlwZXNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTbmFwSGVscGVyIHtcclxuXHJcbiAgICBwcml2YXRlIF9zbmFwID0gbmV3IFNuYXBUeXBlcygpO1xyXG5cclxuICAgIHNuYXAoKSA6IFNuYXBUeXBlcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NuYXA7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IElERV9Nb3JwaCwgU3RhZ2VNb3JwaCwgV29ybGRNb3JwaCB9IGZyb20gXCIuL1NuYXBcIjtcclxuXHJcblxyXG4vLyBUT0RPOiBNYWtlIGFuIGludGVyZmFjZSB3aXRoIGFuIGltcGxlbWVudGF0aW9uIHRoYXQgZmV0Y2hlcyBmcm9tIHdpbmRvd1xyXG5leHBvcnQgY2xhc3MgU25hcFR5cGVzIHtcclxuICAgIHdvcmxkKCkgOiBXb3JsZE1vcnBoIHtcclxuICAgICAgICByZXR1cm4gd2luZG93W1wid29ybGRcIl07XHJcbiAgICB9XHJcblxyXG4gICAgSURFKCkgOiBJREVfTW9ycGgge1xyXG4gICAgICAgIHJldHVybiB0aGlzLndvcmxkKCkuY2hpbGRUaGF0SXNBKHdpbmRvd1snSURFX01vcnBoJ10pIGFzIElERV9Nb3JwaDtcclxuICAgIH1cclxuXHJcbiAgICBzdGFnZSgpIDogU3RhZ2VNb3JwaCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuSURFKCkuc3RhZ2U7XHJcbiAgICB9XHJcblxyXG59IiwiZXhwb3J0IGNvbnN0IG5vcCA9IHdpbmRvd1snbm9wJ107XHJcbmV4cG9ydCBjb25zdCBuZXdHdWlkID0gd2luZG93WyduZXdHdWlkJ107XHJcbmV4cG9ydCBjb25zdCBsb2NhbGl6ZSA9IHdpbmRvd1snbG9jYWxpemUnXTtcclxuZXhwb3J0IGNvbnN0IGlzTmlsID0gd2luZG93Wydpc05pbCddO1xyXG5leHBvcnQgY29uc3QgY29udGFpbnMgPSB3aW5kb3dbJ2NvbnRhaW5zJ107XHJcbmV4cG9ydCBjb25zdCBkZXRlY3QgPSB3aW5kb3dbJ2RldGVjdCddO1xyXG5leHBvcnQgY29uc3Qgc2l6ZU9mID0gd2luZG93WydzaXplT2YnXTtcclxuZXhwb3J0IGNvbnN0IGlzU3RyaW5nID0gd2luZG93Wydpc1N0cmluZyddO1xyXG5leHBvcnQgY29uc3QgaXNPYmplY3QgPSB3aW5kb3dbJ2lzT2JqZWN0J107XHJcbmV4cG9ydCBjb25zdCByYWRpYW5zID0gd2luZG93WydyYWRpYW5zJ107XHJcbmV4cG9ydCBjb25zdCBkZWdyZWVzID0gd2luZG93WydkZWdyZWVzJ107XHJcbmV4cG9ydCBjb25zdCBmb250SGVpZ2h0ID0gd2luZG93Wydmb250SGVpZ2h0J107XHJcbmV4cG9ydCBjb25zdCBpc1dvcmRDaGFyID0gd2luZG93Wydpc1dvcmRDaGFyJ107XHJcbmV4cG9ydCBjb25zdCBpc1VSTENoYXIgPSB3aW5kb3dbJ2lzVVJMQ2hhciddO1xyXG5leHBvcnQgY29uc3QgaXNVUkwgPSB3aW5kb3dbJ2lzVVJMJ107XHJcbmV4cG9ydCBjb25zdCBuZXdDYW52YXMgPSB3aW5kb3dbJ25ld0NhbnZhcyddO1xyXG5leHBvcnQgY29uc3QgY29weUNhbnZhcyA9IHdpbmRvd1snY29weUNhbnZhcyddO1xyXG5leHBvcnQgY29uc3QgZ2V0TWluaW11bUZvbnRIZWlnaHQgPSB3aW5kb3dbJ2dldE1pbmltdW1Gb250SGVpZ2h0J107XHJcbmV4cG9ydCBjb25zdCBnZXREb2N1bWVudFBvc2l0aW9uT2YgPSB3aW5kb3dbJ2dldERvY3VtZW50UG9zaXRpb25PZiddO1xyXG5leHBvcnQgY29uc3QgY29weSA9IHdpbmRvd1snY29weSddO1xyXG5leHBvcnQgY29uc3QgZW1iZWRNZXRhZGF0YVBORyA9IHdpbmRvd1snZW1iZWRNZXRhZGF0YVBORyddO1xyXG5leHBvcnQgY29uc3QgZW5hYmxlUmV0aW5hU3VwcG9ydCA9IHdpbmRvd1snZW5hYmxlUmV0aW5hU3VwcG9ydCddO1xyXG5leHBvcnQgY29uc3QgaXNSZXRpbmFTdXBwb3J0ZWQgPSB3aW5kb3dbJ2lzUmV0aW5hU3VwcG9ydGVkJ107XHJcbmV4cG9ydCBjb25zdCBpc1JldGluYUVuYWJsZWQgPSB3aW5kb3dbJ2lzUmV0aW5hRW5hYmxlZCddO1xyXG5leHBvcnQgY29uc3QgZGlzYWJsZVJldGluYVN1cHBvcnQgPSB3aW5kb3dbJ2Rpc2FibGVSZXRpbmFTdXBwb3J0J107XHJcbmV4cG9ydCBjb25zdCBub3JtYWxpemVDYW52YXMgPSB3aW5kb3dbJ25vcm1hbGl6ZUNhbnZhcyddO1xyXG5leHBvcnQgY29uc3QgQW5pbWF0aW9uID0gd2luZG93WydBbmltYXRpb24nXTtcclxuZXhwb3J0IGNvbnN0IENvbG9yID0gd2luZG93WydDb2xvciddO1xyXG5leHBvcnQgY29uc3QgUG9pbnQgPSB3aW5kb3dbJ1BvaW50J107XHJcbmV4cG9ydCBjb25zdCBSZWN0YW5nbGUgPSB3aW5kb3dbJ1JlY3RhbmdsZSddO1xyXG5leHBvcnQgY29uc3QgTm9kZSA9IHdpbmRvd1snTm9kZSddO1xyXG5leHBvcnQgY29uc3QgTW9ycGggPSB3aW5kb3dbJ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBXb3JsZE1vcnBoID0gd2luZG93WydXb3JsZE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBIYW5kTW9ycGggPSB3aW5kb3dbJ0hhbmRNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU2hhZG93TW9ycGggPSB3aW5kb3dbJ1NoYWRvd01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBGcmFtZU1vcnBoID0gd2luZG93WydGcmFtZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBNZW51TW9ycGggPSB3aW5kb3dbJ01lbnVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgSGFuZGxlTW9ycGggPSB3aW5kb3dbJ0hhbmRsZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTdHJpbmdGaWVsZE1vcnBoID0gd2luZG93WydTdHJpbmdGaWVsZE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDb2xvclBpY2tlck1vcnBoID0gd2luZG93WydDb2xvclBpY2tlck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTbGlkZXJNb3JwaCA9IHdpbmRvd1snU2xpZGVyTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNjcm9sbEZyYW1lTW9ycGggPSB3aW5kb3dbJ1Njcm9sbEZyYW1lTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEluc3BlY3Rvck1vcnBoID0gd2luZG93WydJbnNwZWN0b3JNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU3RyaW5nTW9ycGggPSB3aW5kb3dbJ1N0cmluZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBUZXh0TW9ycGggPSB3aW5kb3dbJ1RleHRNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUGVuTW9ycGggPSB3aW5kb3dbJ1Blbk1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDb2xvclBhbGV0dGVNb3JwaCA9IHdpbmRvd1snQ29sb3JQYWxldHRlTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEdyYXlQYWxldHRlTW9ycGggPSB3aW5kb3dbJ0dyYXlQYWxldHRlTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJsaW5rZXJNb3JwaCA9IHdpbmRvd1snQmxpbmtlck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDdXJzb3JNb3JwaCA9IHdpbmRvd1snQ3Vyc29yTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJveE1vcnBoID0gd2luZG93WydCb3hNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU3BlZWNoQnViYmxlTW9ycGggPSB3aW5kb3dbJ1NwZWVjaEJ1YmJsZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBEaWFsTW9ycGggPSB3aW5kb3dbJ0RpYWxNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQ2lyY2xlQm94TW9ycGggPSB3aW5kb3dbJ0NpcmNsZUJveE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTbGlkZXJCdXR0b25Nb3JwaCA9IHdpbmRvd1snU2xpZGVyQnV0dG9uTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IE1vdXNlU2Vuc29yTW9ycGggPSB3aW5kb3dbJ01vdXNlU2Vuc29yTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IExpc3RNb3JwaCA9IHdpbmRvd1snTGlzdE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBUcmlnZ2VyTW9ycGggPSB3aW5kb3dbJ1RyaWdnZXJNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgTWVudUl0ZW1Nb3JwaCA9IHdpbmRvd1snTWVudUl0ZW1Nb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQm91bmNlck1vcnBoID0gd2luZG93WydCb3VuY2VyTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFN5bWJvbE1vcnBoID0gd2luZG93WydTeW1ib2xNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUHVzaEJ1dHRvbk1vcnBoID0gd2luZG93WydQdXNoQnV0dG9uTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFRvZ2dsZUJ1dHRvbk1vcnBoID0gd2luZG93WydUb2dnbGVCdXR0b25Nb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVGFiTW9ycGggPSB3aW5kb3dbJ1RhYk1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBUb2dnbGVNb3JwaCA9IHdpbmRvd1snVG9nZ2xlTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFRvZ2dsZUVsZW1lbnRNb3JwaCA9IHdpbmRvd1snVG9nZ2xlRWxlbWVudE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBEaWFsb2dCb3hNb3JwaCA9IHdpbmRvd1snRGlhbG9nQm94TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEFsaWdubWVudE1vcnBoID0gd2luZG93WydBbGlnbm1lbnRNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgSW5wdXRGaWVsZE1vcnBoID0gd2luZG93WydJbnB1dEZpZWxkTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFBpYW5vTWVudU1vcnBoID0gd2luZG93WydQaWFub01lbnVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUGlhbm9LZXlNb3JwaCA9IHdpbmRvd1snUGlhbm9LZXlNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU3ludGF4RWxlbWVudE1vcnBoID0gd2luZG93WydTeW50YXhFbGVtZW50TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJsb2NrTW9ycGggPSB3aW5kb3dbJ0Jsb2NrTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJsb2NrTGFiZWxNb3JwaCA9IHdpbmRvd1snQmxvY2tMYWJlbE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja1N5bWJvbE1vcnBoID0gd2luZG93WydCbG9ja1N5bWJvbE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDb21tYW5kQmxvY2tNb3JwaCA9IHdpbmRvd1snQ29tbWFuZEJsb2NrTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFJlcG9ydGVyQmxvY2tNb3JwaCA9IHdpbmRvd1snUmVwb3J0ZXJCbG9ja01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTY3JpcHRzTW9ycGggPSB3aW5kb3dbJ1NjcmlwdHNNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQXJnTW9ycGggPSB3aW5kb3dbJ0FyZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDb21tYW5kU2xvdE1vcnBoID0gd2luZG93WydDb21tYW5kU2xvdE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBDU2xvdE1vcnBoID0gd2luZG93WydDU2xvdE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBJbnB1dFNsb3RNb3JwaCA9IHdpbmRvd1snSW5wdXRTbG90TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IElucHV0U2xvdFN0cmluZ01vcnBoID0gd2luZG93WydJbnB1dFNsb3RTdHJpbmdNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgSW5wdXRTbG90VGV4dE1vcnBoID0gd2luZG93WydJbnB1dFNsb3RUZXh0TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJvb2xlYW5TbG90TW9ycGggPSB3aW5kb3dbJ0Jvb2xlYW5TbG90TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEFycm93TW9ycGggPSB3aW5kb3dbJ0Fycm93TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IENvbG9yU2xvdE1vcnBoID0gd2luZG93WydDb2xvclNsb3RNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgSGF0QmxvY2tNb3JwaCA9IHdpbmRvd1snSGF0QmxvY2tNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQmxvY2tIaWdobGlnaHRNb3JwaCA9IHdpbmRvd1snQmxvY2tIaWdobGlnaHRNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgTXVsdGlBcmdNb3JwaCA9IHdpbmRvd1snTXVsdGlBcmdNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVGVtcGxhdGVTbG90TW9ycGggPSB3aW5kb3dbJ1RlbXBsYXRlU2xvdE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBGdW5jdGlvblNsb3RNb3JwaCA9IHdpbmRvd1snRnVuY3Rpb25TbG90TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFJlcG9ydGVyU2xvdE1vcnBoID0gd2luZG93WydSZXBvcnRlclNsb3RNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUmluZ01vcnBoID0gd2luZG93WydSaW5nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFJpbmdDb21tYW5kU2xvdE1vcnBoID0gd2luZG93WydSaW5nQ29tbWFuZFNsb3RNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUmluZ1JlcG9ydGVyU2xvdE1vcnBoID0gd2luZG93WydSaW5nUmVwb3J0ZXJTbG90TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IENvbW1lbnRNb3JwaCA9IHdpbmRvd1snQ29tbWVudE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBBcmdMYWJlbE1vcnBoID0gd2luZG93WydBcmdMYWJlbE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBUZXh0U2xvdE1vcnBoID0gd2luZG93WydUZXh0U2xvdE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTY3JpcHRGb2N1c01vcnBoID0gd2luZG93WydTY3JpcHRGb2N1c01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBUaHJlYWRNYW5hZ2VyID0gd2luZG93WydUaHJlYWRNYW5hZ2VyJ107XHJcbmV4cG9ydCBjb25zdCBQcm9jZXNzID0gd2luZG93WydQcm9jZXNzJ107XHJcbmV4cG9ydCBjb25zdCBDb250ZXh0ID0gd2luZG93WydDb250ZXh0J107XHJcbmV4cG9ydCBjb25zdCBWYXJpYWJsZSA9IHdpbmRvd1snVmFyaWFibGUnXTtcclxuZXhwb3J0IGNvbnN0IFZhcmlhYmxlRnJhbWUgPSB3aW5kb3dbJ1ZhcmlhYmxlRnJhbWUnXTtcclxuZXhwb3J0IGNvbnN0IEpTQ29tcGlsZXIgPSB3aW5kb3dbJ0pTQ29tcGlsZXInXTtcclxuZXhwb3J0IGNvbnN0IHNuYXBFcXVhbHMgPSB3aW5kb3dbJ3NuYXBFcXVhbHMnXTtcclxuZXhwb3J0IGNvbnN0IGludm9rZSA9IHdpbmRvd1snaW52b2tlJ107XHJcbmV4cG9ydCBjb25zdCBTcHJpdGVNb3JwaCA9IHdpbmRvd1snU3ByaXRlTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFN0YWdlTW9ycGggPSB3aW5kb3dbJ1N0YWdlTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNwcml0ZUJ1YmJsZU1vcnBoID0gd2luZG93WydTcHJpdGVCdWJibGVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQ29zdHVtZSA9IHdpbmRvd1snQ29zdHVtZSddO1xyXG5leHBvcnQgY29uc3QgU1ZHX0Nvc3R1bWUgPSB3aW5kb3dbJ1NWR19Db3N0dW1lJ107XHJcbmV4cG9ydCBjb25zdCBDb3N0dW1lRWRpdG9yTW9ycGggPSB3aW5kb3dbJ0Nvc3R1bWVFZGl0b3JNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU291bmQgPSB3aW5kb3dbJ1NvdW5kJ107XHJcbmV4cG9ydCBjb25zdCBOb3RlID0gd2luZG93WydOb3RlJ107XHJcbmV4cG9ydCBjb25zdCBNaWNyb3Bob25lID0gd2luZG93WydNaWNyb3Bob25lJ107XHJcbmV4cG9ydCBjb25zdCBDZWxsTW9ycGggPSB3aW5kb3dbJ0NlbGxNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgV2F0Y2hlck1vcnBoID0gd2luZG93WydXYXRjaGVyTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFN0YWdlUHJvbXB0ZXJNb3JwaCA9IHdpbmRvd1snU3RhZ2VQcm9tcHRlck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTcHJpdGVIaWdobGlnaHRNb3JwaCA9IHdpbmRvd1snU3ByaXRlSGlnaGxpZ2h0TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFN0YWdlUGlja2VyTW9ycGggPSB3aW5kb3dbJ1N0YWdlUGlja2VyTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFN0YWdlUGlja2VySXRlbU1vcnBoID0gd2luZG93WydTdGFnZVBpY2tlckl0ZW1Nb3JwaCddO1xyXG5leHBvcnQgY29uc3QgaXNTbmFwT2JqZWN0ID0gd2luZG93Wydpc1NuYXBPYmplY3QnXTtcclxuZXhwb3J0IGNvbnN0IFByb2plY3QgPSB3aW5kb3dbJ1Byb2plY3QnXTtcclxuZXhwb3J0IGNvbnN0IFNjZW5lID0gd2luZG93WydTY2VuZSddO1xyXG5leHBvcnQgY29uc3QgSURFX01vcnBoID0gd2luZG93WydJREVfTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFByb2plY3REaWFsb2dNb3JwaCA9IHdpbmRvd1snUHJvamVjdERpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBMaWJyYXJ5SW1wb3J0RGlhbG9nTW9ycGggPSB3aW5kb3dbJ0xpYnJhcnlJbXBvcnREaWFsb2dNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU3ByaXRlSWNvbk1vcnBoID0gd2luZG93WydTcHJpdGVJY29uTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IENvc3R1bWVJY29uTW9ycGggPSB3aW5kb3dbJ0Nvc3R1bWVJY29uTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFR1cnRsZUljb25Nb3JwaCA9IHdpbmRvd1snVHVydGxlSWNvbk1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBXYXJkcm9iZU1vcnBoID0gd2luZG93WydXYXJkcm9iZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTb3VuZEljb25Nb3JwaCA9IHdpbmRvd1snU291bmRJY29uTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEp1a2Vib3hNb3JwaCA9IHdpbmRvd1snSnVrZWJveE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTY2VuZUljb25Nb3JwaCA9IHdpbmRvd1snU2NlbmVJY29uTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFNjZW5lQWxidW1Nb3JwaCA9IHdpbmRvd1snU2NlbmVBbGJ1bU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBTdGFnZUhhbmRsZU1vcnBoID0gd2luZG93WydTdGFnZUhhbmRsZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBQYWxldHRlSGFuZGxlTW9ycGggPSB3aW5kb3dbJ1BhbGV0dGVIYW5kbGVNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQ2FtU25hcHNob3REaWFsb2dNb3JwaCA9IHdpbmRvd1snQ2FtU25hcHNob3REaWFsb2dNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgU291bmRSZWNvcmRlckRpYWxvZ01vcnBoID0gd2luZG93WydTb3VuZFJlY29yZGVyRGlhbG9nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFByb2plY3RSZWNvdmVyeURpYWxvZ01vcnBoID0gd2luZG93WydQcm9qZWN0UmVjb3ZlcnlEaWFsb2dNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUGFpbnRFZGl0b3JNb3JwaCA9IHdpbmRvd1snUGFpbnRFZGl0b3JNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUGFpbnRDYW52YXNNb3JwaCA9IHdpbmRvd1snUGFpbnRDYW52YXNNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgUGFpbnRDb2xvclBpY2tlck1vcnBoID0gd2luZG93WydQYWludENvbG9yUGlja2VyTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IExpc3QgPSB3aW5kb3dbJ0xpc3QnXTtcclxuZXhwb3J0IGNvbnN0IExpc3RXYXRjaGVyTW9ycGggPSB3aW5kb3dbJ0xpc3RXYXRjaGVyTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEN1c3RvbUJsb2NrRGVmaW5pdGlvbiA9IHdpbmRvd1snQ3VzdG9tQmxvY2tEZWZpbml0aW9uJ107XHJcbmV4cG9ydCBjb25zdCBDdXN0b21Db21tYW5kQmxvY2tNb3JwaCA9IHdpbmRvd1snQ3VzdG9tQ29tbWFuZEJsb2NrTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEN1c3RvbVJlcG9ydGVyQmxvY2tNb3JwaCA9IHdpbmRvd1snQ3VzdG9tUmVwb3J0ZXJCbG9ja01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja0RpYWxvZ01vcnBoID0gd2luZG93WydCbG9ja0RpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja0VkaXRvck1vcnBoID0gd2luZG93WydCbG9ja0VkaXRvck1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBQcm90b3R5cGVIYXRCbG9ja01vcnBoID0gd2luZG93WydQcm90b3R5cGVIYXRCbG9ja01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja0xhYmVsRnJhZ21lbnQgPSB3aW5kb3dbJ0Jsb2NrTGFiZWxGcmFnbWVudCddO1xyXG5leHBvcnQgY29uc3QgQmxvY2tMYWJlbEZyYWdtZW50TW9ycGggPSB3aW5kb3dbJ0Jsb2NrTGFiZWxGcmFnbWVudE1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja0lucHV0RnJhZ21lbnRNb3JwaCA9IHdpbmRvd1snQmxvY2tJbnB1dEZyYWdtZW50TW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJsb2NrTGFiZWxQbGFjZUhvbGRlck1vcnBoID0gd2luZG93WydCbG9ja0xhYmVsUGxhY2VIb2xkZXJNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgSW5wdXRTbG90RGlhbG9nTW9ycGggPSB3aW5kb3dbJ0lucHV0U2xvdERpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBWYXJpYWJsZURpYWxvZ01vcnBoID0gd2luZG93WydWYXJpYWJsZURpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBKYWdnZWRCbG9ja01vcnBoID0gd2luZG93WydKYWdnZWRCbG9ja01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja0V4cG9ydERpYWxvZ01vcnBoID0gd2luZG93WydCbG9ja0V4cG9ydERpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja0ltcG9ydERpYWxvZ01vcnBoID0gd2luZG93WydCbG9ja0ltcG9ydERpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBCbG9ja1JlbW92YWxEaWFsb2dNb3JwaCA9IHdpbmRvd1snQmxvY2tSZW1vdmFsRGlhbG9nTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IEJsb2NrVmlzaWJpbGl0eURpYWxvZ01vcnBoID0gd2luZG93WydCbG9ja1Zpc2liaWxpdHlEaWFsb2dNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVGFibGUgPSB3aW5kb3dbJ1RhYmxlJ107XHJcbmV4cG9ydCBjb25zdCBUYWJsZUNlbGxNb3JwaCA9IHdpbmRvd1snVGFibGVDZWxsTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFRhYmxlTW9ycGggPSB3aW5kb3dbJ1RhYmxlTW9ycGgnXTtcclxuZXhwb3J0IGNvbnN0IFRhYmxlRnJhbWVNb3JwaCA9IHdpbmRvd1snVGFibGVGcmFtZU1vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBUYWJsZURpYWxvZ01vcnBoID0gd2luZG93WydUYWJsZURpYWxvZ01vcnBoJ107XHJcbmV4cG9ydCBjb25zdCBWZWN0b3JTaGFwZSA9IHdpbmRvd1snVmVjdG9yU2hhcGUnXTtcclxuZXhwb3J0IGNvbnN0IFZlY3RvclJlY3RhbmdsZSA9IHdpbmRvd1snVmVjdG9yUmVjdGFuZ2xlJ107XHJcbmV4cG9ydCBjb25zdCBWZWN0b3JMaW5lID0gd2luZG93WydWZWN0b3JMaW5lJ107XHJcbmV4cG9ydCBjb25zdCBWZWN0b3JFbGxpcHNlID0gd2luZG93WydWZWN0b3JFbGxpcHNlJ107XHJcbmV4cG9ydCBjb25zdCBWZWN0b3JQb2x5Z29uID0gd2luZG93WydWZWN0b3JQb2x5Z29uJ107XHJcbmV4cG9ydCBjb25zdCBWZWN0b3JTZWxlY3Rpb24gPSB3aW5kb3dbJ1ZlY3RvclNlbGVjdGlvbiddO1xyXG5leHBvcnQgY29uc3QgVmVjdG9yUGFpbnRFZGl0b3JNb3JwaCA9IHdpbmRvd1snVmVjdG9yUGFpbnRFZGl0b3JNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgVmVjdG9yUGFpbnRDYW52YXNNb3JwaCA9IHdpbmRvd1snVmVjdG9yUGFpbnRDYW52YXNNb3JwaCddO1xyXG5leHBvcnQgY29uc3QgQ3Jvc3NoYWlyID0gd2luZG93WydDcm9zc2hhaXInXTtcclxuZXhwb3J0IGNvbnN0IFZpZGVvTW90aW9uID0gd2luZG93WydWaWRlb01vdGlvbiddO1xyXG5leHBvcnQgY29uc3QgV29ybGRNYXAgPSB3aW5kb3dbJ1dvcmxkTWFwJ107XHJcbmV4cG9ydCBjb25zdCBSZWFkU3RyZWFtID0gd2luZG93WydSZWFkU3RyZWFtJ107XHJcbmV4cG9ydCBjb25zdCBYTUxfRWxlbWVudCA9IHdpbmRvd1snWE1MX0VsZW1lbnQnXTtcclxuZXhwb3J0IGNvbnN0IFhNTF9TZXJpYWxpemVyID0gd2luZG93WydYTUxfU2VyaWFsaXplciddO1xyXG5leHBvcnQgY29uc3QgU25hcFNlcmlhbGl6ZXIgPSB3aW5kb3dbJ1NuYXBTZXJpYWxpemVyJ107XHJcbmV4cG9ydCBjb25zdCBMb2NhbGl6ZXIgPSB3aW5kb3dbJ0xvY2FsaXplciddO1xyXG5leHBvcnQgY29uc3QgQ2xvdWQgPSB3aW5kb3dbJ0Nsb3VkJ107XHJcbmV4cG9ydCBjb25zdCBTbmFwRXZlbnRNYW5hZ2VyID0gd2luZG93WydTbmFwRXZlbnRNYW5hZ2VyJ107XHJcbmV4cG9ydCBjb25zdCBoZXhfc2hhNTEyID0gd2luZG93WydoZXhfc2hhNTEyJ107XHJcbmV4cG9ydCBjb25zdCBtID0gd2luZG93WydtJ107XHJcbmV4cG9ydCBjb25zdCBsb29wID0gd2luZG93Wydsb29wJ107IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==