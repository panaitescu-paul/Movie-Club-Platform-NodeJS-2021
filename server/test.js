/**
* Unit Tests for Services from the RESTful API
*
* @version 1.0 1 JUNE 2021
*/

/*----------------------------------------------------------*
*                     Terminal commands                     *
*-----------------------------------------------------------*
*           Path Navigation:        ls / dir                *
*                                   cd to server folder     *
*-----------------------------------------------------------*
*           Install Dependencies:   npm install             *
*           Run Unit Tests:         npm test                *
*           Code Coverage:          npm run coverage        *
*-----------------------------------------------------------*/

let mocha = require('mocha');
let chai = require('chai');
let chaiHttp = require('chai-http');
let describe = mocha.describe;

chai.should();
chai.use(chaiHttp);
require("./gateway/mcdb_gateway/server");
let server = 'http://localhost:8000';

// ******************************************************
// ***                                                ***
// ***          Unit Tests for Movies API             ***
// ***                                                ***
// ******************************************************

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

// ******************************************************
// ***                                                ***
// ***           Unit Tests for Crews API             ***
// ***                                                ***
// ******************************************************

describe('Crews API', () => {
    /*
    * Test the GET route
    */
    describe('Test GET route /crew', () => {
        it('it should GET all the crew', (done) => {
            chai.request(server)
                .get('/crew')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        it('it should NOT GET all the crew', (done) => {
            chai.request(server)
                .get('/crews')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
    /*
    * Test the GET by id route
    */
    describe('Test GET route /crew/:id', () => {
        it('it should GET a crew by id', (done) => {
            const crewId = 1;
            chai.request(server)
                .get('/crew/' + crewId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('mainActivity');
                    res.body.should.have.property('dateOfBirth');
                    res.body.should.have.property('birthPlace');
                    res.body.should.have.property('biography');
                    res.body.should.have.property('picture');
                    res.body.should.have.property('website');
                    res.body.should.have.property('id').eql(crewId);
                    res.body.should.have.property('name').eql('Quentin Tarantino');
                    done();
                });
        });

        it('it should NOT GET any crew', (done) => {
            const crewId = -1;
            chai.request(server)
                .get('/crew/' + crewId)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql(`No crew member found with the id ${crewId}!`);
                    done();
                });
        });
    });

    /*
    * Test the POST route
    */
    describe('Test POST route /crew', () => {
        it('it should POST a crew', (done) => {
            let crew = {
                name: "Test Crew Name",
                mainActivity: "Test Movie Overview",
                dateOfBirth: "2021-06-06",
                birthPlace: "Test Birth Place",
                biography: "Test Biography",
                picture: "2021-01-01",
                website: "www.test.com"
            };
            chai.request(server)
                .post('/crew')
                .send(crew)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('mainActivity');
                    res.body.should.have.property('dateOfBirth');
                    res.body.should.have.property('birthPlace');
                    res.body.should.have.property('biography');
                    res.body.should.have.property('picture');
                    res.body.should.have.property('website');
                    res.body.should.have.property('name').eql(crew.name);
                    res.body.should.have.property('mainActivity').eql(crew.mainActivity);
                    res.body.should.have.property('birthPlace').eql(crew.birthPlace);
                    res.body.should.have.property('biography').eql(crew.biography);
                    res.body.should.have.property('picture').eql(crew.picture);
                    res.body.should.have.property('website').eql(crew.website);
                    const dateOfBirth = formatDate(res.body.dateOfBirth);
                    dateOfBirth.should.eql(crew.dateOfBirth);
                    done();
                });
        });

        it('it should NOT POST a crew with no title', (done) => {
            let crew = {
                name: "",
                mainActivity: "Test Movie Overview",
                dateOfBirth: "2021-06-06",
                birthPlace: "Test Birth Place",
                biography: "Test Biography",
                picture: "2021-01-01",
                website: "www.test.com"
            };
            chai.request(server)
                .post('/crew')
                .send(crew)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql('The Crew must have a name!');
                    done();
                });
        });
    });
    /*
    * Test the PUT route
    */
    describe('Test PUT route /crew/:id', () => {
        it('it should UPDATE a crew given the id', (done) => {
            let updatedCrew = {
                name: "Test Crew Name",
                mainActivity: "Test Movie Overview 2",
                dateOfBirth: "2021-06-06",
                birthPlace: "Test Birth Place 2",
                biography: "Test Biography 2",
                picture: "2021-01-01",
                website: "www.test12.com"
            };
            // get all movies to find the last movie inserted in the database
            chai.request(server)
                .get('/crew')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    let crews = res.body;
                    const lastCrew = crews[crews.length - 1];
                    chai.request(server)
                        .put('/crew/' + lastCrew.id)
                        .send(updatedCrew)
                        .end((err, res) => {
                            res.should.have.status(204);
                            done();
                        });
                });
        });

        it('it should NOT UPDATE a crew that does not exist', (done) => {
            const crewId = -1;
            let updatedCrew = {
                name: "Test Crew Name2",
                mainActivity: "Test Movie Overview 2",
                dateOfBirth: "2021-06-06",
                birthPlace: "Test Birth Place 2",
                biography: "Test Biography 2",
                picture: "2021-01-01",
                website: "www.test12.com"
            };
            // get all movies to find the last movie inserted in the database
            chai.request(server)
                .put('/crew/' + crewId)
                .send(updatedCrew)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql(`No crew member found with the id ${crewId}!`);
                    done();
                });
        });

    });
    /*
    * Test the DELETE route
    */
    describe('Test DELETE route /crew/:id', () => {
        it('it should DELETE a crew given the id', (done) => {
            // get all crew to find the last movie inserted in the database
            chai.request(server)
                .get('/crew')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    let crews = res.body;
                    const lastCrew = crews[crews.length - 1];
                    chai.request(server)
                        .delete('/crew/' + lastCrew.id)
                        .end((err, res) => {
                            res.should.have.status(204);
                            done();
                        });
                });
        });
        it('it should NOT DELETE a crew that does not exist', (done) => {
            const crewId = -1;
            chai.request(server)
                .delete('/crew/' + crewId)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql(`No crew member found with the id ${crewId}!`);
                    done();
                });
        });
    });
});

