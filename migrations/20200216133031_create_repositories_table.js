export function up(knex) {
  return knex.schema.createTable('repositories', (table) => {
    table.text('id').primary();
    table.text('name');
    table.text('owner_name');
    table.timestamp('created_at');
    table.timestamp('updated_at');

    table.index(['owner_name', 'name']);
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists('repositories');
}
