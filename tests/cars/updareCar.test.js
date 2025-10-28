import {test, describe, expect, beforeEach} from '@jest/globals';
import axios from 'axios';
import { QAAUTO_API_URL } from '../../src/constants/api';
import { fa, faker } from '@faker-js/faker';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import AuthController from '../../src/constants/controllers/AuthController';
import CarsController from '../../src/constants/controllers/CarsController';

describe("Update car", ()=>{
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

test('Should be able to edit car', async () => {
    const carBrandsResponse = await carsController.getCarBrands();
    const brand = carBrandsResponse.data.data[0];

    const carModelsResponse = await carsController.getCarModels();
    const model = carModelsResponse.data.data.find(model => model.carBrandId === brand.id);

    const requestBody = {
        "carBrandId": brand.id,
        "carModelId": model.id,
        "mileage": faker.number.int({ min: 1, max: 500_000 })
    };

    const response = await carsController.createCar(requestBody);
    expect(response.status).toBe(201);
    const createdCar = response.data.data;

    const updatedMileage = faker.number.int({ min: 500000, max: 1000_000 });
    const updateBody = { mileage: updatedMileage };

    const updatedCar = await carsController.updateUserCar(createdCar.id,updateBody);
    expect(updatedCar.status).toBe(200);

    const carByIdResponse = await carsController.getUserCarById(createdCar.id);
    expect(carByIdResponse.status).toBe(200);
    expect(carByIdResponse.data.data.mileage).toBe(updatedMileage);
})
});
   

