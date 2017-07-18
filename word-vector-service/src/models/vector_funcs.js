import vectors from './words25k';
/*
const vectors = {
	"a": [9, .1, .1],
	"b": [.1, 9, .1],
	"c": [.1, .1, 9],
	"d": [9, 9, .1],
	"e": [9, .1, 9],
	"f": [.1, 9, 9],
	"z": [8, .2, 8], // "close" to "e"
};
*/

export const findSimiliar = (word, threshold = 0.6, maxResults = 25) => {
	if (!(word in vectors)) { return []; }

	let results = [];
	for (let candidate of Object.keys(vectors)) {
		if (candidate == word) { continue; }

		const similarity = cosineSimilarity(vectors[word], vectors[candidate]);
		if (similarity < threshold) { continue; }

		results.push({word: candidate, similarity});
	}

	return results.sort((a, b) => b.similarity - a.similarity).slice(0, maxResults);
}

const dotProduct = (a, b) => {
	if (!Array.isArray(a) || !Array.isArray(b) || a.length != b.length) {
		throw 'invalid arguments';
	}
	const zippedVectors  = a.map((x, idx) => [x, b[idx]]);
	const products = zippedVectors.map(x => x[0] * x[1]);
	return products.reduce((acc, x) => acc + x, 0);
}

const magnitude = a => Math.sqrt(dotProduct(a, a));

const cosineSimilarity = (a, b) => dotProduct(a, b) / (magnitude(a) * magnitude(b));
