import axios from "axios";

export default async function handler(req: any, res: any) {
  const { id, start, end } = req.query;

  const cookies = req.headers.cookie || "";
  const cookieObj = cookies
    ? Object.fromEntries(cookies.split("; ").map((c: any) => c.split("=")))
    : {};
  const tokenFromCookie = cookieObj["token"];

  try {
    const response = await axios.post(
      "https://api.intra.42.fr/v2/slots",
      {
        user_id: id,
        begin_at: start,
        end_at: end,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenFromCookie}`,
        },
      },
    );
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ message: error.response.data.error });
  }
}
