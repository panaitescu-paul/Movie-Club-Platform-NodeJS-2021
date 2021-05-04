$(document).ready(function() {
    const URLPath = 'http://localhost:8000';

    $(document).on("click", ".crewInfo", function() {
        const crewId = $(this).attr("data-id");
        emptyModal();
        $.ajax({
            url: `${URLPath}/crew/${crewId}`,
            type: "GET",
            success: function(crew) {
                let dateOfBirth = formatDate(crew.dateOfBirth);
                $("#modalTitle").text(`${crew.name} - Information Details`);
                $("#modalInfoContent1").append(`
                    <div>
                        <p id="name"><b>Name: </b>${crew.name}</p>
                        <p id="mainActivity"><b>Main Activity: </b>${crew.mainActivity}</p>
                        <p id="dateOfBirth"><b>Birthday: </b>${dateOfBirth}</p>
                        <p id="birthPlace"><b>Birth place: </b>${crew.releaseDate}</p>
                        <p id="biography"><b>Biography: </b>${crew.biography}</p>
                        <p id="website"><b>Main Activity: </b>${crew.website}</p>
                        <p id="movies"><b>List of Movies: </b><div id="listOfMovies"></div></p>
                    </div>
                `);
                $.ajax({
                    url: `${URLPath}/movie_crew/crewId/${crewId}`,
                    type: "GET",
                    success: function(movie_crew_Arr) {
                        console.log(movie_crew_Arr);
                        movie_crew_Arr.forEach((movie_crew) => {
                            $.ajax({
                                url: `${URLPath}/movie/${movie_crew.movieId}`,
                                type: "GET",
                                success: function(movie) {
                                    console.log(movie);
                                    let releaseDate = formatDate(movie.releaseDate);
                                    $("#listOfMovies").append(`
                                      <p id="movieTitle"><b>Movie Title: </b>${movie.title}</p>
                                      <p id="releaseDate"><b>Release Date: </b>${releaseDate}</p>
                                    `);
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

    $(document).on("click", "#btnSearchCrew", function() {
        const searchValue = $('#searchCrew').val();
        $.ajax({
            url: `${URLPath}/crew/name/search?name=${searchValue}`,
            type: "GET",
            success: function(crews) {
                showCrews(crews);
            },
            statusCode: {
                404: function() {
                    $("#results").empty().append(`
                        <p><b>This person does not exist in the database!</b></p>
                    `);
                }
            }
        });
    });

    // for create
    // make ajax request to get the poster
    // $.ajax({
    //     url: `https://api.themoviedb.org/3/search/person?api_key=3510eb3c9c4e835718fa818f6bbb1309&query=${crew.name}`,
    //     type: "GET",
    //     success: function(data) {
    //         let person = data["results"][0];
    //         let personPicture = `//image.tmdb.org/t/p/w300_and_h450_bestv2${person.profile_path}`;
    //         console.log(crew.picture);
    //         if(crew.picture === null) {
    //             crew.picture = "img/notFoundPicture.jpg";
    //         }
    //         $("#results").append(`
    //             <div class="card" data-id="${crew.id}" id="crewInfo">
    //                 <img class="card-img-top" src="${personPicture}" data-toggle="modal" data-target="#modal">
    //                 <div class="card-body">
    //                     <h5 class="card-title">${crew.name}</h5>
    //                 </div>
    //                 <ul class="list-group list-group-flush">
    //                     <li class="list-group-item"><b>Main Activity: </b>${crew.mainActivity}</li>
    //                 </ul>
    //             </div>
    //
    //             `);
    //     }
    // });
});