/* eslint-disable no-undef */
const puppeteer = require('puppeteer');
const readline = require('readline');
const ExcelInterface = require('./utils/ExcelInterface');
const Trace = require('./utils/Trace');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const scrap = async () => {
  rl.question('Que souhaites-tu rechercher dans les journaux ? ', async (search) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1700, height: 1000 });

    Trace.info('Navigation vers le site https://www.lexpress.fr');
    await page.goto('https://www.lexpress.fr');

    Trace.info("Fermeture de la pop-up incitant à s'abonner à L'express");
    await page.click('body > div.bottom-bar-full.active > div.bottom-bar-full__toggler');

    Trace.info("Clic sur la loupe permettant d'écrire du texte");
    await page.click('#header > div.header__container > div.header-pilars > div > div.header-pilars__action.search__trigger');

    Trace.info(`Saisie du texte de la recherche "${search}"`);
    await page.type('input[name=q]', search, { delay: 20 });

    Trace.info('Validation du formulaire en saisissant [Enter]');
    await page.keyboard.press('Enter');

    Trace.info('Attente du chargement complet de la nouvelle page...');
    await page.waitForNavigation();

    Trace.info('Récupération de tous les titres et liens de la page...');
    const articles = await page.evaluate(() => Array.from(document.querySelectorAll('.thumbnail__title.headline--lg a'), (e) => ({
      title: e.innerText,
      link: e.href,
    })));

    Trace.info('Transformation des données JSON vers un format CSV');
    const Excel = new ExcelInterface(articles);
    await Excel.buildCSV();

    Trace.info('Sauvegarde du CSV dans le dossier /spreadsheets');
    Excel.saveToDesktop();

    // await page.screenshot({ path: 'screenshot.png' });
    await browser.close();

    rl.close();
  });
};

scrap();
