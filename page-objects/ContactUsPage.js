const {expect} = require('@playwright/test');
import {contactUsUserDetails} from "../data/userDetails.js"
export class ContactUsPage {
    constructor(page) {
        this.page = page;

        this.contactUsTitle = page.getByRole('heading', { name: 'Contact Us' })
        this.getInTouch = page.getByRole('heading', { name: 'Get In Touch' })
        this.nameField = page.getByPlaceholder('Name')
        this.emailField = page.getByPlaceholder('Email', { exact: true })
        this.subjectField= page.getByPlaceholder('Subject')
        this.messageField = page.getByPlaceholder('Your Message Here')
        this.chooseFileBtn = page.locator('input[name="upload_file"]')
        this.submitBtn = page.getByRole('button', { name: 'Submit' })
        
    }

    verifyTitlesAreVisible = async () => {
        await this.contactUsTitle.waitFor();
        await this.getInTouch.waitFor();
    }

    populateContactUsForm = async () => {
        await this.nameField.fill(contactUsUserDetails.name)
        await this.emailField.fill(contactUsUserDetails.email)
        await this.subjectField.fill(contactUsUserDetails.subject)
        await this.messageField.fill(contactUsUserDetails.message)
    }

    uploadFile = async () => {
        const filePath = '/Users/admin/Downloads/invoice.txt'
        await this.chooseFileBtn.click()
        await this.chooseFileBtn.setInputFiles(filePath)
        this.page.on('dialog', dialog => dialog.accept());
        await this.submitBtn.click()
    }
    verifySuccessMessage = async () => {
        await expect(this.page.locator("[class='status alert alert-success']")).toBeVisible()
    }

}