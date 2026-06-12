import * as vscode from "vscode";
import { apiSync, type SyncData } from "./api";

const TOKEN_KEY = "pytrack.accessToken";
const AI_KEY = "pytrack.aiApiKey";

let cached: SyncData | undefined;

export async function saveToken(ctx: vscode.ExtensionContext, token: string) {
  await ctx.secrets.store(TOKEN_KEY, token);
}
export async function getToken(ctx: vscode.ExtensionContext): Promise<string | undefined> {
  return ctx.secrets.get(TOKEN_KEY);
}
export async function clearToken(ctx: vscode.ExtensionContext) {
  await ctx.secrets.delete(TOKEN_KEY);
  cached = undefined;
}

export async function saveAIKey(ctx: vscode.ExtensionContext, key: string) {
  await ctx.secrets.store(AI_KEY, key);
}
export async function getAIKey(ctx: vscode.ExtensionContext): Promise<string | undefined> {
  return ctx.secrets.get(AI_KEY);
}

export function getCached(): SyncData | undefined {
  return cached;
}

export async function refresh(ctx: vscode.ExtensionContext): Promise<SyncData | undefined> {
  const token = await getToken(ctx);
  if (!token) {
    cached = undefined;
    return undefined;
  }
  cached = await apiSync(token);
  return cached;
}
