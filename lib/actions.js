import {
  createProjectMutation,
  createUserMutation,
  deleteProjectMutation,
  getAllProjectsQuery,
  getAllProjectsPaginationQuery,
  getProjectByIdQuery,
  getProjectsOfUserQuery,
  getUserQuery,
  updateProjectMutation,
  getAllProjectsByCategoryPaginationQuery,
  getAllProjectsByCategoryQuery,
} from "../graphql";
import { GraphQLClient } from "graphql-request";

const isProduction = process.env.NODE_ENV === "production";

const apiUrl = isProduction
  ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL
  : "http://127.0.0.1:4000/graphql";

const apiKey = isProduction
  ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY
  : "dev-environment";

const serverUrl = isProduction
  ? process.env.PUBLIC_SERVER_URL
  : "http://localhost:3000";

const client = new GraphQLClient(apiUrl);

const makeGraphQLRequest = async (query, variables = {}) => {
  try {
    return await client.request(query, variables);
  } catch (error) {
    throw error;
  }
};

export const getUser = (email) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getUserQuery, { email });
};

export const createUser = (name, email, avatarUrl) => {
  client.setHeader("x-api-key", apiKey);
  const variables = {
    input: {
      name,
      email,
      avatarUrl,
    },
  };

  return makeGraphQLRequest(createUserMutation, variables);
};

export const fetchToken = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`);
    return response.json();
  } catch (error) {}
};

export const uploadImage = async (imagePath) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: "POST",
      body: JSON.stringify({ path: imagePath }),
    });
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const createNewProject = async (form, creatorId, token) => {
  const imageUrl = await uploadImage(form.image);

  if (imageUrl.url) {
    client.setHeader("Authorization", `Bearer ${token}`);

    const variables = {
      input: {
        ...form,
        image: imageUrl.url,
        createdBy: {
          link: creatorId,
        },
      },
    };

    return makeGraphQLRequest(createProjectMutation, variables);
  }
};

export const fetchAllProjects = async (endcursor) => {
  if (endcursor) {
    client.setHeader("x-api-key", apiKey);
    return makeGraphQLRequest(getAllProjectsPaginationQuery, { endcursor });
  } else {
    client.setHeader("x-api-key", apiKey);
    return makeGraphQLRequest(getAllProjectsQuery);
  }
};

export const fetchProjectsByCategory = async (category, endcursor) => {
  if (endcursor) {
    client.setHeader("x-api-key", apiKey);
    return makeGraphQLRequest(getAllProjectsByCategoryPaginationQuery, {
      category,
      endcursor,
    });
  } else {
    client.setHeader("x-api-key", apiKey);
    return makeGraphQLRequest(getAllProjectsByCategoryQuery, { category });
  }
};

export const getProjectDetails = (id) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getProjectByIdQuery, { id });
};

export const getUserProjects = (id, last = 4) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getProjectsOfUserQuery, { id, last });
};

export const deleteProject = (id, token) => {
  client.setHeader("Authorization", `Bearer ${token}`);
  return makeGraphQLRequest(deleteProjectMutation, { id });
};

export const updateProject = async (form, id, token) => {
  const isBase64DataURL = (value) => {
    const base64Regex = /^data:image\/[a-z]+;base64,/;
    return base64Regex.test(value);
  };

  let updatedForm = { ...form };

  const isUploadingNewImage = isBase64DataURL(form.image);

  if (isUploadingNewImage) {
    const imageUrl = await uploadImage(form.image);
    if (imageUrl.url) {
      updatedForm = { ...updatedForm, image: imageUrl.url };
    }
  }

  client.setHeader("Authorization", `Bearer ${token}`);

  const variables = {
    id: id,
    input: updatedForm,
  };

  return makeGraphQLRequest(updateProjectMutation, variables);
};
