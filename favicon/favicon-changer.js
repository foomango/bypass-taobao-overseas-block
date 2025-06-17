// ==UserScript==
// @name         Favicon Changer
// @description  A script to change the favicon of a website dynamically.
// @icon         https://lh3.googleusercontent.com/HCZN-e46WVjQuhNwXMvqYgi7N-nBBX-u4CMxBj2B15vYqeFF12YTHvE9ECeZ2FuzGWvB1PT03-uCDXGRl_Erjt_-XWc=s120
// @version      0.0.2
// @author       foomango
// @match        *microstrategy.atlassian.net/*
// @match        *provision.customer.cloud.microstrategy.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/705411-foomango
// @license MIT
// ==/UserScript==

(function () {
  "use strict";

  let newFaviconUrl = "";
  if (window.location.hostname.includes("microstrategy.atlassian.net")) {
    newFaviconUrl =
      "https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png";
  } else if (
    window.location.hostname.includes(
      "provision.customer.cloud.microstrategy.com"
    )
  ) {
    newFaviconUrl =
      "https://cdn-1.webcatalog.io/catalog/microstrategy/microstrategy-icon-filled-256.webp?v=1714775136585";
  } else {
    return;
  }

  // Function to dynamically update the favicon
  function changeFavicon(url) {
    // Provide the URL of the desired favicon
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = url;

    // Remove existing favicon if it exists
    ['link[rel="icon"]', 'link[rel="shortcut icon"]'].forEach((rel) => {
      const existingLink = document.querySelector(rel);
      if (existingLink) {
        document.head.removeChild(existingLink);
      }
    });

    // Append the new favicon
    document.head.appendChild(link);
  }

  // Call the function when the page loads
  changeFavicon(newFaviconUrl);

  // Optional: You can add more logic here to change the favicon dynamically
})();
