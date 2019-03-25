import axios from 'axios';

const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const authHeaders = {'authorization': currentUser ? currentUser.token : null};

export const queryBlock = async function(blockId) {
  try {
    const response = await axios.get(`http://localhost:4000/api/blocks/${blockId}`, {
      headers: authHeaders,
    });
    const data = response.data[0];
    return data;
  } catch (error) {
    console.error(error);
    return {error};
  }
}

export const saveBlock = async function(state) {
  try {
    const response = await axios.post(`http://localhost:4000/api/blocks/`, {
      content: state.content,
      title: state.title,
      language: state.language,
      tags: state.tags,
    },{
      headers: authHeaders
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return {error};
  }
}

export const updateBlock = async function(blockId, state) {
  try {
    await axios.put(`http://localhost:4000/api/blocks/${blockId}`, {
      content: state.content,
      title: state.title,
      language: state.language,
      tags: state.tags,
    },{
      headers: authHeaders
    });
  } catch (error) {
    console.error(error);
    return {error};
  }
}

export const deleteBlock = async function(blockId) {
  try {
    await axios.delete(`http://localhost:4000/api/blocks/${blockId}`, {
      headers: this.authHeaders
    });
  } catch (error) {
    console.error(error);
  }
}