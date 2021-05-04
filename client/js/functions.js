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

// Show all Crews in a List
function showAllCrews(user = 'guest') {
    $.ajax({
        url: `${URL}crew`,
        type: "GET",
        success: function(crews) {
            showCrews(crews);
        },
        statusCode: {
            404: function(data) {
                $("#results").empty();
                const errorMsg = JSON.parse(data.responseText).Error;
                alert(errorMsg);
            }
        }
    });
    $(document).on('keypress',function(e) {
        if(e.which === 13) {
            $("#btnSearchCrew").click();
        }
    });
}

// Show all Crews in a List
function showCrews(data, user = 'guest') {
    $("#results").empty();
    data.forEach(crew => {
        if(crew.picture === null || crew.picture === '') {
            crew.picture = "../img/notFoundPicture.jpg";
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