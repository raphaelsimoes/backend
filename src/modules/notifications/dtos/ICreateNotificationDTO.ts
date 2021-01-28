import { getDayOfYear } from "date-fns";

export default interface ICreateNotificationDTO {
    content: string;
    recipient_id: string;
}