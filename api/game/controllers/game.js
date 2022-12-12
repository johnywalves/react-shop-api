'use strict';

const { default: createStrapi } = require("strapi");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    populate: async (ctx) =>  {
        console.log('Starting to populate...\n')

        await strapi.services.game.populate()

        ctx.send("Finished populating!\n")
    }
};
