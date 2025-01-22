function showError(message, is_html = false, alert_id = "alert-box", alert_container_class = "alert-box-container") {
    /// alerts user about an error
    hideLoading();
    alertContainer = document.getElementById(alert_id);
    if (is_html) {
        alertContainer.innerHTML = message;
    }
    else {
        alertContainer.innerText = message;
    }
    w3.show("." + alert_container_class);
}

function showHttpError(request) {
    // handles http error accordingly
    const defaultErrorMessage = translation.error.unexpected;
    try {
        feedback = JSON.parse(request.responseText);
        if (feedback && typeof feedback === 'object' && 'detail' in feedback) {
            if (typeof feedback.detail === 'object') {
                showError(translateText(feedback.detail[0].msg + " - " + feedback.detail[0].input));
            }
            else {
                showError(translateText(feedback.detail));
            }
        }
        else {
            showError(defaultErrorMessage);
        }
    }
    catch (error) {
        console.error(`An error occurred while processing the HTTP request: ${error.message}`, error);
        showError(translation.error.unable_to_contact_api + " " + `<a href="${api_base_url}" target="_blank" class="active">${api_base_url}</a>`, true);
    }
}

function postHttpData(url, data, func) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    setRequestHeaders(xhr);
    xhr.onreadystatechange = func;
    xhr.send(JSON.stringify(data));
}

function renderSearchResults(search_results) {
    console.debug("In renderSearchResults");
    var displayableResults = "";
    console.debug(`Forming results`);
    search_results.results.forEach(targetResults => {
        if (lazy_loaded) {
            img_html = `<img class="lazyload ythumbnail" onclick="showVideoMetadata('${targetResults.id}')" src="data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs=" data-src="https://i.ytimg.com/vi/${targetResults.id}/0.jpg">`;
        } else {
            img_html = `<img class="ythumbnail" onclick="showVideoMetadata('${targetResults.id}')" alt="${targetResults.title}" src="https://i.ytimg.com/vi/${targetResults.id}/0.jpg"`;
        }
        displayableResults += `
  <div class="col-xs-6 col-sm-4 col-md-3">
   <div class="thumbnail">
     ${img_html}
    <div class="search-info">
     <p class="p-title" onclick="showVideoMetadata('${targetResults.id}')">
      ${targetResults.title}
     </p>
     <br/>
    </div>
   </div>
  </div>
        `;

    });
    console.debug("Done forming now writing");
    showResults(`<div class="row w3-animate-bottom" id="list-video">${displayableResults}</div>`);
    load_img_lazy();
}

function showLoading(clear = false) {
    w3.hide(".alert-box-container");
    const loading_img = document.getElementById("loading_img");
    w3.removeClassElement(loading_img, "not-displayed");
    const displayContainer = document.getElementById("result");
    if (clear) {
        displayContainer.innerHTML = "";
    }
    loading_img.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

        if (isYoutubeVideoLink(query)) {
            // Link input
            showVideoMetadata(query);
        }
        else {
            showLoading();
            console.debug("Fetching results from API");
            try {
                w3.http(getAbsoluteUrl(`api/v1/search?limit=${search_results_limit}&q=` + query), function () {
                    if (this.readyState == 4) {
                        if (this.status == 200) {
                            renderSearchResults(JSON.parse(this.responseText));
                            updateURL(query);
                        }
                        else {
                            showHttpError(this);
                        }
                    }
                });
            }
            catch (error) {
                showError(`${translation.error.unable_to_search_videos} ${error.message}. ${translation.helper.try_again}`);
            }
        }
    }
    else {
        showError(translation.error.empty_input);
    }
}

