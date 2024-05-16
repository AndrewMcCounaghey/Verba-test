# Verba-test

This project is a web scraper built using Node.js, Express, Axios, Cheerio, and XLSX. The scraper fetches data from paginated web pages, extracts specific information, and saves the results into an Excel file.

## Installation

1. Install the required dependencies:

    ```bash
    npm install
    ```

## Usage

1. Start the server:

    ```bash
    node index.js
    ```

2. Send a GET request to the `/scrape` endpoint with the `url` query parameter set to the base URL of the site you want to scrape.

    Example:

    ```
    http://localhost:3000/scrape?url=https://www.agsvyazi.ru/beeline/numbers
    ```
