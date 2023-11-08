import axios from 'axios';

export async function getIPAddress(): Promise<string> {
	const { data } = await axios.get('https://checkip.amazonaws.com');
	return data.trim();
}
