// type Listing = {
//   title: string,
//   description: string,
//   price: string,
//   publishedAt: Date,
//   place: string,
//   images: string[],
//   attributes: { label: string, value: string }[],
// };

const getListings = async ({ p = 0 }) => {
  const page = await browser.newPage();
  if (page) {
    await page.goto(`https://www.avito.ma/fr/maroc/%C3%A0_vendre?o=${p}`);
  } else {
    await page.goto(`https://www.avito.ma/fr/maroc/%C3%A0_vendre`);
  }

  const listings = await page.waitForSelector(".listing");
  let links = await listings.$$eval("a", (listings) => {
    return listings.map((listing) => listing.getAttribute("href"));
  });

  return links;
};

const getListingDetails = async (url) => {
  const page = await browser.newPage();
  await page.goto(url);
  let details;

  const images = await page.waitForSelector("div.slick-track");
  details.images = await images.$$eval("img", (images) => {
    return images.map((img) => img.getAttribute("src"));
  });
  details.title = await page.$eval("h1", (title) => title.innerText);
  const Pelement = await page.$(".sc-1x0vz2r-0.lnEFFR.sc-1g3sn3w-13.czygWQ");
  if (Pelement) {
    details.price = await page.evaluate(
      (element) => element.textContent,
      Pelement
    );
  }
  const Delement = await page.$(".sc-ij98yj-0.fAYGMO");
  if (Delement) {
    details.description = await page.evaluate(
      (element) => element.textContent,
      Delement
    );
  }

  const otherAttributes = await page.$(".sc-1g3sn3w-7.bNWHpB");
  if (otherAttributes) {
    details.place = await otherAttributes.$eval("span", (span) => {
      return span.textContent;
    });
    let date = await otherAttributes.$eval("time", (time) => {
      return time.dateTime;
    });

    details.publishedAt = parse(date, "M/d/yyyy, h:mm:ss a", new Date());
  }

  let attrs = await page.$$("ol").then((ol) => ol[1]);
  if (attrs) {
    details.attributes = await attrs.$$eval("li", (lis) => {
      let attributes = lis.map((li) => {
        let spans = li.querySelectorAll("span");
        let key = spans[0].textContent;
        let value = spans[1].textContent;
        return { label: key, value: value };
      });
      return attributes;
    });
  }
  page.close();

  return details;
};

const saveProgress = ({ listings, currentPage }) => {
  const filePath = path.join(__dirname, "listings.json");
  fs.writeFileSync(filePath, JSON.stringify(listings));
  const progressFilePath = path.join(__dirname, "progress.json");
  fs.writeFileSync(progressFilePath, JSON.stringify({ currentPage }));
};

const loadProgress = () => {
  const filePath = path.join(__dirname, "progress.json");
  const progress = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return progress;
};

async function run() {
  browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
    args: ["--start-maximized"],
    timeout: 0,
  });

  let currentPage = 1;
  let listings = [];
  let hasNextPage = true;
  while (hasNextPage) {
    const pageListings = await getListings({ p: currentPage });
    for (let i = 0; i < pageListings.length; i++) {
      try {
        const listing = await getListingDetails(pageListings[i]);
        const doc = await Listing.create(listing);
        await doc.save();
        console.log(`- Listing ${i + 1} of page ${currentPage} done!`);
        listings.push(listing);
      } catch (error) {
        console.log(error);
      }
    }
    currentPage++;
  }
}
