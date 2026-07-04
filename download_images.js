const fs = require('fs');
const https = require('https');

async function downloadImage(url, path) {
  try {
    console.log(`Downloading ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(path, Buffer.from(buffer));
    console.log(`Successfully saved ${path}`);
  } catch (error) {
    console.error(`Failed to download ${url}:`, error.message);
  }
}

async function main() {
  await downloadImage('https://www.snopes.com/tachyon/2019/07/bezos-amazon.jpg', 'public/bezos.jpg');
  await downloadImage('https://www.history.com/.image/ar_4:3%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTU3ODc5MDgzNjc2Nzg2Mzk5/steve-jobs-steve-wozniak.jpg', 'public/apple.jpg');
  await downloadImage('https://upload.wikimedia.org/wikipedia/commons/9/91/Mark_Zuckerberg_at_the_37th_G8_Summit_in_Deauville_018_v1.jpg', 'public/zuckerberg.jpg');
}

main();
