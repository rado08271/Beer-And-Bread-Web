export default interface INotification {
    message: string,
    type: "success" | "error" | "info" | "warning" | "default"
    ttl: number,
    title?: string
}