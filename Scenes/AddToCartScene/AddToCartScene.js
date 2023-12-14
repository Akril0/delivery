const {BaseScene, Extra, Markup} = require('telegraf');
const {generateKeyboard} = require('../../utils/generateKeyboard.js');
const sectionsList = require('../../utils/categoriesList.js');
const menuData = require('../../data/menu.json');

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

const addToCart = new BaseScene('addToCart');
addToCart.command('home',async (ctx) => {
    try{
        await ctx.deleteMessage(ctx.message.message_id).catch(e=>{
            console.log('Delete message error\n', e)
        });
        await ctx.deleteMessage(ctx.session.firstMsgId).catch(e=>{
            console.log('Delete message error\n', e)
        });

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
        await ctx.deleteMessage(ctx.update.callback_query.message.message_id).catch(e=>{
            console.log('Delete message error\n', e)
        });

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
        await ctx.deleteMessage(ctx.update.callback_query.message.message_id).catch(e=>{
            console.log('Delete message error\n', e)
        });

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
        await ctx.deleteMessage(ctx.message.message_id).catch(e=>{
            console.log('Delete message error\n', e)
        });

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
        await ctx.deleteMessage(ctx.message.message_id).catch(e=>{
            console.log('Delete message error\n', e)
        });
    }catch (e) {
        console.error('addToCart text error\n', e);
    }
});

module.exports = addToCart;