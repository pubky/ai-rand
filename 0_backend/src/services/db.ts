import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function openDb() {
  try {
    return open({
      filename: "./data/database.db",
      driver: sqlite3.Database,
    });
  } catch (error) {
    console.log(error);
  }
}

async function initDb() {
  try {
    const db = await openDb();
    if (!db) return;
    await db.exec(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        websocket_id TEXT,
        prompt TEXT,
        invoice TEXT,
        amount INTEGER,
        content_image TEXT,
        content_text TEXT,
        pubky_uri TEXT,
        status TEXT CHECK (
          status IN (
            'pending',
            'paid',
            'generating_image',
            'refining_text',
            'creating_tags',
            'uploading_image',
            'publishing_post',
            'done',
            'failed')
          ),
        created_at TEXT,
        updated_at TEXT
      )
          `);
  } catch (error) {
    console.log(error);
  }
}

async function createInvoice({
  websocket_id,
  prompt,
  invoice,
  amount,
  content_image = "",
  content_text = "",
}: {
  websocket_id: string;
  prompt: string;
  invoice: string;
  amount: number;
  content_image?: string;
  content_text?: string;
}) {
  const db = await openDb();
  if (!db) return;
  const result = await db.run(
    `
    INSERT INTO invoices (
        websocket_id,
        prompt,
        invoice,
        amount,
        content_image,
        content_text,
        status,
        created_at,
        updated_at
    ) VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        'paid',
        datetime('now'),
        datetime('now')
    )
  `,
    [websocket_id, prompt, JSON.stringify(invoice), amount, content_image, content_text]
  );

  return result.lastID;
}

async function checkInvoiceExists(invoice: string) {
  const db = await openDb();
  if (!db) return;
  return await db.get(
    `
    SELECT * FROM invoices
    WHERE invoice = ?
  `,
    [invoice]
  );
}

async function updateInvoiceStatus(id: string, status: string) {
  const db = await openDb();
  if (!db) return;
  return await db.run(
    `
    UPDATE invoices
    SET 
        status = ?,
        updated_at = datetime('now')
    WHERE id = ?
  `,
    [status, id]
  );
}

async function updateInvoicePubkyUri(id: string, pubky_uri: string) {
  const db = await openDb();
  if (!db) return;
  return await db.run(
    `
    UPDATE invoices
    SET 
        pubky_uri = ?,
        updated_at = datetime('now')
    WHERE id = ?
  `,
    [pubky_uri, id]
  );
}

async function updateInvoiceAiContent(id: string, content_image: string, content_text: string) {
  const db = await openDb();
  if (!db) return;
  return await db.run(
    `
    UPDATE invoices
    SET 
        content_image = ?,
        content_text = ?,
        updated_at = datetime('now')
    WHERE id = ?
  `,
    [content_image, content_text, id]
  );
}

export { initDb, createInvoice, updateInvoiceStatus, updateInvoicePubkyUri, updateInvoiceAiContent, checkInvoiceExists };
