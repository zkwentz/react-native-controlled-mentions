"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentionInput = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const utils_1 = require("../utils");
const MentionInput = (_a) => {
    var { value, onChange, partTypes = [], inputRef: propInputRef, containerStyle, onSelectionChange } = _a, textInputProps = __rest(_a, ["value", "onChange", "partTypes", "inputRef", "containerStyle", "onSelectionChange"]);
    const textInput = react_1.useRef(null);
    const [selection, setSelection] = react_1.useState({ start: 0, end: 0 });
    const { plainText, parts, } = react_1.useMemo(() => utils_1.parseValue(value, partTypes), [value, partTypes]);
    const handleSelectionChange = (event) => {
        setSelection(event.nativeEvent.selection);
        onSelectionChange && onSelectionChange(event);
    };
    /**
     * Callback that trigger on TextInput text change
     *
     * @param changedText
     */
    const onChangeInput = (changedText) => {
        onChange(utils_1.generateValueFromPartsAndChangedText(parts, plainText, changedText));
    };
    /**
     * We memoize the keyword to know should we show mention suggestions or not.
     * If keyword is undefined then we don't tracking mention typing and shouldn't show suggestions.
     * If keyword is not undefined (even empty string '') then we are tracking mention typing.
     *
     * Examples where @name is just plain text yet, not mention:
     * '|abc @name dfg' - keyword is undefined
     * 'abc @| dfg' - keyword is ''
     * 'abc @name| dfg' - keyword is 'name'
     * 'abc @na|me dfg' - keyword is 'na'
     * 'abc @|name dfg' - keyword is against ''
     * 'abc @name |dfg' - keyword is against undefined'
     */
    const keywordByTrigger = react_1.useMemo(() => {
        const newKeywordByTrigger = {};
        partTypes.filter(utils_1.isMentionPartType).forEach((mentionPartType) => {
            if (selection.end != selection.start) {
                return undefined;
            }
            if (parts.some(one => one.data != null && selection.end >= one.position.start && selection.end <= one.position.end)) {
                return undefined;
            }
            const triggerIndex = plainText.lastIndexOf(mentionPartType.trigger, selection.end);
            const spaceIndex = plainText.lastIndexOf(' ', selection.end - 1);
            const newLineIndex = plainText.lastIndexOf('\n', selection.end - 1);
            switch (true) {
                case triggerIndex == -1:
                    return undefined;
                case triggerIndex === selection.end:
                    return undefined;
                case triggerIndex < spaceIndex:
                    return undefined;
                // When we have a mention at the very beginning of text
                case spaceIndex == -1 && newLineIndex == -1:
                // When we have a mention on the new line
                case newLineIndex + 1 === triggerIndex:
                // When we have a mention just after space
                case spaceIndex + 1 === triggerIndex:
                    newKeywordByTrigger[mentionPartType.trigger] = plainText.substring(triggerIndex + 1, selection.end);
            }
        });
        return newKeywordByTrigger;
    }, [parts, plainText, selection, partTypes]);
    /**
     * Callback on mention suggestion press. We should:
     * - Get updated value
     * - Trigger onChange callback with new value
     */
    const onSuggestionPress = (mentionType) => (suggestion) => {
        const newValue = utils_1.generateValueWithAddedSuggestion(parts, mentionType, plainText, selection, suggestion);
        if (!newValue) {
            return;
        }
        onChange(newValue);
        /**
         * Move cursor to the end of just added mention starting from trigger string and including:
         * - Length of trigger string
         * - Length of mention name
         * - Length of space after mention (1)
         *
         * Not working now due to the RN bug
         */
        // const newCursorPosition = currentPart.position.start + triggerPartIndex + trigger.length +
        // suggestion.name.length + 1;
        // textInput.current?.setNativeProps({selection: {start: newCursorPosition, end: newCursorPosition}});
    };
    const handleTextInputRef = (ref) => {
        textInput.current = ref;
        if (propInputRef) {
            if (typeof propInputRef === 'function') {
                propInputRef(ref);
            }
            else {
                propInputRef.current = ref;
            }
        }
    };
    return (react_1.default.createElement(react_native_1.View, { style: containerStyle },
        partTypes
            .filter(one => utils_1.isMentionPartType(one) && one.renderSuggestions != null)
            .map((mentionType) => (react_1.default.createElement(react_1.default.Fragment, { key: mentionType.trigger }, mentionType.renderSuggestions && mentionType.renderSuggestions({
            keyword: keywordByTrigger[mentionType.trigger],
            onSuggestionPress: onSuggestionPress(mentionType),
        })))),
        react_1.default.createElement(react_native_1.TextInput, Object.assign({}, textInputProps, { ref: handleTextInputRef, multiline: true, onChangeText: onChangeInput, onSelectionChange: handleSelectionChange }),
            react_1.default.createElement(react_native_1.Text, null, parts.map(({ text, partType, data }, index) => {
                var _a, _b;
                return partType ? (react_1.default.createElement(react_native_1.Text, { key: `${index}-${(_a = data === null || data === void 0 ? void 0 : data.trigger) !== null && _a !== void 0 ? _a : 'pattern'}`, style: (_b = partType.textStyle) !== null && _b !== void 0 ? _b : utils_1.defaultMentionTextStyle }, text)) : (react_1.default.createElement(react_native_1.Text, { key: index }, text));
            })))));
};
exports.MentionInput = MentionInput;
//# sourceMappingURL=mention-input.js.map