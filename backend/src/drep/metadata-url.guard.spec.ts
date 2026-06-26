import {
  createMetadataFetchConfig,
  getSafeMetadataUrl,
  isBlockedMetadataAddress,
  MetadataAddressResolver,
} from './metadata-url.guard';

describe('metadata URL guard', () => {
  const resolveToPublicAddress: MetadataAddressResolver = jest.fn(async () => [
    { address: '93.184.216.34', family: 4 },
  ]);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('accepts public HTTP metadata URLs', async () => {
    await expect(
      getSafeMetadataUrl(
        'https://metadata.example/cardano.json',
        resolveToPublicAddress,
      ),
    ).resolves.toBe('https://metadata.example/cardano.json');

    expect(resolveToPublicAddress).toHaveBeenCalledWith('metadata.example');
  });

  it('rejects unsupported protocols before DNS resolution', async () => {
    await expect(
      getSafeMetadataUrl('file:///etc/passwd', resolveToPublicAddress),
    ).rejects.toThrow('protocol');

    expect(resolveToPublicAddress).not.toHaveBeenCalled();
  });

  it('rejects private literal addresses before DNS resolution', async () => {
    await expect(
      getSafeMetadataUrl(
        'http://169.254.169.254/latest/meta-data',
        resolveToPublicAddress,
      ),
    ).rejects.toThrow('public address');

    expect(resolveToPublicAddress).not.toHaveBeenCalled();
  });

  it('rejects hosts that resolve to private addresses', async () => {
    await expect(
      getSafeMetadataUrl('https://metadata.example', async () => [
        { address: '10.0.0.42', family: 4 },
      ]),
    ).rejects.toThrow('public address');
  });

  it('blocks loopback and unique-local IPv6 ranges', () => {
    expect(isBlockedMetadataAddress('::1')).toBe(true);
    expect(isBlockedMetadataAddress('fd00::1')).toBe(true);
    expect(isBlockedMetadataAddress('2606:4700:4700::1111')).toBe(false);
  });

  it('disables redirects for server-side metadata fetches', () => {
    expect(createMetadataFetchConfig()).toMatchObject({
      maxRedirects: 0,
    });
  });
});
