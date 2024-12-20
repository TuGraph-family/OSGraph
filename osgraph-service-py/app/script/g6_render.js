const puppeteer = require('puppeteer');

// 从标准输入读取数据
async function getInputData() {
    return new Promise((resolve, reject) => {
        let input = '';
        process.stdin.on('data', chunk => {
            input += chunk;
        });
        process.stdin.on('end', () => {
            try {
                resolve(JSON.parse(input));
            } catch (err) {
                reject(err);
            }
        });
        process.stdin.on('error', err => {
            reject(err);
        });
    });
}

async function renderGraph(data) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // 生成 HTML 内容
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>G6 Graph Render</title>
        <script src="https://gw.alipayobjects.com/os/antv/pkg/_antv.g6-3.2.3/build/g6.js"></script>
        <style>
            html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
            }
            #container {
                width: 800px;
                height: 600px;
            }
        </style>
    </head>
    <body>
        <div id="container"></div>
        <script>
            const graph = new G6.Graph({
                container: 'container',
                width: 800,
                height: 600,
                layout: { type: 'force', animate: false },
                defaultNode: {
                    size: 50,
                    style: { fill: '#40a9ff', stroke: '#096dd9' },
                },
                defaultEdge: { style: { stroke: '#a3b1bf' } },
            });

            const data = ${JSON.stringify(data)};
            graph.data(data);
            graph.render();

            graph.on('afterlayout', () => {
                window.layoutCompleted = true;
            });
        </script>
    </body>
    </html>
    `;

    // 设置页面内容
    await page.setContent(htmlContent);
    await page.waitForFunction('window.layoutCompleted === true', { timeout: 5000 });

    // 截图并保存到 Buffer
    const screenshotBuffer = await page.screenshot({ encoding: 'binary' });
    await browser.close();

    // 将 Buffer 写入标准输出
    process.stdout.write(screenshotBuffer);
}

(async () => {
    try {
        const inputData = await getInputData();
        await renderGraph(inputData);
    } catch (err) {
        console.error('Error rendering graph:', err);
        process.exit(1);
    }
})();