function renderVideoMetadata(video_metadata) {
    var displayableVideoMetadata = "";
    var displayableAudioMetadata = "";
    var displayableOtherMetadata = "";
    var video_thumbnail_html = "";
    video_metadata.video = verifyQualitiesSize(video_metadata.video.reverse());
    video_metadata.audio = verifyQualitiesSize(video_metadata.audio.reverse());
    var htmlVideoTags = createVideoTags(video_metadata.others.tags);
    var video_category = video_metadata.others.categories[0] ? video_metadata.others.categories[0] : `<span data-translate="unknown">${translation.helper.unknown}</span>`;
    const size_of_medium_m4a_audio = video_metadata.audio[0].size;

    function getAudioQuality(quality) {
        return size_of_medium_m4a_audio ? quality : `bestaudio`;
    }

    var mp3_audios = [
        ["320k", estimateAudioSize(size_of_medium_m4a_audio, 320), `<span class="label label-primary"><small data-translate="largest">${translation.helper.largest}</small>`],
        ["256k", estimateAudioSize(size_of_medium_m4a_audio, 256), ``],
        ["192k", estimateAudioSize(size_of_medium_m4a_audio, 192), ``],
        ["128k", estimateAudioSize(size_of_medium_m4a_audio, 128), `<span class="label label-primary"><small data-translate="best">${translation.helper.best}</small>`],
        ["96k", estimateAudioSize(size_of_medium_m4a_audio, 96), ``],
        ["64k", estimateAudioSize(size_of_medium_m4a_audio, 64), `<span class="label label-primary"><small data-translate="smallest">${translation.helper.smallest}</small>`],
    ];
    if (lazy_loaded) {
        video_thumbnail_html = `<img alt="Youtube Downloader thumbnail" class="lazyload ythumbnail vid-thumbnail" src="data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs=" data-src="https://i.ytimg.com/vi/${video_metadata.id}/0.jpg">`
    }
    else {
        video_thumbnail_html = `<img alt="Youtube Downloader thumbnail" src="https://i.ytimg.com/vi/${video_metadata.id}/0.jpg">`
    }
    video_metadata.video.forEach(targetVideoMetadata => {
        displayableVideoMetadata += `
                                <tr>
                            <td>
                                ${formatQualityString(targetVideoMetadata.quality, ` (${video_metadata.format.video}) `)}
                            </td>
                            <td>
                                ${getTextOrUnknown(targetVideoMetadata.size)}
                            </td>
                            <td class="txt-center">
                                <button class="btn btn-success"
                                    onclick="startConvert('${targetVideoMetadata.quality}');"
                                    type="button">
                                    <i class="fa-solid fa-download"></i>
                                    <span data-translate="download">${translation.helper.download}</span>
                                </button>
                            </td>
                        </tr>
        `;
    });
    mp3_audios.forEach(targetAudioMetadata => {
        displayableOtherMetadata += `
                                <tr>
                            <td>
                                MP3 - ${targetAudioMetadata[0]}bps ${targetAudioMetadata[2]}
                            </td>
                            <td>
                                ${targetAudioMetadata[1]}
                            </td>
                            <td class="txt-center">
                                <button class="btn btn-success"
                                    onclick="startConvert('${getAudioQuality('medium')}','${targetAudioMetadata[0]}');"
                                    type="button">
                                    <i class="fa-solid fa-download"></i>
                                    <span data-translate="download">${translation.helper.download}</span>
                                </button>
                            </td>
                        </tr>
        `;
    });
    video_metadata.audio.forEach(targetAudioMetadata => {
        var tag = ``;
        if (targetAudioMetadata.quality === "medium") {
            tag = `<span class="label label-primary"><small data-translate="fast">${translation.helper.fast}</small>`;
            displayableAudioMetadata += `
                                <tr>
                            <td>
                                MP3 - 128kbps <span class="label label-primary"><small data-translate="best">${translation.helper.best}</small>
                            </td>
                            <td>
                                ${getTextOrUnknown(targetAudioMetadata.size)}
                            </td>
                            <td class="txt-center">
                                <button class="btn btn-success"
                                    onclick="startConvert('${getAudioQuality('medium')}','128k');"
                                    type="button">
                                    <i class="fa-solid fa-download"></i>
                                    <span data-translate="download">${translation.helper.download}</span>
                                </button>
                            </td>
                        </tr>
        `
        }
        displayableAudioMetadata += `
                                <tr> 
                            <td>
                              ${video_metadata.format.audio} - ${targetAudioMetadata.quality} ${tag}
                            </td>
                            <td>
                                ${getTextOrUnknown(targetAudioMetadata.size)}
                            </td>
                            <td class="txt-center">
                                <button class="btn btn-success"
                                    onclick="startConvert('${getAudioQuality(targetAudioMetadata.quality)}');"
                                    type="button">
                                    <i class="fa-solid fa-download"></i>
                                    <span data-translate="download">${translation.helper.download}</span>
                                </button>
                            </td>
                        </tr>
        `;
    });
    var resultsContent = `
<div class="tabs row w3-animate-right">
    <div class="col-xs-12 col-sm-5 col-md-5">
        <input id="video_id" type="hidden" value="${video_metadata.id}" />
        <div class="thumbnail cover w3-tooltip">
           <a href="https://www.youtube.com/watch?v=${video_metadata.id}" target="_blank">
           ${video_thumbnail_html}
           </a>
            <div class="caption text-left">
                <b>
                    <a href="https://www.youtube.com/watch?v=${video_metadata.id}" class="dead-link" target="_blank">${video_metadata.title}</a>
                    <span class="w3-text w3-tag"><span data-translate="watch_on">${translation.helper.watch_on}</span> <i class="fa-brands fa-youtube w3-large"></i>
                    </span>
                </b>
            </div>
        </div>
        <div>
        <div class="w3-container">
           <p class="w3-left w3-tooltip metadata-info"><i class="fa-solid fa-at metadata-icon "></i> <a class="dead-link" target="_blank" href="${video_metadata.uploader_url}">${video_metadata.channel} </a><i class="w3-tag w3-text" data-translate="uploader">${translation.helper.uploader}</i></p>
           <p class="w3-tooltip metadata-info-rest"><i class="fa-solid fa-clock metadata-icon "></i> ${getTextOrUnknown(video_metadata.duration_string)} <i class="w3-tag w3-text" data-translate="duration">${translation.helper.duration}</i></p>
        </div>
        <div class="w3-container">
           <p class="w3-left w3-tooltip metadata-info"><i class="fa-solid fa-eye metadata-icon "></i> ${shortenNumber(video_metadata.others.views_count)} <i class="w3-tag w3-text">${addCommasToNumber(video_metadata.others.views_count)}</i></p>
           <p class="w3-tooltip metadata-info-rest"><i class="fa-solid fa-heart metadata-icon "></i> ${shortenNumber(video_metadata.others.like_count)}  <i class="w3-tag w3-text">${addCommasToNumber(video_metadata.others.like_count)}</i></p>
        </div>
        <div class="w3-container w3-hide-small">
           <p class="w3-left w3-tooltip metadata-info"><i class="fa-solid fa-tags metadata-icon "></i> <span data-translate="categories">${translation.helper.categories}</span><i class="w3-tag w3-text"> <span data-translate="search">${translation.helper.search}</span></i></p>
           <p class="w3-tooltip metadata-info-rest"><i class="fa-solid fa-tag metadata-icon "></i> ${video_category} <i class="w3-tag w3-text"> <span data-translate="tag">${translation.helper.tag}</span></i></p>
        </div>
        <div class="w3-hide-small video-tags-container w3-tooltip">
        ${htmlVideoTags}
        <i class="w3-tag w3-text" data-translate="categories_note">${translation.categories_note}</i>
        </div>
       </div>
    </div>
    <div class="col-xs-12 col-sm-7 col-md-7">
        <ul class="nav nav-tabs justify-content-start download-table-header" id="selectTab" role="tablist">
            <li class="nav-item p-0 active" role="presentation">
                <button class="w3-button" id="videoButton" onclick="showVideoOptions()">
                    <i class="fa-solid fa-video"></i>
                    <span data-translate="video">${translation.helper.video}</span>
                </button>
            </li>
            <li class="nav-item p-0" role="presentation">
                <button class="w3-button" id="audioButton" onclick="showAudioOptions()">
                    <i class="fa-solid fa-music"></i>
                    <span data-translate="audio">${translation.helper.audio}</span>
                </a>
            </li>
            <li class="nav-item p-0" role="presentation">
                <button class="w3-button" id="otherButton" onclick="showOtherOptions()">
                    <i class="fa-solid fa-layer-group"></i>
                   <span data-translate="other">${translation.helper.other}</span>
                </a>
            </li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane w3-animate-bottom" id="mp4">
                <table class="table table-bordered w3-table-all">
                    <thead>
                        <tr>
                            <th data-translate="file_type">
                                ${translation.helper.file_type}
                            </th>
                            <th data-translate="file_size">
                                ${translation.helper.file_size}
                            </th>
                            <th data-translate="action">
                                ${translation.helper.action}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    ${displayableVideoMetadata}
                    </tbody>
                </table>
            </div>
            <div class="tab-pane w3-animate-right" id="audio">
                <table class="table table-bordered w3-table-all">
                    <thead>
                        <tr>
                            <th data-translate="file_type">
                                ${translation.helper.file_type}
                            </th>
                            <th data-translate="file_size">
                                ${translation.helper.file_size}
                            </th>
                            <th data-translate="action">
                                ${translation.helper.action}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    ${displayableAudioMetadata}
                    </tbody>
                </table>
            </div>
            <div class="tab-pane w3-animate-zoom" id="other">
                <table class="table table-bordered w3-table-all">
                    <thead>
                        <tr>
                            <th data-translate="file_type">
                                ${translation.helper.file_type}
                            </th>
                            <th data-translate="file_size">
                                ${translation.helper.file_size}
                            </th>
                            <th data-translate="action">
                                ${translation.helper.action}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    ${displayableOtherMetadata}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="w3-container w3-hide-large w3-hide-medium">
        <p class="w3-left w3-tooltip"><i class="fa-solid fa-tags metadata-icon "></i> ${translation.helper.categories}<i class="w3-tag w3-text"> <span data-translate="search">${translation.helper.search}</span></i></p>
        <p class="w3-right w3-tooltip metadata-info-rest"><i class="fa-solid fa-tag metadata-icon "></i> ${video_category} <i class="w3-tag w3-text"> <span data-translate="tag">${translation.helper.tag}</span></i></p>
    </div>
    <div class="w3-container w3-hide-large w3-hide-medium video-tags-container w3-tooltip">
        ${htmlVideoTags}
        <i class="w3-tag w3-text metadata-info" data-translate="categories_note">${translation.categories_note}</i>
    </div>
    <div class="clearfix">
    </div>
</div>
    `;
    showResults(resultsContent);
    showVideoOptions();
    videoTitleElement = document.getElementById("videoTitle");
    videoTitleElement.innerHTML = `<b>${video_metadata.title}</b>`;
    load_img_lazy();
    setTimeout(addOnClickEventToVideoTags, 100);
    checkBrowserAndSetOverflow();

}

