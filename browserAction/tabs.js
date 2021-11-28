; // Code for the timer portion of the web extension
(function() {
    // Add the module prefix to the console logs for debugging
    const console = consoleAddNameAsPrefix('tabs', '#33FF8D');

    window.addEventListener("load", listTabUrls);
    document.querySelector("#closeAndSaveTabs").addEventListener("click", closeAndSaveTabs);
    document.querySelector("#openSavedTabs").addEventListener("click", openSavedTabs);

    // Load the list of tabs that were closed every time the popup is opened
    function listTabUrls() {
        let tabList = localStorage.getItem("storageTabUrlList");
        if (tabList != null) {
            document.querySelector("#tabList").innerHTML = tabList;
        } else {
            console.log("No tabs saved");
            document.querySelector("#tabList").innerHTML = "No tabs saved";
        }
    }

    // Get a list of tabs from the current window
    function getCurrentWindowTabs() {
        return browser.tabs.query({ currentWindow: true });
    }

    function closeAndSaveTabs() {
        getCurrentWindowTabs().then((tabs) => {
            let tabUrlList = [];
            let tabIdList = [];
            for (var tab of tabs) {
                tabUrlList.push(tab.url);
                tabIdList.push(tab.id);
            }
            console.log(`tabUrlList: ${tabUrlList}. tabIdList: ${tabIdList}.`);
            browser.tabs.create({ url: "https://www.google.com" });
            browser.tabs.remove(tabIdList);
            localStorage.setItem("storageTabUrlList", tabUrlList);
            listTabUrls();
        });
    }

    function openSavedTabs() {
        let tabList = localStorage.getItem("storageTabUrlList");
        if (tabList === null) {
            console.log("tabList is empty");
            return;
        }
        tabList = tabList.split(',');
        console.log(tabList);
        for (removedTabUrl of tabList) {
            console.log(`Opening ${removedTabUrl}`);
            let urlObject = { url: removedTabUrl };
            console.log(`removedTabUrl: ${removedTabUrl}, urlObject: ${urlObject}`);
            browser.tabs.create(urlObject);
        }
        localStorage.removeItem("storageTabUrlList");
        listTabUrls();
    }
})();