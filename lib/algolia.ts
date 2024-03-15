import algoliasearch from "algoliasearch";

const client = algoliasearch("SEE8BQRW8U", "dfa09568cd93450d470b3f48c14d3ff3");
const index = client.initIndex("products");

export { index };
