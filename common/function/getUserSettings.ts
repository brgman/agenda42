export async function getUserSettings(userId: any): Promise<void> {
    if (!userId) return;
    try {
        const response = await fetch(`/api/settings?user_id=${userId}`, {
            method: "GET",
        });

        if (!response.ok) {
            console.log(`Failed to fetch evaluation for user ${userId}: ${response}`);
            return;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching evaluation:", error instanceof Error ? error.message : "Unknown error");
        throw error;
    }
}

export async function getUserFriends(userId: any, token: any): Promise<void> {
    if (!userId) return;
    try {
        const response = await fetch(`/api/friends?user_id=${userId}`, {
            method: "GET",
        });

        if (!response.ok) {
            console.log(`Failed to fetch evaluation for user ${userId}: ${response}`);
            return;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching evaluation:", error instanceof Error ? error.message : "Unknown error");
        throw error;
    }
}

export async function getGenderOfUser(userId: any): Promise<void> {
    if (!userId) return;
    try {
        const response = await fetch(`/api/gender?user_id=${userId}`, {
            method: "GET",
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching evaluation:", error instanceof Error ? error.message : "Unknown error");
        throw error;
    }
}

export async function getUserWavingHand(userId: any): Promise<void> {
    if (!userId) return;
    try {
        const response = await fetch(`/api/waving_hand?destinator_id=${userId}`, {
            method: "GET",
        });

        if (!response.ok) {
            console.log(`Failed to fetch evaluation for user ${userId}: ${response}`);
            return;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching evaluation:", error instanceof Error ? error.message : "Unknown error");
        throw error;
    }
}

export async function changeStatusHandler(id: any): Promise<void> {
    if (!id) return;
    try {
        const response = await fetch(`/api/waving_hand`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                status: "read",
            }),
        });

        if (!response.ok) {
            console.log(`Failed to fetch evaluation for user ${id}: ${response}`);
            return;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching evaluation:", error instanceof Error ? error.message : "Unknown error");
        throw error;
    }
}
