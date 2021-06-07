/*----------------------------------------------------------*
*                     Terminal commands                     *
*-----------------------------------------------------------*
*           Path Navigation:        ls / dir                *
*                                   cd to server folder     *
*-----------------------------------------------------------*
*           Install Dependencies:   npm install             *
*           Run Unit Tests:         npm test                *
*           Code Coverage:          npm run coverage        *
* ----------------------------------------------------------*/

let mocha = require('mocha');
let chai = require('chai');
let chaiHttp = require('chai-http');
let describe = mocha.describe;
let expect = chai.expect;
let assert = require('chai').assert;

chai.should();
chai.use(chaiHttp);
require("./gateway/mcdb_gateway/server");
let server = 'http://localhost:8000';

describe('Movies API', () => {

    /*
    * Test the GET route
    */
    describe('Test GET route /movie', () => {
        it('it should GET all the movies', (done) => {
            chai.request(server)
                .get('/movie')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(73);
                    done();
                });
        });

        it('it should NOT GET all the movies', (done) => {
            chai.request(server)
                .get('/movies')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
    /*
    * Test the GET by id route
    */
    describe('Test GET route /movie/:id', () => {
        it('it should GET a movie by id', (done) => {
            const movieId = 1;
            chai.request(server)
                .get('/movie/' + movieId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('title');
                    res.body.should.have.property('overview');
                    res.body.should.have.property('runtime');
                    res.body.should.have.property('releaseDate');
                    res.body.should.have.property('createdAt');
                    res.body.should.have.property('poster');
                    res.body.should.have.property('id').eql(movieId);
                    res.body.should.have.property('title').eql('The Godfather (1972)');
                    done();
                });
        });

        it('it should NOT GET any movie', (done) => {
            const movieId = -1;
            chai.request(server)
                .get('/movie/' + movieId)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql(`Movie with this ID (${movieId}) does not exist!`);
                    done();
                });
        });
    });

});