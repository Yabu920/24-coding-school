export type NotificationItem = {
    id: string;
    type: "message"| "announcement";
    title: string;
    senderName?: string | null;
    time: string; // ISO date string 
    read?: boolean;
}