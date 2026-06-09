const handleAiSuggestion = async (title,content) => {
    try {
        const response = await fetch("http://localhost:5000/api/suggestion",
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