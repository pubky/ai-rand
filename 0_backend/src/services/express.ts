import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
const http = require("http");
import { Server } from "socket.io";

import { createInvoice } from "./alby";
import { createInvoice as createInvoiceDb, updateInvoiceStatus, updateInvoicePubkyUri, updateInvoiceAiContent } from "./db";
import { generateImageFromText, generatePostText } from "./openai";

const PORT = process.env.PORT || 3000;

const start = async ({ pubkyClient }: { pubkyClient: any }) => {
  try {
    const app = express();
    let connectedClients: any = {};

    app.use(cors());
    app.use(bodyParser.json());

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("a user connected", socket.id);
      connectedClients[socket.id] = socket;

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        delete connectedClients[socket.id]; // Remove o socket da lista ao desconectar
      });

      // socket.on("send-message", (message) => {
      //   console.log(`Message from ${socket.id}: ${message}`);
      //   // Responde apenas ao remetente
      //   socket.emit("message-received", `Server received your message: ${message}`);
      // });
    });

    server.listen(4241, () => {
      console.log("ws on *:4241");
    });

    app.get("/", (req, res) => {
      res.json({ message: "Hello World!" });
    });

    app.post("/new-invoice", async (req, res) => {
      try {
        const { prompt } = req.body;
        if (!prompt) {
          return res.status(400).json({ error: "Prompt is required." });
        }

        const invoiceData = await createInvoice({
          amount: 21,
          websocketId: "1",
          prompt,
        });

        res.json(invoiceData);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    app.post("/webhooks/new-payment", async (req, res) => {
      const { amount } = req.body;
      const { prompt, websocket_id } = req.body.metadata;

      const invoiceDb = await createInvoiceDb({
        websocket_id,
        prompt,
        invoice: JSON.stringify(req.body),
        amount,
      });

      if (!invoiceDb) {
        return res.status(400).json({ error: "Invoice not found." });
      }

      try {
        await updateInvoiceStatus(`${invoiceDb}`, "generating_image");

        emitEvent(connectedClients, websocket_id, "generating_image", `Generating image...`);

        const imageResult = await generateImageFromText({
          prompt: `Create an image about this tweet: ${prompt}`,
        });

        await updateInvoiceStatus(`${invoiceDb}`, "refining_text");

        emitEvent(connectedClients, websocket_id, "refining_text", `Refining text...`);

        const text = await generatePostText({
          prompt: `Write me a tweet about: ${imageResult.data[0].revised_prompt}`,
        });

        await updateInvoiceStatus(`${invoiceDb}`, "publishing_post");

        emitEvent(connectedClients, websocket_id, "publishing_post", `Publishing post...`);

        await updateInvoiceAiContent(`${invoiceDb}`, JSON.stringify(imageResult.data[0]), text);

        // create/update profile in pubky.app
        await pubkyClient.client.social.profile.put(pubkyClient.pubky, {
          bio: "I generate content with AI if you pay me with Lightning!",
          name: "Ai Rand",
        });

        //remove first and last character
        let textNormalized = text;

        if (textNormalized.startsWith('"')) textNormalized = textNormalized.slice(1, -1);

        // get hashtags from textNormalized
        const hashtags = textNormalized.match(/#\w+/g);
        const hashtagsNormalized = hashtags?.map((hashtag: string) => {
          return hashtag.slice(1);
        });

        const uploadedFiles: { fileId: string; fileUri: string }[] = [];

        // get buffer from this image url
        const responseImage = await fetch(imageResult.data[0].url);
        const imageBuffer = await responseImage.arrayBuffer();
        const fileUploadResult = await pubkyClient.client.social.files.upload(pubkyClient.pubky, {
          content: new Uint8Array(imageBuffer),
          contentType: "image/jpeg",
          size: imageBuffer.byteLength,
        });

        uploadedFiles.push({
          fileId: fileUploadResult.value.id,
          fileUri: fileUploadResult.value.uri,
        });

        const postPayload = {
          content: textNormalized,
          files: {
            "0": {
              fileId: fileUploadResult.value.id,
              fileUri: fileUploadResult.value.uri,
            },
          },
        };

        const post = await pubkyClient.client.social.posts.put(pubkyClient.pubky, postPayload);

        hashtagsNormalized?.map(async (hashtag: string) => {
          await pubkyClient.client.social.tags.put(pubkyClient.pubky, post.value.uri, hashtag);
        });

        await updateInvoicePubkyUri(`${invoiceDb}`, post.value.uri);

        await updateInvoiceStatus(`${invoiceDb}`, "done");
        emitEvent(connectedClients, websocket_id, "done", post.value.uri);

        res.json({ message: "Webhook processed successfully." });
      } catch (error: any) {
        console.log(error);
        await updateInvoiceStatus(`${invoiceDb}`, "failed");
        res.status(500).json({ error: error.message });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    return app;
  } catch (error: any) {
    console.log(error);
  }
};

const emitEvent = (connectedClients: any, websocket_id: string, event: string, data: any) => {
  if (connectedClients[websocket_id]) {
    connectedClients[websocket_id].emit(event, data);
    console.log(`Message sent to ${websocket_id}: ${data}`);
  } else {
    console.log(`Socket ${websocket_id} not found`);
  }
};

export default start;
