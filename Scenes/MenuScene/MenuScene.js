const {BaseScene, Extra, Markup} = require('telegraf');
const menuData = require('../../data/menu.json');
const sectionsList = require('../../utils/categoriesList.js');

const generateMsgAddToCart = (ctx) => {
    return {
        text: `${ctx.session.addToCart.title}\n` +
            `цена за один: ${ctx.session.addToCart.price}\n` +
            `количество: ${ctx.session.addToCart.count}\n` +
            `общая цена: ${ctx.session.addToCart.count * Number(ctx.session.addToCart.price.match(/(\d+)/)[0])}`,
        extra: Extra.markup(Markup.inlineKeyboard(
            [
                [
                    Markup.callbackButton('-', 'subtractCount'),
                    Markup.callbackButton('+', 'addCount'),
                ],
                [
                    Markup.callbackButton('❌Отменить', 'cancelPosition'),
                    Markup.callbackButton('✅Подтвердить', 'confirmPosition'),
                ],
            ],
        ).resize()),
    };
};

const menu = new BaseScene('menu');
menu.enter(async (ctx) => {
    try {
        //Search section that we want to view
        const section = menuData.find((section) => section.sectionName === ctx.session.menuSection);

        //Send name of section and save it`s id to session.firstMsgId
        await ctx.reply(ctx.session.menuSection).then(res => {
            ctx.session.firstMsgId = res.message_id;
        });

        //Display section menu
        section.menu.forEach((async (position) => {
            await ctx.replyWithPhoto({source: './assets/img.png'}, Extra.markup(
                Markup.inlineKeyboard(
                    [[Markup.callbackButton('Добавить в корзину', `add_to_cart:${position.id}`)]],
                ).resize(),
            ).caption(`${position.title}\nцена: ${position.price}`));
        }));

    } catch (e) {
        console.error('Menu enter error\n', e);
    }
});

menu.action(/^add_to_cart:/, async (ctx) => {
    try {
        const positionId = ctx.update.callback_query.data.split(':')[1];

        //Delete Menu
        const section = menuData.find(section => section.sectionName === ctx.session.menuSection);
        for (let i = ctx.session.firstMsgId; i <= ctx.session.firstMsgId + section.menu.length; i++) {
            await ctx.deleteMessage(i).catch(e=>{
                console.log('Delete message error\n', e)
            });
        }

        //Delete message with keyboard
        await ctx.deleteMessage(ctx.session.keyboardMessageId).catch(e=>{
            console.log('Delete message error\n', e)
        });

        //Adding position data to session
        const position = section.menu.find(position => position.id.toString() === positionId);
        ctx.session.addToCart = {
            ...position,
            count: 1,
        };

        //Send message with confirming addToCart
        const messageParams = generateMsgAddToCart(ctx);
        await ctx.reply(messageParams.text, messageParams.extra)
            .then(res => {
                    //Set new first message
                    ctx.session.firstMsgId = res.message_id;
                },
            );

        //Entering addToCart scene
        await ctx.scene.enter('addToCart');

    } catch (e) {
        console.error('Menu action error\n', e);
    }
});

menu.on('text', async (ctx) => {
    try {
        //Check if send a menu navigate button message
        if (sectionsList(menuData).includes(ctx.message.text)) {
            //Delete Menu
            const section = menuData.find(section => section.sectionName === ctx.session.menuSection);
            for (let i = ctx.session.firstMsgId; i <= ctx.session.firstMsgId + section.menu.length + 1; i++) {
                await ctx.deleteMessage(i).catch(e=>{
                    console.log('Delete message error\n', e)
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
            await ctx.deleteMessage(ctx.session.keyboardMessageId).catch(e=>{
                console.log('Delete message error\n', e)
            });
            await ctx.deleteMessage(ctx.message.message_id).catch(e=>{
                console.log('Delete message error\n', e)
            });
            const section = menuData.find(section => section.sectionName === ctx.session.menuSection);
            for (let i = ctx.session.firstMsgId; i <= ctx.session.firstMsgId + section.menu.length; i++) {
                await ctx.deleteMessage(i).catch(e=>{
                    console.log('Delete message error\n', e)
                });
            }

            //Entering viewCart scene
            await ctx.scene.enter('viewCart');
        }

        //Check if send a confirm button message
        else if (ctx.message.text === '✅Подтвердить заказ') {

            //Delete Menu
            await ctx.deleteMessage(ctx.session.keyboardMessageId).catch(e=>{
                console.log('Delete message error\n', e)
            });
            const section = menuData.find(section => section.sectionName === ctx.session.menuSection);
            for (let i = ctx.session.firstMsgId; i <= ctx.session.firstMsgId + section.menu.length + 1; i++) {
                await ctx.deleteMessage(i).catch(e=>{
                    console.log('Delete message error\n', e)
                });
            }

            await ctx.scene.enter('confirmOrder');
        } else {
            await ctx.deleteMessage(ctx.message.message_id).catch(e=>{
                console.log('Delete message error\n', e)
            });
        }
    } catch (e) {
        console.error('Menu on text error\n', e);
    }

});

module.exports = menu;
