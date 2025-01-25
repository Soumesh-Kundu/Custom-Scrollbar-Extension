chrome.tabs.onUpdated.addListener(async (tabId) => {
    const data=await chrome.storage.sync.get(["isApplyChanges",'scrollWidth']);
    const promiseQueue=[];
    if(data.isApplyChanges===undefined){
        promiseQueue.push(chrome.storage.sync.set({isApplyChanges:true}));
    }
    if(data.scrollWidth===undefined){
        promiseQueue.push(chrome.storage.sync.set({scrollWidth:50}));
    }
    const applyPromise=chrome.tabs.sendMessage(tabId, {
        type: "APPLY_CHANGES",
        payload: { isApplyChanges: data.isApplyChanges },
    },()=>{});
    const scrollPromise=chrome.tabs.sendMessage(tabId, {
        type: "CHANGE_SCROLLBAR_WIDTH",
        payload: { scrollWidth: data.scrollWidth },
    },()=>{})
    promiseQueue.push(applyPromise,scrollPromise);
    await Promise.all(promiseQueue);
})

chrome.storage.onChanged.addListener((changes) => {
    if (changes.isApplyChanges?.newValue !== undefined) {
        applyChanges({ isApplyChanges: changes.isApplyChanges.newValue });
    }
    if (changes.scrollWidth?.newValue !== undefined) {
        changeScrollbarWidth({ scrollWidth: changes.scrollWidth.newValue });
    }
});

async function applyChanges(result) {
    const tabs = await chrome.tabs?.query({});
    const ChangePromise = [];
    for (const tab of tabs) {
        if (!tab.id) continue;
        const response = chrome.tabs.sendMessage(tab.id, {
            type: "APPLY_CHANGES",
            payload: { isApplyChanges: result["isApplyChanges"] },
        });
        ChangePromise.push(response);
    }
    await Promise.all(ChangePromise);
}

async function changeScrollbarWidth(result) {
    const tabs = await chrome.tabs?.query({});
    const ChangePromise = [];
    for (const tab of tabs) {
        if (!tab.id) continue;
        const response = chrome.tabs.sendMessage(tab.id, {
            type: "CHANGE_SCROLLBAR_WIDTH",
            payload: { scrollWidth: result["scrollWidth"] },
        });
        ChangePromise.push(response);
    }
    await Promise.all(ChangePromise);
}