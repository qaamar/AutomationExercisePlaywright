const { expect } = require('@playwright/test');
import { registrationDetails } from "../data/registrationDetails.js"
export class CartPage {
    constructor(page) {
        this.page = page

        this.cartProduct = page.locator('[class="cart_product"]')
        this.itemPrice = page.locator('[class="cart_price"]')
        this.removeButton = page.locator('[class="cart_quantity_delete"]')
        this.proceedToCheckoutButton = page.getByText('Proceed To Checkout')
        this.placeOrderButton = page.getByRole('link', { name: 'Place Order' })
        this.orderSuccessfulHeading = page.locator('[data-qa="order-placed"]')
        this.downloadInvoiceButton = page.getByRole('link', { name: 'Download Invoice' })
        //cc details
        this.nameOnCard = page.locator('input[name="name_on_card"]')
        this.cardNumber = page.locator('input[name="card_number"]')
        this.cvcNumber = page.locator('input[name="cvc"]')
        this.expirationDate = page.getByPlaceholder('MM')
        this.expirationYear = page.getByPlaceholder('YYYY')
        this.confirmCardDetails = page.getByRole('button', { name: 'Pay and Confirm Order' })
        //delivery details
        this.deliveryDetailsAddressOne = page.locator('[class="address_address1 address_address2"]')
        // --> delivery details table
        this.deliveryDetailsTable = page.locator('[id="address_delivery"]')
        this.totalPrice = page.locator('[class="cart_total_price"]')
        this.productQuantity = page.locator('[class="cart_quantity"]')

        //registration\login
        this.registerOrLoginLink = page.getByRole('link', { name: 'Register / Login' })

    }


    removeCheapestProduct = async () => {

        await this.cartProduct.first().waitFor()
        const allPrices = await this.itemPrice.allInnerTexts()

        const justNumbers = allPrices.map((price) => {
            const withoutPrice = price.replace('Rs.', '')
            return parseInt(withoutPrice, 10)
        }) 
        const cheapest = Math.min(...justNumbers)
        const smallestPriceIx = justNumbers.indexOf(cheapest)
        await this.removeButton.nth(smallestPriceIx).waitFor()
        await this.removeButton.nth(smallestPriceIx).click()

    }

    removeAllProducts = async () => {
        while (true) {
            const allProducts = await this.cartProduct.all();
            if (allProducts.length === 0) {
                break;
            }

            for (const product of allProducts) {
                await product.waitFor();
                await this.removeButton.first().waitFor();
                await this.removeButton.first().click();
                await this.page.waitForTimeout(1000);
                break;
            }
        }
    };
    proceedWithCheckout = async () => {

        await this.proceedToCheckoutButton.waitFor()
        await this.proceedToCheckoutButton.click()
    }

    placeOrder = async () => {
        await this.placeOrderButton.waitFor()
        await this.placeOrderButton.click()
    }

    populateCardDetailsAndPlaceOrder = async () => {
        //wait for elements to appear
        await this.nameOnCard.waitFor()
        await this.cardNumber.waitFor()
        await this.cvcNumber.waitFor()
        await this.expirationDate.waitFor()
        await this.expirationYear.waitFor()

        //populate card details
        await this.nameOnCard.fill('Test')
        await this.cardNumber.fill('4444333322221111')
        await this.cvcNumber.fill('123')
        await this.expirationDate.fill('12')
        await this.expirationYear.fill('2026')

        //pay order

        await this.confirmCardDetails.click()

    }

    verifyDeliveryDetails = async () => {
        // await this.deliveryDetailsAddressOne.waitFor()
        await expect(this.deliveryDetailsAddressOne.nth(0)).toHaveText('Fake Corp LLC')
    }

    verifyDeliveryDetails = async () => {

        await this.deliveryDetailsTable.waitFor()
        const deliveryDetailsList = await this.deliveryDetailsTable.locator('li')
        await expect(deliveryDetailsList).toHaveCount(8)
        await expect(deliveryDetailsList.nth(1)).toHaveText('Mr.' + ' ' + registrationDetails.firstName + ' ' + registrationDetails.lastName)
        await expect(deliveryDetailsList.nth(2)).toHaveText(registrationDetails.companyName)
        await expect(deliveryDetailsList.nth(3)).toHaveText(registrationDetails.streetAddress)
        await expect(deliveryDetailsList.nth(4)).toHaveText(registrationDetails.streetAddressTwo)
        await expect(deliveryDetailsList.nth(5)).toHaveText(registrationDetails.cityLocation + ' ' + registrationDetails.stateLocation + ' ' + registrationDetails.zipCodeLocation)
        await expect(deliveryDetailsList.nth(6)).toHaveText("United States")
        await expect(deliveryDetailsList.nth(7)).toHaveText(registrationDetails.phoneNumber)

    }

    verifyDeliveryDetailsForExistingUser = async (firstName, lastName,companyName, streetAddress, streetAddressTwo, cityLocation, stateLocation, zipCodeLocation, phoneNumber) => {

        await this.deliveryDetailsTable.waitFor()
        const deliveryDetailsList = await this.deliveryDetailsTable.locator('li')
        await expect(deliveryDetailsList).toHaveCount(8)
        await expect(deliveryDetailsList.nth(1)).toHaveText('Mr.' + ' ' + firstName + ' ' + lastName)
        await expect(deliveryDetailsList.nth(2)).toHaveText(companyName)
        await expect(deliveryDetailsList.nth(3)).toHaveText(streetAddress)
        await expect(deliveryDetailsList.nth(4)).toHaveText(streetAddressTwo)
        await expect(deliveryDetailsList.nth(5)).toHaveText(stateLocation + ' ' + cityLocation + ' ' + zipCodeLocation)
        await expect(deliveryDetailsList.nth(6)).toHaveText("United States")
        await expect(deliveryDetailsList.nth(7)).toHaveText(phoneNumber)
    }
    verifyAddedProductsToCart = async (productQuantity) => {
        await expect(this.cartProduct).toHaveCount(productQuantity)
    }

    verifyTotalPrice = async () => {
        const totalPrices = await this.totalPrice.all()
        totalPrices.forEach(async (price) => {
            await expect(price).not.toBeNull()
        })
    }

    verifyProductQuantity = async (expectedNUmber) => {

        await this.productQuantity.waitFor()
        const productQuantities = await this.productQuantity.allInnerTexts()
        const expectedNumber = parseInt(expectedNUmber, 10);
        const productQuantitiesInt = productQuantities.map(quantity => parseInt(quantity, 10));
        expect(productQuantitiesInt).toEqual([expectedNumber])

    }

    clickOnRegisterOrLoginLink = async () => {
        await this.registerOrLoginLink.waitFor()
        await this.registerOrLoginLink.click()
    }

    verifySuccessfulOrder = async () => {
        await expect(this.orderSuccessfulHeading).toBeVisible()
    }

    downloadInvoice = async () => {
        const downloadPromise = this.page.waitForEvent('download');
        await this.downloadInvoiceButton.click()
        const download = await downloadPromise;
        await download.saveAs('/Users/admin/Downloads' + download.suggestedFilename());
       const downloadUrl = download.url()
       return downloadUrl
    }
}