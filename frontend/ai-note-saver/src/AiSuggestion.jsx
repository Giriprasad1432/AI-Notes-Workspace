import { vite_api_url } from "./config";

const handleAiSuggestion = async (title,content) => {
    try {
        const response = await fetch(`${vite_api_url}/api/suggestion`,
            {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({title,content})
            })
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

export default handleAiSuggestion;