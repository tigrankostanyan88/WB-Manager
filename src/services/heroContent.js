const HeroContentRepository = require('../repositories/heroContent');

class HeroContentService {
    constructor() {
        this.repository = new HeroContentRepository();
    }

    async get() {
        return await this.repository.get();
    }

    async upsert(data) {
        return await this.repository.upsert(data);
    }

    async delete() {
        return await this.repository.delete();
    }
}

module.exports = HeroContentService;
