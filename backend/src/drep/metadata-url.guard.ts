import { lookup } from 'dns/promises';
import { isIP } from 'net';
import { AxiosRequestConfig } from 'axios';

export type ResolvedMetadataAddress = {
  address: string;
  family: number;
};

export type MetadataAddressResolver = (
  hostname: string,
) => Promise<ResolvedMetadataAddress[]>;

const METADATA_FETCH_TIMEOUT_MS = 5000;

const BLOCKED_IPV4_RANGES: Array<[number, number]> = [
  [ipv4ToInt('0.0.0.0'), 8],
  [ipv4ToInt('10.0.0.0'), 8],
  [ipv4ToInt('100.64.0.0'), 10],
  [ipv4ToInt('127.0.0.0'), 8],
  [ipv4ToInt('169.254.0.0'), 16],
  [ipv4ToInt('172.16.0.0'), 12],
  [ipv4ToInt('192.0.0.0'), 24],
  [ipv4ToInt('192.0.2.0'), 24],
  [ipv4ToInt('192.168.0.0'), 16],
  [ipv4ToInt('198.18.0.0'), 15],
  [ipv4ToInt('198.51.100.0'), 24],
  [ipv4ToInt('203.0.113.0'), 24],
  [ipv4ToInt('224.0.0.0'), 4],
  [ipv4ToInt('240.0.0.0'), 4],
];

const BLOCKED_IPV6_RANGES: Array<[number[], number]> = [
  [ipv6ToBytes('::'), 128],
  [ipv6ToBytes('::1'), 128],
  [ipv6ToBytes('::ffff:0:0'), 96],
  [ipv6ToBytes('64:ff9b::'), 96],
  [ipv6ToBytes('100::'), 64],
  [ipv6ToBytes('2001:db8::'), 32],
  [ipv6ToBytes('fc00::'), 7],
  [ipv6ToBytes('fe80::'), 10],
  [ipv6ToBytes('ff00::'), 8],
];

export function createMetadataFetchConfig(): AxiosRequestConfig {
  return {
    maxRedirects: 0,
    timeout: METADATA_FETCH_TIMEOUT_MS,
  };
}

export async function getSafeMetadataUrl(
  metadataUrl: string,
  resolver: MetadataAddressResolver = resolveMetadataAddresses,
): Promise<string> {
  const parsed = parseMetadataUrl(metadataUrl);
  const hostname = normalizeHostname(parsed.hostname);
  const hostnameFamily = isIP(hostname);

  if (hostnameFamily) {
    assertPublicMetadataAddress(hostname);
    return parsed.toString();
  }

  const addresses = await resolver(hostname);
  if (!addresses.length) throw new Error('Metadata URL host could not resolve');

  addresses.forEach(({ address }) => {
    assertPublicMetadataAddress(normalizeHostname(address));
  });

  return parsed.toString();
}

export function assertPublicMetadataAddress(address: string): void {
  if (isBlockedMetadataAddress(address)) {
    throw new Error('Metadata URL must resolve to a public address');
  }
}

export function isBlockedMetadataAddress(address: string): boolean {
  const normalizedAddress = normalizeHostname(address);
  const family = isIP(normalizedAddress);

  if (family === 4) {
    const numericAddress = ipv4ToInt(normalizedAddress);
    return BLOCKED_IPV4_RANGES.some(([rangeStart, prefixLength]) =>
      ipv4MatchesRange(numericAddress, rangeStart, prefixLength),
    );
  }

  if (family === 6) {
    const bytes = ipv6ToBytes(normalizedAddress);
    return BLOCKED_IPV6_RANGES.some(([rangeStart, prefixLength]) =>
      bytesMatchPrefix(bytes, rangeStart, prefixLength),
    );
  }

  throw new Error('Metadata URL host resolved to an invalid address');
}

function parseMetadataUrl(metadataUrl: string): URL {
  if (!metadataUrl) throw new Error('Inadequate parameters');

  let parsed: URL;
  try {
    parsed = new URL(metadataUrl);
  } catch {
    throw new Error('Metadata URL is invalid');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Metadata URL protocol is not supported');
  }

  if (!parsed.hostname) {
    throw new Error('Metadata URL host is required');
  }

  return parsed;
}

async function resolveMetadataAddresses(
  hostname: string,
): Promise<ResolvedMetadataAddress[]> {
  return lookup(hostname, { all: true, verbatim: true });
}

function normalizeHostname(hostname: string): string {
  const trimmedHostname = hostname.trim().toLowerCase();

  if (trimmedHostname.startsWith('[') && trimmedHostname.endsWith(']')) {
    return trimmedHostname.slice(1, -1);
  }

  return trimmedHostname;
}

function ipv4ToInt(address: string): number {
  const octets = address.split('.').map((octet) => Number(octet));
  if (
    octets.length !== 4 ||
    octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)
  ) {
    throw new Error('Invalid IPv4 address');
  }

  return (
    ((octets[0] << 24) >>> 0) +
    ((octets[1] << 16) >>> 0) +
    ((octets[2] << 8) >>> 0) +
    octets[3]
  );
}

function ipv4MatchesRange(
  address: number,
  rangeStart: number,
  prefixLength: number,
): boolean {
  const mask =
    prefixLength === 0 ? 0 : (0xffffffff << (32 - prefixLength)) >>> 0;
  return (address & mask) === (rangeStart & mask);
}

function ipv6ToBytes(address: string): number[] {
  const [head, tail] = address.split('::');
  const headParts = head ? parseIpv6Groups(head) : [];
  const tailParts = tail ? parseIpv6Groups(tail) : [];
  const missingGroups = 8 - headParts.length - tailParts.length;

  if (
    missingGroups < 0 ||
    (address.includes('::') &&
      address.indexOf('::') !== address.lastIndexOf('::'))
  ) {
    throw new Error('Invalid IPv6 address');
  }

  const groups = address.includes('::')
    ? [...headParts, ...Array(missingGroups).fill(0), ...tailParts]
    : headParts;

  if (groups.length !== 8) throw new Error('Invalid IPv6 address');

  return groups.flatMap((group) => [(group >> 8) & 0xff, group & 0xff]);
}

function parseIpv6Groups(segment: string): number[] {
  return segment.split(':').flatMap((group) => {
    if (group.includes('.')) {
      const numericAddress = ipv4ToInt(group);
      return [(numericAddress >>> 16) & 0xffff, numericAddress & 0xffff];
    }

    const parsedGroup = Number.parseInt(group, 16);
    if (
      !group ||
      group.length > 4 ||
      !Number.isInteger(parsedGroup) ||
      parsedGroup < 0 ||
      parsedGroup > 0xffff
    ) {
      throw new Error('Invalid IPv6 address');
    }

    return parsedGroup;
  });
}

function bytesMatchPrefix(
  bytes: number[],
  rangeStart: number[],
  prefixLength: number,
): boolean {
  const fullBytes = Math.floor(prefixLength / 8);
  const remainingBits = prefixLength % 8;

  for (let index = 0; index < fullBytes; index += 1) {
    if (bytes[index] !== rangeStart[index]) return false;
  }

  if (!remainingBits) return true;

  const mask = 0xff << (8 - remainingBits);
  return (bytes[fullBytes] & mask) === (rangeStart[fullBytes] & mask);
}
