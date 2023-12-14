const {session, Telegraf, Stage} = require('telegraf');
require('dotenv').config();
const menuScene = require('./Scenes/MenuScene/MenuScene.js');
const addToCartScene = require('./Scenes/AddToCartScene/AddToCartScene.js');
const viewCartScene = require('./Scenes/ViewCartScene/ViewCartScene.js');
const confirmOrder = require('./Scenes/ConfirmOrder/ConfirmOrder.js');
const botHearsComposer = require('./Composers/BotComposers/BotHears.composers.js')

const bot = new Telegraf(process.env.API_KEY_BOT);
const stage = new Stage([menuScene, addToCartScene, viewCartScene, confirmOrder]);

bot.use(session());
bot.use(stage.middleware());
bot.use(botHearsComposer)

bot.launch()

