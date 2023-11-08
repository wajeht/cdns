import axios from 'axios';
import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { getIPAddress } from './get-ip-address';

vi.mock('axios');

describe('getIPAddress ', () => {
	it('should call axios and get ip address', async () => {
		(axios.get as MockedFunction<typeof axios.get>).mockResolvedValue({ data: '27.0.0.1' });
		const address = await getIPAddress();
		expect(address).toBe('27.0.0.1');
	});
});
