"use strict";
/**
 * Same behavior as `underscore.string` slugify (v3.3.x): cleanDiacritics, replace
 * non-word chars except whitespace and hyphen, lowercase, dasherize, trim hyphens.
 * @see https://github.com/esamattis/underscore.string/blob/master/slugify.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.underscoreStringSlugify = underscoreStringSlugify;
function cleanDiacritics(str) {
    let from = "ąàáäâãåæăćčĉęèéëêĝĥìíïîĵłľńňòóöőôõðøśșşšŝťțţŭùúüűûñÿýçżźž";
    let to = "aaaaaaaaaccceeeeeghiiiijllnnoooooooossssstttuuuuuunyyczzz";
    from += from.toUpperCase();
    to += to.toUpperCase();
    const toChars = to.split("");
    from += "ß";
    toChars.push("ss");
    return str.replace(/./g, (ch) => {
        const i = from.indexOf(ch);
        return i === -1 ? ch : toChars[i];
    });
}
function dasherize(str) {
    return str
        .trim()
        .replace(/([A-Z])/g, "-$1")
        .replace(/[-_\s]+/g, "-")
        .toLowerCase();
}
function underscoreStringSlugify(value) {
    const str = value == null ? "" : String(value);
    return dasherize(cleanDiacritics(str).replace(/[^\w\s-]/g, "-").toLowerCase()).replace(/^-+|-+$/g, "");
}
