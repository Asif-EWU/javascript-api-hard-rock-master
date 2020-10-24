const parentDiv = document.getElementById('list-container');
let infoArr; 


// handle search input
const myFunction = () => {
    if(!parentDiv.innerHTML){
        // CSS loader animaiton    
        parentDiv.innerHTML = `<div class="loader mx-auto"></div>`;
    }

    const inputValue = document.getElementById('search-input').value;
    if(!inputValue) {
        parentDiv.innerHTML = "";
        return;
    }

    const url = 'https://api.lyrics.ovh/suggest/' + inputValue;
    const encodedUrl = encodeURI(url);      // handles special characters in the url

    fetch(encodedUrl)
    .then(res => res.json())
    .then(result => {
        const arr = result.data.slice(0, 10);
        displayData(arr);
    })
    .catch(error => console.log(error));
};

const displayData = data => {
    infoArr = [];
    let childDiv = '';

    data.forEach(item => {
        const id = item.id;
        const title = item.title;
        const artist = item.artist.name;
        const album = item.album.title;
        const duration = getDuration(item.duration);

        infoArr.push({id, title, artist, album, duration});
        childDiv += displayListItem(id, title, artist);
    });

    parentDiv.innerHTML = childDiv;
};

const getDuration = second => {
    const secondInt = parseInt(second);
    const minute = Math.floor(secondInt / 60);
    const remainingSecond = secondInt % 60;
    if(remainingSecond < 10) return minute + ':0' + remainingSecond;
    else return minute + ':' + remainingSecond;
};

const displayListItem = (id, title, artist) => {
    return `<div class="card bg-transparent mb-1">
                <div class="card-header lyrics-bg row align-items-center py-4" id="heading${id}">
                    <div class="col-sm-9">
                        <h3 class="lyrics-name">${title}</h3>
                        <p class="author lead">Album by <span class="font-weight-bold">${artist}</span></p>
                    </div>
                    <div class="col-md-3">
                    <button class="btn btn-success text-light" onclick="getLyrics(${id})" type="button" data-toggle="collapse" data-target="#collapse${id}" aria-expanded="true" aria-controls="collapse${id}">
                        Get Lyrics
                        </button>
                    </div>
                </div>
                    
                <div id="collapse${id}" class="collapse" aria-labelledby="heading${id}" data-parent="#list-container">
                    <div class="card-body lyrics-bg">
                        <p>Title: <span class="title font-weight-bold"></span></p>  
                        <p>Artist: <span class="artist font-weight-bold"></span></p>
                        <p>Album: <span class="album font-weight-bold"></span></p>
                        <p>Duration: <span class="duration"></span></p>
                        <h2 class="text-success mb-4 text-center"><span class="song-name"></span> - <span class="artist-name"></span></h2>
                        <pre class="lyric text-white text-center"></pre>
                    </div>
                </div>
            </div>`
};
                        

// handle Get Lyrics button
const getLyrics = id => {
    const songInfo = infoArr.find(item => item.id == id);
    const lyricsUrl = `https://api.lyrics.ovh/v1/${songInfo.artist}/${songInfo.title}`;
    const encodedUrl = encodeURI(lyricsUrl);
    
    fetch(encodedUrl)
    .then(res => res.json())
    .then(data => displayLyrics(songInfo, data))
        .catch(error => console.log(error));
};
    
const displayLyrics = (songInfo, lyricsData) => {
    const {id, title, artist, album, duration} = songInfo;
    let lyrics = lyricsData.lyrics;
    if(!lyrics)
    lyrics = "Server Error!! \n Can't load lyrics right now. \n Please try again in a while...";
    
    setDetails(id, 'title', title);
    setDetails(id, 'artist', artist);
    setDetails(id, 'album', album);
    setDetails(id, 'duration', duration);    
    setDetails(id, 'song-name', title);    
    setDetails(id, 'artist-name', artist);    
    setDetails(id, 'lyric', lyrics);
};

const setDetails = (id, className, info) => {
    const query = `#collapse${id} .${className}`;
    document.querySelector(query).innerText = info;
};
    