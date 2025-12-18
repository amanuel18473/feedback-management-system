import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.url?.split("/api/announcements")[1] || "";
  const backendUrl = `https://feedback-mgt-backend.onrender.com/api/v1/announcements${query}`;

  try {
    const response = await fetch(backendUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Proxy request failed" });
  }
}
