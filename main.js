let parentDiv = document.getElementById('list-container');
let childDiv;

const myFunction = () => {
    const inputValue = document.getElementById('search-input').value;
    if(!inputValue) {
        parentDiv.innerHTML = "";
        return;
    }

    fetch('https://api.lyrics.ovh/suggest/' + inputValue)
        .then(res => res.json())
        .then(result => {
            arr = result.data.slice(0, 10);
            console.log(arr);
            displayData(arr);
        });
};

const getDuration = second => {
    const secondInt = parseInt(second);
    const minute = Math.floor(secondInt / 60);
    const remainingSecond = secondInt % 60;
    if(remainingSecond < 10) return minute + ':0' + remainingSecond;
    else return minute + ':' + remainingSecond;
};

const displayData = data => {
    const arr = [];
    childDiv = '';

    data.forEach(item => {
        const id = item.id;
        const title = item.title;
        const artist = item.artist.name;
        const album = item.album.title;
        const duration = getDuration(item.duration);

        arr.push({id, title, artist, album, duration});
        displayListItem(id, title, artist);
    });

    parentDiv.innerHTML = childDiv;
};

const displayListItem = (id, title, artist) => {
    childDiv +=   `<div class="card bg-transparent mb-1">
                        <div class="card-header lyrics-bg row align-items-center py-4" id="heading${id}">
                        <div class="col-md-9">
                            <h3 class="lyrics-name">${title}</h3>
                            <p class="author lead">Album by <span class="font-weight-bold">${artist}</span></p>
                        </div>
                        <div class="col-md-3">
                            <button id="button${id}" class="btn btn-success text-light" onclick="getLyrics(${id})" type="button" data-toggle="collapse" data-target="#collapse${id}" aria-expanded="true" aria-controls="collapse${id}">
                            Get Lyrics
                            </button>
                        </div>
                        </div>
                    
                        <div id="collapse${id}" class="collapse" aria-labelledby="heading${id}" data-parent="#list-container">
                        <div class="card-body lyrics-bg">
                            <pre id="lyric${id}" class="lyric"></pre>
                        </div>
                        </div>
                    </div>`
};