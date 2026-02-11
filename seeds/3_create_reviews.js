const oneHour = 1000 * 60 * 60;

const createDateColumns = (date) => ({
  created_at: date,
  updated_at: date,
});

const loremIpsum =
  'Lorem ipsum dolor sit amet, per brute apeirian ei. Malis facilisis vel ex, ex vivendo signiferumque nam, nam ad natum electram constituto. Causae latine at sea, ex nec ullum ceteros, est ut dicant splendide. Omnis electram ullamcorper est ut.';

const kalleId = 'bbe42984-051b-4a01-b45d-b8d29c32200c';
const elinaId = 'cff8872a-8ff5-4092-ac2f-d79e65f18aa2';
const mattiId = '1b10e4d8-57ee-4d00-8886-e4a049d7ff8f';
const johndoeId = '9b9d927e-2ee9-4f93-b96b-c8f677c63a5f';
const leeroyjenkinsId = '753f3e99-e73a-43a3-9a50-b30d7727c0eb';

const formikId = 'jaredpalmer.formik';
const reactAsyncId = 'async-library.react-async';
const railsId = 'rails.rails';
const djangoId = 'django.django';

const createReviewId = (userId, repositoryId) =>
  [userId, repositoryId].join('.');

const createIdColumns = (userId, repositoryId) => ({
  id: createReviewId(userId, repositoryId),
  user_id: userId,
  repository_id: repositoryId,
});

export const seed = async (knex) => {
  await knex('reviews').del();

  await knex('reviews').insert([
    // kalle's reviews
    {
      rating: 95,
      text: loremIpsum,
      ...createIdColumns(kalleId, formikId),
      ...createDateColumns(new Date(Date.now() - oneHour)),
    },
    {
      rating: 85,
      text: loremIpsum,
      ...createIdColumns(kalleId, reactAsyncId),
      ...createDateColumns(new Date(Date.now() - oneHour)),
    },
    {
      rating: 99,
      text: loremIpsum,
      ...createIdColumns(kalleId, railsId),
      ...createDateColumns(new Date(Date.now() - oneHour)),
    },
    {
      rating: 78,
      text: loremIpsum,
      ...createIdColumns(kalleId, djangoId),
      ...createDateColumns(new Date(Date.now() - oneHour)),
    },
    // matti's reviews
    {
      rating: 70,
      text: loremIpsum,
      ...createIdColumns(mattiId, formikId),
      ...createDateColumns(new Date(Date.now() - 2 * oneHour)),
    },
    {
      rating: 55,
      text: loremIpsum,
      ...createIdColumns(mattiId, reactAsyncId),
      ...createDateColumns(new Date(Date.now() - 2 * oneHour)),
    },
    {
      rating: 100,
      text: loremIpsum,
      ...createIdColumns(mattiId, railsId),
      ...createDateColumns(new Date(Date.now() - 2 * oneHour)),
    },
    {
      rating: 67,
      text: loremIpsum,
      ...createIdColumns(mattiId, djangoId),
      ...createDateColumns(new Date(Date.now() - 2 * oneHour)),
    },
    // elina's reviews
    {
      rating: 75,
      text: loremIpsum,
      ...createIdColumns(elinaId, reactAsyncId),
      ...createDateColumns(new Date(Date.now() - 3 * oneHour)),
    },
    {
      rating: 100,
      text: loremIpsum,
      ...createIdColumns(elinaId, formikId),
      ...createDateColumns(new Date(Date.now() - 3 * oneHour)),
    },
    // johndoe's reviews
    {
      rating: 89,
      text: loremIpsum,
      ...createIdColumns(johndoeId, formikId),
      ...createDateColumns(new Date(Date.now() - 4 * oneHour)),
    },
    // leeroyjenkins' reviews
    {
      rating: 96,
      text: loremIpsum,
      ...createIdColumns(leeroyjenkinsId, formikId),
      ...createDateColumns(new Date(Date.now() - 5 * oneHour)),
    },
  ]);
};
