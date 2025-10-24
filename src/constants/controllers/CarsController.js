import BaseController from "./BaseController";

export default class CarsController extends BaseController {

    getCarBrands() {
        return this.client.get('/api/cars/brands');
    }

    getCarBrandByID(id) {
        return this.client.get(`/api/cars/brands/${id}`);
    }

    getCarModels() {
        return this.client.get('/api/cars/models');
    }

    getCarModelById(id) {
        return this.client.get(`/api/cars/models/${id}`);
    }

    getUserCars() {
        return this.client.get('/api/cars');
    }

    getUserCarById(id) {
        return this.client.get(`/api/cars/${id}`);
    }

    createCar(carData){
        return this.client.post('/api/cars', carData );
    }

    updateUserCar(id, updatedData){
        return this.client.put(`/api/cars/${id}`, updatedData );
    }

    deleteUserCar(id){
        return this.client.delete(`/api/cars/${id}`);
    }
}