#  Slacky!

Meet Slacky, your friendly slackbot AI-powered companion! Simply ask a question and he will know the answer!

# How it works

It uses a node backend to fetch the question from the Nvidia AI api and return the answer!

# Setup your own
Simply copy the repo, make a .env file in this format:
\n
\n
`
SLACK_BOT_TOKEN=xoxb-token-here
SLACK_APP_TOKEN=xapp-token-here
API_KEY=nvapi-api-key-here
`
\n
then run `npm init -y && npm -i dotenv @slack/bolt` before running `node index.js` to start your own bot!
