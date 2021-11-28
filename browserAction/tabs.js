; // Code for the timer portion of the web extension
(function() {
    // Add the module prefix to the console logs for debugging
    const console = consoleAddNameAsPrefix('tabs', '##33FF8D');

    document.addEventListener("load", listTabUrls);
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
            // console.log(tabUrlList);
            document.querySelector("#tabList").innerHTML = tabUrlList;
            browser.tabs.create({ url: "https://www.google.com" });
            browser.tabs.remove(tabIdList);
            localStorage.setItem("storageTabUrlList", tabUrlList);
            listTabUrls();
        });
    }

    function openSavedTabs() {
        let tabList = localStorage.getItem("storageTabUrlList");
        console.log(tabList);
        // for (removedTabUrl of tabList) {
        //     let urlObject = { url: removedTabUrl };
        //     console.log(`removedTabUrl: ${removedTabUrl}, urlObject: ${urlObject}`);
        //     browser.tabs.create(urlObject);
        // }
        localStorage.setItem("storageTabUrlList", []);
        listTabUrls();
    }
})();