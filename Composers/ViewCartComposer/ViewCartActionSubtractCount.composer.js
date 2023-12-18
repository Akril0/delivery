const { Composer } = require('telegraf');
const generateMsgAddToCart = require('../../utils/generateMsgAddToCart.js');
const viewCartFunc = require('../../utils/viewCartFunc.js');

const ViewCartActionSubtractCount = new Composer();

ViewCartActionSubtractCount.action(/^subtractCount:/, async (ctx) => {
   try {
      const positionId = ctx.update.callback_query.data.split(':')[1];
      let positionTemp = {};

      ctx.session.userData.cart = ctx.session.userData.cart.map(position => {
         if(position.id.toString() === positionId){
            position.count +=1;
            if (position.count !== 1) {
               position.count -= 1;
            }
            positionTemp={...position}
         }
         return position;
      });



      //Edit message
      const messageParams = viewCartFunc(positionTemp);
      await ctx.editMessageText(messageParams.text, messageParams.extra);

      let totalCartPrice = 0;
      for (const position of ctx.session.userData.cart) {
         let totalPositionPrice = position.count * Number(position.price.match(/(\d+)/)[0]);
         totalCartPrice += totalPositionPrice;
      }
      await ctx.telegram.editMessageText(ctx.chat.id,
         ctx.session.sendedMsg[ctx.session.sendedMsg.length - 1],
         null,
         `Общаяя сумма: ${totalCartPrice}`
      );
   } catch (e) {
      console.error('addToCart subtractCount action error\n', e);
   }
});

module.exports = ViewCartActionSubtractCount;