// Contains functions for performing common operations
var api_base_url;
var default_api_base_url = "https://thorough-hortensia-alphab-e7379252.koyeb.app/";

var api_base_url_key = "api_base_url";

var allowed_hosts_pattern = /https?:\/\/localhost(:\d{1,5})?\/?$|https?:\/\/127\.0\.0\.1(:\d{1,5})?\/?$|https:\/\/.[^:]+(:\d{1,5})?\/?$/i

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

function formatQualityString(quality) {
    // formats quality for html display
    var quality_string;
    switch (quality) {
        case "720p":
            quality_string = quality + ` <span class="label label-primary"><small>m-HD</small>`;
            break;

        case "720p50":
        case "720p60":
            quality_string = quality + ` <span class="label label-primary"><small>m-HD+</small>`;
            break;

        case "1080p":
            quality_string = quality + ` <span class="label label-primary"><small>HD</small>`;
            break;

        case "1080p50":
        case "1080p60":
            quality_string = quality + ` <span class="label label-primary"><small>HD+</small>`;
            break;

        case "1440p":
            quality_string = quality + ` <span class="label label-primary"><small>2K</small>`;
            break;

        case "1440p50":
        case "1440p60":
            quality_string = quality + ` <span class="label label-primary"><small>2K+</small>`;
            break;

        case "2160p":
            quality_string = quality + ` <span class="label label-primary"><small>4K</small>`;
            break;

        case "2160p50":
        case "2160p60":
            quality_string = quality + ` <span class="label label-primary"><small>4K+</small>`;
            break;

        default:
            quality_string = quality;
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
            showBaseURLFormError("Base URL must have a protocol i.e <strong>http</strong> or <strong>https</strong>", true);
            return false;
        }
        if (!base_url_input.endsWith("/")) {
            base_url_input += "/";
        }
        if (!allowed_hosts_pattern.test(base_url_input) || /^https?:\/\/.[^:]+:[789]\d{4,}\/?$/.test(base_url_input)) {
            showBaseURLFormError("Invalid api-base-url!");
            return false;
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