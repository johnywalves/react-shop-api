'use strict'

/**
 * game service
 */

const { createCoreService } = require('@strapi/strapi').factories

module.exports = createCoreService('api::game.game', ({ strapi }) => ({
  async populate(...args) {
    let response = { okay: true }

    console.log('testestete')

    if (response.okay === false) {
      return { response, error: true }
    }

    return response
  }
}))
