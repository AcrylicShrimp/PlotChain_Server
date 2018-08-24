
'use strict';

const web3 = require('web3');
const tx   = require('ethereumjs-tx');

const address         = '0x905e41794ba8b27dd4e87426ebf2d903c03a2501';
const abi             = [{ constant: !0, inputs: [], name: 'totalHeart', outputs: [{ name: '', type: 'uint256' }], payable: !1, stateMutability: 'view', type: 'function' }, { constant: !0, inputs: [{ name: '', type: 'uint64' }], name: 'novelHeart', outputs: [{ name: '', type: 'uint64' }], payable: !1, stateMutability: 'view', type: 'function' }, { inputs: [], payable: !1, stateMutability: 'nonpayable', type: 'constructor' }, { anonymous: !1, inputs: [{ indexed: !1, name: 'novel', type: 'uint64' }, { indexed: !1, name: 'novelHeart', type: 'uint64' }, { indexed: !1, name: 'totalHeart', type: 'uint256' }], name: 'HeartChanged', type: 'event' }, { constant: !1, inputs: [{ name: 'novel', type: 'uint64' }, { name: 'heart', type: 'uint64' }], name: 'setHeart', outputs: [], payable: !1, stateMutability: 'nonpayable', type: 'function' }];
const contract        = new web3Instance.eth.Contract(abi, contractAddress);

module.exports = (novel, heart) => {
	web3Instance.eth.getTransactionCount(address).then(count => {
		var transaction = new tx({
			'from'    : address,
			'to'      : contractAddress,
			'value'   : '0x0',
			'data'    : contract.methods.setHeart(novel, heart).encodeABI(),
			'nonce'   : web3Instance.utils.toHex(count),
			'gasPrice': web3Instance.utils.toHex(10 * 1e9),
			'gasLimit': web3Instance.utils.toHex(7000000),
		});

		transaction.sign(privateKey);
		
		web3Instance.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
	});
};