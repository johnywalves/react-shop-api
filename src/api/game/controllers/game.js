'use strict'

/**
 * game controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::game.game', ({ strapi }) => ({
  populate: async (ctx) => {
    try {
      const options = {
        limit: 48,
        order: 'desc:trending',
        countryCode: 'BR',
        currencyCode: 'BRL',
        ...ctx.query
      }

      await strapi.services['api::game.game'].populate(options)
      ctx.send('Finalizado no client')
    } catch (err) {
      ctx.send(err)
    }
  }
}))
