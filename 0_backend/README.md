# Pubky SDK examples

## How to run the examples?

In order to install and run the Pubky SDK examples, you need to have the following dependencies installed:

- [Backend + SDK](#backend)
- [Frontend (optional)](#frontend-optional)

---

## Requirements

### Backend

We need to clone and install `@pubky/skunks` and link the SDK package locally.

Let's get started!

```bash
# Clone the skunk-works repository
git clone https://github.com/pubky/skunk-works.git

# Navigate to the skunk-works directory
cd skunk-works

# Install dependencies and link the package
npm install
npm run link

# Configure the environment file
cp ./.env.example ./services/backend/.env

# Run the backend locally
npm run backend
```

### Frontend (optional)

If you want to run the frontend, you can do so by following these steps:

```bash
# Clone the front end repository
git clone https://github.com/pubky/pubky-app

# Navigate to the front end directory
cd pubky-app

# Configure the environment file
cp ./.env.example ./.env

# Install dependencies
npm install

# Link the SDK package
npm link @pubky/sdk

# Run the frontend in development mode
npm run start:dev
```

---

## Pubky SDK Examples

Great! Now we have the backend server running and the SDK linked locally. Next, let's install this project:

```bash
# Clone this project
git clone https://github.com/pubky/pubky-sdk-examples.git

# Navigate to the project directory
cd pubky-sdk-examples

# Install dependencies
npm install

# Link the SDK package
npm link @pubky/sdk

# Configure the environment file
cp ./.env-example ./.env

# Run the project in development mode
npm run start:dev
```

With these steps completed, your development environment should be set up and ready to use the Pubky SDK examples.

## Questions or issues?

Any questions or issues? Feel free to reach out in Slack or open an issue in the repository.
