const asyncHandler = require('express-async-handler')
const puppeteer = require('puppeteer')
// user 
const scrape = asyncHandler(async (req, res) => {
  const pageCount = req.params.page
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  const url = `https://batdongsan.com.vn/ban-can-ho-chung-cu/p${pageCount}`;
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });
  await page.click(".js__product-link-for-product-id .re__card-info .re__card-contact .re__card-contact-button .re__btn.re__btn-cyan-solid--sm.re__btn-icon-left--sm.js__card-phone-btn");

  // Wait for the phone number element to be visible
  await page.waitForSelector(".js__product-link-for-product-id .re__card-info .re__card-contact .re__card-contact-button .re__btn.re__btn-cyan-solid--sm.re__btn-icon-left--sm.js__card-phone-btn span");

  // Get page data
  const quotes = await page.evaluate(() => {
    const quoteList = document.querySelectorAll(".js__card.js__card-full-web.pr-container.re__card-full.re__vip-diamond");
    return Array.from(quoteList).map((quote) => {
      const title = quote.querySelector(".js__product-link-for-product-id .re__card-info .re__card-info-content .re__card-title .pr-title.js__card-title").innerText;
      const price = quote.querySelector(".js__product-link-for-product-id .re__card-info div .re__card-config-price.js__card-config-item").innerText;
      const area = quote.querySelector(".js__product-link-for-product-id .re__card-info div .re__card-config-area.js__card-config-item").innerText;
      const location = quote.querySelector(".js__product-link-for-product-id .re__card-info div .re__card-location span:nth-child(2)").innerText;
      const phoneElement = quote.querySelector(".js__product-link-for-product-id .re__card-info .re__card-contact .re__card-contact-button .re__btn.re__btn-cyan-solid--sm.re__btn-icon-left--sm.js__card-phone-btn span");
      const phone = phoneElement ? phoneElement.innerText.replace(' · Hiện số', '').replace(' · Sao chép', '') : '';

      return { title, price, area, location, phone };
    });
  });

  // Display the quotes
  await res.send(quotes);

  // Close the browser
  await browser.close();
})


const bot = asyncHandler(async (req, res) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  const url = `https://www.freelancer.com/search/projects?projectSkills=3,9,305,335,669&projectLanguages=en,vi`;
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  // Click on "Login with email" button
  await page.click('a[data-uitest-target="login-button"]');

  // Wait for the email/username and password input fields to appear
  await page.waitForSelector('#username');
  await page.type('#username', 'phamducthinhbeo@gmail.com');
  // Introduce a delay of 1 second after typing the username
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await page.waitForSelector('#password');  
  await page.type('#password', '123QWEasd');

  // Submit the login form
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }), // Wait for navigation to complete
    page.click('#login_btn'), // Click the login button
  ]);

  // Navigate to the specified URL
  const reloadUrl = 'https://www.freelancer.com/search/projects?projectSkills=3,9,305,335,669&projectLanguages=en,vi';
  await page.goto(reloadUrl, {
    waitUntil: "domcontentloaded",
  });

  // Get page data
  const quotes = await page.evaluate(() => {
    const jobLinks = document.querySelectorAll('ul.search-result-list');
  
    // Extract the project URLs from the anchor text
    return Array.from(jobLinks).map((link) => {
      const a = link.querySelector('li[ng-repeat="project in search.results.projects a.search-result-link"]');
      
      return { a };
    });
  });
  
  await res.status(200).json(quotes);
});


module.exports = {
    scrape,
    bot
}