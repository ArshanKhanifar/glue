export const endpointAbi = <const>[
	{
		inputs: [],
		name: "defaultReceiveLibraryAddress",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},

	{
		inputs: [
			{
				internalType: "uint16",
				name: "_sjcChainId",
				type: "uint16"
			},
			{
				internalType: "bytes",
				name: "_srcAddress",
				type: "bytes"
			}
		],
		name: "getInboundNonce",
		outputs: [
			{
				internalType: "uint64",
				name: "",
				type: "uint64"
			}
		],
		stateMutability: "view",
		type: "function"
	},

	{
		inputs: [
			{
				internalType: "uint16",
				name: "_srcChainId",
				type: "uint16"
			},
			{
				internalType: "bytes",
				name: "_srcAddress",
				type: "bytes"
			},
			{
				internalType: "address",
				name: "_dstAddress",
				type: "address"
			},
			{
				internalType: "uint64",
				name: "_nonce",
				type: "uint64"
			},
			{
				internalType: "uint256",
				name: "_gasLimit",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "_payload",
				type: "bytes"
			}
		],
		name: "receivePayload",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	}
];
export const routerAbi = <const>[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "msgType",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint16",
				"name": "_srcChainId",
				"type": "uint16"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "payload",
				"type": "bytes"
			}
		],
		"name": "ReceivedDecentEth",
		"type": "event"
	},
];

export const packetAbi = <const>[
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "bytes",
				name: "payload",
				type: "bytes"
			}
		],
		name: "Packet",
		type: "event"
	}
];
