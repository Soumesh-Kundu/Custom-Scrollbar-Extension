const APPLY_CHANGES = "APPLY_CHANGES";  
const CHANGE_SCROLLBAR_WIDTH= "CHANGE_SCROLLBAR_WIDTH";
chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
        switch(message.type) {
            case APPLY_CHANGES:
                const { isApplyChanges } = message.payload;

                if (isApplyChanges) addChanges();
                else removeChanges();

                sendResponse({ success: "Apply Changes changed" });
            break;
            case CHANGE_SCROLLBAR_WIDTH:
                const { scrollWidth } = message.payload;
                document.documentElement.style.setProperty("--scrollbar-width", `${10+(scrollWidth/10)}px`);
                sendResponse({ success: "Scroll width Changed" });
            break;
            default:
                break;
        }
    }
);

function addChanges(){
    const styleElement=document.createElement("link");
    styleElement.rel="stylesheet";
    styleElement.href=chrome.runtime.getURL("cs.css");
    styleElement.type="text/css";
    styleElement.id="custom_scrollbar_style";
    document.head.appendChild(styleElement);
}
function removeChanges(){
    const styleElement=document.getElementById("custom_scrollbar_style");
    if(!styleElement) return;  
    document.head.removeChild(styleElement);
}