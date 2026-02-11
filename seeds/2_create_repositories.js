const oneHour = 1000 * 60 * 60;

const createDateColumns = (date) => ({
  created_at: date,
  updated_at: date,
});

const createColumns = (ownerName, repositoryName) => ({
  id: `${ownerName}.${repositoryName}`,
  owner_name: ownerName,
  name: repositoryName,
});

export const seed = async (knex) => {
  await knex('repositories').del();

  await knex('repositories').insert([
    {
      ...createColumns('jaredpalmer', 'formik'),
      ...createDateColumns(new Date(Date.now() - oneHour)),
    },
    {
      ...createColumns('async-library', 'react-async'),
      ...createDateColumns(new Date(Date.now() - 2 * oneHour)),
    },
    {
      ...createColumns('rzwitserloot', 'lombok'),
      ...createDateColumns(new Date(Date.now() - 3 * oneHour)),
    },
    {
      ...createColumns('rails', 'rails'),
      ...createDateColumns(new Date(Date.now() - 4 * oneHour)),
    },
    {
      ...createColumns('django', 'django'),
      ...createDateColumns(new Date(Date.now() - 5 * oneHour)),
    },
    {
      ...createColumns('apollographql', 'apollo-client'),
      ...createDateColumns(new Date(Date.now() - 6 * oneHour)),
    },
    {
      ...createColumns('reduxjs', 'redux'),
      ...createDateColumns(new Date(Date.now() - 7 * oneHour)),
    },
    {
      ...createColumns('spring-projects', 'spring-framework'),
      ...createDateColumns(new Date(Date.now() - 8 * oneHour)),
    },
    {
      ...createColumns('zeit', 'next.js'),
      ...createDateColumns(new Date(Date.now() - 9 * oneHour)),
    },
    {
      ...createColumns('zeit', 'swr'),
      ...createDateColumns(new Date(Date.now() - 10 * oneHour)),
    },
  ]);
};
