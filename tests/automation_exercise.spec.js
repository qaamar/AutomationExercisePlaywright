const { expect } = require('@playwright/test');
const { test } = require('./fixtures.js')
import { adminDetails } from '../data/userDetails.js';
import { faker } from '@faker-js/faker';





test.describe('Registration and login', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.visitAndVerifyHomePage()
        await homePage.navigateToRegister()
    })

    //adjust naming conventions here to have consistent test names
    test("Register user test", async ({ page, homePage, loginAndRegistrationPage }) => {

        const email = faker.internet.email({ provider: '1secmail.com' })
        // Fill out registration form
        await loginAndRegistrationPage.waitForNewSignupElements()
        await loginAndRegistrationPage.registerToWebsite(email)
        await loginAndRegistrationPage.fillOutRegistrationForm()
        //Verify that the account was created successfully
        await loginAndRegistrationPage.verifyAccountCreatedSuccessfully()
        // Delete user and verify that the account was deleted successfully
        await homePage.verifyUserIsLoggedIn()
        await homePage.deleteUser()
        await loginAndRegistrationPage.verifyAccountDeletedSuccessfully()

    })

    test("Login admin user test", async ({ homePage, loginAndRegistrationPage }) => {

        await loginAndRegistrationPage.loginToWebsite(adminDetails.email, adminDetails.password);
        await homePage.verifyAdminUserIsLoggedIn();

    })

    test("Login with incorrect credentials", async ({ homePage, loginAndRegistrationPage }) => {

        await loginAndRegistrationPage.loginHeading.waitFor()
        await loginAndRegistrationPage.loginToWebsite('fake@mail.com', 'test1234!');
        await loginAndRegistrationPage.verifyErrorLogin()

    })

    test("Logout user test", async ({ homePage, loginAndRegistrationPage }) => {

        // Wait for "Login to your account" heading and login to website
        await loginAndRegistrationPage.loginHeading.waitFor()
        await loginAndRegistrationPage.loginToWebsite(adminDetails.email, adminDetails.password);
        //Logout user and verify that the user is logged out
        await homePage.verifyAdminUserIsLoggedIn()
        await homePage.logOut()

    })

    test("Register user with existing email", async ({ homePage, loginAndRegistrationPage }) => {

        await loginAndRegistrationPage.registerToWebsite('admin@1secmail.com')
        await loginAndRegistrationPage.verifyErrorRegistration()

    })

})

test.describe('Navigation bar pages', () => {
    test.beforeEach(async ({ page, homePage }) => {
        await closeAdsPopup(page)
        await homePage.visitAndVerifyHomePage()
    })

    test("Contact Us form test", async ({ page, homePage, contactUsPage }) => {

        await homePage.navigateToContactUs()
        await contactUsPage.verifyTitlesAreVisible()
        await contactUsPage.populateContactUsForm()

        await contactUsPage.uploadFile()
        await closeAdsPopup(page)
        await contactUsPage.verifySuccessMessage()
        await homePage.visitAndVerifyHomePage()
        //THIS TEST IS FLAKY DUE TO UPLOAD FUNCTION ==> fix later
    })

    test("Verify Test Cases page test", async ({ page, homePage }) => {

        await closeAdsPopup(page)
        await homePage.navigateToTestCases()
        await expect(page.locator("[class='title text-center']")).toBeVisible()

    })

    test("Verfiy Products page test", async ({ page, homePage, productsPage }) => {

        await homePage.navigateToProducts()
        await closeAdsPopup(page)
        await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible()
        await productsPage.verifyProductsOnThePage()
        await homePage.getViewProductBtn(0).click()
        await productsPage.verifyAllProductsDetailsAreVisible()

    })

    test("Search product test", async ({ page, homePage, productsPage }) => {
        await homePage.navigateToProducts()
        await closeAdsPopup(page)
        await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible()
        await productsPage.verifyProductsOnThePage()
        await productsPage.searchForProduct("t shirt")
        await productsPage.verifySearchedProducts()
    })

    test("Verify subscription in home page test", async ({ homePage }) => {

        await homePage.scrollAndVerifySubscriptionText()
        await homePage.enterEmailAddressAndSubscribe()

    })

    test("Verify subscription in Cart page test", async ({ homePage }) => {

        await homePage.navigateToCart()
        await homePage.scrollAndVerifySubscriptionText()
        await homePage.enterEmailAddressAndSubscribe()

    })
})

