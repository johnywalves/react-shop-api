'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
    populate: async (ctx) => {
        const cat = await strapi.services.category.find({ name: "Action" })
        console.log(cat)
    }
};