function showVideoMetadata(link) {
    // fetch and call renderVideoMetadata
    showLoading();
    console.debug("Fetching metadata for url : " + link);

    try {
        w3.http(getAbsoluteUrl(`api/v1/metadata?url=${link}`), function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    renderVideoMetadata(JSON.parse(this.responseText));
                    updateURL(link);
                }
                else {
                    showHttpError(this);
                }
            }
        });
    }

    catch (error) {
        showError(`${translation.error.unable_to_search_videos} ${error.message}. ${translation.helper.try_again}`);
    }

    console.debug("after post request");
}

// The approach below here is disgusting but it gets the work done ):-

function showVideoOptions() {
    videoElement = document.getElementById("mp4");
    audioElement = document.getElementById("audio");
    otherElement = document.getElementById("other");
    w3.hideElement(audioElement);
    w3.hideElement(otherElement);
    w3.showElement(videoElement);
    w3.addClass("#videoButton", "active-btn");
    w3.removeClass("#audioButton", "active-btn");
    w3.removeClass("#otherButton", "active-btn");

}

function showAudioOptions() {
    videoElement = document.getElementById("mp4");
    audioElement = document.getElementById("audio");
    otherElement = document.getElementById("other");
    w3.hide(videoElement);
    w3.hide(otherElement);
    w3.show(audioElement);
    w3.addClass("#audioButton", "active-btn");
    w3.removeClass("#videoButton", "active-btn");
    w3.removeClass("#otherButton", "active-btn");
}

