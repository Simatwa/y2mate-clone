// Translates the contents language accordingly

function getBrowserLanguageCode() {
    const lang = navigator.language || navigator.browserLanguage || navigator.userLanguage;
    return lang.split('-')[0];
}

var current_lang;
var current_lang_key = "current-lang";

var translation = {};

if (localStorage.getItem(current_lang_key)) {
    current_lang = localStorage.getItem(current_lang_key);
}
else {
    current_lang = getBrowserLanguageCode();
}

var data_lang_map = {
    "en": "English",
    "de": "Deutsch",
    "es": "Español",
    "fr": "Français",
    "hi": "हिन्दी / Hindī",
    "id": "Bahasa Indonesia",
    "it": "Italiano",
    "ja": "日本語",
    "ko": "한국어",
    "my": "Myanmar (မြန်မာ)",
    "ms": "Malay",
    "tl": "Filipino",
    "sw": "Swahili",
    "pt": "Português",
    "ru": "Русский",
    "th": "ไทย",
    "tr": "Türkçe",
    "vi": "Tiếng Việt",
    "zh-CN": "简体中文",
    "zh-TW": "繁體中文",
    "ar": "العربية",
    "bn": "বাঙালি",
    "zh" : "简体中文"
}

function translate_page_contents() {
    var elements = document.querySelectorAll("[data-translate]");
    elements.forEach(function (element) {
        var key = element.getAttribute("data-translate");
        if (translation[key]) {
            element.innerHTML = translation[key];
        }
        else if (translation.error[key]) {
            element.innerHTML = translation.error[key];
        }

        else if (translation.helper[key]) {
            element.innerHTML = translation.helper[key];
        }
    });
    document.title = translation.title;
    document.querySelector('meta[name="description"]').setAttribute('content', translation.description);
    document.getElementById("current-language").innerText = data_lang_map[current_lang];
    document.getElementById("txt-url").setAttribute("placeholder", translation.search_placeholder);
    console.log("Saving current lang to storage - " + current_lang);
    localStorage.setItem(current_lang_key, current_lang);
}

function fetch_and_update_translation(language) {
    if (language === "system") {
        language = getBrowserLanguageCode();
        console.log("Browser language detected - " + language);
    }
    current_lang = language;
    w3.getHttpData(`/translations/${language}.json`, function (data) {
        translation = JSON.parse(data);
        translate_page_contents();
    }
    );
}