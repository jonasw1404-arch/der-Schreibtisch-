let audioContext;
let analyser;
let dataArray;

const catImg = document.getElementById("catImg");
const button = document.getElementById("button");

// Musik laden
const bgMusic = new Audio("music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.4;

// Explosionssound laden
const explosionSound = new Audio("explosion.wav");
explosionSound.volume = 1.0;

let explosionPlayed = false; // verhindert Dauerspammen

button.onclick = async () => {
    // Mikrofonzugriff
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Musik starten
    bgMusic.play();

    audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    source.connect(analyser);

    dataArray = new Uint8Array(analyser.frequencyBinCount);

    animate();
};

function animate() {
    requestAnimationFrame(animate);

    analyser.getByteFrequencyData(dataArray);

    const volume = dataArray[0]; // einfacher Lautstärkewert 0–255

    // 10 Bereiche definieren
    let index = Math.floor((volume / 255) * 10);
    if (index < 1) index = 1;
    if (index > 10) index = 10;

    // Bild wechseln
    catImg.src = `cat${index}.png`;

    // Explosion-Sound bei cat10
    if (index === 10) {
        if (!explosionPlayed) {
            explosionPlayed = true;
            explosionSound.currentTime = 0;
            explosionSound.play();
        }
    } else {
        explosionPlayed = false;
    }
}
