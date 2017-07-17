import { version } from '../../package.json';
import { Router } from 'express';

export default ({ config, db }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.get('/similar/:word', (req, res) => {
		res.json({result: `You searched for words similar to ${req.params.word}.`});
	});

	return api;
}
