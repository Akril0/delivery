const {generateKeyboard} = require('./generateKeyboardSize.js');
const sectionsList = require('./sectionsList.js')
const menuData = require('../data/menu.json');
const {Extra, Markup} = require('telegraf');


const generateAndSendKeyboard = async (ctx) => {
    //Creating keyboard
    const keyboard = generateKeyboard(sectionsList(menuData));
    keyboard.push(['✅Подтвердить заказ', '🛒Корзина']);

    //Send keyboard and name of scene
    await ctx.reply('МЕНЮ', Extra.markup(
        Markup.keyboard(
            keyboard,
        ).resize())).then(res => ctx.session.keyboardMessageId = res.message_id);
};

module.exports = generateAndSendKeyboard;