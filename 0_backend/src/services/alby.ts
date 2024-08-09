import axios from "axios";

type CallAlbyProps = {
  memo: string;
  amount: number;
  metadata: {
    websocket_id: string;
    prompt: string;
  };
};

type CreateInvoiceProps = {
  amount: number;
  websocket_id: string;
  prompt: string;
};

const ALBY_API_URL = "https://api.getalby.com/invoices";
const ALBY_ACCESS_TOKEN = process.env.ALBY_ACCESS_TOKEN;

const headersRequest = {
  Authorization: `Bearer ${ALBY_ACCESS_TOKEN}`,
  "Content-Type": "application/json",
};

async function callAlby(payload: CallAlbyProps) {
  try {
    const response = await axios.post(ALBY_API_URL, payload, { headers: headersRequest });

    return response.data;
  } catch (error) {
    console.error("Failed to call Alby API:", error);
    return null;
  }
}

async function createInvoice({ amount = 1000, websocket_id = "", prompt }: CreateInvoiceProps) {
  const payload = {
    memo: "AI Rand Post",
    amount,
    metadata: {
      prompt,
      websocket_id,
    },
  };

  return callAlby(payload);
}

export { createInvoice };
