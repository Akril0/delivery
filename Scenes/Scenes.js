const {
    Context,
    session,
    Telegraf,
    BaseScene, Extra, Markup,
} = require('telegraf');
const menuData = require('../data/menu.json');
const sectionsList = require('../utils/categoriesList.js');
const {generateKeyboard} = require('../utils/generateKeyboard.js');

async function viewCartFunc(ctx, position) {
    let totalPositionPrice = position.count * Number(position.price.match(/(\d+)/)[0]);
    await ctx.reply(`${position.title}\n` +
        `цена за один: ${position.price}\n` +
        `количество: ${position.count}\n` +
        `общая цена: ${totalPositionPrice}`);
}


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


class SceneGenerator {
    GenMenuScene() {
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
                    await ctx.deleteMessage(i).catch();
                }

                //Delete message with keyboard
                await ctx.deleteMessage(ctx.session.keyboardMessageId).catch();

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
                        await ctx.deleteMessage(i).catch();
                    }

                    //Save name of new section
                    ctx.session.menuSection = ctx.message.text;

                    //Entering menu scene
                    await ctx.scene.enter('menu');
                }

                //Check if send a cart button message
                else if (ctx.message.text === '🛒Корзина') {

                    //Delete Menu
                    await ctx.deleteMessage(ctx.session.keyboardMessageId);
                    await ctx.deleteMessage(ctx.message.message_id);
                    const section = menuData.find(section => section.sectionName === ctx.session.menuSection);
                    for (let i = ctx.session.firstMsgId; i <= ctx.session.firstMsgId + section.menu.length; i++) {
                        await ctx.deleteMessage(i).catch();
                    }

                    //Entering viewCart scene
                    await ctx.scene.enter('viewCart');
                }

                //Check if send a confirm button message
                else if (ctx.message.text === '✅Подтвердить заказ') {

                    //Delete Menu
                    await ctx.deleteMessage(ctx.session.keyboardMessageId);
                    const section = menuData.find(section => section.sectionName === ctx.session.menuSection);
                    for (let i = ctx.session.firstMsgId; i <= ctx.session.firstMsgId + section.menu.length + 1; i++) {
                        await ctx.deleteMessage(i).catch();
                    }

                    await ctx.scene.enter('confirmOrder');
                } else {
                    await ctx.deleteMessage(ctx.message.message_id).catch();
                }
            } catch (e) {
                console.error('Menu on text error\n', e);
            }

        });

        return menu;
    }

    GenAddToCartScene() {
        const addToCart = new BaseScene('addToCart');

        addToCart.command('home',async (ctx) => {
            try{
                await ctx.deleteMessage(ctx.message.message_id);
                await ctx.deleteMessage(ctx.session.firstMsgId);

                //Creating keyboard
                const keyboard = generateKeyboard(sectionsList(menuData));
                keyboard.push(['✅Подтвердить заказ', '🛒Корзина']);

                //Send keyboard and name of scene
                await ctx.reply('МЕНЮ', Extra.markup(
                    Markup.keyboard(
                        keyboard,
                    ).resize())).then(res => ctx.session.keyboardMessageId = res.message_id);

                //Entering menu scene
                await ctx.scene.enter('menu');
            }catch (e){
                console.error('addToCart home error\n', e);
            }
        });

        addToCart.action('addCount', async (ctx) => {
            try {
                //Add one count to session
                ctx.session.addToCart.count += 1;

                //Edit message
                const messageParams = generateMsgAddToCart(ctx);
                await ctx.editMessageText(messageParams.text, messageParams.extra);
            } catch (e) {
                console.error('addToCart addCount action error\n', e);
            }
        });
        addToCart.action('subtractCount', async (ctx) => {
            try {
                //Subtract one count from session
                if (ctx.session.addToCart.count !== 1) {
                    ctx.session.addToCart.count -= 1;
                }

                //Edit message
                const messageParams = generateMsgAddToCart(ctx);
                await ctx.editMessageText(messageParams.text, messageParams.extra);
            } catch (e) {
                console.error('addToCart subtractCount action error\n', e);
            }
        });

        addToCart.action('confirmPosition', async (ctx) => {
            try {
                //Replacing position to cart
                ctx.session.userData.cart.push({...ctx.session.addToCart});

                //Clear addToCart session
                ctx.session.addToCart = {};


                //Delete message with inline keyboard
                await ctx.deleteMessage(ctx.update.callback_query.message.message_id);

                //Creating keyboard
                const keyboard = generateKeyboard(sectionsList(menuData));
                keyboard.push(['✅Подтвердить заказ', '🛒Корзина']);

                //Send keyboard and name of scene
                await ctx.reply('МЕНЮ', Extra.markup(
                    Markup.keyboard(
                        keyboard,
                    ).resize())).then(res => ctx.session.keyboardMessageId = res.message_id);

                //Entering menu scene
                await ctx.scene.enter('menu');

            } catch (e) {
                console.error('addToCart confirmPosition action error\n', e);
            }
        });

        addToCart.action('cancelPosition', async (ctx) => {
            try {
                //Clear addToCart session
                ctx.session.addToCart = {};

                //Delete message with inline keyboard
                await ctx.deleteMessage(ctx.update.callback_query.message.message_id);

                //Creating keyboard
                const keyboard = generateKeyboard(sectionsList(menuData));
                keyboard.push(['✅Подтвердить заказ', '🛒Корзина']);

                //Send keyboard and name of scene
                await ctx.reply('МЕНЮ', Extra.markup(
                    Markup.keyboard(
                        keyboard,
                    ).resize())).then(res => ctx.session.keyboardMessageId = res.message_id);

                //Entering menu scene
                await ctx.scene.enter('menu');
            } catch (e) {
                console.error('addToCart confirmPosition action error\n', e);
            }
        });

        addToCart.hears(/(\d+)/, async (ctx) => {
            try {
                //Rewrite count to new value
                ctx.session.addToCart.count = Number(ctx.message.text);

                //Delete user message
                await ctx.deleteMessage(ctx.message.message_id);

                //Edit message
                const messageParams = generateMsgAddToCart(ctx);
                await ctx.telegram.editMessageText(ctx.chat.id,
                    ctx.session.firstMsgId,
                    null,
                    messageParams.text,
                    messageParams.extra);

            } catch (e) {
                console.error('addToCart hears error\n', e);
            }
        });

        addToCart.on('text', async (ctx) => {
            try{
                await ctx.deleteMessage(ctx.message.message_id).catch();
            }catch (e) {
                console.error('addToCart text error\n', e);
            }
        });

        return addToCart;
    }

    GenViewCartScene() {
        const viewCart = new BaseScene('viewCart');

        viewCart.enter(async ctx => {
            try { //Send message with keyboard
                await ctx.reply('Корзина:', Extra.markup(Markup.keyboard(
                    [['⬅️Назад']],
                ).resize())).then(
                    res => ctx.session.keyboardMessageId = res.message_id,
                );

                //Check if cart is empty
                if (ctx.session.userData.cart.length === 0) {
                    await ctx.reply('Корзина пуста');
                    return;
                }

                //View cart
                let totalCartPrice = 0;
                for (const position of ctx.session.userData.cart) {
                    let totalPositionPrice = position.count * Number(position.price.match(/(\d+)/)[0]);
                    totalCartPrice += totalPositionPrice;
                    await viewCartFunc(ctx, position);
                }
                await ctx.reply(`Общаяя сумма: ${totalCartPrice}`);
            } catch (e) {
                console.error('viewCart enter error\n', e);
            }
        });

        viewCart.command('home',async (ctx) => {
            try{
                await ctx.deleteMessage(ctx.message.message_id);

                //Delete all view cart
                for (let i = ctx.session.keyboardMessageId; i <= ctx.session.keyboardMessageId + ctx.session.userData.cart.length+1; i++) {
                    await ctx.deleteMessage(i).catch();
                }

                //Creating keyboard
                const keyboard = generateKeyboard(sectionsList(menuData));
                keyboard.push(['✅Подтвердить заказ', '🛒Корзина']);

                //Send keyboard and name of scene
                await ctx.reply('МЕНЮ', Extra.markup(
                    Markup.keyboard(
                        keyboard,
                    ).resize())).then(res => ctx.session.keyboardMessageId = res.message_id);

                //Entering menu scene
                await ctx.scene.enter('menu');
            }catch (e) {
                console.error('viewCart /home error\n', e);
            }
        });


        viewCart.hears('⬅️Назад', async (ctx) => {
            try {
                await ctx.deleteMessage(ctx.message.message_id).catch();

                //Delete all view cart
                for (let i = ctx.session.keyboardMessageId; i <= ctx.session.keyboardMessageId + ctx.session.userData.cart.length+1; i++) {
                    await ctx.deleteMessage(i).catch();
                }


                //Creating keyboard
                const keyboard = generateKeyboard(sectionsList(menuData));
                keyboard.push(['✅Подтвердить заказ', '🛒Корзина']);

                //Send keyboard and name of scene
                await ctx.reply('МЕНЮ', Extra.markup(
                    Markup.keyboard(
                        keyboard,
                    ).resize())).then(res => ctx.session.keyboardMessageId = res.message_id);

                //Entering menu scene
                await ctx.scene.enter('menu');
            } catch (e) {
                console.error('viewCart hears error\n', e);
            }

        });

        viewCart.on('text', async (ctx) => {
            try{
                await ctx.deleteMessage(ctx.message.message_id).catch();
            }catch (e) {
                console.error('viewCart text error\n', e);
            }
        });

        return viewCart;
    }

    GenConfirmOrder() {
        const confirmOrder = new BaseScene('confirmOrder');

        confirmOrder.enter(async ctx => {
            try {
                ctx.session.userData.cart = [];
                await ctx.reply('Закак подтвержден', Extra.markup(Markup.keyboard(
                    [['⬅️Вернуться к меню']],
                ).resize())).then(
                    res => {
                        ctx.session.keyboardMessageId = res.message_id;
                    },
                );
            } catch (e) {
                console.error('confirmOrder enter error\n', e);
            }
        });

        confirmOrder.command('home',async (ctx) => {

            try{
                await ctx.deleteMessage(ctx.message.message_id);

                await ctx.deleteMessage(ctx.session.keyboardMessageId);

                //Creating keyboard
                const keyboard = generateKeyboard(sectionsList(menuData));
                keyboard.push(['✅Подтвердить заказ', '🛒Корзина']);

                //Send keyboard and name of scene
                await ctx.reply('МЕНЮ', Extra.markup(
                    Markup.keyboard(
                        keyboard,
                    ).resize())).then(res => ctx.session.keyboardMessageId = res.message_id);

                //Entering menu scene
                await ctx.scene.enter('menu');
            }catch (e) {
                console.error('confirmOrder /home error\n', e);
            }
        });

        confirmOrder.hears('⬅️Вернуться к меню', async ctx => {
            try {

                await ctx.deleteMessage(ctx.message.message_id);

                await ctx.deleteMessage(ctx.session.keyboardMessageId);

                //Creating keyboard
                const keyboard = generateKeyboard(sectionsList(menuData));
                keyboard.push(['✅Подтвердить заказ', '🛒Корзина']);

                //Send keyboard and name of scene
                await ctx.reply('МЕНЮ', Extra.markup(
                    Markup.keyboard(
                        keyboard,
                    ).resize())).then(res => ctx.session.keyboardMessageId = res.message_id);

                //Entering menu scene
                await ctx.scene.enter('menu');
            } catch (e) {
                console.error('confirmOrder hears error\n', e);
            }
        });

        confirmOrder.on('text', async (ctx) => {
            try{
                await ctx.deleteMessage(ctx.message.message_id).catch();
            } catch (e) {
                console.error('confirmOrder text error\n', e);
            }
        });

        return confirmOrder;
    }
}

module.exports = SceneGenerator;