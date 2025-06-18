export const getTimeLeft = (endTime) => {
    const now = new Date();
    const targetTime = new Date(endTime);
    const diffMs = targetTime - now;

    if (diffMs <= 0) return "Time Over";

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
};
