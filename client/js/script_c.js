$(document).ready(function() {
    const URLPath = 'http://localhost:8000';

    $('input[type=radio]').click(function() {
        removeLists();
        let searchType = $('input[name="searchType"]:checked').val();
        switch (searchType) {
            case 'crewsSearch':
                $.ajax({
                    url: `${URLPath}/crew`,
                    type: "GET",
                    success: function(crews) {
                        crews.forEach(crew => {
                            // make ajax request to get the poster
                            $.ajax({
                                url: `https://api.themoviedb.org/3/search/person?api_key=3510eb3c9c4e835718fa818f6bbb1309&query=${crew.name}`,
                                type: "GET",
                                success: function(data) {
                                    let person = data["results"][0];
                                    let personPicture = `//image.tmdb.org/t/p/w300_and_h450_bestv2${person.profile_path}`;
                                    if(person.profile_path === null) {
                                        personPicture = "img/notFoundPicture.jpg";
                                    }
                                    $("#showList").append(`
                                        <div class="p-2" data-id="${crew.id}" id="crewInfo">
                                            <p id="name"><b>Name: </b>${crew.name}</p>
                                            <p id="mainActivity"><b>Main Activity: </b>${crew.mainActivity}</p>
                                            <img src="${personPicture}" class="poster">
                                        </div>
                                    `);
                                }
                            });
                        });
                    }
                });
                break;
        }
    });

    $(document).on("click", "#crewInfo", function(e) {
        e.preventDefault();
        const crewId = $(this).attr("data-id");
        $.ajax({
            url: `${URLPath}/crew/${crewId}`,
            type: "GET",
            success: function(crew) {
                let dateOfBirth = formatDate(crew.dateOfBirth);
                $("#headerCrew").text(`${crew.name} - Information Details`);
                $("#crewDetails").append(`
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
                        })
                    }
                });

                $("#crewModal").show();

            }
        });
    });

    $("#btnCrewCancel").on("click", function() {
        $("#crewModal").hide();
        $("#crewDetails").empty();
    });


});