$(document).ready(function() {
    const URLPath = 'http://localhost:8000';

    $('input[type=radio]').click(function() {
        let searchType = $('input[name="searchType"]:checked').val();
        switch (searchType) {
            case 'moviesSearch':
                $.ajax({
                    url: `${URLPath}/movie`,
                    type: "GET",
                    success: function(data) {
                        console.log(data);
                        // console.log(data[0]);
                        

                        // for (const element of data) {
                        //     console.log(element);

                        //     // const row = $("<tr />");
                        //     // const movies = element["ArtistId"];
                        //     // row.
                        //     //     append($("<td />", { "text": element["ArtistId"]})).
                        //     //     append($("<td />", { "text": element["Name"]}))
                        //     // tableBody.append(row);
                        // }


                        data.forEach(element => {
                            console.log(element.title);
                            let data = element.poster;

                            let bytes = new Uint8Array(data.length / 2);

                            for (let i = 0; i < data.length; i += 2) {
                                bytes[i / 2] = parseInt(data.substring(i, i + 2), 16);
                            }

                            let blob = new Blob([bytes], {type: 'image/bmp'});

                            let image = new Image();
                            image.src = URL.createObjectURL(blob);

                            $("#showList").append(`
                                <div>
                                    <p id="title">${element.title}</p>
                                    <p id="overview">${element.overview}</p>
                                    <p id="releaseDate">${element.releaseDate}</p>
                                    <p id="poster"><img src="${image}"></p>
                                </div>
                            `);
                        });
                    }
                });
                break;
            case 'crewsSearch':
                $.ajax({
                    url: `${URLPath}/crew`,
                    type: "GET",
                    success: function(data) {
                        console.log(data);
                    }
                });
                break;
        }
    });

});