// ******************************************************
// ***                                                ***
// ***           Unit Tests for Admins API            ***
// ***                                                ***
// ******************************************************


// TODO

// ******************************************************
// ***                                                ***
// ***           Unit Tests for Users API             ***
// ***                                                ***
// ******************************************************

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

        it('it should NOT GET all the users', (done) => {
            chai.request(server)
                .get('/users')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
    /*
    * Test the GET by id route
    */
    describe('Test GET route /user/:id', () => {
        it('it should GET a user by id', (done) => {
            const userId = 1;
            chai.request(server)
                .get('/user/' + userId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('username');
                    res.body.should.have.property('password');
                    res.body.should.have.property('firstName');
                    res.body.should.have.property('lastName');
                    res.body.should.have.property('gender');
                    res.body.should.have.property('birthday');
                    res.body.should.have.property('country');
                    res.body.should.have.property('createdAt');
                    res.body.should.have.property('id').eql(userId);
                    res.body.should.have.property('username').eql('member');
                    done();
                });
        });

        it('it should NOT GET any user', (done) => {
            const userId = -1;
            chai.request(server)
                .get('/user/' + userId)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql(`User with this ID (${userId}) does not exist!`);
                    done();
                });
        });
    });

    /*
    * Test the POST route
    */
    describe('Test POST route /user', () => {
        it('it should POST a user', (done) => {
            let user = {
                username: "Test User",
                password: "pass",
                firstName: "John",
                lastName: "Smith",
                gender: "male",
                birthday: "2021-01-01",
                country: "DK"
            };
            chai.request(server)
                .post('/user')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('username');
                    res.body.should.have.property('password');
                    res.body.should.have.property('firstName');
                    res.body.should.have.property('lastName');
                    res.body.should.have.property('gender');
                    res.body.should.have.property('birthday');
                    res.body.should.have.property('country');
                    res.body.should.have.property('createdAt');
                    res.body.should.have.property('username').eql(user.username);
                    done();
                });
        });

        it('it should NOT POST a user that already exists in the database', (done) => {
            let user = {
                username: "Test User",
                password: "pass",
                firstName: "John",
                lastName: "Smith",
                gender: "male",
                birthday: "2021-01-01",
                country: "DK"
            };
            chai.request(server)
                .post('/user')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql('User with this Username already exists!');
                    done();
                });
        });

        it('it should NOT POST a user with no Username', (done) => {
            let user = {
                username: "",
                password: "pass",
                firstName: "John",
                lastName: "Smith",
                gender: "male",
                birthday: "2021-01-01",
                country: "DK"
            };
            chai.request(server)
                .post('/user')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql('Username can not be null!');
                    done();
                });
        });

        it('it should NOT POST a user with no Password', (done) => {
            let user = {
                username: "Test User",
                password: "",
                firstName: "John",
                lastName: "Smith",
                gender: "male",
                birthday: "2021-01-01",
                country: "DK"
            };
            chai.request(server)
                .post('/user')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql('Password can not be null!');
                    done();
                });
        });
    });
    /*
    * Test the PUT route
    */
    describe('Test PUT route /user/:id', () => {
        it('it should UPDATE a user given the id', (done) => {
            let updatedUser = {
                username: "Test User 2",
                password: "pass",
                firstName: "John 2",
                lastName: "Smith 2",
                gender: "male",
                birthday: "2021-01-02",
                country: "Denmark"
            };
            // get all users to find the last user inserted in the database
            chai.request(server)
                .get('/user')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    let users = res.body;
                    const lastUser = users[users.length - 1];
                    chai.request(server)
                        .put('/user/' + lastUser.id)
                        .send(updatedUser)
                        .end((err, res) => {
                            res.should.have.status(204);
                            done();
                        });
                });
        });

        it('it should NOT UPDATE a user with no Username', (done) => {
            let updatedUser = {
                username: "",
                password: "pass",
                firstName: "John",
                lastName: "Smith",
                gender: "male",
                birthday: "2021-01-01",
                country: "DK"
            };
            // get all users to find the last user inserted in the database
            chai.request(server)
                .get('/user')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    let users = res.body;
                    const lastUser = users[users.length - 1];
                    chai.request(server)
                        .put('/user/' + lastUser.id)
                        .send(updatedUser)
                        .end((err, res) => {
                            res.should.have.status(409);
                            res.body.should.have.property('message');
                            res.body.should.have.property('message').eql('Username can not be null!');
                            done();
                        });
                });
        });

        it('it should NOT UPDATE a user that does not exist', (done) => {
            const userId = -1;
            let updatedUser = {
                username: "Test User 3",
                password: "pass",
                firstName: "John",
                lastName: "Smith",
                gender: "male",
                birthday: "2021-01-01",
                country: "DK"
            };
            // get all users to find the last user inserted in the database
            chai.request(server)
                .put('/user/' + userId)
                .send(updatedUser)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql(`User with this ID (${userId}) does not exist!`);
                    done();
                });
        });

        it('it should NOT UPDATE if user with this username already exists', (done) => {
            let updatedUser = {
                username: "member",
                password: "pass",
                firstName: "John",
                lastName: "Smith",
                gender: "male",
                birthday: "2021-01-01",
                country: "DK"
            };
            // get all users to find the last user inserted in the database
            chai.request(server)
                .get('/user')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    let users = res.body;
                    const lastUser = users[users.length - 1];
                    chai.request(server)
                        .put('/user/' + lastUser.id)
                        .send(updatedUser)
                        .end((err, res) => {
                            res.should.have.status(409);
                            res.body.should.have.property('message');
                            res.body.should.have.property('message').eql('User with this Username already exists!');
                            done();
                        });
                });
        });
    });
    /*
    * Test the DELETE route
    */
    describe('Test DELETE route /user/:id', () => {
        it('it should DELETE a user given the id', (done) => {
            // get all users to find the last user inserted in the database
            chai.request(server)
                .get('/user')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    let users = res.body;
                    const lastUser = users[users.length - 1];
                    chai.request(server)
                        .delete('/user/' + lastUser.id)
                        .end((err, res) => {
                            res.should.have.status(204);
                            done();
                        });
                });
        });
        it('it should NOT DELETE a user that does not exist', (done) => {
            const userId = -1;
            chai.request(server)
                .delete('/user/' + userId)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql(`User with this ID (${userId}) does not exist!`);
                    done();
                });
        });
    });
});


// ******************************************************
// ***                                                ***
// ***                Extra Functionality             ***
// ***                                                ***
// ******************************************************

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