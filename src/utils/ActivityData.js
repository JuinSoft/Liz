import config from '../config/Constants.json';

/**
 * Fetches activity data for a given wallet address using the Covalent API.
 * @param {string} address - The wallet address to fetch activity data for.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of transaction objects.
 */
export const fetchActivityData = async (address) => {
    try {
        const response = await fetch(`https://api.covalenthq.com/v1/${config.chainId}/address/${address}/transactions_v2/?key=${config.api.covalent}`);
        const data = await response.json();
        return data.data; // Return the items directly for easier use in components
    } catch (error) {
        console.error("Error fetching activity data:", error);
        return []; // Return an empty array in case of error to avoid further breaks
    }
};