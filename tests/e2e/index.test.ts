import request from "supertest";
import express from "express";


const app = express();

app.get('/hello', function (req, res) {
  res.status(200).send('Hello World');
});

app.get('/user', function (req, res) {
  res.status(200).json({ name: 'john' });
});

describe('GET /hello', () => {
  it('get /hello and expect 200 (using done callback)', (done) => {
    request(app)
      .get('/hello')
      .expect(200)
      .expect('Hello World')
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
describe('GET /hello', () => {

  it('get /hello and expect 200', async () => {
    const response = await request(app).get('/hello');
    expect(response.status).toBe(200);
  });
});

