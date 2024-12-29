function closeAdAndroid()
{
    $("#adInstallAndroid").css('display','none');
    m_banner_app.setClosed();
}

var clickAds = {
    bannerSrc: 'https://ak.bewathis.com/4/7044012',
    done: false,
    clickTimer: 0,
    clickTimeout: 0,
    storageKey: 'mateads',
    frequencyCapping: 5,
    mobile: null,
    isShown: false,

    initBanner: function (selector) {
        var _this = this;
        $('body').on('click', selector, function (e) {
            _this.showBanner(e, this);
        });
    },

    triggerClick: function ($element) {
        var evObj = document.createEvent('MouseEvents');
        evObj.initEvent('click', true, true);
        $element[0].dispatchEvent(evObj);
    },

    showBanner: function (event, element) {
        if (this.done) {
            return;
        }

        this.done = true;
        this.showClickUnderBanner(event, element);
    },

    isMobile: function () {
        if (this.mobile === null) {
            this.mobile = /iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent);
        }

        return this.mobile;
    },

    showClickUnderBanner: function (event, element) {
        this.isShown=false;
        if (!this.checkFrequencyCapping()) {
            return;
        }

        var _this = this;

        this.storeImpression();

        var data = localStorage.getItem(this.storageKey);
        if (data) {
            data = JSON.parse(data);
            if (Array.isArray(data)) {
                if (data.length > 1) {
                    var k_num = Math.floor(Math.random() * 100) + 1;
                    if(k_num<0){
                        this.isShown = true;
                        window.open(this.bannerSrc);
                    }
                }
            }
        }

        if(!this.isShown){
            window.open(this.bannerSrc);
        }

        if (!this.isMobile()) {
            return;
        }

        event.preventDefault();
        clearTimeout(this.clickTimer);

        this.clickTimer = setTimeout(function () {
            _this.triggerClick($(element));
        }, this.clickTimeout);
    },

    checkFrequencyCapping: function () {
        if (!this.frequencyCapping || !window.localStorage || !window.JSON) {
            return true;
        }

        var data = localStorage.getItem(this.storageKey);
        if (!data) {
            return true;
        }

        data = JSON.parse(data);
        if (!data || !Array.isArray(data)) {
            return true;
        }

        if (data.length < this.frequencyCapping) {
            return true;
        }

        var time = (new Date()).getTime() - 86400000;
        for (var i = 0; i < this.frequencyCapping; i++) {
            if (data[i] < time) {
                return true;
            }
        }

        return false;
    },

    storeImpression: function () {
        if (!this.frequencyCapping || !window.localStorage || !window.JSON) {
            return;
        }

        var data = localStorage.getItem(this.storageKey);
        if (data) {
            data = JSON.parse(data);
        }

        var now = (new Date()).getTime();
        if (!data || !Array.isArray(data)) {
            data = [];
        }
        else {
            var yesterday = now - 86400000;
            data = data.filter(timestamp => timestamp > yesterday);
        }

        data.unshift(now);
        if (data.length > this.frequencyCapping) {
            data = data.slice(0, this.frequencyCapping);
        }

        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
};
clickAds.initBanner('.btn-file');

var m_banner_app = {
    storageKey: 'm_banner_app',
    isShown: true,

    initBannerApp: function () {
        if( $('#adInstallAndroid').length )
        {
            if(this.canShow()){
                $('#adInstallAndroid').show();
            }
        }
    },

    canShow: function () {
        if (!window.localStorage) {
            return true;
        }

        var data = localStorage.getItem(this.storageKey);
        if (!data) {
            return true;
        }
        data = parseInt(data);

        var time = (new Date()).getTime() - 86400000;
        if (data < time) {
            return true;
        }

        return false;
    },

    setClosed: function () {
        if ( !window.localStorage ) {
            return;
        }
        var data = localStorage.getItem(this.storageKey);
        data = (new Date()).getTime();
        localStorage.setItem(this.storageKey, data);
    }
};
m_banner_app.initBannerApp();