function showHttpError(request) {
    hideLoading();
    feedback = JSON.parse(request.responseText);
    console.log(`Http Error : ${feedback}`);
}

function postHttpData(url, data, func) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("X-Application", "y2mate-clone")
    xhr.onreadystatechange = func; // Attach the handler to the onreadystatechange event
    xhr.send(JSON.stringify(data));
}

function renderSearchResults(search_results) {
    console.log("In renderSearchResults");
    var displayableResults = "";
    console.log(`Forming results`);
    search_results.results.forEach(targetResults => {
        console.log("In loop");
        displayableResults += `
  <div class="col-xs-6 col-sm-4 col-md-3">
   <div class="thumbnail">
     <img alt="${targetResults.title}" class="lazyload ythumbnail" onclick="showVideoMetadata('${targetResults.id}')" data-src="https://i.ytimg.com/vi/${targetResults.id}/0.jpg" src="https://i.ytimg.com/vi/${targetResults.id}/0.jpg"/>
    <div class="search-info">
     <a href="https://youtu.be/${targetResults.id}" onclick="showVideoMetadata('${targetResults.id}')">
      ${targetResults.title}
     </a>
     <br/>
    </div>
   </div>
  </div>
        `;

    });
    console.log("Done forming now writing");
    showResults(`<div class="row" id="list-video">${displayableResults}</div>`);
}

function showLoading() {
    const loading_img = document.getElementById("loading_img");
    w3.removeClassElement(loading_img, "not-displayed");
    const displayContainer = document.getElementById("result");
    displayContainer.innerHTML = "";
}

function hideLoading() {
    const loading_img = document.getElementById("loading_img");
    w3.addClassElement(loading_img, "not-displayed");
}

function showResults(html) {
    // Renders html content to results section
    const displayContainer = document.getElementById("result");
    displayContainer.innerHTML = html;
    hideLoading();
}

function searchVideos() {
    // Search and render videos
    const query = document.querySelector("#txt-url").value;
    if (query !== "") {
        showLoading();
        console.log("Fetching results from API");
        w3.getHttpObject("http://localhost:8000/api/v1/search?limit=20&q=" + query, renderSearchResults);
        console.log("Done rendering search results");
    }
}

function renderVideoMetadata(video_metadata) {
    var displayableVideoMetadata = "";
    var displayableAudioMetadata = "";
    video_metadata.video.forEach(targetVideoMetadata => {
        displayableVideoMetadata += `
                                <tr>
                            <td>
                                ${targetVideoMetadata.quality}
                            </td>
                            <td>
                                ${targetVideoMetadata.size}
                            </td>
                            <td class="txt-center">
                                <button class="btn btn-success"
                                    onclick="startConvert('${targetVideoMetadata.quality}');"
                                    type="button">
                                    <i class="fa-solid fa-download"></i>
                                    Download
                                </button>
                            </td>
                        </tr>
        `;
    });

    video_metadata.audio.forEach(targetAudioMetadata => {
        displayableAudioMetadata += `
                                <tr>
                            <td>
                                m4a - ${targetAudioMetadata.quality}
                            </td>
                            <td>
                                ${targetAudioMetadata.size}
                            </td>
                            <td class="txt-center">
                                <button class="btn btn-success"
                                    onclick="startConvert('${targetAudioMetadata.quality}');"
                                    type="button">
                                    <i class="fa-solid fa-download"></i>
                                    Download
                                </button>
                            </td>
                        </tr>
        `;
    });
    var resultsContent = `
<div class="tabs row">
    <div class="col-xs-12 col-sm-5 col-md-5">
        <input id="video_id" type="hidden" value="${video_metadata.id}" />
        <div class="thumbnail cover">
            <img alt="Youtube Downloader thumbnail" src="https://i.ytimg.com/vi/${video_metadata.id}/0.jpg" />
            <div class="caption text-left">
                <b>
                    ${video_metadata.title}
                </b>
            </div>
        </div>
    </div>
    <div class="col-xs-12 col-sm-7 col-md-7">
        <ul class="nav nav-tabs justify-content-start" id="selectTab" role="tablist">
            <li class="nav-item p-0 active" role="presentation">
                <button class="w3-btn" id="videoButton" onclick="showVideoOptions()">
                    <i class="fa-solid fa-video"></i>
                    Video
                </button>
            </li>
            <li class="nav-item p-0" role="presentation">
                <button class="w3-btn" id="audioButton" onclick="showAudioOptions()">
                    <i class="fa-solid fa-music"></i>
                    Audio
                </a>
            </li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane" id="mp4">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>
                                File type
                            </th>
                            <th>
                                File size
                            </th>
                            <th>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    ${displayableVideoMetadata}
                    </tbody>
                </table>
            </div>
            <div class="tab-pane" id="audio">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>
                                File type
                            </th>
                            <th>
                                File size
                            </th>
                            <th>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    ${displayableAudioMetadata}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="clearfix">
    </div>
</div>
    `;
    showResults(resultsContent);
    showVideoOptions();
    videoTitleElement = document.getElementById("videoTitle");
    videoTitleElement.innerHTML = `<b>${video_metadata.title}</b>`;

}

