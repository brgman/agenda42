import axios from "axios";

export default async function getVerifyTokenInfo(req: any, res: any) {
    const cookies = req.headers.cookie || "";
    const cookieObj = cookies
        ? Object.fromEntries(cookies.split("; ").map((c: any) => c.split("=")))
        : {};
    const tokenFromCookie = cookieObj["token"];
    if (!cookieObj["encrypted_id"])
        return res.status(403).json({ status: "Forbidden" });

    try {
        const isAuth = await axios.get(
            "https://api.intra.42.fr/oauth/token/info",
            {
                headers: {
                    Authorization: `Bearer ${tokenFromCookie}`,
                },
            },
        );

        console.log("isAuth", isAuth.data?.resource_owner_id.toString());
        console.log("query", req.query["user_id"]);
        console.log("body ", req.body["user_id"]);

        if ((req.method === "POST" || req.method === "DELETE") && req.body["user_id"] !== isAuth.data?.resource_owner_id)
            return res.status(401).json({ status: "Forbidden" });

        if ((req.method === "GET" || req.method === "PATH") && req.query["user_id"] !== isAuth.data?.resource_owner_id.toString())
            return res.status(401).json({ status: "Forbidden", });
    } catch (e) {
        return res.status(403).json({ status: "Forbidden" });
    }
}