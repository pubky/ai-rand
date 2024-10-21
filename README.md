# AI Rand: AI-Generated Content Bot for Pubky App

**Description**

AI Rand is an AI-powered content bot designed for Pubky App, a decentralized social media platform. The bot leverages AI to generate engaging text and images and publishes them automatically to the social network. Additionally, it integrates Lightning Network payments, allowing users to pay for AI-generated content via WebLN-compatible wallets.

**Project Summary**

- **Name**: AI Rand
- **Short Description**: AI-generated content for Pubky App, paid via Lightning Network.

**How Pubky Core Was Used**

AI Rand utilizes the Pubky App platform to create a bot profile that automatically posts AI-generated content. Using Pubky's SDK, the bot connects to the Pubky relay, generates cryptographic keys, and publishes new posts directly to the network.

**Why Is This Useful?**

This bot helps bootstrap content for a new social network, providing valuable posts that encourage user engagement right from the start. The decentralized approach ensures that content is shared without centralized censorship.

**Builder Potential**

AI Rand is a demonstration of how developers can leverage Pubky App to integrate bots into the platform. This capability opens up possibilities for creating automated content, enriching social interactions, and expanding the functionality of decentralized social media.

**Technical Overview**

- **Backend**: Built with Express.js to manage invoice creation and webhook responses.
- **Pubky Integration**: The bot utilizes Pubky's SDK to interface with the network, create keys, and post content.
- **AI Integration**: OpenAI APIs are used to generate images and text, which the bot posts to the network. The bot also generates tags to improve discoverability of content.
- **Lightning Network**: Lightning Network is used to enable payments for content generation. Users can scan a QR code and pay using WebLN-compatible wallets like Alby.

**How to Run the Project**

1. **Install Dependencies**: Run `npm install` to install all required dependencies.
2. **Set Environment Variables**: Configure the necessary API keys and network settings for OpenAI, Lightning Network, and Pubky.
3. **Run the Server**: Use `npm start` to start the Express.js server.
4. **Interact with the Bot**: The bot listens for content requests, processes payments via the Lightning Network, and generates posts accordingly.

**Potential Use Cases**

- **AI Content Creation**: Generate creative, engaging posts for decentralized networks without the need for manual creation.
- **Auto-Tagging**: Enhance searchability by generating tags for content automatically.
- **Censorship-Resistant Content**: Publish content without concerns over centralized censorship.

**Get Involved**

AI Rand demonstrates the ease of building on the Pubky App. Whether you're interested in AI content generation, Lightning payments, or decentralized publishing, this project provides a great starting point.

Join the Pubky community and start innovating in decentralized social media today!

**Links**

- [Medium Article](https://medium.com/@synonym_to/pubky-ai-bot-62ebf7348c2a)
- [Twitter Updates](https://twitter.com/synonym_to)
