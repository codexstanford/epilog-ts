function isAlpha(str) {
    return new RegExp("^[A-Za-z]+$").test(str);
}
function isEpilogConstant(str) {
    // Either a string of lower case letters, digits, underscores, and periods, or
    // anything within double quotes
    return new RegExp("(^[a-z0-9_.]+$)|(\".*\")").test(str);
}
function isEpilogVariable(str) {
    // Either a a lone underscore or
    // a string of letters, digits, and underscores beginning with an uppercase letter
    return new RegExp("(^_$)|(^[A-Z][A-Za-z0-9_]*$)").test(str);
}
export { isAlpha, isEpilogConstant, isEpilogVariable };
//# sourceMappingURL=string-utils.js.map