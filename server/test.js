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
    * Test the Search Movie by title
    */
    describe('Test Movie Search', () => {
        it('it should GET movies based on title', (done) => {
            const title = 'Star';
            chai.request(server)
                .get('/movie/title/search/?title=' + title)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        it('it should NOT GET any movie', (done) => {
            const title = 'Star Trek';
            chai.request(server)
                .get('/movie/title/search/?title=' + title)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql(`Movies with this Title (${title}) do not exist!`);
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
        it('it should GET all the crews', (done) => {
            chai.request(server)
                .get('/crew')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        it('it should NOT GET all the crews', (done) => {
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
                    res.body.should.have.property('name').eql('Martin Scorsese');
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
    * Test the Search Crew by name
    */
    describe('Test Crew Search', () => {
        it('it should GET crews based on name', (done) => {
            const name = 'Leo';
            chai.request(server)
                .get('/crew/name/search?name=' + name)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        it('it should NOT GET any crew', (done) => {
            const name = 'Leonardo da Vinci';
            chai.request(server)
                .get('/crew/name/search?name=' + name)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql(`Crews with this Name (${name}) do not exist!`);
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
            // get all crews to find the last crew inserted in the database
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
            // get all crews to find the last crew inserted in the database
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
            // get all crews to find the last crew inserted in the database
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

describe('Admins API', () => {
    /*
    * Test the GET route
    */
    describe('Test GET route /admin', () => {
        it('it should GET all the admins', (done) => {
            chai.request(server)
                .get('/admin')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        it('it should NOT GET all the admins', (done) => {
            chai.request(server)
                .get('/admins')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
    /*
    * Test the GET by id route
    */
    describe('Test GET route /admin/:id', () => {
        it('it should GET an admin by id', (done) => {
            const adminId = 2;
            chai.request(server)
                .get('/admin/' + adminId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('username');
                    res.body.should.have.property('password');
                    res.body.should.have.property('createdAt');
                    res.body.should.have.property('id').eql(adminId);
                    res.body.should.have.property('username').eql('cons0343');
                    done();
                });
        });

        it('it should NOT GET any admin', (done) => {
            const adminId = -1;
            chai.request(server)
                .get('/admin/' + adminId)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql(`No admin user found with the id ${adminId}!`);
                    done();
                });
        });
    });
    /*
    * Test the Search Admin by username
    */
    describe('Test Admin Search', () => {
        it('it should GET admins based on username', (done) => {
            const username = 'admin';
            chai.request(server)
                .get('/admin/username/search?username=' + username)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        it('it should NOT GET any admin', (done) => {
            const username = 'admin12';
            chai.request(server)
                .get('/admin/username/search?username=' + username)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql(`Admins with this Username (${username}) do not exist!`);
                    done();
                });
        });
    });
    /*
    * Test the POST route
    */
    describe('Test POST route /admin', () => {
        it('it should POST an admin', (done) => {
            let admin = {
                username: "test",
                password: "test123",
            };
            chai.request(server)
                .post('/admin')
                .send(admin)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('username');
                    res.body.should.have.property('password');
                    res.body.should.have.property('createdAt');
                    res.body.should.have.property('username').eql(admin.username);
                    done();
                });
        });

        it('it should NOT POST an admin that already exists in the database', (done) => {
            let admin = {
                username: "test",
                password: "test123",
            };
            chai.request(server)
                .post('/admin')
                .send(admin)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql('An admin with this Username already exists!');
                    done();
                });
        });
    });
    /*
    * Test the PUT route
    */
    describe('Test PUT route /admin/:id', () => {
        it('it should UPDATE an admin given the id', (done) => {
            let updatedAdmin = {
                username: "test12",
            };
            // get all movies to find the last movie inserted in the database
            chai.request(server)
                .get('/admin')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    let admins = res.body;
                    const lastAdmin = admins[admins.length - 1];
                    chai.request(server)
                        .put('/admin/' + lastAdmin.id)
                        .send(updatedAdmin)
                        .end((err, res) => {
                            res.should.have.status(204);
                            done();
                        });
                });
        });

        it('it should NOT UPDATE an admin that does not exist', (done) => {
            const adminId = -1;
            let updatedAdmin = {
                username: "test123",
            };
            // get all movies to find the last movie inserted in the database
            chai.request(server)
                .put('/admin/' + adminId)
                .send(updatedAdmin)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql(`No admin user found with the id ${adminId}!`);
                    done();
                });
        });

    });
    /*
    * Test the DELETE route
    */
    describe('Test DELETE route /admin/:id', () => {
        it('it should DELETE an admin given the id', (done) => {
            // get all admins to find the last admin inserted in the database
            chai.request(server)
                .get('/admin')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    let admins = res.body;
                    const lastAdmin = admins[admins.length - 1];
                    chai.request(server)
                        .delete('/admin/' + lastAdmin.id)
                        .end((err, res) => {
                            res.should.have.status(204);
                            done();
                        });
                });
        });
        it('it should NOT DELETE an admin that does not exist', (done) => {
            const adminId = -1;
            chai.request(server)
                .delete('/admin/' + adminId)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql(`No admin user found with the id ${adminId}!`);
                    done();
                });
        });
    });
});

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
    * Test the Search Member by username
    */
    describe('Test Member Search', () => {
        it('it should GET members based on username', (done) => {
            const username = 'member';
            chai.request(server)
                .get('/user/username/search?username=' + username)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        it('it should NOT GET any member', (done) => {
            const username = 'member12';
            chai.request(server)
                .get('/user/username/search?username=' + username)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql(`Users with this Username (${username}) do not exist!`);
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