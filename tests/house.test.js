const request = require('supertest')
const app = require('../index.js');

const objectToTest = {
    "address" : 'Carrera 2A # 17A',
    "city" : "Bogotá D.C.",
    "state" : "Cundinamarca",
    "size" : 70,
    "type" : "Apartment",
    "zipCode" : "110111",
    "rooms" : 3,
    "bathrooms" : 2,
    "parking" : true,
    "price" : 260000000,
    "code" : "AAAA1234",
}
let id;

/*Successful Test*/
describe('POST /house', () => {
    it('Create a new user into the DB and response with data', async () => {
        const response = await request(app).post('/house').send(objectToTest);

        id = response.body._id;

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('_id')
        expect(response.body.address).toBe(objectToTest.address)
        expect(response.body.state).toBe(objectToTest.state)
        expect(response.body.size).toBe(objectToTest.size)
        expect(response.body.type).toBe(objectToTest.type)
        expect(response.body.zipCode).toBe(objectToTest.zipCode)
        expect(response.body.rooms).toBe(objectToTest.rooms)
        expect(response.body.bathrooms).toBe(objectToTest.bathrooms)
        expect(response.body.parking).toBe(objectToTest.parking)
        expect(response.body.price).toBe(objectToTest.price)
        expect(response.body.code).toBe(objectToTest.code)
    });
});

describe('GET /house/:id', () => {
    it('Should return an specific house by its id', async () => {
        const response = await request(app).get('/house/' + id);

        expect(response.status).toBe(200);
        expect(typeof response.body === 'object').toBe(true);
        expect(response.body._id).toBe(id);
        expect(response.body.address).toBe(objectToTest.address)
        expect(response.body.state).toBe(objectToTest.state)
        expect(response.body.size).toBe(objectToTest.size)
        expect(response.body.type).toBe(objectToTest.type)
        expect(response.body.zipCode).toBe(objectToTest.zipCode)
        expect(response.body.rooms).toBe(objectToTest.rooms)
        expect(response.body.bathrooms).toBe(objectToTest.bathrooms)
        expect(response.body.parking).toBe(objectToTest.parking)
        expect(response.body.price).toBe(objectToTest.price)
        expect(response.body.code).toBe(objectToTest.code)

    });

});

describe('PUT /house/:id', () => {
    it('Should return a house with updated fields', async () => {
        const updatedHouse = {
            "address" : 'Carrera 2A # 17A',
            "city" : "Bogotá D.C.",
            "state" : "Cundinamarca",
            "size" : 100,
            "type" : "Apartment",
            "zipCode" : "110111",
            "rooms" : 3,
            "bathrooms" : 2,
            "parking" : true,
            "price" : 260000000,
            "code" : "AAAA1234",
        }
        const response = await request(app).put('/house/' + id).send(updatedHouse);

        expect(response.body._id).toBe(id);
        expect(response.statusCode).toBe(200);
        expect(response.body.size).toBe(updatedHouse.size);
    });
});

describe('DELETE /house/:id', () => {
    it('Should delete the houseId input by user', async () => {

        const response = await request(app).delete('/house/' + id);

        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe("success")
    })
})


/*Failed tests*/

const objectToTestFail = {
    "address" : 'Carrera 2A # 17A',
    // "city" : "Bogotá D.C.",
    "state" : "Cundinamarca",
    "size" : 70,
    "type" : "Apartment",
    "zipCode" : "110111",
    "rooms" : 3,
    "bathrooms" : 2,
    "parking" : true,
    "price" : 260000000,
    "code" : "AAAA1234",
}

let idObjectFail;

describe('POST /house', () => {
    it('Try to create a new house but failed because a field city was empty', async () => {
        const response = await request(app).post('/house').send(objectToTestFail);

        idObjectFail = response.body._id;

        expect(response.statusCode).toBe(400);
    });
});



