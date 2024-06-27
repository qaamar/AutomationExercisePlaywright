const {faker} = require ('@faker-js/faker')
const firstName = faker.person.firstName()
const password = faker.internet.password()
const lastName = faker.person.lastName()
const companyName = faker.company.name()
const streetAddress = faker.location.streetAddress()
const streetAddressTwo = faker.location.secondaryAddress()
const stateLocation = faker.location.state()
const cityLocation = faker.location.city()
const zipCodeLocation = faker.location.zipCode()
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
