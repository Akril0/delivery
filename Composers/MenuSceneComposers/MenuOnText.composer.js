const {Composer, Extra, Markup} = require('telegraf');
const sectionsList = require('../../utils/categoriesList.js');
const menuData = require('../../data/menu.json');

const MenuOnText = new Composer();

MenuOnText.on('text', async (ctx) => {
    try {
        //Check if send a menu navigate button message
        if (sectionsList(menuData).includes(ctx.message.text)) {
            //Delete Menu
            const section = menuData.find(section => section.sectionName === ctx.session.menuSection);
            for (let i = ctx.session.firstMsgId; i <= ctx.session.firstMsgId + section.menu.length + 1; i++) {
                await ctx.deleteMessage(i).catch(e => {
                    console.log('Delete message error\n', e);
                });
            }

            //Save name of new section
            ctx.session.menuSection = ctx.message.text;

            //Entering menu scene
            await ctx.scene.enter('menu');
        }

        //Check if send a cart button message
        else if (ctx.message.text === '🛒Корзина') {

            //Delete Menu
            await ctx.deleteMessage(ctx.session.keyboardMessageId).catch(e => {
                console.log('Delete message error\n', e);
            });
            await ctx.deleteMessage(ctx.message.message_id).catch(e => {
                console.log('Delete message error\n', e);
            });
            const section = menuData.find(section => section.sectionName === ctx.session.menuSection);
            for (let i = ctx.session.firstMsgId; i <= ctx.session.firstMsgId + section.menu.length; i++) {
                await ctx.deleteMessage(i).catch(e => {
                    console.log('Delete message error\n', e);
                });
            }

            //Entering viewCart scene
            await ctx.scene.enter('viewCart');
        }

        //Check if send a confirm button message
        else if (ctx.message.text === '✅Подтвердить заказ') {

            //Delete Menu
            await ctx.deleteMessage(ctx.session.keyboardMessageId).catch(e => {
                console.log('Delete message error\n', e);
            });
            const section = menuData.find(section => section.sectionName === ctx.session.menuSection);
            for (let i = ctx.session.firstMsgId; i <= ctx.session.firstMsgId + section.menu.length + 1; i++) {
                await ctx.deleteMessage(i).catch(e => {
                    console.log('Delete message error\n', e);
                });
            }

            await ctx.scene.enter('confirmOrder');
        } else {
            await ctx.deleteMessage(ctx.message.message_id).catch(e => {
                console.log('Delete message error\n', e);
            });
        }
    } catch (e) {
        console.error('Menu on text error\n', e);
    }

});

module.exports = MenuOnText;