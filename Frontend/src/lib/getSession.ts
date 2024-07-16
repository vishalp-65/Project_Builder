import axiosInstance from "@/config/axiosInstance";

export function getSession() {
    // Get all cookies as a string
    const cookiesString = document.cookie;

    // Parse the cookies string into an object
    const cookiesArray = cookiesString?.split(";");

    const cookies: { [Key: string]: string } = {};
    cookiesArray?.forEach((cookie) => {
        const [name, value] = cookie?.trim()?.split("=");
        cookies[name] = value;
    });

    return cookies?.__clerk_db_jwt ? true : false;
}

export function removeSession() {
    document.cookie = "";
    localStorage.clear();
}

export function getToken() {
    let token = localStorage.getItem("vercel_token");
    token = token ? token.replace(/^"|"$/g, "") : null;

    return token;
}

export async function getCurrUser(token: string | null) {
    if (!token) {
        return false;
    }

    try {
        const response = await axiosInstance.get("auth/getUserByToken", {
            headers: {
                Authorisation: token,
            },
        });

        return response.data.data;
    } catch (error) {
        console.log("error while getting users", error);
        return null;
    }
}
