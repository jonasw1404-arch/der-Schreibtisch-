let audioContext;
let analyser;
let dataArray;

const catImg = document.getElementById("catImg");
const button = document.getElementById("button");

button.onclick = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

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

    const volume = dataArray[0];   // Einfacher Lautheitswert (0–255)

    // 10 Bereiche definieren
    let index = Math.floor((volume / 255) * 10);
    if (index < 1) index = 1;
    if (index > 10) index = 10;

    // Bild wechseln
    catImg.style.opacity = 0.6;
    catImg.src = `imgs/cat${index}.png`;

    setTimeout(() => catImg.style.opacity = 1, 80);
}
