import "./style.css";

const AudioContext = window.AudioContext ?? window.webkitAudioContext;
const audioCtx = new AudioContext();

const audioElement = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const volumeSlider = document.getElementById("volume");
const seeker = document.getElementById("seeker");
const time = document.getElementById("time");
const duration = document.getElementById("duration");

const audioSource = audioCtx.createMediaElementSource(audioElement);

const convertTime = (time) => {
  let mins = Math.floor(time / 60);
  let secs = Math.floor(time % 60);

  if (mins < 10) {
    mins = "0" + String(mins);
  }
  if (secs < 10) {
    secs = "0" + String(secs);
  }
  return mins + ":" + secs;
};

window.addEventListener("load", () => {
  time.textContent = convertTime(audioElement.currentTime);
  duration.textContent = convertTime(audioElement.duration);
});

playBtn.addEventListener("click", (event) => {
  const targetEl = event.target;

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  if (targetEl.getAttribute("class") === "paused") {
    audioElement.play();
    targetEl.setAttribute("class", "playing");
  } else if (targetEl.getAttribute("class") === "playing") {
    audioElement.pause();
    targetEl.setAttribute("class", "paused");
  }
});

audioElement.addEventListener("timeupdate", () => {
  seeker.value = audioElement.currentTime;
  time.textContent = convertTime(audioElement.currentTime);
});

seeker.setAttribute("max", audioElement.duration);

audioElement.addEventListener("ended", () => {
  playBtn.setAttribute("class", "paused");
  seeker.value = 0;
  audioElement.currentTime = 0;
});

seeker.addEventListener("input", () => {
  audioElement.currentTime = seeker.value;
});

const gainNode = audioCtx.createGain();

volumeSlider.addEventListener("input", () => {
  gainNode.gain.value = volumeSlider.value;
});

audioSource.connect(gainNode).connect(audioCtx.destination);
