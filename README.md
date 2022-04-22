# Corp Bot TS

Corp Bot aims to make Eve Echoes corporation management on Discord simple
and intuitive.

**This project is new and under development**

# Planned Features

- Indy Module
    - [ ] Corp Ore Buyback
    - [ ] Corp Mineral Purchasing/Selling
    - [ ] Ship Building
- Kill Mail Module
    - [ ] Scan kill mails posted in a channel
    - [ ] Track isk, types of ships, etc
    - [ ] Enable PvP bounties for certain ships
- Member Management
    - [ ] Corp Interviews
    - [ ] Auto Roles
- ???

# Run Locally

1. Install [Node](https://nodejs.org) v16+
2. `npm install`
3. Copy `.env.example` to `.env` and change values
4. Download a firebase credentials file from your project and place it in the `priv` directory as `firebase-creds.json`
5. `npm run cmd -- --help` to run the cli commands
6. `npm run dev` to start the bot

Don't forget to add the bot to your server with Administrator and Slash Command privileges.
