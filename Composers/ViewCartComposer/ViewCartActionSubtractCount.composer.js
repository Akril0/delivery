const { Composer } = require('telegraf');
const generateMsgAddToCart = require('../../utils/generateMsgAddToCart.js');
const viewCartFunc = require('../../utils/viewCartFunc.js');

const ViewCartActionSubtractCount = new Composer();

ViewCartActionSubtractCount.action('subtractCount', async (ctx) => {
   try {
      //Subtract one count from session
      if (ctx.session.addToCart.count !== 1) {
         ctx.session.addToCart.count -= 1;
      }

      //Edit message
      const messageParams = viewCartFunc();
      await ctx.editMessageText(messageParams.text, messageParams.extra);

      let totalCartPrice = 0;
      for (const position of ctx.session.userData.cart) {
         let totalPositionPrice = position.count * Number(position.price.match(/(\d+)/)[0]);
         totalCartPrice += totalPositionPrice;
      }
      await ctx.telegram.editMessageText(ctx.chat.id,
         ctx.session.sendedMsg[sendedMsg.length - 1],
         null,
         `Общаяя сумма: ${totalCartPrice}`
      );
   } catch (e) {
      console.error('addToCart subtractCount action error\n', e);
   }
});

module.exports = ViewCartActionSubtractCount;