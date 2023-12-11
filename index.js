const {generateKeyboard} = require( './utils/generateKeyboard.js');

const {
    session,
    Telegraf,
    Stage,
    Markup,
    Extra,
} = require('telegraf');
require('dotenv').config();
const SceneGenerator = require('./Scenes/Scenes.js');
const sectionsList = require('./utils/categoriesList.js');
const menuData = require('./data/menu.json');
const userData = require('./data/user.json')


const bot = new Telegraf(process.env.API_KEY_BOT);
const curScene = new SceneGenerator();
const menuScene = curScene.GenMenuScene();
const addToCartScene = curScene.GenAddToCartScene();
const viewCartScene = curScene.GenViewCartScene()
const confirmOrder = curScene.GenConfirmOrder()
const stage = new Stage([menuScene, addToCartScene, viewCartScene, confirmOrder]);

bot.use(session());
bot.use(stage.middleware());

bot.hears(/^\/(start|home)$/,async (ctx) => {
    try{
        //Checking ref or not
        if (ctx.message.text.length > 6) {
            const refID = ctx.message.text.slice(7);
            await ctx.reply(`Вы зашли по ссылке пользователя с ID ${refID}`);
        }

        //Add userData to session
        ctx.session.userData = {
            cart: [],
            id: ctx.chat.id,
        }

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
        await ctx.deleteMessage(ctx.message.message_id).catch();
    }catch (e){
        console.error("Bot /start error\n",e)
    }
});

bot.launch();

