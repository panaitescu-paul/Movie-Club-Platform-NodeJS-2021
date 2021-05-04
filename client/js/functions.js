// TODO: Replace multiple instances of the same ID with instances of a CLASS in CSS 
// (Example: id="crewInfo" to class="crewInfo")

function emptyModal() {
    // Empty the previous Results
    $("#modalInfoContent1").empty();
    $("#modalInfoContent2").empty();
}

function formatDate(date) {
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

// Show all Movies in a List
function showAllMovies(user = 'guest') {
    $.ajax({
        url: URL + "movie",
        type: "GET",
        success: function(data) {
            console.log('data: ', data);
            if (user == 'guest') {
                if (data.length === 0) {
                    $("section#movieResults").html("There are no Movies matching the entered text.");
                } else {
                    data.forEach(element => {
                        if (element.releaseDate) {
                            var releaseDate = element.releaseDate.slice(0,10);
                        } else {
                            var releaseDate = 'Unknown';

                        }
                        $("#results").append(`
                                <div class="card" data-id="${element.id}">
                                    <img class="card-img-top" src="${element.overview}" alt="Card image cap">
                                    <div class="card-body">
                                        <h5 class="card-title">${element.title}</h5>
                                    </div>
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item">Release date: ${releaseDate}</li>
                                    </ul>
                                    <div class="card-body">
                                    <div class="table-actions">
                                    </div>
                                        <button data-id="${element.id}" type="button" class="btn btn-warning
                                                btnShow showMovieModal" data-toggle="modal" data-target="#modal">Details</button>
                                        <button data-trailer="${element.trailerLink}" type="button" class="btn btn-warning
                                                btnShow showMovieModal" data-toggle="modal" data-target="#modal">Trailer Link</button>
                                    </div>
                                </div>
                            `);
                    });
                }
            }
        },
        statusCode: {
            404: function(data) {
                const errorMsg = JSON.parse(data.responseText).Error;
                alert(errorMsg);
            }
        }
    });
}

// Show all Crews in a List
function showCrews(data, user = 'guest') {
    $("#results").empty();
    data.forEach(crew => {
        if(crew.picture === null) {
            crew.picture = "img/notFoundPicture.jpg";
        }
        $("#results").append(`
            <div class="card crewInfo" data-id="${crew.id}">
                <img class="card-img-top poster" src="${crew.picture}" data-toggle="modal" data-target="#modal">
                <div class="card-body">
                    <h5 class="card-title">${crew.name}</h5>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><b>Main Activity: </b>${crew.mainActivity}</li>
                </ul>
            </div>
        `);
    });

}