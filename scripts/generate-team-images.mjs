import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const API_KEY = "48a4ef78b3d7b1468b8e604b1dd9a2a7";
const BASE_URL = "https://api.kie.ai/api/v1";

const images = [
  {
    file: "team-daniel-loihl.jpg",
    prompt:
      "Professional portrait photo of a German craftsman in his mid-30s, wearing dark work trousers and a clean navy work shirt with rolled-up sleeves, standing confidently in a metal workshop with welding tables in the background, warm industrial lighting, slight smile, direct eye contact with camera, short dark hair, clean-shaven, photorealistic, professional headshot style, shallow depth of field, 4K quality",
    aspect_ratio: "3:4",
  },
  {
    file: "team-werkstatt.jpg",
    prompt:
      "Professional photo of a small skilled German metalworking workshop team of 3-4 people, mid-30s to 50s, wearing matching dark work clothes, standing together in front of heavy-duty steel welding tables with precision drill hole grid pattern, industrial workshop environment, warm side lighting, confident and proud posture, photorealistic, cinematic quality, 4K",
    aspect_ratio: "4:3",
  },
];

async function apiRequest(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + urlPath);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error("Invalid JSON: " + data));
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function pollUntilDone(taskId, label) {
  console.log(`  ⏳ Polling ${label}...`);
  for (let attempt = 0; attempt < 60; attempt++) {
    await new Promise((r) => setTimeout(r, 5000));
    const res = await apiRequest("GET", `/jobs/recordInfo?taskId=${taskId}`);
    const state = res?.data?.state;
    console.log(`  [${attempt + 1}] state: ${state}`);

    if (state === "success") {
      const resultJson = JSON.parse(res.data.resultJson);
      return resultJson.resultUrls[0];
    }
    if (state === "fail") {
      throw new Error(`Task failed: ${res.data.failMsg}`);
    }
  }
  throw new Error("Timeout waiting for image");
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const protocol = url.startsWith("https") ? https : http;
    protocol.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function main() {
  const outDir = path.resolve("public/images");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const img of images) {
    console.log(`\n🎨 Generating: ${img.file}`);

    const createRes = await apiRequest("POST", "/jobs/createTask", {
      model: "gpt-image-2-text-to-image",
      input: {
        prompt: img.prompt,
        aspect_ratio: img.aspect_ratio,
        resolution: "1K",
      },
    });

    if (createRes.code !== 200) {
      console.error("  ❌ Create failed:", JSON.stringify(createRes));
      continue;
    }

    const taskId = createRes.data.taskId;
    console.log(`  ✅ Task created: ${taskId}`);

    const imageUrl = await pollUntilDone(taskId, img.file);
    console.log(`  🖼  Image URL: ${imageUrl.slice(0, 80)}...`);

    const destPath = path.join(outDir, img.file);
    await downloadFile(imageUrl, destPath);
    console.log(`  💾 Saved to: ${destPath}`);
  }

  console.log("\n✅ Alle Team-Bilder generiert und gespeichert in public/images/");
}

main().catch(console.error);
