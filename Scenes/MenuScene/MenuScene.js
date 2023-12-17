const { BaseScene, Extra, Markup } = require('telegraf');
const menuAddToCart = require('../../Composers/MenuSceneComposers/MenuAddToCart.composer.js');
const menuOnText = require('../../Composers/MenuSceneComposers/MenuOnText.composer.js')
const menuData = require('../../data/menu.json');

const menu = new BaseScene('menu');

menu.enter(async (ctx) => {
    try {
        //Search section that we want to view
        const section = menuData.find((section) => section.sectionName === ctx.session.menuSection);

        //Send name of section and save it`s id to session.firstMsgId
        await ctx.reply(ctx.session.menuSection).then(res => {
            ctx.session.sendedMsg = [res.message_id];
        });

        //Display section menu
        section.menu.forEach((async (position) => {
            await ctx.replyWithPhoto({ source: './assets/img.png' }, Extra.markup(
                Markup.inlineKeyboard(
                    [[Markup.callbackButton('Добавить в корзину', `add_to_cart:${position.id}`)]],
                ).resize(),
            ).caption(`${position.title}\nцена: ${position.price}`)).then(res => {
                ctx.session.sendedMsg = [...ctx.session.sendedMsg, res.message_id];
            });
        }))



    } catch (e) {
        console.error('Menu enter error\n', e);
    }
});
menu.use(menuAddToCart);
menu.use(menuOnText);

module.exports = menu;
