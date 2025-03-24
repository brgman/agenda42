async function createEvaluations(nextEvaluations: EvaluationData[], chat_id: any): Promise<void> {
    if (!nextEvaluations?.length) return;

    try {
        const requests = nextEvaluations.map((evaluation) =>
            fetch("/api/next_evaluations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_event: evaluation.id,
                    begin_at: evaluation.begin_at,
                    end_at: evaluation.end_at,
                    chat_id: chat_id || "1150194983228412055",
                    location: null,
                    id_corrected: null,
                }),
            }).then(async (response) => {
                if (!response.ok) {
                    console.log(`Failed to create evaluation ${evaluation.id_event}: ${response.statusText}`);
                }
                return { id_event: evaluation.id_event, success: true };
            })
        );

        const results = await Promise.all(requests);

        results.forEach((result) => {
            if (result.success) {
                console.log(`Evaluation ${result.id_event} created successfully`);
            }
        });

    } catch (error) {
        console.error("Error creating evaluations:", error instanceof Error ? error.message : "Unknown error");
        throw error;
    }
}

export const getNextEvaluation = (evals: any, chat_id: any, events: any) => {
    // TODO: add events for notifications with other message for Discord 
    const nextEvaluations = evals.filter((i: any) => {
        if (new Date(i.begin_at) < new Date())
            return (false);
        if (i.scale_team == 'invisible')
            return (true);
        else if (i.scale_team?.id && !i.scale_team?.comment)
            return (true);
        else
            return (false);
    });

    if (nextEvaluations.length) {  // TODO: And CHAT_ID of user is exist
        createEvaluations(nextEvaluations, chat_id);
    }
    console.log("nextEvaluations", nextEvaluations);
};
