const { test, expect } = require('@playwright/test');
import {getLoginToken} from "./../api-calls/getLoginToken.js"
import { adminDetails } from './../data/userDetails.js';

test('API login', async ({ page }) => {

    const loginToken = await getLoginToken(adminDetails.email, adminDetails.password)
    console.log({loginToken},adminDetails.password)
})

//how to inject cookies into website
