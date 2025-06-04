export type TServer = {
    id: number;
    name: string;
    host?: string;
    port?: number;
    status?: boolean
};

export type TClient = {
    id: number;
    name: string;
    serverHost?: string;
    serverPort?: number;
    status?: boolean
};