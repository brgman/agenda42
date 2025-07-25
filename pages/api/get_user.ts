import axios from "axios";

export default async function handler(req: any, res: any) {
    const { id, filter } = req.query;
    const cookies = req.headers.cookie || "";
    const cookieObj = cookies
        ? Object.fromEntries(cookies.split("; ").map((c: any) => c.split("=")))
        : {};
    const tokenFromCookie = cookieObj["token"];
    const uri = "https://api.intra.42.fr/v2/users" + (id ? `/${id}` : `?filter[id]=${filter}`);
    console.log("uri", uri);
    try {
        const response = await axios.get(
            uri,
            {
                headers: {
                    Authorization: `Bearer ${tokenFromCookie}`,
                },
            },
        );
        res.status(200).json(response.data);
    } catch (error: any) {
        console.log(error);
        res.status(error.response?.status || 500).json({ message: error });
    }
}
