const myFunction = () => {
    const inputValue = document.getElementById('search-input').value;
    if(!inputValue) return;

    fetch('https://api.lyrics.ovh/suggest/' + inputValue)
        .then(res => res.json())
        .then(result => {
            arr = result.data.slice(0, 10);
            console.log(arr);
        })
}

const getTime = second => {
    const minute = Math.floor(second / 60);
    const remainingSecond = second % 60;
    if(remainingSecond < 10) return minute + ':0' + remainingSecond;
    else return minute + ':' + remainingSecond;
}