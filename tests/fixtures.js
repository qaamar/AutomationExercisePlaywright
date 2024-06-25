const { test: base } = require('@playwright/test');
const { HomePage } = require('../page-objects/HomePage');
const { LoginAndRegistrationPage } = require('../page-objects/LoginAndRegistrationPage');
const { CartPage } = require('../page-objects/CartPage')
const { ProductsPage } = require('../page-objects/ProductsPage')
const { ContactUsPage } = require('../page-objects/ContactUsPage')

export const test = base.extend({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page)
        await use(homePage)
    },

    loginAndRegistrationPage: async ({ page }, use) => {
        const loginAndRegistrationPage = new LoginAndRegistrationPage(page)
        await use(loginAndRegistrationPage)
    },

    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page)
        await use(cartPage)
    },

    productsPage: async ({ page }, use) => {
        const productsPage = new ProductsPage(page)
        await use(productsPage)
    },

    contactUsPage: async ({ page }, use) => {
        const contactUsPage = new ContactUsPage(page)
        await use(contactUsPage)
    },

})
