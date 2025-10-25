import {test, describe, expect, beforeEach} from '@jest/globals';
import axios from 'axios';
import { QAAUTO_API_URL } from '../../src/constants/api';
import { fa, faker } from '@faker-js/faker';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import AuthController from '../../src/constants/controllers/AuthController';
import CarsController from '../../src/constants/controllers/CarsController';

describe("Get car model by id", ()=>{
    const jar = new CookieJar()
    const client = wrapper(axios.create({
        baseURL: QAAUTO_API_URL,
        validateStatus: () => true,
    
        jar
    }))

const authController = new AuthController(client);
const carsController = new CarsController(client);

let userData;

beforeEach(async() => {
    const password = `Qwerty${faker.number.int({min: 100, max: 999})}`    
    const userData = {
        "name": faker.person.firstName(),
        "lastName": faker.person.lastName(),
        "email": faker.internet.email(),
        "password": password,
        "repeatPassword": password
}
    const signUpResponse = await authController.signUp(userData);
    expect(signUpResponse.status).toBe(201);

    const signInResponse = await authController.signIn({
        "email": userData.email,
        "password": userData.password,
        "remember": false
});
    expect(signInResponse.status).toBe(200);
})

test('Should be able to get car model by id', async () => {
    const carModelsResponse = await carsController.getCarModels();
    expect(carModelsResponse.status).toBe(200);

    const modelID = carModelsResponse.data.data[0].id;

    const modelResponse = await carsController.getCarModelById(modelID);
    expect(modelResponse.status).toBe(200);
    
     const modelData = modelResponse.data.data;

  
    expect(modelData).toEqual(
    expect.objectContaining({
      id: modelID,
      title: expect.any(String),
      carBrandId: expect.any(Number),
    })
  );
})
});
   