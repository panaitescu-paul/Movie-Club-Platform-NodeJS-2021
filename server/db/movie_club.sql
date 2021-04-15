USE movieclubdb1;
-- USE movie_club;

-- DROP TABLE IF EXISTS user;
-- DROP TABLE IF EXISTS rating;
-- DROP TABLE IF EXISTS review;
-- DROP TABLE IF EXISTS message;
-- DROP TABLE IF EXISTS room;
-- DROP TABLE IF EXISTS participants;

-- Create base tables
CREATE TABLE IF NOT EXISTS user
(
    id        INTEGER PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(120),
    lastName  VARCHAR(120),
    email     VARCHAR(120) UNIQUE NOT NULL,
    username  VARCHAR(120) DEFAULT email,
    password  VARCHAR(120),
    birthday  DATE,
    gender    VARCHAR(20),
    country   VARCHAR(120),
    isAdmin   BOOLEAN NOT NULL DEFAULT false,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS room
(
    id        INTEGER PRIMARY KEY AUTO_INCREMENT,
    name      VARCHAR(120),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Create tables with FK
CREATE TABLE IF NOT EXISTS message
(
    id         INTEGER PRIMARY KEY AUTO_INCREMENT,
    userId     INTEGER NOT NULL,
    roomId    INTEGER NOT NULL,
    content    VARCHAR(200) NOT NULL,
    modifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdAt  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES user (id)
    ON DELETE CASCADE,
    FOREIGN KEY (roomId) REFERENCES room (id)
    ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS participants
(
    id         INTEGER PRIMARY KEY AUTO_INCREMENT,
    userId     INTEGER NOT NULL,
    roomId     INTEGER NOT NULL,
    createdAt  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES user (id)
    ON DELETE CASCADE,
    FOREIGN KEY (roomId) REFERENCES room (id)
    ON DELETE CASCADE
);

--

-- CREATE TABLE IF NOT EXISTS rating
-- (
--     id         INTEGER PRIMARY KEY AUTO_INCREMENT,
--     userId     INTEGER NOT NULL,
--     movieId    INTEGER NOT NULL,
--     value      INTEGER NOT NULL,
--     createdAt  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (userId) REFERENCES user (id)
--     ON DELETE CASCADE,
--     FOREIGN KEY (movieId) REFERENCES movie (id)
--     ON DELETE CASCADE
--     );
--
--
-- CREATE TABLE IF NOT EXISTS review
-- (
--     id         INTEGER PRIMARY KEY AUTO_INCREMENT,
--     userId     INTEGER NOT NULL,
--     movieId    INTEGER NOT NULL,
--     title      VARCHAR(120) NOT NULL,
--     content    VARCHAR(200) NOT NULL,
--     modifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     createdAt  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (userId) REFERENCES user (id)
--     ON DELETE CASCADE,
--     FOREIGN KEY (movieId) REFERENCES movie (id)
--     ON DELETE CASCADE
-- );
