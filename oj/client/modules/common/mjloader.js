var mjLoaderSrv = [ '$interval', '$timeout', function($interval, $timeout) {
	var ret = {};
	ret.loading = false;
	ret.loaded = false;
	ret.init = function() {
		if (ret.loaded === false) {
			if (typeof(MathJax) !== 'object' || typeof(MathJax.Hub) !== 'object') {
				ret.loading = true;
				$timeout(function() {
					ret.init();
				}, 300);
			} else {
				ret.loaded = true;
			}
		}
	};
	ret.render = function(content, elementId) {
		if (!ret.loaded) {
			if (!ret.loading) {
				ret.init();
			}
			$timeout(function() {
				ret.render(content, elementId);
			}, 300);
			return;
		}
		MathJax.Hub.Config({ 
			tex2jax: { 
				inlineMath: [ ['$','$'], ["\\(","\\)"] ], 
				processEscapes: true 
			},
			processSectionDelay: 0,
			processUpdateDelay: 0
		});
		$(elementId).hide();
		$(elementId).html(content);
		MathJax.Callback.Queue([ 'Typeset', MathJax.Hub, elementId.substr(1) ], function() {
			var text = $(elementId).html();
			var converter = new showdown.Converter();
			var newText = converter.makeHtml(text);
			$(elementId).html(newText);
			$(elementId).show();
		});
	};
	ret.waitHighlight = function(id) {
		if (typeof(hljs) !== 'object' || document.getElementById(id) === null) {
			$timeout(function() {
				ret.waitHighlight(id);
			}, 100);
		} else {
			hljs.highlightBlock(document.getElementById(id));
		}
	};
	ret.waitId = function(id, exec) {
		if (document.getElementById(id) === null) {
			$timeout(function() {
				ret.waitId(id, exec);
			}, 100);
		} else {
			exec();
		}
	};
	return ret;
} ];
