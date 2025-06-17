// ==UserScript==
// @name         Favicon Changer
// @description  A script to change the favicon of a website dynamically.
// @icon         https://lh3.googleusercontent.com/HCZN-e46WVjQuhNwXMvqYgi7N-nBBX-u4CMxBj2B15vYqeFF12YTHvE9ECeZ2FuzGWvB1PT03-uCDXGRl_Erjt_-XWc=s120
// @version      0.0.1
// @author       foomango
// @match        *microstrategy.atlassian.net/*
// @grant        none
// @namespace    https://greasyfork.org/users/705411-foomango
// @license MIT
// ==/UserScript==

(function () {
  'use strict';

  // Function to dynamically update the favicon
  function changeFavicon(url) {
    const link = document.createElement('link');
    link.rel = 'icon';
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

  // Provide the URL of the desired favicon
  const newFaviconUrl = 'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png';

  // Call the function when the page loads
  changeFavicon(newFaviconUrl);

  // Optional: You can add more logic here to change the favicon dynamically
})();
