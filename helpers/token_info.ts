import axios from "axios";
import { decrypt } from "../lib/encryption";

export default async function getVerifyTokenInfo(req: any, res: any) {
    const cookies = req.headers.cookie || "";
    const cookieObj = cookies
        ? Object.fromEntries(cookies.split("; ").map((c: any) => c.split("=")))
        : {};
    const tokenFromCookie = cookieObj["token"];
    if (!cookieObj["encrypted_id"])
        return res.status(403).json({ status: "Forbidden" });
    const user_id_decrypt = decrypt(cookieObj["encrypted_id"]);

    try {
        const isAuth = await axios.get(
            "https://api.intra.42.fr/oauth/token/info",
            {
                headers: {
                    Authorization: `Bearer ${tokenFromCookie}`,
                },
            },
        );

        // console.log("### ", isAuth.data.resource_owner_id, user_id)

        if ((req.method === "POST" || req.method === "DELETE") && req.body["allow_id"] !== user_id_decrypt)
            return res.status(403).json({ status: "Forbidden" });

        if ((req.method === "GET" || req.method === "PATH") && req.query["allow_id"] !== user_id_decrypt)
            return res.status(403).json({ status: "Forbidden" });

        if (isAuth.data?.resource_owner_id != user_id_decrypt)
            return res.status(401).json({ status: "Unauthorized", data: isAuth.data });
    } catch (e) {
        return res.status(403).json({ status: "Forbidden" });
    }
}