const ENGLISH_REGEX = /^[\s\w\d\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]*$/;

export const isEnglish = (text: string): boolean => {
    return ENGLISH_REGEX.test(text);
}