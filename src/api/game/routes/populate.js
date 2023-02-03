'use strict'

/**
 * populate router
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/game/populate',
      handler: 'game.populate'
    }
  ]
}
