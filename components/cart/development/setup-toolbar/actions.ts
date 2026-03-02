"use server";

// Setup actions no longer needed since we removed SFCC integration
export async function checkEnvironmentVariables(): Promise<{
  envs: any[];
  allValid: boolean;
}> {
  return {
    envs: [],
    allValid: true,
  };
}
