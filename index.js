const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const xlsx = require('xlsx');

const app = express();
const port = 3000;

app.use(express.json());

const scrapePage = async (baseUrl, pageIndex = 0, maxPageIndex = null, numbers = []) => {
    const pageUrl = `${baseUrl}/index.page.${pageIndex}.htm`;
    try {
        const response = await axios.get(pageUrl);
        const html = response.data;
        const $ = cheerio.load(html);

        $('div.fl.number-table').each((index, element) => {
            numbers.push($(element).text().trim());
        });

        if (maxPageIndex === null) {
            const lastPageElement = $('div.pages a').last();
            const lastPageHref = lastPageElement.attr('href');
            if (lastPageHref) {
                const match = lastPageHref.match(/index\.page\.(\d+)\.htm/);
                if (match) {
                    maxPageIndex = parseInt(match[1], 10);
                }
            }
        }

        // Проверяем, достигли ли мы последней страницы
        if (maxPageIndex !== null && pageIndex < maxPageIndex) {
            return scrapePage(baseUrl, pageIndex + 100, maxPageIndex, numbers);
        } else {
            return numbers;
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // Если страница не найдена, завершаем рекурсию
            return numbers;
        } else {
            console.error(error);
            throw new Error('Error fetching the URL');
        }
    }
};

const writeToExcel = (data, filePath) => {
    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.aoa_to_sheet(data.map(item => [item]));
    xlsx.utils.book_append_sheet(workBook, workSheet, 'Numbers');
    xlsx.writeFile(workBook, filePath);
};

app.get('/scrape', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const numbers = await scrapePage(url);
        const filePath = 'numbers.xlsx';
        writeToExcel(numbers, filePath);
        res.send(`Data saved to ${filePath}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
