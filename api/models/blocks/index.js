const knex = require('../../services/knex');

const name = 'blocks';

const columns = [
  'title',
  'content',
  'language',
  'tags',
  'dateCreated',
  'dateEdited',
];

const createTable = (schema) => {
  schema.increments();
  schema.string('title');
  schema.text('content', ['longtext']);
  schema.string('language');
  schema.specificType('tags', 'text ARRAY');
  schema.dateTime('dateCreated');
  schema.dateTime('dateEdited');
};

const create = async (request) => {
  const title = request.title;
  const content = request.content;
  const language = request.language;
  const tags = request.tags;

  try {
    // create block object
    const block = {
      title: title,
      content: content,
      language: language,
      tags: tags,
      dateCreated: new Date(),
    };
    
    // save block to db
    const newBlock = await knex(name)
      .insert(block)
      .returning(['id', 'title', 'content', 'language', 'tags', 'dateCreated']);

    return newBlock[0];
  } catch (error) {
    return error;
  }
};

const get = async (blockId) => {
  try {
    const block = await knex(name)
      .where('id', blockId);

    return block;
  } catch (error) {
    return error;
  }
};

const update = async (blockId, requestBody) => {
  let payload = {};
  
  // copy valid user fields from request body
  Object.keys(requestBody).forEach(key => {
    if (columns.includes(key)) {
      payload[key] = requestBody[key];
    }
  });
  
  // update user in db
  try {
    return await knex(name).where({id: blockId}).update(payload);
  } catch (error) {
    throw error;
  }
};

const deleteBlock = async (blockId) => {
  try {
    return await knex(name).where({id: blockId}).del();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  name: name,
  createTable: createTable,
  create: create,
  get: get,
  update: update,
  delete: deleteBlock,
}