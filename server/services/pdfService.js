const puppeteer = require("puppeteer");
const handlebars = require('handlebars');
const fs = require("fs");
const { Readable } = require('stream');

const generatePDF = async (data, templatePath) => {
    try {
        const templateContent = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(templateContent);
        const html = template({data});
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            ignoreHTTPSErrors: true,
            dumpio: false
        });
        const page = await browser.newPage();
        await page.setContent(html);
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true
        });
        await browser.close();

        const pdfStream = Readable.from(pdfBuffer);
        return pdfStream;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate pdf!');
    }
};

module.exports = {
    generatePDF
};
