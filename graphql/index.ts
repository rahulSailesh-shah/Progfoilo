export const getUserQuery = `
query GetUser($email: String!){
    user(by: {email: $email}){
        id
        name
        email
        avatarUrl
        description
        githubUrl
        linkedinUrl
    }
}
`;

export const createUserMutation = `
mutation UserCreate($input: UserCreateInput!){
    userCreate(input: $input){
        name
        email
        avatarUrl
        description
        githubUrl
        linkedinUrl
    }
}

`;
