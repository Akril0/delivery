const {Composer, Extra, Markup} = require('telegraf');
const {generateKeyboard} = require('../../utils/generateKeyboardSize.js');
const generateAndSendKeyboard = require('../../utils/generateAndSendKeyboard.js');
const menuData = require('../../data/menu.json');

const AddToCartActionCancelPosition = new Composer();

AddToCartActionCancelPosition.action('cancelPosition', async (ctx) => {
    try {
        //Clear addToCart session
        ctx.session.addToCart = {};

        //Delete message with inline keyboard
        await ctx.deleteMessage(ctx.update.callback_query.message.message_id).catch(e => {
            console.log('Delete message error\n', e);
        });

        await generateAndSendKeyboard(ctx);

        //Entering menu scene
        await ctx.scene.enter('menu');
    } catch (e) {
        console.error('addToCart confirmPosition action error\n', e);
    }
});

module.exports = AddToCartActionCancelPosition;