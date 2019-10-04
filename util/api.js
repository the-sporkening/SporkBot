const axios = require('axios');

class API {

	constructor({ url }) {
		this.url = url;
		this.endpoints = {};
	}

	createEntity(entity) {
		this.endpoints[entity.name] = this.createBasicCRUDEndpoints(entity);
	}

	createEntities(arrayOfEntity) {
		arrayOfEntity.forEach(this.createEntity.bind(this));
	}

	createBasicCRUDEndpoints({ name }) {
		const endpoints = {};
		const resourceURL = `${this.url}/${name}`;

		endpoints.getAll = ({ params = {} }, config = {}) => axios.get(resourceURL, { params }, config);
		endpoints.getOne = ({ id }, config = {}) => axios.get(`${resourceURL}/${id}`, config);
		endpoints.create = (toCreate, config = {}) => axios.post(resourceURL, toCreate, config);
		endpoints.update = (toUpdate, config = {}) => axios.put(`${resourceURL}/${toUpdate.id}`, toUpdate, config);
		endpoints.patch = ({ id }, toPatch, config = {}) => axios.patch(`${resourceURL}/${id}`, toPatch, config);
		endpoints.delete = ({ id }, config = {}) => axios.delete(`${resourceURL}/${id}`, config);

		return endpoints;

	}
}
module.exports = API;