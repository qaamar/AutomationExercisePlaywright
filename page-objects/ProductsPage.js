import { faker } from '@faker-js/faker';
import { expect } from '@playwright/test';
export class ProductsPage {
    constructor(page) {
        this.page = page
        this.addToCart = page.getByRole('button', { name: ' Add to cart' })
        this.overlayAddToCartBtn = page.locator('.overlay-content > .btn').first()
        this.overlayAddToCartBtn2 = page.locator('.overlay-content > .btn').nth(1)
        this.addConfirmation = page.getByRole('heading', { name: 'Added!' })
        this.viewCart = page.getByRole('link', { name: 'View cart' })
        this.searchField = page.getByPlaceholder('Search Product')
        this.searchedProductsTitle = page.getByRole('heading', { name: 'Searched Products' })
        this.submitSearchBtn = page.locator('[id="submit_search"]')
        this.addFirstRecommendedProductButton = page.locator('div:nth-child(2) > div > .product-image-wrapper > .single-products > .productinfo > .btn').first()
        this.productCards = page.locator('.features_items .single-products'); //na ovaj nacin mozemo nađi listu svih proizvoda u proizvodima
        this.productName = page.getByRole('heading', { name: 'Blue Top' }) // this will select the first h2 element on the page. If there are multiple h2 elements, we might need to be more specific
        this.category = page.getByText('Category: Women > Tops')
        this.price = page.getByText('Rs.')
        this.availability = page.getByText('Availability:')
        this.condition = page.getByText('Condition:')
        this.brand = page.getByText('Brand:')
        this.continueShoppingBtn = page.getByRole('button', { name: 'Continue Shopping' })
        this.quantityPicker = page.locator('[type="number"]')
        this.womensDressPage = page.getByRole('heading', { name: 'Women - Dress Products' })
        this.menTshirtsPage = page.getByRole('heading', { name: 'Men - Tshirts Products' })
        this.brandsTitle = page.getByRole('heading', { name: 'Brands' })
        this.brands = page.locator('.brands-name')
        this.brandHandM = page.locator("[href='/brand_products/H&M']")
        this.brandPolo = page.locator("[href='/brand_products/Polo']")
        this.brandLocators = {
            'H&M': this.brandHandM,
            'Polo': this.brandPolo,
            // Add more brands here
        };
        this.allProductsTitle = page.getByRole('heading', { name: 'All Products' })

        //product review
        this.reviewTitle = page.getByRole('link', { name: 'Write Your Review' })
        this.reviewName = page.getByPlaceholder('Your Name')
        this.reviewEmail = page.getByPlaceholder('Email Address', { exact: true })
        this.reviewText = page.getByPlaceholder('Add Review Here!')
        this.submitReviewBtn = page.getByRole('button', { name: 'Submit' })
        this.successMessage = page.getByText('Thank you for your review.')
    }
    getProductLocator(prodNum) {
        return this.page.locator('.single-products').nth(prodNum);
    } // za kreaciju dinamickih elementa na stranici
    getProductOverlayLocator(index) {
        return this.page.locator('.product-overlay').nth(index)
    }
    getOverlayAddToCartBtnLocator(index) {
        return this.page.locator('.overlay-content > .btn').nth(index)
    }

    clickOnAddToCart = async () => {
        await this.addToCart.waitFor();
        await this.addToCart.click();
    }
    verifyAddToCartConfirmation = async () => {
        await expect(this.addConfirmation).toBeVisible();
    }

    clickOnViewCart = async () => {
        await this.viewCart.waitFor();
        await this.viewCart.click();
    }

    clickOnViewProduct = async (prodNum) => {
        await this.getProductLocator(prodNum).click();
    }

    verifyProductsOnThePage = async () => {
        const productsCount = await this.productCards.count()
        await expect(productsCount).toBeGreaterThanOrEqual(1);
    }

    verifyAllProductsDetailsAreVisible = async () => {
        await expect(this.productName).toBeVisible();
        await expect(this.category).toBeVisible();
        await expect(this.price).toBeVisible();
        await expect(this.availability).toBeVisible();
        await expect(this.condition).toBeVisible();
        await expect(this.brand).toBeVisible();

    }
    searchForProduct = async (product) => {
        await this.searchField.waitFor()
        await this.searchField.fill(product)
        await this.submitSearchBtn.click()
        //fill field
    }

    verifySearchedProductsTitle = async () => {
        await expect(this.searchedProductsTitle).toBeVisible()
    }

    verifySearchedProducts = async () => {
        const productCount = await this.productCards.count()
        await expect(productCount).toBeGreaterThanOrEqual(1)
    }

    hoverOverProduct = async (prodNum, prodOverlayNum) => {
        const product = await this.getProductLocator(prodNum)
        const productOverlay = await this.getProductOverlayLocator(prodOverlayNum)
        await product.hover()
        await productOverlay.waitFor()
    }

    clickOnOverlayAddToCartBtn = async () => {
        await this.overlayAddToCartBtn.waitFor()
        await this.overlayAddToCartBtn.click()
    }
    clickOnOverlayAddToCartBtn2 = async (index) => {
        await this.overlayAddToCartBtn2.waitFor()
        await this.getOverlayAddToCartBtnLocator(index).click()
    }

    clickOnContinueShoppingBtn = async () => {
        await this.continueShoppingBtn.waitFor()
        await this.continueShoppingBtn.click()
    }

    increaseProductQuantity = async (num) => {
        await this.quantityPicker.waitFor()
        await this.quantityPicker.fill(num)
    }
    verifyUserIsOnWomensDressPage = async () => {
        await this.womensDressPage.waitFor()
        await expect(this.womensDressPage).toBeVisible()
    }
    verifyUserIsOnMensTshirtsPage = async () => {
        await this.menTshirtsPage.waitFor()
        await expect(this.menTshirtsPage).toBeVisible()
    }

    verifyBrandsList = async () => {
        await this.brandsTitle.waitFor()
        await expect(this.brandsTitle).toBeVisible()
    }

    verifyNumberOfBrands = async (expectedNumber) => {
        const parentLocator = this.brands
        const numberOfBrands = await parentLocator.locator('li').count()
        await expect(numberOfBrands).toBe(expectedNumber)
    }

    selectBrand = async (brandName) => {
        const brandLocator = this.brandLocators[brandName];
        if (brandLocator) {
            await brandLocator.waitFor();
            await brandLocator.click();
        } else {
            throw new Error(`Brand ${brandName} is not defined in the mapping object`);
        }
    } // add rest of brands

    verifyUserIsOnBrandPage = async (brand) => {
        if (brand === 'H&M') {
            const brandPage = '/brand_products/H&M'
            await this.page.waitForURL(brandPage)
        }
        if (brand === 'Polo') {
            const brandPage = '/brand_products/Polo'
            await this.page.waitForURL(brandPage)
        }
    } // add rest of brands

    verifyAllProductsTitle = async () => {
        await this.allProductsTitle.waitFor()
        await expect(this.allProductsTitle).toBeVisible()
    }

    submitReview = async () => {
        await this.reviewTitle.waitFor()
        await this.reviewName.fill(faker.person.firstName())
        await this.reviewEmail.fill(faker.internet.email())
        await this.reviewText.fill(faker.lorem.paragraph())
        await this.submitReviewBtn.click()
    }

    verifySuccessMessageAfterReview = async () => {
        await this.successMessage.waitFor()
        await expect(this.successMessage).toBeVisible()
    }
    addFirstRecommendedProduct = async () => {
        await this.addFirstRecommendedProductButton.scrollIntoViewIfNeeded()
        await this.addFirstRecommendedProductButton.click()
    }


}