function showOtherOptions() {
    videoElement = document.getElementById("mp4");
    audioElement = document.getElementById("audio");
    otherElement = document.getElementById("other");
    w3.hide(videoElement);
    w3.hide(audioElement);
    w3.show(otherElement);
    w3.addClass("#otherButton", "active-btn");
    w3.removeClass("#audioButton", "active-btn");
    w3.removeClass("#videoButton", "active-btn");
}

function displayProgressBar() {
    w3.show("#process-waiting");
    document.getElementById("process-result").innerHTML = "";
    const progressBar = document.getElementById("progress-bar");
    const speedIndicator = document.getElementById("speed-indicator");
    const etaIndicator = document.getElementById("eta-indicator");
    speedIndicator.innerHTML = "-:-";
    etaIndicator.innerHTML = "-:-";
    progressBar.style.width = `0%`;

    if (!progressBar) {
        console.error("Progress bar element not found!");
        return;
    }

    return {

        update: (percent, speed, eta) => {
            progressBar.style.width = percent;
            speedIndicator.innerHTML = speed;
            etaIndicator.innerHTML = eta;
        },

        stop: () => {
            progressBar.style.width = `100%`;
            w3.hide("#process-waiting");
            progressBar.style.width = `0%`;
        },

        stopCompletely: () => {
            progressBar.style.width = `100%`;
            w3.hide("#process-waiting");
            w3.hide("#process-result");
        }
    };
}

