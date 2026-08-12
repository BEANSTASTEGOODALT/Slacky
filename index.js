require("dotenv").config();
// Hosting on Render currently, needs site to server backend
const http = require("http");

const {
    App
} = require("@slack/bolt");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});

app.command("/slacky-ping", async ({
    command,
    ack,
    respond
}) => {
    const start = Date.now();
    await ack();
    const latency = Date.now() - start;
    await respond({
        text: `Pong!\nLatency: ${latency}ms`
    });
});

app.command("/slacky-ask", async ({
    command,
    ack,
    respond
}) => {
    await ack();
    let split = command.text.trim().split(' ');
    split.shift();
    let question = split.join(' ');
    let response = await fetch(
        "https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta/llama-3.1-8b-instruct",
                messages: [{
                    role: "user",
                    content: question
                }],
            })
        }
    );
    let data = await response.json();
    await respond({
        text: `Slacky says:\n\n${data.choices[0].message.content}`
    });
});


http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Slacky is running!");
}).listen(3000, () => {
  console.log(`Server working!`);
});

(async () => {
    await app.start();
    console.log("bot is running!");
})();
