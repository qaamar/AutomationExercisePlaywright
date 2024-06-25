const {faker} = require ('@faker-js/faker')
const firstName = faker.name.firstName()
const password = faker.internet.password()
const lastName = faker.name.lastName()
const companyName = faker.company.name()
const streetAddress = faker.address.streetAddress()
const streetAddressTwo = faker.address.secondaryAddress()
const stateLocation = faker.address.state()
const cityLocation = faker.address.city()
const zipCodeLocation = faker.address.zipCode()
const phoneNumber = faker.phone.number()

export const registrationDetails = {

    firstName: firstName,
    lastName: lastName,
    password: password,
    companyName:companyName,
    streetAddress:streetAddress,
    streetAddressTwo:streetAddressTwo,
    stateLocation:stateLocation,
    cityLocation:cityLocation,
    zipCodeLocation:zipCodeLocation,
    phoneNumber:phoneNumber

}
