'use strict'

/**
 * game service
 */
const axios = require("axios")
const slugify = require("slugify")

async function getGameInfo(slug) {
  const jsdom = require("jsdom")
  const { JSDOM } = jsdom

  const goPath = slug.replace(/-/g, "_")
  const body = await axios.get(`https://www.gog.com/game/${goPath}`)
  const dom = new JSDOM(body.data)

  const raw_description = dom.window.document.querySelector(".description")
  const short_description = raw_description.textContent.slice(0, 160)
  const description = raw_description.innerHTML

  const rating_element = dom.window.document.querySelector('.age-restrictions__icon use')
  const rating = rating_element ? rating_element.getAttribute('xlink:href')
    .replace(/_/g, "")
    .replace('#', '')
    : 'BR0'

  return {
    short_description,
    description,
    rating,
  }
}

async function getByName(name, entityService) {
  const item = await strapi.service(entityService).find({ filters: { name } })
  return item.results.length > 0 ? item.results[0] : null
}

async function create(name, entityService) {
  const item = await getByName(name, entityService)

  if (!item) {
    await strapi.service(entityService).create({
      data: {
        name: name,
        slug: slugify(name, { strict: true, lower: true })
      }
    })
  }
}

async function createManyToManyData(products) {
  const developersSet = new Set()
  const publishersSet = new Set()
  const categoriesSet = new Set()
  const platformsSet = new Set()

  products.forEach(({ developers, publishers, genres, operatingSystems }) => {
    developers?.forEach((item) => {
      developersSet.add(item)
    })

    publishers?.forEach((item) => {
      publishersSet.add(item)
    })

    genres?.forEach(({ name }) => {
      categoriesSet.add(name)
    })

    operatingSystems?.forEach((item) => {
      platformsSet.add(item)
    })
  })

  const createCall = (set, entityName) =>
    Array.from(set).map((name) => create(name, entityName))

  return Promise.all([
    ...createCall(developersSet, "api::developer.developer"),
    ...createCall(publishersSet, "api::publisher.publisher"),
    ...createCall(categoriesSet, "api::category.category"),
    ...createCall(platformsSet, "api::platform.platform"),
  ])
}

async function createGames(products) {
  await Promise.all(
    products.map(async ({
      title,
      slug,
      price: { finalMoney: { amount } },
      releaseDate,
      developers,
      publishers,
      genres,
      operatingSystems
    }) => {
      const item = await getByName(title, "api::game.game")

      if (!item) {
        console.info(`Creating... ${title}`)

        return await strapi.service("api::game.game").create({
          data: {
            name: title,
            slug,
            price: amount,
            release_date: new Date(releaseDate),
            developers: await Promise.all(developers.map((name) => getByName(name, "api::developer.developer"))),
            publisher: await Promise.all(publishers.map((name) => getByName(name, "api::publisher.publisher"))),
            categories: await Promise.all(genres.map(({ name }) => getByName(name, "api::category.category"))),
            platforms: await Promise.all(operatingSystems.map((name) => getByName(name, "api::platform.platform"))),
            ...await getGameInfo(slug),
            publishedAt: new Date()
          }
        })
      }
    })
  )
}

const { createCoreService } = require('@strapi/strapi').factories

module.exports = createCoreService('api::game.game', ({ strapi }) => ({
  async populate(...args) {
    const response = { okay: true }

    const gogApiUrl = 'https://catalog.gog.com/v1/catalog?limit=48&order=desc%3Atrending&productType=in%3Agame%2Cpack%2Cdlc%2Cextras&page=1&countryCode=BR&locale=en-US&currencyCode=BRL'

    const { data: { products } } = await axios.get(gogApiUrl)

    await createManyToManyData(products)
    await createGames(products)

    return response
  }
}))
