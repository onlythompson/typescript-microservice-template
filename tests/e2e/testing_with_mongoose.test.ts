import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { create } from "domain";


let app: express.Application;


describe('/api/v1/users', () => {
    beforeAll(() => {
        mongoose
            .connect('mongodb://localhost:27017/test')
            .then(() => {
                console.log('Connected to MongoDB');
            })
            .catch((error) => {
                console.error('Error connecting to MongoDB: ', error);
            });

        app = express();
        // app = createApp();
    });

    afterAll(async () => {
        //await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it('should return 200', async () => {
        //Typically, you would use the app instance from your server file
        // const response = await request(app).get('/hello');
        // expect(response.status).toBe(200);
        app.get('/hello', function (req, res) {
            res.status(200).send('Hello World');
        });

        const response = await request(app).get('/hello');
        expect(response.status).toBe(200);
    });

});