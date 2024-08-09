import "dotenv/config";
import fs from "fs";

const SEED_PATH = process.env.SEED_PATH ? `${process.env.SEED_PATH}/seed` : "seed";
const HOMESERVER = process.env.HOMESERVER || "";
const PKARR_RELAY = process.env.PKARR_RELAY || "";

export const getSeed = (client: any) => {
  // check if seed file exists
  const seedExists = fs.existsSync(SEED_PATH);

  // if seed exists, read from file
  if (seedExists) return fs.readFileSync(SEED_PATH);

  // generate random seed or read from file
  const seed = client.crypto.generateSeed();

  // save file to seed path
  fs.writeFileSync(SEED_PATH, seed);

  // return new seed
  return seed;
};

const start = async () => {
  try {
    // @ts-ignore
    const { default: Client } = await import("@pubky/sdk");

    console.log("connecting to homeserver", HOMESERVER);
    console.log("using relay", PKARR_RELAY);

    // create a new client instance with the homeserver and relay
    const client = new Client(HOMESERVER, {
      relay: PKARR_RELAY,
      homeserverUrl: HOMESERVER,
    });
    console.log(client);

    // wait for client to be ready, it needs to resolve te homeserver url
    await client.ready();

    // get seed from file or generate a new one
    const seed = getSeed(client);

    // how to generate keypair from seed
    const keypair = client.crypto.generateKeyPair(seed);

    // how to get you pubky from the keypair
    const pubky = client.z32.encode(keypair.publicKey);
    console.log("pubky", pubky);

    // login with the seed
    await client.login(seed);

    return { client, pubky };
  } catch (error) {
    console.log(error);
  }
};

export default start;
