'use strict';

const { pgclient } = require('./client');

const TIME_WINDOW = `
  WITH bounds AS (SELECT make_date($1, $2, 1) AS start_date, (make_date($1, $2, 1) + INTERVAL '1 month')::date AS end_date),
  filtered_sales AS (SELECT s.* FROM public.sales s JOIN bounds b ON s.date >= b.start_date AND s.date < b.end_date)
`;

async function getUsersData(year, month) {
  const sql = `
    ${TIME_WINDOW},
    user_sales AS (
      SELECT
        fs.user_id,
        AVG(fs.amount)::numeric(12,2) AS avg_revenue,
        SUM(fs.amount)::numeric(12,2) AS total_revenue,
        COUNT(*)                      AS num_sales
      FROM filtered_sales fs
      GROUP BY fs.user_id
    ),
    user_groups_agg AS (
      SELECT
        ug.user_id,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', g.id, 'name', g.name))
          FILTER (WHERE g.id IS NOT NULL),
          '[]'::json
        ) AS groups
      FROM public.user_groups ug
      JOIN public.groups g ON g.id = ug.group_id
      GROUP BY ug.user_id
    )
    SELECT
      u.id   AS user_id,
      u.name AS user_name,
      us.avg_revenue,
      us.total_revenue,
      us.num_sales,
      COALESCE(uga.groups, '[]'::json) AS groups
    FROM user_sales us
    JOIN public.users u ON u.id = us.user_id
    LEFT JOIN user_groups_agg uga ON uga.user_id = us.user_id
    ORDER BY u.id ASC
  `;

  const params = [year, month];

  const { rows } = await pgclient.query(sql, params);

  return rows;
}

async function getGroupsData(year, month) {
  const sql = `
    ${TIME_WINDOW}
    SELECT
      g.id   AS group_id,
      g.name AS group_name,
      AVG(fs.amount)::numeric(12,2) AS avg_revenue,
      SUM(fs.amount)::numeric(12,2) AS total_revenue,
      COUNT(*)                      AS num_sales,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', u.id, 'name', u.name))
        FILTER (WHERE u.id IS NOT NULL),
        '[]'::json
      ) AS users
    FROM filtered_sales fs
    JOIN public.user_groups ug ON ug.user_id = fs.user_id
    JOIN public.groups g       ON g.id = ug.group_id
    JOIN public.users u        ON u.id = fs.user_id
    GROUP BY g.id, g.name
    ORDER BY g.id ASC
  `;

  const params = [year, month];

  const { rows } = await pgclient.query(sql, params);

  return rows;
}

const getUsersAndGroups = async function(year, month) {
  const usersData = await getUsersData(year, month);
  const groupsData = await getGroupsData(year, month);

  return { usersData, groupsData };
};

const getUsers = async function(year, month) {
  const usersData = await getUsersData(year, month);

  return { usersData };
};

const getGroups = async function(year, month) {
  const groupsData = await getGroupsData(year, month);

  return { groupsData };
};

module.exports = { 
  getUsersAndGroups,
  getUsers,
  getGroups
};
