const {Composer, Extra, Markup} = require('telegraf');
const {generateKeyboard} = require('../../utils/generateKeyboardSize.js');
const sectionsList = require('../../utils/sectionsList.js');
const menuData = require('../../data/menu.json');
const generateAndSendKeyboard = require('../../utils/generateAndSendKeyboard.js');

const  ViewCartHearsBack = new Composer();

ViewCartHearsBack.hears('⬅️Назад', async (ctx) => {
    try {
        await ctx.deleteMessage(ctx.message.message_id).catch(e => {
            console.log('Delete message error\n', e);
        });

        //Delete all view cart
        for (let i = ctx.session.keyboardMessageId; i <= ctx.session.keyboardMessageId + ctx.session.userData.cart.length + 1; i++) {
            await ctx.deleteMessage(i).catch(e => {
                console.log('Delete message error\n', e);
            });
        }


        await generateAndSendKeyboard(ctx);

        //Entering menu scene
        await ctx.scene.enter('menu');
    } catch (e) {
        console.error('viewCart hears error\n', e);
    }

});

module.exports = ViewCartHearsBack;