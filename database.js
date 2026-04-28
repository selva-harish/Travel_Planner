/**
 * Tamil Nadu Tourist Database
 * Now fetches data from the backend API
 */

const Database = {
    hotels: [],
    activities: [],
    restaurants: [],
    transport: [],

    init: async function () {
        console.log('Initializing Database from API...');
        
        const fetchJSON = async (url) => {
            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return await res.json();
            } catch (e) {
                console.error(`Failed to fetch ${url}:`, e);
                return []; // Return empty array on failure
            }
        };

        try {
            const isLocalFile = window.location.protocol === 'file:';
            const apiBase = isLocalFile ? 'http://localhost:3000' : ''; // Use absolute if file, relative if served
            
            const [hotels, activities, restaurants, transport] = await Promise.all([
                fetchJSON(`${apiBase}/api/hotels`),
                fetchJSON(`${apiBase}/api/activities`),
                fetchJSON(`${apiBase}/api/restaurants`),
                fetchJSON(`${apiBase}/api/transport`)
            ]);

            // If we got NO data from API and we're on file://, maybe server is down
            if (hotels.length === 0 && activities.length === 0 && isLocalFile) {
                console.warn('API unreachable on file:// protocol. Check if server is running on port 3000.');
            }

            this.hotels = hotels.length > 0 ? hotels : this.hotels;
            this.activities = activities.length > 0 ? activities : this.activities;
            this.restaurants = restaurants.length > 0 ? restaurants : this.restaurants;
            this.transport = transport.length > 0 ? transport : this.transport;

            console.log('Database loaded:', {
                hotels: this.hotels.length,
                activities: this.activities.length,
                restaurants: this.restaurants.length,
                transport: this.transport.length
            });

            // Dispatch event even if some fetches failed
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('database-ready'));
            }

        } catch (error) {
            console.error('Critical error in Database.init:', error);
            // Ensure app at least tries to render something
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('database-ready'));
            }
        }
    }
};

// Make it available globally
if (typeof window !== 'undefined') {
    window.Database = Database;
    // Auto-initialize
    Database.init();
}

// For Node environment (if needed)
if (typeof module !== 'undefined') {
    module.exports = Database;
}
