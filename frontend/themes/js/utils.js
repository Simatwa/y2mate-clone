// Contains functions for performing common operations
var api_base_url;
var default_api_base_url = window.location.origin + "/";

var api_base_url_key = "api_base_url";

var special_base_url_msg = "";
var allowed_hosts_x_pattern;

var current_lang = "en";

var query_key = "query";

var search_results_limit = 50;

if (/^https.+/.test(window.location.origin)) {
    // Non-loopback hosts not allowed
    special_base_url_msg = "Cannot make REST-API calls over <strong>http</strong> except to localhost.";
    console.log(special_base_url_msg);
    allowed_hosts_x_pattern = /^https.+|https?:\/\/localhost(:\d{1,5})?\/?$|https?:\/\/127\.0\.0\.1(:\d{1,5})?\/?$/i;
}
else {
    // Running on http so it can access both secure and insecure hosts
    special_base_url_msg = "Can make REST-API calls over both <strong>http</strong> and <strong>https</strong>.";
    console.log(special_base_url_msg);
    allowed_hosts_x_pattern = /^https?.+/i;

}

if (localStorage.getItem(api_base_url_key)) {
    console.log("Loading base url from local storage");
    api_base_url = localStorage.getItem(api_base_url_key);
}
else {
    api_base_url = default_api_base_url;
}

const video_patterns = [
    /^https?:\/\/youtu\.be\/([\w\-_]{11}).*/,
    /^https?:\/\/www\.youtube\.com\/watch\?v=([\w\-_]{11}).*/,
    /^https?:\/\/www\.youtube\.com\/embed\/([\w\-_]{11}).*/,
    /^([\w\-_]{11})$/,
    /https?:\/\/youtube\.com\/shorts\/([\w\-_]{11}).*/,
];

function formatQualityString(quality, format = "") {
    // formats quality for html display
    var quality_string;
    switch (quality) {
        case "720p":
            quality_string = quality + format + ` <span class="label label-primary"><small>m-HD</small>`;
            break;

        case "720p50":
        case "720p60":
            quality_string = quality + format + ` <span class="label label-primary"><small>m-HD+</small>`;
            break;

        case "1080p":
            quality_string = quality + format + ` <span class="label label-primary"><small>HD</small>`;
            break;

        case "1080p50":
        case "1080p60":
            quality_string = quality + format + ` <span class="label label-primary"><small>HD+</small>`;
            break;

        case "1440p":
            quality_string = quality + format + ` <span class="label label-primary"><small>2K</small>`;
            break;

        case "1440p50":
        case "1440p60":
            quality_string = quality + format + ` <span class="label label-primary"><small>2K+</small>`;
            break;

        case "2160p":
            quality_string = quality + format + ` <span class="label label-primary"><small>4K</small>`;
            break;

        case "2160p50":
        case "2160p60":
            quality_string = quality + format + ` <span class="label label-primary"><small>4K+</small>`;
            break;

        default:
            quality_string = quality + format;
    }

    return quality_string;
}


function isYoutubeVideoLink(query) {
    return video_patterns.some(pattern => {
        const match = query.match(pattern);
        return match && match[1];
    });
}

function getAbsoluteUrl(relative_url) {
    return `${api_base_url}${relative_url}`;
}

function showBaseURLFormError(message, is_html = false) {
    // Renders error message to the changeBaseURL form modal
    showError(message, is_html, "alert-box-base-url", "alert-box-container-base-url");
}

function changeAPIBaseURL(event) {
    event.preventDefault();
    var base_url_input = document.getElementById("new-base-url").value;
    if (base_url_input !== "") {
        if (!/^https?:\/\/.+/i.test(base_url_input)) {
            showBaseURLFormError(translation.error.invalid_base_url_protocol, true);
            return false;
        }

        if (!/https?:\/\/[a-zA-Z0-9_\.-]+(:\d{1,5})?\/?$/.test(base_url_input) || /^https?:\/\/.[^:]+:[789]\d{4,}\/?$/.test(base_url_input)) {
            showBaseURLFormError(translation.error.invalid_base_url);
            return false;
        }

        if (!allowed_hosts_x_pattern.test(base_url_input)) {
            showBaseURLFormError(`<p>${special_base_url_msg}</p>`, true);
            return false;
        }

        if (!base_url_input.endsWith("/")) {
            base_url_input += "/";
        }

        window.api_base_url = base_url_input;
        localStorage.setItem(api_base_url_key, base_url_input);
        console.log("New base url set : " + base_url_input);
    }
    else {
        // set to default
        api_base_url = default_api_base_url;
        console.log("Resetting api_base_url");
    }
    w3.hide("#changeBaseURLModal");
}

function setRequestHeaders(xhr) {
    // Sets request headers for xhr
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("X-Lang", current_lang);
    xhr.setRequestHeader("X-Application", "y2mate-clone");
}


function shortenNumber(num) {
    if (num === undefined || num === null) {
        return "--";
    }
    if (num < 1000) {
        return num.toString();
    }
    const units = ['K', 'M', 'B', 'T'];
    let index = -1;

    while (num >= 1000 && index < units.length) {
        num /= 1000;
        index++;
    }

    return Number(num.toFixed(1)) + units[index];
}

function addCommasToNumber(num) {
    if (num === undefined || num === null) {
        return "--";
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function createVideoTags(tags) {
    return tags.slice(0, 13).map(tag => {
        return `<a href="" tag-value="${tag}" class="video-tags">${tag}</a>`;
    }).join(" ");
}

function addOnClickEventToVideoTags() {
    document.querySelectorAll(".video-tags").forEach(tag => {
        tag.onclick = function (event) {
            event.preventDefault();
            const tagValue = event.target.getAttribute("tag-value");
            document.getElementById("txt-url").value = tagValue;
            searchVideos();
        }
    });
}

function checkForSearchParamInCurrentURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get(query_key);
    if (searchParam) {
        document.getElementById("txt-url").value = searchParam;
        searchVideos();
    }
}

function initHistory() {
    const url = new URL(window.location);
    if (!window.history.state) {
        window.history.replaceState({ url: url.href }, '', url.href);
    }
}

function updateURL(query) {
    const url = new URL(window.location);
    url.searchParams.set(query_key, query);
    if (window.history.state !== null && window.history.state !== undefined && window.history.state.url !== url.href) {
        console.debug("Updating history " + url.href);
        window.history.pushState({ url: url.href }, '', url);
    }
}

function postXHttpData(url, data, func) {
    // Without X-*** headers
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = func;
    xhr.send(JSON.stringify(data));
}

function translateText(text) {
    // Not functioning in the moment
    return text;
    if (current_lang === "en") {
        return text;
    }

    postXHttpData(
        "https://libretranslate.com/translate",
        {
            q: text,
            source: "en",
            target: current_lang,
        },
        function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    return JSON.parse(this.responseText).translatedText;
                }
                else {
                    console.error("Failed to translate text", this.responseText);
                    return text;
                }

            }
        }
    )
    return text;
}