function renderDownloadOptions(processedMedia) {
    var download_tmpl = `
    <a target="_blank" class="btn btn-success btn-file" rel="nofollow" type="button" href="${processedMedia.link}?download=true">
    <i class="fa-solid fa-download media-icon"></i>
    <span data-translate="download">${translation.helper.download}</span> (${processedMedia.filesize})
    </a> <span data-translate="or" class="w3-hide-small">${translation.helper.or}</span>
    <a target="_blank" class="btn btn-success btn-file play-button" rel="nofollow" type="button" href="${processedMedia.link}">
    <i class="fa-solid fa-play media-icon"></i>
    <span data-translate="play_online">${translation.helper.play_online}</span>
    </a>
    `;

    processedResultsContainer = document.getElementById("process-result");
    processedResultsContainer.innerHTML = download_tmpl;
    w3.show("#process-result");
}

function processVideoForDownloadOverHttp(video_id, quality, bitrate = null) {
    // Initiates download process
    /* It's of no use at the moment since we shifted to using websocket
    which is way more granular */
    const progressBarController = displayProgressBar(100, 16);
    const payload = {
        "bitrate": bitrate,
        "quality": quality,
        "url": video_id
    };
    postHttpData(
        getAbsoluteUrl("api/v1/download"),
        payload,
        function () {
            if (this.readyState == 4) {
                jsonified_response = JSON.parse(this.responseText);
                if (this.status == 200) {
                    progressBarController.stop();
                    renderDownloadOptions(jsonified_response);
                }
                else {
                    progressBarController.stop();
                    showDownloadError(jsonified_response.detail);
                }

            }
        }
    );

}

