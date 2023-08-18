const audioPlayer = new Audio();
const seekBar = document.getElementById("seek-bar");
const playButton = document.getElementById("play-btn");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const volumeBar = document.getElementById("volume-bar");
const playlistItems = document.querySelectorAll(".playlist li");
const coverImage = document.getElementById("cover-image");

let currentTrackIndex = 0;

function loadTrack(trackIndex) {
    audioPlayer.src = playlistItems[trackIndex].getAttribute("data-src");
    audioPlayer.load();
    updateCoverImage(trackIndex);

    const trackName = playlistItems[trackIndex].querySelector('.playlist-title').textContent;
    const songTitleElement = document.getElementById("song-title");
    songTitleElement.textContent = trackName;
    const songNameElement = document.getElementById("song-artist");
    songNameElement.textContent = playlistItems[trackIndex].getAttribute("data-name");

    audioPlayer.addEventListener("loadedmetadata", () => {
        const trackDuration = formatTime(audioPlayer.duration);
        const durationElement = document.getElementById("duration");
        durationElement.textContent = trackDuration;
    });
    setActiveSong(currentTrackIndex);
}

function updateCoverImage(trackIndex) {
    const currentImg = playlistItems[trackIndex].querySelector('img').getAttribute("src");
    coverImage.src = `${currentImg}`;
}

function playPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playButton.style.background = 'url(https://static.tildacdn.com/tild3732-3130-4265-a464-363637373632/pause.svg) no-repeat';
        coverImage.style.transform = 'scale(1)';

    } else {
        audioPlayer.pause();
        playButton.style.background = 'url(https://static.tildacdn.com/tild3437-3339-4439-b761-646636636166/play.svg) no-repeat';
        coverImage.style.transform = 'scale(0.9)';
    }
}

function playNext() {
    currentTrackIndex = (currentTrackIndex + 1) % playlistItems.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
    playButton.style.background = 'url(https://static.tildacdn.com/tild3732-3130-4265-a464-363637373632/pause.svg) no-repeat';
    coverImage.style.transform = 'scale(1)';
    setActiveSong(currentTrackIndex);
}

function playPrev() {
    currentTrackIndex = (currentTrackIndex - 1 + playlistItems.length) % playlistItems.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
    playButton.style.background = 'url(https://static.tildacdn.com/tild3732-3130-4265-a464-363637373632/pause.svg) no-repeat';
    coverImage.style.transform = 'scale(1)';
    setActiveSong(currentTrackIndex);
}

function updateSeekBar() {
    if (!isNaN(audioPlayer.duration)) {
        seekBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    }
}

function updateVolume() {
    audioPlayer.volume = volumeBar.value;
}

function setActiveSong(index) {
    playlistItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}

audioPlayer.addEventListener("timeupdate", () => {
    updateSeekBar();
    updateCurrentTime();
});
audioPlayer.addEventListener("ended", playNext);
seekBar.addEventListener("input", () => {
    if (!isNaN(audioPlayer.duration)) {
        const seekTime = audioPlayer.duration * (seekBar.value / 100);
        audioPlayer.currentTime = seekTime;
    }
});
playButton.addEventListener("click", playPause);
prevButton.addEventListener("click", playPrev);
nextButton.addEventListener("click", playNext);
volumeBar.addEventListener("input", updateVolume);

function updateCurrentTime() {
    const currentTime = formatTime(audioPlayer.currentTime);
    const currentTimeElement = document.getElementById("current-time");
    currentTimeElement.textContent = currentTime;
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

playlistItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        audioPlayer.play();
        playButton.style.background = 'url(https://static.tildacdn.com/tild3732-3130-4265-a464-363637373632/pause.svg) no-repeat';
        coverImage.style.transform = 'scale(1)';
        setActiveSong(currentTrackIndex);
    });
});

loadTrack(currentTrackIndex);