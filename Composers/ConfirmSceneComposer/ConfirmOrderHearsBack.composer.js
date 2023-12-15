const {Composer, Extra, Markup} = require('telegraf');
const {generateKeyboard} = require('../../utils/generateKeyboardSize.js');
const sectionsList = require('../../utils/sectionsList.js');
const menuData = require('../../data/menu.json');
const generateAndSendKeyboard = require('../../utils/generateAndSendKeyboard.js');

const ConfirmOrderHearsBack = new Composer();

const deleteMessages = async (ctx) => {
    await ctx.deleteMessage(ctx.message.message_id).catch(e => {
        console.log('Delete message error\n', e);
    });

    await ctx.deleteMessage(ctx.session.keyboardMessageId).catch(e => {
        console.log('Delete message error\n', e);
    });
};

ConfirmOrderHearsBack.hears('⬅️Вернуться к меню', async ctx => {
    try {

        await deleteMessages(ctx);

        await generateAndSendKeyboard(ctx);

        //Entering menu scene
        await ctx.scene.enter('menu');
    } catch (e) {
        console.error('confirmOrder hears error\n', e);
    }
});

module.exports = ConfirmOrderHearsBack;