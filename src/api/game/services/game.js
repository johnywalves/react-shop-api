'use strict'

/**
 * game service
 */
const axios = require("axios")
const slugify = require("slugify")
const qs = require("querystring")

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function Exception(e) {
  return { e, data: e.data && e.data.errors && e.data.errors };
}


async function getGameInfo(slug) {
  try {
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
  } catch (error) {
    console.log("getGameInfo:", Exception(error));
  }
}

async function getByName(name, entityService) {
  try {
    const item = await strapi.service(entityService).find({ filters: { name } })
    return item.results.length > 0 ? item.results[0] : null
  } catch (error) {
    console.log("getByName:", Exception(error));
  }
}

async function create(name, entityService) {
  try {
    const item = await getByName(name, entityService)

    if (!item) {
      await strapi.service(entityService).create({
        data: {
          name: name,
          slug: slugify(name, { strict: true, lower: true })
        }
      })
    }
  } catch (error) {
    console.log("create:", Exception(error));
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

async function setImage({ image, game, field = "cover" }) {
  try {
    const { data } = await axios.get(image, { responseType: "arraybuffer" })
    const buffer = Buffer.from(data, "base64")

    const FormData = require("form-data")
    const formData = new FormData()

    formData.append("refId", game.id)
    formData.append("ref", "api::game.game")
    formData.append("field", field)
    formData.append("files", buffer, { filename: `${game.slug}.jpg` })

    console.info(`Uploading ${field} image: ${game.slug}.jpg`)

    await axios({
      method: "POST",
      url: `http://localhost:1337/api/upload/`,
      data: formData,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      },
    })
  } catch (error) {
    console.log("setImage:", Exception(error));
  }
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
      operatingSystems,
      coverHorizontal,
      screenshots
    }) => {
      const item = await getByName(title, "api::game.game")

      if (!item) {
        console.info(`Creating... ${title}`)

        const game = await strapi.service("api::game.game").create({
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

        await setImage({ image: coverHorizontal, game });

        await Promise.all(
          screenshots.slice(0, 5).map((url) =>
            setImage({
              image: `${url.replace("{formatter}", "product_card_v2_mobile_slider_639")}`,
              game,
              field: "gallery",
            })
          )
        )

        return game
      }
    })
  )
}

const { createCoreService } = require('@strapi/strapi').factories

module.exports = createCoreService('api::game.game', ({ strapi }) => ({
  async populate(params) {
    try {
      const response = { okay: true }

      const gogApiUrl = `https://catalog.gog.com/v1/catalog?${qs.stringify(params)}`

      const { data: { products } } = await axios.get(gogApiUrl)

      await createManyToManyData(products)
      await createGames(products)

      return response
    }
    catch (error) {
      console.log("populate:", Exception(error));
    }
  }
}))
