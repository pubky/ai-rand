import axios from "axios";

type CallAlbyProps = {
  memo: string;
  amount: number;
  metadata: {
    websocketId: string;
    prompt: string;
  };
};

type CreateInvoiceProps = {
  amount: number;
  websocketId: string;
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

async function createInvoice({ amount = 1000, websocketId = "1", prompt }: CreateInvoiceProps) {
  const payload = {
    memo: "AI Rand Post",
    amount,
    metadata: {
      prompt,
      websocketId,
    },
  };

  return callAlby(payload);
}

export { createInvoice };
