# AI RAND - Prompt-Based Lightning-Powered Post Generator

[AI RAND](https://github.com/pubky/ai-rand) is an application that allows users to input a prompt, pay with the Lightning Network, and generate a post based on the prompt. The content is then published on a social network called Pubky. The project includes a backend for handling payments, prompt processing, and post generation, as well as a frontend for user interaction.

## Features

- **Prompt-Based Generation**: Users can guide the generated content by providing a prompt.
- **Lightning Payments**: Uses the Lightning Network for payment, with GetAlby as the provider for invoice generation.
- **Dockerized Setup**: Easily set up and run the project with Docker.

## Project Structure

- **Backend**: Located in the `backend` folder, it handles payments, prompt processing, and integrations with the Pubky SDK.
- **Frontend**: Located in the `frontend` folder, it provides the user interface for submitting prompts and interacting with AI RAND.

## Getting Started

### Prerequisites

Make sure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pubky/ai-rand
   cd ai-rand
    ```

2. Run the app using Docker Compose:
   ```bash
    docker-compose up -d
   ```

This command will start the backend and frontend services in Docker containers.

## Technologies Used

- **Backend:** Node.js, TypeScript, Express, SQLite, Socket.io
- **Frontend:** Next.js, React, Tailwind CSS
- **Payments:** Lightning Network integration with GetAlby for invoice generation

## License
This project is licensed under the MIT License.