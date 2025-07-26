import axios from "axios";

export default async function getVerifyTokenInfo(req: any, res: any) {
    const cookies = req.headers.cookie || "";
    const cookieObj = cookies
        ? Object.fromEntries(cookies.split("; ").map((c: any) => c.split("=")))
        : {};
    const tokenFromCookie = cookieObj["token"];

    try {
        const isAuth = await axios.get(
            "https://api.intra.42.fr/oauth/token/info",
            {
                headers: {
                    Authorization: `Bearer ${tokenFromCookie}`,
                },
            },
        );

        const userId = isAuth.data?.resource_owner_id?.toString();

        if ((req.method === "POST" || req.method === "DELETE") && req.body["user_id"]?.toString() !== userId) {
            return res.status(401).json({ status: "Forbidden" });
        }

        if ((req.method === "GET" || req.method === "PATH") && req.query["user_id"]?.toString() !== userId) {
            return res.status(401).json({ status: "Forbidden" });
        }

    } catch (e) {
        return res.status(403).json({ status: "Forbidden" });
    }
}