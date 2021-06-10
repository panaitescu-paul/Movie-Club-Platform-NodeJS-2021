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
                    res.body.should.have.property('trailerLink');
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

    /*
    * Test the POST route
    */
    describe('Test POST route /movie', () => {
        it('it should POST a movie', (done) => {
            let movie = {
                title: "Test Movie Title",
                overview: "Test Movie Overview",
                runtime: "1h 45min",
                trailerLink: "Test Trailer Link",
                poster: "Test Poster",
                releaseDate: "2021-01-01"
            };
            chai.request(server)
                .post('/movie')
                .send(movie)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('title');
                    res.body.should.have.property('overview');
                    res.body.should.have.property('runtime');
                    res.body.should.have.property('releaseDate');
                    res.body.should.have.property('createdAt');
                    res.body.should.have.property('poster');
                    res.body.should.have.property('trailerLink');
                    res.body.should.have.property('title').eql(movie.title);
                    res.body.should.have.property('overview').eql(movie.overview);
                    res.body.should.have.property('runtime').eql(movie.runtime);
                    res.body.should.have.property('trailerLink').eql(movie.trailerLink);
                    res.body.should.have.property('poster').eql(movie.poster);
                    const releaseDate = formatDate(res.body.releaseDate);
                    releaseDate.should.eql(movie.releaseDate);
                    done();
                });
        });

        it('it should NOT POST a movie that already exists in the database', (done) => {
            let movie = {
                title: "Test Movie Title",
                overview: "Test Movie Overview",
                runtime: "1h 45min",
                trailerLink: "Test Trailer Link",
                poster: "Test Poster",
                releaseDate: "2021-01-01"
            }
            chai.request(server)
                .post('/movie')
                .send(movie)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql('Movie with this Title already exists!');
                    done();
                });
        });

        it('it should NOT POST a movie with no title', (done) => {
            let movie = {
                title: "",
                overview: "Test Movie Overview",
                runtime: "1h 45min",
                trailerLink: "Test Trailer Link",
                poster: "Test Poster",
                releaseDate: "2021-01-01"
            }
            chai.request(server)
                .post('/movie')
                .send(movie)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql('Title can not be null!');
                    done();
                });
        });
    });
    /*
    * Test the PUT route
    */
    describe('Test PUT route /movie/:id', () => {
        it('it should UPDATE a movie given the id', (done) => {
            let updatedMovie = {
                title: "Test Movie Title",
                overview: "Test Movie Overview 2",
                runtime: "1h 45min",
                trailerLink: "Test Trailer Link 2",
                poster: "Test Poster 2",
                releaseDate: "2021-01-01"
            };
            // get all movies to find the last movie inserted in the database
            chai.request(server)
                .get('/movie')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    let movies = res.body;
                    const lastMovie = movies[movies.length - 1];
                    chai.request(server)
                        .put('/movie/' + lastMovie.id)
                        .send(updatedMovie)
                        .end((err, res) => {
                            res.should.have.status(204);
                            done();
                        });
                });
        });

        it('it should NOT UPDATE a movie with no title', (done) => {
            let updatedMovie = {
                title: "",
                overview: "Test Movie Overview2",
                runtime: "1h 45min",
                trailerLink: "Test Trailer Link2",
                poster: "Test Poster 2",
                releaseDate: "2021-01-01"
            }
            // get all movies to find the last movie inserted in the database
            chai.request(server)
                .get('/movie')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    let movies = res.body;
                    const lastMovie = movies[movies.length - 1];
                    chai.request(server)
                        .put('/movie/' + lastMovie.id)
                        .send(updatedMovie)
                        .end((err, res) => {
                            res.should.have.status(409);
                            res.body.should.have.property('message');
                            res.body.should.have.property('message').eql('Title can not be null!');
                            done();
                        });
                });
        });

        it('it should NOT UPDATE a movie that does not exist', (done) => {
            const movieId = -1;
            let updatedMovie = {
                title: "Test Movie Title 2",
                overview: "Test Movie Overview 2",
                runtime: "1h 45min",
                trailerLink: "Test Trailer Link 2",
                poster: "Test Poster 2",
                releaseDate: "2021-01-01"
            }
            // get all movies to find the last movie inserted in the database
            chai.request(server)
                .put('/movie/' + movieId)
                .send(updatedMovie)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql(`Movie with this ID (${movieId}) does not exist!`);
                    done();
                });
        });

        it('it should NOT UPDATE if the movie title already exists', (done) => {
            let updatedMovie = {
                title: "The Godfather (1972)",
                overview: "Test Movie Overview2",
                runtime: "1h 45min",
                trailerLink: "Test Trailer Link2",
                poster: "Test Poster 2",
                releaseDate: "2021-01-01"
            }
            // get all movies to find the last movie inserted in the database
            chai.request(server)
                .get('/movie')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    let movies = res.body;
                    const lastMovie = movies[movies.length - 1];
                    chai.request(server)
                        .put('/movie/' + lastMovie.id)
                        .send(updatedMovie)
                        .end((err, res) => {
                            res.should.have.status(409);
                            res.body.should.have.property('message');
                            res.body.should.have.property('message').eql('Movie with this Title already exists!');
                            done();
                        });
                });
        });
    });
    /*
    * Test the DELETE route
    */
    describe('Test DELETE route /movie/:id', () => {
        it('it should DELETE a movie given the id', (done) => {
            // get all movies to find the last movie inserted in the database
            chai.request(server)
                .get('/movie')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    let movies = res.body;
                    const lastMovie = movies[movies.length - 1];
                    chai.request(server)
                        .delete('/movie/' + lastMovie.id)
                        .end((err, res) => {
                            res.should.have.status(204);
                            done();
                        });
                });
        });
        it('it should NOT DELETE a movie that does not exist', (done) => {
            const movieId = -1;
            chai.request(server)
                .delete('/movie/' + movieId)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql(`Movie with this ID (${movieId}) does not exist!`);
                    done();
                });
        });
    });
});



// Tests for Crews

// Tests for Admins

// Tests for Users
describe('Users API', () => {
    /*
    * Test the GET route
    */
    describe('Test GET route /user', () => {
        it('it should GET all the users', (done) => {
            chai.request(server)
                .get('/user')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

    });
function formatDate(date) {
    if (date == null) {
        return 'Unknown';
    } else {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }
}
// test