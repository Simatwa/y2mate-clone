// Contains functions for performing common operations


const video_patterns = [
    /^https?:\/\/youtu\.be\/([\w\-_]{11}).*/,
    /^https?:\/\/www\.youtube\.com\/watch\?v=([\w\-_]{11}).*/,
    /^https?:\/\/www\.youtube\.com\/embed\/([\w\-_]{11}).*/,
    /^([\w\-_]{11})$/,
    /https?:\/\/youtube\.com\/shorts\/([\w\-_]{11}).*/,
];

const api_base_url = "//192.168.246.45:8000/";

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