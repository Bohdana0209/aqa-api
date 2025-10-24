import {test, describe, expect, beforeEach} from '@jest/globals';
import axios from 'axios';
import { QAAUTO_API_URL } from '../../src/constants/api';
import { fa, faker } from '@faker-js/faker';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import moment from 'moment/moment';
import AuthController from '../../src/constants/controllers/AuthController';
import CarsController from '../../src/constants/controllers/CarsController';

describe("Create car", ()=>{
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

test('Should be able to get car brands', async () => {
    const carBrandsResponse = await carsController.getCarBrands();
    expect(carBrandsResponse.status).toBe(200);
    expect(Array.isArray(carBrandsResponse.data.data)).toBe(true);
})

test('Should be able to get car brand by id', async () => {
    const carBrandsResponse = await carsController.getCarBrands();
    expect(carBrandsResponse.status).toBe(200);

    const brandID = carBrandsResponse.data.data[0].id;

    const brandResponse = await carsController.getCarBrandByID(brandID);
    expect(brandResponse.status).toBe(200);
    expect(brandResponse.data.data.id).toBe(brandID);
})

test('Should be able to get car models', async () => {
   const carModelsResponse = await carsController.getCarModels();
    expect(carModelsResponse.status).toBe(200);
})

test('Should be able to get car model by id', async () => {
    const carModelsResponse = await carsController.getCarModels();
    expect(carModelsResponse.status).toBe(200);

    const modelID = carModelsResponse.data.data[0].id;

    const modelResponse = await carsController.getCarModelById(modelID);
    expect(modelResponse.status).toBe(200);
    expect(modelResponse.data.data.id).toBe(modelID);
})

test('Should be able to create a Car', async () => {
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
    const expectedData = {
            "id": expect.any(Number),
            "carBrandId": requestBody.carBrandId,
            "carModelId": requestBody.carModelId,
            "initialMileage": requestBody.mileage,
            "carCreatedAt":  expect.any(String) , 
            "updatedMileageAt":  expect.any(String) , 
            "mileage": requestBody.mileage,
            "brand": brand.title,
            "model": model.title,
            "logo": brand.logoFilename
        }
    expect(createdCar).toEqual(expectedData)
})

test('Should be able to get cars', async () => {
    const userCars = await carsController.getUserCars();
    expect(userCars.status).toBe(200);
})

test('Should be able to get car by Id', async () => {
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

    const carByIdResponse = await client.get(`/api/cars/${createdCar.id}`);
    expect(carByIdResponse.status).toBe(200);
    expect(carByIdResponse.data.data.id).toBe(createdCar.id)
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

test('Should be able to delete car by Id', async () => {
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

    const deleteResponse = await carsController.deleteUserCar(createdCar.id);
    expect(deleteResponse.status).toBe(200);

    const deletedCarByIdResponse = await carsController.getUserCarById(createdCar.id);
    expect(deletedCarByIdResponse.status).toBe(404);
})
});
   

