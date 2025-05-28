import axios from 'axios';

export const saveDraft = (data) => {
    console.log("save draft blog is", data);
    return axios.post('/api/blogs/save-draft', data).then(res => res.data);
}

export const publishBlog = (data) => axios.post('/api/blogs/publish', data).then(res => res.data);
export const getAllBlogs = () => axios.get('/api/blogs').then(res => res.data);
export const getBlogById = (id) => axios.get(`/api/blogs/${id}`).then(res => res.data);


// 🆕 Delete blog by ID
export const deleteBlog = (id) => {
    return axios.delete(`/api/blogs/${id}`).then(res => res.data);
}