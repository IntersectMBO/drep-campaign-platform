export const getDRepDelegatorsCountQuery: string = `
  WITH latest_delegations AS (
    SELECT 
      dv.addr_id,
      MAX(b.time) as latest_time
    FROM 
      delegation_vote dv
    JOIN 
      tx ON dv.tx_id = tx.id
    JOIN 
      block b ON tx.block_id = b.id
    GROUP BY 
      dv.addr_id
  )
  SELECT 
    COUNT(DISTINCT sa.view) AS delegators_count
  FROM 
    drep_hash AS dh
  JOIN 
    delegation_vote AS dv ON dh.id = dv.drep_hash_id
  JOIN 
    stake_address sa ON dv.addr_id = sa.id
  JOIN 
    tx ON dv.tx_id = tx.id
  JOIN 
    block b ON tx.block_id = b.id
  JOIN 
    latest_delegations ld ON dv.addr_id = ld.addr_id AND b.time = ld.latest_time
  WHERE 
    dh.view = $1
`;

export const getDRepVotesCountQuery: string = `
  SELECT 
      COUNT(vp.id) AS vote_count
  FROM 
      drep_hash AS dh
  JOIN 
      voting_procedure AS vp ON dh.id = vp.drep_voter
  WHERE 
      dh.view = $1
`;

export const getDRepVotingPowerQuery: string = `
  SELECT
     dd.amount AS voting_power
   FROM
     drep_hash AS dh
   JOIN
     drep_distr AS dd ON dd.hash_id = dh.id
   WHERE
     dh.view = $1
   ORDER BY
     dd.epoch_no DESC
   LIMIT 1
`;