function showVideoMetadata(link) {
    // fetch and call renderVideoMetadata
    showLoading();
    console.log("Fetching metadata for url : " + link);
    var payload = { "url": link };

    postHttpData(
        "http://localhost:8000/api/v1/metadata",
        payload,
        function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    renderVideoMetadata(JSON.parse(this.responseText));
                }
                else {
                    showHttpError(this);
                }

            }
        }
    );
    console.log("after post request");
}

function showVideoOptions() {
    videoElement = document.getElementById("mp4");
    audioElement = document.getElementById("audio");
    w3.hideElement(audioElement);
    w3.showElement(videoElement);
    w3.addClass("#videoButton", "active-btn");
    w3.removeClass("#audioButton", "active-btn");
}

function showAudioOptions() {
    videoElement = document.getElementById("mp4");
    audioElement = document.getElementById("audio");
    w3.hide(videoElement);
    w3.show(audioElement);
    w3.addClass("#audioButton", "active-btn");
    w3.removeClass("#videoButton", "active-btn");
}

function displayProgressBar(maxWidth, updateRate = 16) {
    w3.show("#process-waiting");
    document.getElementById("process-result").innerHTML = "";
    const progressBar = document.getElementById("progress-bar");

    if (!progressBar) {
        console.error("Progress bar element not found!");
        return;
    }

    let currentWidth = 0;
    let intervalId = null;

    function updateProgress() {
        currentWidth += (1 / updateRate) * maxWidth;
        progressBar.style.width = `${currentWidth}%`;

        if (currentWidth >= maxWidth) {
            clearInterval(intervalId);
        }
    }

    intervalId = setInterval(updateProgress, 1000 / updateRate);

    return {
        stop: () => {
            w3.hide("#process-waiting");
            if (intervalId) clearInterval(intervalId);
        }
    };
}

function renderDownloadOptions(processedMedia) {
    var download_tmpl = `
    <a target="_blank" class="btn btn-success btn-file" rel="nofollow" type="button" href="${processedMedia.link}?download=true">
    <i class="fa-solid fa-download"></i>
    Download (${processedMedia.filesize})
    </a>`;

    processedResultsContainer = document.getElementById("process-result");
    processedResultsContainer.innerHTML = download_tmpl;
}

function processVideoForDownload(video_id, quality) {
    // Initiates download process
    const progressBarController = displayProgressBar(100, 16);
    const payload = {
        "bitrate": null,
        "quality": quality,
        "url": video_id
    };
    postHttpData(
        "http://localhost:8000/api/v1/download",
        payload,
        function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    progressBarController.stop();
                    renderDownloadOptions(JSON.parse(this.responseText));
                }
                else {
                    progressBarController.stop();
                    showHttpError(this);
                }

            }
        }
    );

}

function startConvert(quality) {
    w3.showElement(document.getElementById("progressModal"));
    video_id = document.getElementById("video_id").value;
    processVideoForDownload(video_id, quality);
    console.log(`Processing id : ${video_id} quality : ${quality}`);
}