test.describe("Purchase tests", () => {

    test.beforeEach(async ({ page, homePage }) => {
        await closeAdsPopup(page)
        await homePage.visitAndVerifyHomePage()
    })

    test("Add products to cart test", async ({ page, homePage, productsPage, cartPage }) => {

        await homePage.navigateToProducts()
        await closeAdsPopup(page)
    
        await productsPage.verifyProductsOnThePage()
        await productsPage.hoverOverProduct(0, 0)
        await productsPage.clickOnOverlayAddToCartBtn()

        await productsPage.clickOnContinueShoppingBtn()
        await productsPage.hoverOverProduct(1, 1)
        await productsPage.clickOnOverlayAddToCartBtn2(1)
        await productsPage.clickOnViewCart()
        await cartPage.verifyAddedProductsToCart(2)
        await cartPage.verifyTotalPrice()
    
        await cartPage.removeAllProducts()

        await cartPage.verifyAddedProductsToCart(0)
    })

    test("Verify Product quantity in Cart test", async ({ page, homePage, productsPage, cartPage }) => {

        await homePage.getViewProductBtn(0).click()
        await page.waitForURL('/product_details/**/*')
        const productQuantity = '4'
        await productsPage.increaseProductQuantity(productQuantity)
        await productsPage.clickOnAddToCart()
        await productsPage.clickOnViewCart()
        await cartPage.verifyProductQuantity(productQuantity)
        await cartPage.removeAllProducts()

    })

    test("Place Order: Register while Checkout test", async ({ homePage, loginAndRegistrationPage, productsPage, cartPage }) => {

        await productsPage.hoverOverProduct(0, 0)
        await productsPage.clickOnOverlayAddToCartBtn()

        const numberOfProductsAdded = 1
        await productsPage.clickOnViewCart()
        await cartPage.verifyAddedProductsToCart(numberOfProductsAdded)
        await cartPage.proceedWithCheckout()

        await cartPage.clickOnRegisterOrLoginLink()
        const email = faker.internet.email({ provider: '1secmail.com' })

        await loginAndRegistrationPage.waitForNewSignupElements()
        await loginAndRegistrationPage.registerToWebsite(email)
        await loginAndRegistrationPage.fillOutRegistrationForm()
        await loginAndRegistrationPage.verifyAccountCreatedSuccessfully()
        await homePage.verifyUserIsLoggedIn()

        await homePage.navigateToCart()
        await cartPage.proceedWithCheckout()
        await cartPage.verifyDeliveryDetails()
        await cartPage.placeOrder()
        await cartPage.populateCardDetailsAndPlaceOrder()
        await cartPage.verifySuccessfulOrder()

        await homePage.deleteUser()
        await loginAndRegistrationPage.verifyAccountDeletedSuccessfully()
    })

    test("Place Order: Register before Checkout test", async ({ homePage, loginAndRegistrationPage, productsPage, cartPage }) => {

        await homePage.navigateToRegister()
        const email = faker.internet.email({ provider: '1secmail.com' })
        await loginAndRegistrationPage.waitForNewSignupElements()
        await loginAndRegistrationPage.registerToWebsite(email)
        await loginAndRegistrationPage.fillOutRegistrationForm()
        await loginAndRegistrationPage.verifyAccountCreatedSuccessfully()
        await homePage.verifyUserIsLoggedIn()

        const numberOfProductsAdded = 1
        await productsPage.hoverOverProduct(0, 0)
        await productsPage.clickOnOverlayAddToCartBtn()
        await productsPage.clickOnViewCart()
        await cartPage.verifyAddedProductsToCart(numberOfProductsAdded)
        await cartPage.proceedWithCheckout()
        await cartPage.placeOrder()
        await cartPage.populateCardDetailsAndPlaceOrder()
        await cartPage.verifySuccessfulOrder()
        await homePage.deleteUser()
        await loginAndRegistrationPage.verifyAccountDeletedSuccessfully()

    })

    test ("Place Order: Login before Checkout test", async ({ homePage, loginAndRegistrationPage, productsPage, cartPage }) => {

        await homePage.navigateToRegister()
        await loginAndRegistrationPage.loginToWebsite(adminDetails.email, adminDetails.password)
        await homePage.verifyAdminUserIsLoggedIn()

        await homePage.navigateToCart()
        await cartPage.removeAllProducts()
        await homePage.navigateToProducts()

        const numberOfProductsAdded = 1
        await productsPage.hoverOverProduct(1, 1)
        await productsPage.clickOnOverlayAddToCartBtn2(1)
        await productsPage.clickOnViewCart()
        await cartPage.verifyAddedProductsToCart(numberOfProductsAdded)
        await cartPage.proceedWithCheckout()
       
        await cartPage.verifyDeliveryDetailsForExistingUser(adminDetails.firstName, adminDetails.lastName, adminDetails.companyName, adminDetails.streetAddress, adminDetails.streetAddressTwo, adminDetails.stateLocation, adminDetails.cityLocation, adminDetails.zipCodeLocation, adminDetails.phoneNumber)
        await cartPage.placeOrder()
        await cartPage.populateCardDetailsAndPlaceOrder()
        await cartPage.verifySuccessfulOrder()



    })

    test("Remove Products From Cart test", async ({ page, homePage, productsPage, cartPage }) => {

        const numberOfProductsAdded = 2

        for (let i = 1; i < 3; i++) {
            await productsPage.hoverOverProduct(i, i)
            await productsPage.clickOnOverlayAddToCartBtn2(i)
            await productsPage.clickOnContinueShoppingBtn()
        }
        await homePage.navigateToCart()
        await cartPage.verifyAddedProductsToCart(numberOfProductsAdded)

        await cartPage.removeCheapestProduct()
        await cartPage.verifyAddedProductsToCart(numberOfProductsAdded - 1)
        await await cartPage.removeAllProducts()

    })

})


