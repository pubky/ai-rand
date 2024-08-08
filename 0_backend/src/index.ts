import "dotenv/config";

import { initDb } from "./services/db";

import initExpress from "./services/express";
import initPubky from "./services/pubky";

const init = async () => {
  try {
    // initialize database
    await initDb();

    // initialize pubky client
    const pubkyClient = await initPubky();

    // initialize express server
    await initExpress({
      pubkyClient,
    });
  } catch (error) {
    console.log(error);
  }
};
init();
