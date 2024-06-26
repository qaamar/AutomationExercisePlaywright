import { adminDetails } from "./../data/userDetails.js"

export const getLoginToken = async (elmail, password) => {

    const response = await fetch('https://automationexercise.com/api/verifyLogin', {
        method: 'POST',
        params: {
            email: adminDetails.email,
            password: adminDetails.password
        }
    })
    if (response.status !== 200) {
        throw new Error('Failed to get login token')
    }
    const body = await response.json()
    return body
}