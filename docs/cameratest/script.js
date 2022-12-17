const canvas = document.getElementById("canvas");
const video = document.getElementById("video");
const buffer = document.getElementById("buffer");
var isRecognizing = false;
function cont(facingMode) {
  navigator.mediaDevices.getUserMedia({
    video: {
      width: 640, height: 480,
      facingMode: facingMode
    },
    audio: false,
  }).then(stream => {
    video.srcObject = stream;
    video.play();
    setInterval(() => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      let ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, canvas.width, canvas.height);

      const box = {
        x: 50,
        h: 50
      };
      box.y = canvas.height - (canvas.height - box.h) / 4;
      box.w = (canvas.width - box.x * 2);
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.rect(
        box.x, box.y, box.w, box.h
      );
      ctx.stroke();

      buffer.width = box.w;
      buffer.height = box.h;
      buffer.getContext('2d').drawImage(canvas, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h);
      if (isRecognizing) return;
      isRecognizing = true;
      Tesseract.recognize(
        buffer,
        'jpn',
        { logger: m => console.log(m) }
      ).then(({ data: { text } }) => {
        const out = document.getElementById('output');
        out.innerHTML = text;
        isRecognizing = false;
      })
    }, 200);
  }).catch(e => {
    console.log(e);
    cont("user");
  });
};

cont({
  exact: 'environment'
});




