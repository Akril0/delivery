//Template of keyboard with 3 rows
 const generateKeyboardSize = (buttons) => {
    let size = 3;
    let subarray = [];
    for (let i = 0; i < Math.ceil(buttons.length / size); i++) {
        subarray[i] = buttons.slice((i * size), (i * size) + size);
    }
    return subarray;
};

module.exports.generateKeyboard =generateKeyboardSize