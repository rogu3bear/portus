export interface DomainMapping {
  id: number;
  domain: string;
  aliases: string[];
  path: string;
  ip: string;
  port: number;
}

export function validateDomainSyntax(domain: string): boolean {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}

export function validateIpReachable(_ip: string): Promise<boolean> {
  // In a real implementation we would ping the IP. Here we resolve true after a short delay.
  return new Promise((resolve) => setTimeout(() => resolve(true), 10));
}

export function validatePortClash(port: number, used: number[]): boolean {
  return !used.includes(port);
}

export function validatePathOverlap(path: string, used: string[]): boolean {
  return !used.includes(path);
}
