const oneHour = 1000 * 60 * 60;

const createDateColumns = (date) => ({
  created_at: date,
  updated_at: date,
});

// Super secret password is "password"
const password = '$2b$10$i6OAqjuT7noL/PrsctZQ7O8FkrZ1Ml9RBHx2ro9PY3hqa2OcW5Ah2';

const commonColumns = {
  password,
};

export const seed = async (knex) => {
  await knex('users').del();

  await knex('users').insert([
    {
      id: 'bbe42984-051b-4a01-b45d-b8d29c32200c',
      username: 'kalle',
      ...commonColumns,
      ...createDateColumns(new Date(Date.now() - oneHour)),
    },
    {
      id: 'cff8872a-8ff5-4092-ac2f-d79e65f18aa2',
      username: 'elina',
      ...commonColumns,
      ...createDateColumns(new Date(Date.now() - 2 * oneHour)),
    },
    {
      id: '1b10e4d8-57ee-4d00-8886-e4a049d7ff8f',
      username: 'matti',
      ...commonColumns,
      ...createDateColumns(new Date(Date.now() - 3 * oneHour)),
    },
    {
      id: '9b9d927e-2ee9-4f93-b96b-c8f677c63a5f',
      username: 'johndoe',
      ...commonColumns,
      ...createDateColumns(new Date(Date.now() - 4 * oneHour)),
    },
    {
      id: '753f3e99-e73a-43a3-9a50-b30d7727c0eb',
      username: 'leeroyjenkins',
      ...commonColumns,
      ...createDateColumns(new Date(Date.now() - 5 * oneHour)),
    },
  ]);
};
