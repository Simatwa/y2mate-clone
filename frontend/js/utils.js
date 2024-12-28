// Contains functions for performing common operations


const video_patterns = [
    /^https?:\/\/youtu\.be\/([\w\-_]{11}).*/,
    /^https?:\/\/www\.youtube\.com\/watch\?v=([\w\-_]{11}).*/,
    /^https?:\/\/www\.youtube\.com\/embed\/([\w\-_]{11}).*/,
    /^([\w\-_]{11})$/,
    /https?:\/\/youtube\.com\/shorts\/([\w\-_]{11}).*/,
];


function formatQualityString(quality) {
    // formats quality for html display
    var quality_string = quality;
    if (quality === "720p") {
        quality_string = quality + ` <span class="label label-primary"><small>m-HD</small>`;
    }
    else if (quality === "1080p") {

        quality_string = quality + ` <span class="label label-primary"><small>HD</small>`;

    }
    else if (quality === "1440p") {
        quality_string = quality + ` <span class="label label-primary"><small>2K</small>`;
    }

    else if (quality === "2160p") {
        quality_string = quality + ` <span class="label label-primary"><small>4K</small>`;
    }

    return quality_string;
}


function isYoutubeVideoLink(query) {
    return video_patterns.some(pattern => {
        const match = query.match(pattern);
        return match && match[1];
    });
}