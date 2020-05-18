let apiUrlCommon = null;

function SetCommonApiUrl(apiUrl) {
  apiUrlCommon = apiUrl;
}

$('#homeBtn').click(() => {
  document.location.href = apiUrlCommon;
});

$('#camerasBtn').click(() => {
  document.location.href = apiUrlCommon + "cameras.html";
});

$('#platesBtn').click(() => {
  document.location.href = apiUrlCommon + "plates.html";
});

$('#facesBtn').click(() => {
  document.location.href = apiUrlCommon + "faces.html";
});

$('#trainingBtn').click(() => {
  document.location.href = apiUrlCommon + "training.html";
});
