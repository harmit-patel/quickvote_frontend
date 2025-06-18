export const fetchSurveysByAdmin = async (email, token, setAdmin, setCreatedSurveys) => { 
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/surveys/fetch-by-admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ adminEmail: email }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch surveys");
        }

        const data = await response.json();
        setAdmin(data.admin);
        setCreatedSurveys(data.createdSurveys);
        console.log("API Returned Admin Role:", data.admin.role);

    } catch (error) {
        console.error("Error fetching surveys:", error);
    }
};


export const deleteSurvey = async (surveyId, token) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/surveys/${surveyId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to delete survey");
        }

        return true;
    } catch (error) {
        console.error("Error deleting survey:", error);
        return false;
    }
};

