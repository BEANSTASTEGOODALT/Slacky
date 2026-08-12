require("dotenv").config();

const {
    App
} = require("@slack/bolt");

const app = new App({
    token: SLACK_BOT_TOKEN,
    appToken: SLACK_APP_TOKEN,
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
                "Authorization": `Bearer ${API_KEY}`,
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

(async () => {
    await app.start();
    console.log("bot is running!");
})();
