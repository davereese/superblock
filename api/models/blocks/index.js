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
  const userId = request.userId;

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

module.exports = {
  name: name,
  createTable: createTable,
  create: create,
}