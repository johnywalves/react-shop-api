'use strict'

/**
 * game service
 */

const axios = require("axios")

async function getGameInfo(slug) {
  const jsdom = require("jsdom")
  const { JSDOM } = jsdom
  const body = await axios.get(`https://www.gog.com/game/${slug}`)
  const dom = new JSDOM(body.data)

  const description = dom.window.document.querySelector(".description")

  return {
    rating: 'BR0',
    short_description: description.textContent.slice(0, 160),
    description: description.innerHTML
  }
}

const { createCoreService } = require('@strapi/strapi').factories

module.exports = createCoreService('api::game.game', ({ strapi }) => ({
  async populate(...args) {
    let response = { okay: true }

    const gogApiUrl = 'https://catalog.gog.com/v1/catalog?limit=48&order=desc%3Atrending&productType=in%3Agame%2Cpack%2Cdlc%2Cextras&page=1&countryCode=BR&locale=en-US&currencyCode=BRL'

    const { data: { products } } = await axios.get(gogApiUrl)

    console.log(products[0])
    console.log(await getGameInfo(products[0].slug))

    //await strapi.services['api::publisher.publisher'].create({ name: products[0][0], slug })

    if (response.okay === false) {
      return { response, error: true }
    }

    return response
  }
}))
