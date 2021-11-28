document.addEventListener("DOMContentLoaded", listTabUrls);

// Get a list of tabs from the current window
function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}

// Load the list of tabs that were closed every time the popup is opened
function listTabUrls() {
  browser.storage.local.get("storageTabUrlList").then((result) => {
	// Only display the list of tabs if it is not undefined
	if (result !== undefined) {
	  document.querySelector("#tabList").innerHTML = result.storageTabUrlList;
	}
	else {
	  console.log("No tabs saved");
	  document.querySelector("#tabList").innerHTML = "No tabs saved";
	}
  });
}

document.addEventListener("click", (e) => {
  if (e.target.id === "closeAndSaveTabs") {
	getCurrentWindowTabs().then((tabs) => {
	  let tabUrlList = [];
	  let tabIdList = [];
	  for (var tab of tabs) {
		tabUrlList.push(tab.url);
		tabIdList.push(tab.id);
	  }
	  console.log(tabUrlList);
	  document.querySelector("#tabList").innerHTML = tabUrlList;
	  browser.tabs.create({url: "https://www.google.com"});
	  browser.tabs.remove(tabIdList);
	  browser.storage.local.set({"storageTabUrlList": tabUrlList}).then(() => console.log("Storage set successfully"));
	  browser.storage.local.get("storageTabUrlList").then((result) => {
		console.log(`storageTabUrlList: ${result}`);
	  });
	});
  }

  if (e.target.id === "openSavedTabs") {
	browser.storage.local.get("storageTabUrlList").then((result) => {
	  console.log(result.storageTabUrlList);  
	  for (removedTabUrl of result.storageTabUrlList) {
		let urlObject = {url: removedTabUrl};
		console.log(`removedTabUrl: ${removedTabUrl}, urlObject: ${urlObject}`);
		browser.tabs.create(urlObject);
	  }
	});
	browser.storage.local.set({"storageTabUrlList": []}).then(() => console.log("Storage reset successfully"));
	listTabUrls();
  }
})