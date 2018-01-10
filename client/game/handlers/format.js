/** ********************************************************************************************************************
 *
 * formatting helpers
 * @exports { functions }
 *
 **********************************************************************************************************************/

/*
 * get Roman Number from latin number
 * I'm really lazy and we won't have more than 20 planets.
 * @param {Number} latin - [0..20]
 * @returns {String} roman
 */
const latinToRoman = latin => {
    let romanNumbers = [
        "",
        "I",
        "II",
        "III",
        "IV",
        "V",
        "VI",
        "VII",
        "VIII",
        "IX",
        "X",
        "XI",
        "XII",
        "XIII",
        "XIV",
        "XV",
        "XVI",
        "XVII",
        "XVIII",
        "XIX",
        "XX"
    ];
    latin = parseInt(latin, 10); // make sure its an integer
    return romanNumbers[latin];
};

export { latinToRoman };