test.describe("Category Tests", () => {

    test.beforeEach(async ({ page, homePage }) => {
        await closeAdsPopup(page)
        await homePage.visitAndVerifyHomePage()
    })

    test('View Category Products test', async ({ page, homePage, productsPage }) => {

        await homePage.verifyCategories()
        await homePage.expandAndSelectProductCategoryWomen('dress')
        await productsPage.verifyUserIsOnWomensDressPage()
        await homePage.visitAndVerifyHomePage()
        await homePage.expandAndSelectProductCategoryMen('tshirts')
        await productsPage.verifyUserIsOnMensTshirtsPage()

    })

    test("View & Cart Brand Products test", async ({ homePage, productsPage }) => {

        await homePage.navigateToProducts()
        await productsPage.verifyBrandsList()
        await productsPage.verifyNumberOfBrands(8)

        const brand = 'H&M'
        await productsPage.selectBrand(brand)
        await productsPage.verifyUserIsOnBrandPage(brand)

        const secondBrand = 'Polo'
        await productsPage.selectBrand(secondBrand)
        await productsPage.verifyUserIsOnBrandPage(secondBrand)
    })

    test("Search Products and Verify Cart After Login test", async ({ page, homePage, productsPage, cartPage, loginAndRegistrationPage }) => {

        await homePage.navigateToProducts()
        await productsPage.verifyAllProductsTitle()
    
        await productsPage.searchForProduct('tshirt')
        await productsPage.verifySearchedProductsTitle()

        const numberOfProductsAdded = 2
        for (let i = 1; i < 3; i++) {
            await productsPage.hoverOverProduct(i, i)
            await productsPage.clickOnOverlayAddToCartBtn2(i)
            await productsPage.clickOnContinueShoppingBtn()
        }

        await homePage.navigateToCart()
        await cartPage.verifyAddedProductsToCart(numberOfProductsAdded)
    
        await homePage.navigateToRegister()
        await loginAndRegistrationPage.loginToWebsite(adminDetails.email, adminDetails.password)
        await homePage.navigateToCart()
        await cartPage.verifyAddedProductsToCart(numberOfProductsAdded)
    })

})

