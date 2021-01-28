export default interface IStorageProvider {
    saveFile(filepath: string): Promise<string>;
    deleteFile(filepath: string): Promise<void>;
}