import { Base } from "./Base";

type LostArkClasses = {
    [key: string]: {
        firstEngraving: string;
        secondEngraving: string;
    };
};

export type CharacterType = {
    table: string;
};

export type CharacterContent = {};

export type CharacterJSON = {};

class Character extends Base<CharacterType, CharacterContent, CharacterJSON> {
    classes: LostArkClasses = {};

    static loadEngravings = () => {};

    static setUp = () => {};
}
