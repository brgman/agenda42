import axios from "axios";

export default async function handler(req: any, res: any) {
  const { id, ids, start, end } = req.query;

  const cookies = req.headers.cookie || "";
  const cookieObj = cookies
    ? Object.fromEntries(cookies.split("; ").map((c: any) => c.split("=")))
    : {};
  const tokenFromCookie = cookieObj["token"];

  try {
    const response = await axios.put(
      `https://api.intra.42.fr/v2/slots/${id}`,
      {
        ids: ids,
        slot: {
          begin_at: start,
          end_at: end
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromCookie}`,
        },
      },
    );
    res.status(200).json(response.data);
  } catch (error: any) {
    console.log(">>>", error)
    res.status(error.response?.status || 500).json({ message: error.response.data.error });
  }
}
