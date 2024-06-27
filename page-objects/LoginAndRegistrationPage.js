import { expect } from '@playwright/test'
import { faker } from "@faker-js/faker"
import { registrationDetails } from "../data/registrationDetails.js"



export class LoginAndRegistrationPage {
    constructor(page) {
        //#region Login elements

        this.page = page
        this.loginEmailInput = page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address')
        this.loginPasswordInput = page.getByPlaceholder('Password')
        this.loginButton = page.getByRole('button', { name: 'Login' })
        this.loginHeading = page.getByRole('heading', { name: 'Login to your account' })
        this.loginError = page.locator('[style="color: red;"]')
        //#endregion

        //#region Registration form elements
        this.newUserSignupHeading = page.getByRole('heading', { name: 'New User Signup!' })
        this.registerName = page.getByPlaceholder('Name')
        this.registerEmailInput = page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address')
        this.registerButton = page.getByRole('button', { name: 'Signup' })
        this.mrTitlePicker = page.getByLabel('Mr.')
        this.mrsTitlePicker = page.getByLabel('Mrs.')
        this.accountPassword = page.getByLabel('Password *')
        this.dayOfBirth = page.locator('#days')
        this.monthOfBirth = page.locator('#months')
        this.yearOfBirth = page.locator('#years')
        this.newsletterCheckbox = page.getByLabel('Sign up for our newsletter!')
        this.specialOffersCheckbox = page.getByLabel('Receive special offers from')
        this.accountFirstName = page.getByLabel('First name *')
        this.accountLastName = page.getByLabel('Last name *')
        this.companyName = page.getByLabel('Company', { exact: true })
        this.streetAddress = page.getByLabel('Address * (Street address, P.')
        this.streetAddressTwo = page.getByLabel('Address 2')
        this.countryLocation = page.getByLabel('Country *')
        this.stateLocation = page.getByLabel('State *')
        this.cityLocation = page.getByLabel('City *')
        this.zipCodeLocation = page.locator('#zipcode')
        this.phoneNumber = page.getByLabel('Mobile Number *')
        this.createAccountButton = page.getByRole('button', { name: 'Create Account' })
        this.enterAccountInfoLabel = page.getByText('Enter Account Information')
        this.registrationError = page.locator('[style="color: red;"]')

        //#endregion

        //#region Account created or deleted confirmation page
        this.confirmButton = page.getByRole('link', { name: 'Continue' })
        this.accountCreatedTitle = page.locator('[data-qa="account-created"]')

        this.accountDeletedTitle = page.locator('[data-qa="account-deleted"]')
        this.continueButton = page.getByRole('link', { name: 'Continue' })
        //#endregion


    }

    //#region Methods

    loginToWebsite = async (email, password) => {
        await this.loginEmailInput.waitFor()
        await this.loginEmailInput.fill(email)
        await this.loginPasswordInput.waitFor()
        await this.loginPasswordInput.fill(password)
        await this.loginButton.click()
    }

    waitForNewSignupElements = async () => {
        await this.newUserSignupHeading.waitFor()
        await this.registerName.waitFor()
        await this.registerEmailInput.waitFor()
        await this.registerButton.waitFor()
    }

    registerToWebsite = async (email) => {
        await this.registerName.fill(registrationDetails.firstName)
        await this.registerEmailInput.fill(email)
        await this.registerButton.click()
    }

    fillOutRegistrationForm = async () => {
        await this.waitAllEllementsAreDisplayed()
        await this.mrTitlePicker.click()
        await this.accountPassword.fill(registrationDetails.password)
        await this.dateOfBirth()
        await this.newsletterCheckbox.check()
        await this.specialOffersCheckbox.check()
        await this.accountFirstName.fill(registrationDetails.firstName)
        await this.accountLastName.fill(registrationDetails.lastName)
        await this.countryLocation.selectOption('United States')
        await this.companyName.fill(registrationDetails.companyName)
        await this.streetAddress.fill(registrationDetails.streetAddress)
        await this.streetAddressTwo.fill(registrationDetails.streetAddressTwo)
        await this.stateLocation.fill(registrationDetails.stateLocation)
        await this.cityLocation.fill(registrationDetails.cityLocation)
        await this.zipCodeLocation.fill(registrationDetails.zipCodeLocation)
        await this.phoneNumber.fill(registrationDetails.phoneNumber)
        await this.createAccountButton.click()
    }

    waitAllEllementsAreDisplayed = async () => {
        await this.enterAccountInfoLabel.waitFor()
        await this.mrTitlePicker.waitFor()
        await this.accountPassword.waitFor()
        await this.newsletterCheckbox.waitFor()
        await this.specialOffersCheckbox.waitFor()
        await this.accountFirstName.waitFor()
        await this.accountLastName.waitFor()
        await this.companyName.waitFor()
        await this.streetAddress.waitFor()
        await this.streetAddressTwo.waitFor()
        await this.stateLocation.waitFor()
        await this.cityLocation.waitFor()
        await this.zipCodeLocation.waitFor()
        await this.phoneNumber.waitFor()
        await this.createAccountButton.waitFor()
    }

    dateOfBirth = async () => {
        await this.dayOfBirth.selectOption(faker.number.int({ min: 1, max: 30 }).toString())
        await this.monthOfBirth.selectOption(faker.number.int({ min: 1, max: 12 }).toString())
        await this.yearOfBirth.selectOption(faker.number.int({ min: 1950, max: 2000 }).toString())
    }

    verifyAccountCreatedSuccessfully = async () => {
        await this.accountCreatedTitle.waitFor()
        expect(this.accountCreatedTitle).toHaveText('Account Created!')
        await this.confirmButton.click()
    }

    verifyAccountDeletedSuccessfully = async () => {
        await this.accountDeletedTitle.waitFor()
        await expect(this.accountDeletedTitle).toHaveText('Account Deleted!')
        await this.page.waitForURL(/.*delete_account/)
        await this.continueButton.click()
    }

    verifyErrorLogin = async () => {
        await expect(this.loginError).toHaveText('Your email or password is incorrect!')
    }

    verifyErrorRegistration = async () => {
        await expect(this.registrationError).toHaveText('Email Address already exist!')

    }
    //#endregion

}