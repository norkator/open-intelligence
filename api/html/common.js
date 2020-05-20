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


function AjaxGetMethodCommandAction(url) {
  $.ajax({
    url: apiUrlCommon + url,
    type: 'GET',
  }).done(function (data) {
    toastr.info(data, 'Success', {timeOut: 2000});
  }).fail(function (error) {
    alert(error);
    toastr.error(error, 'Error', {timeOut: 4000});
  });
}

function AjaxPostCommandAction(url, jsonBody = {}) {
  $.ajax({
    url: apiUrlCommon + url,
    type: 'POST',
    data: jsonBody,
  }).done(function (data) {
    toastr.info(data, 'Success', {timeOut: 2000});
  }).fail(function (error) {
    toastr.error(error, 'Error', {timeOut: 4000});
  });

}
