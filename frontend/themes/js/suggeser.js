!function (e) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], e) : e("object" == typeof exports && "function" == typeof require ? require("jquery") : jQuery);
  }(function (p) {
    "use strict";
    function o(e, t) {
      function n() {}
      var i = this, s = {ajaxSettings: {}, autoSelectFirst: false, appendTo: document.body, serviceUrl: null, lookup: null, onSelect: null, width: $("#txt-url").width() + 26, minChars: 1, maxHeight: 210, deferRequestBy: 0, params: {}, formatResult: o.formatResult, delimiter: null, zIndex: 9999, type: "GET", noCache: false, onSearchStart: n, onSearchComplete: n, onSearchError: n, preserveInput: false, containerClass: "autocomplete-suggestions", tabDisabled: false, dataType: "text", currentRequest: null, triggerSelectOnValidInput: true, preventBadQueries: true, lookupFilter: function (e, t, n) {
        return -1 !== e.value.toLowerCase().indexOf(n);
      }, paramName: "query", transformResult: function (e) {
        return "string" == typeof e ? p.parseJSON(e) : e;
      }, showNoSuggestionNotice: false, noSuggestionNotice: "No results", orientation: "bottom", forceFixPosition: false};
      i.element = e, i.el = p(e), i.suggestions = [], i.badQueries = [], i.selectedIndex = -1, i.currentValue = i.element.value, i.intervalId = 0, i.cachedResponse = {}, i.onChangeInterval = null, i.onChange = null, i.isLocal = false, i.suggestionsContainer = null, i.noSuggestionsContainer = null, i.options = p.extend({}, s, t), i.classes = {selected: "autocomplete-selected", suggestion: "autocomplete-suggestion"}, i.hint = null, i.hintValue = "", i.selection = null, i.initialize(), i.setOptions(t);
    }
    var i = {escapeRegExChars: function (e) {
      return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }, createNode: function (e) {
      var t = document.createElement("div");
      return t.className = e, t.style.position = "absolute", t.style.display = "none", t;
    }}, n = 27, s = 9, a = 13, u = 38, r = 39, l = 40;
    o.utils = i, (p.Autocomplete = o).formatResult = function (e, t) {
      var n = "(" + i.escapeRegExChars(t) + ")";
      return e.value.replace(new RegExp(n, "gi"), "<strong>$1</strong>").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/&lt;(\/?strong)&gt;/g, "<$1>");
    }, o.prototype = {killerFn: null, initialize: function () {
      var e, t = this, n = "." + t.classes.suggestion, i = t.classes.selected, s = t.options;
      t.element.setAttribute("autocomplete", "off"), t.killerFn = function (e) {
        0 === p(e.target).closest("." + t.options.containerClass).length && (t.killSuggestions(), t.disableKillerFn());
      }, t.noSuggestionsContainer = p('<div class="autocomplete-no-suggestion"></div>').html(this.options.noSuggestionNotice).get(0), t.suggestionsContainer = o.utils.createNode(s.containerClass), (e = p(t.suggestionsContainer)).appendTo(s.appendTo), "auto" !== s.width && e.width(s.width), e.on("mouseover.autocomplete", n, function () {
        t.activate(p(this).data("index"));
      }), e.on("mouseout.autocomplete", function () {
        t.selectedIndex = -1, e.children("." + i).removeClass(i);
      }), e.on("click.autocomplete", n, function () {
        t.select(p(this).data("index"));
      }), t.fixPositionCapture = function () {
        t.visible && t.fixPosition();
      }, p(window).on("resize.autocomplete", t.fixPositionCapture), t.el.on("keydown.autocomplete", function (e) {
        t.onKeyPress(e);
      }), t.el.on("keyup.autocomplete", function (e) {
        t.onKeyUp(e);
      }), t.el.on("blur.autocomplete", function () {
        t.onBlur();
      }), t.el.on("focus.autocomplete", function () {
        t.onFocus();
      }), t.el.on("change.autocomplete", function (e) {
        t.onKeyUp(e);
      }), t.el.on("input.autocomplete", function (e) {
        t.onKeyUp(e);
      });
    }, onFocus: function () {
      var e = this;
      e.fixPosition(), 0 === e.options.minChars && 0 === e.el.val().length && e.onValueChange();
    }, onBlur: function () {
      this.enableKillerFn();
    }, abortAjax: function () {
      var e = this;
      e.currentRequest && (e.currentRequest.abort(), e.currentRequest = null);
    }, setOptions: function (e) {
      var t = this, n = t.options;
      p.extend(n, e), t.isLocal = p.isArray(n.lookup), t.isLocal && (n.lookup = t.verifySuggestionsFormat(n.lookup)), n.orientation = t.validateOrientation(n.orientation, "bottom"), p(t.suggestionsContainer).css({"max-height": n.maxHeight + "px", width: n.width + "px", "z-index": n.zIndex});
    }, clearCache: function () {
      this.cachedResponse = {}, this.badQueries = [];
    }, clear: function () {
      this.clearCache(), this.currentValue = "", this.suggestions = [];
    }, disable: function () {
      var e = this;
      e.disabled = true, clearInterval(e.onChangeInterval), e.abortAjax();
    }, enable: function () {
      this.disabled = false;
    }, fixPosition: function () {
      var e, t, n, i, s, o, a, u, r, l, c, g = this, d = p(g.suggestionsContainer), h = d.parent().get(0);
      h !== document.body && !g.options.forceFixPosition || (r = g.options.orientation, e = d.outerHeight(), t = g.el.outerHeight(), i = {top: (n = g.el.offset()).top - 2, left: n.left}, "auto" === r && (s = p(window).height(), a = -(o = p(window).scrollTop()) + n.top - e, u = o + s - (n.top + t + e), r = Math.max(a, u) === a ? "top" : "bottom"), i.top += "top" === r ? -e : t, h !== document.body && (c = d.css("opacity"), g.visible || d.css("opacity", 0).show(), l = d.offsetParent().offset(), i.top -= l.top, i.left -= l.left, g.visible || d.css("opacity", c).hide()), "auto" === g.options.width && (i.width = g.el.outerWidth() + "px"), d.css(i));
    }, enableKillerFn: function () {
      p(document).on("click.autocomplete", this.killerFn);
    }, disableKillerFn: function () {
      p(document).off("click.autocomplete", this.killerFn);
    }, killSuggestions: function () {
      var e = this;
      e.stopKillSuggestions(), e.intervalId = window.setInterval(function () {
        e.visible && (e.el.val(e.currentValue), e.hide()), e.stopKillSuggestions();
      }, 50);
    }, stopKillSuggestions: function () {
      window.clearInterval(this.intervalId);
    }, isCursorAtEnd: function () {
      var e, t = this.el.val().length, n = this.element.selectionStart;
      return "number" == typeof n ? n === t : !document.selection || ((e = document.selection.createRange()).moveStart("character", -t), t === e.text.length);
    }, onKeyPress: function (e) {
      var t = this;
      if (t.disabled || t.visible || e.which !== l || !t.currentValue) {
        if (!t.disabled && t.visible) {
          switch (e.which) {
            case n:
              t.el.val(t.currentValue), t.hide();
              break;
            case r:
              if (t.hint && t.options.onHint && t.isCursorAtEnd()) {
                t.selectHint();
                break;
              }
              return;
            case s:
              if (t.hint && t.options.onHint) return void t.selectHint();
              if (-1 === t.selectedIndex) return void t.hide();
              if (t.select(t.selectedIndex), false === t.options.tabDisabled) return;
              break;
            case a:
              if (-1 === t.selectedIndex) return void t.hide();
              t.select(t.selectedIndex);
              break;
            case u:
              t.moveUp();
              break;
            case l:
              t.moveDown();
              break;
            default:
              return;
          }
          e.stopImmediatePropagation(), e.preventDefault();
        }
      } else t.suggest();
    }, onKeyUp: function (e) {
      var t = this;
      if (!t.disabled) {
        switch (e.which) {
          case u:
          case l:
            return;
        }
        clearInterval(t.onChangeInterval), t.currentValue !== t.el.val() && (t.findBestHint(), 0 < t.options.deferRequestBy ? t.onChangeInterval = setInterval(function () {
          t.onValueChange();
        }, t.options.deferRequestBy) : t.onValueChange());
      }
    }, onValueChange: function () {
      var e = this, t = e.options, n = e.el.val(), i = e.getQuery(n);
      return e.selection && e.currentValue !== i && (e.selection = null, (t.onInvalidateSelection || p.noop).call(e.element)), clearInterval(e.onChangeInterval), e.currentValue = n, e.selectedIndex = -1, t.triggerSelectOnValidInput && e.isExactMatch(i) ? void e.select(0) : void (i.length < t.minChars ? e.hide() : e.getSuggestions(i));
    }, isExactMatch: function (e) {
      var t = this.suggestions;
      return 1 === t.length && t[0].value === e;
    }, getQuery: function (e) {
      var t, n = this.options.delimiter;
      return n ? (t = e.split(n), p.trim(t[t.length - 1])) : e;
    }, getSuggestionsLocal: function (t) {
      var e = this.options, n = t.toLowerCase(), i = e.lookupFilter, s = parseInt(e.lookupLimit, 10), o = {suggestions: p.grep(e.lookup, function (e) {
        return i(e, t, n);
      })};
      return s && o.suggestions.length > s && (o.suggestions = o.suggestions.slice(0, s)), o;
    }, getSuggestions: function (i) {
      var e, t, n, s, o = this, a = o.options, u = a.serviceUrl;
      if (a.params[a.paramName] = i, t = a.ignoreParams ? null : a.params, false !== a.onSearchStart.call(o.element, a.params)) {
        if (p.isFunction(a.lookup)) return void a.lookup(i, function (e) {
          o.suggestions = e.suggestions, o.suggest(), a.onSearchComplete.call(o.element, i, e.suggestions);
        });
        (e = o.isLocal ? o.getSuggestionsLocal(i) : (p.isFunction(u) && (u = u.call(o.element, i)), n = u + "?" + p.param(t || {}), o.cachedResponse[n])) && p.isArray(e.suggestions) ? (o.suggestions = e.suggestions, o.suggest(), a.onSearchComplete.call(o.element, i, e.suggestions)) : o.isBadQuery(i) ? a.onSearchComplete.call(o.element, i, []) : (o.abortAjax(), s = {url: u, data: t, type: a.type, dataType: a.dataType}, p.extend(s, a.ajaxSettings), o.currentRequest = p.ajax(s).done(function (e) {
          var t;
          o.currentRequest = null, t = a.transformResult(e, i), o.processResponse(t, i, n), a.onSearchComplete.call(o.element, i, t.suggestions);
        }).fail(function (e, t, n) {
          a.onSearchError.call(o.element, i, e, t, n);
        }));
      }
    }, isBadQuery: function (e) {
      if (!this.options.preventBadQueries) return false;
      for (var t = this.badQueries, n = t.length; n--;) if (0 === e.indexOf(t[n])) return true;
      return false;
    }, hide: function () {
      var e = this, t = p(e.suggestionsContainer);
      p.isFunction(e.options.onHide) && e.visible && e.options.onHide.call(e.element, t), e.visible = false, e.selectedIndex = -1, clearInterval(e.onChangeInterval), p(e.suggestionsContainer).hide(), e.signalHint(null);
    }, suggest: function () {
      if (0 !== this.suggestions.length) {
        var i, e = this, t = e.options, s = t.groupBy, o = t.formatResult, a = e.getQuery(e.currentValue), u = e.classes.suggestion, n = e.classes.selected, r = p(e.suggestionsContainer), l = p(e.noSuggestionsContainer), c = t.beforeRender, g = "";
        return t.triggerSelectOnValidInput && e.isExactMatch(a) ? void e.select(0) : (p.each(e.suggestions, function (e, t) {
          var n;
          s && (g += (n = t.data[s], i === n ? "" : '<div class="autocomplete-group"><strong>' + (i = n) + "</strong></div>")), g += '<div class="' + u + '" data-index="' + e + '">' + o(t, a) + "</div>";
        }), this.adjustContainerWidth(), l.detach(), r.html(g), p.isFunction(c) && c.call(e.element, r), e.fixPosition(), r.show(), t.autoSelectFirst && (e.selectedIndex = 0, r.scrollTop(0), r.children("." + u).first().addClass(n)), e.visible = true, void e.findBestHint());
      }
      this.options.showNoSuggestionNotice ? this.noSuggestions() : this.hide();
    }, noSuggestions: function () {
      var e = p(this.suggestionsContainer), t = p(this.noSuggestionsContainer);
      this.adjustContainerWidth(), t.detach(), e.empty(), e.append(t), this.fixPosition(), e.show(), this.visible = true;
    }, adjustContainerWidth: function () {
      var e, t = this.options, n = p(this.suggestionsContainer);
      "auto" === t.width && (e = this.el.outerWidth() - 2, n.width(0 < e ? e : 300));
    }, findBestHint: function () {
      var i = this.el.val().toLowerCase(), s = null;
      i && (p.each(this.suggestions, function (e, t) {
        var n = 0 === t.value.toLowerCase().indexOf(i);
        return n && (s = t), !n;
      }), this.signalHint(s));
    }, signalHint: function (e) {
      var t = "", n = this;
      e && (t = n.currentValue + e.value.substr(n.currentValue.length)), n.hintValue !== t && (n.hintValue = t, n.hint = e, (this.options.onHint || p.noop)(t));
    }, verifySuggestionsFormat: function (e) {
      return e.length && "string" == typeof e[0] ? p.map(e, function (e) {
        return {value: e, data: null};
      }) : e;
    }, validateOrientation: function (e, t) {
      return e = p.trim(e || "").toLowerCase(), -1 === p.inArray(e, ["auto", "bottom", "top"]) && (e = t), e;
    }, processResponse: function (e, t, n) {
      var i = this, s = i.options;
      e.suggestions = i.verifySuggestionsFormat(e.suggestions), s.noCache || (i.cachedResponse[n] = e, s.preventBadQueries && 0 === e.suggestions.length && i.badQueries.push(t)), t === i.getQuery(i.currentValue) && (i.suggestions = e.suggestions, i.suggest());
    }, activate: function (e) {
      var t, n = this, i = n.classes.selected, s = p(n.suggestionsContainer), o = s.find("." + n.classes.suggestion);
      return s.find("." + i).removeClass(i), n.selectedIndex = e, -1 !== n.selectedIndex && o.length > n.selectedIndex ? (t = o.get(n.selectedIndex), p(t).addClass(i), t) : null;
    }, selectHint: function () {
      var e = p.inArray(this.hint, this.suggestions);
      this.select(e);
    }, select: function (e) {
      this.hide(), this.onSelect(e);
    }, moveUp: function () {
      var e = this;
      if (-1 !== e.selectedIndex) return 0 === e.selectedIndex ? (p(e.suggestionsContainer).children().first().removeClass(e.classes.selected), e.selectedIndex = -1, e.el.val(e.currentValue), void e.findBestHint()) : void e.adjustScroll(e.selectedIndex - 1);
    }, moveDown: function () {
      this.selectedIndex !== this.suggestions.length - 1 && this.adjustScroll(this.selectedIndex + 1);
    }, adjustScroll: function (e) {
      var t, n, i, s, o = this, a = o.activate(e);
      a && (t = p(a).outerHeight(), n = a.offsetTop, s = (i = p(o.suggestionsContainer).scrollTop()) + o.options.maxHeight - t, n < i ? p(o.suggestionsContainer).scrollTop(n) : s < n && p(o.suggestionsContainer).scrollTop(n - o.options.maxHeight + t), o.options.preserveInput || o.el.val(o.getValue(o.suggestions[e].value)), o.signalHint(null));
    }, onSelect: function (e) {
      var t = this, n = t.options.onSelect, i = t.suggestions[e];
      t.currentValue = t.getValue(i.value), t.currentValue === t.el.val() || t.options.preserveInput || t.el.val(t.currentValue), t.signalHint(null), t.suggestions = [], t.selection = i, p.isFunction(n) && n.call(t.element, i);
    }, getValue: function (e) {
      var t, n, i = this.options.delimiter;
      return i ? 1 === (n = (t = this.currentValue).split(i)).length ? e : t.substr(0, t.length - n[n.length - 1].length) + e : e;
    }, dispose: function () {
      this.el.off(".autocomplete").removeData("autocomplete"), this.disableKillerFn(), p(window).off("resize.autocomplete", this.fixPositionCapture), p(this.suggestionsContainer).remove();
    }}, p.fn.autocomplete = p.fn.devbridgeAutocomplete = function (n, i) {
      var s = "autocomplete";
      return 0 === arguments.length ? this.first().data(s) : this.each(function () {
        var e = p(this), t = e.data(s);
        "string" == typeof n ? t && "function" == typeof t[n] && t[n](i) : (t && t.dispose && t.dispose(), t = new o(this, n), e.data(s, t));
      });
    };
  }), function () {
    function e() {
      this._busy = false, this._nextSuggestQuery = null, this._suggesting = false;
    }
    function t(e) {
      this.$form = $("#search-form"), this.$input = this.$form.find("input[name=query]"), this.$findButton = this.$form.find("#btn-submit"), this.$resultContainer = $("#result-suggest-container"), this.$downloadSection = $("#result"), this.$supportedSitesList = $("#supported-sites"), this.service = e, this.blinkTimer = null, this.init();
    }
    var o = {error: {code: -1, message: "Network error"}, content: '<div class="error-info">Request failed</div>'};
    window.supportedSites;
    e.prototype = {isBusy: function () {
      return this._busy;
    }, createResponseHandler: function (e, t, n) {
      return this.isBusy() ? null : void analyze();
    }, ajax: function (e, t, n, i) {
      var s = this.createResponseHandler(e, n, i);
      return !!s && ($.ajax({dataType: "json", url: t.url, data: t.data}).done(function (e) {
        s(e);
      }).fail(function () {
        s(o);
      }), e);
    }, find: function (e, t, n) {
      return this.extract(e, t, n);
    }, search: function (e, t, n, i) {
      return this.ajax("search", {url: "/api/search", data: {kw: e, token: t}}, n, i);
    }, extract: function (n, e, i) {
      return this.ajax("extract", {url: "/api/extract", data: {url: n}}, e, function (e) {
        return i(e), (t = /(?:(?:[^:]+:)?\/\/)?([^/]+)(\/.*)/.exec(n)) ? t[1] : "unknown";
        var t;
      });
    }, suggest: function (e, t) {
      var n = this;
      return n._suggesting ? void (n._nextSuggestQuery = {query: e, callback: t}) : (n._suggesting = true, void $.ajax({url: "//suggestqueries.google.com/complete/search", jsonp: "jsonp", dataType: "jsonp", data: {q: e, hl: "en", ds: "yt", client: "youtube"}}).done(function (e) {
        if (n._suggesting) try {
          t(null, e[0], e[1].map(function (e) {
            return e[0];
          }));
        } catch (e) {
          t(e);
        }
      }).fail(function () {
        t("error");
      }).always(function () {
        n._suggesting = false, n._nextSuggestQuery && (n.suggest(n._nextSuggestQuery.query, n._nextSuggestQuery.callback), n._nextSuggestQuery = null);
      }));
    }, stopSuggest: function () {
      this._suggesting = false;
    }}, t.prototype = {update: function (e) {
      this.$resultContainer.html(e.content);
    }, setStatus: function (e, t) {
      this.$downloadSection.removeClass("loading nav"), e && this.$downloadSection.addClass("loading"), t && this.$downloadSection.addClass("nav");
    }, setInputValue: function (e) {
      this.$input.val(e);
    }, getInputValue: function () {
      return this.$input.val();
    }, validateForm: function () {
      return null;
    }, submit: function (e) {
      var t, n, i = this, s = i.validateForm();
      s ? i.update({error: {code: -2, message: t = s}, content: $('<div class="error-info"></div>').text(t)[0].outerHTML}) : (i.service.stopSuggest(), (n = i.service.find(this.getInputValue(), e, function (e) {
        i.hideSuggestion(), i.update(e), i.setStatus();
      })) && (i.setStatus(true), "search" === n ? i.$supportedSitesList.hide() : i.$supportedSitesList.show()));
    }, hideSuggestion: function () {
      this.$input.autocomplete("hide");
    }, blinkPart: function (e) {
      function t() {
        null != n.blinkTimer && (window.clearInterval(n.blinkTimer), n.blinkTimer = null);
      }
      var n = this;
      t();
      var i = 0;
      this.blinkTimer = window.setInterval(function () {
        $(e).toggleClass("light"), 5 == i++ && ($(e).addClass("light"), t());
      }, 1e3);
    }, onFormSubmit: function () {
      event && event.preventDefault(), this.submit("submit");
    }, onFindClick: function () {
      this.submit("button");
    }, onSearchNav: function (e) {
      var t = this;
      t.service.search($(e).data("query"), $(e).data("token"), "nav", function (e) {
        t.update(e), t.setStatus();
      }) && t.setStatus(true, true);
    }, onInputPaste: function () {
      var e = this;
      window.setTimeout(function () {
        e.submit("paste");
      }, 1);
    }, onInputFocus: function () {
      this.$input.select();
    }, onPartTypeClick: function (e) {
      var t = $(e), n = t.data("part-type"), i = t.data("part-index");
      $(".parts.selected").removeClass("selected").find(".part-list.selected").removeClass("selected"), $(".parts[data-type=" + n + "]").addClass("selected").find(".part-list[data-index=" + i + "]").addClass("selected");
    }, onPartItemClick: function (e) {
      $(".part-list > ul > li > a").each(function () {
        e != this && $(this).removeClass("hit").removeClass("light");
      }), $(e).addClass("hit"), this.blinkPart(e);
    }, init: function () {
      function e(e) {
        return function () {
          e.apply(t, arguments);
        };
      }
      var t = this;
      t.$form.submit(e(t.onFormSubmit)), t.$findButton.click(e(t.onFindClick)), t.$resultContainer.on("click", ".search-result-pager a", function () {
        t.onSearchNav(this);
      }).on("click", "a[data-part-type]", function () {
        t.onPartTypeClick(this);
      }).on("click", ".part-list > ul > li > a", function () {
        t.onPartItemClick(this);
      }), t.$input.on("paste", e(t.onInputPaste)).on("focus", e(t.onInputFocus)).autocomplete({lookup: function (i, s) {
        t.service.suggest(i, function (e, t, n) {
          i === t && s({suggestions: n.map(function (e) {
            return {value: e, data: e};
          })});
        });
      }, onSelect: function () {
        t.submit();
      }});
    }}, window.extractorUI = new t(new e);
  }(), $(".toggle").click(function () {
    var e = $(this).data("toggle"), t = $(this).data("toggle-class");
    e && t && $(e).toggleClass(t);
  });
  