import { ReactNode, Ref } from 'react';
import { StyleProp, TextInput, TextInputProps, TextStyle, ViewStyle } from 'react-native';
declare type Suggestion = {
    id: string;
    name: string;
};
declare type MentionData = {
    original: string;
    trigger: string;
    name: string;
    id: string;
};
declare type RegexMatchResult = {
    0: string;
    index: number;
    groups: MentionData;
};
declare type Position = {
    start: number;
    end: number;
};
declare type MentionSuggestionsProps = {
    keyword: string | undefined;
    onSuggestionPress: (suggestion: Suggestion) => void;
};
declare type MentionPartType = {
    trigger: string;
    renderSuggestions?: (props: MentionSuggestionsProps) => ReactNode;
    isInsertSpaceAfterMention?: boolean;
    textStyle?: StyleProp<TextStyle>;
    getPlainString?: (mention: MentionData) => string;
};
declare type PatternPartType = {
    pattern: RegExp;
    textStyle?: StyleProp<TextStyle>;
};
declare type PartType = MentionPartType | PatternPartType;
declare type Part = {
    text: string;
    position: Position;
    partType?: PartType;
    data?: MentionData;
};
declare type MentionInputProps = Omit<TextInputProps, 'onChange'> & {
    value: string;
    onChange: (value: string) => any;
    partTypes?: PartType[];
    inputRef?: Ref<TextInput>;
    containerStyle?: StyleProp<ViewStyle>;
};
export { Suggestion, MentionData, RegexMatchResult, Position, Part, MentionSuggestionsProps, MentionPartType, PatternPartType, PartType, MentionInputProps, };
