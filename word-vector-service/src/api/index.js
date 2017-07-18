import { version } from '../../package.json';
import { Router } from 'express';

import { findSimiliar } from '../models/vector_funcs';

export default ({ config, db }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.get('/similar/:word', (req, res) => {
		res.json({
			message: `You searched for words similar to ${req.params.word}.`,
			result: findSimiliar(req.params.word)
		});
	});

	return api;
}
