$(document).ready(function() {
    // Crew details
    $(document).on("click", ".crewInfo", function() {
        const crewId = $(this).attr("data-id");
        clearModalData();
        $.ajax({
            url: `${URLPath}/crew/${crewId}`,
            type: "GET",
            success: function(crew) {
                let dateOfBirth = formatDate(crew.dateOfBirth);
                if(crew.picture === null || crew.picture === '') {
                    crew.picture = "../img/notFoundPicture.jpg";
                }
                $("#modalTitle").text(`${crew.name} - Information Details`);
                $("#modalInfoContent1").append(`
                    <div class="modal-image">
                        <img class="card-img-top" src="${crew.picture}">
                    </div>
                    <br>
                    <h3 class="modal-subtitle">Overview</h3>
                    <div class="modal-box">
                        <p id="name"><span class="tag">Name: </span><span class="tag-info">${crew.name}</span></p>
                        <p id="mainActivity"><span class="tag">Main Activity: </span><span class="tag-info">${crew.mainActivity}</span></p>
                        <p id="dateOfBirth"><span class="tag">Birthday: </span><span class="tag-info">${dateOfBirth}</span></p>
                        <p id="birthPlace"><span class="tag">Birth place: </span><span class="tag-info">${crew.birthPlace}</span></p>
                        <p id="biography"><span class="tag">Biography: </span><span class="tag-info">${crew.biography}</span></p>
                        <p id="website"><span class="tag">Website: </span><span class="tag-info">${crew.website}</span></p>
                        <p id="movies"><span class="tag">List of Movies: </span><div id="listOfMovies"></div></p>
                    </div>
                `);
                $.ajax({
                    url: `${URLPath}/movie_crew/crewId/${crewId}`,
                    type: "GET",
                    success: function(movie_crew_arr) {
                        movie_crew_arr.forEach((movie_crew) => {
                            $.ajax({
                                url: `${URLPath}/movie/${movie_crew.movieId}`,
                                type: "GET",
                                success: function(movie) {
                                    $.ajax({
                                        url: `${URLPath}/role/${movie_crew.roleId}`,
                                        type: "GET",
                                        success: function(role) {
                                            let releaseDate = formatDate(movie.releaseDate);
                                            $("#listOfMovies").append(`
                                                <div class="card">
                                                    <div class="card-body">
                                                        <img data-id="${movie.id}" class="card-img-top poster showMovieModal" src="${movie.poster}">
                                                        <p id="movieTitle"><b>Movie Title: </b>${movie.title}</p>
                                                        <p id="releaseDate"><b>Release Date: </b>${releaseDate}</p>
                                                        <p id="role"><b>Role: </b>${role.name}</p>
                                                    </div>
                                                    <div class="card-actions">
                                                        <button data-id="${movie.id}" type="button" class="btn btn-warning
                                                                btnShow showMovieModal">Details</button>
                                                    </div>
                                                </div>
                                            `);
                                        }
                                    });
                                }
                            });
                        });
                    },
                    statusCode: {
                        404: function() {
                            $("#listOfMovies").append(`
                                <p><b>This person was not part in any movie yet!</b></p>
                            `);
                        }
                    }
                });
            },
            statusCode: {
                404: function(data) {
                    const errorMsg = JSON.parse(data.responseText).Error;
                    alert(errorMsg);
                }
            }
        });
    });

    // Search Crew
    $(document).on("click", "#btnSearchCrew", function() {
        const searchValue = $('#searchCrew').val();
        $.ajax({
            url: `${URLPath}/crew/name/search?name=${searchValue}`,
            type: "GET",
            success: function(crews) {
                if (window.location.href === 'http://localhost:4000/src/admins.html' || window.location.href === 'http://localhost:4000/src/admins.html?') {
                    showCrews(crews, 'admin');
                } else {
                    showCrews(crews, 'guest');
                }
            },
            statusCode: {
                404: function(data) {
                    const errorMessage = data.responseJSON.message;
                    $("#results").empty().append(`
                        <p><b>${errorMessage}</b></p>
                    `);
                }
            }
        });
    });

    // Create Crew
    $(document).on("click", "#btnCreateCrew", function() {
        clearModalData();
        $("#modalTitle").text(`Create Crew`);
        $("#modalInfoContent1").append(`
             <form id="createCrewForm">
                <div class="form-group form-custom">
                    <label for="crewName">Crew Name</label>
                    <input type="text" class="form-control" id="crewName" required>
                    <label for="crewMainActivity">Main Activity</label>
                    <input type="text" class="form-control" id="crewMainActivity">
                    <label for="crewDateOfBirth">Date of Birth</label>
                    <input type="date" class="form-control" id="crewDateOfBirth">
                    <label for="crewBirthPlace">Birth Place</label>
                    <input type="text" class="form-control" id="crewBirthPlace">
                    <label for="crewBiography">Biography</label>
                    <textarea class="form-control" id="crewBiography" rows="3"></textarea>
                    <label for="crewWebsite">Website</label>
                    <input type="text" class="form-control" id="crewWebsite">
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn btn-success btn-3">Create Crew</button>
                </div>
             </form>
        `);
        $("#createCrewForm").on("submit", function(e) {
            e.preventDefault();
            const name = $("#crewName").val().trim();
            const mainActivity = $("#crewMainActivity").val().trim();
            const dateOfBirth = $("#crewDateOfBirth").val().trim();
            const birthPlace = $("#crewBirthPlace").val().trim();
            const biography = $("#crewBiography").val().trim();
            const website = $("#crewWebsite").val().trim();

            if (name === null || name.length === 0) {
                alert("The crew name should not be empty!");
            } else if(name.match('[=!@#$%^*?":{}|<>;]')) {
                alert("The input field can't contain invalid characters!");
            } else {
                $.ajax({
                    url: `https://api.themoviedb.org/3/search/person?api_key=3510eb3c9c4e835718fa818f6bbb1309&query=${name}`,
                    type: "GET",
                    success: function(data) {
                        let person = data["results"][0];
                        let personPicture;
                        if(person === undefined || person.profile_path === null) {
                            personPicture = "../img/notFoundPicture.jpg";
                        } else {
                            personPicture = `//image.tmdb.org/t/p/w300_and_h450_bestv2${person.profile_path}`;
                        }

                        $.ajax({
                            url: `${URLPath}/crew`,
                            type: "POST",
                            data: {
                                name: name,
                                mainActivity: mainActivity,
                                dateOfBirth: dateOfBirth,
                                birthPlace: birthPlace,
                                biography: biography,
                                picture: personPicture,
                                website: website
                            },
                            success: function() {
                                alert("The crew was successfully created!");
                                $('#modal > div > div > div.modal-header > button').click();
                                $('#btnCrewsTab').click();
                                setTimeout(function(){
                                    scrollPage("bottomPage");
                                }, 1000);
                            },
                            statusCode: {
                                400: function(data) {
                                    const errorMessage = data.responseJSON.message;
                                    alert(errorMessage);
                                },
                                409: function(data) {
                                    const errorMessage = data.responseJSON.message;
                                    alert(errorMessage);
                                }
                            }
                        });
                    }
                });
            }
        });
    });

    // Update Crew
    $(document).on("click", ".crewUpdate", function() {
        const crewId = $(this).attr("data-id");
        clearModalData();
        $.ajax({
            url: `${URLPath}/crew/${crewId}`,
            type: "GET",
            success: function(crew) {
                let dateOfBirth = formatDate(crew.dateOfBirth);
                $("#modalTitle").text(`Update Crew`);
                $("#modalInfoContent1").append(`
                    <form id="updateCrewForm">
                        <div class="form-group form-custom">
                            <label for="crewName">Crew Name</label>
                            <input type="text" class="form-control" id="crewName" value="${crew.name}" required>
                            <label for="crewMainActivity">Main Activity</label>
                            <input type="text" class="form-control" id="crewMainActivity" value="${crew.mainActivity}">
                            <label for="crewDateOfBirth">Date of Birth</label>
                            <input type="date" class="form-control" id="crewDateOfBirth" value="${dateOfBirth}">
                            <label for="crewBirthPlace">Birth Place</label>
                            <input type="text" class="form-control" id="crewBirthPlace" value="${crew.birthPlace}">
                            <label for="crewBiography">Biography</label>
                            <textarea class="form-control" id="crewBiography" rows="3">${crew.biography}</textarea>
                            <label for="crewWebsite">Website</label>
                            <input type="text" class="form-control" id="crewWebsite" value="${crew.website}">
                        </div>
                        <div class="modal-actions">
                            <button type="submit" class="btn btn-success btn-3">Update Crew</button>
                        </div>
                    </form>
                `);
                $("#modalInfoContent2").append(`
                    </br>
                    <hr>
                    </br>
                    <form id="crewMovieForm">
                        <div class="form-group form-custom">
                            <div class="modal-box">
                                <p id="movies"><span class="tag">List of Movies: </span><div id="listOfMovies"></div></p>
                            </div>
                            </br>
                            <hr>
                            </br>
                            <label for="moviesDropdown">Movie</label>
                            <select name="moviesDropdown" id="moviesDropdown" class="form-control"></select>
                            <label for="rolesDropdown">Role</label>
                            <select name="rolesDropdown" id="rolesDropdown" class="form-control"></select>
                        </div>
                        <div class="modal-actions">
                            <button type="submit" class="btn btn-success btn-3">Add Movie and Role</button>
                        </div>
                    </form>
                `);
                // Get the list of movies
                $.ajax({
                    url: `${URLPath}/movie_crew/crewId/${crewId}`,
                    type: "GET",
                    success: function(movie_crew_arr) {
                        movie_crew_arr.forEach((movie_crew) => {
                            $.ajax({
                                url: `${URLPath}/movie/${movie_crew.movieId}`,
                                type: "GET",
                                success: function(movie) {
                                    $.ajax({
                                        url: `${URLPath}/role/${movie_crew.roleId}`,
                                        type: "GET",
                                        success: function(role) {
                                            let releaseDate = formatDate(movie.releaseDate);
                                            $("#listOfMovies").append(`
                                                <div class="card">
                                                    <div class="card-body">
                                                        <img data-id="${movie.id}" class="card-img-top poster showMovieModal" src="${movie.poster}">
                                                        <p id="movieTitle"><b>Movie Title: </b>${movie.title}</p>
                                                        <p id="releaseDate"><b>Release Date: </b>${releaseDate}</p>
                                                        <p id="role"><b>Role: </b>${role.name}</p>
                                                    </div>
                                                </div>
                                            `);
                                        }
                                    });
                                }
                            });
                        });
                    },
                    statusCode: {
                        404: function() {
                            $("#listOfMovies").append(`
                                <p><b>This person was not part in any movie yet!</b></p>
                            `);
                        }
                    }
                });
                // Populate the movies dropdown
                $.ajax({
                    url: `${URLPath}/movie`,
                    type: "GET",
                    success: function(movies) {
                        movies.forEach((movie) => {
                            $('#moviesDropdown').append(`
                                <option value="${movie.id}">${movie.title}</option>
                            `);
                        })
                    },
                    statusCode: {
                        404: function(data) {
                            const errorMessage = data.responseJSON.message;
                            alert(errorMessage);
                        }
                    }
                });
                // Populate the roles dropdown
                $.ajax({
                    url: `${URLPath}/role`,
                    type: "GET",
                    success: function(roles) {
                        roles.forEach((role) => {
                            $('#rolesDropdown').append(`
                                <option value="${role.id}">${role.name}</option>
                            `);
                        })
                    },
                    statusCode: {
                        404: function(data) {
                            const errorMessage = data.responseJSON.message;
                            alert(errorMessage);
                        }
                    }
                });
            },
            statusCode: {
                404: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                }
            },
            complete: function () {
                $("#updateCrewForm").on("submit", function(e) {
                    e.preventDefault();
                    const name = $("#crewName").val().trim();
                    const mainActivity = $("#crewMainActivity").val().trim();
                    const dateOfBirth = $("#crewDateOfBirth").val().trim();
                    const birthPlace = $("#crewBirthPlace").val().trim();
                    const biography = $("#crewBiography").val().trim();
                    const website = $("#crewWebsite").val().trim();
                    $.ajax({
                        url: `${URLPath}/crew/${crewId}`,
                        type: "PUT",
                        data: {
                            name: name,
                            mainActivity: mainActivity,
                            dateOfBirth: dateOfBirth,
                            birthPlace: birthPlace,
                            biography: biography,
                            website: website
                        },
                        success: function() {
                            alert("The crew was successfully updated!");
                            $('#modal > div > div > div.modal-header > button').click();
                            $('#btnCrewsTab').click();
                        },
                        statusCode: {
                            400: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            },
                            409: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            }
                        }
                    });
                });
                $("#crewMovieForm").on("submit", function(e) {
                    e.preventDefault();
                    const movieId = $("#moviesDropdown option:selected").val()
                    const roleId = $("#rolesDropdown option:selected").val();

                    $.ajax({
                        url: `${URLPath}/movie_crew`,
                        type: "POST",
                        data: {
                            movieId: movieId,
                            crewId: crewId,
                            roleId: roleId
                        },
                        success: function() {
                            alert("The movie and role were successfully linked with this crew member!");
                            $('#modal > div > div > div.modal-header > button').click();

                        },
                        statusCode: {
                            400: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            },
                            404: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            },
                            409: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            }
                        }
                    });
                });
            }
        });
    });

    // Delete Crew
    $(document).on("click", ".crewDelete", function() {
        const crewId = $(this).attr("data-id");
        if (confirm("Are you sure that you want to delete this crew?")) {
            $.ajax({
                url: `${URLPath}/crew/${crewId}`,
                type: "DELETE",
                success: function() {
                    $("button[data-id=" + crewId + "]").parent().parent().remove();

                    alert("The crew was successfully deleted!");
                },
                statusCode: {
                    400: function(data) {
                        const errorMessage = data.responseJSON.message;
                        alert(errorMessage);
                    }
                }
            });
        }
    });

    // Member login form submit listener
    $("#loginMemberForm").on("submit", function(e) {
        e.preventDefault();
        const memberUsername = $('#memberUsername').val().trim();
        const memberPassword = $('#memberPassword').val().trim();
        $.ajax({
            url: `${URLPath}/user/login`,
            type: "POST",
            data: {
                username: memberUsername,
                password: memberPassword
            },
            success: function(data) {
                $.ajax({
                    url: `http://localhost:4000/login/member`,
                    type: "POST",
                    data: {
                        id: data.memberUser.id,
                        username: data.memberUser.username,
                        password: data.memberUser.password,
                        firstName: data.memberUser.firstName,
                        lastName: data.memberUser.lastName,
                        gender: data.memberUser.gender,
                        birthday: data.memberUser.birthday,
                        country: data.memberUser.country
                    },
                    success: function(response) {
                        if (response === 'Member session created!') {
                            window.location.href='../src/movies.html';
                        }
                    }
                });
            },
            statusCode: {
                400: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                },
                403: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                },
                404: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                }
            }
        });
    });

    // Admin login form submit listener
    $("#loginAdminForm").on("submit", function(e) {
        e.preventDefault();
        const adminUsername = $('#adminUsername').val().trim();
        const adminPassword = $('#adminPassword').val().trim();
        $.ajax({
            url: `${URLPath}/admin/login`,
            type: "POST",
            data: {
                username: adminUsername,
                password: adminPassword
            },
            success: function(data) {
                $.ajax({
                    url: `http://localhost:4000/login/admin`,
                    type: "POST",
                    data: {
                        id: data.adminUser.id,
                        username: data.adminUser.username,
                        password: data.adminUser.password
                    },
                    success: function(response) {
                        if (response === 'Admin session created!') {
                            window.location.href='../src/admins.html';
                        }
                    }
                });
            },
            statusCode: {
                400: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                },
                403: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                },
                404: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                }
            }
        });
    });

    // Logout
    $(document).on("click", "#adminLogout, #memberLogout", function() {
        $.ajax({
            url: `http://localhost:4000/logout`,
            type: "GET",
            success: function() {
                location.reload();
            }
        });
    });

    // ***** Admin CRUD *****
    // Admin details
    $(document).on("click", ".adminInfo", function() {
        const adminId = $(this).attr("data-id");
        clearModalData();
        $.ajax({
            url: `${URLPath}/admin/${adminId}`,
            type: "GET",
            success: function(admin) {
                let createdAt = formatDateTime(admin.createdAt);
                $("#modalTitle").text(`${admin.username} - Information Details`);
                $("#modalInfoContent1").append(`
                    <div class="modal-box">
                        <p id="adminId"><span class="tag">Id: </span><span class="tag-info">${admin.id}</span></p>
                        <p id="username"><span class="tag">Username: </span><span class="tag-info">${admin.username}</span></p>
                        <p id="createdAt"><span class="tag">Created at: </span><span class="tag-info">${createdAt}</span></p>
                    </div>
                `);
            },
            statusCode: {
                404: function(data) {
                    const errorMsg = JSON.parse(data.responseText).Error;
                    alert(errorMsg);
                }
            }
        });
    });

    // Search Admin
    $(document).on("click", "#btnSearchAdmin", function() {
        const searchValue = $('#searchAdmin').val();
        $.ajax({
            url: `${URLPath}/admin/username/search?username=${searchValue}`,
            type: "GET",
            success: function(admins) {
                showAdmins(admins);
            },
            statusCode: {
                404: function(data) {
                    const errorMessage = data.responseJSON.message;
                    $("#results").empty().append(`
                        <p><b>${errorMessage}</b></p>
                    `);
                }
            }
        });
    });

    // Create Admin
    $(document).on("click", "#btnCreateAdmin", function() {
        clearModalData();
        $("#modalTitle").text(`Create Admin`);
        $("#modalInfoContent1").append(`
             <form id="createAdminForm">
                <div class="form-group form-custom">
                    <label for="username">Username</label>
                    <input type="text" class="form-control" id="username" required>
                    <label for="password">Password</label>
                    <input type="password" class="form-control" id="password">
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn btn-success btn-3">Create Admin</button>
                </div>
             </form>
        `);
        $("#createAdminForm").on("submit", function(e) {
            e.preventDefault();
            const username = $("#username").val().trim();
            const password = $("#password").val().trim();

            if (username === null || username.length === 0) {
                alert("The username should not be empty!");
            } else if(username.match('[=!@#$%^*?":{}|<>;]')) {
                alert("The input field can't contain invalid characters!");
            } else {
                $.ajax({
                    url: `${URLPath}/admin`,
                    type: "POST",
                    data: {
                        username: username,
                        password: password
                    },
                    success: function() {
                        alert("The admin was successfully created!");
                        $('#modal > div > div > div.modal-header > button').click();
                        $('#btnAdminsTab').click();
                        setTimeout(function(){
                            scrollPage("bottomPage");
                        }, 1000);
                    },
                    statusCode: {
                        400: function(data) {
                            const errorMessage = data.responseJSON.message;
                            alert(errorMessage);
                        },
                        409: function(data) {
                            const errorMessage = data.responseJSON.message;
                            alert(errorMessage);
                        }
                    }
                });
            }
        });
    });

    // Update Admin
    $(document).on("click", ".adminUpdate", function() {
        const adminId = $(this).attr("data-id");
        clearModalData();
        $.ajax({
            url: `${URLPath}/admin/${adminId}`,
            type: "GET",
            success: function(admin) {
                $("#modalTitle").text(`Update Admin`);
                $("#modalInfoContent1").append(`
                    <form id="updateAdminForm">
                        <div class="form-group form-custom">
                            <label for="adminId">Id</label>
                            <input type="text" class="form-control" id="adminId" value="${admin.id}" disabled>
                            <label for="username">Username</label>
                            <input type="text" class="form-control" id="username" value="${admin.username}" required>
                            <label for="createdAt">Created at</label>
                            <input type="text" class="form-control" id="createdAt" value="${formatDateTime(admin.createdAt)}" disabled>
                        </div>
                        <div class="modal-actions">
                            <button type="submit" class="btn btn-success btn-3">Update Admin</button>
                        </div>
                    </form>
                `);
                $("#modalInfoContent2").append(`
                    </br>
                    <hr>
                    </br>
                    <form id="updatePasswordAdminForm">
                        <div class="form-group form-custom">
                            <label for="oldPassword">Old Password</label>
                            <input type="password" id="oldPassword" class="form-control" required>
                            <label for="newPassword">New Password</label>
                            <input type="password" id="newPassword" class="form-control" required>
                        </div>
                        <div class="modal-actions">
                            <button type="submit" class="btn btn-success btn-3">Update Password</button>
                        </div>
                    </form>
                `);
            },
            statusCode: {
                404: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                }
            },
            complete: function () {
                $("#updateAdminForm").on("submit", function(e) {
                    e.preventDefault();
                    const username = $("#username").val().trim();

                    $.ajax({
                        url: `${URLPath}/admin/${adminId}`,
                        type: "PUT",
                        data: {
                            username: username
                        },
                        success: function() {
                            alert("The admin was successfully updated!");
                            $('#modal > div > div > div.modal-header > button').click();
                            $('#btnAdminsTab').click();
                            $('#adminLogout').click();
                        },
                        statusCode: {
                            400: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            },
                            409: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            }
                        }
                    });
                });
                $("#updatePasswordAdminForm").on("submit", function(e) {
                    e.preventDefault();
                    const username = $("#username").val().trim();
                    const oldPassword = $("#oldPassword").val().trim();
                    const newPassword = $("#newPassword").val().trim();

                    $.ajax({
                        url: `${URLPath}/admin/password/${adminId}`,
                        type: "PUT",
                        data: {
                            username: username,
                            oldPassword: oldPassword,
                            newPassword: newPassword
                        },
                        success: function() {
                            alert("The admin password was successfully updated!");
                            $('#modal > div > div > div.modal-header > button').click();
                            $('#adminLogout').click();
                        },
                        statusCode: {
                            400: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            },
                            403: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert('Wrong password!');
                            },
                            409: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            }
                        }
                    });
                });
            }
        });
    });

    // Delete Admin
    $(document).on("click", ".adminDelete", function() {
        const adminId = $(this).attr("data-id");
        const loggedInAdminId = $('#loggedInAdmin').attr("data-id");
        if (confirm("Are you sure that you want to delete this admin?")) {
            if (adminId === loggedInAdminId) {
                if (confirm("Warning! You're about to delete the account that you're logged in with. Do you want to proceed?")) {
                    $.ajax({
                        url: `${URLPath}/admin/${adminId}`,
                        type: "DELETE",
                        success: function() {
                            $("button[data-id=" + adminId + "]").parent().parent().remove();
                            alert("Your account was successfully deleted!");
                            $('#adminLogout').click();
                        },
                        statusCode: {
                            400: function(data) {
                                const errorMessage = data.responseJSON.message;
                                alert(errorMessage);
                            }
                        }
                    });
                }
            } else {
                $.ajax({
                    url: `${URLPath}/admin/${adminId}`,
                    type: "DELETE",
                    success: function() {
                        $("button[data-id=" + adminId + "]").parent().parent().remove();
                        alert("The admin was successfully deleted!");
                    },
                    statusCode: {
                        400: function(data) {
                            const errorMessage = data.responseJSON.message;
                            alert(errorMessage);
                        }
                    }
                });
            }
        }
    });

    $(document).on("click", ".rating", function() {
        const loggedInMemberId = $('#loggedInMember').attr("data-id");
        const movieId = $('#modalInfoContent2 > div').attr("data-movieid");
        const ratingResult = $('.rating__result').text().split('/')[0];
        console.log(ratingResult)
        $.ajax({
            url: `${URLPath}/rating`,
            type: "POST",
            data: {
                userId: loggedInMemberId,
                movieId: movieId,
                value: ratingResult
            },
            success: function() {
                $.ajax({
                    url: `${URLPath}/rating/movie/${movieId}`,
                    type: "GET",
                    success: function(data) {
                        if ($("#modalInfoContent2 > div.modal-box > p > i").text() === "No Ratings are available for this Movie!") {
                            $("#modalInfoContent2 > div.modal-box").empty();
                            $("#modalInfoContent2 > div.modal-box").append(`
                            <p>
                                <span class="tag">Rating Average</span>
                                <span id="ratingAverage" class="tag-info">${calculateRatingAverage( data )}</span>
                            </p>
                            `);

                        }
                        ratingStarsSelection()
                    },
                    statusCode: {
                        404: function(data) {
                            const errorMessage = data.responseJSON.message;
                            alert(errorMessage);
                        }
                    }
                });
            },
            statusCode: {
                400: function(data) {
                    const errorMessage = data.responseJSON.message;
                    alert(errorMessage);
                },
                409: function(data) {
                    const errorMessage = data.responseJSON.message;
                    // alert(errorMessage);

                    if (errorMessage === 'Rating from this User is already attached to this Movie!') {
                        $.ajax({
                            url: `${URLPath}/rating/movie/${movieId}/user/${loggedInMemberId}`,
                            type: "GET",
                            success: function(rating) {
                                // Update the rating
                                $.ajax({
                                    url: `${URLPath}/rating/${rating.id}`,
                                    type: "PUT",
                                    data: {
                                        value: ratingResult
                                    },
                                    success: function() {
                                        $.ajax({
                                            url: `${URLPath}/rating/movie/${movieId}`,
                                            type: "GET",
                                            success: function(data) {
                                                $('#ratingAverage').text(calculateRatingAverage(data));
                                                ratingStarsSelection()
                                            },
                                            statusCode: {
                                                404: function(data) {
                                                    const errorMessage = data.responseJSON.message;
                                                    alert(errorMessage);
                                                }
                                            }
                                        });

                                    },
                                    statusCode: {
                                        400: function(data) {
                                            const errorMessage = data.responseJSON.message;
                                            alert(errorMessage);
                                        },
                                        403: function(data) {
                                            const errorMessage = data.responseJSON.message;
                                            alert(errorMessage);
                                        },
                                        409: function(data) {
                                            const errorMessage = data.responseJSON.message;
                                            alert(errorMessage);
                                        }
                                    }
                                });
                            },
                            statusCode: {
                                400: function(data) {
                                    const errorMessage = data.responseJSON.message;
                                    alert(errorMessage);
                                },
                                404: function(data) {
                                    const errorMessage = data.responseJSON.message;
                                    // alert(errorMessage);
                                }
                            }
                        });
                    } else {
                        alert(errorMessage);
                    }
                }
            }
        });
    });

    // Remove rating
    $(document).on("click", "#removeRating", function() {
        const loggedInMemberId = $('#loggedInMember').attr("data-id");
        const movieId = $('#modalInfoContent2 > div').attr("data-movieid");
        if (loggedInMemberId === undefined) {
            alert("You must be logged in to be able to remove a rating!");
        } else {
            if (confirm( "Are you sure that you want to delete your rating?" )) {
                $.ajax( {
                    url: `${URLPath}/rating/movie/${movieId}/user/${loggedInMemberId}`,
                    type: "GET",
                    success: function (rating) {
                        $.ajax( {
                            url: `${URLPath}/rating/${rating.id}`,
                            type: "DELETE",
                            success: function () {
                                $('#modal > div > div > div.modal-header > button').click();
                            },
                            statusCode: {
                                400: function (data) {
                                    const errorMessage = data.responseJSON.message;
                                    alert( errorMessage );
                                }
                            }
                        } );
                    },
                    statusCode: {
                        400: function (data) {
                            const errorMessage = data.responseJSON.message;
                            alert( errorMessage );
                        },
                        404: function (data) {
                            const errorMessage = data.responseJSON.message;
                            // alert(errorMessage);
                        }
                    }
                } );
            }
        }
    });
});

