const chromium = require('chrome-aws-lambda');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const crypto = require('crypto');

require('dotenv').config();

exports.handler = async (event) => {

    const authorizationHeader = event.headers.access_token;
    const accessToken = process.env.ACCESS_TOKEN;

    if (authorizationHeader !== accessToken) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized' })
        };
    }

    let result = null;
    let browser = null;

    try {
        const bucketName = process.env.BUCKET_NAME;
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        let page = await browser.newPage();

        const requestBody = JSON.parse(event.body);

        if(requestBody.html) {
            await page.setContent(requestBody.html);
        } else if (requestBody.url) {
            await page.goto(requestBody.url, { waitUntil: 'networkidle0' });
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Internal Server Error' })
            };
        }


        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        });

        const s3Params = {
            Bucket: bucketName,
            Key: generateUUID()+'.pdf',
            Body: pdfBuffer,
            ContentType: 'application/pdf',
        };

        await s3.upload(s3Params).promise();

        result = s3.getSignedUrl('getObject', {
            Bucket: bucketName,
            Key: s3Params.Key,
            Expires: 3600
        });

    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify(result)
    };
};

function generateUUID() {
    return crypto.randomBytes(16).toString('hex');
}