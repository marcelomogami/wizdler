chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var command = request && request.command;
		switch (command) {
			case 'showPageAction':
				sendResponse();
				break;

			case 'openEditor':
				chrome.tabs.create({
					url: chrome.runtime.getURL('editor.html') +
						'#wsdl=' + encodeURIComponent(request.url) +
						'&addr=' + encodeURIComponent(request.address) +
						'&title=' + encodeURIComponent(request.title)
				});
				break;

			case 'ajax':
				var headers = request.headers || {};
				if (request.contentType)
					headers['Content-Type'] = request.contentType;

				fetch(request.url, {
					method: request.type || 'GET',
					headers: headers,
					body: request.data || null
				})
				.then(function(response) { return response.text(); })
				.then(function(text) {
					sendResponse({ type: 'success', args: [text] });
				})
				.catch(function() {
					sendResponse({ type: 'error' });
				});
				return true; // mantém o canal aberto para a resposta assíncrona

			default:
				sendResponse();
		}
	}
);