// Show all Crews in a List
function showAllCrews(user = 'guest') {
    $.ajax({
        url: `${URLPath}/crew`,
        type: "GET",
        success: function(crews) {
            showCrews(crews, user);
        },
        statusCode: {
            404: function(data) {
                $("#results").empty();
                const errorMsg = JSON.parse(data.responseText).Error;
                alert(errorMsg);
            }
        }
    });
}

// Show Crews in a List
function showCrews(data, user = 'guest') {
    $("#results").empty();
    switch (user) {
        case 'guest':
            data.forEach(crew => {
                if(crew.picture === null || crew.picture === '') {
                    crew.picture = "../img/notFoundPicture.jpg";
                }
                $("#results").append(`
                    <div class="card crewDiv">
                        <div data-id="${crew.id}" class="card-body crewInfo" data-toggle="modal" data-target="#modal">
                            <img  class="card-img-top poster" src="${crew.picture}" data-toggle="modal" data-target="#modal">
                            <h5 class="card-title">${crew.name}</h5>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><b>Main Activity: </b>${crew.mainActivity}</li>
                        </ul>
                        <div class="card-actions">
                            <button data-id="${crew.id}" type="button" class="btn btn-warning
                                    btnShow crewInfo detailsBtn" data-toggle="modal" data-target="#modal">Details</button>
                        </div>
                    </div>
                `);
            });
            break;
        case 'admin':
            data.forEach(crew => {
                if(crew.picture === null || crew.picture === '') {
                    crew.picture = "../img/notFoundPicture.jpg";
                }
                $("#results").append(`
                    <div class="card crewDiv">
                        <div data-id="${crew.id}" class="card-body crewInfo" data-toggle="modal" data-target="#modal">
                            <img  class="card-img-top poster" src="${crew.picture}">
                            <h5 class="card-title">${crew.name}</h5>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><b>Main Activity: </b>${crew.mainActivity}</li>
                        </ul>
                        <div class="card-actions">
                            <button data-id="${crew.id}" type="button" class="btn btn-success
                                    btnShow crewUpdate" data-toggle="modal" data-target="#modal">Update</button>
                            <button data-id="${crew.id}" type="button" class="btn btn-danger
                                btnShow crewDelete">Delete</button>
                        </div>
                    </div>
                `);
            });
            break;
    }
}

// Show all Admins in a List
function showAllAdmins() {
    $.ajax({
        url: `${URLPath}/admin`,
        type: "GET",
        success: function(admins) {
            showAdmins(admins);
        },
        statusCode: {
            404: function(data) {
                $("#results").empty();
                const errorMsg = JSON.parse(data.responseText).Error;
                alert(errorMsg);
            }
        }
    });
}

// Show Admins in a List
function showAdmins(data) {
    $("#results").empty();
    data.forEach(admin => {
        $("#results").append(`
            <div class="card adminDiv">
                <div data-id="${admin.id}" class="card-body adminInfo" data-toggle="modal" data-target="#modal">
                    <h5 class="card-title">${admin.username}</h5>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><b>Created at: </b>${formatDateTime(admin.createdAt)}</li>
                </ul>
                <div class="card-actions">
                    <button data-id="${admin.id}" type="button" class="btn btn-success
                            btnShow adminUpdate" data-toggle="modal" data-target="#modal">Update</button>
                    <button data-id="${admin.id}" type="button" class="btn btn-danger
                            btnShow adminDelete">Delete</button>
                </div>
            </div>
        `);
    });
}
