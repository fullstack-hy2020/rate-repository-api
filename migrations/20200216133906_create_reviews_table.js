export function up(knex) {
  return knex.schema.createTable('reviews', (table) => {
    table.text('id').primary();
    table.text('user_id').references('users.id').onDelete('cascade');
    table
      .text('repository_id')
      .references('repositories.id')
      .onDelete('cascade');
    table.integer('rating');
    table.text('text');
    table.timestamp('created_at');
    table.timestamp('updated_at');

    table.index(['user_id', 'repository_id']);
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists('reviews');
}
