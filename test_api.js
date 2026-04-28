const API_KEY = "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";

async function testApi() {
    try {
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "meta/llama-3.1-70b-instruct",
                messages: [{ role: "user", content: "Say hello!" }],
                max_tokens: 50
            })
        });
        const d = await response.json();
        console.log("Success:", JSON.stringify(d, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}
testApi();
