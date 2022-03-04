import axios from 'axios';
import { TeamMeta, ProjectMeta, ReleaseMeta } from '../index';
import { StorageAPI } from './index';

export class Pinata implements StorageAPI {
	jwt: string;
	gateway: string;

	constructor(jwt: string, gateway: string = 'https://gateway.valist.io') {
		this.jwt = jwt;
		this.gateway = gateway;
	}

	async writeJSON(data: string): Promise<string> {
		const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
		const res = await fetch(url, { 
			method: 'POST',
			body: data,
			headers: {
				'Authorization': `Bearer ${this.jwt}`,
				'Content-Type': 'application/json',
			}
		}).then(res => res.json());

		return `${this.gateway}/ipfs/${res.data.IpfsHash}`;
	}

	async writeFile(data: File): Promise<string> {
		const form = new FormData();
		form.append('file', data);
		
		const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
		const res = await axios.post(url, form, {
			maxBodyLength: Infinity,
			headers: {'Authorization': `Bearer ${this.jwt}`}
		});

		return `${this.gateway}/ipfs/${res.data.IpfsHash}`;
	}

	async writeFolder(data: File[]): Promise<string> {
		const form = new FormData();
		data.forEach(file => form.append('file', file));

		const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
		const res = await axios.post(url, form, { 
			maxBodyLength: Infinity,
			headers: {'Authorization': `Bearer ${this.jwt}`}
		});

		return `${this.gateway}/ipfs/${res.data.IpfsHash}`;
	}
}

/**
 * Creates the default Pinata storage provider.
 */
export function createPinata(jwt: string, gateway: string): StorageAPI {
	return new Pinata(jwt, gateway);
}