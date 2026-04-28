const testChat = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: [
                    { role: "user", content: "Plan a 3 day trip to Ooty with 50000 budget." }
                ]
            })
        });

        const data = await response.json();
        console.log("Chat Response:", JSON.stringify(data, null, 2));
        process.exit(0);
    } catch (error) {
        console.error("Test Error:", error);
        process.exit(1);
    }
};

testChat();