test.describe("Cart Tests", () => {
    test.beforeEach(async ({ page, homePage }) => {
        await closeAdsPopup(page)
        await homePage.visitAndVerifyHomePage()
    })


    test("Verify Total Price in Cart test", async ({ page, homePage, productsPage, cartPage }) => {
        await homePage.navigateToProducts()
        await productsPage.verifyAllProductsTitle()
        await homePage.getViewProductBtn(0).click()
        await productsPage.submitReview()
        await productsPage.verifySuccessMessageAfterReview()
    

    })

    test("Add to cart from Recommended items test", async ({ page, homePage, productsPage, cartPage }) => {

        await homePage.scrollAndVerifyRecomendedItems()
        await productsPage.addFirstRecommendedProduct()
        await productsPage.clickOnViewCart()
        await cartPage.verifyAddedProductsToCart(1)

    })

    test("Verify address details in checkout page test", async ({ page, homePage, productsPage, cartPage,loginAndRegistrationPage }) => {
        await productsPage.hoverOverProduct(1, 1)
        await productsPage.clickOnOverlayAddToCartBtn2(1)
        await productsPage.clickOnViewCart()
    
        await cartPage.verifyAddedProductsToCart(1)
        await cartPage.proceedWithCheckout()
        await cartPage.clickOnRegisterOrLoginLink()
        const email = faker.internet.email({ provider: '1secmail.com' })
        await loginAndRegistrationPage.waitForNewSignupElements()
        await loginAndRegistrationPage.registerToWebsite(email)
        await loginAndRegistrationPage.fillOutRegistrationForm()
        await loginAndRegistrationPage.verifyAccountCreatedSuccessfully()
        await homePage.verifyUserIsLoggedIn()

        await homePage.navigateToCart()
        await closeAdsPopup(page)
        await cartPage.proceedWithCheckout()
        await cartPage.verifyDeliveryDetails()
        await cartPage.placeOrder()
        await cartPage.populateCardDetailsAndPlaceOrder()
        await cartPage.verifySuccessfulOrder()
        await cartPage.downloadInvoice()

        await homePage.deleteUser()
        await loginAndRegistrationPage.verifyAccountDeletedSuccessfully()
    })

    test("Verify Scroll Up using 'Arrow' button and Scroll Down functionality", async ({ page, homePage, productsPage, cartPage,loginAndRegistrationPage }) => {
       
        await homePage.scrollAndVerifySubscriptionText()
        await homePage.scrollUpPage()
        await page.pause()
        await homePage.verifyTopOfHomePage()

    })

    test("Verify Scroll Up without 'Arrow' button and Scroll Down functionality", async ({ page, homePage, productsPage, cartPage,loginAndRegistrationPage }) => {
       
        await page.pause()
        await homePage.scrollAndVerifySubscriptionText()
        await page.pause()
        await homePage.scrollUpWithoutArrowButton()
        await page.pause()
        await homePage.verifyTopOfHomePage()
    })


})


//#region Helper functions  
const closeAdsPopup = async (page) => {
    await page.route('**/*', (route) => {
        // abort requests from known ad domains
        if (route.request().url().includes('googleads.')) {
            route.abort();
        }
        else {
           
            route.continue();
        }
    });
};
//#endregion