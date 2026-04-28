const API_KEY="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";

async function testApi() {
    const prompt = `You are an intelligent travel planner.

Create a detailed day-wise travel plan based on the following user inputs:

Starting Location: New York
Destination: London
Total Budget: $2000
Number of Days: 2
Preferences: Sightseeing, Museums

Requirements:

1. Split the trip into day-wise itinerary.
2. For each day, include:
   - Places to visit (in logical order)
   - Nearby hotel suggestion
   - Estimated travel distance in kilometers between places
   - Approximate travel time
3. Allocate budget for:
   - Transportation
   - Accommodation
   - Food
4. Ensure total cost stays within the given budget.
5. Optimize route to reduce travel time and distance.
6. Suggest only realistic and nearby places for each day.
7. Keep the plan practical (do not overload a single day).

Output Format:

Day 1:
- Places:
- Hotel:
- Distance:
- Estimated Cost:

Day 2:
...

Final Summary:
- Total Estimated Cost
- Remaining Budget`;

    try {
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "meta/llama-3.1-70b-instruct",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1024
            })
        });
        const d = await response.json();
        if(d.choices && d.choices.length > 0) {
            console.log(d.choices[0].message.content);
        } else {
            console.log(d);
        }
    } catch (e) {
        console.error("Error:", e);
    }
}
testApi();
