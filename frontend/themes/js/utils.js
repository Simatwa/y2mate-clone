// Contains functions for performing common operations

var api_base_url = "https://thorough-hortensia-alphab-e7379252.koyeb.app/";

var api_base_url_key = "api_base_url";

if (localStorage.getItem(api_base_url_key)) {
    console.log("Loading base url from cache");
    api_base_url = localStorage.getItem(api_base_url_key);
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

function changeAPIBaseURL(event) {
    event.preventDefault();
    var base_url_input = document.getElementById("new-base-url").value;
    if (!base_url_input.startsWith("http")) {
        showError("Base URL must have a protocol i.e <strong>http</strong> or <strong>https</strong>", true);
        return;
    }
    if (!base_url_input.endsWith("/")) {
        base_url_input += "/";
    }
    window.api_base_url = base_url_input;
    localStorage.setItem(api_base_url_key, base_url_input);
    console.log("New base url set : " + base_url_input);
    w3.hide("#changeBaseURLModal");
}