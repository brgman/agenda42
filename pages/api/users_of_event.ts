import axios from "axios";

export default async function handler(req: any, res: any) {
    const { id, page } = req.query;
    const cookies = req.headers.cookie || "";
    const cookieObj = cookies
        ? Object.fromEntries(cookies.split("; ").map((c: any) => c.split("=")))
        : {};
    const tokenFromCookie = cookieObj["token"];
    const uri = "https://api.intra.42.fr/v2/events/" + id + `/events_users?page[number]=${page}`;

    try {
        const response = await axios.get(
            uri,
            {
                headers: {
                    Authorization: `Bearer ${tokenFromCookie}`,
                },
            },
        );
        res.status(200).json({
            data: response.data,
            links: response.headers.link
        });
    } catch (error: any) {
        console.log(error);
        res.status(error.response?.status || 500).json({ message: error });
    }
}