function processVideoForDownload(video_id, quality, bitrate) {
    const payload = {
        "bitrate": bitrate,
        "quality": quality,
        "url": video_id,
        "x_lang": current_lang
    };
    const is_processing_video = /(ultralow|low|medium)/.test(quality) ? false : true;

    var finished_download_count = 0;

    const progressBarController = displayProgressBar();

    const convertingMessageContainer = document.getElementById("cp_converting");

    convertingMessageContainer.innerHTML = translation.processing;

    const ws = new WebSocket(getAbsoluteUrl('api/v1/download/ws', true));

    function updateProgressMessage(download_percentage, is_subtitle) {
        let message = `${translation.helper.downloading} `;
        let description = '';

        if (is_subtitle === true) {
            description = `<strong>Subtitles</strong> (${current_lang})`;
        }

        else if (is_processing_video) {

            if (!download_percentage) {
                return;
            }

            if (finished_download_count == 0) {
                description = `<strong>${translation.helper.video}</strong> (${download_percentage}, 1/2)`;
            }
            else if (finished_download_count == 1) {
                description = `<strong>${translation.helper.audio}</strong> (${download_percentage}, 2/2)`;
            }

            else {
                message = `${translation.helper.merging} (${translation.helper.audio} & ${translation.helper.video})`;
            }
        }
        else {
            if (finished_download_count == 0) {
                description = `<strong>${translation.helper.audio}</strong> (${download_percentage}, 1/1)`;
            }
            else {
                message = bitrate ? `${translation.converting_to_mp3} (${bitrate}bps)` : translation.helper.post_processing;
            }
        }
        convertingMessageContainer.innerHTML = message + description + " ...";
    }

    function processNewMessage(event) {
        // ws.onmessage
        let response = JSON.parse(event.data);
        const status = response['status'];

        switch (status) {
            case "downloading":
                let progress = response.detail;
                displayDownloadModal();
                progressBarController.update(progress.progress, progress.speed, progress.eta);
                updateProgressMessage(progress.progress, /vtt/i.test(progress.ext));
                break;

            case "finished":
                let finishedDownloadReport = response.detail;
                if (! /\.vtt$/i.test(finishedDownloadReport.filename)) {
                    finished_download_count += 1;
                    updateProgressMessage("100%", false);
                }
                console.debug(`Download finished for file - ${finishedDownloadReport.filename}`);
                break;

            case "completed":
                displayDownloadModal();
                progressBarController.stop();
                let downloadReport = response.detail;
                console.debug("Download completed for file: " + downloadReport.filename);

                if (!/^http/.test(downloadReport.link)) {
                    let inner_api_base_url = new URL(api_base_url);
                    downloadReport.link = inner_api_base_url.protocol + downloadReport.link;
                }
                renderDownloadOptions(downloadReport);
                ws.close();
                break;

            case "error":
                progressBarController.stop();
                let errorReport = response.detail;
                console.error('Websocket error (status) : ' + JSON.stringify(errorReport));
                showDownloadError(errorReport.text);
                ws.close();
                break;

            default:
                console.error('Unexpected websocket status : ' + status, response);

        }
    }

    function processError(error) {
        progressBarController.stopCompletely();
        let errorMessage = `WebsocketError : ${error.message !== "undefined" ? error.message : translation.helper.unknown}.
        Is the api still alive at <a class="active" href="${api_base_url}">${api_base_url}?</a>`;
        //showError(errorMessage, true);
        showDownloadError(errorMessage);
    }

    ws.onopen = function (event) {
        console.debug("Websocket opened");
        ws.send(JSON.stringify(payload));
    }

    ws.onmessage = processNewMessage;
    ws.onerror = processError;
    ws.onclose = function (event) {
        progressBarController.stop();
        console.debug("Websocket closed");
    }

    let cancelDownloadButton = document.getElementById("hide-processing");
    cancelDownloadButton.addEventListener('click', (e) => {
        progressBarController.stopCompletely();
        ws.close();
    });
}

function startConvert(quality, bitrate = null) {
    $('#progressModal').modal('toggle');
    video_id = document.getElementById("video_id").value;
    processVideoForDownload(video_id, quality, bitrate);
    console.debug(`Processing id : ${video_id} quality : ${quality}`);
}