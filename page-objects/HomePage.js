import { expect } from "@playwright/test"
import { registrationDetails } from "../data/registrationDetails.js"
import { faker } from '@faker-js/faker'



export class HomePage {

    constructor(page) {
        this.page = page
        //navigation elements
        this.homePageButton = page.getByRole('link', { name: ' Home' })
        this.productsButton = page.getByRole('link', { name: ' Products' })
        this.cartButton = page.getByRole('link', { name: ' Cart' })
        this.registerButton = page.getByRole('link', { name: ' Signup / Login' })
        this.contactUsButton = page.getByRole('link', { name: ' Contact Us' })
        this.testCasesButton = page.getByRole('link', { name: ' Test Cases' })
        this.deleteButton = page.getByRole('link', { name: ' Delete Account' })
        this.loggedInUser = page.getByText(`Logged in as ${registrationDetails.firstName}`)
        this.loggedInAdminUser = page.getByText(`Logged in as test_admin`)
        this.btnLogOut = page.getByRole('link', { name: ' Logout' })
        this.subscription = page.getByRole('heading', { name: 'Subscription' })
        this.subscriptionField = page.getByPlaceholder('Your email address')
        this.subscribeBtn = page.locator('[id="subscribe"]')
        this.successfulSubscription = page.getByText('You have been successfully')
        this.viewProductBtn = page.locator('.choose > .nav > li > a').nth()
        this.categories = page.locator("[class='panel panel-default']")
        this.womenCategory = page.getByRole('heading', { name: ' Women' })
        this.menCategory = page.locator("[href='#Men']")
        this.kidsCategory = page.locator("[href='#Kids']")
        this.womenCategoriesSubCategories = page.locator(".panel-body > ul > li")
        this.dressProduct = page.locator("[href='/category_products/1']")
        const parentElement = this.womenCategory
        this.womenCategoryExpandBtn = parentElement.locator("[class='fa fa-plus']")
        const parentElementMen = this.menCategory
        this.menCategoryExpandBtn = parentElementMen.locator("[class='fa fa-plus']")
        this.tshirtProduct = page.locator("[href='/category_products/3']")
        this.recomendedItemsTitle = page.getByRole('heading', { name: 'recommended items' })
        this.scrollUpButton = page.locator ("[id='scrollUp']")
        this.headerTextHomePage = page.getByRole('heading', { name: 'Full-Fledged practice website' })


    } 


    //Actions
    visitAndVerifyHomePage = async () => {
        await this.page.goto('/')
        await this.page.waitForURL("https://automationexercise.com/")
    }

    navigateToProducts = async () => {
        await this.productsButton.click()
    }

    navigateToCart = async () => {
        await this.cartButton.click()
    }

    navigateToRegister = async () => {
        await this.registerButton.click()
    }
    navigateToContactUs = async () => {
        await this.contactUsButton.click()
    }

    navigateToTestCases = async () => {
        await this.testCasesButton.click()
    }

    clickOnProduct = async () => {
        await this.product.click()
    }

    async clickProductDetailsLink(productId) {
        const productDetailsLink = this.getProductDetailsLink(productId);
        await productDetailsLink.click();
    }
    getProductDetailsLink(productId) {
        return this.page.locator(`div:nth-child(${productId}) > .product-image-wrapper > .choose > .nav > li > a`);
    }


    handlePopupIfItAppears = async () => {
        const popupButton = this.page.frameLocator('iframe[name="aswift_6"]').getByLabel('Close ad')
        const isPopupVisible = await popupButton.isVisible();
        if (isPopupVisible) {
            await popupButton.click();
        }
    }

    verifyUserIsLoggedIn = async () => {
        await expect(this.loggedInUser).toHaveText(`Logged in as ${registrationDetails.firstName}`);
    } 

    verifyAdminUserIsLoggedIn = async () => {
        await expect(this.loggedInAdminUser).toHaveText(`Logged in as test_admin`);
    }

    deleteUser = async () => {
        await this.deleteButton.click()
    }

    logOut = async () => {
        await this.btnLogOut.click()
        await this.page.waitForURL(/.*\/login/)
    }


    scrollAndVerifySubscriptionText = async () => {

        await this.subscription.scrollIntoViewIfNeeded()
        await expect(this.subscription).toHaveText('Subscription')
    }
    enterEmailAddressAndSubscribe = async () => {
        const fakeMail = faker.internet.email({ provider: '1secmail.com' })
        await this.subscriptionField.fill(fakeMail)
        await this.subscribeBtn.click()
        await expect(this.successfulSubscription).toBeVisible()
    }

    getViewProductBtn(prodNum) {
        return this.page.locator('.choose > .nav > li > a').nth(prodNum)
    }

    verifyCategories = async () => {
        await expect(this.categories).toHaveCount(3);

        await expect(this.womenCategory).toBeVisible()
        await expect(this.menCategory).toBeVisible()
        await expect(this.kidsCategory).toBeVisible()
    }



    expandAndSelectProductCategoryWomen = async (subCategoryName) => {
        await this.womenCategoryExpandBtn.click()
        this.clickSubCategory(subCategoryName)
    } //subcategory name can be used only for dress and tshirts rest needs to be added

    clickSubCategory = async (subCategoryName) => {
        if (subCategoryName === 'dress') {
            await this.dressProduct.waitFor({ timeout: 2000 })
            await this.dressProduct.click()
        }
        if (subCategoryName === 'tshirts') {
            await this.tshirtProduct.waitFor({ timeout: 2000 })
            await this.tshirtProduct.click()
        }
    }

    expandAndSelectProductCategoryMen = async (subCategoryName) => {
        await this.menCategoryExpandBtn.click()
        this.clickSubCategory(subCategoryName)

    }

    scrollAndVerifyRecomendedItems = async () => {
        await this.recomendedItemsTitle.scrollIntoViewIfNeeded()
        
        await expect(this.recomendedItemsTitle).toBeVisible()
    }

    scrollUpPage = async () => {
        await this.scrollUpButton.waitFor({timeout:1000})
        await this.scrollUpButton.click()
    }

    verifyTopOfHomePage = async () => {
        await expect(this.headerTextHomePage).toBeVisible()
        await expect(this.headerTextHomePage).toHaveText('Full-Fledged practice website for Automation Engineers')
    }

    scrollUpWithoutArrowButton = async () => {
       await this.homePageButton.scrollIntoViewIfNeeded()
       await expect(this.headerTextHomePage).toBeVisible()
    }

}




