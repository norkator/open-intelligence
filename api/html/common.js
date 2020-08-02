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

function AppendLoadingIndicator(jqueryElement) {
  jqueryElement.append('<div id="loading_indicator_place_holder" style="width: 100%"></div>');
  const loading_indicator_place_holder = $('#loading_indicator_place_holder');
  loading_indicator_place_holder.append('<div id="label_image_loading_indicator" ' +
    'style="width: 100%" class="text-center">' +
    '<div class="spinner-border" role="status">' +
    '<span class="sr-only">Loading...</span>' +
    '</div>' +
    '</div>');
}


async function playAudioStack(audioStack = []) {
  for (let i = 0; i < audioStack.length; i++) {
    const item = audioStack[i];
    await new Promise((resolve) => {
      if (item === 0) {
        // insert desired number of milliseconds to pause here
        setTimeout(resolve, 250);
      } else {
        item.onended = resolve;
        item.play();
      }
    });
  }
}
