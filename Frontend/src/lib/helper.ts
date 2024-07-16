export function extractRepoInfo(gitUrl: string): {
    owner: string;
    repoName: string;
} {
    const trimmedUrl = gitUrl.replace("https://github.com/", "");

    const repoInfo = trimmedUrl.endsWith(".git")
        ? trimmedUrl.slice(0, -4)
        : trimmedUrl;

    const [owner, repoName] = repoInfo.split("/");

    return { owner, repoName };
}

export function formatDateTime(dateString: string) {
    const date = new Date(dateString);

    // Format date
    const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    // Format time
    const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    // Combine date and time in the desired format
    const formattedDateTime = `${formattedDate} ${formattedTime}`;

    return formattedDateTime;
}

export function getVistURL(url: string) {
    return `http://${url}.localhost:8000`;
}

export function formatDateToHoursAgo(dateString: string): string {
    if (!dateString) {
        return "Project not deployed yet";
    }
    const date = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));

    if (diffInHours < 1) {
        return "less than an hour ago";
    } else {
        return `${diffInHours} hours ago`;
    }
}
