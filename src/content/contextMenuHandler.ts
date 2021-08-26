const inputTags = ['input', 'textarea', 'select'];
const attributes = ['id', 'name', 'label-aria', 'placeholder'];
let clickedEl: HTMLElement = null;
let identifier: string = null;

function getClickedElementIdentifier(event: Event) {
    clickedEl = event.target as HTMLElement;

    if (!inputTags.includes(clickedEl.nodeName.toLowerCase())) {
        identifier = null;
        return;
    }

    for (let attr of attributes) {
        const attributeValue = clickedEl.getAttribute(attr);
        if (!isNullOrEmpty(attributeValue)) {
            identifier = attributeValue;
            if (document.querySelectorAll('[' + attr + '="' + attributeValue + '"]')?.length === 1) {
                break;
            }
        }
    }
}

function isNullOrEmpty(s: string) {
    return s == null || s === '';
}

document.addEventListener('contextmenu', event => {
    getClickedElementIdentifier(event);
});

chrome.runtime.onMessage.addListener(event => {
    if (event.command === 'getClickedElement' && clickedEl != null) {
        chrome.runtime.sendMessage({
            command: 'getClickedElementResponse',
            sender: 'contextMenuHandler',
            identifier: identifier,
        });
    }
});
