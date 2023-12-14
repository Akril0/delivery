const {Composer, Extra, Markup} = require('telegraf');
const {generateKeyboard} = require('../../utils/generateKeyboard.js');
const sectionsList = require('../../utils/categoriesList.js');
const menuData = require('../../data/menu.json');

const composer = new Composer()
composer.hears(/^\/(start|home)$/, async (ctx) => {
    try {
        //Checking ref or not
        if (ctx.message.text.length > 6) {
            const refID = ctx.message.text.slice(7);
            await ctx.reply(`Вы зашли по ссылке пользователя с ID ${refID}`);
        }

        //Add userData to session
        ctx.session.userData = {
            cart: [],
            id: ctx.chat.id,
        };

        //Creating keyboard
        const keyboard = generateKeyboard(sectionsList(menuData));
        keyboard.push(['✅Подтвердить заказ', '🛒Корзина']);

        //Send keyboard and name of scene
        await ctx.reply('МЕНЮ', Extra.markup(
            Markup.keyboard(
                keyboard,
            ).resize())).then(res => ctx.session.keyboardMessageId = res.message_id);

        //Write to session menuSection
        ctx.session.menuSection = menuData[0].sectionName;

        //Entering menu scene
        await ctx.scene.enter('menu');

        //Delete /start message
        // await ctx.deleteMessage(ctx.message.message_id).catch(e => {
        //     console.log('Delete message error\n', e);
        // });
    } catch (e) {
        console.error('Bot /start error\n', e);
    }
});

module.exports = composer;