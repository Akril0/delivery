const {BaseScene, Extra, Markup} = require('telegraf');
const {generateKeyboard} = require('../../utils/generateKeyboardSize.js');
const generateAndSendKeyBoard = require('../../utils/generateAndSendKeyboard.js');
const sectionsList = require('../../utils/sectionsList.js');
const generateMsgAddToCart = require('../../utils/generateMsgAddToCart.js');
const AddToCartHearsNumber = require('../../Composers/AddToCartComposer/AddToCartHearsNumber.composer.js');
const AddToCartActionCancelPosition = require('../../Composers/AddToCartComposer/AddToCartActionCancelPosition.composer.js');
const AddToCartActionConfirmPosition = require('../../Composers/AddToCartComposer/AddToCartActionConfirmPosition.composer.js');
const AddToCartActionSubtractCount = require('../../Composers/AddToCartComposer/AddToCartActionSubtractCount.composer.js');
const OnTextDeleteMessage = require('../../Composers/OnTextDeleteMessage.composer.js');
const AddToCartActionAddCount = require('../../Composers/AddToCartComposer/AddToCartActionAddCount.composer.js');
const menuData = require('../../data/menu.json');

const addToCart = new BaseScene('addToCart');
addToCart.command('home', async (ctx) => {
    try {
        await ctx.deleteMessage(ctx.message.message_id).catch(e => {
            console.log('Delete message error\n', e);
        });
        await ctx.deleteMessage(ctx.session.firstMsgId).catch(e => {
            console.log('Delete message error\n', e);
        });

        await generateAndSendKeyBoard(ctx);

        //Entering menu scene
        await ctx.scene.enter('menu');
    } catch (e) {
        console.error('addToCart home error\n', e);
    }
});

addToCart.use(AddToCartActionAddCount);
addToCart.use(AddToCartActionSubtractCount);
addToCart.use(AddToCartActionConfirmPosition);
addToCart.use(AddToCartActionCancelPosition);
addToCart.use(AddToCartHearsNumber);
addToCart.use(OnTextDeleteMessage);

module.exports = addToCart;