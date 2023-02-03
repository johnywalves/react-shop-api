'use strict'

/**
 * game controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::game.game', ({ strapi }) => ({
  populate: async (ctx) => {
    try {
      await strapi.services['api::game.game'].populate()
      ctx.body = 'ok'
    } catch (err) {
      ctx.body = err
    }
  }
}))
