import { faker } from "@faker-js/faker"

const fakeName = faker.person.firstName()
const fakeEmail = faker.internet.email()
const fakeSubject = faker.lorem.sentence()
const fakeParagraph = faker.lorem.paragraph()

export const adminDetails = {
    email: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
    firstName: 'Test',
    lastName: 'User',
    companyName:"Fake Corp LLC",
    streetAddress:'Test lane 1',
    streetAddressTwo:" ",
    stateLocation:'California',
    cityLocation:'Los Angeles',
    zipCodeLocation:'90003',
    phoneNumber:'+441234567892'

}

export const contactUsUserDetails = {
    name: fakeName,
    email: fakeEmail,
    subject: fakeSubject,
    message: fakeParagraph
}
